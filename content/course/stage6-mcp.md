# stage6

<p class="ailab-title-subtitle">- MCP로 실시간 서비스 연결하기</p>

이 단계에서는 정형 데이터 원천을 정적 파일에서 **실시간 조회** 로 바꾸고, 완성 리포트를 안전하게 공유 가능한 파일로 준비합니다.

그 연결을 MCP라는 표준 커넥터로 답니다.

이 실습을 끝내면 최근 분기·TTM 기준으로 갱신된 리포트 한 벌을 뽑습니다.

> TTM(Trailing Twelve Months)은 특정 시점부터 과거 12개월간의 실적을 합산한 값으로, 계절성을 반영하면서도 가장 최근 상황을 보여주기 위해 분기·연간 실적 대신 밸류에이션 계산 등에 자주 사용됩니다.

고정된 정답이 없는 상황에서 오라클을 다시 설계합니다.

분석이 파일로 끝나지 않고 실제 업무 프로세스에 얹히는 것도 경험합니다.

## 왜 MCP인가

기업가치 종합분석 보고서에 필요한 건 오늘 이 순간의 주가·재무 수치인데, 그건 현재 작업 context에 없습니다.

이 값을 정적 파일로 미리 받아 두는 대신 필요할 때 바로 꺼내오려면, harness 밖과 이어주는 표준 연결이 필요합니다.

MCP가 없던 시절엔 시스템마다 다른 방식으로 연결을 따로 짜야 했습니다.

MCP는 이 연결을 한 규격으로 통일합니다.

개념 심화는 [MCP](../mcp/what-is-mcp.md) 에서 봅니다.

- **US Stock MCP**(미국 주식 재무데이터)를 통해 실시간으로 데이터를 받아옵니다.

 - 완성 리포트는 파일로 확인하고, 참가자가 사용하는 메일·협업 도구로 직접 공유합니다.

연결 절차는 [MCP](../mcp/what-is-mcp.md#mcp-서버-구축에서-연결까지) 에서 봅니다.

## 사전 준비

아래 명령을 복사 붙여넣기 하여, mcp 설정을 하도록 합니다.

<details class="ailab-code" markdown="1">
<summary>코드 예시 펼치기 - MCP 서버 등록 명령</summary>

<div class="ailab-code-window">
<div class="ailab-code-titlebar">
<span class="ailab-code-dots"><span></span><span></span><span></span></span>
<span class="ailab-code-filename">setup-mcp.sh</span>
</div>

```bash
# Financial Datasets MCP(공개 인터넷, 브라우저 OAuth 인증)
claude mcp add --transport http financial-datasets https://mcp.financialdatasets.ai/

# `/mcp`를 실행해 브라우저에서 로그인·승인을 완료하세요.
```

</div>
</details>

## 실습 단계

### 1. 세션을 열고 실시간 조회가 되는지 확인하세요

이 폴더에서 `claude` 를 실행한 뒤, 아래 프롬프트를 그대로 입력하세요.

```
mcp 로 NVIDIA 정보 가져올 수 있어?
```

financial-datasets MCP로 NVDA 최근 실적이 실시간으로 돌아오면 연결이 정상입니다.

콘솔에 최근 분기(FY2027 Q1)와 전년 동기(FY2026 Q1), TTM 주당순이익 합계 `6.53` 이 표로 뜹니다.

주가·시가총액은 이 MCP의 커버리지 밖이라 `data/financials.json` 의 정적 값을 그대로 씁니다.

### 2. 리포트를 자동 생성하세요

```
/fair-value-report NVIDIA
```

skill이 연결된 재무 MCP 로 최근 8개 구간을 받아 최근 분기·TTM을 역산합니다.

그리고 `raw/`(비정형)를 종합해 `reports/fair-value.md` 를 작성합니다.

앞 단계의 여섯 섹션에 더해 `### 최근 분기 재무 데이터`(당기/전기 2행)와 `### TTM 주당순이익 역산`(4개 분기 합산) 두 섹션이 새로 들어갑니다.

실시간 조회가 실패하면 skill이 즉시 `data/financials.json`(FY2026 연간) 폴백으로 전환합니다.

### 3. 리뷰어 subagent로 정성 분석을 채점하세요

`fair-value-reviewer` subagent를 호출하세요.

hook이 판정할 수 없는 정성 균형·종합 일관성·미래 예상 가정 명시성·범위 밖 근거 설득력을 루브릭으로 채점합니다(PASS≥9/16).

미달이면 지적을 반영해 보강하세요.

### 4. Stop hook이 내부 일관성을 검증하게 두세요

Claude가 응답 한 턴을 끝낼 때마다(세션 종료가 아닙니다) Stop hook이 `scripts/validate_fair_value.py` 를 자동으로 돌립니다.

이 스크립트가 오라클 재설계의 핵심입니다

- 고정된 정답 파일과 대조하는 대신, 리포트가 스스로 인용한 분기 표 2행에서 지표를 **직접 재계산** 해 내부 일관성을 봅니다.

- TTM 주당순이익 = `1.08 + 1.30 + 1.76 + 2.39 = 6.53`
- 주가배수 = `216.85 ÷ 6.53 = 33.2배`
- 매출 증가율(YoY) = `(81,615 − 44,062) ÷ 44,062 = 85.2%`

여기에 `데이터 출처:` 마커(실시간이면 SEC accession 번호 인용, 폴백이면 `폴백 사유:`)와 미래 예상 가정의 적정 범위(주가배수 18~35배, 성장률 20~44%)도 함께 검증합니다.

형식·마커·재계산·범위 중 하나라도 어긋나면 `exit 2` 로 턴이 막힙니다.

실패 사유가 Claude에게 재투입되면, Claude가 리포트를 스스로 고칩니다.

!!! tip "세 가지 결과를 비교해 보세요"
    `examples/` 의 세 파일을 각각 `reports/fair-value.md` 로 복사해 hook을 돌리면 차이가 바로 보입니다.

    ```bash
    cp examples/sample-fallback-static.md reports/fair-value.md
    python3 scripts/validate_fair_value.py   # 통과

    cp examples/sample-missing-source-marker.md reports/fair-value.md
    python3 scripts/validate_fair_value.py   # 실패 - 출처 마커 없음

    cp examples/sample-live-inconsistent.md reports/fair-value.md
    python3 scripts/validate_fair_value.py   # 실패 - 자기 분기 표와 지표 불일치
    ```

    폴백 데모는 통과, 출처 마커 누락 데모는 마커 부재로 실패, 실시간 데이터 내부 불일치 데모는 "리포트가 스스로 인용한 분기 표로 재계산한 값과 다르다"는 사유로 실패합니다.

### 5. 최종 승인 후 리포트를 공유하세요

hook 통과 + 리뷰어 PASS가 되면 `reports/fair-value.md`를 열어 최종본인지 확인하세요.

파일을 내려받아 본인이 사용하는 메일이나 협업 도구에 직접 첨부합니다.

자동 메일 발송은 수신자·권한·개인정보를 다루므로 이 공개 교안의 범위에서 제외합니다.

### 결과 확인 방법

- `reports/fair-value.md` 에 `### 최근 분기 재무 데이터`(당기/전기 2행)와 `### TTM 주당순이익 역산`(합계 `**TTM 합계**` `**6.53**`) 두 섹션이 있습니다.

- `## 출처` 섹션에 `데이터 출처:` 마커가 있습니다 - 실시간 모드면 `accession 0001045810-26-000052, filed 2026-05-20` 형식의 SEC 번호가, 폴백 모드면 `폴백 사유:` 가 붙습니다.

- `python3 scripts/validate_fair_value.py` 를 직접 돌리면 `✅ All validations passed` 가 나옵니다.

- `reports/fair-value.md`를 내려받아 선택한 공유 채널에 첨부할 수 있습니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage6-mcp-integration</summary>

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
  <span class="t-accent">▘▘ ▝▝</span>    ~/…/market-analysis-valuation-nvidia-plain/stage6-mcp-integration


<span class="t-user">❯ mcp 로 NVIDIA 정보 가져올 수 있어?</span>

<span class="t-accent">●</span> MCP 서버가 이제 연결됐으니 us-stock-mcp로 NVIDIA 실시간 재무 데이터를
  조회해볼게.

<span class="t-dim">  Called us-stock-mcp (ctrl+o to expand)</span>

<span class="t-accent">●</span> 네, MCP로 실시간 조회됩니다. 방금 us-stock-mcp로 NVDA 최근 실적을 가져왔어.

  최근 분기 (SEC 10-Q, accession 0001045810-26-000052, filed 2026-05-20)

  ┌─────────────────────────────┬──────────┬──────────┬────────────┬─────────┐
  │            구분             │  매출액  │ 영업이익 │ 당기순이익 │ 희석EPS │
  ├─────────────────────────────┼──────────┼──────────┼────────────┼─────────┤
  │ FY2027 Q1 (2026-04-26 마감) │ $81,615M │ $53,536M │ $58,321M   │ $2.39   │
  ├─────────────────────────────┼──────────┼──────────┼────────────┼─────────┤
  │ FY2026 Q1 (2025-04-27 마감, │ $44,062M │ $21,638M │ $18,775M   │ $0.76   │
  │  전년동기)                  │          │          │            │         │
  └─────────────────────────────┴──────────┴──────────┴────────────┴─────────┘

  YoY: 매출 +85.2%, 순이익 +210.6%, 영업이익률 65.6%

  TTM EPS 역산 (YTD 누적치를 분기별로 표준화: Q2=1.84−0.76, Q3=3.14−1.84,
  Q4=4.90−3.14)

  ┌───────────┬────────────┐
  │   분기    │ 표준화 EPS │
  ├───────────┼────────────┤
  │ FY2026 Q2 │ 1.08       │
  ├───────────┼────────────┤
  │ FY2026 Q3 │ 1.30       │
  ├───────────┼────────────┤
  │ FY2026 Q4 │ 1.76       │
  ├───────────┼────────────┤
  │ FY2027 Q1 │ 2.39       │
  ├───────────┼────────────┤
  │ TTM 합계  │ 6.53       │
  └───────────┴────────────┘

  CLAUDE.md의 stage6 절차(누적치 역산 → TTM 합산)와 정확히 일치하는 결과야.
  주가·시가총액은 이 MCP 커버리지 밖이라 data/financials.json의 정적 값을 계속
  써야 해.

  전체 리포트로 만들고 싶으면 /fair-value-report NVIDIA를 실행하면 돼.
<span class="t-status">✻ Worked for 33s</span>

<span class="t-status">※ recap: We were setting up MCP access to fetch live NVIDIA financials for the stage6 fair-value exercise; I just confirmed us-stock-mcp is connected and pulled Q1 FY2027 data plus TTM EPS. Next step: run /fair-value-report NVIDIA to generate the full report. (disable recaps in /config)</span>

<span class="t-user">❯ /fair-value-report NVIDIA</span>

<span class="t-dim">  Read 5 files, listed 1 directory (ctrl+o to expand)</span>

<span class="t-accent">●</span> 既存のreports/fair-value.md가 이미 이번에 조회한 데이터와 정확히 일치하는
  내용으로 작성돼 있어. 검증 스크립트를 먼저 돌려서 정형 검증부터 확인할게.

<span class="t-dim">  Ran 1 shell command (ctrl+o to expand)</span>

<span class="t-accent">●</span> 정형(hook) 검증은 통과했어. 이제 비정형 파트를 fair-value-reviewer subagent로
  채점할게.

<span class="t-accent">●</span> fair-value-reviewer(Review fair-value.md qualitative sections)
<span class="t-dim">  ⎿  Done (7 tool uses · 32.8k tokens · 53s)</span>
<span class="t-dim">  (ctrl+o to expand)</span>

<span class="t-accent">●</span> 이중 오라클 모두 통과했어.

  - 정형(hook): scripts/validate_fair_value.py ✅ 통과 - 데이터 출처 마커,
  accession 번호, 분기 표 기반 재계산(EPS 6.53, PER 33.2배, 매출YoY 85.2%,
  영업이익률 65.6%, 순이익YoY 210.6%), 미래 예상 가정 범위(29.0배/27.5%, 밴드
  18–35배/20–44% 이내) 모두 일치
  - 비정형(subagent): fair-value-reviewer 16/16 PASS - 정성 균형, 종합 판정
  일관성, 미래 가정 명시성, 범위 밖 근거(해당 없음) 전부 만점.
  raw/·golden-reports 원자료와 대조해 인용 수치가 실제로 뒷받침됨을 확인

  리포트(reports/fair-value.md)는 이미 검증을 통과한 상태로 존재해. 사소한
  다듬기 제안(우려 요인의 "89% 높음" 수치가 원래 34.2배 기준인데 29~34배 구간
  전체에 적용된 것처럼 읽힘) 하나가 있는데, 필수는 아니야 - 원하면 반영할 수
  있어.


<span class="t-status">✻ Baked for 2m 16s</span></pre>
</div>

</details>

## Stage 6 의 결론

**🎯 살아있는 데이터와 업무 연결**

정형 원천을 실시간 조회로 바꾸고, 고정 정답이 없는 상황에 맞춰 오라클을 내부 일관성 검증으로 다시 설계했습니다.

완성한 리포트를 메일이라는 실제 업무 프로세스에 얹어 마무리했습니다.

다만 이 loop는 지금 이 폴더, 이 하네스 안에서만 돕니다.

여러 팀이 같은 loop를 쓰려면 배포할 수 있는 형태로 옮겨야 합니다.

다음 [stage7](stage7-plugin.md) 은 이 loop를 플러그인으로 뽑아 배포하는 단계입니다.

## 참고

### 실패했을 때

- **실시간 조회가 안 되면**(사내망 등에서 MCP 연결 불가) skill이 `data/financials.json` 폴백으로 넘어갑니다. 이때는 `데이터 출처:` 에 `폴백 사유:` 가 반드시 있어야 hook을 통과합니다. 연결 자체를 다시 시도하려면 [MCP](../mcp/what-is-mcp.md#mcp-서버-구축에서-연결까지) 로 돌아가세요.

- **hook이 내부 일관성 실패로 막으면** 리포트가 자기 분기 표에서 뽑은 숫자와 정량 지표가 어긋난 것입니다. `sample-live-inconsistent.md` 데모와 같은 상황이니, 분기 표 2행을 기준으로 지표를 다시 계산하게 두세요.

- **출처 마커가 없어 막히면** `## 출처` 에 실시간/폴백 중 하나의 마커를 정확한 형식으로 넣으세요. 정답 파일이 없는 이 단계에서 "이 숫자가 어디서 왔는지" 밝히는 것이 최소 규율입니다.

- **공유 전에** 리포트에 고객 정보·API 키·개인 메일 주소가 없는지 다시 확인하세요.

### 토큰·비용 실측 데모

이 stage는 실시간 MCP 응답(JSON)·`raw/` 원문·리포트 초안·hook 재투입이 한 세션에 계속 쌓이므로, 토큰이 어디로 가는지 눈으로 보기 좋은 타이밍입니다.

1. `/context` 를 입력해 방금 이 실습에서 쓴 토큰을 카테고리별로 봅니다. MCP 도구 정의가 컨텍스트에서 차지하는 몫, 실시간 조회 JSON 응답이 쌓인 양이 보입니다.

2. `/usage` 로 이 세션에서 skill·subagent·MCP별로 어디에 토큰을 썼는지 확인합니다.

3. 절약 포인트를 짚습니다. 리뷰어 subagent는 리포트를 자기 컨텍스트에서만 읽고 메인에는 채점 결과만 돌려줍니다. loop 중 hook 재투입이 여러 번 이어져 컨텍스트가 무거워지면 `/compact` 로 압축하고, 연속성이 필요 없으면 `/clear` 가 더 쌉니다. 상세는 [토큰 절약 기법](../reference/token-saving.md) 에서 봅니다.

### 시뮬레이터 - MCP 연동 하네스 내부 동작 미리 보기

이 하네스가 내부에서 어떻게 도는지 별도 화면으로 훑어볼 수 있습니다.

us-stock-mcp 실시간 조회(성공/폴백 분기) → TTM 역산 → 리포트 작성 → 이중 오라클(subagent 동기 + Stop hook 자동, 서로 다른 시점) → 실패 시 루프백 → 파일 공유 준비까지, 전체 흐름을 단계별로 보여주는 시뮬레이터입니다.

재생·클릭으로 단계를 따라가 보세요.

[시뮬레이터 보기 →](assets/stage6-mcp-integration-simulator.html){ .md-button .md-button--primary }

이 시뮬레이터를 포함한 전체 실습·시각화 자료 목록은 [강의 진행 자료](../curriculum/index.md)에 있습니다.
