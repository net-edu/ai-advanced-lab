#!/usr/bin/env python3
"""content/ 문서의 문체 지표를 센다. 판정하지 않고 수치만 낸다.

    python3 polish/tools/measure.py                    전체
    python3 polish/tools/measure.py content/guide      일부
    python3 polish/tools/measure.py --json             기계 판독용
    python3 polish/tools/measure.py --detail 파일.md   한 파일 상세

무엇을 고쳐야 하는지 인상으로 정하지 않기 위한 도구다. 어떤 항목도 이 도구가
'위반' 으로 확정하지 않는다 - 기준은 polish/style/checklist.md 에 있고, 판단은
style-guardian 이 한다.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import mdtext  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "content"
GLOSSARY = ROOT / "polish" / "style" / "glossary.md"


def load_glossary():
    """glossary.md 의 표에서 (표준 표기, [피할 표기]) 목록을 읽는다.

    사람이 읽는 규범 문서가 그대로 도구의 입력이다 - 규칙이 두 곳에 흩어지지 않게.
    """
    if not GLOSSARY.exists():
        return []
    entries = []
    for line in GLOSSARY.read_text(encoding="utf-8").splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if (
            len(cells) < 2
            or cells[0] in ("표준 표기", "---")
            or set(cells[0]) <= {"-", ":"}
        ):
            continue
        canonical = cells[0].strip("`")
        avoid = [
            term.strip().strip("`")
            for term in re.split(r"[,·/]", cells[1])
            if term.strip() and term.strip() != "-"
        ]
        if canonical and avoid:
            entries.append((canonical, avoid))
    return entries


def glossary_hits(text, entries):
    """표준 표기가 아닌 표기가 산문에 쓰였는지 본다 (코드·링크 주소 제외)."""
    outside, _ = mdtext.split_fences(text)
    hits = []
    for no, line in outside:
        body = mdtext.strip_inline(line)
        for canonical, avoid in entries:
            for term in avoid:
                if re.search(
                    r"(?<![A-Za-z가-힣])" + re.escape(term) + r"(?![A-Za-z가-힣])", body
                ):
                    hits.append((no, term, canonical))
    return hits


def measure(path, entries):
    text = path.read_text(encoding="utf-8")
    counts, samples = mdtext.sentence_endings(text)
    styled = {k: v for k, v in counts.items() if k != "캡션(제외)"}
    total = sum(styled.values())
    dominant, dominant_n = ("-", 0)
    if styled:
        dominant, dominant_n = max(styled.items(), key=lambda kv: kv[1])
    word_count = mdtext.words(text)
    bold_count = len(mdtext.bolds(text))
    has_lead, lead_line, lead_text = mdtext.lead_paragraph(text)
    levels = [level for _, level, _ in mdtext.headings(text)]
    jumps = sum(1 for a, b in zip(levels, levels[1:]) if b - a > 1)
    plain_callouts = [
        c for c in mdtext.callouts(text) if c[0] not in ("warning", "danger", "caution")
    ]

    long_sentences = []
    for no, line in mdtext.prose_lines(text):
        for sentence in mdtext.SENTENCE_SPLIT_RE.split(mdtext.strip_inline(line)):
            if len(sentence.strip()) > 120:
                long_sentences.append((no, sentence.strip()[:70]))

    return {
        "path": path.relative_to(ROOT).as_posix(),
        "어절": word_count,
        "문장": total,
        "어체": dict(counts),
        "지배어체": dominant,
        "지배비율": round(dominant_n / total, 3) if total else 0.0,
        "혼재율": round(1 - dominant_n / total, 3) if total else 0.0,
        "bold": bold_count,
        "bold밀도": round(word_count / bold_count, 1) if bold_count else None,
        "리스트비율": round(mdtext.list_ratio(text), 3),
        "리드문단": has_lead,
        "리드줄": lead_line,
        "마커": mdtext.markers(text),
        "헤딩점프": jumps,
        "긴문장": long_sentences,
        "콜아웃(경고제외)": len(plain_callouts),
        "용어": glossary_hits(text, entries),
        "표본": samples,
    }


def collect(targets):
    files = []
    for target in targets:
        path = Path(target)
        if not path.is_absolute():
            path = ROOT / path
        if path.is_dir():
            files += sorted(path.rglob("*.md"))
        elif path.suffix == ".md":
            files.append(path)
    return files


def render_table(rows):
    header = f"{'문서':44s} {'어절':>6s} {'지배어체':>8s} {'혼재':>5s} {'bold':>7s} {'리스트':>5s} {'리드':>4s} {'마커':>4s} {'용어':>4s}"
    print(header)
    print("-" * len(header))
    for row in rows:
        density = f"1/{row['bold밀도']}" if row["bold밀도"] else "-"
        print(
            f"{row['path']:44s} {row['어절']:6d} {row['지배어체']:>8s} "
            f"{row['혼재율']*100:4.0f}% {density:>7s} {row['리스트비율']*100:4.0f}% "
            f"{'O' if row['리드문단'] else 'X':>4s} {len(row['마커']):4d} {len(row['용어']):4d}"
        )
    print("-" * len(header))
    print(f"{len(rows)}개 문서. 기준과 임계값은 polish/style/checklist.md 를 보세요.")


def render_detail(row):
    print(f"# {row['path']}\n")
    print(
        f"어절 {row['어절']} · 문장 {row['문장']} · 지배 어체 {row['지배어체']} (혼재 {row['혼재율']*100:.0f}%)"
    )
    print(f"어체 분포: {row['어체']}")
    for name, (no, sample) in row["표본"].items():
        print(f"  - {name:10s} {row['path']}:{no}  {sample}")
    print(
        f"\nbold {row['bold']}개 (밀도 1/{row['bold밀도']}) · 리스트 {row['리스트비율']*100:.0f}% "
        f"· 콜아웃(경고 제외) {row['콜아웃(경고제외)']} · 헤딩 점프 {row['헤딩점프']}"
    )
    print(f"리드 문단: {'있음' if row['리드문단'] else '없음'} (줄 {row['리드줄']})")
    if row["마커"]:
        print("\n미해소 마커:")
        for no, line in row["마커"]:
            print(f"  {row['path']}:{no}  {line[:80]}")
    if row["용어"]:
        print("\n용어 표기:")
        for no, term, canonical in row["용어"]:
            print(f"  {row['path']}:{no}  '{term}' -> '{canonical}'")
    if row["긴문장"]:
        print(f"\n긴 문장 {len(row['긴문장'])}건 (120자 초과):")
        for no, sentence in row["긴문장"][:5]:
            print(f"  {row['path']}:{no}  {sentence}…")


def main(argv=None):
    parser = argparse.ArgumentParser(description="content/ 문서의 문체 지표를 센다")
    parser.add_argument(
        "targets", nargs="*", default=[], help="파일 또는 디렉터리 (기본: content/)"
    )
    parser.add_argument("--json", action="store_true", help="JSON 으로 출력")
    parser.add_argument("--detail", action="store_true", help="파일별 상세 출력")
    args = parser.parse_args(argv)

    files = collect(args.targets or [CONTENT])
    if not files:
        print("대상 문서가 없습니다.", file=sys.stderr)
        return 1

    entries = load_glossary()
    rows = [measure(path, entries) for path in files]

    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
    elif args.detail:
        for index, row in enumerate(rows):
            if index:
                print("\n" + "=" * 72 + "\n")
            render_detail(row)
    else:
        render_table(rows)
    return 0


if __name__ == "__main__":
    sys.exit(main())
