#!/usr/bin/env python3
"""손대기 전 content/ 의 마크다운 원본을 떠 둔다.

    python3 polish/tools/snapshot.py create --note "1파: 개념 3쪽 윤문"
    python3 polish/tools/snapshot.py list
    python3 polish/tools/snapshot.py diff latest
    python3 polish/tools/snapshot.py restore latest content/concepts/index.md
    python3 polish/tools/snapshot.py restore latest --all

git 이 있어도 이 도구는 남는다. 커밋 단위보다 잘게, '이번 파를 시작하기 직전'
상태로 되돌리기 위해서다. guard.py 도 이 스냅샷을 기준으로 회귀를 판정한다.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "content"
SNAPSHOTS = ROOT / "polish" / "snapshots"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def markdown_files():
    return sorted(CONTENT.rglob("*.md"))


def resolve(snapshot_id):
    """'latest' 를 실제 스냅샷 경로로 바꾼다."""
    if not SNAPSHOTS.exists():
        raise SystemExit("스냅샷이 없습니다. 먼저 create 를 실행하세요.")
    if snapshot_id in ("latest", "last", ""):
        candidates = sorted(
            p for p in SNAPSHOTS.iterdir() if (p / "manifest.json").exists()
        )
        if not candidates:
            raise SystemExit("스냅샷이 없습니다. 먼저 create 를 실행하세요.")
        return candidates[-1]
    target = SNAPSHOTS / snapshot_id
    if not (target / "manifest.json").exists():
        raise SystemExit(f"그런 스냅샷이 없습니다: {snapshot_id}")
    return target


def cmd_create(args):
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = SNAPSHOTS / stamp
    if target.exists():
        raise SystemExit(f"같은 이름의 스냅샷이 이미 있습니다: {stamp}")
    files = markdown_files()
    manifest = {"created": stamp, "note": args.note or "", "files": {}}
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        copy_to = target / "files" / rel
        copy_to.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, copy_to)
        manifest["files"][rel] = digest(path)
    target.mkdir(parents=True, exist_ok=True)
    (target / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"스냅샷 {stamp} - 문서 {len(files)}개")
    if args.note:
        print(f"메모: {args.note}")
    return 0


def cmd_list(args):
    if not SNAPSHOTS.exists():
        print("스냅샷 없음")
        return 0
    rows = sorted(p for p in SNAPSHOTS.iterdir() if (p / "manifest.json").exists())
    if not rows:
        print("스냅샷 없음")
        return 0
    for path in rows:
        manifest = json.loads((path / "manifest.json").read_text(encoding="utf-8"))
        print(
            f"{path.name}  문서 {len(manifest['files']):3d}개  {manifest.get('note', '')}"
        )
    return 0


def compare(snapshot):
    """스냅샷 대비 (변경, 추가, 삭제) 파일 목록."""
    manifest = json.loads((snapshot / "manifest.json").read_text(encoding="utf-8"))
    recorded = manifest["files"]
    current = {p.relative_to(ROOT).as_posix(): digest(p) for p in markdown_files()}
    changed = sorted(
        rel for rel, sha in current.items() if rel in recorded and recorded[rel] != sha
    )
    added = sorted(rel for rel in current if rel not in recorded)
    removed = sorted(rel for rel in recorded if rel not in current)
    return changed, added, removed


def replaced_wholesale(snapshot, added, removed):
    """콘텐츠 세트를 통째로 바꿔 끼운 상황인지 본다.

    README 가 안내하듯 content/ 는 다른 세트로 교체될 수 있다. 그때는 스냅샷 기준선이
    의미를 잃으므로, 윤문을 이어가지 말고 새 기준선을 떠야 한다.
    """
    manifest = json.loads((snapshot / "manifest.json").read_text(encoding="utf-8"))
    recorded = len(manifest["files"]) or 1
    return (len(added) + len(removed)) > recorded / 2


def cmd_diff(args):
    snapshot = resolve(args.snapshot)
    changed, added, removed = compare(snapshot)
    print(f"기준 스냅샷: {snapshot.name}")
    for label, items in (("변경", changed), ("추가", added), ("삭제", removed)):
        for rel in items:
            print(f"  {label}  {rel}")
    if not (changed or added or removed):
        print("  차이 없음")
    if replaced_wholesale(snapshot, added, removed):
        print(
            "\n  ! 문서가 대량으로 바뀌었습니다 - content/ 세트가 교체된 것으로 보입니다."
        )
        print("    이 스냅샷을 기준으로 윤문을 이어가지 말고 새 기준선을 뜨세요:")
        print('      python3 polish/tools/snapshot.py create --note "새 콘텐츠 세트"')
    return 0


def cmd_restore(args):
    snapshot = resolve(args.snapshot)
    manifest = json.loads((snapshot / "manifest.json").read_text(encoding="utf-8"))
    if args.all:
        targets = list(manifest["files"])
    else:
        targets = [Path(p).resolve().relative_to(ROOT).as_posix() for p in args.paths]
    if not targets:
        raise SystemExit("복원할 파일을 지정하거나 --all 을 쓰세요.")

    restored = []
    for rel in targets:
        source = snapshot / "files" / rel
        if not source.exists():
            print(f"  건너뜀 (스냅샷에 없음) {rel}")
            continue
        destination = ROOT / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        restored.append(rel)
    for rel in restored:
        print(f"  복원  {rel}")
    print(f"{len(restored)}개 문서를 {snapshot.name} 상태로 되돌렸습니다.")
    return 0


def cmd_prune(args):
    """오래된 스냅샷을 정리한다. 장기 이력은 git 이 맡는다."""
    if not SNAPSHOTS.exists():
        print("스냅샷 없음")
        return 0
    rows = sorted(p for p in SNAPSHOTS.iterdir() if (p / "manifest.json").exists())
    doomed = rows[: max(0, len(rows) - args.keep)]
    for path in doomed:
        shutil.rmtree(path)
        print(f"  삭제  {path.name}")
    print(f"{len(doomed)}개 삭제, {len(rows) - len(doomed)}개 남김")
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(description="content/ 마크다운 스냅샷")
    sub = parser.add_subparsers(dest="command", required=True)

    p_create = sub.add_parser("create", help="지금 상태를 스냅샷으로 뜬다")
    p_create.add_argument("--note", help="이번 파의 목적 한 줄")
    p_create.set_defaults(func=cmd_create)

    p_list = sub.add_parser("list", help="스냅샷 목록")
    p_list.set_defaults(func=cmd_list)

    p_diff = sub.add_parser("diff", help="스냅샷 대비 바뀐 문서")
    p_diff.add_argument("snapshot", nargs="?", default="latest")
    p_diff.set_defaults(func=cmd_diff)

    p_restore = sub.add_parser("restore", help="스냅샷 상태로 되돌린다")
    p_restore.add_argument("snapshot", nargs="?", default="latest")
    p_restore.add_argument("paths", nargs="*", help="되돌릴 문서 경로")
    p_restore.add_argument("--all", action="store_true", help="스냅샷의 모든 문서")
    p_restore.set_defaults(func=cmd_restore)

    p_prune = sub.add_parser("prune", help="오래된 스냅샷 정리")
    p_prune.add_argument("--keep", type=int, default=10, help="남길 개수 (기본 10)")
    p_prune.set_defaults(func=cmd_prune)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
