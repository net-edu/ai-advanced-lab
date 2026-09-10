# 최종 검수본 (수정 잠금)

아래 목록 중 **주석이 벗겨진** 줄이 사용자 최종 검수본입니다. 에이전트는 그 파일을 수정·삭제하지 않습니다.

`.claude/hooks/block-finalized.py`(PreToolUse 훅)가 잠긴 경로의 Edit/Write 를 실제로 차단합니다.

사용자가 편집기로 직접 고치는 것은 막지 않습니다.

## 규칙

- 아래는 `content/toc.yml` 의 모든 문서이며, 기본은 주석 처리되어 **잠기지 않습니다.**

- 어떤 문서를 잠그려면 그 줄의 주석 기호를 벗겨 `- 경로` 형태로 둡니다.

- 잠긴 문서를 다시 열려면 그 줄을 다시 주석 처리(또는 삭제)합니다.

- 목록은 `content/toc.yml` 과 동기화됩니다. toc 가 바뀌면 문서가 추가/삭제되고, 이미 잠가 둔 줄은 유지됩니다.

- 빌드된 사이트 메뉴에도 반영됩니다 - 잠기지 않은 문서는 제목 앞에 `(WIP) ` 가 붙습니다(`tools/pipeline.py`). 잠그면 다음 빌드부터 사라집니다.

## 잠긴 파일

<!-- 이 목록은 content/toc.yml 과 동기화됩니다(.claude/hooks/sync-finalized.py). -->
<!-- 각 줄은 기본으로 주석 처리되어 잠기지 않습니다. 특정 문서를 잠그려면 그 줄의 주석 기호를 벗기세요. -->
<!-- 동기화해도 이미 잠가 둔(주석을 벗긴) 줄은 그대로 유지됩니다. -->

- content/index.md
- content/course/instructor.md
- content/course/orientation.md
- content/warmup/index.md
- content/warmup/terminal-basics.md
- content/warmup/git-basics.md
- content/warmup/github-basics.md
- content/warmup/markdown.md
- content/warmup/claude-code-start.md
- content/concepts/what-is-harness.md
- content/claude-code/turn-concept.md
- content/concepts/what-is-context.md
- content/claude-code/claude-md-placement.md
- content/concepts/memory-md.md
- content/concepts/what-is-skill.md
- content/concepts/what-is-rule.md
- content/concepts/what-is-hook.md
- content/claude-code/permissions-and-commands.md
- content/concepts/what-is-subagent.md
- content/concepts/what-is-agent-teams.md
- content/mcp/what-is-mcp.md
- content/concepts/marketplace.md
- content/concepts/plugin-creation.md
- content/concepts/context-engineering.md
- content/concepts/harness-engineering.md
- content/concepts/loop-engineering.md
- content/claude-code/terminal-features.md
- content/claude-code/session-lifecycle.md
- content/course/index.md
- content/course/problem-definition.md
- content/course/download-course-material.md
- content/course/stage1-prompt-only.md
- content/course/stage2-context-attach.md
- content/course/stage3-harness.md
- content/course/stage4-loop.md
- content/course/stage5-oracle.md
<!-- - content/course/stage6-mcp.md -->
- content/course/stage7-plugin.md
- content/course/stage8-knowledge.md
- content/course/personal-project.md
- content/reference/token-saving.md
- content/reference/loop-engineering.md
- content/reference/ai-sdlc.md
- content/curriculum/index.md
