# 과정 소개

본 과정은 SW 직군이 아닌 분들을 대상으로 기획한 실습형 워크샵입니다.

과정은 차수별로 직무를 나누어 운영하며, 각 차수 입과자의 직무와 일정은 다음과 같습니다.

| 차수  | 일정     | 직무                     |
| ----- | -------- | ------------------------ |
| 1차수 | 10/14–16 | 마케팅 / 영업 / 상품전략 |
| 2차수 | 10/28–30 | 연구개발 (설계·HW)       |
| 3차수 | 11/11–13 | 연구개발 (검증)          |
| 4차수 | 11/25–27 | 그 외 직무               |

## Time Table

> 강의는 50분 수업, 10분 휴식 방식으로 진행합니다.

| 교시     | 시각              |
|--------|-----------------|
| 1교시    | 08:30–09:20     |
| 2교시    | 09:30–10:20     |
| 3교시    | 10:30–11:20     |
| **점심** | **11:20–12:30** |
| 4교시    | 12:30–13:20     |
| 5교시    | 13:30–14:20     |
| 6교시    | 14:30–15:20     |
| 7교시    | 15:30–16:20     |
| 8교시    | 16:30–17:20     |

## 3일 동안 무엇을 다루나

|        | Day 1                                 | Day 2                                    | Day 3                 |
|--------|---------------------------------------|------------------------------------------|-----------------------|
| **오전** | 터미널 사용법(PowerShell)<br>Git/Github 사용법 | MCP : 개념 소개, 실습에 연결하기                    | 개인 프로젝트               |
| **오후** | Claude Code 기초 조작법<br>Claude Code 실습  | 지식 자산화(llm-wiki) · GitHub Pages · 마켓플레이스 | 개인 프로젝트 마무리 & 발표 & 설문 |


## 본 과정에서 학습 하는 내용

> 본 과정에서 다루는 모든 내용은 [**기업 적정가치 산정하기**](../course/index.md) 라는 문제 예시를 기반으로 단계적으로 실습해 가며 익혀가도록 하겠습니다.

- Claude Code 사용을 위한 사전 지식 (터미널, git 등)
- Claude Code 기초 사용법
- 저수준 모델에 하네스를 더해 고수준 모델에 근접한 성능을 내는 작업 환경 만들어 보기 (harness engineering)
- AI가 올바르게 판단하도록 필요한 맥락(정보)을 설계해 넣어 보기 (context engineering)
- 결과를 스스로 검증하고 고치는 작업 플로우 만들어 보기 (loop engineering)
- MCP 개념 소개 및 실습
- 내가 만든 harness를 자산화하여 배포하기(marketplace & plugin)
- LLM을 활용한 체계적 지식 자산화 방법 소개 및 실습 (llm-wiki)

## Coding agent 를 잘 다루기 위한 3가지 엔지니어링 개념

> 본 과정에서는 Claude Code 사용법 외에 Coding agent 를 고수준으로 다루기 위한 3가지 핵심 개념을 다룹니다.

![Coding agent를 잘 다루는 3가지 엔지니어링 비교](../media/orientation/orientation-engineering-concepts.png)

### 작업 환경 만들어 주기 (harness engineering)
- 값싸고 덜 똑똑한 AI라도, 쓸 도구와 일하는 순서·규칙을 잘 갖춘 "작업장"을 만들어 주면 비싼 최고급 AI 못지않게 일하게 됩니다.

- 그 작업장을 직접 꾸며 봅니다.

### AI에게 필요한 배경 정보 챙겨 주기 (context engineering)
- 신입 직원에게 업무 매뉴얼·회사 규칙·예시를 미리 쥐여 주듯, AI가 헤매지 않도록 "무엇을·어떻게·어떤 기준으로" 해야 하는지를 정리해서 넣어 줍니다.

### 스스로 검토하고 고치기를 반복하게 만들기 (loop engineering)
- AI가 한 번에 끝내는 게 아니라, 결과를 스스로 점검해 기준에 못 미치면 다시 고치기를 자동으로 반복하는 흐름을 만들어 봅니다.


## 과정을 통해 무엇을 만들 수 있나요?

|            | 과정 전                              | 과정 후                                                       |
| ---------- | ------------------------------------ | ------------------------------------------------------------- |
| AI 사용법  | "이거 해줘" 한 번 던지고 결과에 실망 | 일 잘하는 작업장을 꾸며 주고, 좋은 결과를 **반복해서** 뽑아냄 |
| 결과 신뢰  | 맞는지 틀린지 내가 일일이 검산       | AI가 **스스로 검증·수정**하게 만들어 둠                       |
| 재사용     | 매번 처음부터 다시 설명              | 한 번 잘 만든 걸 **자산으로 저장·배포**해 계속 씀             |
| 터미널/git | 화면만 봐도 막막                     | 기본 도구를 **무섭지 않게** 다룸                              |

## Model 에 따른 실습비용

| 모델        | 전체 토큰 사용량 | 전체 실습 비용    |
| ----------- | ----------- | ------- |
| Haiku 4.5   | 6,340,700 tk   | $2.00   |
| Sonnet 5    | 7,027,100 tk   | $4.23   |
| Opus 5      | 5,399,900 tk   | $11.26  |

아래 두 차트에서는 막대(선)에 마우스를 올리거나 Tab 키로 이동하면 정확한 값을 확인할 수 있습니다.

<div class="viz-root viz-bar-chart" markdown="0">
<style>
  .viz-bar-chart {
    --surface-1: #fcfcfb;
    --text-primary: #0b0b0b;
    --text-secondary: #52514e;
    --text-muted: #898781;
    --grid: #e1e0d9;
    --baseline: #c3c2b7;
    --border: rgba(11,11,11,0.10);
    --series-1: #2a78d6;
    --series-2: #eb6834;
    --series-3: #1baf7a;
  }
  @media (prefers-color-scheme: dark) {
    .viz-bar-chart {
      --surface-1: #1a1a19;
      --text-primary: #ffffff;
      --text-secondary: #c3c2b7;
      --text-muted: #898781;
      --grid: #2c2c2a;
      --baseline: #383835;
      --border: rgba(255,255,255,0.10);
      --series-1: #3987e5;
      --series-2: #d95926;
      --series-3: #199e70;
    }
  }
</style>
<figure class="chart-card" data-kind="bar">
  <figcaption>
    <p class="chart-title">단계(stage)별 실습 비용</p>
    <p class="chart-subtitle">막대에 마우스를 올리거나 Tab으로 이동하면 정확한 값을 볼 수 있습니다.</p>
  </figcaption>
  <ul class="legend"><li class='legend-item'><span class='swatch' style='background:var(--series-1)'></span>Haiku 4.5</li><li class='legend-item'><span class='swatch' style='background:var(--series-2)'></span>Sonnet 5</li><li class='legend-item'><span class='swatch' style='background:var(--series-3)'></span>Opus 5</li></ul>
  <div class="chart-wrap">
    <svg class='chart-svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 560' role='img' aria-label='모델별 단계별 실습 비용 막대그래프' preserveAspectRatio='xMidYMid meet'><line x1='70' y1='504.0' x2='1180' y2='504.0' class='grid'/><text x='60' y='508.0' text-anchor='end' class='tick'>$0</text><line x1='70' y1='342.7' x2='1180' y2='342.7' class='grid'/><text x='60' y='346.7' text-anchor='end' class='tick'>$1</text><line x1='70' y1='181.3' x2='1180' y2='181.3' class='grid'/><text x='60' y='185.3' text-anchor='end' class='tick'>$2</text><line x1='70' y1='20.0' x2='1180' y2='20.0' class='grid'/><text x='60' y='24.0' text-anchor='end' class='tick'>$3</text><line x1='70' y1='504.0' x2='1180' y2='504.0' class='baseline'/><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage1' data-value='0.10' data-color='var(--series-1)'><rect x='98.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M100.4,504.0 L100.4,491.9 Q100.4,487.9 104.4,487.9 L120.4,487.9 Q124.4,487.9 124.4,491.9 L124.4,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage1' data-value='0.32' data-color='var(--series-2)'><rect x='125.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M127.4,504.0 L127.4,456.4 Q127.4,452.4 131.4,452.4 L147.4,452.4 Q151.4,452.4 151.4,456.4 L151.4,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage1' data-value='1.02' data-color='var(--series-3)'><rect x='152.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M154.4,504.0 L154.4,343.4 Q154.4,339.4 158.4,339.4 L174.4,339.4 Q178.4,339.4 178.4,343.4 L178.4,504.0 Z' fill='var(--series-3)'/></g><text x='139.4' y='528.0' text-anchor='middle' class='cat-label'>stage1</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage2' data-value='0.20' data-color='var(--series-1)'><rect x='237.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M239.1,504.0 L239.1,475.7 Q239.1,471.7 243.1,471.7 L259.1,471.7 Q263.1,471.7 263.1,475.7 L263.1,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage2' data-value='0.33' data-color='var(--series-2)'><rect x='264.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M266.1,504.0 L266.1,454.8 Q266.1,450.8 270.1,450.8 L286.1,450.8 Q290.1,450.8 290.1,454.8 L290.1,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage2' data-value='1.20' data-color='var(--series-3)'><rect x='291.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M293.1,504.0 L293.1,314.4 Q293.1,310.4 297.1,310.4 L313.1,310.4 Q317.1,310.4 317.1,314.4 L317.1,504.0 Z' fill='var(--series-3)'/></g><text x='278.1' y='528.0' text-anchor='middle' class='cat-label'>stage2</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage3' data-value='0.13' data-color='var(--series-1)'><rect x='375.9' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M377.9,504.0 L377.9,487.0 Q377.9,483.0 381.9,483.0 L397.9,483.0 Q401.9,483.0 401.9,487.0 L401.9,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage3' data-value='0.31' data-color='var(--series-2)'><rect x='402.9' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M404.9,504.0 L404.9,458.0 Q404.9,454.0 408.9,454.0 L424.9,454.0 Q428.9,454.0 428.9,458.0 L428.9,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage3' data-value='0.96' data-color='var(--series-3)'><rect x='429.9' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M431.9,504.0 L431.9,353.1 Q431.9,349.1 435.9,349.1 L451.9,349.1 Q455.9,349.1 455.9,353.1 L455.9,504.0 Z' fill='var(--series-3)'/></g><text x='416.9' y='528.0' text-anchor='middle' class='cat-label'>stage3</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage4' data-value='0.54' data-color='var(--series-1)'><rect x='514.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M516.6,504.0 L516.6,420.9 Q516.6,416.9 520.6,416.9 L536.6,416.9 Q540.6,416.9 540.6,420.9 L540.6,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage4' data-value='0.93' data-color='var(--series-2)'><rect x='541.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M543.6,504.0 L543.6,358.0 Q543.6,354.0 547.6,354.0 L563.6,354.0 Q567.6,354.0 567.6,358.0 L567.6,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage4' data-value='2.49' data-color='var(--series-3)'><rect x='568.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M570.6,504.0 L570.6,106.3 Q570.6,102.3 574.6,102.3 L590.6,102.3 Q594.6,102.3 594.6,106.3 L594.6,504.0 Z' fill='var(--series-3)'/></g><text x='555.6' y='528.0' text-anchor='middle' class='cat-label'>stage4</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage5' data-value='0.28' data-color='var(--series-1)'><rect x='653.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M655.4,504.0 L655.4,462.8 Q655.4,458.8 659.4,458.8 L675.4,458.8 Q679.4,458.8 679.4,462.8 L679.4,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage5' data-value='0.89' data-color='var(--series-2)'><rect x='680.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M682.4,504.0 L682.4,364.4 Q682.4,360.4 686.4,360.4 L702.4,360.4 Q706.4,360.4 706.4,364.4 L706.4,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage5' data-value='1.56' data-color='var(--series-3)'><rect x='707.4' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M709.4,504.0 L709.4,256.3 Q709.4,252.3 713.4,252.3 L729.4,252.3 Q733.4,252.3 733.4,256.3 L733.4,504.0 Z' fill='var(--series-3)'/></g><text x='694.4' y='528.0' text-anchor='middle' class='cat-label'>stage5</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage6' data-value='0.57' data-color='var(--series-1)'><rect x='792.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M794.1,504.0 L794.1,416.0 Q794.1,412.0 798.1,412.0 L814.1,412.0 Q818.1,412.0 818.1,416.0 L818.1,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage6' data-value='1.38' data-color='var(--series-2)'><rect x='819.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M821.1,504.0 L821.1,285.4 Q821.1,281.4 825.1,281.4 L841.1,281.4 Q845.1,281.4 845.1,285.4 L845.1,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage6' data-value='2.93' data-color='var(--series-3)'><rect x='846.1' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M848.1,504.0 L848.1,35.3 Q848.1,31.3 852.1,31.3 L868.1,31.3 Q872.1,31.3 872.1,35.3 L872.1,504.0 Z' fill='var(--series-3)'/></g><text x='833.1' y='528.0' text-anchor='middle' class='cat-label'>stage6</text><text x='971.9' y='494.0' text-anchor='middle' class='empty-note'>데이터 없음</text><text x='971.9' y='528.0' text-anchor='middle' class='cat-label'>stage7</text><g class='mark-hit' tabindex='0' role='button' data-primary='Haiku 4.5' data-secondary='stage8' data-value='0.18' data-color='var(--series-1)'><rect x='1069.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M1071.6,504.0 L1071.6,479.0 Q1071.6,475.0 1075.6,475.0 L1091.6,475.0 Q1095.6,475.0 1095.6,479.0 L1095.6,504.0 Z' fill='var(--series-1)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Sonnet 5' data-secondary='stage8' data-value='0.40' data-color='var(--series-2)'><rect x='1096.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M1098.6,504.0 L1098.6,443.5 Q1098.6,439.5 1102.6,439.5 L1118.6,439.5 Q1122.6,439.5 1122.6,443.5 L1122.6,504.0 Z' fill='var(--series-2)'/></g><g class='mark-hit' tabindex='0' role='button' data-primary='Opus 5' data-secondary='stage8' data-value='1.10' data-color='var(--series-3)'><rect x='1123.6' y='20' width='28' height='484' fill='transparent'/><path class='mark' d='M1125.6,504.0 L1125.6,330.5 Q1125.6,326.5 1129.6,326.5 L1145.6,326.5 Q1149.6,326.5 1149.6,330.5 L1149.6,504.0 Z' fill='var(--series-3)'/></g><text x='1110.6' y='528.0' text-anchor='middle' class='cat-label'>stage8</text></svg>
    <div class="tooltip" role="tooltip" hidden></div>
  </div>
  <button class="table-toggle" aria-expanded="false">표로 보기</button>
  <table class="data-table" hidden>
    <caption>모델별 단계별 실습 비용(표)</caption>
    <thead><tr><th scope="col">stage</th><th scope="col">Haiku 4.5</th><th scope="col">Sonnet 5</th><th scope="col">Opus 5</th></tr></thead>
    <tbody>
<tr><th scope='row'>stage1</th><td>$0.10</td><td>$0.32</td><td>$1.02</td></tr>
<tr><th scope='row'>stage2</th><td>$0.20</td><td>$0.33</td><td>$1.20</td></tr>
<tr><th scope='row'>stage3</th><td>$0.13</td><td>$0.31</td><td>$0.96</td></tr>
<tr><th scope='row'>stage4</th><td>$0.54</td><td>$0.93</td><td>$2.49</td></tr>
<tr><th scope='row'>stage5</th><td>$0.28</td><td>$0.89</td><td>$1.56</td></tr>
<tr><th scope='row'>stage6</th><td>$0.57</td><td>$1.38</td><td>$2.93</td></tr>
<tr><th scope='row'>stage7</th><td>-</td><td>-</td><td>-</td></tr>
<tr><th scope='row'>stage8</th><td>$0.18</td><td>$0.40</td><td>$1.10</td></tr>
    </tbody>
  </table>
</figure>
</div>

<div class="viz-root viz-line-chart" markdown="0">
<style>
  .viz-line-chart {
    --surface-1: #fcfcfb;
    --text-primary: #0b0b0b;
    --text-secondary: #52514e;
    --text-muted: #898781;
    --grid: #e1e0d9;
    --baseline: #c3c2b7;
    --border: rgba(11,11,11,0.10);
    --series-1: #2a78d6;
    --series-2: #eb6834;
    --series-3: #1baf7a;
  }
  @media (prefers-color-scheme: dark) {
    .viz-line-chart {
      --surface-1: #1a1a19;
      --text-primary: #ffffff;
      --text-secondary: #c3c2b7;
      --text-muted: #898781;
      --grid: #2c2c2a;
      --baseline: #383835;
      --border: rgba(255,255,255,0.10);
      --series-1: #3987e5;
      --series-2: #d95926;
      --series-3: #199e70;
    }
  }
</style>
<figure class="chart-card">
  <figcaption>
    <p class="chart-title">모델별 누적 실습 비용 추세</p>
    <p class="chart-subtitle">그래프 위에 마우스를 올리거나 Tab으로 이동하면 해당 stage까지의 누적 비용을 볼 수 있습니다. stage7 구간이 평평한 것은 그 단계에 추가 비용이 없었다는 뜻입니다.</p>
  </figcaption>
  <ul class="legend"><li class='legend-item'><span class='swatch swatch-line' style='background:var(--series-1)'></span>Haiku 4.5</li><li class='legend-item'><span class='swatch swatch-line' style='background:var(--series-2)'></span>Sonnet 5</li><li class='legend-item'><span class='swatch swatch-line' style='background:var(--series-3)'></span>Opus 5</li></ul>
  <div class="chart-wrap">
    <svg class='chart-svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 560' role='img' aria-label='모델별 stage별 누적 실습 비용 선그래프' preserveAspectRatio='xMidYMid meet'><line x1='70' y1='504.0' x2='1110' y2='504.0' class='grid'/><text x='60' y='508.0' text-anchor='end' class='tick'>$0</text><line x1='70' y1='383.0' x2='1110' y2='383.0' class='grid'/><text x='60' y='387.0' text-anchor='end' class='tick'>$3</text><line x1='70' y1='262.0' x2='1110' y2='262.0' class='grid'/><text x='60' y='266.0' text-anchor='end' class='tick'>$6</text><line x1='70' y1='141.0' x2='1110' y2='141.0' class='grid'/><text x='60' y='145.0' text-anchor='end' class='tick'>$9</text><line x1='70' y1='20.0' x2='1110' y2='20.0' class='grid'/><text x='60' y='24.0' text-anchor='end' class='tick'>$12</text><line x1='70' y1='504.0' x2='1110' y2='504.0' class='baseline'/><text x='70.0' y='528.0' text-anchor='middle' class='cat-label'>stage1</text><text x='218.6' y='528.0' text-anchor='middle' class='cat-label'>stage2</text><text x='367.1' y='528.0' text-anchor='middle' class='cat-label'>stage3</text><text x='515.7' y='528.0' text-anchor='middle' class='cat-label'>stage4</text><text x='664.3' y='528.0' text-anchor='middle' class='cat-label'>stage5</text><text x='812.9' y='528.0' text-anchor='middle' class='cat-label'>stage6</text><text x='961.4' y='528.0' text-anchor='middle' class='cat-label'>stage7</text><text x='1110.0' y='528.0' text-anchor='middle' class='cat-label'>stage8</text><line class='crosshair' x1='70' y1='20' x2='70' y2='504.0' hidden/><path class='line' d='M70.0,500.0 L218.6,491.9 L367.1,486.7 L515.7,464.9 L664.3,453.6 L812.9,430.6 L961.4,430.6 L1110.0,423.3' fill='none' stroke='var(--series-1)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle class='marker' cx='70.0' cy='500.0' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='218.6' cy='491.9' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='367.1' cy='486.7' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='515.7' cy='464.9' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='664.3' cy='453.6' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='812.9' cy='430.6' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='961.4' cy='430.6' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='1110.0' cy='423.3' r='6' fill='var(--series-1)' stroke='var(--surface-1)' stroke-width='2'/><text x='1122.0' y='427.3' class='end-label'>$2.00</text><path class='line' d='M70.0,491.1 L218.6,477.8 L367.1,465.3 L515.7,427.8 L664.3,391.9 L812.9,336.2 L961.4,336.2 L1110.0,320.1' fill='none' stroke='var(--series-2)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle class='marker' cx='70.0' cy='491.1' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='218.6' cy='477.8' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='367.1' cy='465.3' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='515.7' cy='427.8' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='664.3' cy='391.9' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='812.9' cy='336.2' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='961.4' cy='336.2' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='1110.0' cy='320.1' r='6' fill='var(--series-2)' stroke='var(--surface-1)' stroke-width='2'/><text x='1122.0' y='324.1' class='end-label'>$4.56</text><path class='line' d='M70.0,462.9 L218.6,414.5 L367.1,375.7 L515.7,275.3 L664.3,212.4 L812.9,94.2 L961.4,94.2 L1110.0,49.8' fill='none' stroke='var(--series-3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle class='marker' cx='70.0' cy='462.9' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='218.6' cy='414.5' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='367.1' cy='375.7' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='515.7' cy='275.3' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='664.3' cy='212.4' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='812.9' cy='94.2' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='961.4' cy='94.2' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><circle class='marker' cx='1110.0' cy='49.8' r='6' fill='var(--series-3)' stroke='var(--surface-1)' stroke-width='2'/><text x='1122.0' y='53.8' class='end-label'>$11.26</text><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage1' data-x='70.0' data-points="Haiku 4.5:0.10:var(--series-1)|Sonnet 5:0.32:var(--series-2)|Opus 5:1.02:var(--series-3)" x='70.0' y='20' width='74.3' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage2' data-x='218.6' data-points="Haiku 4.5:0.30:var(--series-1)|Sonnet 5:0.65:var(--series-2)|Opus 5:2.22:var(--series-3)" x='144.3' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage3' data-x='367.1' data-points="Haiku 4.5:0.43:var(--series-1)|Sonnet 5:0.96:var(--series-2)|Opus 5:3.18:var(--series-3)" x='292.9' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage4' data-x='515.7' data-points="Haiku 4.5:0.97:var(--series-1)|Sonnet 5:1.89:var(--series-2)|Opus 5:5.67:var(--series-3)" x='441.4' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage5' data-x='664.3' data-points="Haiku 4.5:1.25:var(--series-1)|Sonnet 5:2.78:var(--series-2)|Opus 5:7.23:var(--series-3)" x='590.0' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage6' data-x='812.9' data-points="Haiku 4.5:1.82:var(--series-1)|Sonnet 5:4.16:var(--series-2)|Opus 5:10.16:var(--series-3)" x='738.6' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage7' data-x='961.4' data-points="Haiku 4.5:1.82:var(--series-1)|Sonnet 5:4.16:var(--series-2)|Opus 5:10.16:var(--series-3)" x='887.1' y='20' width='148.6' height='484' fill='transparent'/><rect class='crosshair-hit' tabindex='0' role='button' data-stage='stage8' data-x='1110.0' data-points="Haiku 4.5:2.00:var(--series-1)|Sonnet 5:4.56:var(--series-2)|Opus 5:11.26:var(--series-3)" x='1035.7' y='20' width='74.3' height='484' fill='transparent'/></svg>
    <div class="tooltip" role="tooltip" hidden></div>
  </div>
  <button class="table-toggle" aria-expanded="false">표로 보기</button>
  <table class="data-table" hidden>
    <caption>모델별 stage별 누적 실습 비용(표)</caption>
    <thead><tr><th scope="col">stage</th><th scope="col">Haiku 4.5</th><th scope="col">Sonnet 5</th><th scope="col">Opus 5</th></tr></thead>
    <tbody>
<tr><th scope='row'>stage1</th><td>$0.10</td><td>$0.32</td><td>$1.02</td></tr>
<tr><th scope='row'>stage2</th><td>$0.30</td><td>$0.65</td><td>$2.22</td></tr>
<tr><th scope='row'>stage3</th><td>$0.43</td><td>$0.96</td><td>$3.18</td></tr>
<tr><th scope='row'>stage4</th><td>$0.97</td><td>$1.89</td><td>$5.67</td></tr>
<tr><th scope='row'>stage5</th><td>$1.25</td><td>$2.78</td><td>$7.23</td></tr>
<tr><th scope='row'>stage6</th><td>$1.82</td><td>$4.16</td><td>$10.16</td></tr>
<tr><th scope='row'>stage7</th><td>$1.82</td><td>$4.16</td><td>$10.16</td></tr>
<tr><th scope='row'>stage8</th><td>$2.00</td><td>$4.56</td><td>$11.26</td></tr>
    </tbody>
  </table>
</figure>
</div>

<div class="viz-shared" markdown="0">
<style>
  .viz-root { color-scheme: light dark; }
  .viz-root .chart-card {
    width: 100%;
    max-width: 100%;
    margin: 20px 0;
    padding: 28px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-sizing: border-box;
  }
  .viz-root .chart-title { font-size: 19px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); }
  .viz-root .chart-subtitle { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px; }
  .viz-root .legend { list-style: none; display: flex; gap: 20px; padding: 0; margin: 0 0 14px; flex-wrap: wrap; }
  .viz-root .legend-item { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text-secondary); }
  .viz-root .swatch { width: 13px; height: 13px; border-radius: 2px; display: inline-block; }
  .viz-root .swatch-line { height: 3px; border-radius: 2px; }
  .viz-root .chart-wrap { position: relative; }
  .viz-root svg.chart-svg { width: 100%; height: auto; display: block; }
  .viz-root .grid { stroke: var(--grid); stroke-width: 1; }
  .viz-root .baseline { stroke: var(--baseline); stroke-width: 1.5; }
  .viz-root .tick { font-size: 14px; fill: var(--text-muted); }
  .viz-root .cat-label { font-size: 14px; fill: var(--text-secondary); }
  .viz-root .empty-note { font-size: 13px; fill: var(--text-muted); }
  .viz-root .end-label { font-size: 15px; font-weight: 600; fill: var(--text-secondary); dominant-baseline: middle; }
  .viz-root .mark { transition: filter 0.1s ease; }
  .viz-root .mark-hit, .viz-root .crosshair-hit { cursor: pointer; outline: none; }
  .viz-root .mark-hit:hover .mark, .viz-root .mark-hit:focus-visible .mark { filter: brightness(1.12); }
  .viz-root .marker { transition: r 0.1s ease; }
  .viz-root .crosshair { stroke: var(--baseline); stroke-width: 1; pointer-events: none; }
  .viz-root .tooltip {
    position: absolute;
    pointer-events: none;
    background: var(--text-primary);
    color: var(--surface-1);
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
    transform: translate(-50%, -100%);
    white-space: nowrap;
    z-index: 10;
    line-height: 1.7;
  }
  .viz-root .tooltip strong { font-size: 15px; }
  .viz-root .tooltip .key { display: inline-block; width: 10px; height: 2px; margin-right: 6px; vertical-align: middle; }
  .viz-root .tooltip .row { display: block; }
  .viz-root .table-toggle {
    margin-top: 18px;
    font-size: 14px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 14px;
    cursor: pointer;
  }
  .viz-root table {
    margin-top: 12px;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }
  .viz-root table th, .viz-root table td { text-align: right; padding: 7px 12px; border-bottom: 1px solid var(--grid); color: var(--text-secondary); }
  .viz-root table th[scope="row"] { text-align: left; color: var(--text-primary); }
  .viz-root table thead th { color: var(--text-primary); }
  .viz-root caption { caption-side: top; text-align: left; font-size: 14px; color: var(--text-muted); margin-bottom: 6px; }
</style>
<script>
(function () {
  function keyRow(color, valueText, labelText) {
    var row = document.createElement('span');
    row.className = 'row';
    var key = document.createElement('span');
    key.className = 'key';
    key.style.background = color;
    var strong = document.createElement('strong');
    strong.textContent = valueText;
    var label = document.createElement('span');
    label.textContent = ' ' + labelText;
    row.appendChild(key);
    row.appendChild(strong);
    row.appendChild(label);
    return row;
  }

  document.querySelectorAll('.chart-card').forEach(function (card) {
    var tooltip = card.querySelector('.tooltip');
    var wrap = card.querySelector('.chart-wrap');

    // bar-chart style: one mark, one value
    card.querySelectorAll('.mark-hit').forEach(function (el) {
      function show() {
        var primary = el.getAttribute('data-primary');
        var secondary = el.getAttribute('data-secondary');
        var value = el.getAttribute('data-value');
        var color = el.getAttribute('data-color');
        tooltip.innerHTML = '';
        tooltip.appendChild(keyRow(color, '$' + value, primary + ' / ' + secondary));
        tooltip.hidden = false;
        var rect = el.querySelector('.mark').getBoundingClientRect();
        var wrapRect = wrap.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - wrapRect.left) + 'px';
        tooltip.style.top = (rect.top - wrapRect.top - 8) + 'px';
      }
      el.addEventListener('pointerenter', show);
      el.addEventListener('pointermove', show);
      el.addEventListener('pointerleave', function () { tooltip.hidden = true; });
      el.addEventListener('focus', show);
      el.addEventListener('blur', function () { tooltip.hidden = true; });
    });

    // line-chart style: crosshair column, every series at that X
    var crosshair = card.querySelector('.crosshair');
    card.querySelectorAll('.crosshair-hit').forEach(function (el) {
      function show() {
        var stage = el.getAttribute('data-stage');
        var x = el.getAttribute('data-x');
        var pointsAttr = el.getAttribute('data-points');
        tooltip.innerHTML = '';
        var title = document.createElement('strong');
        title.textContent = stage;
        title.style.display = 'block';
        title.style.marginBottom = '2px';
        tooltip.appendChild(title);
        if (pointsAttr) {
          pointsAttr.split('|').forEach(function (p) {
            var parts = p.split(':');
            var name = parts[0], value = parts[1], color = parts[2];
            tooltip.appendChild(keyRow(color, '$' + value, name));
          });
        } else {
          var none = document.createElement('span');
          none.className = 'row';
          none.textContent = '데이터 없음';
          tooltip.appendChild(none);
        }
        tooltip.hidden = false;
        if (crosshair) {
          crosshair.setAttribute('x1', x);
          crosshair.setAttribute('x2', x);
          crosshair.hidden = false;
        }
        var wrapRect = wrap.getBoundingClientRect();
        var svgRect = card.querySelector('.chart-svg').getBoundingClientRect();
        var viewBox = card.querySelector('.chart-svg').viewBox.baseVal;
        var scale = svgRect.width / viewBox.width;
        tooltip.style.left = (svgRect.left - wrapRect.left + parseFloat(x) * scale) + 'px';
        tooltip.style.top = '0px';
      }
      el.addEventListener('pointerenter', show);
      el.addEventListener('pointermove', show);
      el.addEventListener('pointerleave', function () {
        tooltip.hidden = true;
        if (crosshair) crosshair.hidden = true;
      });
      el.addEventListener('focus', show);
      el.addEventListener('blur', function () {
        tooltip.hidden = true;
        if (crosshair) crosshair.hidden = true;
      });
    });

    // shared: table-view toggle
    var toggleBtn = card.querySelector('.table-toggle');
    var table = card.querySelector('.data-table');
    if (toggleBtn && table) {
      toggleBtn.addEventListener('click', function () {
        var isHidden = table.hidden;
        table.hidden = !isHidden;
        toggleBtn.setAttribute('aria-expanded', String(isHidden));
        toggleBtn.textContent = isHidden ? '표 숨기기' : '표로 보기';
      });
    }
  });
})();
</script>
</div>
