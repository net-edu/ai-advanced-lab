# stage2

<p class="ailab-title-subtitle">- 컨텍스트 추가해보기</p>

프롬프트만으로 작업해보기

stage1에서 짚은 첫 번째 문제(근거 데이터 없음)를 해결합니다.

실제 재무 데이터와 리포트를 `@`로 **첨부**한 뒤 같은 분석 시킵니다.

답이 어떻게 달라지는지 비교합니다.

아직 harness 는 없습니다.

그라운딩 하나만 더해 무엇이 좋아지고 무엇이 여전히 불편한지를 함께 관찰합니다.

> 그라운딩(grounding)은 AI 모델이 답변을 생성할 때 근거 없는 추측이 아니라 실제 문서나 데이터 같은 외부 근거에 기반하도록 하는 것을 말합니다.

## 전제 조건

- 첨부할 자료가 폴더에 들어 있습니다. 정형은 `data/financials.json`(SEC 10-K 재무제표+주가), 비정형은 `raw/뉴스-*.md`·`raw/애널리스트-의견-2026.md`·`raw/적정가-가정-2026.md`입니다.

- 붙여넣을 프롬프트는 `prompts.md`에 있습니다. 이 stage에는 아직 `CLAUDE.md`·skill·hook·subagent가 없습니다.

## 단계

1. `stage2-context-attach/` 폴더에서 `claude`를 실행하세요.
2. 아래 프롬프트를 입력하세요. 핵심은 `@` 로 파일을 붙이는 동작입니다.
   ```
   @data/financials.json @raw/뉴스-NVIDIA-2026Q2전망.md @raw/애널리스트-의견-2026.md @raw/적정가-가정-2026.md
   이 자료들을 근거로 NVIDIA가 저평가/적정/고평가인지 분석해줘. 숫자엔 출처를 달아줘.
   ```
3. `@`를 입력하면 경로 자동완성이 뜹니다. 붙인 파일은 그 세션의 컨텍스트로 즉시 읽힙니다.
4. 나온 답을 stage1 결과와 나란히 놓고 아래 확인 방법대로 비교하세요.


## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage2-context-attach</summary>

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
<pre class="ailab-term-body"><span class="t-accent">╭─── Claude Code v2.1.205 ─────────────────────────────────────────────────────╮</span>
<span class="t-accent">│</span>                                                    <span class="t-accent">│</span> <span class="t-accent">Tips for getting</span>        <span class="t-accent">│</span>
<span class="t-accent">│</span>                 <span class="t-white">Welcome back user!</span>                 <span class="t-accent">│</span> started                 <span class="t-accent">│</span>
<span class="t-accent">│</span>                                                    <span class="t-accent">│</span> Run /init to create a … <span class="t-accent">│</span>
<span class="t-accent">│</span>                       <span class="t-accent">▐▛███▜▌</span>                      <span class="t-accent">│</span> ─────────────────────── <span class="t-accent">│</span>
<span class="t-accent">│</span>                      <span class="t-accent">▝▜█████▛▘</span>                     <span class="t-accent">│</span> <span class="t-accent">What's new</span>              <span class="t-accent">│</span>
<span class="t-accent">│</span>                        <span class="t-accent">▘▘ ▝▝</span>                       <span class="t-accent">│</span> [VSCode] Added Focus v… <span class="t-accent">│</span>
<span class="t-accent">│</span> <span class="t-dim">Sonnet 5 · Claude Code</span> <span class="t-accent">│</span> Added `mode: "mask"` f… <span class="t-accent">│</span>
<span class="t-accent">│</span> <span class="t-dim">Co. Ltd.     </span>                                      <span class="t-accent">│</span> Added warnings to `cla… <span class="t-accent">│</span>
<span class="t-accent">│</span>             ~/…/stage2-context-attach              <span class="t-accent">│</span> <span class="t-status">/release-notes for more</span> <span class="t-accent">│</span>
<span class="t-accent">╰──────────────────────────────────────────────────────────────────────────────╯</span>


<span class="t-user">❯ @data/financials.json @raw/뉴스-NVIDIA-2026Q2전망.md</span>
<span class="t-user">  @raw/애널리스트-의견-2026.md @raw/적정가-가정-2026.md</span>
<span class="t-user">  이 자료들을 근거로 NVIDIA가 저평가/적정/고평가인지 분석해줘. 숫자엔 출처를</span>
<span class="t-user">  달아줘.</span>
<span class="t-dim">  ⎿  Read data/financials.json (31 lines)</span>
<span class="t-dim">  ⎿  Read raw/뉴스-NVIDIA-2026Q2전망.md (45 lines)</span>
<span class="t-dim">  ⎿  Read raw/애널리스트-의견-2026.md (47 lines)</span>
<span class="t-dim">  ⎿  Read raw/적정가-가정-2026.md (42 lines)</span>

<span class="t-accent">●</span> NVIDIA(NVDA) 저평가/적정/고평가 분석 - 2026-08-20 기준

  1. 확정 실적 (FY2026, 회계연도 종료 2026-01-25)

  ┌─────────────────┬──────────────────────────────┬─────────────────────────┐
  │      항목       │              값              │        전년 대비        │
  ├─────────────────┼──────────────────────────────┼─────────────────────────┤
  │ 매출액          │ $215,938M                    │ +65.4% (전년 $130,497M) │
  ├─────────────────┼──────────────────────────────┼─────────────────────────┤
  │ 영업이익        │ $130,387M (영업이익률 60.4%) │ -                       │
  ├─────────────────┼──────────────────────────────┼─────────────────────────┤
  │ 당기순이익      │ $120,067M (순이익률 55.6%)   │ +64.7% (전년 $72,880M)  │
  ├─────────────────┼──────────────────────────────┼─────────────────────────┤
  │ 주당순이익(EPS) │ $4.90                        │ 전년 $2.94              │
  └─────────────────┴──────────────────────────────┴─────────────────────────┘

  [출처: data/financials.json → NVIDIA Corp 10-K, SEC EDGAR CIK 0001045810,
  FY2026]

  2. 현재 밸류에이션 배수 - 기준에 따라 33~44배로 갈림

  - 주가: $216.85 (2026-08-20 종가) [출처: stockanalysis.com/stocks/nvda]
  - 시가총액: 약 $5,250B (한때 $4.5조 돌파 이력 있음) [출처:
  data/financials.json; seekingalpha.com "Nvidia tops $4.5 trillion market cap"]
  - PER(연간 실적 기준, FY2026 $4.90 EPS): $216.85 / $4.90 = 44.3배
  - PER(TTM 기준, stockanalysis.com 집계): 33.2배

  두 수치가 다른 이유는 "어느 기간을 기준으로 삼느냐" 차이이며,
  financials.json의 _data_noise 필드에 명시된 대로 이 자료는 FY2026 연간
  실적(44.3배)을 기준선으로 삼는다.

  3. 미래 실적 전망 - 아직 발표 전(2026-08-26 예정)

  - FY2027 Q2 실적 발표는 2026-08-26 예정 [출처:
  intellectia.ai/blog/nvidia-q2-fy27-earnings-preview-august-2026]
  - 회사 자체 전망 매출 $91.0B ± 2%, 애널리스트 40인 평균 $91.85B / EPS $2.08
  [출처: rexshares.com/nvidia-earnings]
  - 일부는 $93~95B(전년동기 대비 +67~75%)까지 전망 [출처:
  intellectia.ai/blog/nvda-stock-earnings-august-2026]
  - 이번 회계연도 매출 전망 $395.23B(+83.03%), 다음 회계연도 $568.63B(+43.87%)
  [출처: stockanalysis.com/stocks/nvda/forecast]
  - 미래 실적 기준 PER 약 34.2배(반도체 업종 평균보다 89% 높음), 2026 달력연도
  기준으로는 약 29배 [출처: 검색 종합, raw/애널리스트-의견-2026.md]

  4. 애널리스트 컨센서스 &amp; 적정가 모델

  - 애널리스트 61명 평균 의견 "적극 매수", 평균 목표주가 $304.64~305.86 [출처:
  S&amp;P Global 집계 등, 검색 종합]
  - 목표주가 범위: 최고 $500 / 최저 $250 - 이 최저값조차 현재가($216.85)보다
  높음 [출처: 검색 종합]
  - 컴퓨터 모델 기반 예측(더 보수적): 2026년 말 $199~255 [출처: 검색 종합]
  - Simply Wall St 계산모델 적정가: $268.22 (직전 $269.23에서 -0.37% 소폭 하향,
  매출성장률 37.36%·순이익률 53.69%·할인율 10.53% 가정) [출처: simplywall.st
  community narratives]

  현재가 대비 괴리:
  - 평균 목표주가($305) 대비: +41% 업사이드
  - 최저 목표주가($250) 대비: +15.3% 업사이드
  - 계산모델 적정가($268.22) 대비: +23.7% 업사이드

  5. 종합 판정 - "기준 시점"에 따라 결론이 갈린다

  ┌──────────────────────────────┬──────────────────────────────────────────┐
  │             관점             │                   판정                   │
  ├──────────────────────────────┼──────────────────────────────────────────┤
  │ 확정 실적(FY2026) 기준 PER   │ 고평가 - 절대 배수로는 시장 평균 대비    │
  │ 44배                         │ 상당히 비쌈                              │
  ├──────────────────────────────┼──────────────────────────────────────────┤
  │ TTM 기준 PER 33배            │ 다소 고평가 - 여전히 프리미엄 구간       │
  ├──────────────────────────────┼──────────────────────────────────────────┤
  │ 미래 실적 기준 PER 29~34배   │ 고평가(업종 대비 +89%) - 하지만 성장률을 │
  │                              │  감안하면 상대적으로 완화됨              │
  ├──────────────────────────────┼──────────────────────────────────────────┤
  │ 애널리스트 61인              │ 저평가 - 최저 목표가 대비도 +15%         │
  │ 목표주가(전원 현재가 상회)   │                                          │
  ├──────────────────────────────┼──────────────────────────────────────────┤
  │ 계산모델(DCF성) 적정가       │ 저평가 - 약 +24%                         │
  │ $268.22                      │                                          │
  └──────────────────────────────┴──────────────────────────────────────────┘

  결론: NVIDIA는 "절대 실적 배수(과거·현재)"로는 고평가, "향후 성장을 반영한
  애널리스트 컨센서스·적정가 모델"로는 저평가로 갈리는 종목이다. 이 괴리가
  우연이 아니라, NVIDIA 저평가론 전체가 향후 몇 년간 25~30%대 순이익·매출
  성장률이 유지된다는 전제 하나에 전적으로 의존하기 때문에 생긴다 [출처:
  raw/적정가-가정-2026.md "읽는 법"]. 그 전제가 유지된다고 보면 저평가,
  회의적이라면 고평가라는 뜻이므로, 단일 숫자로 "몇 % 저평가"라고 말하기보다는
  "성장률 가정 X%를 받아들이면 Y% 저평가" 식으로 조건부로 답하는 것이 정확하다.

  6. 판정을 흔들 수 있는 리스크 요인

  - 맞춤형 반도체(커스텀 실리콘) 확산: 구글 TPU·아마존 Trainium/Inferentia·MS
  커스텀 가속기 비중이 2025년 20.9% → 2026년 27.8%로 확대, 2028년 데이터센터
  연산의 37%까지 전망 [출처: fool.com "Nvidia's Biggest Risk Isn't Custom AI
  Chips..."]
  - AMD 경쟁: MI300 시리즈가 가격 대비 성능으로 도전, AMD는 2026년 EPS +64% 성장
  자체 전망 [출처: 검색 종합]
  - 높은 배수의 구조적 취약성: 현재 프리미엄(업종 대비 +89%)은 "완벽한 성장
  지속"을 전제하므로, 성장 기대치가 조금만 꺾여도 배수 자체가 낮아져(주가 하락)
  저평가 논리가 무너질 수 있음 [출처: tipranks.com 부정적 시나리오]

  요약 한 줄: 지금 주가($216.85)는 과거 실적 기준으로는 비싸 보이지만(PER
  33~44배), 시장 참여자 대부분(애널리스트 61명 전원, 적정가 계산모델)은 향후
  고성장을 근거로 이보다 15~40% 높은 가격이 정당하다고 본다 - 그 판단에
  동의하는지가 저평가/고평가 결론을 가른다.

<span class="t-status">✻ Sautéed for 52s</span></pre>
</div>

</details>


## 개선된점 / 개선해야할 점

**Context 제공을 통해 답변이 달라진 점을 확인하세요.**

- 매출 $215.9B·순이익 $120.1B·주가 $216.85 처럼 **실제 자료의 값**으로 답합니다.

- AI 에게 **근거 자료가 어디서 났어?** 라고 물어보면 `data/financials.json`·`raw/…` 에서 데이터 출처가 나왔다고 답합니다.

- 애널리스트 목표주가($250–$500), 맞춤형 반도체 리스크처럼 **실제 리포트의 논거**가 들어옵니다.

- 근거가 모델의 기억이 아니라 사용자가 통제하는 자료입니다. 그래서 stage1의 "낡음·출처불명" 문제가 줄어듭니다.

**그래도 여전히 불편한 것을 확인하세요.**

- **매번 손으로 붙여야 합니다.** 파일 하나만 빠뜨려도 근거가 반쪽이 됩니다. 세션을 새로 열 때마다 같은 일을 반복합니다. 남에게 맡길 때도 "이 네 개를 꼭 붙여"라고 매번 설명해야 합니다.

- **형식이 안 고정됩니다.** 지표를 몇 개 다룰지, 어떤 순서로 쓸지, 계산식을 보일지가 그때그때 다릅니다.

- **지표 계산을 검산해 주는 사람이 없습니다.** 주가배수를 틀리게 계산해도 아무도 걸러내지 못합니다.

- **판정 기준(적정 범위)이 없습니다.** "목표 주가배수 몇 배까지가 정상인가"를 아무도 안 정했습니다.

- **재사용·자산화가 안 됩니다.** 좋은 분석이 나와도 대화창에 머뭅니다.

## Stage 2 의 결론

**🎯 그라운딩의 효과와 한계**

Context 를 추가하면 답변의 품질은 올라갑니다.

다만 붙이는 행위·형식·기준·검증 방식등은 여전히 암묵지로 남아있습니다.

이 임시 규칙들을 파일로 고정해 프로젝트에 항상 얹히게 만드는 것이 다음 [stage3](stage3-harness.md)의 하네스입니다.
