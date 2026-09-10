---
name: simulator-embed
description: 참고 PBL의 독립 HTML 시뮬레이터(how-it-works.html 등)를 content/course/ 문서 끝에 "시뮬레이터 보기" 버튼 링크로 붙인다. "시뮬레이터 넣어줘", "이 html 산입시켜줘", "웹 페이지에서 시뮬레이션 되게 해줘" 같은 요청에 쓴다.
---

# Simulator Embed

참고 PBL 폴더(`raw/pbl-examples/.../stageN-*/`)에 있는 독립 실행형 HTML(그래프
시각화·상태 재생 등 인터랙티브 시뮬레이터)을, 새 창에서 그대로 열리는 링크로
`content/course/stageN-*.md` 문서 끝에 붙인다.

## 왜 iframe 이 아니라 링크인가

처음엔 `<iframe>` 으로 페이지 안에 곧바로 끼워 넣었지만, 시뮬레이터가 3분할
레이아웃(컨텍스트·그래프·파일트리)이라 문서 폭 안에 욱여넣으면 보기 힘들다는
피드백을 받고 되돌렸다. **링크 하나로 새 창에서 여는 방식**이 최종 형태다.

"새 탭에서 연다"는 것도 별도로 만들 필요가 없다 -
`theme/javascripts/link-target.js` 가 `.md-content` 안의 모든 링크에 이미
`target="_blank"` 를 자동으로 붙인다(앵커·헤더링크 제외). **평범한 마크다운
링크를 쓰면 그것으로 끝**이다.

## 절차

### 1. 원본 파일과 외부 의존성을 확인한다

```bash
python3 .claude/skills/simulator-embed/scripts/scan_external_deps.py <원본.html>
```

- **외부 참조 없음** → 2단계에서 그대로(치환 없이) 복사한다.
- **외부 참조(CDN) 있음** → AskUserQuestion 으로 사용자에게 묻는다: 저장소에
  벤더링(권장, 폐쇄망 대응) vs CDN 그대로 참조. 다운로드는 Bash 승인 절차를
  거친다 - 스크립트가 대신 뚫으려 하지 않는다. 사용자가 CDN 그대로를 고르면
  3단계의 `--replace` 는 생략한다.
- 벤더링을 고르면 승인된 다운로드로 받은 파일을 `content/course/assets/vendor/`
  에 둔다(예: `content/course/assets/vendor/<lib>.min.js`).

### 2. 대상 문서의 폴더명을 확인한다

대상 `content/course/stageN-*.md` 문서의 "전제 조건"에 적힌 원천 폴더명을
그대로 시뮬레이터 파일명에 쓴다(예: `stage3-harness/` →
`stage3-harness-simulator.html`). 페이지 제목과 파일명이 어긋나지 않게 하는
규칙이다.

### 3. 복사 + 치환

```bash
python3 .claude/skills/simulator-embed/scripts/copy_and_rewire.py \
  <원본.html> content/course/assets/<stage>-simulator.html \
  --replace '<script src="https://cdn.../lib.min.js"></script>' \
             '<script src="vendor/lib.min.js"></script>'
```

- `--replace` 는 CDN 참조마다 반복한다(0개면 생략).
- OLD 문자열이 원본에 정확히 1회 없으면 스크립트가 중단한다 - 실수로 엉뚱한
  곳을 바꾸는 사고를 막는다.
- 손으로 옮겨 적지 않는다. 수백 줄짜리 HTML/CSS/JS를 사람이 다시 타이핑하면
  공백·특수문자 하나로 시뮬레이터가 깨진다.

### 4. 문서 끝에 절을 붙인다

`content/course/stageN-*.md` 의 **맨 끝**(`## 실행 예시 - 실제 세션 로그` 절이
있으면 그 다음)에 아래 틀 그대로 추가한다.

```markdown
## 시뮬레이터 - <한 줄 설명>

<이 시뮬레이터가 무엇을 보여주는지 한두 문장.>

<어떻게 조작하는지(재생·클릭 등) 한두 문장.>

[시뮬레이터 보기 →](assets/<stage>-simulator.html){ .md-button .md-button--primary }
```

- 버튼은 Material 내장 클래스(`.md-button`·`.md-button--primary`, `attr_list`
  확장으로 동작 - 이미 `site.yml`/`tools/pipeline.py` 설정에 켜져 있음)를 쓴다.
  새 CSS를 만들지 않는다.
- 링크 경로는 **문서 파일 기준 상대 경로**(`assets/...`)로 쓴다 - 마크다운
  링크는 MkDocs 가 `use_directory_urls` 에 맞게 알아서 다시 쓴다. `<iframe>`
  같은 raw HTML 태그를 다시 쓸 경우에만 `tools/mkdocs_hooks.py` 의 별도 보정이
  필요했다(지금은 안 씀).
- 자리는 항상 문서 **맨 끝**이다. "전제 조건" 앞이나 배경 절 사이에 두지
  않는다 - 실습 흐름을 방해하지 않는 보충 자료라는 위치다.

## 검증

```bash
.venv/bin/python3 -c "
import markdown
text = open('content/course/stageN-....md', encoding='utf-8').read()
section = '## 시뮬레이터' + text.split('## 시뮬레이터')[1]
html = markdown.markdown(section, extensions=[
    'admonition','attr_list','def_list','md_in_html','tables',
    'pymdownx.mark','pymdownx.details','pymdownx.highlight',
    'pymdownx.inlinehilite','pymdownx.snippets','toc','pymdownx.superfences',
])
print(html)
"
```

`<a class="md-button md-button--primary" href="assets/...">` 형태로 나오는지
확인한다. 그리고:

```bash
python3 polish/tools/guard.py --only content/course/stageN-....md
```

"문서가 새로 생겼습니다"류가 아니라 실제 보호 구간 위반(기존 프로즈가 바뀜)이
나오면 멈추고 확인한다. 이 스킬은 파일 **끝에 절을 덧붙이고**, `assets/` 아래
정적 파일을 **새로 추가**할 뿐이므로 정상적으로는 그런 위반이 없다.

## 하지 않는 것

- `<iframe>` 로 페이지 안에 직접 끼워 넣지 않는다(위 "왜 iframe 이 아닌가" 참고).
- CDN 라이브러리를 사용자 승인 없이 다운로드하지 않는다 - 외부 코드를 저장소에
  들여오는 결정은 사용자 몫이다.
- 원본 HTML의 로직·마크업을 고치지 않는다. 오직 지정된 CDN 참조 문자열만
  치환한다 - 시뮬레이터가 "그 시뮬레이터 그대로" 동작해야 한다는 요구사항
  때문이다.
