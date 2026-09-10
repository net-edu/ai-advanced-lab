#!/usr/bin/env python3
"""GitHub Pages 문서 파이프라인.

content/ 의 Markdown 과 toc.yml, site.yml 을 읽어 MkDocs 설정을 생성하고
빌드/미리보기/배포까지 수행한다. 진입점은 저장소 루트의 `pipeline` 스크립트이며,
이 파일을 직접 실행해도 동일하게 동작한다.
"""

from __future__ import annotations

import argparse
import functools
import hashlib
import http.server
import json
import re
import shutil
import socketserver
import subprocess
import sys
import threading
import time
import urllib.parse
import webbrowser
from pathlib import Path

import yaml


class _PyNameTag(str):
    """PyYAML 이 `!!python/name:...` 태그로 그대로 방출해야 하는 값의 표시자.

    mkdocs.yml 의 pymdownx.superfences custom_fences 설정은 이 태그로 실제
    파이썬 콜러블을 가리켜야 하므로, yaml.safe_dump 가 평범한 문자열로
    따옴표를 씌우지 않도록 전용 표현자를 등록해 둔다.
    """


def _represent_py_name_tag(dumper: yaml.Dumper, data: "_PyNameTag") -> yaml.Node:
    return yaml.ScalarNode(tag=f"tag:yaml.org,2002:python/name:{data}", value="")


yaml.SafeDumper.add_representer(_PyNameTag, _represent_py_name_tag)


class _PyApplyTag:
    """PyYAML 이 `!!python/object/apply:...` 태그로 그대로 방출해야 하는 값의 표시자.

    mkdocs.yml 의 toc.slugify 는 함수 이름만으로는 부족하다 - 옵션(`case` 등)을
    쥔 채로 호출된 결과(클로저)가 필요하다. `!!python/name:` 은 함수를 그대로
    가리킬 뿐 호출하지 않으므로, 호출까지 흉내 내는 이 태그를 쓴다.
    """

    def __init__(self, path: str, **kwds: object) -> None:
        self.path = path
        self.kwds = kwds


def _represent_py_apply_tag(dumper: yaml.Dumper, data: "_PyApplyTag") -> yaml.Node:
    return dumper.represent_mapping(
        f"tag:yaml.org,2002:python/object/apply:{data.path}", {"kwds": data.kwds}
    )


yaml.SafeDumper.add_representer(_PyApplyTag, _represent_py_apply_tag)


ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
THEME = ROOT / "theme"
BUILD = ROOT / ".build"
SRC = BUILD / "src"
SITE = BUILD / "site"
MKDOCS_YML = BUILD / "mkdocs.yml"
SITE_YML = ROOT / "site.yml"
TOC_YML = CONTENT / "toc.yml"
FINALIZED_MD = ROOT / "FINALIZED.md"

PLACEHOLDER_URLS = ("", "https://example.com/", "https://example.com")
LOCK_HEADER = "## 잠긴 파일"
WIP_PREFIX = "(WIP) "


# --------------------------------------------------------------------------
# 출력 헬퍼
# --------------------------------------------------------------------------


class Reporter:
    """경고를 모아두었다가 마지막에 한 번 더 요약해 주는 출력기."""

    def __init__(self) -> None:
        self.warnings: list[str] = []

    def info(self, message: str) -> None:
        print(message, flush=True)

    def step(self, message: str) -> None:
        print(f"\n▶ {message}", flush=True)

    def ok(self, message: str) -> None:
        print(f"  ✓ {message}", flush=True)

    def warn(self, message: str) -> None:
        self.warnings.append(message)
        print(f"  ! {message}", flush=True)

    def error(self, message: str) -> None:
        sys.stdout.flush()
        print(f"\n✗ {message}", file=sys.stderr)

    def summarize(self) -> None:
        if not self.warnings:
            return
        print(f"\n경고 {len(self.warnings)}건:")
        for item in self.warnings:
            print(f"  - {item}", flush=True)


class PipelineError(Exception):
    """사용자가 고쳐야 하는 오류. 스택 트레이스 없이 메시지만 출력한다."""


# --------------------------------------------------------------------------
# 설정 로딩
# --------------------------------------------------------------------------


def load_yaml(path: Path, *, required: bool = True):
    if not path.exists():
        if required:
            raise PipelineError(f"{path.relative_to(ROOT)} 파일이 없습니다.")
        return None
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise PipelineError(
            f"{path.relative_to(ROOT)} 을 읽을 수 없습니다 (YAML 오류):\n{exc}"
        ) from exc


def load_site() -> dict:
    data = load_yaml(SITE_YML) or {}
    if not isinstance(data, dict):
        raise PipelineError("site.yml 의 최상위는 매핑(키: 값) 이어야 합니다.")
    if not data.get("site_name"):
        raise PipelineError("site.yml 에 site_name 이 필요합니다.")
    switcher_enabled = data.get("service_switcher_enabled", True)
    if not isinstance(switcher_enabled, bool):
        raise PipelineError("site.yml 의 service_switcher_enabled 는 true 또는 false 여야 합니다.")
    return data


# --------------------------------------------------------------------------
# 목차(nav) 구성
# --------------------------------------------------------------------------


def content_markdown_files() -> list[str]:
    """content/ 안의 모든 .md 를 content 기준 상대 경로로 반환."""
    return sorted(
        p.relative_to(CONTENT).as_posix()
        for p in CONTENT.rglob("*.md")
        if not any(part.startswith(".") for part in p.relative_to(CONTENT).parts)
    )


def collect_refs(node, out: list[str]) -> None:
    """toc.yml 트리에서 참조된 문서 경로를 모두 수집."""
    if isinstance(node, list):
        for item in node:
            collect_refs(item, out)
    elif isinstance(node, dict):
        for value in node.values():
            collect_refs(value, out)
    elif isinstance(node, str):
        out.append(node)


def load_finalized_locked() -> set[str]:
    """FINALIZED.md 의 '## 잠긴 파일' 섹션에서 주석 처리되지 않은 경로만 읽는다.

    `.claude/hooks/block-finalized.py` 와 같은 파싱 규칙(섹션 스코프, `<!-- -->` 는
    잠금 해제)을 쓴다. 반환값은 content/ 기준 상대경로 집합이다.
    """
    locked: set[str] = set()
    if not FINALIZED_MD.exists():
        return locked
    text = FINALIZED_MD.read_text(encoding="utf-8")
    idx = text.find(LOCK_HEADER)
    if idx == -1:
        return locked
    section = re.sub(r"<!--.*?-->", "", text[idx + len(LOCK_HEADER) :], flags=re.S)
    for line in section.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or s.startswith(">"):
            continue
        if s.startswith(("- ", "* ")):
            s = s[2:].strip()
        token = (s.split()[0].strip("`") if s else "").replace("\\", "/")
        if token.startswith("content/"):
            locked.add(token[len("content/") :])
    return locked


def mark_wip(nav: list, locked: set[str], counter: list[int] | None = None) -> bool:
    """잠기지 않은(FINALIZED.md 에서 주석 처리된) 문서의 제목 앞에 '(WIP) ' 를 붙인다.

    재귀적으로 아래에서 위로 처리한다 - 리프 문서가 WIP 면 그 문서에 표시하고,
    한 섹션의 하위 항목 중 하나라도 WIP 면 그 섹션 제목에도 표시한다. 그래서
    최상위 섹션까지 WIP 여부가 전파된다.

    제목 없이 놓인 index.md(섹션을 눌렀을 때 열리는 대표 페이지, navigation.indexes
    용, `attach_unlisted` 가 만드는 미등록 문서에만 나타난다)는 별도 표시줄이 없어
    건드리지 않지만, 그 문서의 WIP 여부는 부모 섹션에는 반영되지 않는다 - 애초에
    toc.yml 에 등록되지 않은 문서라 잠금 대상도 아니다.

    counter[0] 은 실제로 표시가 붙은 **리프 문서** 수를 센다(섹션 표시는 세지 않음).
    반환값은 이 서브트리 안에 WIP 항목이 있는지 여부다.
    """
    if counter is None:
        counter = [0]
    if not isinstance(nav, list):
        return False

    any_wip = False
    for item in nav:
        if not isinstance(item, dict):
            continue
        for title, value in list(item.items()):
            if isinstance(value, str):
                is_wip = value not in locked
                if is_wip:
                    any_wip = True
                    if not title.startswith(WIP_PREFIX):
                        del item[title]
                        item[WIP_PREFIX + title] = value
                        counter[0] += 1
            else:
                if mark_wip(value, locked, counter):
                    any_wip = True
                    if not title.startswith(WIP_PREFIX):
                        del item[title]
                        item[WIP_PREFIX + title] = value
    return any_wip


def normalize_toc(node):
    """toc.yml 을 MkDocs nav 형식으로 정규화. 문자열 항목은 제목을 자동으로 붙인다."""
    if isinstance(node, list):
        return [normalize_toc(item) for item in node]
    if isinstance(node, dict):
        # {제목: 경로} 는 이미 MkDocs nav 형식이므로 그대로 둔다.
        # {섹션: [...]} 처럼 값이 중첩된 경우에만 안으로 들어간다.
        return {
            key: value if isinstance(value, str) else normalize_toc(value)
            for key, value in node.items()
        }
    if isinstance(node, str):
        return {page_title(node): node}
    raise PipelineError(f"toc.yml 에 해석할 수 없는 항목이 있습니다: {node!r}")


@functools.lru_cache(maxsize=None)
def page_title(rel_path: str) -> str:
    """문서의 첫 H1 을 제목으로 쓰고, 없으면 파일명을 사람이 읽기 좋게 바꾼다."""
    path = CONTENT / rel_path
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            match = re.match(r"^#\s+(.+?)\s*$", line)
            if match:
                return match.group(1)
    stem = Path(rel_path).stem
    if stem == "index":
        parent = Path(rel_path).parent
        stem = parent.name if parent.name else "홈"
    return stem.replace("-", " ").replace("_", " ").strip() or stem


def directory_title(dir_rel: str) -> str:
    """디렉터리를 섹션 이름으로 바꾼다. index.md 가 있으면 그 문서의 제목을 쓴다."""
    index = f"{dir_rel}/index.md" if dir_rel else "index.md"
    if (CONTENT / index).exists():
        return page_title(index)
    name = Path(dir_rel).name
    return name.replace("-", " ").replace("_", " ").strip() or name


def nav_from_paths(paths: list[str], prefix: str = "") -> list:
    """문서 경로 목록을 디렉터리 구조 그대로 중첩된 nav 로 만든다.

    day1/ch1.md, day1/ch2.md -> [{'1일차': [{'1교시': 'day1/ch1.md'}, ...]}]
    """
    files: list[str] = []
    subdirs: dict[str, list[str]] = {}

    for path in paths:
        rest = path[len(prefix) :]
        if "/" in rest:
            head = rest.split("/", 1)[0]
            subdirs.setdefault(head, []).append(path)
        else:
            files.append(path)

    items: list = []

    # index.md 는 섹션을 눌렀을 때 열리는 페이지가 되도록 맨 앞에 제목 없이 둔다
    # (Material 의 navigation.indexes 기능).
    for path in sorted(files):
        if Path(path).name == "index.md":
            items.append(path)
    for path in sorted(files):
        if Path(path).name != "index.md":
            items.append({page_title(path): path})

    for name in sorted(subdirs):
        sub_prefix = f"{prefix}{name}/"
        items.append(
            {
                directory_title(sub_prefix.rstrip("/")): nav_from_paths(
                    subdirs[name], sub_prefix
                )
            }
        )

    return items


def register_sections(items: list, mapping: dict[str, tuple[str, list]]) -> None:
    """toc.yml 이 이미 만들어 둔 섹션을 '이 섹션은 어느 디렉터리 담당' 으로 색인한다.

    섹션에 직접 매달린 문서들이 모두 같은 디렉터리에 있을 때만 그 디렉터리의
    담당으로 본다. 덕분에 기존 섹션에 문서를 추가하면 같은 섹션 안으로 들어간다.
    """
    for item in items:
        if not isinstance(item, dict):
            continue
        for title, value in item.items():
            if not isinstance(value, list):
                continue
            direct: list[str] = []
            for child in value:
                if isinstance(child, str):
                    direct.append(child)
                elif isinstance(child, dict):
                    direct.extend(v for v in child.values() if isinstance(v, str))
            dirs = {Path(path).parent.as_posix() for path in direct}
            dirs.discard(".")
            if len(dirs) == 1:
                mapping.setdefault(dirs.pop(), (title, value))
            register_sections(value, mapping)


def nearest_section(parent: str, sections: dict[str, tuple[str, list]]):
    """문서가 속한 디렉터리부터 위로 올라가며 가장 가까운 기존 섹션을 찾는다."""
    parts = parent.split("/") if parent else []
    while True:
        key = "/".join(parts)
        if key and key in sections:
            return key, sections[key]
        if not parts:
            return None, None
        parts.pop()


def attach_unlisted(nav: list, unlisted: list[str], reporter: Reporter) -> None:
    """toc.yml 에 없는 문서를 디렉터리 구조에 맞춰 목차에 편입시킨다.

    - 이미 toc.yml 에 그 디렉터리를 담당하는 섹션이 있으면 그 안으로 넣는다.
    - 없으면 디렉터리 구조를 그대로 옮긴 섹션을 목차 뒤에 만든다.
    - 디렉터리의 index.md 는 섹션을 눌렀을 때 열리는 대표 페이지가 된다.
    """
    sections: dict[str, tuple[str, list]] = {}
    register_sections(nav, sections)

    # 기존 섹션의 하위 디렉터리에 있는 문서들은 한 번에 트리로 만들어 붙인다.
    nested: dict[str, tuple[str, list, list[str]]] = {}
    root_leftover: list[str] = []

    for path in unlisted:
        parent = Path(path).parent.as_posix()
        parent = "" if parent == "." else parent
        key, entry = nearest_section(parent, sections)

        if entry is None:
            root_leftover.append(path)
            continue

        title, children = entry
        if parent == key:
            if Path(path).name == "index.md":
                # 제목 없이 맨 앞에 두면 섹션 자체의 페이지가 된다.
                children.insert(0, path)
                reporter.warn(
                    f"toc.yml 미등록: {path} ('{title}' 섹션의 대표 페이지로 추가됨)"
                )
            else:
                children.append({page_title(path): path})
                reporter.warn(f"toc.yml 미등록: {path} ('{title}' 섹션에 자동 추가됨)")
        else:
            nested.setdefault(key, (title, children, []))[2].append(path)
            reporter.warn(f"toc.yml 미등록: {path} ('{title}' 섹션 아래에 자동 추가됨)")

    for key, (_title, children, paths) in nested.items():
        children.extend(nav_from_paths(paths, prefix=f"{key}/"))

    if root_leftover:
        for path in root_leftover:
            reporter.warn(
                f"toc.yml 미등록: {path} (디렉터리 구조대로 목차 뒤에 추가됨)"
            )
        nav.extend(nav_from_paths(root_leftover))


def resolve_nav(reporter: Reporter) -> list:
    """toc.yml 을 nav 로 변환하고, 미등록 문서는 뒤에 자동으로 덧붙인다."""
    # 제목은 문서 내용에서 읽어오므로, 미리보기 재빌드 때 캐시를 비워야 한다.
    page_title.cache_clear()

    if not TOC_YML.exists():
        reporter.warn("content/toc.yml 이 없어 디렉터리 구조만으로 목차를 만듭니다.")
        raw = []
    else:
        raw = load_yaml(TOC_YML) or []
    if not isinstance(raw, list):
        raise PipelineError("content/toc.yml 의 최상위는 목록(-) 이어야 합니다.")

    refs: list[str] = []
    collect_refs(raw, refs)

    available = set(content_markdown_files())

    missing = [ref for ref in refs if ref not in available]
    if missing:
        listed = "\n".join(f"    - {item}" for item in missing)
        raise PipelineError(
            "content/toc.yml 이 없는 파일을 가리킵니다:\n"
            f"{listed}\n"
            "  경로 오타이거나 파일을 아직 만들지 않았습니다."
        )

    duplicates = sorted({ref for ref in refs if refs.count(ref) > 1})
    for item in duplicates:
        reporter.warn(f"toc.yml 에 {item} 이(가) 여러 번 등록되어 있습니다.")

    nav = normalize_toc(raw)

    unlisted = sorted(available - set(refs))
    if unlisted:
        attach_unlisted(nav, unlisted, reporter)

    if not nav:
        raise PipelineError(
            "빌드할 문서가 없습니다. content/ 에 .md 파일을 추가하세요."
        )

    locked = load_finalized_locked()
    wip_counter = [0]
    mark_wip(nav, locked, wip_counter)
    if wip_counter[0]:
        reporter.warn(
            f"'(WIP)' 표시 {wip_counter[0]}건 - FINALIZED.md 에서 주석이 벗겨지지 않은 문서입니다. "
            "하위에 WIP 문서가 있는 섹션은 섹션 제목에도 표시됩니다."
        )

    return nav


# --------------------------------------------------------------------------
# 스테이징 + MkDocs 설정 생성
# --------------------------------------------------------------------------


def stage_sources(reporter: Reporter, site: dict) -> None:
    """content/ 와 theme/ 를 .build/src 로 모아 MkDocs 의 docs_dir 을 만든다."""
    if SRC.exists():
        shutil.rmtree(SRC)
    SRC.mkdir(parents=True)

    shutil.copytree(
        CONTENT,
        SRC,
        dirs_exist_ok=True,
        ignore=shutil.ignore_patterns("toc.yml", ".*"),
    )
    for name in ("stylesheets", "javascripts"):
        source = THEME / name
        if source.exists():
            shutil.copytree(source, SRC / name, dirs_exist_ok=True)

    # site.yml 의 UI 옵션은 브라우저에서 읽을 수 있도록 빌드 입력에만 생성한다.
    # 원본 theme/ 파일을 수정하지 않아 설정 변경이 작업 트리를 더럽히지 않는다.
    switcher_config = {
        "serviceSwitcherEnabled": site.get("service_switcher_enabled", True),
    }
    (SRC / "javascripts" / "service-switcher-config.js").write_text(
        "window.AILAB_SITE_CONFIG = "
        + json.dumps(switcher_config, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )

    count = sum(1 for _ in SRC.rglob("*.md"))
    reporter.ok(f"문서 {count}개를 .build/src 로 준비했습니다.")


def asset_fingerprint(path: Path) -> str:
    """파일 내용으로 짧은 해시를 만든다.

    extra_css / extra_javascript 는 MkDocs 가 경로를 그대로 내보내기 때문에
    theme/ 를 고쳐도 브라우저가 예전 파일을 캐시에서 계속 쓴다. URL 뒤에 이
    해시를 붙여 내용이 바뀌면 주소도 바뀌게 한다.
    """
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    except OSError:
        return "0"


def theme_asset_lists() -> tuple[list[str], list[str]]:
    """theme/ 에 실제로 존재하는 파일만 extra_css / extra_javascript 로 등록한다."""
    css_dir = THEME / "stylesheets"
    js_dir = THEME / "javascripts"

    # 레이아웃 -> 세부 -> 오버라이드 순서로 로드되어야 한다.
    preferred = [
        "material-wide.css",
        "highlight-code.css",
        "extra.css",
        "nav-highlight.css",
    ]
    found = sorted(p.name for p in css_dir.glob("*.css")) if css_dir.exists() else []
    ordered = [name for name in preferred if name in found]
    ordered += [name for name in found if name not in preferred]

    css = [
        f"stylesheets/{name}?h={asset_fingerprint(css_dir / name)}" for name in ordered
    ]
    js = (
        [
            f"javascripts/{p.name}?h={asset_fingerprint(p)}"
            for p in sorted(js_dir.glob("*.js"))
        ]
        if js_dir.exists()
        else []
    )
    switcher_config = SRC / "javascripts" / "service-switcher-config.js"
    if switcher_config.exists():
        js.insert(
            0,
            "javascripts/service-switcher-config.js"
            f"?h={asset_fingerprint(switcher_config)}",
        )
    return css, js


def build_mkdocs_config(site: dict, nav: list) -> dict:
    theme_cfg = site.get("theme") or {}
    palette_primary = theme_cfg.get("primary", "indigo")
    palette_accent = theme_cfg.get("accent", "blue")
    css, js = theme_asset_lists()

    return {
        "site_name": site["site_name"],
        "site_description": site.get("site_description", ""),
        "site_url": site.get("site_url", ""),
        "docs_dir": "src",
        "site_dir": "site",
        "use_directory_urls": True,
        # raw HTML(<video> 등) 의 상대 경로를 페이지 위치에 맞게 보정한다.
        # 경로는 .build/mkdocs.yml 기준.
        "hooks": ["../tools/mkdocs_hooks.py"],
        "theme": {
            "name": "material",
            "language": theme_cfg.get("language", "ko"),
            # site.yml 에 지정한 마크는 content/ 에서 빌드 입력으로 복사된다.
            # 로고와 favicon 을 같은 자산으로 지정하면 사이트 정체성이 일관된다.
            "logo": theme_cfg.get("logo"),
            "favicon": theme_cfg.get("favicon"),
            # 폐쇄망에서도 동작하도록 Google Fonts 를 쓰지 않는다.
            "font": False,
            "palette": [
                {
                    "scheme": "default",
                    "primary": palette_primary,
                    "accent": palette_accent,
                    "toggle": {
                        "icon": "material/weather-night",
                        "name": "야간 모드로 전환",
                    },
                },
                {
                    "scheme": "slate",
                    "primary": palette_primary,
                    "accent": palette_accent,
                    "toggle": {
                        "icon": "material/weather-sunny",
                        "name": "주간 모드로 전환",
                    },
                },
            ],
            "features": [
                "navigation.tabs",
                "navigation.tabs.sticky",
                "navigation.sections",
                "navigation.indexes",
                "navigation.tracking",
                "navigation.top",
                "toc.follow",
                "search.suggest",
                "search.highlight",
                "content.code.copy",
                "content.code.select",
            ],
        },
        "extra_css": css,
        "extra_javascript": js,
        "plugins": [
            "search",
            {
                "glightbox": {
                    "touchNavigation": True,
                    "loop": False,
                    "effect": "zoom",
                    "slide_effect": "slide",
                    # 원본 비율을 기준으로 뷰포트 안에 맞춘다. `100vw`를 강제하면
                    # 세로 이미지가 가로폭에 맞춰져 화면 아래가 잘릴 수 있다.
                    "width": "auto",
                    "height": "auto",
                    "zoomable": True,
                    "draggable": True,
                    "auto_caption": False,
                    "background": "black",
                    "shadow": True,
                    "manual": False,
                }
            },
        ],
        "markdown_extensions": [
            "admonition",
            "attr_list",
            "def_list",
            "md_in_html",
            "tables",
            {"pymdownx.mark": {"smart_mark": False}},
            "pymdownx.details",
            {
                "pymdownx.highlight": {
                    "anchor_linenums": True,
                    "line_spans": "__span",
                    "pygments_lang_class": True,
                }
            },
            "pymdownx.inlinehilite",
            "pymdownx.snippets",
            {
                "toc": {
                    "permalink": True,
                    # 기본 slugify는 한글 등 비 ASCII 제목을 못 다뤄 `_1`류
                    # 무의미한 앵커로 떨어진다. 한글 제목도 그대로 살려 앵커로
                    # 쓰려면 유니코드를 다루는 slugify가 필요하다.
                    "slugify": _PyApplyTag("pymdownx.slugs.slugify", case="lower"),
                }
            },
            {
                "pymdownx.superfences": {
                    "custom_fences": [
                        {
                            "name": "mermaid",
                            "class": "mermaid",
                            "format": _PyNameTag(
                                "pymdownx.superfences.fence_code_format"
                            ),
                        }
                    ]
                }
            },
        ],
        "nav": nav,
    }


def write_mkdocs_config(config: dict, reporter: Reporter) -> None:
    BUILD.mkdir(parents=True, exist_ok=True)
    header = (
        "# 이 파일은 `pipeline` 이 site.yml + content/toc.yml 로부터 생성합니다.\n"
        "# 직접 수정해도 다음 실행 때 덮어써집니다.\n"
    )
    body = yaml.safe_dump(
        config, allow_unicode=True, sort_keys=False, default_flow_style=False
    )
    MKDOCS_YML.write_text(header + body, encoding="utf-8")
    reporter.ok("MkDocs 설정을 생성했습니다 (.build/mkdocs.yml)")


# --------------------------------------------------------------------------
# 링크 검증
# --------------------------------------------------------------------------


def strip_code(text: str) -> str:
    """문법 예시로 적힌 코드 블록/인라인 코드는 링크 검사 대상에서 제외."""
    lines: list[str] = []
    fence: str | None = None
    for line in text.splitlines():
        match = re.match(r"^\s*(`{3,}|~{3,})", line)
        if fence is not None:
            if match and line.strip().startswith(fence):
                fence = None
            continue
        if match:
            fence = match.group(1)
            continue
        lines.append(line)
    return re.sub(r"`[^`]*`", "", "\n".join(lines))


LINK_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)|(?<!!)\[[^\]]+\]\(([^)]+)\)")

# 직접 적은 HTML 의 미디어 경로도 함께 검사한다 (<video src=...>, <img src=...> 등).
HTML_SRC_RE = re.compile(
    r"""<(?:img|video|audio|source|track|embed)\b[^>]*?\b(?:src|poster)\s*=\s*["']([^"']+)["']""",
    re.IGNORECASE,
)


def check_links(reporter: Reporter) -> list[tuple[str, str]]:
    """content/ 안의 상대 링크와 이미지가 실제 파일을 가리키는지 확인."""
    broken: list[tuple[str, str]] = []
    for path in sorted(CONTENT.rglob("*.md")):
        text = strip_code(path.read_text(encoding="utf-8"))
        candidates = [
            (match.group(1) or match.group(2)) for match in LINK_RE.finditer(text)
        ]
        candidates += HTML_SRC_RE.findall(text)
        for raw_url in candidates:
            url = raw_url.split()[0].strip("<>")
            if (
                not url
                or url.startswith("#")
                or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", url)
            ):
                continue
            parsed = urllib.parse.urlsplit(url)
            if parsed.scheme or parsed.netloc:
                continue
            target_path = urllib.parse.unquote(parsed.path)
            if not target_path:
                continue
            target = (path.parent / target_path).resolve()
            if target.is_dir():
                exists = (target / "index.md").exists()
            else:
                exists = target.exists()
            if not exists:
                broken.append((path.relative_to(ROOT).as_posix(), url))

    if broken:
        for source, url in broken:
            reporter.warn(f"깨진 링크: {source} -> {url}")
    else:
        reporter.ok("깨진 링크 없음")
    return broken


def check_site_url(site: dict, reporter: Reporter, *, strict: bool) -> None:
    url = (site.get("site_url") or "").strip()
    if url in PLACEHOLDER_URLS or "example.com" in url or "<" in url or ">" in url:
        message = (
            "site.yml 의 site_url 이 아직 예시값입니다. "
            "canonical 링크와 sitemap.xml 이 잘못된 주소를 가리키게 됩니다."
        )
        if strict:
            raise PipelineError(
                message + "\n  실제 GitHub Pages 주소로 바꾼 뒤 다시 실행하세요."
            )
        reporter.warn(message)


# --------------------------------------------------------------------------
# MkDocs 실행
# --------------------------------------------------------------------------


def run_mkdocs(args: list[str], *, check: bool = True) -> int:
    command = [sys.executable, "-m", "mkdocs", *args]
    try:
        result = subprocess.run(command, cwd=ROOT)
    except FileNotFoundError as exc:  # pragma: no cover - 방어용
        raise PipelineError(f"mkdocs 를 실행할 수 없습니다: {exc}") from exc
    if check and result.returncode != 0:
        raise PipelineError("MkDocs 빌드에 실패했습니다. 위 오류 메시지를 확인하세요.")
    return result.returncode


def prepare(reporter: Reporter, *, strict_url: bool) -> dict:
    """검증 -> 스테이징 -> 설정 생성까지의 공통 준비 단계."""
    if not CONTENT.exists():
        raise PipelineError(
            "content/ 디렉터리가 없습니다. `./pipeline init` 으로 만들 수 있습니다."
        )

    site = load_site()
    reporter.step("설정과 목차를 확인합니다")
    check_site_url(site, reporter, strict=strict_url)
    nav = resolve_nav(reporter)
    check_links(reporter)

    reporter.step("소스를 준비합니다")
    stage_sources(reporter, site)
    write_mkdocs_config(build_mkdocs_config(site, nav), reporter)
    return site


def build_site(
    reporter: Reporter, *, strict_url: bool, strict_build: bool = False
) -> dict:
    site = prepare(reporter, strict_url=strict_url)
    reporter.step("사이트를 빌드합니다")
    args = ["build", "--clean", "--config-file", str(MKDOCS_YML)]
    if strict_build:
        args.append("--strict")
    run_mkdocs(args)
    reporter.ok(f"빌드 완료: {SITE.relative_to(ROOT)}")
    return site


# --------------------------------------------------------------------------
# 명령: check / build / preview / deploy / clean / init / new
# --------------------------------------------------------------------------


def cmd_check(args, reporter: Reporter) -> int:
    site = load_site()
    reporter.step("설정과 목차를 확인합니다")
    check_site_url(site, reporter, strict=False)
    resolve_nav(reporter)
    broken = check_links(reporter)
    if broken:
        raise PipelineError(f"깨진 링크 {len(broken)}건을 먼저 수정하세요.")
    reporter.info("\n검사를 통과했습니다.")
    return 0


def cmd_build(args, reporter: Reporter) -> int:
    build_site(reporter, strict_url=False, strict_build=args.strict)
    reporter.info(f"\n결과물: {SITE}")
    return 0


def fingerprint(paths: list[Path]) -> str:
    """폴링 감시용 지문. mtime 이벤트가 유실되는 환경(WSL/네트워크 드라이브)을 위해 사용."""
    digest = hashlib.sha256()
    for root in paths:
        if not root.exists():
            continue
        files = (
            [root]
            if root.is_file()
            else sorted(
                (p for p in root.rglob("*") if p.is_file()), key=lambda p: p.as_posix()
            )
        )
        for path in files:
            try:
                stat = path.stat()
            except OSError:
                continue
            digest.update(path.as_posix().encode("utf-8", "surrogateescape"))
            digest.update(b"\0")
            digest.update(str(stat.st_mtime_ns).encode("ascii"))
            digest.update(b"\0")
            digest.update(str(stat.st_size).encode("ascii"))
            digest.update(b"\0")
    return digest.hexdigest()


def serve_directory(directory: Path, host: str, port: int) -> socketserver.TCPServer:
    handler = functools.partial(QuietHandler, directory=str(directory))
    httpd = ThreadingHTTPServer((host, port), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # noqa: A002 - 시그니처 고정
        pass


def cmd_preview(args, reporter: Reporter) -> int:
    build_site(reporter, strict_url=False)

    url = f"http://{args.host if args.host != '0.0.0.0' else 'localhost'}:{args.port}/"
    try:
        httpd = serve_directory(SITE, args.host, args.port)
    except OSError as exc:
        raise PipelineError(
            f"{args.host}:{args.port} 에서 서버를 열 수 없습니다 ({exc}).\n"
            "  다른 포트를 쓰려면 `./pipeline preview --port 9000` 처럼 지정하세요."
        ) from exc

    reporter.info("")
    reporter.info("=" * 60)
    reporter.info(f"  로컬 미리보기: {url}")
    if args.host == "0.0.0.0":
        reporter.info(f"  서버 바인딩  : 0.0.0.0:{args.port} (모든 IPv4 인터페이스)")
    reporter.info(f"  감시 대상    : content/, theme/, site.yml")
    reporter.info("  종료         : Ctrl+C")
    reporter.info("=" * 60)

    if not args.no_open:
        threading.Thread(target=webbrowser.open, args=(url,), daemon=True).start()

    watched = [CONTENT, THEME, SITE_YML]
    last = fingerprint(watched)
    try:
        while True:
            time.sleep(args.interval)
            if args.no_watch:
                continue
            current = fingerprint(watched)
            if current == last:
                continue
            reporter.info(
                f"\n[{time.strftime('%H:%M:%S')}] 변경을 감지했습니다. 다시 빌드합니다."
            )
            try:
                rebuild = Reporter()
                build_site(rebuild, strict_url=False)
                rebuild.summarize()
                reporter.info(
                    f"[{time.strftime('%H:%M:%S')}] 빌드 완료. 브라우저를 새로고침하세요."
                )
            except PipelineError as exc:
                # 빌드가 깨져도 미리보기 서버는 살려둔다. 직전 결과물이 계속 서빙된다.
                sys.stdout.flush()
                print(f"\n✗ {exc}", file=sys.stderr)
                print("  수정 후 저장하면 다시 빌드합니다.", file=sys.stderr)
            last = fingerprint(watched)
    except KeyboardInterrupt:
        reporter.info("\n미리보기를 종료합니다.")
    finally:
        httpd.shutdown()
        httpd.server_close()
    return 0


def git(*args: str, capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        capture_output=capture,
        text=True,
    )


def cmd_deploy(args, reporter: Reporter) -> int:
    deploy_cfg = load_site().get("deploy") or {}
    remote = args.remote or deploy_cfg.get("remote", "origin")
    branch = args.branch or deploy_cfg.get("branch", "gh-pages")

    reporter.step("배포 전 확인")
    if git("rev-parse", "--git-dir").returncode != 0:
        raise PipelineError(
            "이 디렉터리는 git 저장소가 아닙니다.\n"
            "  git init && git remote add origin <저장소 URL> 을 먼저 실행하세요."
        )

    remote_url = git("remote", "get-url", remote)
    if remote_url.returncode != 0:
        raise PipelineError(
            f"'{remote}' 리모트가 없습니다.\n"
            f"  git remote add {remote} <저장소 URL> 로 추가하세요."
        )
    remote_url = remote_url.stdout.strip()
    reporter.ok(f"리모트: {remote} -> {remote_url}")
    reporter.ok(f"배포 브랜치: {branch}")

    dirty = git("status", "--porcelain", "--", "content", "site.yml", "theme")
    if dirty.stdout.strip():
        reporter.warn(
            "커밋되지 않은 원본 변경이 있습니다. "
            f"{branch} 에는 반영되지만 main 에는 남지 않습니다."
        )

    # site_url 이 예시값이면 여기서 중단한다.
    site = build_site(reporter, strict_url=True, strict_build=args.strict)

    if not args.yes:
        reporter.info("")
        reporter.info(
            f"  {SITE.relative_to(ROOT)} 의 내용을 {remote}/{branch} 로 푸시합니다."
        )
        reporter.info(f"  사이트 주소: {site.get('site_url')}")
        answer = input("  진행할까요? [y/N] ").strip().lower()
        if answer not in ("y", "yes"):
            reporter.info("배포를 취소했습니다.")
            return 1

    reporter.step("GitHub Pages 로 배포합니다")
    gh_args = [
        "gh-deploy",
        "--config-file",
        str(MKDOCS_YML),
        "--remote-name",
        remote,
        "--remote-branch",
        branch,
        "--message",
        args.message,
    ]
    if args.force:
        gh_args.append("--force")
    if run_mkdocs(gh_args, check=False) != 0:
        raise PipelineError(
            "배포에 실패했습니다.\n"
            f"  {remote} 에 대한 푸시 권한과 네트워크 연결을 확인하세요.\n"
            f"  원격에 {branch} 이력이 갈라진 경우 `./pipeline deploy --force` 가 필요할 수 있습니다."
        )

    reporter.info("")
    reporter.info("배포를 완료했습니다.")
    reporter.info(f"  {site.get('site_url')}")
    reporter.info(
        f"  (최초 1회) 저장소 Settings > Pages 에서 Source=Deploy from a branch, "
        f"Branch={branch}, Folder=/ 로 설정하세요."
    )
    return 0


def cmd_clean(args, reporter: Reporter) -> int:
    if BUILD.exists():
        shutil.rmtree(BUILD)
        reporter.info(f"{BUILD.relative_to(ROOT)} 를 삭제했습니다.")
    else:
        reporter.info("정리할 작업 디렉터리가 없습니다.")
    return 0


def cmd_new(args, reporter: Reporter) -> int:
    rel = args.path if args.path.endswith(".md") else f"{args.path}.md"
    target = CONTENT / rel
    if target.exists():
        raise PipelineError(f"이미 존재합니다: content/{rel}")
    target.parent.mkdir(parents=True, exist_ok=True)
    title = args.title or Path(rel).stem.replace("-", " ").replace("_", " ")
    target.write_text(f"# {title}\n\n내용을 작성하세요.\n", encoding="utf-8")
    reporter.info(f"content/{rel} 를 만들었습니다.")
    reporter.info(f"content/toc.yml 에 다음 줄을 추가하세요:\n  - {title}: {rel}")
    return 0


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="pipeline",
        description="content/ 의 Markdown 을 GitHub Pages 로 빌드/배포합니다.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "주요 흐름\n"
            "  ./pipeline preview   테스트용 - 빌드 후 로컬 서버로 확인 (변경 시 자동 재빌드)\n"
            "  ./pipeline deploy    실배포  - 빌드 후 gh-pages 브랜치로 푸시\n"
        ),
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_check = sub.add_parser("check", help="목차와 링크만 검사 (빌드하지 않음)")
    p_check.set_defaults(func=cmd_check)

    p_build = sub.add_parser("build", help="정적 사이트를 .build/site 로 빌드")
    p_build.add_argument(
        "--strict", action="store_true", help="MkDocs 경고도 오류로 처리"
    )
    p_build.set_defaults(func=cmd_build)

    p_preview = sub.add_parser("preview", help="테스트용 빌드 + 로컬 서버 (기본 흐름)")
    p_preview.add_argument("--host", default="0.0.0.0", help="기본값 0.0.0.0")
    p_preview.add_argument("--port", type=int, default=8080, help="기본값 8080")
    p_preview.add_argument(
        "--interval", type=float, default=1.0, help="변경 감시 주기(초)"
    )
    p_preview.add_argument(
        "--no-open", action="store_true", help="브라우저를 열지 않음"
    )
    p_preview.add_argument(
        "--no-watch", action="store_true", help="자동 재빌드 없이 서버만 실행"
    )
    p_preview.set_defaults(func=cmd_preview)

    p_deploy = sub.add_parser("deploy", help="실배포 - gh-pages 브랜치로 푸시")
    p_deploy.add_argument("--remote", help="기본값: site.yml 의 deploy.remote (origin)")
    p_deploy.add_argument(
        "--branch", help="기본값: site.yml 의 deploy.branch (gh-pages)"
    )
    p_deploy.add_argument(
        "-m", "--message", default="docs: update site", help="배포 커밋 메시지"
    )
    p_deploy.add_argument(
        "-y", "--yes", action="store_true", help="확인 절차 없이 바로 배포"
    )
    p_deploy.add_argument(
        "--strict", action="store_true", help="MkDocs 경고도 오류로 처리"
    )
    p_deploy.add_argument(
        "--force", action="store_true", help="원격 브랜치를 강제로 덮어씀"
    )
    p_deploy.set_defaults(func=cmd_deploy)

    p_new = sub.add_parser("new", help="새 문서 파일을 만든다")
    p_new.add_argument("path", help="content/ 기준 경로 (예: guide/install)")
    p_new.add_argument("--title", help="문서 제목 (기본값: 파일명)")
    p_new.set_defaults(func=cmd_new)

    p_clean = sub.add_parser("clean", help=".build/ 작업 디렉터리 삭제")
    p_clean.set_defaults(func=cmd_clean)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = make_parser().parse_args(argv)
    reporter = Reporter()
    try:
        code = args.func(args, reporter)
    except PipelineError as exc:
        reporter.summarize()
        sys.stdout.flush()
        print(f"\n✗ {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\n중단했습니다.", file=sys.stderr)
        return 130
    reporter.summarize()
    return code


if __name__ == "__main__":
    sys.exit(main())
