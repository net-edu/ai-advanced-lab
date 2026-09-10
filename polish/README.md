# 윤문 하네스

`content/` 안 문서를 에이전트가 **교정 · 윤문 · 개선**하는 장치입니다.
파이프라인(`./pipeline`, `tools/`, `site.yml`, `theme/`)과 완전히 분리되어 있습니다.

## 독립성 계약

| 항목 | 계약 |
|---|---|
| 쓰기 범위 | `content/**/*.md` 의 본문과 `polish/**` 뿐입니다. 예외는 루트 `README.md`·`CLAUDE.md` 의 **하네스 안내 부분**입니다 - 하네스가 저장소의 상설 구성원이므로 그 사실이 저장소 문서에 적혀 있어야 합니다 |
| 읽기만 | `tools/` · `pipeline` · `pipeline.cmd` · `site.yml` · `theme/` · `pyproject.toml` · `.build/` |
| 손대지 않음 | `content/toc.yml`, 파일명·경로·디렉터리 구조 |
| 파이프라인 미실행 | 하네스는 `./pipeline` 을 실행하지 않습니다. 첫 실행 시 `.venv` 생성과 MkDocs 설치라는 부작용이 있습니다 |
| 의존성 | `python3` 표준 라이브러리만 씁니다. `pyproject.toml`·`.venv` 에 기대지 않습니다 |
| 빌드 비가시성 | 파이프라인은 `content/` 와 `theme/` 만 `.build/src` 로 복사합니다. `polish/`·`.claude/` 는 빌드에 들어가지 않습니다 |
| 비침습 | 파이프라인은 하네스가 없어도 그대로 돕니다. 하네스는 파이프라인의 전제 조건이 아닙니다 |

검수가 끝나면 **사용자가** `./pipeline check` 와 `./pipeline preview` 로 확인합니다.

독립은 **분리**이지 **일회용**이라는 뜻이 아닙니다. `content/` 는 계속 바뀌고 새 문서가
계속 들어오므로, 하네스는 그때마다 다시 도는 상설 장치입니다. 아래 "수명과 유지보수" 를
보세요.

## 구성

```
polish/
├── style/
│   ├── voice.md        기준 어체와 금지 표현
│   ├── checklist.md    검수 항목·임계값·보호 구간
│   ├── page-types.md   페이지 유형별 골격
│   ├── glossary.md     용어 표기 (measure.py 가 읽는 입력이기도 합니다)
│   └── active.md       확정 판정 누적 - 작업 전 필독
├── tools/
│   ├── mdtext.py       공용 마크다운 파서
│   ├── measure.py      계량 (판정하지 않습니다)
│   ├── snapshot.py     원본 스냅샷·복원
│   └── guard.py        보호 구간 회귀 검증·롤백
├── snapshots/          스냅샷 (git 이 있어도 파 단위로 더 잘게 되돌리기 위해)
└── log.md              검수·적용 기록 (덧붙이기만)
```

에이전트와 스킬은 `.claude/` 에 있습니다 - `style-guardian`(제안), `copy-editor`(적용),
`doc-polish`(전 과정), `style-review`(검수 절차).

## 세 가지 모드

| 모드 | 하는 일 | 승인 |
|---|---|---|
| **교정** proofread | 오탈자·띄어쓰기·용어 표기·마크다운 문법 | 가드만 통과하면 반영 |
| **윤문** polish | 어체 통일·군더더기 제거·긴 문장 분리·이중 피동 | 문서 단위 승인 |
| **개선** revise | 문단 재배치·절 신설·헤딩 변경·설명 보강 | 항목별 승인 (기본 꺼짐) |

지시가 없으면 **교정 + 윤문**까지만 합니다.

## 쓰는 법

```bash
python3 polish/tools/measure.py                      # 지금 상태 계량
python3 polish/tools/measure.py --detail content/mcp/index.md

python3 polish/tools/snapshot.py create --note "1파: 개념 3쪽"
#   ... 여기서 에이전트가 문서를 고칩니다 ...
python3 polish/tools/guard.py --only content/concepts # 보호 구간 검증
python3 polish/tools/guard.py --restore               # 위반 문서 롤백
python3 polish/tools/snapshot.py restore latest --all  # 이번 파 전체 되돌리기
```

에이전트에게는 이렇게 시킵니다.

```
content/concepts 세 쪽을 윤문해줘        →  doc-polish 스킬이 P0~P6 을 돕니다
content/mcp/index.md 교정만 해줘          →  교정 모드
```

## 절차

| 단계 | 하는 일 | 누가 |
|---|---|---|
| P0 | 대상 확정 · 스냅샷 · `style/` 와 `active.md` 필독 | doc-polish |
| P1 | `measure.py` 로 계량, 우선순위 결정 | doc-polish |
| P2 | 문서당 5~10건 제안 (원문 인용 → 대안 → 이유) | style-guardian |
| P3 | 승인된 제안만 반영. 제안에 없는 곳은 건드리지 않음 | copy-editor |
| P4 | `guard.py` 로 보호 구간 검증. 위반은 즉시 롤백 | guard.py |
| P5 | 재계량 · 결과를 `log.md` 에 기록 · 확정 판정을 `active.md` 에 | doc-polish |
| P6 | 변경 요약 보고. `./pipeline check` 는 **사용자가** 실행 | doc-polish |

한 파는 문서 3~5쪽입니다. 파가 끝나면 `active.md` 가 갱신되고, 다음 파가 그걸 읽습니다.

## 수명과 유지보수

하네스는 한 번 돌고 마는 도구가 아닙니다. 문서가 바뀌는 한 계속 씁니다.
그래서 다음 것들이 시간이 지나며 쌓이거나 낡습니다.

| 대상 | 어떻게 관리하나 |
|---|---|
| **작업 대상** | 전체를 매번 훑지 않습니다. `snapshot.py diff` 로 **지난 파 이후 바뀐 문서**만 고릅니다 |
| **스냅샷** | 계속 쌓입니다. `snapshot.py prune --keep 10` 으로 오래된 것을 정리합니다 (git 이 장기 이력을 맡습니다) |
| **`log.md`** | 덧붙이기만 합니다. 길어져도 자르지 않습니다 - 같은 문서를 다시 검수할 때 이전 라운드를 봐야 합니다 |
| **`active.md`** | 판정이 쌓입니다. 같은 판정이 세 번 이상 반복되면 규범(`voice.md`·`checklist.md`)으로 **승격**하고 `active.md` 에서는 승격 사실만 남깁니다 |
| **규범** | 문서 유형이 늘거나 용어가 바뀌면 `style/` 을 고칩니다. 고친 내용은 아래 변경 이력에 남깁니다 |
| **콘텐츠 세트 교체** | `content/` 를 통째로 바꿔 끼우면(`sample_src/` 의 다른 세트 등) 스냅샷 기준선이 무의미해집니다. `snapshot.py diff` 가 대량 추가·삭제를 감지해 알려 주므로, 새 기준선을 뜨고 시작합니다 |

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-08-25 | 하네스 구축 (안전망 4종 · 규범 5종 · 에이전트 2 · 스킬 2) |
| 2026-08-25 | 상설 운영 전제로 보정 - '제거 가능' 을 '비침습' 으로 교체, 델타 기반 대상 선정, `snapshot.py prune`, 규범 승격 규칙, 루트 `README.md`·`CLAUDE.md` 에 하네스 안내 추가 |
