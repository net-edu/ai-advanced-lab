# stage4

<p class="ailab-title-subtitle">- 자가 수정 loop 만들기</p>

이 단계에서는 Stage 3 에서 만든 하네스에 **자가 수정을 위한 피드백 루프(loop)**를 만듭니다.

정형 데이터는 Stop hook이, 비정형은 검토 subagent가 검증하고, 통과할 때까지 AI가 스스로 고치게 만듭니다.

이 실습을 끝내면 hook 실패 → 리포트 재작성 → 재시도가 사람 개입 없이 자동으로 도는 하네스를 갖습니다.

## 배경 - 하네스만으론 부족한 세 가지

- **판정 부재** - 그럴듯한 보고서가 나오지만 맞는지 가릴 기준이 없습니다.

- **정합성 붕괴 위험** - 단위 오류, 지표 재계산 불일치, 출처 없는 수치가 걸러지지 않습니다. 문장 하나하나는 출처가 있어도 전체로 보면 말이 안 되는 경우가 있고, 기업 적정가치 판단에선 이 하나로 분석 전체가 무너집니다.

- **자동화 부재** - 매번 사람이 눈으로 검사하고, 틀리면 손으로 다시 시킵니다.

지침은 부탁일 뿐입니다.

그 부탁을 판정 기준과 강제 장치로 바꾸는 것이 loop입니다.

loop 자체의 개념은 [Loop Engineering](../concepts/loop-engineering.md) 에서 봅니다.

## Oracle과 판정 대상의 성격

> 오라클(Oracle)은 AI 모델의 답변이 맞는지 판단하는 데 쓰이는 정답 기준(정답 데이터나 채점 로직)을 뜻하며, 모델 성능을 평가할 때 비교 대상이 되는 "정답지" 역할을 합니다.

판정할 결과물이 성격에 따라 판정 방법은 두 갈래로 나뉩니다.

| 유형 | 판정 방법 | 도구 | 예 |
|---|---|---|---|
| 명확형 | 스크립트가 자동으로 pass/fail | Stop hook | 지표 재계산이 원자료와 일치하는가 |
| 불명확형 | 루브릭 + 골든예제 | 검토 subagent | 분석이 충분히 깊은가 |

### 결과물을 O/X 로 명확하게 판정할 수 있는 경우

- 작업 결과물을 Pass/Fail 혹은 O/X 방식으로 명확히 판별할 수 있는 경우 보통 작업 스크립트(bash, powershell 등) 혹은 수식 계산등의 방법을 사용합니다.

### 결과물을 O/X 와 같은 방식으로 판정할 수 없는 경우

**불명확형**은 자동 판정이 안 됩니다.

대신 항목별 점수 규칙(루브릭)과 좋은 사례(골든예제)를 통하여 우회적으로 계산할 수 있는 지표를 만듭니다.

본 실습 예시(기업 적정가치 판단)에서 만들어야 하는 루브릭은 근거-주장 연결·긍정/우려 균형·종합 판정 일관성을 지표화 시키는 작업을 뜻합니다.

> 루브릭(rubric)은 결과물의 품질을 평가하기 위해 항목별 기준과 점수 척도를 미리 정해둔 채점표로, AI 모델의 답변 품질을 일관되게 평가할 때 자주 쓰입니다.

"설득력 있는 분석"이 무엇인지 처음부터 정의하기는 어렵습니다.

그래서 하네스 설계자는 반대로 접근해야 합니다.

- 누구나 좋다고 인정한 골든 예제를 나란히 놓고 공통점을 찾으면, 그 공통점이 루브릭 항목이 됩니다.

> 골든 마스터(Golden Master)는 사람이 직접 검증해 정답으로 확정해 둔 기준 답변 세트로, 이후 모델이나 시스템의 결과를 비교해 회귀(오류 발생) 여부를 판단하는 잣대로 사용됩니다.

이 과정이 암묵지를 형식지화 하는 과정입니다.

즉, 사람의 경험을 통해 만들어진 내적인 기준선을 관찰 가능한 항목과 숫자로 못 박는 과정입니다.

## Hook은 지침을 강제한다

Hook은 판정 기준을 사람이 매번 확인하지 않아도 도구가 대신 실행하고, 안 되면 못 넘어가게 막는 장치입니다.

Hook 은 이벤트 계층 / 호출 시점에 따라 호출 될 수 있도록 만들 수 있습니다.

자세한 내용은 [Hook 살펴보기](../concepts/what-is-hook.md) 에서 자세히 봅니다.

## AI 에게 언제 더 많은 권한을 부여하는가

loop를 구성한 후, AI 를 통해 나오는 산출물의 퀄리티가 만족스러워지면

`acceptEdits` 모드로 바꿔 파일 수정마다 승인을 묻지 않게 할 수 있습니다.

판단 기준은 하나입니다 - hook이 잘못된 결과를 확실히 걸러 준다는 확신입니다.

판정과 강제가 자리 잡기 전에 권한부터 열면, 틀린 수정이 걸러지지 않고 그대로 남습니다.

loop를 먼저 만들고 권한을 여세요.

## 실습 단계

### 1. 권한 모드를 확인하세요

`.claude/settings.json` 에 `permissions.defaultMode` 가 `acceptEdits` 로 잡혀 있습니다.

loop는 `skill 실행 → hook 실패 → 리포트 수정 → 재시도` 를 여러 번 반복하므로, `default` 모드면 반복마다 편집을 손으로 승인해야 해서 "자기수정"이 무색해집니다.

`acceptEdits`는 작업 디렉터리 내 편집만 자동 승인하고, `.claude/`·`.git` 같은 보호 경로와 그 밖의 동작(예: 네트워크 접근)은 여전히 승인을 받습니다.

### 2. 세션을 열고 초안을 만드세요

stage4 폴더에서 `claude` 를 실행하세요.

`data/financials.json` 과 `raw/` 를 전부 읽히고 `/fair-value-report NVIDIA` 를 실행하세요.

리포트는 `reports/fair-value.md` 한 파일에 나옵니다.

### 3. 리뷰어 subagent로 정성 분석을 채점하세요

`fair-value-reviewer` subagent를 호출하세요.

이 subagent는 hook이 판정할 수 없는 정성 분석의 균형·근거·종합 일관성을 루브릭으로 채점합니다(PASS≥9/12).

미달이면 지적을 반영해 보강하세요.

### 4. Stop hook이 정형 검증을 걸게 하세요

Claude가 응답 한 턴을 끝낼 때마다(세션 종료가 아닙니다) Stop hook이 `scripts/validate_fair_value.py` 를 돌립니다.

이 스크립트는 `data/financials.json` 으로 다섯 지표를 재계산해 리포트 값과 대조합니다.

형식이나 지표가 틀리면 `exit 2` 로 턴이 막히고, 실패 사유가 Claude에게 재투입됩니다.

### 5. 통과할 때까지 반복하게 두세요

hook 통과 + 리뷰어 PASS가 될 때까지 loop가 스스로 돕니다.

이 반복이 도는 걸 보면 자기수정 하네스가 완성됩니다.

!!! tip "hook이 왜 막는지 먼저 보고 싶다면"
    `examples/sample-flawed-fair-value.md` 를 `reports/fair-value.md` 로 복사해 넣고 한 턴을 끝내 보세요. 결함 리포트를 hook이 `exit 2` 로 되돌리는 장면이 바로 나옵니다.

!!! warning "loop가 잘 안 끝나면"
    hook 검증→재시도가 여러 번 이어지면 컨텍스트가 계속 쌓입니다.

    반복이 3회를 넘으면 `/context` 로 쌓인 양을 확인하고, 필요하면 `/compact` 로 압축하세요.

    loop가 리포트를 이상하게 망가뜨렸을 때는 `/rewind`(또는 Esc 두 번)로 특정 시도 이전으로 되돌립니다.

    세 명령의 쓰임은 [권한 모드와 슬래시 명령](../claude-code/permissions-and-commands.md) 에 정리돼 있습니다.

### 실습 결과 확인 방법

- `reports/fair-value.md` 가 여섯 섹션을 갖춥니다.

- 결함 예시를 넣었을 때 hook이 `exit 2` 로 되돌린 뒤, 통과본까지 loop가 스스로 도달합니다.

- hook 통과와 리뷰어 PASS(≥9/12)가 동시에 만족돼야 loop가 끝납니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다.

자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage4-loop</summary>

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
  <span class="t-accent">▘▘ ▝▝</span>    ~/…/market-analysis-valuation-nvidia-plain/stage4-loop


<span class="t-user">❯ /fair-value-report NVIDIA</span>

<span class="t-accent">●</span> I'll start by reading the financial data and unstructured sources needed for
  the report.

<span class="t-dim">  Read 4 files, ran 2 shell commands (ctrl+o to expand)</span>

<span class="t-accent">●</span> 이제 정량 지표를 계산하고 리포트를 작성하겠습니다. 계산 결과는 CLAUDE.md
  예시값과 일치합니다(EPS $4.90, PER 44.3, 매출증가율 65.5%, 영업이익률 60.4%,
  순이익증가율 64.7%).

<span class="t-accent">●</span> Write(reports/fair-value.md)
<span class="t-dim">  ⎿  Added 86 lines, removed 123 lines</span>
<span class="t-dim">        1 -# NVIDIA(NVDA) 적정가치 판단 리포트</span>
<span class="t-dim">        1 +# NVIDIA (NVDA) 적정가치 판단 리포트</span>
<span class="t-dim">        2</span>
<span class="t-dim">        3  ## 종목 개요</span>
<span class="t-dim">        4 +- **종목명 / 코드**: NVIDIA Corporation / NVDA</span>
<span class="t-dim">        5 +- **기준일**: 2026-08-20 (종가 기준), 재무 데이터는 FY2026 10-</span>
<span class="t-dim">          +K(회계연도 종료 2026-01-25) 기준</span>
<span class="t-dim">        6 +- **현재 주가**: $216.85[출처: data/financials.json]</span>
<span class="t-dim">        7 +- **시가총액**: 약 $5,250B(5.25조 달러)[출처: data/financials.</span>
<span class="t-dim">          +json]</span>
<span class="t-dim">        8</span>
<span class="t-dim">        5 -| 항목 | 값 |</span>
<span class="t-dim">        6 -|------|-----|</span>
<span class="t-dim">        7 -| 종목명 | NVIDIA Corporation |</span>
<span class="t-dim">        8 -| 종목코드 | NVDA (NASDAQ) |</span>
<span class="t-dim">        9 -| 기준일 | FY2026 10-K(연결, 회계연도 종료 2026-01-25) / 조회</span>
<span class="t-dim">          -일 2026-08-20 |</span>
<span class="t-dim">       10 -| 현재주가 | $216.85[출처: data/financials.json] |</span>
<span class="t-dim">       11 -| 시가총액 | 약 $5.25조[출처: data/financials.json] |</span>
<span class="t-dim">        9 +&gt; 참고: FY2027 Q2(2026년 5~7월 분기) 실적은 2026-08-26 발표 예</span>
<span class="t-dim">          +정으로 이 리포트 작성 시점(기준일</span>
<span class="t-dim">       10 +&gt; 2026-08-20)엔 아직 미확정이다[출처: raw/뉴스-NVIDIA-2026Q2전</span>
<span class="t-dim">          +망.md, intellectia.ai]. 아래 정량</span>
<span class="t-dim">       11 +&gt; 분석은 이미 확정된 FY2026 연간 실적(10-K)만을 사용한다.</span>
<span class="t-dim">       12</span>
<span class="t-dim">       13 ----</span>
<span class="t-dim">       14 -</span>
<span class="t-dim">       13  ## 정량 분석 (정형)</span>
<span class="t-dim">       14</span>
<span class="t-dim">       17 -### 지표 계산 (FY2026 기준)</span>
<span class="t-dim">       15 +| 지표 | 계산식 | 값 |</span>
<span class="t-dim">       16 +|------|--------|-----|</span>
<span class="t-dim">       17 +| 주당순이익(EPS) | 희석주당이익(10-K, FY2026) | **$4.90**[출</span>
<span class="t-dim">          +처: data/financials.json] |</span>
<span class="t-dim">       18 +| 주가배수(PER) | 주가($216.85) ÷ EPS($4.90) | **44.3**[출처:</span>
<span class="t-dim">          +data/financials.json] |</span>
<span class="t-dim">       19 +| 매출 증가율(YoY) | (매출 $215,938M − 전기 $130,497M) ÷ 전기</span>
<span class="t-dim">          +$130,497M | **65.5%**[출처: data/financials.json] |</span>
<span class="t-dim">       20 +| 영업이익률 | 영업이익 $130,387M ÷ 매출액 $215,938M | **60.4%</span>
<span class="t-dim">          +**[출처: data/financials.json] |</span>
<span class="t-dim">       21 +| 순이익 증가율(YoY) | (순이익 $120,067M − 전기 $72,880M) ÷ 전</span>
<span class="t-dim">          +기 $72,880M | **64.7%**[출처: data/financials.json] |</span>
<span class="t-dim">       22</span>
<span class="t-dim">       19 -| 지표 | 계산식 | 값 | 비고 |</span>
<span class="t-dim">       20 -|------|--------|-----|------|</span>
<span class="t-dim">       21 -| **주당순이익(EPS)** | 희석주당이익(재무제표) | **$4.90** | [</span>
<span class="t-dim">          -출처: data/financials.json] |</span>
<span class="t-dim">       22 -| **주가배수(PER)** | 주가 ÷ 주당순이익 | **44.3배** | 216.85</span>
<span class="t-dim">          -÷ 4.90 (현재 실적 기준) |</span>
<span class="t-dim">       23 -| **매출 증가율** | (215,938 − 130,497) ÷ 130,497 | **65.5%**</span>
<span class="t-dim">          -| 작년 대비 |</span>
<span class="t-dim">       24 -| **영업이익률** | 130,387 ÷ 215,938 | **60.4%** | |</span>
<span class="t-dim">       25 -| **순이익 증가율** | (120,067 − 72,880) ÷ 72,880 | **64.7%**</span>
<span class="t-dim">          -| 작년 대비 |</span>
<span class="t-dim">       23 +**소스 충돌 및 처리**: stockanalysis.com은 최근 4개 분기(TTM)</span>
<span class="t-dim">          +기준 주가배수를 33.2배로 표기하지만,</span>
<span class="t-dim">       24 +이 값은 분기 실적을 섞어 쓴 것이라 원본 10-K 연간 실적과 기준</span>
<span class="t-dim">          +이 다르다. 원본</span>
<span class="t-dim">       25 +`data/financials.json`(FY2026 연간 10-K, 1차 출처)을 기준으로</span>
<span class="t-dim">          +삼아 **44.3배**를 정본 값으로</span>
<span class="t-dim">       26 +사용한다[출처: data/financials.json, _data_noise 필드].</span>
<span class="t-dim">       27</span>
<span class="t-dim">       27 -### 정량 신호 해석</span>
<span class="t-dim">       28 -</span>
<span class="t-dim">       29 -- **현재 실적 기준으로는 극단적으로 비싸다**: 주가배수 44.3배</span>
<span class="t-dim">          -는 반도체 대형주 평균(20~25배)을</span>
<span class="t-dim">       30 -  크게 상회. 다만 stockanalysis.com은 최근 4개 분기(TTM) 기준</span>
<span class="t-dim">          -으로 33.2배로 표기(`_data_noise`</span>
<span class="t-dim">       31 -  참고) - 어느 기간을 기준으로 삼느냐에 따라 "비싼 정도"조차</span>
<span class="t-dim">          -달라진다.</span>
<span class="t-dim">       32 -- **이익 성장은 압도적**: 매출·순이익이 각각 작년 대비 +65.5%·</span>
<span class="t-dim">          -+64.7% 늘었고, 영업이익률도</span>
<span class="t-dim">       33 -  60.4%로 반도체 업종에서 이례적인 수준이다.</span>
<span class="t-dim">       34 -- 즉 "비싸긴 한데 그만큼 실제로 많이 벌고 있다"는 게 정량 분석</span>
<span class="t-dim">          -의 결론 - 이 성장이 앞으로도</span>
<span class="t-dim">       35 -  이어지는지는 정성 분석(비정형 자료)에서 다뤄야 한다.</span>
<span class="t-dim">       36 -</span>
<span class="t-dim">       37 ----</span>
<span class="t-dim">       38 -</span>
<span class="t-dim">       28  ## 정성 분석 (비정형)</span>
<span class="t-dim">       29</span>
<span class="t-dim">       41 -### 긍정 요인 (성장성·사업 기회)</span>
<span class="t-dim">       30 +### 긍정 요인</span>
<span class="t-dim">       31 +1. **데이터센터·AI 인프라 수요 지속**: Blackwell(차세대 칩) 생</span>
<span class="t-dim">          +산 확대와 대형 고객사들의</span>
<span class="t-dim">       32 +   대규모 설비투자가 계속되고 있다[출처: raw/애널리스트-의견-2</span>
<span class="t-dim">          +026.md, rexshares.com]. FY2027</span>
<span class="t-dim">       33 +   Q2 매출은 회사 자체 전망 약 $91.0B(±2%), 일부 애널리스트는</span>
<span class="t-dim">          +$93~95B(작년 동기 대비</span>
<span class="t-dim">       34 +   +67~75%)까지 예상한다[출처: raw/뉴스-NVIDIA-2026Q2전망.md,</span>
<span class="t-dim">          +intellectia.ai].</span>
<span class="t-dim">       35 +2. **압도적 시장 지배력**: 세계 시가총액 1위이자 반도체 업종</span>
<span class="t-dim">          +시가총액 1위 지위를 유지하고</span>
<span class="t-dim">       36 +   있다[출처: raw/애널리스트-의견-2026.md, companiesmarketcap.</span>
<span class="t-dim">          +com].</span>
<span class="t-dim">       37 +3. **애널리스트 61명의 목표주가가 전부 현재가보다 높음**: 최저</span>
<span class="t-dim">          + 목표가($250)조차 현재가</span>
<span class="t-dim">       38 +   ($216.85)를 상회하며, 평균 목표주가는 $304.64~305.86이다[출</span>
<span class="t-dim">          +처: raw/애널리스트-의견-2026.md,</span>
<span class="t-dim">       39 +   S&amp;P Global 집계 등].</span>
<span class="t-dim">       40</span>
<span class="t-dim">       43 -1. **데이터센터·AI 인프라 수요 지속**: FY2027 Q2(2026-08-26 발</span>
<span class="t-dim">          -표 예정) 예상 매출 $91.85B</span>
<span class="t-dim">       44 -   (작년 대비 +67~75%), 데이터센터용 매출 $25B+ 전망, Blackwel</span>
<span class="t-dim">          -l(차세대 칩) 생산 확대가</span>
<span class="t-dim">       45 -   성장 축[출처: raw/뉴스-NVIDIA-2026Q2전망.md].</span>
<span class="t-dim">       41 +### 우려 요인</span>
<span class="t-dim">       42 +1. **맞춤형 반도체(커스텀 실리콘) 확산**: 구글 TPU, 아마존 Tra</span>
<span class="t-dim">          +inium/Inferentia, MS 커스텀</span>
<span class="t-dim">       43 +   가속기가 범용 GPU를 일부 대체하는 흐름 - 비중이 2025년 20.9</span>
<span class="t-dim">          +%→2026년 27.8%로 확대 전망,</span>
<span class="t-dim">       44 +   2028년에는 데이터센터 연산의 37%까지 차지할 것이라는 전망도</span>
<span class="t-dim">          + 있다[출처:</span>
<span class="t-dim">       45 +   raw/뉴스-NVIDIA-2026Q2전망.md, fool.com].</span>
<span class="t-dim">       46 +2. **AMD 경쟁 심화**: MI300 시리즈가 가격 대비 성능으로 도전하</span>
<span class="t-dim">          +고 있고, AMD는 2026년 주당순이익</span>
<span class="t-dim">       47 +   +64% 성장을 자체 전망한다[출처: raw/애널리스트-의견-2026.md</span>
<span class="t-dim">          +, 검색 종합].</span>
<span class="t-dim">       48 +3. **높은 밸류에이션의 구조적 취약성**: 미래 예상 실적 기준 주</span>
<span class="t-dim">          +가배수도 약 29~34배로 반도체</span>
<span class="t-dim">       49 +   업종 평균보다 89% 높다. 이는 "향후에도 완벽한 성장이 지속된</span>
<span class="t-dim">          +다"는 전제에 의존하므로, 성장</span>
<span class="t-dim">       50 +   기대치가 조금만 꺾여도 주가배수 자체가 낮아질(주가 하락) 위</span>
<span class="t-dim">          +험이 있다[출처:</span>
<span class="t-dim">       51 +   raw/애널리스트-의견-2026.md, tipranks.com].</span>
<span class="t-dim">       52 +4. **애널리스트 목표가 자체의 편차가 큼**: 61명의 목표가가 $25</span>
<span class="t-dim">          +0~$500로 최고/최저 간 2배</span>
<span class="t-dim">       53 +   가까이 벌어져 있어, "목표가가 다 높다"는 사실만으로 확신을</span>
<span class="t-dim">          +갖기엔 합의 수준이 약하다</span>
<span class="t-dim">       54 +   [출처: raw/적정가-가정-2026.md].</span>
<span class="t-dim">       55</span>
<span class="t-dim">       47 -2. **매출 성장 전망 지속**: 이번 회계연도 매출 $395.23B(+83%),</span>
<span class="t-dim">          - 다음 회계연도 $568.63B(+43.87%)</span>
<span class="t-dim">       48 -   전망 - 애널리스트는 3년 뒤에도 25~30%대 성장 예상[출처: raw</span>
<span class="t-dim">          -/애널리스트-의견-2026.md].</span>
<span class="t-dim">       49 -</span>
<span class="t-dim">       50 -3. **압도적 시장 지배력**: 세계 시가총액 1위, 반도체 시가총액</span>
<span class="t-dim">          -1위, 시가총액 한때 $4.5조 돌파</span>
<span class="t-dim">       51 -   [출처: raw/뉴스-NVIDIA-2026Q2전망.md].</span>
<span class="t-dim">       52 -</span>
<span class="t-dim">       53 -### 우려 요인 (리스크·제약)</span>
<span class="t-dim">       54 -</span>
<span class="t-dim">       55 -1. **맞춤형 반도체 확산**: 구글 TPU·아마존 Trainium·MS 커스텀</span>
<span class="t-dim">          -가속기 등 대형 고객사의 자체</span>
<span class="t-dim">       56 -   칩 개발 - 맞춤형 반도체 비중 2025년 20.9%→2026년 27.8%, 202</span>
<span class="t-dim">          -8년 데이터센터 연산의 37%까지</span>
<span class="t-dim">       57 -   차지할 것이라는 전망[출처: raw/뉴스-NVIDIA-2026Q2전망.md].</span>
<span class="t-dim">       58 -</span>
<span class="t-dim">       59 -2. **AMD 경쟁 심화**: MI300 시리즈가 가격 대비 성능으로 도전,</span>
<span class="t-dim">          -AMD 2026년 주당순이익 +64%</span>
<span class="t-dim">       60 -   성장을 자체 전망[출처: raw/애널리스트-의견-2026.md].</span>
<span class="t-dim">       61 -</span>
<span class="t-dim">       62 -3. **높은 주가배수의 위험**: 미래 예상 실적 기준 주가배수 29~3</span>
<span class="t-dim">          -4배(반도체 업종 평균 대비 89%</span>
<span class="t-dim">       63 -   높음)는 "앞으로도 완벽하게 성장한다"는 것을 전제 - 성장 기</span>
<span class="t-dim">          -대치가 조금만 꺾여도 주가배수</span>
<span class="t-dim">       64 -   자체가 낮아질 수 있음[출처: raw/애널리스트-의견-2026.md].</span>
<span class="t-dim">       65 -</span>
<span class="t-dim">       66 ----</span>
<span class="t-dim">       67 -</span>
<span class="t-dim">       56  ## 종합 판정</span>
<span class="t-dim">       57</span>
<span class="t-dim">       70 -이 종목의 최종 판정은 **저평가**이다(애널리스트 의견 근거).</span>
<span class="t-dim">       58 +정량 신호와 정성 판단이 정면으로 충돌한다.</span>
<span class="t-dim">       59</span>
<span class="t-dim">       72 -#### 정량 vs 정성: 차이의 본질</span>
<span class="t-dim">       73 -- **현재 실적 기준 신호**: 주가배수 44.3배(또는 소스에 따라 33</span>
<span class="t-dim">          -.2배) → 현재가 "극히 비싼 수준"</span>
<span class="t-dim">       74 -- **애널리스트 의견**: 평균 목표주가 $304.64~305.86(현재가 대</span>
<span class="t-dim">          -비 +40~41%), 최고 $500 / 최저</span>
<span class="t-dim">       75 -  $250 - **가장 낮은 목표가조차 현재가($216.85)보다 높다**.</span>
<span class="t-dim">       76 -- **계산모델 자체 추정**(Simply Wall St): 적정가 $268.22 - 애</span>
<span class="t-dim">          -널리스트 평균보다는 낮지만</span>
<span class="t-dim">       77 -  현재가보다는 높음.</span>
<span class="t-dim">       60 +- **정량(현재 실적 기준)**: PER 44.3배는 절대적으로 높은 수준</span>
<span class="t-dim">          +이다[출처:</span>
<span class="t-dim">       61 +  data/financials.json].</span>
<span class="t-dim">       62 +- **정성(미래 예상 기준)**: 애널리스트 61명 전원의 목표주가가</span>
<span class="t-dim">          +현재가보다 높고(최저 $250 &gt;</span>
<span class="t-dim">       63 +  현재가 $216.85), Simply Wall St 계산모델의 적정가도 $268.22</span>
<span class="t-dim">          +로 현재가보다 20% 이상 높다</span>
<span class="t-dim">       64 +  [출처: raw/적정가-가정-2026.md].</span>
<span class="t-dim">       65</span>
<span class="t-dim">       79 -#### 왜 "저평가"인가?</span>
<span class="t-dim">       66 +이 리포트는 **정량(현재 실적) 쪽을 더 신뢰**해 **고평가**로 판</span>
<span class="t-dim">          +정한다. 이유는 다음과 같다.</span>
<span class="t-dim">       67 +"싸다"는 정성 판단은 전부 **향후 수년간 매출·순이익 성장률 25~</span>
<span class="t-dim">          +30%가 유지되고, 미래 예상</span>
<span class="t-dim">       68 +주가배수 29~34배(반도체 업종 평균 대비 +89%)가 정당화된다**는</span>
<span class="t-dim">          +단일 가정에 의존하는데</span>
<span class="t-dim">       69 +[출처: raw/애널리스트-의견-2026.md], 이 가정을 위협하는 구조적</span>
<span class="t-dim">          + 리스크(맞춤형 반도체 확산,</span>
<span class="t-dim">       70 +AMD 경쟁)가 이미 실체화되고 있다[출처: raw/뉴스-NVIDIA-2026Q2</span>
<span class="t-dim">          +전망.md]. 반면 현재 실적 기준</span>
<span class="t-dim">       71 +지표(PER 44.3배, `data/financials.json`)는 이미 확정된 10-K 수</span>
<span class="t-dim">          +치로 가정이 개입할 여지가</span>
<span class="t-dim">       72 +없다. 또한 애널리스트 목표가 자체도 $250~$500로 2배 가까이 벌</span>
<span class="t-dim">          +어져 있어[출처:</span>
<span class="t-dim">       73 +raw/적정가-가정-2026.md] "만장일치로 저평가"라 보기엔 합의 강</span>
<span class="t-dim">          +도가 약하다.</span>
<span class="t-dim">       74</span>
<span class="t-dim">       81 -이 종목의 판정은 **미래 예상 가정(성장률·미래 주가배수가 몇 년</span>
<span class="t-dim">          -간 유지되느냐)에 전적으로</span>
<span class="t-dim">       82 -달렸다**:</span>
<span class="t-dim">       75 +다만 이 판정은 **경계선에 가까운 고평가**다 - 만약 25~30% 성장</span>
<span class="t-dim">          +이 실제로 몇 년간 유지된다면</span>
<span class="t-dim">       76 +현재 주가는 오히려 저평가로 재평가될 여지가 있다. 즉 이 종목의</span>
<span class="t-dim">          + 판정은 사실상 "향후 성장률·</span>
<span class="t-dim">       77 +목표 주가배수를 얼마로 볼 것인가"라는 가정 하나에 좌우된다.</span>
<span class="t-dim">       78</span>
<span class="t-dim">       84 -1. **현재 실적 기준으로 비쌈은 사실이나, 성장률이 이례적으로</span>
<span class="t-dim">          -높다**</span>
<span class="t-dim">       85 -   - 현재 주가배수 44.3배는 FY2026 실적(주당순이익 $4.90) 기준</span>
<span class="t-dim">          -이지만, 순이익이 이미 작년</span>
<span class="t-dim">       86 -     대비 +64.7% 성장 중이며 애널리스트는 향후 매출도 +83%, +4</span>
<span class="t-dim">          -4%로 급성장을 예상한다.</span>
<span class="t-dim">       87 -   - 이 성장이 지속되면 미래 예상 주당순이익은 빠르게 상승해</span>
<span class="t-dim">          -미래 예상 주가배수는 현재</span>
<span class="t-dim">       88 -     실적 기준보다 훨씬 낮아진다.</span>
<span class="t-dim">       89 -</span>
<span class="t-dim">       90 -2. **애널리스트 목표주가가 전부 현재가 위에 있다는 점의 의미**</span>
<span class="t-dim">       91 -   - 61명 중 최저 목표가($250)도 현재가보다 15% 높다 - 이는 "</span>
<span class="t-dim">          -현재 성장세가 최소한 어느</span>
<span class="t-dim">       92 -     정도는 지속된다"는 데 애널리스트들이 광범위하게 동의한다</span>
<span class="t-dim">          -는 신호.</span>
<span class="t-dim">       93 -   - 다만 이 의견 자체가 **AI 투자 붐이라는 하나의 이야기에 쏠</span>
<span class="t-dim">          -려 있을 위험**은 정성적으로</span>
<span class="t-dim">       94 -     견제해야 한다.</span>
<span class="t-dim">       95 -</span>
<span class="t-dim">       96 -3. **우려 시나리오와의 균형**</span>
<span class="t-dim">       97 -   - 맞춤형 반도체(TPU 등)가 예상보다 빨리 데이터센터 연산 시</span>
<span class="t-dim">          -장을 잠식하면 → 성장률 가정이</span>
<span class="t-dim">       98 -     꺾이고 미래 예상 주가배수가 현재 실적 기준 수준에 머물러</span>
<span class="t-dim">          -"고평가"로 뒤집힐 수 있다.</span>
<span class="t-dim">       99 -   - Simply Wall St 계산모델의 적정가($268.22)가 애널리스트 평</span>
<span class="t-dim">          -균보다 낮다는 것도, 시나리오에</span>
<span class="t-dim">      100 -     따라 적정가가 갈릴 수 있음을 보여준다.</span>
<span class="t-dim">      101 -</span>
<span class="t-dim">      102 -#### 판정 근거</span>
<span class="t-dim">      103 -</span>
<span class="t-dim">      104 -| 판정 | 이유 |</span>
<span class="t-dim">      105 -|------|------|</span>
<span class="t-dim">      106 -| **저평가** | 애널리스트 목표주가 전체($250~$500)가 현재가보</span>
<span class="t-dim">          -다 높고, 매출·이익 성장률이 이례적으로 높아 미래 예상 주가배수</span>
<span class="t-dim">          - 관점에서는 현재 실적만큼 비싸지 않을 가능성이 큼. |</span>
<span class="t-dim">      107 -| 대안(적정~고평가) | 맞춤형 반도체 확산·경쟁 심화로 성장률이</span>
<span class="t-dim">          -예상보다 빨리 꺾이면, 계산모델 적정가($268)나 그 아래로 수렴할</span>
<span class="t-dim">          - 위험. |</span>
<span class="t-dim">      108 -| **최종 선택 이유** | 데이터센터 수요·Blackwell 생산 확대가</span>
<span class="t-dim">          -근시일(6~12개월) 성장 동력으로 작용할 확률이 높고, 애널리스트</span>
<span class="t-dim">          -의견이 광범위하게 저평가로 수렴. 다만 높은 주가배수가 "완벽한</span>
<span class="t-dim">          -성장"을 전제한다는 점은 리스크로 남긴다. |</span>
<span class="t-dim">      109 -</span>
<span class="t-dim">      110 ----</span>
<span class="t-dim">      111 -</span>
<span class="t-dim">       79  ## 결론</span>
<span class="t-dim">       80</span>
<span class="t-dim">      114 -### 투자의견: **매수** (Buy, 애널리스트 다수 의견 근거)</span>
<span class="t-dim">       81 +**투자의견**: 고평가 - 단기 관점에서는 신중, 다만 성장 스토리</span>
<span class="t-dim">          +가 유효한 동안은 프리미엄이</span>
<span class="t-dim">       82 +정당화될 수 있는 "조건부 고평가".</span>
<span class="t-dim">       83</span>
<span class="t-dim">      116 -**목표주가**: $304.64~305.86 (애널리스트 평균)</span>
<span class="t-dim">      117 -**목표 기간**: 12개월</span>
<span class="t-dim">      118 -**수익률**: +40~41%</span>
<span class="t-dim">       84 +**판정을 좌우한 미래 예상 가정**:</span>
<span class="t-dim">       85 +- 목표 주가배수: 29~34배(미래 예상 실적 기준, 반도체 업종 평균</span>
<span class="t-dim">          + 대비 +89%)[출처:</span>
<span class="t-dim">       86 +  raw/애널리스트-의견-2026.md]</span>
<span class="t-dim">       87 +- 성장률 가정: 향후 3년간 매출·순이익 성장률 25~30% 유지[출처:</span>
<span class="t-dim">          + raw/애널리스트-의견-2026.md]</span>
<span class="t-dim">       88 +- 위 가정이 현실화되지 않으면(예: 맞춤형 반도체 대체 가속, 성</span>
<span class="t-dim">          +장률 둔화) 현재 주가배수</span>
<span class="t-dim">       89 +  44.3배는 과도한 프리미엄으로 재평가될 수 있다.</span>
<span class="t-dim">       90</span>
<span class="t-dim">      120 -### 판정을 좌우한 미래 예상 가정</span>
<span class="t-dim">       91 +**유의점**:</span>
<span class="t-dim">       92 +- FY2027 Q2 실적(2026-08-26 발표 예정)은 이 리포트 작성 시점에</span>
<span class="t-dim">          + 아직 미확정이므로, 실적 발표</span>
<span class="t-dim">       93 +  후 정량 지표는 갱신이 필요하다[출처: raw/뉴스-NVIDIA-2026Q2</span>
<span class="t-dim">          +전망.md].</span>
<span class="t-dim">       94 +- "목표 주가배수 29~34배·성장률 25~30%"가 적정한 범위인지에 대</span>
<span class="t-dim">          +한 명확한 판단 기준은 이</span>
<span class="t-dim">       95 +  리포트 자체에는 없다 - 여러 리포트의 가정을 종합해 그 근거를</span>
<span class="t-dim">          + 만드는 작업이 남아 있다.</span>
<span class="t-dim">       96</span>
<span class="t-dim">      122 -| 가정 | 값 | 근거 |</span>
<span class="t-dim">      123 -|------|-----|------|</span>
<span class="t-dim">      124 -| **매출 성장률(향후 1~2년)** | +83%, +44% | 애널리스트 평균(</span>
<span class="t-dim">          -이번/다음 회계연도) |</span>
<span class="t-dim">      125 -| **장기 성장률(3년 이상)** | 25~30% | 애널리스트 평균 |</span>
<span class="t-dim">      126 -| **미래 예상 주가배수** | 29~34배 | 반도체 업종 대비 89% 높은</span>
<span class="t-dim">          - 수준 전제 |</span>
<span class="t-dim">      127 -</span>
<span class="t-dim">      128 -### 유의사항</span>
<span class="t-dim">      129 -</span>
<span class="t-dim">      130 -1. **맞춤형 반도체 리스크**: TPU·Trainium 등 확산이 예상보다</span>
<span class="t-dim">          -빠르면 → 성장률 가정 하향,</span>
<span class="t-dim">      131 -   목표가 재조정 필요.</span>
<span class="t-dim">      132 -2. **높은 주가배수 리스크**: 현재 배수는 완벽한 성장을 전제 -</span>
<span class="t-dim">          -실적이 기대에 못 미치면</span>
<span class="t-dim">      133 -   주가배수 자체가 낮아질 수 있음.</span>
<span class="t-dim">      134 -3. **소스 간 주가배수 불일치**: 33.2배(최근 4개 분기) vs 44.3</span>
<span class="t-dim">          -배(FY2026 연간) - 어느</span>
<span class="t-dim">      135 -   기준인지 항상 명시해야 함.</span>
<span class="t-dim">      136 -4. **FY2027 Q2 실적(2026-08-26 발표)** 확인 전까지는 이 판정이</span>
<span class="t-dim">          - 예상치에 기반한다는 점을</span>
<span class="t-dim">      137 -   명시.</span>
<span class="t-dim">      138 -</span>
<span class="t-dim">      139 ----</span>
<span class="t-dim">      140 -</span>
<span class="t-dim">       97  ## 출처</span>
<span class="t-dim">      142 -</span>
<span class="t-dim">      143 -- `data/financials.json` - NVIDIA Corp FY2026 10-K(연결), stoc</span>
<span class="t-dim">          -kanalysis.com 실시간 주가</span>
<span class="t-dim">      144 -  (2026-08-20)</span>
<span class="t-dim">      145 -- `raw/뉴스-NVIDIA-2026Q2전망.md` - 실적 전망, 시가총액, 우려</span>
<span class="t-dim">          -요인 배경(맞춤형 반도체)</span>
<span class="t-dim">      146 -- `raw/애널리스트-의견-2026.md` - 목표주가, 미래 예상 주가배수</span>
<span class="t-dim">          -, 성장률 전망, 긍정/우려 요인</span>
<span class="t-dim">      147 -- `raw/적정가-가정-2026.md` - 계산모델 가정 개정 사례, 애널리</span>
<span class="t-dim">          -스트 간 목표주가 편차</span>
<span class="t-dim">       98 +- data/financials.json (NVIDIA Corp 10-K, FY2026, SEC EDGAR CI</span>
<span class="t-dim">          +K 0001045810; 주가·시가총액</span>
<span class="t-dim">       99 +  stockanalysis.com 2026-08-20 기준)</span>
<span class="t-dim">      100 +- raw/애널리스트-의견-2026.md</span>
<span class="t-dim">      101 +- raw/적정가-가정-2026.md</span>
<span class="t-dim">      102 +- raw/뉴스-NVIDIA-2026Q2전망.md</span>
<span class="t-dim">      103 +- https://stockanalysis.com/stocks/nvda/forecast/</span>
<span class="t-dim">      104 +- https://www.tipranks.com/stocks/nvda/forecast</span>
<span class="t-dim">      105 +- https://www.fool.com/investing/2026/07/13/nvda-biggest-risk-</span>
<span class="t-dim">          +isnt-custom-ai-chips-avgo-or-amd/</span>
<span class="t-dim">      106 +- https://simplywall.st/community/narratives/us/semiconductors</span>
<span class="t-dim">          +/nasdaq-nvda/nvidia/391kfoxw-nvda-expanding-ai-demand-will-dri</span>
<span class="t-dim">          +ve-major-data-center-investments-through-2026/updates/20-analy</span>
<span class="t-dim">          +sts-have-nudged-nvidias-fair-value-estimate-slightly-l</span>
<span class="t-dim">      107 +- https://intellectia.ai/blog/nvidia-q2-fy27-earnings-preview-</span>
<span class="t-dim">          +august-2026</span>
<span class="t-dim">      108 +- https://www.rexshares.com/nvidia-earnings/</span>
<span class="t-dim">      109 +- https://nvidianews.nvidia.com/news/nvidia-announces-financia</span>
<span class="t-dim">          +l-results-for-fourth-quarter-and-fiscal-2026</span>
<span class="t-dim">      110 +- https://companiesmarketcap.com/nvidia/marketcap/</span>

<span class="t-accent">●</span> Now let me run the validation hook manually to confirm it passes before
  invoking the reviewer subagent.

<span class="t-dim">  Ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> The formal validator passes. Now let me get the qualitative review from the
  fair-value-reviewer subagent.

<span class="t-accent">●</span> fair-value-reviewer(Review fair-value report quality)
<span class="t-dim">  ⎿  Backgrounded agent (↓ to manage · ctrl+o to expand)</span>

<span class="t-accent">●</span> 리포트 초안을 작성했고 정형 검증(Stop hook)은 통과했습니다. 이제
  fair-value-reviewer subagent가 정성 분석 품질을 채점하고 있으니, 완료되면
  결과를 알려드리겠습니다.

<span class="t-status">✻ Churned for 1m 33s</span>

<span class="t-accent">●</span> Agent "Review fair-value report quality" finished · 28s

<span class="t-accent">●</span> fair-value-reviewer가 정성 분석·종합 판정을 12/12점 만점으로 PASS
  처리했습니다. 정형(Stop hook)·비정형(subagent) 검증 모두 통과해 루프가
  마무리됐습니다.

  결과 요약 - reports/fair-value.md:
  - 정량: EPS $4.90 / PER 44.3배 / 매출증가율 65.5% / 영업이익률 60.4% /
  순이익증가율 64.7% (모두 data/financials.json 재계산치와 일치)
  - 정성: 긍정 3개·우려 4개, 각각 인라인 출처 표기, 편중 없이 균형 확보
  - 종합 판정: 고평가 - 현재 실적(10-K 확정치) 쪽을 더 신뢰한다는 근거를
  명시하고, 애널리스트 목표가 우위라는 상충 신호도 반영해 "경계선에 가까운
  고평가"로 결론
  - 결론: 판정을 좌우하는 미래 가정(목표 PER 29~34배, 성장률 25~30%)을
  구체적으로 명시하고, 이 가정의 적정 범위 기준이 리포트 자체엔 없다는 한계를
  스스로 인정 - stage5(암묵지 형식지화)로 이어지는 지점

  리뷰어가 개선 지시 없음(전 항목 만점)이라고 판정했으므로 별도 재작업 없이
  이대로 완료 상태입니다.

<span class="t-status">✻ Crunched for 2m 10s</span></pre>
</div>

</details>

## Stage 4 의 결론

**🎯 자기수정 loop**

stage3의 하네스에 loop 부품(hook·subagent)을 박아, AI가 스스로 고치는 하네스로 확장했습니다.

hook은 지표 계산이 맞는지, subagent는 정성 분석이 균형 잡혔는지 봅니다.

하지만 "저평가/고평가"라는 **종합 판정 자체가 타당한지 가르는 기준**은 어디에도 없습니다.

목표 주가배수를 20배로 봐도 45배로 봐도 hook은 막지 않습니다.

> 목표 주가배수(target multiple)는 기업의 실적(순이익, 매출 등) 대비 몇 배의 가격이 적정하다고 보는지를 나타내는 밸류에이션 기준입니다.

> 목표 주가 배수를 이를 실적 전망치에 곱해 목표 주가를 산출하는 데 쓰입니다.

NVIDIA는 현재 실적 기준으로는 비싼데(주가배수 33~44배) 애널리스트 61명의 목표주가는 거의 전부 현재가($216.85)보다 높습니다($250~$500).

loop가 무엇을 정상으로 볼지, 그 판정 기준 자체는 아직 아무도 정하지 않았습니다.

그 정상 범위를 직접 만드는 것이 다음 [stage5](stage5-oracle.md)입니다.

## 참고

### 실패했을 때

- **loop가 무한 반복하면** `stop_hook_active` 처리나 재시도 카운터가 동작하는지 확인하세요. 판정 조건 자체가 달성 불가능하면 세션이 잠깁니다.

- **편집마다 승인을 물으면** 1단계로 돌아가 권한 모드가 `acceptEdits` 인지 확인하세요.

### 시뮬레이터 - 자기수정 loop 내부 동작 미리 보기

이 loop가 내부에서 어떻게 도는지 별도 화면으로 훑어볼 수 있습니다.

`/fair-value-report` skill이 초안을 쓴 뒤, `fair-value-reviewer` subagent(비정형)와 `scripts/validate_fair_value.py` Stop hook(정형) 검증이 한 파이프라인에서 어떻게 맞물려 자기수정을 만드는지 보여주는 시뮬레이터입니다.

재생·클릭으로 단계를 따라가며, 검증에 실패했을 때 루프백이 어디서 일어나는지 확인해 보세요.

[시뮬레이터 보기 →](assets/stage4-loop-simulator.html){ .md-button .md-button--primary }

이 시뮬레이터를 포함한 전체 실습·시각화 자료 목록은 [강의 진행 자료](../curriculum/index.md)에 있습니다.
