# stage5

<p class="ailab-title-subtitle">- Oracle로 판정 기준 세우기</p>

> 오라클(Oracle)은 AI 모델의 답변이 맞는지 판단하는 데 쓰이는 정답 기준(정답 데이터나 채점 로직)을 뜻하며, 모델 성능을 평가할 때 비교 대상이 되는 "정답지" 역할을 합니다.

stage4의 loop는 지표 계산과 정성 균형은 보지만, "저평가/고평가"라는 판정 자체가 타당한지는 못 가립니다.

이 단계에서는 그 **판정 기준(oracle)** 을 직접 만듭니다.

목표 주가배수 / 성장률의 정상 범위는 `golden-reports/` 에서 역산해 `assumptions-bands.md` 로 형식지화해 둡니다.

> 목표 주가배수(target multiple)는 기업의 실적(순이익, 매출 등) 대비 몇 배의 가격이 적정하다고 보는지를 나타내는 밸류에이션 기준입니다.

> 목표 주가 배수를 이를 실적 전망치에 곱해 목표 주가를 산출하는 데 쓰입니다.

hook과 subagent가 그 범위를 함께 강제합니다.

이 실습을 끝내면 "저평가/고평가" 판정의 정상 범위를 golden에서 역산해 형식지화하고, 그 범위를 hook이 강제하게 만듭니다.

> 골든 마스터(Golden Master)는 사람이 직접 검증해 정답으로 확정해 둔 기준 답변 세트로, 이후 모델이나 시스템의 결과를 비교해 회귀(오류 발생) 여부를 판단하는 잣대로 사용됩니다.

## 기준 부재를 골든예제로 역산

"무엇이 정상 범위인가"를 처음부터 정의하기는 어렵습니다.

그래서 반대로 갑니다.

좋다고 인정한 golden 리포트 여러 편을 나란히 놓고, 그들이 쓴 미래 예상 가정을 대조합니다.

그 공통 범위가 곧 채택 범위가 됩니다.

이 대조 작업이 암묵적이던 "이 정도면 타당하다"를 관찰 가능한 숫자로 못 박는 과정입니다.

이 예시에서 golden 5건에서 목표 주가배수 **18~35배**, 장기 성장률 **20~44%** 를 채택 범위로 역산했습니다.

## ⭐ 이 단계의 핵심 통찰

stage4의 지표 계산(주당순이익·주가배수 등)은 **이미 공식이 있던 것** 을 hook에 옮겨 담은 것입니다.

stage5의 가정 범위는 **아무도 정해주지 않은 것** 을 golden에서 직접 역산해 형식지화한 것입니다.

둘 다 "판정 기준을 형식지화"라는 같은 작업입니다.

차이는 남이 해놨나 내가 해야 하나뿐입니다.

곧 **오라클의 판정 기준 자체가 사람 암묵지의 형식지화** 자체 입니다.

NVIDIA는 현재 실적 기준만으로는 답이 나오지 않습니다.

미래 예상 가정이 판정의 전부입니다.

그래서 이 형식지화가 판정을 실제로 좌우합니다.

## 실습 단계

### 1. 범위가 어떻게 역산됐는지 이해하세요

`golden-reports/` 5건과 `assumptions-bands.md` 를 먼저 읽으세요.

다섯 리포트의 미래 예상 가정을 대조해 목표 주가배수 18~35배, 장기 성장률 20~44%를 채택 범위로 역산한 과정이 담겨 있습니다.

### 2. 세션을 열고 초안을 만드세요

stage5 폴더에서 `claude` 를 실행하세요.

`data/financials.json` 과 `raw/` 를 읽힙니다.

`/fair-value-report NVIDIA` 를 실행하면 `reports/fair-value.md` 가 나옵니다.

### 3. 미래 예상 가정을 형식대로 넣으세요

`## 결론` 아래 `### 판정 근거 미래 예상 가정` 소제목에 아래 두 줄을 이 형식 그대로 넣으세요.

검증 스크립트가 이 형식을 읽습니다.

```
- 목표 주가배수: 29.0배
- 장기 이익 성장률: 27.5%
```

두 값은 `assumptions-bands.md` 의 적정 범위 안에서 정하세요.

범위를 벗어나려면 결론에 `적정범위 밖 근거: <근거>` 마커를 달아야 합니다.

근거의 질은 subagent가 판정합니다.

### 4. 리뷰어 subagent로 채점하세요

`fair-value-reviewer` subagent를 호출하세요.

stage4의 정성 균형·일관성 채점에 더해, 범위 밖 근거의 설득력까지 함께 판정합니다.

### 5. Stop hook이 범위 검증을 걸게 하세요

세션 종료를 시도하면 Stop hook이 `scripts/validate_fair_value.py` 로 형식·지표에 더해 **미래 예상 가정이 적정 범위 안인지** 를 검증합니다.

범위 밖인데 마커가 없으면 `exit 2` 로 막습니다.

hook 통과 + 리뷰어 PASS까지 반복하게 두세요.

!!! tip "세 가지 결과를 비교해 보세요"
    `examples/` 의 `sample-*.md` 세 파일을 각각 `reports/fair-value.md` 로 복사해 hook을 돌리면 차이가 바로 보입니다.

    결함 데모는 여러 이유로 실패, 근거 없는 범위 밖은 마커 부재로 실패, 근거 있는 범위 밖은 통과합니다(정성 품질은 subagent가 별도로 판정).

### 결과 확인 방법

- `### 판정 근거 미래 예상 가정` 두 줄이 형식대로 들어갑니다.

- 범위 밖 값에는 `적정범위 밖 근거:` 마커가 붙어야 hook을 통과합니다.

- 리포트가 hook 통과와 리뷰어 PASS(≥9/12) 조건을 동시에 만족해야 loop가 끝납니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage5-oracle</summary>

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
  <span class="t-accent">▘▘ ▝▝</span>    ~/…/market-analysis-valuation-nvidia-plain/stage5-oracle


<span class="t-user">❯ /fair-value-report NVIDIA</span>

<span class="t-dim">  Read 7 files, listed 1 directory, ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> The existing reports/fair-value.md already satisfies the full workflow: it
  computes all five quantitative metrics from data/financials.json, balances
  positive/concern factors from the three raw/ sources with inline citations,
  and reaches a 저평가 verdict with explicit future assumptions (목표 주가배수
  29.0배, 장기 이익 성장률 27.5%) - both within the golden-report-derived band
  (18–35배, 20–44%), so no out-of-band marker is needed.

  I ran scripts/validate_fair_value.py against it and it passes all formal
  (hook) checks: required sections, inline citations, no placeholders,
  recalculated metrics match, verdict present, and assumptions within band.

  Next step per the CLAUDE.md loop would be running the fair-value-reviewer
  subagent to grade the qualitative/subjective side (balance, reasoning quality,
  coherence). Want me to invoke that now?

<span class="t-accent">●</span> User answered Claude's questions:
<span class="t-dim">  ⎿  · 기존 reports/fair-value.md가 이미 hook 검증을 통과했습니다. 다음으로</span>
<span class="t-dim">     무엇을 할까요? → fair-value-reviewer로 채점 (권장)</span>

<span class="t-accent">●</span> fair-value-reviewer(Grade fair-value.md qualitative sections)
<span class="t-dim">  ⎿  Backgrounded agent (↓ to manage · ctrl+o to expand)</span>

<span class="t-accent">●</span> The fair-value-reviewer subagent is now grading the qualitative sections in
  the background - I'll report the PASS/FAIL result and any needed fixes once it
  finishes.

<span class="t-status">✻ Baked for 35s</span>

<span class="t-accent">●</span> Agent "Grade fair-value.md qualitative sections" finished · 58s

<span class="t-accent">●</span> fair-value-reviewer scored the report 16/16 → PASS (threshold ≥9). Balance,
  synthesis coherence, and the disclosed future-assumption rationale
  (29.0배/27.5%, matching the analyst-average golden report) all scored full
  marks; the range check is moot since both values sit inside the 18–35배/20–44%
  band.

  One minor gap it flagged: the "$268.22" Simply Wall St fair-value figure in ##
  종합 판정 lacks an inline citation. I'll add that now.

<span class="t-accent">●</span> Update(reports/fair-value.md)
<span class="t-dim">  ⎿  Added 2 lines, removed 2 lines</span>
<span class="t-dim">      65  - **현재 실적 기준 신호**: 주가배수 44.3배(또는 소스에 따라 33.</span>
<span class="t-dim">          2배) → 현재가 "극히 비싼 수준"</span>
<span class="t-dim">      66  - **애널리스트 의견**: 평균 목표주가 $304.64~305.86(현재가 대비</span>
<span class="t-dim">           +40~41%), 최고 $500 / 최저</span>
<span class="t-dim">      67    $250 - **가장 낮은 목표가조차 현재가($216.85)보다 높다**.</span>
<span class="t-dim">      68 -- **계산모델 자체 추정**(Simply Wall St): 적정가 $268.22 - 애널</span>
<span class="t-dim">         -리스트 평균보다는 낮지만</span>
<span class="t-dim">      69 -  현재가보다는 높음.</span>
<span class="t-dim">      68 +- **계산모델 자체 추정**(Simply Wall St): 적정가 $268.22[출처:</span>
<span class="t-dim">         +raw/적정가-가정-2026.md] -</span>
<span class="t-dim">      69 +  애널리스트 평균보다는 낮지만 현재가보다는 높음.</span>
<span class="t-dim">      70</span>
<span class="t-dim">      71  이 종목의 판정은 **미래 예상 가정(성장률·미래 주가배수가 몇 년</span>
<span class="t-dim">          간 유지되느냐)에 전적으로</span>
<span class="t-dim">      72  달렸다**. 61명 중 최저 목표가($250)도 현재가보다 15% 높다는 점</span>
<span class="t-dim">          은 "현재 성장세가 최소한</span>

<span class="t-dim">  Ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> Both oracle checks pass:

  - Hook (정형): 형식·정량지표·미래 예상 가정 범위 검증 통과 ✅
  - Subagent (비정형): fair-value-reviewer 16/16 → PASS

  reports/fair-value.md는 저평가 판정, 미래 예상 가정(목표 주가배수 29.0배·장기
  성장률 27.5%, assumptions-bands.md 범위 내)을 명시하고 있으며, 사소한 출처
  표기 누락(Simply Wall St $268.22 수치)만 보완해 완료했습니다.

<span class="t-status">✻ Worked for 1m 52s</span></pre>
</div>

</details>

## Stage 5 의 결론

**🎯 판정 기준의 형식지화**

목표 주가배수·성장률의 정상 범위를 golden 리포트 5건에서 역산해 `assumptions-bands.md`로 형식지화했습니다.

hook이 그 범위를 정형으로 강제하고, subagent가 범위 밖 근거의 설득력을 비정형으로 판정합니다.

곧 오라클의 판정 기준 자체가 사람 암묵지를 글로 옮긴 것이라는 이 실습 세트의 핵심 통찰을 손으로 확인한 것입니다.

여기까지가 하네스→loop→오라클의 본체입니다.

다음 [stage6](stage6-mcp.md)부터는

- 죽은 데이터가 아닌, 실시간 데이터를 사용하고 싶다면 어떻게 해야 하는지?

- 자산화한 하네스를 재사용하려면 어떻게 해야 하는지?

- 지식 홍수를 막으려면 어떻게 해야 하는지?

살펴봅니다.

## 참고

### 실패했을 때

- **범위 안 값인데 hook이 막으면** 두 줄의 형식(`- 목표 주가배수: 29.0배`)이 정확한지 확인하세요. 스크립트가 이 형식을 정규식으로 읽습니다.

- **범위 밖 값을 넣고 싶으면** `적정범위 밖 근거:` 마커를 반드시 다세요. 마커가 없으면 hook이 막고, 마커의 설득력은 subagent가 따로 판정합니다.

### 시뮬레이터 - 오라클 하네스 내부 동작 미리 보기

이 하네스가 내부에서 어떻게 도는지 별도 화면으로 훑어볼 수 있습니다. 정형(hook)·비정형(subagent) 두 겹 오라클이 미래 예상 가정의 적정 범위를 어떻게 검증하고, 실패했을 때 루프백 재시도가 어디서 일어나는지 보여주는 시뮬레이터입니다.

재생·클릭으로 단계를 따라가며 확인해 보세요.

[시뮬레이터 보기 →](assets/stage5-oracle-simulator.html){ .md-button .md-button--primary }

이 시뮬레이터를 포함한 전체 실습·시각화 자료 목록은 [강의 진행 자료](../curriculum/index.md)에 있습니다.
