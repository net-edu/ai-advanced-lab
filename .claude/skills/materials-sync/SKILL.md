---
name: materials-sync
description: content/**/*.md 전체를 훑어 content/curriculum/index.md 에 아직 없는 외부·사내 링크·다운로드 파일·시뮬레이터·이미지를 찾아, 이미 실린 것은 건너뛰고 새로 발견된 것만 표에 추가한다. "새 자료 있는지 확인해줘", "링크 갱신해줘", "커리큘럼 자료 동기화", "새로 생긴 자료 카탈로그에 추가" 같은 반복 실행 요청에 쓴다.
---

# Materials Sync

`content/curriculum/index.md` 는 4개 표(외부·사내 링크 / 다운로드 자료 / 시뮬레이터 / 개념
설명 이미지·다이어그램)로 학습자료를 카탈로그화한다. 이 스킬은 그 카탈로그를 **최신 상태로
동기화**한다 - `content/` 전체를 다시 훑어, 아직 카탈로그에 없는 항목만 찾아 해당 표 끝에
덧붙인다. 이미 실려 있는 항목은 건드리지 않는다.

최초로 자료를 정리하고 각 문서에 백링크까지 다는 대화형 작업은 이 스킬의 몫이 아니다 -
그건 [materials-catalog](../materials-catalog/SKILL.md) 가 한다. 이 스킬은 **무인 diff 갱신**
전용이며 백링크는 달지 않는다.

## 이 스킬이 하지 않는 것

- `content/toc.yml` 수정, 문서 파일 추가·삭제·이동, 자료 파일 자체 변형.
- 호스팅 문서에 백링크 추가 - 필요하면 사용자에게 [materials-catalog] 실행을 제안한다.
- `tools/`·`pipeline`·`site.yml`·`theme/` 수정, `./pipeline` 실행.
- 기존 표의 행을 고치거나 순서를 바꾸는 것 - **추가만** 한다.

## 절차

### 0. 스냅샷

```bash
python3 polish/tools/snapshot.py create --note "materials-sync: 신규 자료 갱신"
```

### 1. 새 후보를 찾는다 (읽기 전용, 결정적)

```bash
.venv/bin/python3 .claude/skills/materials-sync/scripts/find_new_materials.py
```

`.venv` 가 없다면 `python3 -c "import yaml"` 로 PyYAML 이 있는 아무 인터프리터나 써도 된다.
이 스크립트는 파일을 하나도 고치지 않는다 - `content/curriculum/index.md` 안의 모든 링크·
이미지 타깃을 "이미 관리 중"으로 간주하고, `content/**/*.md` (index.md 자신은 제외) 를 훑어
그 집합에 없는 링크·이미지만 JSON 으로 보고한다. 인라인 코드(`` `...` ``)와 펜스 코드 블록
안의 예시 문법은 대상에서 제외한다.

카테고리 분류:

| category | 판정 기준 | index.md 절 |
|---|---|---|
| `link` | `[text](http...)`, 사이트 자신(`site_url`)이 아닌 도메인 | 1. 외부·사내 링크 |
| `download` | 상대경로가 `.zip` 로 끝나거나 `{ download }` 속성 | 2. 다운로드 자료 |
| `simulator` | 상대경로가 `.html` 로 끝나고 `/assets/` 를 포함 | 3. 시뮬레이터 |
| `image` | `![alt](path)` 이고 경로가 `media/` 아래 | 4. 개념 설명 이미지·다이어그램 |

`total_new`가 0이면 4번으로 건너뛰고 "새로 찾은 자료 없음"을 보고한다.

### 2. 각 후보의 행을 직접 작성한다

스크립트가 주지 못하는 건 **판단이 필요한 두 칸**뿐이다 - 나머지(위치 브레드크럼, 문서
URL, 자료 링크 경로)는 이미 스크립트 출력에 들어 있다.

- **자료(1열)**: 후보의 `text`(링크 텍스트)를 그대로 쓰거나, 링크 텍스트가 짧고 코드조각이면
  더 읽기 좋은 이름으로 바꾼다.
- **목적(3열 설명)**: `context`(원문 줄)와 필요하면 `hosting_doc` 을 열어 왜 이 자료가
  쓰였는지 한 문장으로 요약한다. 기존 표의 문장 톤(합니다체, "~을 보여줍니다/비교합니다/
  분석하는 팀원입니다" 류의 짧은 서술)을 그대로 따른다.

행 형식은 카테고리별로 링크 텍스트만 다르고 나머지는 같다:

```
| {자료명} | [{hosting_breadcrumb}]({hosting_url}) | {목적 한 문장}. [{링크텍스트}]({index.md 기준 상대경로 또는 절대 URL}) |
```

| category | 링크텍스트 |
|---|---|
| `link` | 바로가기 |
| `download` | 다운로드 (또는 원본 표 관례를 따라 내려받기) |
| `simulator` | 열기 |
| `image` | 이미지 보기 |

`{index.md 기준 상대경로}` 계산: `target_resolved` 가 `http` 로 시작하면 그대로 쓴다.
아니면 `content/curriculum/index.md` 도 `content/` 바로 아래 있으므로, `target_resolved`
앞에 `../` 하나만 붙이면 된다 (예: `media/claude_code/bottle_neck.png` →
`../media/claude_code/bottle_neck.png`).

### 3. FINALIZED 잠금을 확인한다

```bash
grep -n "curriculum/index.md" FINALIZED.md
```

`- content/curriculum/index.md` (주석 없음) 이면 잠긴 것이다. 편집 전에 그 줄만 주석 처리해
풀고, 편집이 끝나면 다시 주석을 벗겨 잠근다. 사용자가 병렬로 파일을 편집·잠금 토글 중일 수
있으니, 토글 직전에 상태를 다시 확인한다.

### 4. 표에 행을 추가한다

카테고리별로 해당 절("## 1. 외부·사내 링크" 등)의 **표 마지막 행 바로 다음 줄**에 새 행을
붙인다. 기존 행은 순서·내용 모두 그대로 둔다. 후보가 없는 카테고리의 절은 건드리지 않는다.

### 5. 검증

```bash
python3 polish/tools/guard.py --only content/curriculum/index.md --mode revise
```

추가만 있고(사라짐·표 데이터 변경·H1 변경 없이) 새 행만 생겼다면 정상이다. 이어서 깨진
링크가 없는지 상대경로로 확인한다.

```bash
python3 - <<'PY'
import re, os
doc = "content/curriculum/index.md"
base = os.path.dirname(doc)
link_re = re.compile(r"\]\((?!https?:|#)([^)\s]+)")
bad = 0
for m in link_re.finditer(open(doc, encoding="utf-8").read()):
    url = m.group(1).split("#")[0]
    if url and not os.path.exists(os.path.normpath(os.path.join(base, url))):
        print("MISSING:", url); bad += 1
print("깨진 링크:", bad)
PY
```

### 6. 보고

카테고리별로 몇 개를 추가했는지, 어떤 문서에서 찾았는지 알린다. 백링크는 달지 않았다는 점과,
필요하면 [materials-catalog] 로 백링크를 추가할 수 있다는 점을 언급한다. 빌드 확인
(`./pipeline check`·`preview`)은 사용자가 한다 - 스킬은 실행하지 않는다.

## 멈춰야 할 때

- 스냅샷 생성 실패 → 아무것도 고치지 않고 보고.
- `curriculum/index.md` 가 잠겨 있는데 사용자가 병렬로 편집·되잠금 중 → 건드리지 말고
  무엇이 남았는지 알린 뒤 사용자 지시를 기다린다.
- guard 에 **추가가 아닌** 위반(사라짐·표 데이터 변경 등)이 뜨면 → 되돌리고 원인을 확인한다.
- 후보가 실제로는 자료가 아니라고 판단되면(예: 예시로 든 가짜 URL, 이 저장소를 가리키는
  자기참조) 표에 넣지 않고 왜 제외했는지 보고에 적는다.
