#!/usr/bin/env python3
"""예시 코드/설정 파일 원문을 에디터 창 위젯으로 감싸, content/ 문서에
접기/펼치기(<details class="ailab-code">) 블록으로 삽입한다.

표준 라이브러리만 쓴다(CLAUDE.md: polish/tools 원칙과 동일하게 이 스킬도 외부
의존성을 추가하지 않는다).

사용법:
    python3 embed_code_window.py <원문 파일> <대상 .md 파일> \
        --label "코드 예시 펼치기 - pr-summary SKILL.md" \
        --filename ".claude/skills/pr-summary/SKILL.md" \
        [--lang yaml] \
        [--after-heading "## (심화) frontmatter 필드"] \
        [--force]

`--after-heading` 을 주면 그 제목이 딸린 절의 **끝**(다음 헤딩 직전)에 삽입한다.
생략하면 파일 맨 끝에 덧붙인다.

같은 `--label` 이 대상 파일에 이미 있으면 중복 삽입을 막기 위해 아무 것도
하지 않고 종료한다(재실행 안전, `--force` 로 강제 가능).
"""

import argparse
import sys
from pathlib import Path


def build_block(label: str, filename: str, lang: str, code: str) -> str:
    fence = f"```{lang}" if lang else "```"
    return (
        f'<details class="ailab-code" markdown="1">\n'
        f"<summary>{label}</summary>\n"
        f"\n"
        f'<div class="ailab-code-window">\n'
        f'<div class="ailab-code-titlebar">\n'
        f'<span class="ailab-code-dots"><span></span><span></span><span></span></span>\n'
        f'<span class="ailab-code-filename">{filename}</span>\n'
        f"</div>\n"
        f"\n"
        f"{fence}\n"
        f"{code.rstrip()}\n"
        f"```\n"
        f"\n"
        f"</div>\n"
        f"</details>\n"
    )


def insert(text: str, block: str, after_heading: str | None) -> str:
    if after_heading is None:
        sep = "" if text.endswith("\n\n") else ("\n" if text.endswith("\n") else "\n\n")
        return text + sep + block + "\n"

    lines = text.splitlines(keepends=True)
    target = after_heading.strip()
    start = None
    for i, line in enumerate(lines):
        if line.strip() == target:
            start = i
            break
    if start is None:
        raise SystemExit(f"'{after_heading}' 헤딩을 대상 파일에서 찾지 못했습니다")

    end = len(lines)
    for i in range(start + 1, len(lines)):
        if lines[i].lstrip().startswith("#"):
            end = i
            break

    # 절 끝의 연속된 빈 줄은 하나만 남기고, 그 뒤에 블록을 끼워 넣는다.
    while end > start + 1 and lines[end - 1].strip() == "":
        end -= 1

    before = "".join(lines[:end])
    after = "".join(lines[end:])
    if not before.endswith("\n\n"):
        before += "\n" if before.endswith("\n") else "\n\n"
    return before + block + "\n" + after


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="삽입할 코드/설정 원문 파일")
    parser.add_argument("target", type=Path, help="대상 content/*.md 파일")
    parser.add_argument("--label", required=True, help="<summary> 에 쓸 펼치기 라벨")
    parser.add_argument("--filename", required=True, help="타이틀바에 보여줄 파일 경로")
    parser.add_argument(
        "--lang", default="", help="펜스 코드 언어 태그 (생략 시 무강조)"
    )
    parser.add_argument(
        "--after-heading", default=None, help="이 헤딩이 속한 절 끝에 삽입"
    )
    parser.add_argument(
        "--force", action="store_true", help="같은 라벨이 있어도 강제 삽입"
    )
    args = parser.parse_args(argv)

    code = args.source.read_text(encoding="utf-8")
    target_text = args.target.read_text(encoding="utf-8")

    if not args.force and f"<summary>{args.label}</summary>" in target_text:
        print(f"이미 '{args.label}' 블록이 있습니다 - 건너뜁니다 (재실행 안전)")
        return 0

    block = build_block(args.label, args.filename, args.lang, code)
    new_text = insert(target_text, block, args.after_heading)
    args.target.write_text(new_text, encoding="utf-8")
    print(f"{args.target} 에 '{args.label}' 블록을 삽입했습니다")
    return 0


if __name__ == "__main__":
    sys.exit(main())
