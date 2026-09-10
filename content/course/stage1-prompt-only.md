# stage1

<p class="ailab-title-subtitle">- 프롬프트만으로 작업해보기</p>

숫자가 아니라 의사결정 프로세스를 형식지화한다

빈 폴더에서 `claude`를 켜고 한 문장만 던져, AI 의 작업 결과물을 확인합니다.

이 단계의 목적은 AI 결과물을 어떤식으로 발전시켜나갈지에 대한 고민해 봅니다.

## 전제 조건

- Claude Code가 설치되어 있어야 합니다.

- 이 폴더는 **의도적으로 비어 있습니다.**

- 관찰 기록 워크시트로 `observations.md`가 들어 있습니다.

## 단계

1. `stage1-prompt-only/` 폴더에서 `claude`를 실행하세요.
2. 아래 한 문장을 **그대로** 입력하세요.
   ```
   NVIDIA 회사를 분석해줘
   ```
3. 답을 읽은 뒤, 같은 세션에서 한 번 더 물어보세요.
   ```
   NVIDIA가 지금 주가 기준으로 저평가야, 고평가야?
   ```
4. `observations.md` 를 열어 아래 확인 방법의 다섯 항목대로 관찰 결과를 적으세요.


## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다.

자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage1-prompt-only</summary>

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
<span class="t-accent">│</span>                 <span class="t-white">Welcome back user!</span>                 <span class="t-accent">│</span> <span class="t-accent">started</span>                 <span class="t-accent">│</span>
<span class="t-accent">│</span>                                                    <span class="t-accent">│</span> Run /init to create a … <span class="t-accent">│</span>
<span class="t-accent">│</span>                       <span class="t-accent">▐▛███▜▌</span>                      <span class="t-accent">│</span> <span class="t-dim">───────────────────────</span> <span class="t-accent">│</span>
<span class="t-accent">│</span>                      <span class="t-accent">▝▜█████▛▘</span>                     <span class="t-accent">│</span> <span class="t-accent">What's new</span>              <span class="t-accent">│</span>
<span class="t-accent">│</span>                        <span class="t-accent">▘▘ ▝▝</span>                       <span class="t-accent">│</span> [VSCode] Added Focus v… <span class="t-accent">│</span>
<span class="t-accent">│</span> <span class="t-dim">Sonnet 5 · Claude Code</span> <span class="t-accent">│</span> Added `mode: "mask"` f… <span class="t-accent">│</span>
<span class="t-accent">│</span> <span class="t-dim">Co. Ltd.     </span>                                      <span class="t-accent">│</span> Added warnings to `cla… <span class="t-accent">│</span>
<span class="t-accent">│</span>               <span class="t-dim">~/…/stage1-prompt-only</span>               <span class="t-accent">│</span> <span class="t-status">/release-notes for more</span> <span class="t-accent">│</span>
<span class="t-accent">╰──────────────────────────────────────────────────────────────────────────────╯</span>


<span class="t-user">❯ nvidia 회사 분석해줘</span>

<span class="t-dim">  Read 2 files, listed 1 directory (ctrl+o to expand)</span>

<span class="t-accent">●</span> <span class="t-white">NVIDIA (NVDA) 분석</span>

  <span class="t-white">1. 회사 개요</span>

  NVIDIA는 1993년 설립된 미국 반도체 기업으로, 원래 PC 게이밍용 GPU(그래픽 처리
  장치) 제조사로 출발했습니다. 현재는 AI 가속기(데이터센터용 GPU) 시장을 사실상
  지배하는 기업으로 변모했으며, 젠슨 황(Jensen Huang)이 창업자 겸 CEO를 맡고
  있습니다.

  <span class="t-white">2. 주요 사업부문</span>

  - 데이터센터(Data Center): H100, H200, Blackwell(B100/B200) 시리즈 등 AI
  학습·추론용 GPU. 현재 매출의 80% 이상을 차지하는 핵심 성장 동력.
  - 게이밍(Gaming): GeForce RTX 시리즈, 전통적 캐시카우이나 데이터센터 대비 비중
  축소.
  - 프로페셔널 시각화(Pro Visualization): Quadro/RTX 워크스테이션용 GPU.
  - 자동차(Automotive): 자율주행 플랫폼(DRIVE), 성장 초기 단계.
  - 네트워킹: Mellanox 인수 이후 InfiniBand/NVLink 등 인터커넥트 사업 확대.

  <span class="t-white">3. 최근 재무 (기억 기반 - 확인 필요)</span>

  - 매출: 연 900억~1,300억 달러 수준으로 급성장 (제 학습 데이터 기준이라 최신
  분기 실적과 다를 수 있습니다)
  - 영업이익률: 60%대 초반의 매우 높은 마진 - AI 칩 공급 부족과 독점적 지위 반영
  - 순이익률도 40~50%대로 반도체 업종 평균을 크게 상회

  ⚠️ 위 수치는 제가 학습한 시점의 기억에 의존한 것으로, 오늘 기준 실제 최신 분기
  실적이나 현재 주가와는 다를 가능성이 높습니다. 정확한 숫자는 최신 10-Q/10-K,
  IR 자료로 확인이 필요합니다.

  <span class="t-white">4. 경쟁 구도</span>

  - AMD: MI300 시리즈로 데이터센터 GPU 시장 추격 중이나 점유율 격차 큼
  - Intel: Gaudi 시리즈, 상대적으로 존재감 약함
  - 자체 개발(Custom Silicon): Google TPU, Amazon Trainium/Inferentia, Microsoft
  Maia 등 하이퍼스케일러들의 자체 칩 개발이 장기 리스크
  - CUDA 생태계: 소프트웨어 락인 효과가 하드웨어 경쟁 우위를 방어하는 핵심 요소

  <span class="t-white">5. 성장 동력</span>

  - 생성형 AI/LLM 학습·추론 수요 폭증
  - 하이퍼스케일러(MS, Google, Meta, Amazon)의 대규모 설비투자(Capex)
  - 소버린 AI(각국 정부의 자체 AI 인프라 구축) 수요 부상
  - 로보틱스, 자율주행 등 신규 응용 분야

  <span class="t-white">6. 리스크 요인</span>

  - 대중국 수출 규제: 미국 정부의 첨단 반도체 대중 수출 제한으로 중국向 매출
  타격
  - 고객 집중도: 소수 하이퍼스케일러에 매출 편중 → 협상력 약화 및 변동성 확대
  가능
  - 경쟁 심화: 자체 칩 개발 확대 시 장기적으로 마진 압박 가능
  - 밸류에이션 부담: 높은 성장 기대가 이미 주가에 반영되어 있어 성장 둔화 시 큰
  폭 조정 가능
  - 공급망: TSMC 파운드리 의존도, 첨단 패키징(CoWoS) 병목

  <span class="t-white">7. 저평가/고평가 판단은?</span>

  이 질문에 답하려면 사실 몇 가지가 더 필요합니다:
  - 현재 정확한 주가와 시가총액
  - 최신 실적 기준 PER, PEG, EV/EBITDA 등 밸류에이션 배수
  - 향후 몇 년간의 매출·이익 성장률 가정
  - 비교 대상(피어 그룹) 설정 기준

  일반적으로 말하면, NVIDIA는 전통적 밸류에이션 지표(PER 등)로는 항상 "비싸
  보이는" 종목이었지만, 실제 이익 성장이 이를 상회해온 이력이 있습니다. 다만
  이는 과거 패턴이지 미래를 보장하지 않으며, "몇 배가 적정한가"는 결국
  성장률·마진 지속성에 대한 가정에 달려 있습니다.

  <span class="t-dim">---</span>
  이 분석은 별도의 실시간 데이터 조회나 첨부 자료 없이, 대화 하나만으로 작성한
  것입니다. 정확한 투자 판단에는 최신 공시자료, 애널리스트 리포트 등 근거 자료
  확인이 필요합니다.

<span class="t-status">✻ Crunched for 47s</span>

<span class="t-user">❯ NVIDIA가 지금 주가 기준으로 저평가야, 고평가야?</span>

<span class="t-accent">●</span> 현재 주가 수준만으로 명확히 "저평가다/고평가다"라고 단정하기는 어렵습니다만,
  제가 알고 있는 일반적인 흐름을 바탕으로 의견을 드리면:

  <span class="t-white">고평가에 가깝다는 시각이 우세합니다.</span>

  - NVIDIA는 이미 시가총액 기준 세계 최상위권 기업으로, PER(주가수익비율)이 시장
  평균 대비 훨씬 높은 수준에서 거래되어 왔습니다 (제 기억으로는 30~50배대를
  오갔던 것으로 압니다).
  - 이는 "AI 붐이 앞으로도 지속되고, 데이터센터 GPU 수요가 계속 폭발적으로
  늘어난다"는 낙관적 성장 가정이 이미 주가에 상당 부분 반영돼 있다는 의미입니다.
  - 반대로 저평가 논리도 있습니다: 실제 이익 성장률이 워낙 가팔라서(분기 매출이
  전년 대비 두 자릿수~세 자릿수 % 성장), 전통적인 PER 잣대로 보면 비싸 보여도
  PEG(성장 대비 밸류에이션)로 보면 오히려 합리적이라는 주장입니다.

  종합하면: 절대적인 밸류에이션 배수만 보면 "비싸다"는 인상이 강하지만, AI
  수요가 예상만큼 지속된다면 정당화될 수 있는 프리미엄이라는 게 일반적인 시장
  컨센서스에 가깝습니다. 다만 이는 성장 둔화 조짐(예: 데이터센터 매출 성장률
  하락, 대중국 수출 추가 규제, 경쟁사 점유율 잠식)이 나타나면 급격히 뒤집힐 수
  있는 판단입니다.

  <span class="t-dim">---</span>
  ⚠️ 다만 솔직히 말씀드리면, 위 판단은 제가 명시적으로 특정 목표 PER이나 성장률
  수치를 계산해서 내린 결론이 아닙니다. "고평가/저평가"라고 답은 했지만:
  - 정확히 몇 배 PER을 기준으로 삼았는지
  - 몇 % 성장률을 몇 년간 가정했는지
  - 할인율(요구수익률)을 얼마로 뒀는지

  를 밝히지 않은 채 답했습니다. 이 부분을 다시 캐물으시면 그제서야 구체적 가정을
  만들어 답할 텐데, 그마저도 실시간 주가·실적 데이터 없이 나온 것이라 검증이 안
  됩니다.

<span class="t-status">✻ Brewed for 18s</span></pre>
</div>

</details>


## 무엇이 비어 있는가

한 문장 프롬프트로 받은 답에는 다음 다섯 가지가 **빠져 있습니다.**


### 1. 근거 데이터의 부재

  매출·순이익·주가를 모델이 학습 시점의 *기억*으로 답합니다.

  실제로 답 안에는 "제 학습 데이터 기준이라 최신 분기 실적과 다를 수 있습니다"라는 경고가 붙습니다.

  그런데도 출처를 캐물으면 모델은 근거를 확인해 주지 못합니다.

### 2. 매 턴마다 출력 형식 상이함

  같은 질문을 몇번 하면 섹션 구성·다루는 지표가 달라집니다.

  매번 다른 형태의 답변을 내놓기 때문에 리포트화 하기 어렵습니다.

### 3. 판정 기준의 부재

  "저평가/고평가"에 답은 하지만, 목표 주가배수 몇 배·성장률 몇 %를 가정했는지가 흐릿합니다.

  모델도 실제 답에서 "특정 목표 PER이나 성장률을 계산해서 내린 결론이 아니다"라고 스스로 인정합니다.

### 4. 출력된 결과물을 검증할 수 있는 방법의 부재

  숫자가 틀려도, 긍정·우려가 한쪽으로 쏠려도, 판정이 근거와 어긋나도 아무 경고가 없습니다.

### 5. 재사용 불가

  결과가 대화창에 흩어지고 파일로 남지 않습니다.

  그래서 사용자는 이 결과를 보고·재사용·자산화에 쓰지 못합니다.

## Stage 1 의 결론

위에서 프롬프트 작업방식의 문제를 확인 했습니다.

위에서 말한 문제점들을 해결해 나가는 것이 다음 stage 들에서 채워나갈 내용들입니다.

가장 먼저 손볼 것은 첫 번째 부재(그라운딩)입니다.

다음 [stage2](stage2-context-attach.md)에서 실제 자료를 붙여 답이 어떻게 달라지는지 비교합니다.
