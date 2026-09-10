#!/usr/bin/env python3
"""content/curriculum/index.md 에 아직 없는 링크·자료를 content/**/*.md 에서 찾는다.

읽기 전용이다 - 아무 파일도 고치지 않는다. 결과는 JSON 으로 표준출력에 찍는다.
PyYAML 이 필요하다 (프로젝트 .venv 에 mkdocs 의존성으로 이미 들어 있다):

    .venv/bin/python3 .claude/skills/materials-sync/scripts/find_new_materials.py
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
CONTENT = ROOT / "content"
TOC = CONTENT / "toc.yml"
SITE_YML = ROOT / "site.yml"
INDEX = CONTENT / "curriculum" / "index.md"

LINK_RE = re.compile(
    r"(?P<bang>!)?\[(?P<text>[^\]]*)\]\((?P<target>[^)\s]+)(?:\s+\"[^\"]*\")?\)"
    r"(?P<attrs>\{[^}]*\})?"
)


def load_breadcrumbs() -> dict[str, list[str]]:
    """toc.yml -> {content/ 기준 md 경로: [브레드크럼 라벨, ...]}."""
    data = yaml.safe_load(TOC.read_text(encoding="utf-8"))
    mapping: dict[str, list[str]] = {}

    def walk(node, crumb: list[str]) -> None:
        if isinstance(node, list):
            for item in node:
                walk(item, crumb)
        elif isinstance(node, dict):
            for label, value in node.items():
                if isinstance(value, str):
                    mapping[value] = crumb + [label]
                else:
                    walk(value, crumb + [label])
        elif isinstance(node, str):
            mapping[node] = list(crumb)

    walk(data, [])
    return mapping


def load_site_url() -> str:
    data = yaml.safe_load(SITE_YML.read_text(encoding="utf-8"))
    return data["site_url"].rstrip("/") + "/"


def doc_url(doc_path: str, site_url: str) -> str:
    if doc_path.endswith("/index.md"):
        url_path = doc_path[: -len("index.md")]
    elif doc_path == "index.md":
        url_path = ""
    else:
        url_path = doc_path[: -len(".md")] + "/"
    return site_url + url_path


def resolve_target(doc_path: str, target: str) -> str:
    """target 을 content/ 기준 상대경로(슬래시)나 절대 URL로 정규화한다."""
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target) or target.startswith("//"):
        return target.split("#")[0].rstrip("/")
    if target.startswith("#"):
        return ""
    doc_dir = os.path.dirname(doc_path)
    joined = os.path.normpath(os.path.join(doc_dir, target.split("#")[0]))
    return joined.replace(os.sep, "/")


def collect_catalogued() -> set[str]:
    """index.md 안의 모든 링크·이미지 타깃을 이미 관리 중인 것으로 취급한다."""
    text = INDEX.read_text(encoding="utf-8")
    catalogued: set[str] = set()
    for match in LINK_RE.finditer(text):
        target = match.group("target")
        resolved = resolve_target("curriculum/index.md", target)
        if resolved:
            catalogued.add(resolved)
    return catalogued


def classify(bang: bool, resolved: str, attrs: str | None) -> str | None:
    if bang:
        if resolved.startswith("media/"):
            return "image"
        return None
    if resolved.startswith(("http://", "https://")):
        return "link"
    if resolved.endswith(".zip") or (attrs and "download" in attrs):
        return "download"
    if resolved.endswith(".html") and "/assets/" in resolved:
        return "simulator"
    return None


def scan(site_url: str, breadcrumbs: dict[str, list[str]]) -> dict[str, list[dict]]:
    catalogued = collect_catalogued()
    results: dict[str, list[dict]] = {
        "link": [],
        "download": [],
        "simulator": [],
        "image": [],
    }
    seen_in_run: set[tuple[str, str]] = set()

    for md_file in sorted(CONTENT.rglob("*.md")):
        doc_path = md_file.relative_to(CONTENT).as_posix()
        if doc_path == "curriculum/index.md":
            continue
        lines = md_file.read_text(encoding="utf-8").splitlines()
        in_fence = False
        for line_no, line in enumerate(lines, start=1):
            if line.lstrip().startswith("```"):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            # 인라인 코드(`...`) 안의 예시 문법은 실제 링크가 아니다 - 매칭에서만 제외하고
            # context 는 원문 그대로 보고한다.
            search_line = re.sub(r"`[^`]*`", "", line)
            for match in LINK_RE.finditer(search_line):
                target = match.group("target")
                resolved = resolve_target(doc_path, target)
                if not resolved:
                    continue
                category = classify(
                    bool(match.group("bang")), resolved, match.group("attrs")
                )
                if category is None:
                    continue
                if category == "link" and resolved.startswith(site_url.rstrip("/")):
                    continue  # 사이트 자기 자신을 가리키는 내부 링크는 자료가 아니다
                if resolved in catalogued:
                    continue
                dedup_key = (category, resolved)
                if dedup_key in seen_in_run:
                    continue
                seen_in_run.add(dedup_key)
                crumb = breadcrumbs.get(doc_path, [])
                results[category].append(
                    {
                        "text": match.group("text"),
                        "target_raw": target,
                        "target_resolved": resolved,
                        "hosting_doc": f"content/{doc_path}",
                        "hosting_breadcrumb": " > ".join(crumb),
                        "hosting_url": doc_url(doc_path, site_url),
                        "line": line_no,
                        "context": line.strip(),
                    }
                )
    return results


def main() -> None:
    site_url = load_site_url()
    breadcrumbs = load_breadcrumbs()
    results = scan(site_url, breadcrumbs)
    total = sum(len(v) for v in results.values())
    json.dump(
        {"total_new": total, "by_category": results},
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    print()


if __name__ == "__main__":
    main()
