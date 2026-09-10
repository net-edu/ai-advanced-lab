#!/usr/bin/env python3
"""HTML 시뮬레이터 파일을 content/course/assets/ 로 복사하면서, 지정한 문자열만
정확히 1회씩 치환한다(예: CDN script 태그 → 벤더링된 로컬 경로).

표준 라이브러리만 쓴다. 원본을 바이트 단위로 그대로 옮기는 것이 목적이라, 손으로
옮겨 적지 않고 이 스크립트로 복사한다 - 786줄짜리 파일을 사람이 옮겨 적으면
공백·특수문자 하나로 시뮬레이터가 깨질 수 있다.

사용법:
    python3 copy_and_rewire.py <원본.html> <대상.html> \
        --replace '<script src="https://cdn.../lib.min.js"></script>' \
                  '<script src="vendor/lib.min.js"></script>'

--replace 는 여러 번 줄 수 있다. 각 OLD 문자열이 원본에 정확히 1회 나타나야 하며,
아니면(0회 또는 2회 이상) 에러로 중단한다 - 의도치 않은 부분 치환을 막는 안전장치다.
--replace 를 하나도 안 주면 완전 동일 복사(diff 결과가 없어야 정상)다.
"""

import argparse
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("dest", type=Path)
    parser.add_argument(
        "--replace",
        nargs=2,
        action="append",
        metavar=("OLD", "NEW"),
        default=[],
        help="원본에 정확히 1회 나타나야 하는 문자열과 그 대체값",
    )
    args = parser.parse_args()

    text = args.source.read_text(encoding="utf-8")
    for old, new in args.replace:
        count = text.count(old)
        if count != 1:
            print(
                f"중단: '{old[:60]}...' 이 원본에 {count}회 나타납니다(정확히 1회여야 함).",
            )
            return 1
        text = text.replace(old, new, 1)

    args.dest.parent.mkdir(parents=True, exist_ok=True)
    args.dest.write_text(text, encoding="utf-8")
    print(f"복사 완료: {args.dest} ({len(text)} bytes, 치환 {len(args.replace)}건)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
