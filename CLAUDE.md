# 저장소 안내

두 가지가 한 저장소에 있습니다.

| | 무엇 | 손대는 범위 |
|---|---|---|
| **파이프라인** | `content/` 의 Markdown 을 MkDocs 로 빌드해 GitHub Pages 에 배포합니다 | `pipeline`, `tools/`, `site.yml`, `theme/` |
| **윤문 하네스** | `content/` 문서의 어체·표기를 상시로 다듬습니다 | `polish/`, `.claude/` |

둘은 분리되어 있습니다. 하네스는 파이프라인을 실행하지도, 수정하지도 않습니다.

## content/ 문서를 고칠 때

문서 본문을 고치는 작업(윤문·교정·개선)은 **`doc-polish` 스킬**로 합니다.
직접 고치기 전에 다음을 지킵니다.

1. **스냅샷 먼저** - `python3 polish/tools/snapshot.py create --note "..."`.
   되돌릴 수단 없이 문서를 고치지 않습니다.
2. **보호 구간을 건드리지 않습니다** - 코드 블록, 인라인 코드, 링크·이미지 경로,
   산문의 숫자·버전·날짜, H1, 헤딩 텍스트, `!!! warning`·`danger` 의 경고 사실,
   표의 데이터 셀. 목록과 이유는 `polish/style/checklist.md` 에 있습니다.
3. **고친 뒤 검증** - `python3 polish/tools/guard.py --only <경로>`.
   위반이 나오면 `--restore` 로 되돌립니다.
4. **기준 어체는 합니다체**입니다. 규범은 `polish/style/voice.md`,
   이미 내려진 판정은 `polish/style/active.md` 에 있습니다 - 작업 전에 읽습니다.

새 문서를 쓸 때는 `polish/style/page-types.md` 의 유형별 골격을 따릅니다.
리드 문단(H1 다음 첫 문단)은 필수입니다.

## 교안 작업 원칙

교안(사이트) 전반에 적용하는 작업 원칙은 `authoring-principles.md` 에 정리합니다 -
새 작업 전에 읽고 따릅니다.

한국어 작성을 위한 원칙은 `korean-principles.md` 에 저장합니다.

## 최종 검수본은 건드리지 않습니다

`FINALIZED.md` 는 `content/toc.yml` 의 모든 문서를 나열하되 **기본은 주석 처리(잠기지 않음)**
입니다. 사용자가 검수를 마친 문서만 그 줄의 주석을 벗겨 잠급니다.

주석이 벗겨진(`- 경로`) 파일은 사용자 최종 검수본입니다 - 명시적 지시 없이는 수정·삭제하지
않습니다. `.claude/hooks/block-finalized.py`(PreToolUse 훅)가 잠긴 경로의 Edit/Write 를 실제로
차단합니다. 고쳐야 하면 그 줄을 다시 주석 처리한 뒤 작업합니다.

목록은 `content/toc.yml` 과 동기화됩니다 - toc 를 편집하면 `.claude/hooks/sync-finalized.py`
(PostToolUse 훅)가 문서를 (주석 처리된 채) 추가하거나 삭제하고, 이미 잠가 둔 줄은 유지합니다.
수동 동기화는 `python3 .claude/hooks/sync-finalized.py sync`.

빌드된 사이트에서도 표시됩니다 - `tools/pipeline.py` 가 nav 를 만들 때 `FINALIZED.md` 를 읽어,
잠기지 않은(주석 처리된) 문서의 메뉴 제목 앞에 `(WIP) ` 를 붙입니다. 문서 파일 자체(H1)는
바뀌지 않고 메뉴 표시만 바뀝니다. 잠그면(주석을 벗기면) 다음 빌드부터 표시가 사라집니다.

## 하지 않는 것

- `content/toc.yml` 수정, 문서 파일명·경로 변경 - 목차와 배포된 주소가 걸려 있습니다.
- 하네스 작업 중 `./pipeline` 실행 - 첫 실행 시 `.venv` 생성과 의존성 설치가 일어납니다.
  빌드 확인은 사용자가 `./pipeline check` · `./pipeline preview` 로 합니다.
- `polish/tools/*.py` 에 외부 의존성 추가 - 표준 라이브러리만 씁니다.

## 되돌리기

```bash
python3 polish/tools/snapshot.py restore latest --all   # 이번 파 전체
git checkout pre-polish-harness -- content/             # 하네스 도입 이전 상태
```
