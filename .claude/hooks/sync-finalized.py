#!/usr/bin/env python3
"""FINALIZED.md 의 "## 잠긴 파일" 목록을 content/toc.yml 과 동기화한다.

목록의 각 줄은 **기본으로 주석 처리**(잠기지 않음)로 생성한다. 이미 주석이 벗겨진(잠긴)
줄은 동기화 후에도 유지한다. toc 에 문서가 추가되면 주석 처리된 채로 목록에 붙고, 삭제되면
목록에서 빠진다. 헤딩 위 설명은 보존한다.

  - 수동: python3 .claude/hooks/sync-finalized.py sync
  - 훅:   PostToolUse. stdin 의 편집 대상이 content/toc.yml 일 때만 동기화.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOC = os.path.join(ROOT, "content", "toc.yml")
MANIFEST = os.path.join(ROOT, "FINALIZED.md")
HEADER = "## 잠긴 파일"

GEN_NOTE = [
    "<!-- 이 목록은 content/toc.yml 과 동기화됩니다(.claude/hooks/sync-finalized.py). -->",
    "<!-- 각 줄은 기본으로 주석 처리되어 잠기지 않습니다. 특정 문서를 잠그려면 그 줄의 주석 기호를 벗기세요. -->",
    "<!-- 동기화해도 이미 잠가 둔(주석을 벗긴) 줄은 그대로 유지됩니다. -->",
]

DEFAULT_PREAMBLE = "# 최종 검수본 (수정 잠금)\n\n" + HEADER


def toc_docs():
    docs = []
    try:
        import yaml
        data = yaml.safe_load(open(TOC, encoding="utf-8"))

        def walk(n):
            if isinstance(n, list):
                for x in n:
                    walk(x)
            elif isinstance(n, dict):
                for _, v in n.items():
                    walk(v) if not isinstance(v, str) else docs.append(v)
            elif isinstance(n, str):
                docs.append(n)

        walk(data)
    except Exception:
        for line in open(TOC, encoding="utf-8"):
            m = re.search(r"([A-Za-z0-9_./-]+\.md)\s*$", line)
            if m:
                docs.append(m.group(1))
    seen, ordered = set(), []
    for d in docs:
        p = os.path.normpath("content/" + d)
        if p not in seen:
            seen.add(p)
            ordered.append(p)
    return ordered


def section_and_preamble():
    if os.path.isfile(MANIFEST):
        text = open(MANIFEST, encoding="utf-8").read()
        i = text.find(HEADER)
        if i != -1:
            return text[: i + len(HEADER)], text[i + len(HEADER):]
    return DEFAULT_PREAMBLE, ""


def current_locked(section):
    section = re.sub(r"<!--.*?-->", "", section, flags=re.S)
    locked = set()
    for line in section.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or s.startswith(">"):
            continue
        if s.startswith(("- ", "* ")):
            s = s[2:].strip()
        token = s.split()[0].strip("`") if s else ""
        if "/" in token:
            locked.add(os.path.normpath(token))
    return locked


def regenerate():
    preamble, section = section_and_preamble()
    locked = current_locked(section)
    docs = toc_docs()
    lines = [preamble.rstrip(), ""] + GEN_NOTE + [""]
    for p in docs:
        lines.append(("- " + p) if p in locked else ("<!-- - " + p + " -->"))
    lines.append("")
    open(MANIFEST, "w", encoding="utf-8").write("\n".join(lines))
    return sum(1 for p in docs if p in locked), len(docs)


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "sync":
        n_locked, n = regenerate()
        sys.stderr.write("동기화 완료: 문서 %d개(잠김 %d개)\n" % (n, n_locked))
        sys.exit(0)
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    fp = (data.get("tool_input") or {}).get("file_path", "")
    if fp and os.path.normpath(os.path.abspath(fp)) == os.path.normpath(TOC):
        regenerate()
    sys.exit(0)


if __name__ == "__main__":
    main()
