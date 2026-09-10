---
name: code-embed
description: 예시 코드·설정 파일(SKILL.md, YAML, 스크립트 등)을 에디터 창처럼 디자인해 content/ 문서에 접기/펼치기 위젯으로 붙인다. "이 코드 예시 넣어줘", "설정 파일 펼치기로 보여줘", "코드블록 UI 이쁘게 만들어줘" 같은 요청에 쓴다.
---

# Code Embed

예시 파일 전체(설정 파일, `SKILL.md`, 스크립트 등)를 있는 그대로 인용하되,
문서 흐름을 막지 않도록 에디터 창 모양의 접기/펼치기(`<details>`) 위젯 안에
넣는다. 실제 실행 로그를 보여주는 [terminal-embed](../terminal-embed/SKILL.md)의
자매 스킬이다 - 그쪽은 "터미널에서 실행한 기록", 이쪽은 "읽어볼 파일 한 장"을
보여줄 때 쓴다.

## 언제 쓰나

- 개념 설명 중간에 "이렇게 생긴 예시 파일"을 통째로 보여주고 싶은데, 본문
  흐름이 코드 분량 때문에 끊기지 않았으면 할 때.
- 이미 완성된 예시 코드(사용자가 붙여넣은 것, 다른 문서에서 가져온 것)가
  있고, 그것을 고치지 않고 그대로 인용하고 싶을 때.

## 디자인 시스템

- **창 톤**: 실제 코드 에디터 탭을 흉내 낸 밝은 창 - 타이틀바에 macOS 스타일
  점 3개(빨강·노랑·초록, 장식용)와 파일 경로, 본문은 사이트 기본 코드
  하이라이트(`pymdownx.highlight`/pygments) 색을 그대로 씁니다. 라이트/다크
  테마를 모두 따라갑니다(`--md-code-bg-color` 등 Material 변수 사용).
- **접기/펼치기**: 네이티브 `<details>`/`<summary>`(JS 불필요). 다만 안쪽에
  진짜 펜스 코드 블록(` ```lang `)을 넣어 문법 강조를 받아야 하므로, `<details
  markdown="1">`로 안쪽을 markdown으로 처리하게 한다(`md_in_html`). 이 속성이
  없으면 코드 블록이 강조되지 않고 원문 그대로 보인다.
- CSS는 `theme/stylesheets/code-window.css`(`.ailab-code` 계열 클래스)에
  이미 있다 - 새로 만들 필요 없이 그대로 재사용한다.

## 절차

### 1. 스크립트로 삽입

원문을 파일로 준비한 뒤(사용자가 대화에 붙여넣은 내용이면 스크래치 디렉터리에
그대로 저장):

```bash
python3 .claude/skills/code-embed/scripts/embed_code_window.py \
  <원문 파일> <대상 content/*.md 파일> \
  --label "코드 예시 펼치기 - pr-summary SKILL.md" \
  --filename ".claude/skills/pr-summary/SKILL.md" \
  --lang yaml \
  --after-heading "## (심화) frontmatter 필드"
```

- `--after-heading` 을 주면 그 헤딩이 딸린 절의 **끝**(다음 헤딩 직전)에
  삽입한다. 생략하면 파일 맨 끝에 붙인다.
- 같은 `--label` 이 이미 있으면 아무 것도 하지 않고 건너뛴다(재실행 안전,
  `--force` 로 강제 가능).
- `--lang` 은 생략 가능하다. 파일이 한 언어로만 되어 있으면(`yaml`, `python`,
  `bash` 등) 지정하고, frontmatter+본문이 섞인 `SKILL.md`처럼 한 언어로 못
  가를 파일은 생략해 무강조 코드 블록으로 둔다 - 어설프게 잘못 강조되는
  것보다 낫다.
- 표준 라이브러리만 쓴다. 원문을 고치지 않고 그대로 인용한다(줄바꿈·들여쓰기
  보존).

### 2. 검증

```bash
.venv/bin/python3 - <<'PY'
import markdown
text = open("content/.../대상파일.md", encoding="utf-8").read()
section = text.split("<details class=\"ailab-code\"")[1]
html = markdown.markdown("<details class=\"ailab-code\"" + section, extensions=[
    "admonition","attr_list","def_list","md_in_html","tables",
    "pymdownx.mark","pymdownx.details","pymdownx.highlight",
    "pymdownx.inlinehilite","pymdownx.snippets","toc","pymdownx.superfences",
])
assert html.count("<details") == html.count("</details>") == 1
assert '<div class="highlight">' in html or "<pre>" in html
print("OK")
PY
```

그리고:

```bash
python3 polish/tools/guard.py --mode revise --only content/.../대상파일.md
```

새 헤딩·코드블록·인라인 코드·링크가 "생김"으로 나오는 것은 이 스킬의 정상
결과다. 기존 프로즈·표 데이터가 바뀌었다는 위반만 없으면 통과로 본다.

## 하지 않는 것

- 원문 내용을 요약하거나 손보지 않는다 - 있는 그대로 인용한다. 줄이고 싶으면
  스크립트를 돌리기 전에 원문 파일 자체를 사용자와 함께 다듬는다.
- `--lang` 을 추측으로 지정해 억지로 강조하지 않는다. 혼합 파일은 무강조가
  기본값이다.
- `theme/` CSS를 문서마다 새로 만들지 않는다. `.ailab-code` 위젯 하나로
  모든 코드 예시를 통일한다 - 새 색·모양이 필요하면 이 스킬의 CSS 파일을
  고치는 것으로 논의한다(임의로 새 클래스를 만들지 않는다).
