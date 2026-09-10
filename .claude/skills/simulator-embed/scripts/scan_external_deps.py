#!/usr/bin/env python3
"""HTML 시뮬레이터 파일이 참조하는 외부(CDN) 리소스를 찾는다.

표준 라이브러리만 쓴다. 삽입 전에 먼저 돌려, 벤더링(로컬로 받아 두기)이
필요한지 사용자에게 물어볼 근거로 쓴다.

사용법:
    python3 scan_external_deps.py <simulator.html>

종료 코드: 외부 참조가 있으면 1, 없으면 0 (있고 없음을 스크립트로 분기하기 쉽게).
"""

import argparse
import re
import sys
from pathlib import Path

EXTERNAL_SRC = re.compile(
    r'<(?:script|link)\b[^>]*\b(?:src|href)\s*=\s*["\'](https?://[^"\']+)["\']',
    re.IGNORECASE,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    args = parser.parse_args()

    text = args.html.read_text(encoding="utf-8")
    urls = EXTERNAL_SRC.findall(text)

    if not urls:
        print("외부(CDN) 참조 없음 - 그대로 복사해도 폐쇄망에서 동작합니다.")
        return 0

    print(f"외부(CDN) 참조 {len(urls)}건 발견 - 벤더링 여부를 사용자에게 확인하세요:")
    for u in urls:
        print(f"  - {u}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
