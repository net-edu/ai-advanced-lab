#!/usr/bin/env python3
"""윤문이 고쳐선 안 될 것을 고쳤는지 기계로 판정하고, 어겼으면 되돌린다.

    python3 polish/tools/guard.py                          최신 스냅샷 대비 검사
    python3 polish/tools/guard.py --only content/mcp       이 범위 밖 변경도 위반으로
    python3 polish/tools/guard.py --mode revise            헤딩 변경을 허용
    python3 polish/tools/guard.py --restore                위반 문서를 스냅샷으로 롤백

보호 구간(polish/style/checklist.md 의 '보호 구간' 절)이 유일한 판정 기준이다.
문체는 판정하지 않는다 - 그건 style-guardian 의 몫이다.

종료 코드: 0 통과 / 1 위반 있음 / 2 실행 불가
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import mdtext  # noqa: E402
import snapshot as snap  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
WARN_KINDS = ("warning", "danger", "caution")


def slugify(text):
    """헤딩 텍스트를 앵커로 바꾼다 (python-markdown toc 규칙에 가깝게)."""
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*?([^*]*)\*\*?", r"\1", text)
    text = text.strip().lower()
    text = re.sub(r"[^\w\s가-힣-]", "", text)
    return re.sub(r"[\s_]+", "-", text).strip("-")


def fingerprint(text):
    """한 문서에서 보호 대상만 뽑아낸다."""
    _, blocks = mdtext.split_fences(text)
    heads = mdtext.headings(text)
    h1 = next((title for _, level, title in heads if level == 1), None)
    warn_callouts = [
        (kind, body) for kind, _, body in mdtext.callouts(text) if kind in WARN_KINDS
    ]
    return {
        "코드블록": [(lang, body) for lang, body in blocks],
        "인라인코드": Counter(mdtext.inline_codes(text)),
        "링크": Counter(mdtext.links(text)),
        "숫자": mdtext.numbers(text),
        "H1": h1,
        "헤딩": [(level, title) for _, level, title in heads],
        "경고콜아웃": Counter(kind for kind, _ in warn_callouts),
        "경고숫자": Counter(
            number
            for _, body in warn_callouts
            for number in mdtext.NUMBER_RE.findall(body)
        ),
        "마커수": len(mdtext.markers(text)),
    }


def diff_counter(before, after):
    """(사라진 것, 새로 생긴 것)."""
    lost = before - after
    gained = after - before
    return lost, gained


def compare_file(rel, before_text, after_text, mode):
    """한 문서의 위반 목록. 빈 리스트면 통과."""
    before = fingerprint(before_text)
    after = fingerprint(after_text)
    violations = []

    if before["코드블록"] != after["코드블록"]:
        if len(before["코드블록"]) != len(after["코드블록"]):
            violations.append(
                f"코드블록 개수가 {len(before['코드블록'])} → {len(after['코드블록'])} 로 바뀌었습니다"
            )
        else:
            for index, (was, now) in enumerate(
                zip(before["코드블록"], after["코드블록"]), 1
            ):
                if was != now:
                    violations.append(
                        f"{index}번째 코드블록의 내용 또는 언어 태그가 바뀌었습니다"
                    )

    for label, key in (
        ("인라인 코드", "인라인코드"),
        ("링크·미디어 경로", "링크"),
        ("숫자", "숫자"),
    ):
        lost, gained = diff_counter(before[key], after[key])
        if lost:
            violations.append(f"{label} 사라짐: {', '.join(sorted(lost))[:120]}")
        if gained:
            violations.append(f"{label} 생김: {', '.join(sorted(gained))[:120]}")

    if before["H1"] != after["H1"]:
        violations.append(f"H1 제목이 바뀌었습니다: '{before['H1']}' → '{after['H1']}'")

    if mode != "revise" and before["헤딩"] != after["헤딩"]:
        was = [title for _, title in before["헤딩"]]
        now = [title for _, title in after["헤딩"]]
        lost = [title for title in was if title not in now]
        gained = [title for title in now if title not in was]
        detail = []
        if lost:
            detail.append(f"사라짐 {lost[:3]}")
        if gained:
            detail.append(f"생김 {gained[:3]}")
        violations.append(
            "헤딩이 바뀌었습니다 (개선 모드에서만 허용) - " + " / ".join(detail)
        )

    lost, gained = diff_counter(before["경고콜아웃"], after["경고콜아웃"])
    if lost:
        violations.append(f"경고 콜아웃이 사라졌습니다: {dict(lost)}")
    lost, _ = diff_counter(before["경고숫자"], after["경고숫자"])
    if lost:
        violations.append(
            f"경고 콜아웃 안의 수치가 사라졌습니다: {', '.join(sorted(lost))}"
        )

    if after["마커수"] > before["마커수"]:
        violations.append(
            f"미해소 마커가 {before['마커수']} → {after['마커수']} 로 늘었습니다"
        )

    return violations


def check_anchors():
    """문서 사이 링크의 #앵커가 실제 헤딩을 가리키는지 본다 (스냅샷과 무관한 절대 검사)."""
    content = ROOT / "content"
    problems = []
    slugs = {}
    for path in sorted(content.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        slugs[path.resolve()] = {
            slugify(title) for _, _, title in mdtext.headings(text)
        }
    for path in sorted(content.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        for url in mdtext.links(text):
            if "#" not in url or url.startswith(("http://", "https://", "mailto:")):
                continue
            target_path, _, anchor = url.partition("#")
            if not anchor:
                continue
            target = (
                (path.parent / target_path).resolve() if target_path else path.resolve()
            )
            if target.is_dir():
                target = target / "index.md"
            if target not in slugs:
                continue  # 파일 존재 여부는 파이프라인의 링크 검사 몫이다
            if slugify(anchor) not in slugs[target]:
                problems.append(
                    f"{path.relative_to(ROOT).as_posix()} → '{url}' 가 가리키는 제목이 없습니다"
                )
    return problems


def main(argv=None):
    parser = argparse.ArgumentParser(description="보호 구간 회귀 검증")
    parser.add_argument(
        "snapshot", nargs="?", default="latest", help="기준 스냅샷 (기본: latest)"
    )
    parser.add_argument(
        "--mode", choices=("proofread", "polish", "revise"), default="polish"
    )
    parser.add_argument(
        "--only", nargs="*", default=None, help="이번 파의 작업 범위 (밖의 변경은 위반)"
    )
    parser.add_argument(
        "--restore", action="store_true", help="위반 문서를 스냅샷 상태로 되돌린다"
    )
    args = parser.parse_args(argv)

    base = snap.resolve(args.snapshot)
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    changed, added, removed = snap.compare(base)

    print(f"기준 스냅샷 {base.name} · 모드 {args.mode}")

    failures = {}

    allowed = None
    if args.only:
        allowed = set()
        for target in args.only:
            path = Path(target)
            path = path if path.is_absolute() else ROOT / path
            if path.is_dir():
                allowed |= {p.relative_to(ROOT).as_posix() for p in path.rglob("*.md")}
            else:
                allowed.add(path.resolve().relative_to(ROOT).as_posix())

    for rel in removed:
        failures.setdefault(rel, []).append(
            "문서가 삭제되었습니다 (하네스는 문서를 지우지 않습니다)"
        )
    for rel in added:
        failures.setdefault(rel, []).append(
            "문서가 새로 생겼습니다 (윤문 범위 밖입니다)"
        )

    for rel in changed:
        if allowed is not None and rel not in allowed:
            failures.setdefault(rel, []).append(
                "이번 파의 작업 범위 밖 문서가 수정되었습니다"
            )
        before_text = (base / "files" / rel).read_text(encoding="utf-8")
        after_text = (ROOT / rel).read_text(encoding="utf-8")
        problems = compare_file(rel, before_text, after_text, args.mode)
        if problems:
            failures.setdefault(rel, []).extend(problems)

    if not changed and not added and not removed:
        print("바뀐 문서가 없습니다.")
    else:
        print(f"바뀐 문서 {len(changed)}개 (추가 {len(added)} · 삭제 {len(removed)})")

    anchors = check_anchors()

    if failures:
        print("\n보호 구간 위반")
        for rel, problems in sorted(failures.items()):
            print(f"  {rel}")
            for problem in problems:
                print(f"      - {problem}")
    if anchors:
        print("\n앵커 링크 문제")
        for problem in anchors:
            print(f"  - {problem}")

    if failures and args.restore:
        restorable = [rel for rel in failures if (base / "files" / rel).exists()]
        print("\n롤백")
        snap.cmd_restore(
            argparse.Namespace(
                snapshot=base.name,
                paths=[str(ROOT / rel) for rel in restorable],
                all=False,
            )
        )

    if failures or anchors:
        return 1
    print("\n통과 - 보호 구간이 그대로입니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
