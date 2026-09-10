# 실습 과정 소개

실습 과정은 **기업가치 종합분석 보고서** 작성이라는 주제로 claude code의 기능을 단계적으로 사용해볼 수 있도록 만들었습니다.

개념이 필요해지는 지점마다 [Claude Code](../concepts/what-is-harness.md) 섹션의 문서를 참조합니다.

### Context/Harness Engineering (stage1–3)

사용자의 암묵지를 **프롬프트 → 자료 첨부 → 하네스** 로 사용자의 의도를 형식지화 시키는 단계 입니다.

| 단계 | 무엇을 하나 | 드러나는 한계 |
|---|---|---|
| [stage1 : 프롬프트만으로 작업해보기](stage1-prompt-only.md) | 빈 폴더에서 한 문장만 던져 본다 | 근거 데이터가 없다 |
| [stage2 : 컨텍스트 추가해보기](stage2-context-attach.md) | 실제 자료를 `@` 로 첨부한다 | 매번 손으로 붙이고 형식·기준이 없다 |
| [stage3 : 하네스로 패키징하기](stage3-harness.md) | CLAUDE.md+skill+data로 하네스를 짠다 | 아무도 계산·판정을 검증 안 한다 |

### Loop Engineering (stage4–5)

hook(정형)·subagent(비정형) 기능을 활용하여 AI 작업물을 검증 할 수 있는 안전장치를 붙입니다.

| 단계 | 무엇을 하나 | 드러나는 한계 |
|---|---|---|
| [stage4 : 자기수정 loop 만들기](stage4-loop.md) | Stop hook+리뷰어 subagent로 loop를 만든다 | 판정 기준 자체가 없다 |
| [stage5 : Oracle로 판정 기준 세우기](stage5-oracle.md) | Golden Master에서 적정 범위를 역산해 형식지화한다 ⭐ | 데이터가 고정돼 있다 |

⭐ stage5에서 "Oracle의 판정 기준 자체가 사람 암묵지의 형식지화"라는 이 세트의 핵심 통찰이 드러납니다.

> 골든 마스터(Golden Master)란?
> AI의 결과물이 얼마나 잘 나왔는지 비교하는 기준이 되는 "모범 정답" 샘플을 말합니다.

> 오라클(Oracle)이란?
> AI가 만든 결과물이 맞는지 틀렸는지를 최종적으로 판정해 줄 수 있는 기준이나 방법을 뜻합니다.

### 3층 - 확장·유지·자산화 (stage6–8)

작업 결과물을 배포할 수 있는 방법을 확인합니다.

AI 가 생성해낸 결과를 지식으로 축적해 "한 번 만든 loop를 조직 자산으로" 만듭니다.

| 단계 | 무엇을 하나 | 드러나는 한계 |
|---|---|---|
| [stage6 : MCP로 실시간 연결하기](stage6-mcp.md) | 정형 원천을 실시간 조회로, 리포트를 메일로 | 여러 팀이 쓰려면? |
| [stage7 : 플러그인으로 배포하기](stage7-plugin.md) | loop를 플러그인으로 뽑아 배포한다 | 대량 산출이 또 지식 홍수가 된다 |
| [stage8 : 지식으로 자산화하기](stage8-knowledge.md) | 산출물을 llm-wiki로 자산화한다 | 자산이 다음 분석의 입력이 되어 stage2로 순환 |
