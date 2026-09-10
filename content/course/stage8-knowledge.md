# stage8

<p class="ailab-title-subtitle">- 지식으로 자산화하기(Feat. llm-wiki)</p>

stage3–7에서 리포트를 손으로 → 하네스로 → loop로 → 플러그인으로 만들며 점점 자동화 / 자산화 작업을 하였습니다.

그런데 리포트가 AI로 계속 쏟아지면 날짜별·시나리오별·종목별 결과물이 흩어져 **또 다른 지식 홍수**가 됩니다.

이 마지막 단계에서는 그 산출물을 체계적으로 쌓아 재사용하는 **llm-wiki**로 실제 자산화를 해봅니다.

이 실습을 끝내면 미처리 리포트를 감지해 요약·색인하고, 쌓인 지식에 질문해 비교 연구 페이지를 만들어 냅니다.

## 산출물은 지식이 아니다

분석의 끝은 "좋은 리포트 한 장"이 아니라, 그 리포트들이 서로 연결되고 검색되는 지식 자산입니다.

리포트가 쌓이기만 하면 못 찾습니다.

**원본 보존(raw) + 요약·연결(wiki) + 색인(index) + 연대기(log)**라야 재사용됩니다.

여기서 쓰는 미니 wiki는 원본(`raw/`)과 LLM이 소유하는 요약층(`wiki/`)의 2층 구조입니다.

## 실습 단계

### 1. 미처리 리포트를 감지하세요

폴더에서 아래를 실행하세요.

```bash
./check-new-sources.sh
```

`raw/`의 낙관·보수 시나리오 2건이 **미처리**로 뜹니다(요약 페이지가 없어서).

`fair-value-NVDA-…`는 이미 `wiki/sources/`에 요약이 있어 처리된 것으로 인식됩니다.

이 감지가 성립하는 이유 자체가 "sources 페이지에 원본 파일명을 명시"라는 규칙 덕분임을 확인하세요.

### 2. Ingest - 자산화하세요

이 폴더에서 `claude` 를 켜고 아래처럼 지시하세요.

```
check-new-sources.sh로 미처리 리포트를 찾아서 CLAUDE.md의 Ingest 워크플로우대로
wiki/sources/에 요약 페이지를 만들고, index.md·log.md를 갱신해줘.
```

- `wiki/sources/nvda-fair-value-2026-08-20.md` 를 템플릿으로, 같은 표준 필드(판정·목표주가·목표 주가배수·성장률·리스크)로 낙관/보수 시나리오 요약을 만듭니다.

- 다시 `./check-new-sources.sh`를 돌려 **미처리 0건**이 되는지 확인하세요. 자산화 완료의 신호입니다.

### 3. Query - 지식베이스에 물어 research 페이지를 만드세요

```
wiki에 쌓인 NVDA 밸류에이션들의 '목표 주가배수·성장률 가정'을 한 표로 비교하고,
가정에 따라 판정이 어떻게 갈리는지 wiki/research/에 정리해줘.
```

`wiki/research/`에 비교표 페이지가 생기고 `index.md`에 등록됩니다.

세 리포트가 보수 ~18.1배·20.0%, 중심 29.0배·27.5%, 낙관 34.2배·43.87%의 스펙트럼으로 정리됩니다.

이때 답의 근거가 개별 리포트(`raw/`)가 아니라 이미 요약된 `wiki/sources/` 에서 나온다는 점을 확인하세요.

원문을 다시 다 읽지 않아도 종합됩니다.

이것이 자산화의 효용입니다.

### 결과 확인 방법

- 2단계 뒤 `./check-new-sources.sh` 가 미처리 0건을 보고합니다.

- `wiki/sources/` 에 낙관·보수 시나리오 요약 페이지 2개가 표준 필드로 새로 생깁니다.

- `wiki/index.md` 에 세 소스가 등록됩니다.

- `wiki/log.md` 에 ingest 기록이 날짜와 함께 남습니다.

- 3단계 뒤 `wiki/research/` 에 세 시나리오를 묶은 비교표 페이지가 생깁니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage8-knowledge-base</summary>

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
  <span class="t-accent">▘▘ ▝▝</span>    ~/…/market-analysis-valuation-nvidia-plain/stage8-knowledge-base


<span class="t-user">❯ check-new-sources.sh로 미처리 리포트를 찾아서 CLAUDE.md의 Ingest</span>
<span class="t-user">  워크플로우대로</span>
<span class="t-user">  wiki/sources/에 요약 페이지를 만들고, index.md·log.md를 갱신해줘.</span>

<span class="t-dim">  Listed 1 directory, ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> 미처리 리포트 2건을 확인했다. 두 파일을 읽어서 내용을 파악해야 한다.

<span class="t-dim">  Read 3 files, listed 2 directories (ctrl+o to expand)</span>

<span class="t-accent">●</span> Write(wiki/sources/nvda-낙관시나리오.md)
<span class="t-dim">  ⎿  Wrote 31 lines to wiki/sources/nvda-낙관시나리오.md</span>
<span class="t-dim">       1 ---</span>
<span class="t-dim">       2 tags: [source]</span>
<span class="t-dim">       3 updated: 2026-08-28</span>
<span class="t-dim">       4 sources: ["raw/valuation-NVDA-낙관시나리오.md"]</span>
<span class="t-dim">       5 ---</span>
<span class="t-dim">       7 # NVDA 최고 낙관 시나리오 요약 (실제 관측 가정)</span>
<span class="t-dim">       8</span>
<span class="t-dim">       9 원본: `raw/valuation-NVDA-낙관시나리오.md` - 애널리스트 61명 중</span>
<span class="t-dim">         최고 목표가 (검색 종합,</span>
<span class="t-dim">      10 stockanalysis.com/forecast, tipranks.com/nvda/forecast).</span>
<span class="t-dim">     … +30 lines (ctrl+o to expand)</span>

<span class="t-accent">●</span> Write(wiki/sources/nvda-보수시나리오.md)
<span class="t-dim">  ⎿  Wrote 34 lines to wiki/sources/nvda-보수시나리오.md</span>
<span class="t-dim">       1 ---</span>
<span class="t-dim">       2 tags: [source]</span>
<span class="t-dim">       3 updated: 2026-08-28</span>
<span class="t-dim">       5 ---</span>
<span class="t-dim">       6</span>
<span class="t-dim">       7 # NVDA 학술 계산모델 - 보수적 시나리오 요약 (실제 관측 가정)</span>
<span class="t-dim">       8</span>
<span class="t-dim">       9 원본: `raw/valuation-NVDA-보수시나리오.md` - researchgate.net/pu</span>
<span class="t-dim">      10 "Company Valuation for Nvidia based on Multiple Valuation Method</span>
<span class="t-dim">         s". 반도체 업종 평균 배수는</span>
<span class="t-dim">     … +38 lines (ctrl+o to expand)</span>

<span class="t-accent">●</span> Now let's update index.md and log.md, and fix the existing base report's
  "미ingest" notes since both are now ingested.

<span class="t-accent">●</span> Update(wiki/index.md)
<span class="t-dim">  ⎿  File must be read first</span>

<span class="t-dim">  Read 2 files (ctrl+o to expand)</span>

<span class="t-accent">●</span> Update(wiki/index.md)
<span class="t-dim">  ⎿  Added 3 lines, removed 4 lines</span>
<span class="t-dim">       4</span>
<span class="t-dim">       5  ## Sources (원본 리포트 요약)</span>
<span class="t-dim">       6  - [[nvda-fair-value-2026-08-20]] - NVDA 판정=저평가, 목표배수 2</span>
<span class="t-dim">          9.0배·성장률 27.5% (2026-08-28)</span>
<span class="t-dim">       7 +- [[nvda-낙관시나리오]] - 최고 낙관: 목표배수 34.2배·성장률 43.</span>
<span class="t-dim">         +87%·목표주가 $500 (2026-08-28)</span>
<span class="t-dim">       8 +- [[nvda-보수시나리오]] - 학술모델 보수: 목표배수 ~18.1배·성장</span>
<span class="t-dim">         +률 20.0%·할인율 12.00% (2026-08-28)</span>
<span class="t-dim">       9</span>
<span class="t-dim">       8 -&gt; 아직 자산화되지 않은 원본이 `raw/`에 남아 있다(낙관·보수 시나</span>
<span class="t-dim">         -리오 2건) -</span>
<span class="t-dim">       9 -&gt; `./check-new-sources.sh`로 확인하고 ingest한다.</span>
<span class="t-dim">      10 -</span>
<span class="t-dim">      10  ## Research (파생 문서)</span>
<span class="t-dim">      12 -- (아직 없음 - 여러 리포트를 ingest한 뒤 비교표/메타분석을 여기</span>
<span class="t-dim">         - 만든다)</span>
<span class="t-dim">      11 +- (아직 없음 - 세 리포트가 모였으니 다음엔 시나리오 비교표/밴드</span>
<span class="t-dim">         + 분석을 여기 만들 수 있다)</span>

<span class="t-accent">●</span> Update(wiki/log.md)
<span class="t-dim">  ⎿  Added 10 lines</span>
<span class="t-dim">       4  - `raw/fair-value-NVDA-2026-08-20.md`를 자산화. `wiki/sources/n</span>
<span class="t-dim">          vda-fair-value-2026-08-20.md`</span>
<span class="t-dim">       5    요약 페이지 생성(판정=저평가, 목표배수 29.0배·성장률 27.5%),</span>
<span class="t-dim">          index.md에 등록.</span>
<span class="t-dim">       6  - `raw/`에 미ingest 리포트 2건(낙관·보수 시나리오)이 남아 있음</span>
<span class="t-dim">          - 다음 세션에서 처리 예정.</span>
<span class="t-dim">       7 +</span>
<span class="t-dim">       8 +## [2026-08-28] ingest | NVDA 낙관·보수 시나리오 리포트 2건</span>
<span class="t-dim">       9 +- `raw/valuation-NVDA-낙관시나리오.md` → `wiki/sources/nvda-낙</span>
<span class="t-dim">         +관시나리오.md` 생성</span>
<span class="t-dim">      10 +  (목표배수 34.2배·성장률 43.87%·목표주가 $500, 애널리스트 61명</span>
<span class="t-dim">         + 중 최고가).</span>
<span class="t-dim">      11 +- `raw/valuation-NVDA-보수시나리오.md` → `wiki/sources/nvda-보</span>
<span class="t-dim">         +수시나리오.md` 생성</span>
<span class="t-dim">      12 +  (학술 계산모델 기반, 목표배수 ~18.1배 역산·성장률 20.0%(추정)</span>
<span class="t-dim">         +·할인율 12.00%).</span>
<span class="t-dim">      13 +- 세 리포트 모두 [[nvda-fair-value-2026-08-20]]과 판정 방향이</span>
<span class="t-dim">         +모순되지 않음 - 동일 기초</span>
<span class="t-dim">      14 +  데이터(현재가 $216.85, 반도체 평균 대비 89% 프리미엄)에서 낙</span>
<span class="t-dim">         +관/기준/보수로 갈리는 시나리오</span>
<span class="t-dim">      15 +  스펙트럼으로 정리됨. index.md에 3건 모두 등록, `./check-new-s</span>
<span class="t-dim">         +ources.sh` 재확인 결과</span>
<span class="t-dim">      16 +  미처리 0건.</span>

<span class="t-accent">●</span> Now let's fix the base report's "아직 미ingest" note since both are now
  processed, and confirm with the check script.

<span class="t-accent">●</span> Update(wiki/sources/nvda-fair-value-2026-08-20.md)
<span class="t-dim">  ⎿  Added 5 lines, removed 4 lines</span>
<span class="t-dim">      22</span>
<span class="t-dim">      23  ## 한 줄 판단</span>
<span class="t-dim">      24  현재 실적 기준으로는 비싸지만(44배), 애널리스트 목표주가 전체가</span>
<span class="t-dim">           현재가보다 높아 **미래 예상</span>
<span class="t-dim">      25 -가정(성장률 27.5%·목표배수 29배)을 채택하면 저평가**. 그 가정은</span>
<span class="t-dim">         - [[assumptions 적정범위]]의</span>
<span class="t-dim">      26 -중심값이다. 반대 시나리오는 [[nvda-보수시나리오]](아직 미ingest</span>
<span class="t-dim">         -)를 참고.</span>
<span class="t-dim">      25 +가정(성장률 27.5%·목표배수 29배)을 채택하면 저평가**. 이 가정은</span>
<span class="t-dim">         + [[nvda-낙관시나리오]](목표배수</span>
<span class="t-dim">      26 +34.2배·성장률 43.87%)와 [[nvda-보수시나리오]](목표배수 ~18.1배·</span>
<span class="t-dim">         +성장률 20.0%) 사이의 중간값에</span>
<span class="t-dim">      27 +해당한다.</span>
<span class="t-dim">      28</span>
<span class="t-dim">      29  ## 관련</span>
<span class="t-dim">      29 -- 낙관 극단: [[nvda-낙관시나리오]] (아직 미ingest)</span>
<span class="t-dim">      30 -- 보수 극단: [[nvda-보수시나리오]] (아직 미ingest)</span>
<span class="t-dim">      30 +- 낙관 극단: [[nvda-낙관시나리오]] - 목표배수 34.2배·성장률 43.</span>
<span class="t-dim">         +87%·목표주가 $500</span>
<span class="t-dim">      31 +- 보수 극단: [[nvda-보수시나리오]] - 목표배수 ~18.1배·성장률 20</span>
<span class="t-dim">         +.0%·할인율 12.00%</span>

<span class="t-dim">  Ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> 미처리 리포트 2건(낙관·보수 시나리오)을 자산화 완료했다.

  - wiki/sources/nvda-낙관시나리오.md, wiki/sources/nvda-보수시나리오.md 신규
  생성 - 표준 필드(목표배수·성장률·할인율·판정)로 정리
  - 기존 nvda-fair-value-2026-08-20.md의 "미ingest" 표시를 걷어내고 세 리포트 간
  관계(중간값/낙관/보수) 설명으로 갱신
  - index.md·log.md 갱신, check-new-sources.sh 재실행으로 미처리 0건 확인

  세 리포트는 판정 방향이 모순되지 않고 동일 기초 데이터에서 시나리오별로 갈리는
  스펙트럼(목표배수 18.1~34.2배, 성장률 20~43.87%)으로 정리된다. 다음 단계로 이
  세 값을 한 표로 묶는 비교 연구 페이지(wiki/research/)를 만들 만하다 - 원하면
  진행할게.

<span class="t-status">✻ Worked for 1m 39s</span></pre>
</div>

</details>

## Stage 8 의 결론

stage1에서는 "결과가 파일로 안 남는다"가 첫 번째 한계였습니다.

stage2~7을 거치며 그 결과에 근거를 붙이고, 하네스로 규칙을 고정하고, loop / 오라클 / MCP / 플러그인으로 검증 / 자동화 /배포까지 하였습니다

stage8에서는 그렇게 쌓인 산출물을 raw / wiki / index / log 구조로 연결해, 검색되고 재사용되는 지식 자산으로 축적했습니다.

이 자산은 다음 분석의 raw 입력이 되어 다시 [stage2](stage2-context-attach.md)로 순환합니다.

이렇게 stage1부터 이어진 8단계 실습을 마무리 하였습니다.

긴 여정 따라 오시느라 고생 많으셨습니다.

## 참고

### 실습 실패했을 때

- **미처리가 계속 뜨면** 요약 페이지의 프론트매터에 `sources: ["raw/<원본 파일명>"]` 이 정확히 들어갔는지 확인하세요. 감지기가 이 필드로 원본과 요약을 대조합니다.

- **Query 답이 원문을 통째로 다시 읽으면** ingest가 덜 됐습니다. 2단계로 돌아가 `wiki/sources/` 요약이 표준 필드를 갖췄는지 확인하세요.
