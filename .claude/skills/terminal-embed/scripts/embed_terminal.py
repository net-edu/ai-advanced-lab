#!/usr/bin/env python3
"""실제 Claude Code 세션 로그(원문 텍스트)를 Ubuntu 24.04 톤 터미널 창 위젯으로
색칠해, content/course/ 문서 하단에 접기/펼치기(<details>) 블록으로 삽입한다.

표준 라이브러리만 쓴다(CLAUDE.md: polish/tools 원칙과 동일하게 이 스킬도 외부
의존성을 추가하지 않는다).

사용법:
    python3 embed_terminal.py <원문 트랜스크립트> <대상 .md 파일> \
        [--label "실행 로그 펼치기 - stage2-context-attach"]

이미 대상 파일에 "## 실행 예시" 절이 있으면 중복 삽입을 막기 위해 아무 것도
하지 않고 종료한다(재실행 안전).
"""

import argparse
import html
import re
import sys
from pathlib import Path

HEADING = "## 실행 예시 - 실제 세션 로그"
INTRO = (
    "아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. "
    "자신의 실행 결과와 견줘 보세요."
)

# 배너 칸막이/픽토그램 등 앱 자체가 항상 그리는 고정 문자열(세션마다 안 바뀜).
PIG_TOP = "▐▛███▜▌"
PIG_MID = "▝▜█████▛▘"
PIG_BOT = "▘▘ ▝▝"
TIPS_HEADER = "Tips for getting"
WHATSNEW_HEADER = "What's new"
ORG_LINE = "Sonnet 5 · Claude            ·                    "
ORG_LINE2 = "Co. Ltd.     "
RELEASE_NOTES = "/release-notes for more"


def esc(s: str) -> str:
    return html.escape(s, quote=False)


def wrap(line: str, sub: str, cls: str, count: int = 1) -> str:
    return line.replace(sub, f'<span class="{cls}">{sub}</span>', count)


def wrap_all(line: str, cls: str) -> str:
    return f'<span class="{cls}">{line}</span>'


def detect_boxed_banner(lines: list[str], start: int) -> int | None:
    """`╭─── Claude Code ... ╮` 로 시작하는 11줄짜리 박스 배너. 끝 인덱스+1 반환."""
    if start >= len(lines) or not re.match(r"^╭─+.*Claude Code.*╮$", lines[start]):
        return None
    for j in range(start + 1, min(start + 20, len(lines))):
        if re.match(r"^╰─+╯$", lines[j]):
            return j + 1
    return None


def detect_compact_banner(lines: list[str], start: int) -> int | None:
    """픽토그램 3줄짜리 축약 배너(재접속 세션). 끝 인덱스+1 반환."""
    if start + 2 >= len(lines):
        return None
    if (
        PIG_TOP in lines[start]
        and PIG_MID in lines[start + 1]
        and PIG_BOT in lines[start + 2]
    ):
        return start + 3
    return None


def render_boxed_banner(lines: list[str]) -> list[str]:
    out = []
    for line in lines:
        line = esc(line)
        if re.match(r"^╭─+.*╮$", line) or re.match(r"^╰─+╯$", line):
            out.append(wrap_all(line, "t-accent"))
            continue
        n_pipes = line.count("│")
        if n_pipes >= 2:
            line = wrap(line, "│", "t-accent", n_pipes)
        line = wrap(line, PIG_TOP, "t-accent")
        line = wrap(line, PIG_MID, "t-accent")
        line = wrap(line, PIG_BOT, "t-accent")
        line = wrap(line, TIPS_HEADER, "t-accent")
        if "Welcome back" not in line:
            line = wrap(line, "started", "t-accent")
        line = wrap(line, WHATSNEW_HEADER, "t-accent")
        line = wrap(line, ORG_LINE, "t-dim")
        line = wrap(line, ORG_LINE2, "t-dim")
        line = wrap(line, RELEASE_NOTES, "t-status")
        m = re.search(r"Welcome back .+?!", line)
        if m:
            line = wrap(line, m.group(0), "t-white")
        out.append(line)
    return out


def render_compact_banner(lines: list[str]) -> list[str]:
    out = []
    for i, line in enumerate(lines):
        line = esc(line)
        if i == 0:
            line = wrap(line, PIG_TOP, "t-accent")
        elif i == 1:
            line = wrap(line, PIG_MID, "t-accent")
            line = wrap(line, "Sonnet 5", "t-dim")
        else:
            line = wrap(line, PIG_BOT, "t-accent")
        out.append(line)
    return out


def classify_transcript(raw: str) -> str:
    lines = raw.rstrip("\n").split("\n")
    out: list[str] = []
    i = 0
    n = len(lines)

    end = detect_boxed_banner(lines, 0)
    if end is not None:
        out.extend(render_boxed_banner(lines[0:end]))
        i = end
    else:
        end = detect_compact_banner(lines, 0)
        if end is not None:
            out.extend(render_compact_banner(lines[0:end]))
            i = end

    carry_class = None
    while i < n:
        raw_line = lines[i]
        stripped = raw_line.strip()
        line = esc(raw_line)

        if stripped == "":
            out.append(line)
            carry_class = None
        elif stripped.startswith("❯"):
            out.append(wrap_all(line, "t-user"))
            carry_class = "t-user"
        elif stripped.startswith("●"):
            out.append(wrap(line, "●", "t-accent"))
            carry_class = None
        elif stripped.startswith("✻"):
            out.append(wrap_all(line, "t-status"))
            carry_class = None
        elif stripped.startswith("※"):
            out.append(wrap_all(line, "t-status"))
            carry_class = "t-status"
        elif stripped.startswith("⎿"):
            cls = "t-error" if "error" in stripped.lower() else "t-dim"
            out.append(wrap_all(line, cls))
            carry_class = cls
        elif stripped == "---":
            out.append(wrap(line, "---", "t-dim"))
            carry_class = None
        elif "(ctrl+o to expand)" in stripped:
            out.append(wrap_all(line, "t-dim"))
            carry_class = None
        elif carry_class:
            out.append(wrap_all(line, carry_class))
        else:
            out.append(line)
        i += 1

    return "\n".join(out)


def build_block(term_body: str, label: str, window_title: str = "✳ Claude Code") -> str:
    accent_star = '<span class="t-accent">✳</span>'
    title_rest = window_title.replace("✳", "").strip()
    return f"""<details class="ailab-terminal">
<summary>{esc(label)}</summary>

<div class="ailab-term-window">
<div class="ailab-term-titlebar">
<span class="ailab-term-title">{accent_star} {esc(title_rest)}</span>
<span class="ailab-term-controls">
<span class="ic ic-search"></span>
<span class="ic ic-menu"></span>
<span class="ic ic-min"></span>
<span class="ic ic-max"></span>
<span class="ic ic-close"></span>
</span>
</div>
<pre class="ailab-term-body">{term_body}</pre>
</div>

</details>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="원문 터미널 트랜스크립트(.md/.txt)")
    parser.add_argument("target", type=Path, help="삽입할 대상 content/course/*.md")
    parser.add_argument(
        "--label", default="실행 로그 펼치기", help="summary 라벨 텍스트"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="대상에 이미 '## 실행 예시' 절이 있어도 다시 삽입",
    )
    args = parser.parse_args()

    target_text = args.target.read_text(encoding="utf-8")
    if HEADING in target_text and not args.force:
        print(f"이미 삽입되어 있습니다(건너뜀): {args.target}", file=sys.stderr)
        return 0

    raw = args.source.read_text(encoding="utf-8")
    term_body = classify_transcript(raw)
    block = build_block(term_body, args.label)

    sep = (
        ""
        if target_text.endswith("\n\n")
        else ("\n" if target_text.endswith("\n") else "\n\n")
    )
    new_text = target_text + sep + f"{HEADING}\n\n{INTRO}\n\n{block}"
    args.target.write_text(new_text, encoding="utf-8")
    print(f"삽입 완료: {args.target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
