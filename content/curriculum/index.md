# 강의 진행 자료

이 교안 전체에서 학습자의 이해를 돕는 자료 - 외부·사내 링크, 다운로드 파일, 시뮬레이터, 개념 설명 이미지 - 를 한자리에 모았습니다. "위치"는 실제 사이트 사이드바에 뜨는 이름이며, 눌러서 해당 페이지로 이동할 수 있습니다.

## 1. 외부·사내 링크

| 링크 | 위치 | 목적 |
|---|---|---|
| 마크다운 문법 치트시트 | [Warm Up > 마크다운 기초](../warmup/markdown.md) | 외부 마크다운 문법 참고 자료. [바로가기](https://gist.github.com/ihoneymon/652be052a0727ad59601) |
| MCP 공식 발표 글 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | Anthropic의 MCP 공개 발표 원문(출처 인용). [바로가기](https://www.anthropic.com/news/model-context-protocol) |
| MCP 서버 예시 문서 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | `claude mcp add` 명령 예시 속 원격 MCP 서버 주소. [바로가기](https://code.claude.com/docs/mcp) |
| AI-Native SDLC Playbook | [참고 자료 > AI SDLC 소개](../reference/ai-sdlc.md) | 이 문서가 정리한 Claude Academy 원본 코스. [바로가기](https://academy.claude.com/courses/ai-native-sdlc-playbook) |
| Loop engineering 공식 블로그(Anthropic) | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | 이 문서가 정리한 Anthropic 공식 블로그 원문. [바로가기](https://claude.com/blog/getting-started-with-loops) |
| Loop 관련 Wiki Docs | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | Loop 개념을 보충 설명하는 참고 문서. [바로가기](https://wikidocs.net/377850) |

## 2. 다운로드 자료

| 링크 | 위치 | 목적 |
|---|---|---|
| GitHub Desktop 설치 파일 | [Warm Up > GitHub 기초 - 사내 공유](../warmup/github-basics.md) | GUI로 Git을 쓰고 싶을 때 설치하는 프로그램. [다운로드](https://desktop.github.com/download/) |
| git-practice.zip | [Warm Up > Git 기초 - 기록 추적](../warmup/git-basics.md) | 실습을 마친 저장소를 그대로 내려받아 커밋 이력을 바로 확인. [내려받기](../warmup/assets/git-practice.zip) |


## 3. 시뮬레이터

| 링크 | 위치 | 목적 |
|---|---|---|
| claude directory 구조 시뮬레이터 | [Claude Code > Harness란 무엇인가](../concepts/what-is-harness.md) | `.claude/` 디렉터리 구조를 훑어보는 시뮬레이터. [열기](../claude-code/assets/dot-claude-directory-simulator.html) |
| context window 시뮬레이터 | [Claude Code > Turn과 Agent Loop](../claude-code/turn-concept.md) | 턴이 쌓이며 컨텍스트 창이 채워지는 과정을 보여줍니다. [열기](../claude-code/assets/context-window-simulator.html) |
| 터미널·파일탐색기 비교 시뮬레이터 | [Warm Up > 터미널 기초](../warmup/terminal-basics.md) | 터미널 명령과 파일탐색기 조작을 나란히 비교합니다. [열기](../warmup/assets/terminal-file-explorer-simulator.html) |
| stage3 하네스 시뮬레이터 | [실습 > stage3 : 하네스로 패키징하기](../course/stage3-harness.md) | CLAUDE.md 로드부터 리포트 완성까지 하네스 동작을 재생합니다. [열기](../course/assets/stage3-harness-simulator.html) |
| stage4 자기수정 loop 시뮬레이터 | [실습 > stage4 : 자기수정 loop 박기](../course/stage4-loop.md) | hook·subagent 검증과 재시도 루프백을 보여줍니다. [열기](../course/assets/stage4-loop-simulator.html) |
| stage5 오라클 시뮬레이터 | [실습 > stage5 : 오라클로 판정 기준 세우기](../course/stage5-oracle.md) | 미래 예상 가정의 적정 범위를 검증하는 과정을 보여줍니다. [열기](../course/assets/stage5-oracle-simulator.html) |
| stage6 MCP 연동 시뮬레이터 | [실습 > stage6 : MCP로 실시간 연결하기](../course/stage6-mcp.md) | MCP 연동 하네스의 내부 동작을 보여줍니다. [열기](../course/assets/stage6-mcp-integration-simulator.html) |

## 4. 개념 설명 이미지·다이어그램

| 링크 | 위치 | 목적 |
|---|---|---|
| 강사 사진(육창수) | [홈 > 강사 소개](../course/instructor.md) | 강사 프로필 사진. [이미지 보기](../media/orientation/csss.youk.png) |
| 강사 사진(이원준) | [홈 > 강사 소개](../course/instructor.md) | 강사 프로필 사진. [이미지 보기](../media/orientation/woony6.lee-paper.png) |
| 3가지 엔지니어링 비교 | [홈 > 과정 소개](../course/orientation.md) | Coding agent를 잘 다루는 3가지 엔지니어링(Context·Harness·Loop)을 비교합니다. [이미지 보기](../media/orientation/orientation-engineering-concepts.png) |
| Windows 터미널 화면 | [Warm Up > 터미널 기초](../warmup/terminal-basics.md) | Windows Terminal·PowerShell 실행 화면. [이미지 보기](../media/terminal/windows_terminal_powershell.png) |
| 경로 세 종류 비교 | [Warm Up > 터미널 기초](../warmup/terminal-basics.md) | 절대경로·상대경로·홈 디렉터리를 비교합니다. [이미지 보기](../media/terminal/terminal-path-types.png) |
| Git 네 개 작업 영역 | [Warm Up > Git 기초 - 기록 추적](../warmup/git-basics.md) | 변경이 기록으로 남는 네 단계(작업영역·스테이징·로컬·원격)를 보여줍니다. [이미지 보기](../media/git/git-basics-four-areas.png) |
| GitHub 원격 저장소 흐름 | [Warm Up > GitHub 기초 - 사내 공유](../warmup/github-basics.md) | 원격 저장소 개념과 Git 변경 흐름을 보여줍니다. [이미지 보기](../media/git/github-basics-remote-and-git-flow.png) |
| GitHub Desktop 화면 | [Warm Up > GitHub 기초 - 사내 공유](../warmup/github-basics.md) | GitHub Desktop의 GUI 구성을 보여줍니다. [이미지 보기](../media/git/github-desktop-gui.png) |
| GitHub 실습 전체 흐름 | [Warm Up > GitHub 기초 - 사내 공유](../warmup/github-basics.md) | clone부터 push까지 실습 전체 흐름을 보여줍니다. [이미지 보기](../media/git/github-basics-practice-flow.png) |
| Claude Code 첫 화면 | [Warm Up > Claude Code 첫 실행 - 권한/세션/모드](../warmup/claude-code-start.md) | 최초 실행 시 뜨는 첫 화면. [이미지 보기](../media/claude_code/첫화면.png) |
| Claude Code 창 구성 | [Warm Up > Claude Code 첫 실행 - 권한/세션/모드](../warmup/claude-code-start.md) | 터미널 창의 각 구성 요소를 설명합니다. [이미지 보기](../media/claude_code/claude-code-landing-page-explain.png) |
| 모델 선택 화면 | [Warm Up > Claude Code 첫 실행 - 권한/세션/모드](../warmup/claude-code-start.md) | 선택 가능한 모델 목록 화면. [이미지 보기](../media/claude_code/selectable_model.png) |
| 사고량(effort) 선택 화면 | [Warm Up > Claude Code 첫 실행 - 권한/세션/모드](../warmup/claude-code-start.md) | 선택 가능한 reasoning effort 목록 화면. [이미지 보기](../media/claude_code/selectable_effort.png) |
| 모델·사고량별 토큰 히트맵 | [Warm Up > Claude Code 첫 실행 - 권한/세션/모드](../warmup/claude-code-start.md) | 모델·사고량 조합별 토큰 사용량을 히트맵으로 보여줍니다. [이미지 보기](../media/claude_code/token_heatmap.png) |
| Harness 실물 사진 | [Claude Code > Harness란 무엇인가](../concepts/what-is-harness.md) | "harness"라는 낱말의 원래 뜻(마구·장비)을 보여주는 사진. [이미지 보기](../media/claude_code/real_harness_image-focus.png) |
| Harness 구성 다이어그램 | [Claude Code > Harness란 무엇인가](../concepts/what-is-harness.md) | 하네스를 이루는 구성 요소 전체를 보여줍니다. [이미지 보기](../media/claude_code/harness_overview.png) |
| Single vs Multi Turn | [Claude Code > Turn과 Agent Loop](../claude-code/turn-concept.md) | 단일 턴과 다중 턴의 차이를 비교합니다. [이미지 보기](../media/claude_code/turn-single-multi-concept.png) |
| Agent Loop 구조 | [Claude Code > Turn과 Agent Loop](../claude-code/turn-concept.md) | 에이전트 루프의 반복 구조를 보여줍니다. [이미지 보기](../media/claude_code/turn-concept-agent-loop.png) |
| Context window 화면 | [Claude Code > Turn과 Agent Loop](../claude-code/turn-concept.md) | 컨텍스트 창 사용량을 보여주는 화면. [이미지 보기](../media/claude_code/context_화면.png) |
| Context window 개념도 | [Claude Code > Context를 구성하는 요소들 > Context 란](../concepts/what-is-context.md) | context window 개념을 도식화합니다. [이미지 보기](../media/claude_code/into-context.png) |
| CLAUDE.md 적용 범위 | [Claude Code > Context를 구성하는 요소들 > CLAUDE.md](../claude-code/claude-md-placement.md) | CLAUDE.md가 적용되는 범위(스코프)를 보여줍니다. [이미지 보기](../media/claude_code/claude-md-placement-scope.png) |
| CLAUDE.md 로드 순서 | [Claude Code > Context를 구성하는 요소들 > CLAUDE.md](../claude-code/claude-md-placement.md) | 여러 CLAUDE.md가 로드되는 순서를 보여줍니다. [이미지 보기](../media/claude_code/claude-md-load-order.png) |
| CLAUDE.md·MEMORY.md 비교 | [Claude Code > Context를 구성하는 요소들 > MEMORY.md](../concepts/memory-md.md) | 작성 주체·저장 위치·공유 범위·성격·용량을 비교합니다. [이미지 보기](../media/concepts/memory-md-vs-claude-md.png) |
| doc-polish skill frontmatter | [Claude Code > Context를 구성하는 요소들 > Skill 개념](../concepts/what-is-skill.md) | 실제 skill의 frontmatter 예시. [이미지 보기](../media/claude_code/skill-frontmatter.png) |
| Skill 로딩 흐름 | [Claude Code > Context를 구성하는 요소들 > Skill 개념](../concepts/what-is-skill.md) | 목록 대기부터 호출·본문 로드·세션 유지까지 흐름을 보여줍니다. [이미지 보기](../media/concepts/skill-loading-flow.png) |
| CLAUDE.md·Rule 적용 범위 비유 | [Claude Code > 권한/실행 (행동 승인·차단) > Rule](../concepts/what-is-rule.md) | 건물과 방 규칙에 빗대 적용 범위 차이를 보여줍니다. [이미지 보기](../media/concepts/claude-md-vs-rule-building-metaphor.png) |
| Rule paths 로딩 구조 | [Claude Code > 권한/실행 (행동 승인·차단) > Rule](../concepts/what-is-rule.md) | 파일을 열 때 `paths`와 일치하는 Rule만 로드되는 구조를 보여줍니다. [이미지 보기](../media/concepts/what-is-rule-paths-loading.png) |
| Hook 이벤트 계층 비유 | [Claude Code > 권한/실행 (행동 승인·차단) > Hook](../concepts/what-is-hook.md) | 식당 운영에 빗대 세션·턴·도구 호출 훅의 반복 계층을 보여줍니다. [이미지 보기](../media/concepts/what-is-hook-event-layers.png) |
| Hook 레벨 타임라인 | [Claude Code > 권한/실행 (행동 승인·차단) > Hook](../concepts/what-is-hook.md) | hook 레벨별 실행 시점을 타임라인으로 보여줍니다. [이미지 보기](../media/concepts/what-is-hook-layer-timeline.png) |
| Stop 훅 차단 상한 | [Claude Code > 권한/실행 (행동 승인·차단) > Hook](../concepts/what-is-hook.md) | 차단 횟수가 8에 도달하면 턴을 끝내는 흐름을 보여줍니다. [이미지 보기](../media/concepts/what-is-hook-stop-cap.png) |
| Hook 생명주기 | [Claude Code > 권한/실행 (행동 승인·차단) > Hook](../concepts/what-is-hook.md) | hook의 전체 생명주기를 도식화합니다(SVG). [이미지 보기](../media/claude_code/hooks-lifecycle.svg) |
| 권한 모드 다이얼 | [Claude Code > 권한/실행 (행동 승인·차단) > 권한 모드와 슬래시 명령](../claude-code/permissions-and-commands.md) | Shift Tab으로 권한 모드가 순환하는 구조를 보여줍니다. [이미지 보기](../media/claude_code/permissions-mode-dial.png) |
| Subagent 위임 흐름 | [Claude Code > 멀티에이전트 (병렬 실행·격리) > Subagent 개념](../concepts/what-is-subagent.md) | 메인 에이전트가 격리된 subagent에 일을 나누고 요약을 받는 흐름을 보여줍니다. [이미지 보기](../media/concepts/what-is-subagent-flow.png) |
| style-guardian frontmatter | [Claude Code > 멀티에이전트 (병렬 실행·격리) > Subagent 개념](../concepts/what-is-subagent.md) | 실제 subagent의 frontmatter 예시. [이미지 보기](../media/claude_code/style-guardian-frontmatter.png) |
| MCP 표준 어댑터 구조 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | 여러 데이터 소스를 하나의 표준으로 연결하는 구조를 보여줍니다. [이미지 보기](../media/mcp/mcp_standard.png) |
| MCP 도입 전후 비교 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | MCP 도입 전후를 비교합니다. [이미지 보기](../media/mcp/before_after_mcp.png) |
| MCP 서버 연결 5단계 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | MCP 서버를 연결하는 다섯 단계를 보여줍니다. [이미지 보기](../media/mcp/mcp-connection-steps.png) |
| MCP 스코프 비교 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | local·project·user 스코프의 저장 위치와 공유 범위를 비교합니다. [이미지 보기](../media/mcp/mcp-scope-comparison.png) |
| MCP OAuth 인증 흐름 | [Claude Code > 외부연결 (MCP) > MCP 개념](../mcp/what-is-mcp.md) | OAuth 인증이 진행되는 흐름을 보여줍니다. [이미지 보기](../media/mcp/mcp-oauth-auth-flow.png) |
| Marketplace·Plugin 비유 | [Claude Code > Marketplace & Plugin > Marketplace 개념](../concepts/marketplace.md) | 앱스토어(Marketplace)와 설치한 앱(Plugin)에 빗댑니다. [이미지 보기](../media/concepts/marketplace-plugin-app-store.png) |
| Plugin 폴더 구조 | [Claude Code > Marketplace & Plugin > Plugin 만들고 배포하기](../concepts/plugin-creation.md) | plugin.json·skills·agents·commands·hooks의 배치 구조를 보여줍니다. [이미지 보기](../media/concepts/plugin-creation-folder-structure.png) |
| hooks.json 이전 전후 비교 | [Claude Code > Marketplace & Plugin > Plugin 만들고 배포하기](../concepts/plugin-creation.md) | settings.json의 hooks 항목을 hooks.json으로 옮기는 전후를 비교합니다. [이미지 보기](../media/concepts/plugin-creation-hooks-before-after.png) |
| 컨텍스트 배치 의사결정 흐름 | [Claude Code > Engineering 3축 > Context Engineering](../concepts/context-engineering.md) | 사실을 CLAUDE.md·rules·Skill·Subagent·Hook·MCP 중 어디로 보낼지 정하는 흐름입니다. [이미지 보기](../media/concepts/context-placement-decision.png) |
| 컨텍스트 로딩 비용 타임라인 | [Claude Code > Engineering 3축 > Context Engineering](../concepts/context-engineering.md) | 컨텍스트 요소별 로드 시점과 토큰 비용을 비교합니다. [이미지 보기](../media/concepts/context-loading-cost-timeline.png) |
| 위임 범위 조절 다이어그램 | [Claude Code > Engineering 3축 > Harness Engineering](../concepts/harness-engineering.md) | 신입사원에게 일을 맡기는 범위를 넓혀 가는 과정과 하네스 설정값을 보여줍니다. [이미지 보기](../media/concepts/harness-engineering-delegation-range.png) |
| 사람 자기점검 vs AI Loop 비교 | [Claude Code > Engineering 3축 > Loop Engineering](../concepts/loop-engineering.md) | 사람의 자기점검과 AI 에이전트 Loop의 반복 구조를 비교합니다. [이미지 보기](../media/concepts/loop-human-ai-comparison.png) |
| Stop 훅 제어 구조 | [Claude Code > Engineering 3축 > Loop Engineering](../concepts/loop-engineering.md) | Stop 훅이 검사 통과 전 완료를 막고 다시 작업으로 돌려보내는 구조입니다. [이미지 보기](../media/concepts/loop-stop-hook-control.png) |
| 입력 분기 구조 | [Claude Code > 실무 레퍼런스 > 터미널 기능 총정리](../claude-code/terminal-features.md) | 프롬프트 첫 글자에 따라 자연어·슬래시 명령·파일 참조·bash 모드로 갈라지는 구조입니다. [이미지 보기](../media/claude_code/terminal-input-prefix-modes.png) |
| 권한 모드 순환 구조 | [Claude Code > 실무 레퍼런스 > 터미널 기능 총정리](../claude-code/terminal-features.md) | Shift Tab으로 권한 모드가 순환하는 구조입니다. [이미지 보기](../media/claude_code/terminal-permission-mode-cycle.png) |
| Headless 자동화 흐름 | [Claude Code > 실무 레퍼런스 > 터미널 기능 총정리](../claude-code/terminal-features.md) | 셸·CI가 `claude -p`를 호출해 JSON 결과와 종료 코드를 받는 흐름입니다. [이미지 보기](../media/claude_code/headless-automation-flow.png) |
| 세션 재개 vs 포크 비교 | [Claude Code > 실무 레퍼런스 > 세션 이름짓기·재개](../claude-code/session-lifecycle.md) | 세션을 재개하는 것과 포크하는 것의 차이를 비교합니다. [이미지 보기](../media/claude_code/session-resume-vs-fork.png) |
| Subagent vs Agent Teams 비교 | [Claude Code > 멀티에이전트 (병렬 실행·격리) > Agent Teams](../concepts/what-is-agent-teams.md) | Subagent와 Agent Teams 두 방식의 차이를 비교합니다. [이미지 보기](../media/claude_code/subagents-vs-agent-teams.png) |
| Agent Teams 구성 요소 | [Claude Code > 멀티에이전트 (병렬 실행·격리) > Agent Teams](../concepts/what-is-agent-teams.md) | 팀 리더·팀원·작업 목록·메일박스로 이뤄진 구성을 보여줍니다. [이미지 보기](../media/concepts/what-is-agent-teams-agile-structure.png) |
| Atlassian 칸반 예시 | [Claude Code > 멀티에이전트 (병렬 실행·격리) > Agent Teams](../concepts/what-is-agent-teams.md) | Agent Teams의 작업 관리 방식을 설명하는 칸반 보드 예시입니다. [이미지 보기](../media/concepts/atlassian_kanban.png) |
| SDLC 병목 이동 | [참고 자료 > AI SDLC 소개](../reference/ai-sdlc.md) | 빌드 단계가 빨라지며 병목이 기획·리뷰·배포 쪽으로 옮겨가는 모습을 보여줍니다. [이미지 보기](../media/claude_code/bottle_neck.png) |
| Loop 네 가지 종류 | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | Turn-based·Goal-based·Time-based·Proactive 네 가지 loop을 한눈에 비교합니다. [이미지 보기](../media/claude_code/loop_종류.png) |
| Turn-based loop 구조 | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | 프롬프트 한 번마다 한 사이클이 도는 구조를 보여줍니다. [이미지 보기](../media/claude_code/turn_based_loop.png) |
| Goal-based loop 구조 | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | 목표 기준을 넘을 때까지 스스로 반복하는 구조를 보여줍니다. [이미지 보기](../media/claude_code/goal_based_loop.png) |
| Proactive loop 구조 | [참고 자료 > Loop 의 종류](../reference/loop-engineering.md) | 사람 개입 없이 이벤트 기반으로 스스로 도는 구조를 보여줍니다. [이미지 보기](../media/claude_code/proactive_loop.png) |
