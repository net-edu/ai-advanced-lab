# stage3

<p class="ailab-title-subtitle">- harness로 패키징하기</p>

stage2에서 `@`로 첨부하던 context 를 프로젝트에 편입해, 재사용할 수 있는 **harness** 를 만듭니다.

이 실습을 마치면 harness를 통해 리포트 초안(`reports/fair-value.md`)을 작성합니다.

리포트에서는 정형 데이터(재무제표→지표) 비정형 데이터를(리포트·뉴스→정성 판단) 한 리포트에서 종합합니다.

매 세션 로드되는 `CLAUDE.md`와 필요할 때만 로드되는 조건부 rule의 차이도 직접 확인합니다.

## 지침 파일(`CLAUDE.md`)은 AI 에게 건네는 부탁입니다

`CLAUDE.md`에 규칙을 적어 두면 매번 같은 설명을 반복하지 않아도 됩니다.

CLAUDE.md는 세션을 시작할 때, 그리고 매 요청마다 모델에게 다시 전달됩니다.

사람으로 치면 새 팀원 책상에 붙여 두는 **업무 안내문**과 같습니다.

다만 이 안내문은 사용자 메시지로 전달됩니다.

**그래서 모델이 반드시 지킨다는 보장이 없습니다.**

대화 중 사용자가 직접 내리는 지시처럼 우선순위가 더 높은 작업이 들어오면 지침의 우선순위는 뒤로 밀립니다.

`CLAUDE.md`에 "경쟁사 최소 5개 조사"라고 적어도, 대화 중 "간단히 3개만 조사"라고 프롬프팅을 하면 모델은 3개의 결과만 내놓기 쉽습니다.

이런 이유 때문에 **"지침 = 부탁"** 에 해당합니다.

반드시 지켜야 하는 규칙은 지침 파일로 두면 안 됩니다.

코드로 실행돼 강제되는 장치, 곧 hook이 필요합니다.

그 강제는 stage4에서 만듭니다.

이번 단계는 "지침 파일만으로 어디가 부족한지"를 체험하는 단계입니다.

## Context를 담는 여섯개 계층

Claude 에게 작업자의 Context를 실어 보낼 수 있는 방법은 6가지 입니다.

각 방법마다 언제 로드되고, 컨텍스트 비용이 얼마인지, 무엇을 담는지가 다릅니다.

로딩 시점·비용의 상세는 [Context Engineering](../concepts/context-engineering.md) 에서 봅니다.

| 전달 방법 | 로딩 시점 | 컨텍스트 비용 | 용도 |
|---|---|---|---|
| CLAUDE.md | 세션 시작·매 요청 | 항상 | 항상 알아야 할 규칙 |
| `.claude/rules/` | 파일을 읽을 때 | 조건부(`paths` 스코프) | 경로별 규칙 |
| Skills | 요청·자동 로드 | 필요할 때만(토큰 상한 있음) | 참조 자료·워크플로우 |
| Subagents | Agent 도구 호출 시 | 격리 컨텍스트(요약만 복귀) | 대량 탐색, 메인 대화 미오염 |
| Hooks | 이벤트 발생 | 0 (출력 반환 시만) | 결정론적 강제 |
| MCP | 도구 호출 시 | 필요할 때 | 외부 데이터·시스템 연결 |

이번 단계에서는 위 네가지 방법(CLAUDE.md / rules / skill)만 살펴 봅니다.

### **CLAUDE.md**는 항상 로드됩니다.

세션 내내 켜져 있으므로, 프로젝트 전체에 늘 적용되는 규칙만 담으세요.

배치와 계층은 [CLAUDE.md 배치](../claude-code/claude-md-placement.md) 에서 봅니다.

### **rules**는 조건부입니다.

`paths` 프론트매터로 스코프를 걸면, 그 경로의 파일을 읽는 순간에만 규칙이 켜집니다.

`reports/**` 에만 적용되는 인용 규칙을 별도 파일로 두면, 그 경로를 만질 때만 로드됩니다.

rules 를 잘 활용해야 CLAUDE.md 파일이 비대해지지 않습니다.

### 지침을 적을 때는 **검증 가능하게** 쓰세요.

"좋은 보고서" 같은 형용사는 pass/fail 기준이 없어 무시되기 쉽습니다.

"경쟁사 최소 5개", "매출액은 억원 단위로 통일"처럼 눈으로 세거나 확인할 수 있게 적으세요.

## skill과 subagent는 서로 다른 층에

기업 가치 분석 harness에서는 skill과 subagent를 각각 다른 층에 놓습니다.

### **skill - 리포트 작성**

정형 읽기 → 비정형 읽기 → 종합 판정 → 필수 섹션 작성 순서를 묶어 둔 일종의 **반복 작업 지침**입니다.

절차가 메인 대화 안에서 실행되므로 결과가 메인 컨텍스트에 남습니다.

만드는 법은 [Skill 개념](../concepts/what-is-skill.md) 에서 봅니다.


## 실습 단계

1. `stage3-harness/` 폴더에서 `claude` 를 실행하세요. 세션이 시작되면서 프로젝트 루트의 `CLAUDE.md` 가 자동으로 컨텍스트에 로드됩니다.

2. `/context` 를 입력해 지금 로드된 것을 확인하세요. `CLAUDE.md` 는 잡혀 있지만 `.claude/rules/citation-format.md` 는 아직 잡혀 있지 않습니다.

3. `/fair-value-report NVIDIA` 를 입력하세요. skill이 정형 읽기 → 비정형 읽기 → 종합 판정 → 필수 섹션 작성 순서로 리포트를 만듭니다.

4. skill이 `data/financials.json` 에서 다섯 지표를 계산식과 함께 산출하고, `raw/뉴스-*.md`·`raw/애널리스트-*.md`·`raw/적정가-가정-*.md` 에서 긍정 요인·우려 요인을 균형 있게 뽑는 과정을 지켜보세요.

5. `reports/fair-value.md` 를 쓰는 Write 도구 호출이 뜨면 승인하세요. `default` 권한 모드라 파일을 새로 쓸 때 승인이 필요합니다.

6. 다시 `/context` 를 입력하세요. 방금 `reports/**` 경로의 파일을 다뤘으므로 `.claude/rules/citation-format.md` 가 이제 로드돼 있습니다. `paths: ["reports/**"]` 로 좁힌 조건부 rule이 실제로 그 경로를 만질 때만 잡히는 것을 2단계와 비교해 확인하세요.

7. 실습 중 금융 용어(EPS·PER 등)나 Claude Code 용어(rule·skill 등)가 막히면 `/explain-jargon` 또는 자연어 질문(예: "PER이 뭐야")으로 물어보세요.

### 최종 산출물 확인 방법

`reports/fair-value.md` 를 열어 다음을 눈으로 확인하세요.

- 여섯 섹션이 순서대로 있습니다: `## 종목 개요` → `## 정량 분석 (정형)` → `## 정성 분석 (비정형)` → `## 종합 판정` → `## 결론` → `## 출처`.

- 정량 분석 표에 다섯 지표가 **계산식과 함께** 있습니다. 예: PER = 216.85 ÷ 4.90 = 44.3.

- 정성 분석에 긍정 요인·우려 요인이 각각 최소 2개씩, 인라인 출처와 함께 균형 있게 담겨 있습니다.

- 종합 판정이 저평가/적정/고평가 중 하나로 나옵니다.

판정을 좌우한 미래 예상 가정(목표 주가배수·성장률)도 결론에 명시돼 있습니다.

이 확인은 **전부 사람이 합니다.**

이 stage에는 검증을 하는 장치가 없습니다.

지표를 잘못 계산하거나, 정성 분석이 한쪽으로 쏠리거나, 종합 판정이 근거와 어긋나도 아무 경고가 뜨지 않습니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage3-harness</summary>

<div class="ailab-term-window">
<div class="ailab-term-titlebar">
<span class="ailab-term-title"><span class="t-accent">✳</span> Claude Code</span>
<span class="ailab-term-controls">
<span class="ic ic-search"></span>
<span class="ic ic-menu"></span>
<span class="ic ic-min"></span>
<span class="ic ic-max"></span>
<span class="ic ic-close"></span>
</span>
</div>
<pre class="ailab-term-body"> <span class="t-accent">▐▛███▜▌</span>   Claude Code v2.1.205
<span class="t-accent">▝▜█████▛▘</span>  <span class="t-dim">Sonnet 5</span> · Claude Enterprise
  <span class="t-accent">▘▘ ▝▝</span>    ~/…/market-analysis-valuation-nvidia-plain/stage3-harness


<span class="t-user">❯ /fair-value-report NVIDIA</span>

<span class="t-dim">  Searched for 1 pattern, read 7 files (ctrl+o to expand)</span>

<span class="t-accent">●</span> reports/fair-value.md already exists and matches the current source data
  exactly - I re-verified the calculations:

  - PER: 216.85 ÷ 4.90 = 44.3
  - 매출 증가율: (215,938−130,497)/130,497 = 65.5%
  - 영업이익률: 130,387/215,938 = 60.4%
  - 순이익 증가율: (120,067−72,880)/72,880 = 64.7%

  All five required sections are present in order (종목 개요 → 정량 분석 → 정성
  분석 → 종합 판정 → 결론 → 출처), inline citations follow the
  citation-format.md rule, the financials.json vs stockanalysis.com PER
  discrepancy (44.3 vs 33.2) is flagged per the source-conflict rule, and the
  "저평가" 판정 explicitly names its swing assumption (25–30% 장기 성장률,
  29–34배 미래 주가배수) as required.

  No changes needed - the report is already up to date with data/financials.json
  and the three raw/ sources. Since this stage has no verification harness (per
  reports/README.md), that's as far as this stage goes.

<span class="t-status">✻ Cogitated for 23s</span></pre>
</div>

</details>

## Stage 3 의 결론

**🎯 재현 가능한 초안 harness**

지침 파일 / rule 파일 / skill 등을 만들어 특정 기업의 적정 가치를 분석하기 위한 harness를 한 벌을 얻었습니다.

다만 이 harness는 작업의 완결성(검증)을 보장하지 않습니다.

계산이 맞는지, 정성이 균형 잡혔는지, 판정이 근거와 일치하는지는 전적으로 사람이 눈으로 확인해야 합니다.

이 검증 공백을 hook(정형)과 subagent(비정형)로 메우는 것이 다음 [stage4](stage4-loop.md) 입니다.

## 참고

### 실패했을 때

- **리포트가 생성되지 않으면** 실행 위치를 확인하세요. `CLAUDE.md` 와 `.claude/skills/fair-value-report/` 가 보이는 폴더 루트에서 `claude` 를 실행해야 skill과 규칙이 로드됩니다.

- **지표가 틀려 보여도 경고는 뜨지 않습니다.** 이 stage의 정체입니다. `data/financials.json` 을 기준으로 계산식을 직접 대조하세요. 소스마다 수치가 다르면(예: 주가배수 33.2배 vs 44.3배) 원본 `financials.json` 을 기준으로 삼습니다.

- **판정이 근거와 어긋나 보여도** 되돌려 주는 장치가 없습니다. 정량 신호와 정성 판단이 충돌할 때 리포트가 "어느 쪽을 왜 더 신뢰하는지" 밝혔는지 사람이 읽고 판단하세요.

### 시뮬레이터 - harness 동작 미리 보기

이 harness가 내부에서 어떻게 도는지 별도 화면으로 훑어볼 수 있습니다.

stage3-harness의 13단계 실행 흐름을 **컨텍스트 누적(좌) · 실행 흐름 그래프(중) · 파일 트리+원문(우)** 세 창으로 동시에 보여주는 시뮬레이터입니다.

▶ 재생을 누르면 CLAUDE.md 로드부터 리포트 완성까지 단계별로 재생되고, 그래프의 노드나 파일 트리를 직접 클릭해 원하는 단계로 건너뛸 수도 있습니다. 사람이 개입하는 지점(명령 입력·쓰기 승인)과, 이 stage엔 아직 없는 검증 장치(hook·subagent)가 어디인지 확인해 보세요.

[시뮬레이터 보기 →](assets/stage3-harness-simulator.html){ .md-button .md-button--primary }

이 시뮬레이터를 포함한 전체 실습·시각화 자료 목록은 [강의 진행 자료](../curriculum/index.md)에 있습니다.
