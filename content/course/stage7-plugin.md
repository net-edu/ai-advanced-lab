# stage7

<p class="ailab-title-subtitle">- 플러그인으로 배포하기</p>

stage3–6에서 만든 하나의 loop(리포트 skill + 리뷰어 subagent + Stop hook)를 한 프로젝트의 `.claude/` 안에만 두지 않고, 재사용·배포 가능한 **플러그인**으로 뽑아냅니다.

이 실습을 끝내면 `.claude/` 가 없는 프로젝트에서도 플러그인만으로 같은 loop가 도는 것을 확인합니다.

본 섹션에서 다음 질문에 대한 답을 합니다.

- **한 번 잘 만든 loop를 다른 프로젝트에서도, 팀원도 그대로 쓰게 하려면?**

## 배경 - 플러그인 = 로직 / 프로젝트 = 데이터

재사용하려면 loop의 실행 로직(skill·subagent·hook·스크립트)과 대상별 데이터(재무·리포트·기준)를 갈라야 합니다.

이 경계가 곧 플러그인 경계입니다.

그래서 플러그인의 `validate_fair_value.py`는 데이터를 스크립트 옆이 아니라 `CLAUDE_PROJECT_DIR`(설치된 프로젝트)에서 읽습니다.

stage3–6에서는 `../data/`였습니다 - 직접 비교해 보세요.

plugin화는 파일 복사가 아닙니다.

① 로직/데이터 분리

② 배포 경로 확보

③ 도구별 강제 메커니즘에 loop를 다시 얹기

이 세 가지입니다.

## 실습 단계

### 1. 플러그인을 붙이세요

**개발자 모드(권장, 마켓플레이스 불필요):** `example-project/`에서 아래처럼 플러그인 폴더를 직접 지정해 켭니다.

```bash
claude --plugin-dir ../stage7-plugin/fair-value-plugin
```

플러그인 파일을 고쳤으면 세션 안에서 `/reload-plugins`로 다시 읽습니다.

**마켓플레이스 방식(사내망에서 허용될 때):** 로컬 마켓플레이스를 등록하고 설치합니다.

```bash
/plugin marketplace add ./stage7-plugin/marketplace
/plugin install fair-value@fair-value-local
/plugin list
```

### 2. 데이터만 있는 프로젝트에서 리포트를 만드세요

`example-project/`에는 `.claude/`가 없습니다 - skill·subagent·hook이 전부 플러그인에서 옵니다.

이 폴더에서 아래를 실행하세요.

```
/fair-value:report NVIDIA
```

- Claude가 `reports/fair-value.md` 에 리포트를 씁니다.

- `fair-value-reviewer` subagent가 정성 채점을 합니다.

- Claude가 응답을 마치면 **플러그인 Stop hook**이 `validate_fair_value.py`를 자동 실행합니다.

- 실패(`exit 2`)하면 사유를 반영해 다시 고칩니다 - stage4–6에서 보던 loop가 플러그인만으로 똑같이 돕니다.

### 3. 로직/데이터 분리를 검증하세요

`example-project/` 의 `data/financials.json` 을 지우고 다시 돌려 보세요.

hook이 "프로젝트에 data가 있어야 한다"며 실패합니다.

이 실패로 **데이터는 프로젝트 책임**이라는 경계를 확인합니다.

### 4. (선택) Codex 버전과 비교하세요

같은 경계(플러그인=로직, 프로젝트=데이터)를 Codex의 플러그인 시스템으로 다시 얹은 버전이 `codex-plugin/` 에 있습니다.

표준 hook이 없던 시절의 방식(AGENTS.md 지시 + 에이전트 순응)은 `codex-package/` 에 남겨 두었습니다.

두 폴더의 `README.md` 를 나란히 보면 "강제 장치가 있을 때"와 "지시문에 기대야 할 때"의 차이가 드러납니다.

정확한 CLI 명령은 설치된 Codex 버전에서 `codex plugin --help` 로 확인하세요.

### 확인 방법

- `/context` 에 플러그인 skill(`fair-value:report`)·subagent가 잡힙니다.

- `example-project/` 엔 `.claude/` 도 `scripts/` 도 없는데 hook이 돕니다. 로직이 프로젝트 밖(플러그인)에서 주입됐다는 증거입니다.

- `data/financials.json` 을 지우면 hook이 데이터 부재로 실패합니다. 데이터는 프로젝트 책임임을 확인합니다.

## 실행 예시 - 실제 세션 로그

아래는 이 단계의 프롬프트를 그대로 실행한 실제 Claude Code 세션 기록입니다. 자신의 실행 결과와 견줘 보세요.

<details class="ailab-terminal">
<summary>실행 로그 펼치기 - stage7-plugin</summary>

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
<span class="t-accent">│</span>                 ~/…/stage7-plugin                  <span class="t-accent">│</span> <span class="t-status">/release-notes for more</span> <span class="t-accent">│</span>
<span class="t-accent">╰──────────────────────────────────────────────────────────────────────────────╯</span>


<span class="t-user">❯ /plugin marketplace add ./stage7-plugin/marketplace</span>
<span class="t-error">  ⎿  Error: Marketplace source 'dir:/home/youk/Shared/windows-share/llm-wiki/raw</span>
<span class="t-error">     /pbl-examples/market-analysis-valuation-nvidia-plain/stage7-plugin' is</span>
<span class="t-error">     blocked by enterprise policy. No external marketplaces are allowed.</span></pre>
</div>

</details>

## Stage 7 의 결론

**🎯 팀 표준으로 배포**

`.claude/` 에 갇혀 있던 loop를 로직/데이터로 갈라 플러그인으로 뽑아, 데이터만 있는 프로젝트에도 얹었습니다.

이제 이런 리포트가 대량 생산되기 시작하면 또 다른 지식 홍수가 됩니다.

이를 체계적으로 쌓아 재사용하는 자산화가 다음 [stage8](stage8-knowledge.md) 입니다.

## 참고

### 실패했을 때

- **`/plugin marketplace add` 가 "No external marketplaces are allowed"로 막히면** 사내 Enterprise 정책 때문입니다. 1단계의 개발자 모드(`claude --plugin-dir`)로 진행하세요.

- **hook이 안 돌면** `--plugin-dir` 경로가 `fair-value-plugin/`(로직 폴더)을 정확히 가리키는지 확인하고, 파일을 고쳤다면 `/reload-plugins` 를 실행하세요.
