# Marketplace 개념

<p class="ailab-title-subtitle">- 플러그인을 나누는 장터</p>

Marketplace는 플러그인들을 설치할 수 있는 저장소입니다.

사용자가 만든 skill·agent·hook·MCP 등을 marketplace에 올려두면, 다른 사용자가 그것을 찾아 설치합니다.

이 페이지는 마켓플레이스가 무엇이고 왜 필요한지, 그리고 마켓플레이스 없이 배포하는 대안까지 개념으로 정리합니다.

실제로 하나를 만들어 배포하는 절차는 [Plugin 만들고 배포하기](plugin-creation.md) 에서 다룹니다.

![Marketplace는 플러그인을 찾고 설치하는 앱스토어이며 Plugin은 설치해 쓰는 앱이라는 비유](../media/concepts/marketplace-plugin-app-store.png)

## 왜 필요한가

혼자 만든 자산은 혼자만 씁니다.

부서 전체가 같은 도구를 쓰려면 배포·발견 채널이 필요합니다.

마켓플레이스는 그 채널입니다 - 한 번 올리면 여러 사람이 같은 버전을 내려받습니다.

Anthropic 공식 카탈로그 `anthropics/claude-plugins-official` 이 대표적인 예입니다.

이 안에 284개 플러그인이 있고, 그중 38개는 Anthropic 이 직접 만들었습니다.

즉 마켓플레이스는 자산화된 지식을 재사용과 전파 하기 위해 꼭 필요 합니다.

## (심화) 사내(Enterprise) 환경에서의 제약

!!! note "지금은 건너뛰어도 됩니다"
    사내(폐쇄망) 환경에서 마켓플레이스를 실제로 등록할 수 있는지, 안 되면 어떻게 우회하는지 궁금할 때만 필요합니다.

교안 작성 시점(26.09.03) 기준, Codex는 마켓플레이스 기능을 그대로 쓸 수 있지만 Claude Code는 사내 환경에서 이 기능을 쓸 수 없습니다.

원인은 조직이 managed settings로 걸어 둔 마켓플레이스 허용 목록(`strictKnownMarketplaces`)·차단 목록(`blockedMarketplaces`) 정책입니다.

이 목록에 없는 외부 소스는 등록 자체가 막힙니다.

### (Codex)(사내/사외)marketplace 추가하기

Codex CLI는 `codex plugin marketplace` 명령으로 마켓플레이스를 등록합니다.

```bash
codex plugin marketplace add <source>          # 마켓플레이스 등록
codex plugin marketplace list                  # 등록된 마켓플레이스 확인
codex plugin add <plugin>@<marketplace>        # 플러그인 설치
```

`<source>`에는 GitHub 저장소(`owner/repo`)나 로컬 폴더 경로를 그대로 넣을 수 있습니다.

### (Claude Code)(사외) marketplace 추가하기

회사 네트워크 정책이 걸리지 않는 환경(개인 PC 등)이라면 공식 문서 그대로 씁니다.

```bash
/plugin marketplace add anthropics/claude-plugins-official
```

`owner/repo` 형태의 GitHub 축약형뿐 아니라, `https://` 로 시작하는 git URL도 그대로 받습니다.

### (Claude Code)(사내) git 폴더를 직접 받아 추가하기

사내에서는 `/plugin marketplace add`가 소스 종류와 무관하게 막힙니다. 사내 git 서버(GitHub Enterprise) 주소를 넣어도 마찬가지로 막힙니다.

실제로 되는 방법은 마켓플레이스·플러그인 시스템을 아예 거치지 않는 것입니다. 저장소를 그냥 내려받아, 그 안의 skill·hook·rule·subagent 폴더를 프로젝트의 `.claude/` 아래 대응하는 폴더로 직접 복사합니다.

```bash
# 사내
git clone https://github.com/<GITHUB_OWNER>/<REPOSITORY>.git <내 PC 에 저장할 경로>

# 사외
git clone https://github.com/<GITHUB_OWNER>/<REPOSITORY>.git <내 PC 에 저장할 경로>
```

폴더를 하나씩 손으로 옮기는 대신, 아래 프롬프트를 Claude Code에 그대로 주면 폴더 구조를 살펴 알맞은 위치로 옮기고 훅이 있으면 `.claude/settings.json` 등록까지 한 번에 해 줍니다.

```text
<내 PC 에 저장할 경로> 에 있는 플러그인 저장소를 이 프로젝트에 직접 설치해줘.

1. 그 폴더 안에서 skills/, agents/, hooks/, rules/ 디렉터리를 찾아.
2. skills/ 아래 각 스킬 폴더는 이 프로젝트의 .claude/skills/ 로, agents/ 아래 각 .md 파일은
   .claude/agents/ 로, rules/ 아래 각 .md 파일은 .claude/rules/ 로 그대로 복사해.
3. hooks/ 안에 스크립트가 있으면 .claude/hooks/ 로 복사하고, 그 훅이 어떤 이벤트
   (PreToolUse 등)와 matcher 에 걸리는지 원본 설정(plugin.json 이나 README)에서 찾아서
   .claude/settings.json 의 hooks 섹션에 추가해줘. 이미 있는 설정은 지우지 말고 이어 붙여.
4. 마지막에 뭘 어디로 옮겼는지 표로 정리해서 보여줘.
```
