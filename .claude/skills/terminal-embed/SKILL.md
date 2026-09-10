---
name: terminal-embed
description: 실제 Claude Code 세션 로그(원문 텍스트)를 Ubuntu 24.04 톤 터미널 창처럼 디자인해 content/course/ 문서 하단에 접기/펼치기 위젯으로 붙인다. "실행 결과 넣어줘", "터미널 로그 붙여줘", "실제 실행한 것처럼 보여줘" 같은 요청에 쓴다.
---

# Terminal Embed

실제 `claude` 세션을 캡처한 원문 텍스트(참고 PBL의 `stage-results/stageN-result.md`
같은 파일)를 `content/course/stageN-*.md` 문서 하단에, 실제 Claude Code 터미널
창을 붙여넣은 것처럼 보이게 삽입한다.

## 언제 쓰나

- 실습 문서에 "이 프롬프트를 실행하면 실제로 이렇게 나온다"를 보여주고 싶을 때.
- 원문 트랜스크립트가 이미 있고(직접 타이핑하지 않은 실제 캡처), 그것을 그대로
  인용하되 읽기 좋게 색을 입히고 접기/펼치기로 감싸고 싶을 때.

## 디자인 시스템

- **창 톤**: Ubuntu 24.04 기본 GNOME Terminal(Yaru) 색상 - 배경 `#300A24`(에버진
  퍼플), 타이틀바 `#2d2d2d`, 강조색은 Ubuntu 오렌지 `#E95420`.
- **접기/펼치기**: 네이티브 `<details>`/`<summary>` (JS 불필요). `<summary>` 는
  가짜 OS 창과 분리된 별도 라벨이다 - Material 이 모든 `<details>` 에 기본으로
  입히는 admonition 스타일(파란 배경·note 아이콘·자체 화살표)을
  `theme/stylesheets/claude-terminal.css` 가 명시적으로 무력화한다.
- **색 의미** (`.ailab-term-body` 안 span 클래스):
    - `t-user` - 사람이 입력한 프롬프트(`❯` 로 시작하는 줄) 전체. 밝은 그린.
    - `t-accent` - Claude 턴 마커(`●`)·배너 테두리/헤더/픽토그램. Ubuntu 오렌지.
    - `t-white` - 굵은 강조(배너의 "Welcome back …!").
    - `t-dim` - 도구 호출 상태·결과(`⎿ …`, `(ctrl+o to expand)`, 구분선 `---`).
    - `t-status` - 타이밍 꼬리말(`✻ … for Ns`), recap(`※ recap: …`).
    - `t-error` - 도구 실패(`⎿ Error: …`). Ubuntu Tango 경고 빨강.
    - 색이 안 입혀진 나머지 줄(Claude 의 답변 본문, 데이터 표 등)은 배경 위
      기본 흰색(`--t-body`)을 그대로 쓴다 - Material 의 `.md-typeset code,kbd,pre`
      전역 규칙이 이 색을 가로채므로, CSS 쪽에서 `.md-typeset .ailab-term-body`
      로 특이성을 올려 덮어써야 한다(이미 되어 있음, 새로 건드릴 필요 없음).

이미 만들어진 CSS(`theme/stylesheets/claude-terminal.css`)와 HTML 골격은 그대로
재사용한다. **이 스킬이 하는 일은 원문 트랜스크립트 → 색칠된 `<pre>` 내용을
만들어 그 골격 안에 넣는 것뿐**이다.

## 절차

### 1. 스크립트로 자동 삽입

```bash
python3 .claude/skills/terminal-embed/scripts/embed_terminal.py \
  <원문 트랜스크립트.md> <대상 content/course/stageN-*.md> \
  --label "실행 로그 펼치기 - stageN-폴더이름"
```

- 대상 파일 끝에 `## 실행 예시 - 실제 세션 로그` 절 + `<details>` 블록을 그대로
  덧붙인다(파일 앞부분은 건드리지 않음).
- 이미 그 절이 있으면 아무 것도 안 하고 건너뛴다(재실행 안전, `--force` 로 강제
  가능).
- 표준 라이브러리만 쓴다. `<`·`>`·`&` 는 자동으로 HTML 이스케이프한다.

스크립트의 줄 분류 규칙(원문을 고치지 않고 색 span 만 입힌다):

| 패턴 | 처리 |
|---|---|
| `╭─── Claude Code … ╮` … `╰───╯` (박스 배너) | 테두리·헤더·픽토그램·"Welcome back …!" 을 위치 기반으로 색칠 |
| 픽토그램 3줄짜리 축약 배너(재접속 세션) | 픽토그램만 강조색 |
| `❯ …` | 그 줄 전체 `t-user`. 다음 줄이 마커 없이 이어지면(줄바꿈된 프롬프트) 같은 색 유지 |
| `●…` | `●` 문자만 `t-accent`. 나머지 문장은 기본색(굵게 하지 않음 - 일반화된 스킬이라 "제목" 여부를 안전하게 판단할 수 없음) |
| `✻ … for Ns` | 그 줄 전체 `t-status` |
| `※ recap: …` | `t-status`, 빈 줄까지 이어지는 줄도 같은 색 |
| `⎿ …` | `t-dim`(에러면 `t-error`). 다음 줄이 마커 없이 이어지면(줄바꿈된 결과·diff·파일 미리보기) 빈 줄 전까지 같은 색 유지 |
| `(ctrl+o to expand)` 포함 줄 | `t-dim` |
| `---` | `t-dim` |
| 그 외 | 색 없음(기본 흰색) |

### 2. 검증

각 대상 파일마다:

```bash
.venv/bin/python3 - <<'PY'
import markdown
text = open("content/course/stageN-*.md", encoding="utf-8").read()
section = "## 실행 예시" + text.split("## 실행 예시")[1]
html = markdown.markdown(section, extensions=[
    "admonition","attr_list","def_list","md_in_html","tables",
    "pymdownx.mark","pymdownx.details","pymdownx.highlight",
    "pymdownx.inlinehilite","pymdownx.snippets","toc","pymdownx.superfences",
])
assert html.count("<details") == html.count("</details>") == 1
print("OK")
PY
```

그리고:

```bash
python3 polish/tools/guard.py --only content/course/stageN-*.md
```

`문서가 새로 생겼습니다`류 알림이 아니라 실제 보호 구간 위반(기존 프로즈·표
데이터가 바뀜)이 나오면 멈추고 확인한다. 이 스킬은 파일 **끝에 덧붙이기만**
하므로 정상적으로는 기존 내용에 대한 위반이 나오지 않는다.

### 3. 육안 확인이 어려운 새 트랜스크립트라면

원문에 이 표에 없는 새로운 UI 요소(예: 다른 종류의 도구 호출 표시)가 보이면,
스크립트를 고치기보다 먼저 `classify_transcript()` 출력을 직접 눈으로 보고
(`python3 -c "..."` 로 함수만 호출해 stdout에 찍어보기) 색이 튀는 줄이 있는지
확인한 뒤, 필요하면 `embed_terminal.py` 에 규칙을 하나 추가한다 - 줄 순서를
바꾸지 않고 위 표의 우선순위 그대로 새 elif 분기를 끼워 넣는 식으로.

## 하지 않는 것

- `⎿ Added/removed N lines`·`⎿ Wrote N lines` 뒤에 오는 **diff 내용을 +/- 별로
  빨강/초록 줄 단위 색칠하지 않는다** - 실제 diff는 마크다운 문법·줄바꿈이
  뒤섞여 있어 정규식으로 안전하게 못 가른다. 전체를 `t-dim` 한 덩어리로 처리한다.
- Claude 응답 본문 중 "제목처럼 보이는 줄"을 자동으로 굵게 만들지 않는다 -
  일반화된 트랜스크립트마다 제목 여부를 안전하게 판별할 근거가 없다. 특별히
  다듬고 싶으면 스크립트 실행 후 해당 문서만 손으로 `t-white` span 을 추가한다
  (stage1 이 이렇게 손으로 다듬은 예시다 - 이 스킬 도입 전에 만들어졌다).
