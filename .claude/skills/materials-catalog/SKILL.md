---
name: materials-catalog
description: 프로젝트의 실습 파일·시각화 자료(시뮬레이터 HTML·다운로드 zip 등)를 content/curriculum/index.md 에 표로 카탈로그화하고, 각 자료를 호스팅하는 문서에 그 목록으로 돌아오는 백링크를 단다. "자료 백링크 걸어줘", "실습 자료 목록 정리해줘", "시뮬레이터 카탈로그 갱신", "자료 표로 모아줘" 같은 요청에 쓴다.
---

# Materials Catalog

`content/` 안에서 쓰는 **실습 파일·시각화 자료**를 한자리(`content/curriculum/index.md`)에
표로 모으고, 각 자료가 놓인 문서에 그 목록으로 돌아오는 **백링크**를 다는 작업을 조율한다.
카탈로그(정방향 링크)와 백링크(역방향 링크)를 함께 두어 양방향으로 오갈 수 있게 만든다.

이 스킬은 자료를 만들지 않는다. 이미 있는 자료를 **발견·정리·연결**만 한다. 자료 자체를
만드는 것은 [simulator-embed]·[terminal-embed] 스킬의 몫이다.

## 자료의 범위

- **대상(기본):** `content/**/assets/` 아래 비-md 파일 - 인터랙티브 시뮬레이터(`*.html`),
  다운로드 실습 파일(`*.zip`). 문서가 실제로 링크·임베드하는 것만 센다.
- **선택:** `content/media/` 의 다이어그램·스크린샷 이미지. 범위가 커지므로 **기본은 제외**하고,
  포함할지 사용자에게 묻는다.
- **제외:** `assets/vendor/` 같은 서드파티 자원, 어떤 문서도 참조하지 않는 고아 파일.

## 절대 하지 않는 것

- `content/toc.yml` 수정, 파일 추가·삭제·이동, 자료 파일 자체 변형.
- `tools/`·`pipeline`·`site.yml`·`theme/` 수정, `./pipeline` 실행.
- 마크다운 원문에 `{target=_blank}` 를 손으로 달기 - 새 탭 열기는 빌드 때
  `theme/javascripts/link-target.js` 가 자동으로 붙인다(`authoring-principles.md`).
  단 zip 다운로드 링크의 `{ download }` 는 탭이 아니라 다운로드 동작이라 유지한다.

## 절차

### 0. 스냅샷

되돌릴 수단 없이 문서를 고치지 않는다.

```bash
python3 polish/tools/snapshot.py create --note "자료 카탈로그+백링크: {대상 요약}"
```

### 1. 자료와 호스팅 문서를 발견한다

```bash
# assets 아래 비-md 자료
find content -type f ! -name "*.md" -path "*/assets/*" | grep -v "/vendor/" | sort
# 어느 문서가 그 자료를 참조하는가
grep -rn "assets/\|\.zip\|simulator\|시뮬레이터" content --include="*.md" | sort
```

자료마다 (자료 파일 경로, 유형, 호스팅 문서, 문서 안 참조 위치)를 표로 정리한다. 유형은
`시뮬레이터`·`실습 파일(zip)` 처럼 한 낱말로 통일한다.

### 2. 범위를 확정한다

시뮬레이터·실습 파일만 할지, `content/media/` 이미지까지 넣을지 사용자에게 확인한다.
자료가 5개를 넘으면 카탈로그가 길어지므로, 묶는 기준(코스 순서 등)을 먼저 정한다.

### 3. 카탈로그 표를 `content/curriculum/index.md` 에 넣는다

`## 관련 문서` 앞에 `## 실습 파일 · 시각화 자료` 절을 두고, 리드 문단 뒤에 표를 놓는다.
열은 **자료 | 유형 | 쓰이는 곳 | 열기** 네 개. 링크는 `index.md` 기준 상대경로다.

```markdown
## 실습 파일 · 시각화 자료

이 과정에서 쓰는 실습 파일과 시각화 자료를 한자리에 모았습니다.

각 자료가 어느 문서에서 쓰이는지와, 바로 여는 링크를 함께 둡니다.

| 자료 | 유형 | 쓰이는 곳 | 열기 |
|---|---|---|---|
| 터미널 · 파일탐색기 비교 시뮬레이터 | 시뮬레이터 | [터미널 기초](../warmup/terminal-basics.md) | [열기](../warmup/assets/terminal-file-explorer-simulator.html) |
| git-practice 실습 저장소 | 실습 파일(zip) | [Git 기초](../warmup/git-basics.md) | [내려받기](../warmup/assets/git-practice.zip){ download } |
```

- `쓰이는 곳` 은 호스팅 문서로, `열기` 는 자료 파일로 링크한다.
- 코스 순서(warmup → stage3~6)대로 행을 놓으면 읽기 쉽다.
- 표 아래에 백링크가 걸려 있다는 한 줄을 덧붙인다.

### 4. 호스팅 문서마다 백링크를 단다

자료가 참조되는 자리(시뮬레이터 버튼·다운로드 링크) 바로 뒤에 한 줄을 넣는다. 문구는
문서마다 통일한다.

```markdown
이 시뮬레이터를 포함한 전체 실습·시각화 자료 목록은 [강의 진행 자료](../curriculum/index.md)에 있습니다.
```

- 실습 파일(zip)이면 "이 파일을 포함한 …" 으로 바꾼다.
- 경로는 `content/course/`·`content/warmup/` 어디서든 `../curriculum/index.md` 로 같다.

### 5. FINALIZED 잠금 처리

호스팅 문서가 `FINALIZED.md` 에 잠겨 있으면(`- 경로`), 그 줄을 주석 처리해 풀고 → 편집 →
다시 주석을 벗겨 잠근다. `.claude/hooks/block-finalized.py` 가 잠긴 문서의 Edit 를 실제로
차단한다.

```bash
grep -n "warmup/git-basics.md" FINALIZED.md   # 잠금 상태 확인
```

**주의:** 사용자가 문서·`FINALIZED.md` 를 병렬로 편집 중일 수 있다. 잠금을 토글하기 전에
현재 상태를 다시 확인하고, 방금 잠근 파일을 사용자가 되잠갔다면 그 뜻을 존중해 멈추고
확인한다. 잠금 줄을 오가며 사용자 편집과 경쟁하지 않는다.

### 6. 검증

```bash
python3 polish/tools/guard.py --only {편집한 경로들} --mode revise
```

- 보호 구간 위반이 **추가(생김)만** 이고 사라짐·코드블록 변경·H1 변경이 없으면, 이는 링크·표를
  더한 정상 결과다. 저작 작업이라 `revise` 모드로 헤딩·링크 추가를 허용한다.
- 이어서 새 링크가 실제 파일을 가리키는지 상대경로로 확인한다(끊긴 링크 0이어야 한다).

```bash
python3 - <<'PY'
import re, os
docs = ["content/curriculum/index.md"]  # + 편집한 호스팅 문서들
link_re = re.compile(r"\]\((?!https?:|#)([^)\s]+)")
bad = 0
for doc in docs:
    base = os.path.dirname(doc)
    for m in link_re.finditer(open(doc, encoding="utf-8").read()):
        url = m.group(1).split("#")[0]
        if url and not os.path.exists(os.path.normpath(os.path.join(base, url))):
            print("MISSING:", doc, "→", url); bad += 1
print("깨진 링크:", bad)
PY
```

### 7. 보고

카탈로그에 넣은 자료 수, 백링크를 단 문서, 잠금을 풀었다 되잠근 문서를 알린다.
빌드 확인(`./pipeline check`·`preview`)은 사용자가 한다 - 스킬은 실행하지 않는다.

## 멈춰야 할 때

- 스냅샷 생성 실패 → 아무것도 고치지 않고 보고.
- 호스팅 문서가 잠겨 있는데 사용자가 병렬로 편집·되잠금 중 → 그 문서는 건드리지 말고,
  무엇이 남았는지 알린 뒤 사용자 지시를 기다린다.
- guard 에 사라짐·코드블록 변경 등 **추가가 아닌** 위반이 뜨면 → 되돌리고 원인을 확인한다.
