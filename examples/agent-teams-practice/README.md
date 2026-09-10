# Agent Teams 실습 — 경쟁하는 가설로 디버깅하기

[content/concepts/what-is-agent-teams.md](../../content/concepts/what-is-agent-teams.md) 에서 설명한
"경쟁하는 가설로 디버깅하기" 시나리오를 직접 해 보는 실습입니다.

`buggy_app/calc.py` 에는 서로 무관한 버그 세 개가 숨어 있고, `test_calc.py` 의 테스트 세 개가
모두 실패합니다. 팀 리더 아래 팀원 세 명을 만들어 각자 다른 함수를 맡기고, 팀원마다 다른
model 과 reasoning effort 로 조사하게 한 뒤 결론을 종합합니다.

## 사전 확인

먼저 버그를 직접 보고 시작합니다.

```bash
cd examples/agent-teams-practice/buggy_app
python3 -m unittest -v
```

테스트 3개가 모두 실패하는 것을 확인합니다. (이 저장소의 다른 파이프라인/윤문 작업과는
무관한 독립 실습 코드입니다.)

## 1. Agent Teams 활성화

`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 를 켜야 팀원을 만들 수 있습니다. shell 환경변수로
켜거나 `settings.json` 에 넣습니다.

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## 2. 팀 구성

팀원은 자연어 프롬프트로 즉석에서 만들지 않고, `.claude/agents/` 에 미리 정의해 둔
서브에이전트 정의 파일을 재사용합니다. Agent Teams 는 이런 정의를 "에이전트 타입"으로
스폰할 수 있게 지원합니다 — 정의 파일의 `model` 과 본문 지시가 그대로 팀원에 적용됩니다.

| 팀원 | 담당 | agent 정의 | model | effort |
|---|---|---|---|---|
| A | `moving_average` 의 경계값(구간이 하나 덜 계산되는) 문제 | [`boundary-bug-hunter`](.claude/agents/boundary-bug-hunter.md) | Haiku | low |
| B | `is_close_enough` 의 부동소수점 비교 문제 | [`float-compare-bug-hunter`](.claude/agents/float-compare-bug-hunter.md) | Sonnet | medium |
| C | `add_record` 의 상태 공유 문제 + A·B 결론 반박 | [`state-share-bug-hunter`](.claude/agents/state-share-bug-hunter.md) | Opus | high |

model 은 각 정의 파일의 `model` 필드에 이미 고정돼 있어, 팀원을 만드는 자연어
프롬프트에서 따로 지정할 필요가 없습니다 — 리더에게는 어떤 에이전트 타입으로 스폰할지만
알려주면 됩니다.

effort 는 다릅니다 — **팀원은 생성 시점에 리더의 effort 를 그대로 상속받고, 정의
파일이나 스폰 프롬프트로 개별 지정할 수 없습니다.** 팀원마다 다른 effort 를 쓰려면
팀원을 만든 뒤 Agent 패널에서 그 팀원 세션에 직접 들어가 `/effort` 로 이후 턴의 effort 를
설정해야 합니다. 아래 3단계에서 이 순서를 따릅니다.

## 3. 실행

`examples/agent-teams-practice/` 를 작업 디렉터리로 하는 Claude Code 세션(팀 리더)을 열고
다음을 붙여넣습니다.

```
buggy_app/calc.py 에 버그가 있어서 test_calc.py 의 테스트 3개가 모두 실패합니다.

.claude/agents/ 에 정의해 둔 세 에이전트 타입을 각각 팀원으로 스폰해 병렬 디버깅하세요:
- boundary-bug-hunter 에이전트 타입으로 팀원 A 를 스폰하세요.
- float-compare-bug-hunter 에이전트 타입으로 팀원 B 를 스폰하세요.
- state-share-bug-hunter 에이전트 타입으로 팀원 C 를 스폰하세요.

각 팀원은 원인을 정확히 짚어내고, 고친 코드와 이유를 보고해야 합니다.
```

팀원이 만들어지면 Agent 패널에서 위/아래 화살표로 팀원 A → Enter 로 그 세션에 들어가
`/effort low` 를 실행합니다. 같은 방식으로 팀원 B 는 `/effort medium`, 팀원 C 는
`/effort high` 를 실행한 뒤 리더 세션으로 돌아옵니다.

## 4. 관찰할 것

- Agent 패널에서 팀원 A/B/C 가 실제로 서로 다른 model 로 표시되는지
- 작업 목록의 상태가 대기 → 진행 중 → 완료로 바뀌는지
- 팀원 C 가 자기 조사뿐 아니라 A·B 에게 메시지를 보내 반박하는지 (메일박스)
- 세 팀원의 결론을 리더가 어떻게 종합하는지

## 정리

실습은 `buggy_app/` 코드를 고치지 않고 그대로 둬도 다시 실습할 수 있습니다. 팀원이 실제로
코드를 고쳤다면 `git checkout -- examples/agent-teams-practice/buggy_app` 로 원상복구합니다.
