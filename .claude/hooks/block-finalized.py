#!/usr/bin/env python3
"""PreToolUse 훅 - 사용자 최종 검수본 보호.

`FINALIZED.md` 의 "## 잠긴 파일" 섹션에서 **주석이 벗겨진** `- 경로` 줄만 "잠김"으로 본다.
그 위 설명·규칙(프로즈)과 `<!-- ... -->` 주석 줄은 무시한다. 잠긴 경로를 Edit/Write 로
고치려 하면 차단한다. 사용자가 편집기로 직접 고치는 것은 막지 않는다.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MANIFEST = os.path.join(ROOT, "FINALIZED.md")
HEADER = "## 잠긴 파일"
GUARDED_TOOLS = {"Edit", "Write", "MultiEdit", "NotebookEdit"}


def load_locked():
    locked = set()
    if not os.path.isfile(MANIFEST):
        return locked
    text = open(MANIFEST, encoding="utf-8").read()
    i = text.find(HEADER)
    if i == -1:
        return locked
    section = text[i + len(HEADER) :]
    section = re.sub(r"<!--.*?-->", "", section, flags=re.S)  # 주석 = 잠금 해제
    for line in section.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or s.startswith(">"):
            continue
        if s.startswith(("- ", "* ")):
            s = s[2:].strip()
        s = s.strip("`").strip()
        token = s.split()[0].strip("`") if s else ""
        if "/" in token:
            locked.add(os.path.normpath(token))
    return locked


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    if data.get("tool_name", "") not in GUARDED_TOOLS:
        sys.exit(0)
    ti = data.get("tool_input", {}) or {}
    path = ti.get("file_path") or ti.get("notebook_path")
    if not path:
        sys.exit(0)
    rel = os.path.normpath(os.path.relpath(os.path.abspath(path), ROOT))
    locked = load_locked()
    if rel in locked or os.path.normpath(path) in locked:
        sys.stderr.write(
            "차단: '%s' 는 FINALIZED.md 에 잠긴 최종 검수본입니다.\n"
            "수정하려면 FINALIZED.md 에서 그 줄을 주석 처리(또는 삭제)한 뒤 다시 시도하세요.\n"
            % rel
        )
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main()
