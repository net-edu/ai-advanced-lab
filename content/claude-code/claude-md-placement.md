# CLAUDE.md 추가 시점·배치 위치

CLAUDE.md는 아무 내용이나 작성해 놓는 곳이 아닙니다.

AI 로 하여금 어떤 사실을 **언제** 새로 적을지, 그리고 그것을 **어느 레벨**(프로젝트·유저·조직)에 둘지를 판단하는 기준이 들어 있습니다.

이 문서는 Anthropic 공식 문서를 토대로 그 기준을  정리합니다.

> CLAUDE.md가 실제로 언제 읽히고 컨텍스트 비용이 어떻게 드는지 같은 로딩 방식은 [Context Engineering](../concepts/context-engineering.md)에서 다룹니다.

## 언제 추가하는가

CLAUDE.md는 **Claude에게 다시 설명해야 하는 내용을 적어 두는 장소** 입니다.

다음 상황이 오면 한 줄 추가할 때입니다.

- Claude가 같은 실수를 두 번째로 할 때
- 코드 리뷰에서 Claude가 이 코드베이스에 대해 알아야 할 것을 발견했을 때
- 지난 세션에 입력한 것과 같은 수정·설명을 채팅에 또 입력할 때
- 새 팀원이 생산성을 높이는 데 같은 컨텍스트가 필요할 때

!!! important
    공통점은 **반복**입니다. 같은 설명을 두 번 하고 있다면, 그것은 매 세션 Claude가 갖고 있어야 할 사실일 가능성이 높습니다.

## 무엇을 넣고 무엇을 빼는가

기준은 하나입니다

**매번 봐야 하는 것만 `CLAUDE.md`에 넣습니다.**

CLAUDE.md는 세션을 시작할 때마다 Claude가 자동으로 읽는 파일입니다.

책상에 늘 붙여 두는 안내문과 같아서, 여기 적은 내용은 무슨 작업을 하든 항상 눈앞에 있습니다.

그래서 **항상 필요한 것**과 **가끔만 필요한 것**을 반드시 구분해야 합니다.

### ✅ 넣을 것 - 늘 필요한 것

작업 종류와 상관없이 언제나 지켜야 하는, 짧은 사실과 규칙입니다.

- 이 프로젝트가 무엇을 하는 곳인지 한두 줄 설명
- 항상 지켜야 할 규칙 (예: "금액은 원 단위로 통일", "날짜는 `YYYY-MM-DD` 로")
- 자주 쓰는 명령 한두 개
- "이것만은 절대 하지 마라" 같은 금지 사항

### ❌ 빼낼 것 - 가끔만 필요한 것

늘 필요하지는 않은 내용을 CLAUDE.md에 넣으면, 정작 필요 없는 순간에도 계속 자리를 차지합니다.

이런 것은 CLAUDE.md에 두지 말고, 필요할 때만 불려 오는 다른 곳으로 옮깁니다.

| 이런 내용은 | 이곳으로 옮깁니다 | 그러면 |
|---|---|---|
| 여러 단계로 된 작업 순서 (예: 보고서 작성 절차) | skill | 그 작업을 할 때만 불려 옵니다 |
| 특정 폴더·파일에서만 쓰는 규칙 | 경로 범위 규칙(`.claude/rules/`) | 그 파일을 열 때만 켜집니다 |

!!! tip "헷갈릴 때"
    이렇게 자문해보세요.

    **"이 지침을 모든 Turn 에서 봐야 하나?"** 그렇지 않다면 CLAUDE.md 에 들어가면 안됩니다.

## CLAUDE.md 파일은 어디에 만들어야 하는가? - 4단계 계층

![claude-md-placement-scope](../media/claude_code/claude-md-placement-scope.png)

`CLAUDE.md` 파일은 적용되는 범위에 따라 다음과 같이 4 곳에 배치할 수 있습니다.

아래 표는 **로드되는 순서**(광범위 → 구체적)대로 나열한 것입니다.

| 범위 | 위치 | 공유 대상 |
|---|---|---|
| 조직 관리 정책 | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md` <br/> Linux/WSL `/etc/claude-code/CLAUDE.md` <br/> Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | 조직의 모든 사용자 |
| 사용자 지침 | `~/.claude/CLAUDE.md` | 본인만(모든 프로젝트) |
| 프로젝트 지침 | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` | 팀(소스 제어) |
| 로컬 지침 | `./CLAUDE.local.md` | 본인만(현재 프로젝트), `.gitignore` 권장 |

파일을 배치시키는 기준은 이 `CLAUDE.md` 파일이 **누구에게 적용되어야 하는가**입니다.

- 나 혼자 모든 프로젝트에서 쓰는 습관·선호 → 사용자 지침(`~/.claude/CLAUDE.md`).
- 팀이 공유해야 하는 프로젝트 규칙 → 프로젝트 지침. 소스 제어에 커밋합니다.
- 커밋하고 싶지 않은 나만의 프로젝트 메모 → 로컬 지침(`./CLAUDE.local.md`).
- 조직 전체에 강제할 정책 → 관리 정책.

### 로드 순서가 곧 우선순위입니다

![claude-md-load-order](../media/claude_code/claude-md-load-order.png)

핵심은 "프로젝트 지침이 사용자 지침 **이후에** 컨텍스트에 나타난다"는 점입니다.

뒤에(더 구체적인 위치에) 오는 지침이 우선합니다.

만약에
- 유저 레벨에서(`~/.claude/CLAUDE.md`) "영어로 답하라"고 하고
- 프로젝트 레벨에서(`./CLAUDE.md` 또는 `./.claude/CLAUDE.md`) "한국어로 답하라"고 하면

결과적으로 프로젝트 쪽의 지침을 따르게 됩니다.

다만 관리 정책은 예외적으로 항상 최우선으로 적용됩니다.

## (심화) 파일을 나눠 쓸 때 - `@` import

!!! note "지금은 건너뛰어도 됩니다"
    CLAUDE.md 하나가 너무 길어졌을 때 쓰는 기능입니다. 처음에는 몰라도 됩니다.

CLAUDE.md가 길어지면 내용을 여러 파일로 쪼갠 뒤, `@파일경로` 한 줄로 그 파일을 끌어올 수 있습니다.

"이 자리에 저 파일 내용을 그대로 넣어라"라는 표시입니다.

<details class="ailab-code" markdown="1">
<summary>코드 예시 펼치기 - CLAUDE.md import 예시</summary>

<div class="ailab-code-window">
<div class="ailab-code-titlebar">
<span class="ailab-code-dots"><span></span><span></span><span></span></span>
<span class="ailab-code-filename">CLAUDE.md</span>
</div>

```markdown
# 우리 팀 규칙
@./rules/coding.md
@./rules/review.md
```

</div>
</details>

알아 둘 점 몇 가지입니다.

- **경로 기준**  : `@` 뒤 경로는, 명령을 실행한 폴더가 아니라 **그 구문을 적은 파일**이 있는 위치를 기준으로 찾습니다.
- **꼬리물기 한계** : 끌어온 파일이 또 다른 파일을 `@`로 끌어올 수 있는데, 최대 4단계까지만 이어집니다.
- **코드 안의 `@`는 무시** : 백틱이나 코드블록 안에 쓴 `@`는 import가 아니라 그냥 글자로 남습니다.
- **저장소 밖 파일** : 프로젝트 폴더 바깥의 파일을 처음 끌어오면, 안전을 위해 승인 창이 한 번 뜹니다.

## (심화) 경로 범위 규칙 - `.claude/rules/`

!!! note "큰 프로젝트에서 쓰는 기능입니다"
    코드베이스가 커져서 "여기에서만 통하는 규칙"이 생겼을 때 필요합니다. 작은 프로젝트라면 CLAUDE.md 하나로 충분합니다.

프로젝트 전체가 아니라 **일부에서만** 중요한 규칙이 있습니다.

예를 들어 테스트 파일에만 해당하는 규칙을 CLAUDE.md에 넣으면, 테스트와 무관한 작업을 할 때도 그 규칙이 계속 따라다닙니다.

이런 규칙은 CLAUDE.md 대신 `.claude/rules/` 폴더에 주제별 파일로 따로 둡니다(예: `code-style.md`, `testing.md`). 그러면 켜지는 방식에 따라 두 가지로 나뉩니다.

| 종류 | 언제 켜지나 | 쓰임 |
|---|---|---|
| **항상 켜짐** (`paths` 없음) | 세션 시작 시 늘 로드 | CLAUDE.md를 여러 파일로 쪼갠 것과 같음 |
| **조건부** (`paths` 있음) | 정해 둔 폴더·파일을 열 때만 로드 | 특정 경로에서만 쓰는 규칙 |

**조건부 규칙**이 핵심입니다.

파일 맨 위에 어떤 파일에 적용할지 패턴을 적어 두면, 그 파일을 다룰 때만 규칙이 켜집니다.

<details class="ailab-code" markdown="1">
<summary>코드 예시 펼치기 - 조건부 규칙 예시</summary>

<div class="ailab-code-window">
<div class="ailab-code-titlebar">
<span class="ailab-code-dots"><span></span><span></span><span></span></span>
<span class="ailab-code-filename">.claude/rules/typescript.md</span>
</div>

```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
---
# TypeScript 규칙
- 여기에 규칙을 적습니다
```

</div>
</details>

위 규칙은 `src` 아래 TypeScript 파일을 열 때만 로드되고, 그 외 작업에서는 컨텍스트를 차지하지 않습니다. 경로는 glob 패턴으로 적고, `{ts,tsx}`처럼 중괄호로 여러 확장자를 묶을 수 있습니다.

몇 가지 더 알아 둘 점입니다.

- **모든 프로젝트에 적용** : `~/.claude/rules/`에 두면 내 컴퓨터의 모든 프로젝트에서 켜집니다. 단, 지침이 서로 충돌하면 프로젝트 규칙(`.claude/rules/`)이 더 우선합니다(앞의 "나중에 오는 게 우선"과 같은 원리).
- **여러 프로젝트가 공유** : `.claude/rules/`는 심볼릭 링크를 지원해, 공용 규칙 한 벌을 여러 프로젝트가 링크로 나눠 쓸 수 있습니다.
- **작업 절차는 rules 말고 skill로** : "이럴 때 이렇게 해라" 같은 여러 단계짜리 절차는 rules가 아니라 skill이 맞습니다. skill은 필요할 때만 불려 옵니다.
