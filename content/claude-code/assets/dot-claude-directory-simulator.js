const { useState, useEffect, useMemo, useRef } = React;
const ClaudeExplorer = () => {
  const A = useMemo(() => ({
    href,
    children
  }) => /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: 'var(--ce-accent)',
      textDecoration: 'none',
      borderBottom: '1px dotted var(--ce-accent)'
    }
  }, children), []);
  const C = useMemo(() => ({
    children
  }) => /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--ce-mono)',
      fontSize: '0.92em',
      padding: '1px 4px',
      borderRadius: '3px',
      background: 'var(--ce-surface)',
      border: '0.5px solid var(--ce-border-subtle)'
    }
  }, children), []);
  const commandsNote = useMemo(() => /*#__PURE__*/React.createElement(React.Fragment, null, "Commands and skills are now the same mechanism. For new workflows, use ", /*#__PURE__*/React.createElement(A, {
    href: "/docs/en/skills"
  }, "skills/"), " instead: same ", /*#__PURE__*/React.createElement(C, null, "/name"), " invocation, plus you can bundle supporting files."), []);
  const FILE_TREE = useMemo(() => ({
    project: {
      label: 'your-project/',
      children: [{
        id: 'claude-md',
        label: 'CLAUDE.md',
        type: 'file',
        icon: 'md',
        color: '#6A9BCC',
        badge: 'committed',
        oneLiner: 'Project instructions Claude reads every session',
        when: 'Loaded into context at the start of every session',
        description: 'Project-specific instructions that shape how Claude works in this repository. Put your conventions, common commands, and architectural context here so Claude operates with the same assumptions your team does.',
        tips: ['Target under 200 lines. Longer files still load in full but may reduce adherence', /*#__PURE__*/React.createElement(React.Fragment, null, "CLAUDE.md loads into every session. If something only matters for specific tasks, move it to a ", /*#__PURE__*/React.createElement(A, {
          href: "/docs/en/skills"
        }, "skill"), " or a path-scoped ", /*#__PURE__*/React.createElement(A, {
          href: "/docs/en/memory#organize-rules-with-claude/rules/"
        }, "rule"), " so it loads only when needed"), 'List the commands you run most, like build, test, and format, so Claude knows them without you spelling them out each time', /*#__PURE__*/React.createElement(React.Fragment, null, "Run ", /*#__PURE__*/React.createElement(C, null, "/memory"), " to open and edit CLAUDE.md from within a session"), /*#__PURE__*/React.createElement(React.Fragment, null, "Also works at ", /*#__PURE__*/React.createElement(C, null, ".claude/CLAUDE.md"), " if you prefer to keep the project root clean")],
        exampleIntro: 'This example is for a TypeScript and React project. It lists the build and test commands, the framework conventions Claude should follow, and project-specific rules like export style and file layout.',
        example: `# Project conventions

## Commands
- Build: \`npm run build\`
- Test: \`npm test\`
- Lint: \`npm run lint\`

## Stack
- TypeScript with strict mode
- React 19, functional components only

## Rules
- Named exports, never default exports
- Tests live next to source: \`foo.ts\` -> \`foo.test.ts\`
- All API routes return \`{ data, error }\` shape`,
        docsLink: '/en/memory'
      }, {
        id: 'mcp-json',
        label: '.mcp.json',
        type: 'file',
        icon: 'json',
        color: '#9B7BC4',
        badge: 'committed',
        oneLiner: 'Project-scoped MCP servers, shared with your team',
        when: /*#__PURE__*/React.createElement(React.Fragment, null, "Servers connect when the session begins. Tool schemas are deferred by default and load on demand via ", /*#__PURE__*/React.createElement(A, {
          href: "/docs/en/mcp#scale-with-mcp-tool-search"
        }, "tool search")),
        description: /*#__PURE__*/React.createElement(React.Fragment, null, "Configures Model Context Protocol (MCP) servers that give Claude access to external tools: databases, APIs, browsers, and more. This file holds the project-scoped servers your whole team uses. Personal servers you want to keep to yourself go in ", /*#__PURE__*/React.createElement(C, null, "~/.claude.json"), " instead."),
        tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Use environment variable references for secrets: ", /*#__PURE__*/React.createElement(C, null, '${NOTION_TOKEN}')), /*#__PURE__*/React.createElement(React.Fragment, null, "Lives at the project root, not inside ", /*#__PURE__*/React.createElement(C, null, ".claude/")), /*#__PURE__*/React.createElement(React.Fragment, null, "For servers only you need, run ", /*#__PURE__*/React.createElement(C, null, "claude mcp add --scope user"), ". This writes to ", /*#__PURE__*/React.createElement(C, null, "~/.claude.json"), " instead of ", /*#__PURE__*/React.createElement(C, null, ".mcp.json"))],
        exampleIntro: /*#__PURE__*/React.createElement(React.Fragment, null, "This example configures the Notion MCP server so Claude can read and update pages in your workspace. The", /*#__PURE__*/React.createElement(C, null, '${NOTION_TOKEN}'), " reference is read from your shell environment when Claude Code starts the server, so the token never lands in the file."),
        example: `{
"mcpServers": {
"notion": {
"command": "npx",
"args": ["-y", "@notionhq/notion-mcp-server"],
"env": {
"NOTION_TOKEN": "\${NOTION_TOKEN}"
}
}
}
}`,
        docsLink: '/en/mcp'
      }, {
        id: 'worktreeinclude',
        label: '.worktreeinclude',
        type: 'file',
        icon: 'md',
        color: '#8FA876',
        badge: 'committed',
        oneLiner: 'Gitignored files to copy into new worktrees',
        when: /*#__PURE__*/React.createElement(React.Fragment, null, "Read when Claude creates a git worktree via ", /*#__PURE__*/React.createElement(C, null, "--worktree"), ", the ", /*#__PURE__*/React.createElement(C, null, "EnterWorktree"), " tool, or subagent ", /*#__PURE__*/React.createElement(C, null, "isolation: worktree")),
        description: /*#__PURE__*/React.createElement(React.Fragment, null, "Lists gitignored files to copy from your main repository into each new worktree. Worktrees are fresh checkouts, so untracked files like ", /*#__PURE__*/React.createElement(C, null, ".env"), " are missing by default. Patterns here use ", /*#__PURE__*/React.createElement(C, null, ".gitignore"), " syntax. Only files that match a pattern and are also gitignored get copied, so tracked files are never duplicated."),
        tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Lives at the project root, not inside ", /*#__PURE__*/React.createElement(C, null, ".claude/")), /*#__PURE__*/React.createElement(React.Fragment, null, "Git-only: if you configure a ", /*#__PURE__*/React.createElement(A, {
          href: "/docs/en/hooks#worktreecreate"
        }, "WorktreeCreate hook"), " for a different VCS, this file is not read. Copy files inside your hook script instead"), /*#__PURE__*/React.createElement(React.Fragment, null, "Also applies to parallel sessions in the ", /*#__PURE__*/React.createElement(A, {
          href: "/docs/en/desktop#work-in-parallel-with-sessions"
        }, "desktop app"))],
        exampleIntro: 'This example copies your local environment files and a secrets config into every worktree Claude creates. Comments start with # and blank lines are ignored, same as .gitignore.',
        example: `# Local environment
.env
.env.local

# API credentials
config/secrets.json`,
        docsLink: '/en/worktrees#copy-gitignored-files-into-worktrees'
      }, {
        id: 'dot-claude',
        label: '.claude/',
        type: 'folder',
        icon: 'folder',
        color: 'var(--ce-accent)',
        oneLiner: 'Project-level configuration, rules, and extensions',
        description: 'Everything Claude Code reads that is specific to this project. If you use git, commit most files here so your team shares them; a few, like settings.local.json, are gitignored when Claude Code saves settings to them. Each file badge shows which.',
        children: [{
          id: 'settings-json',
          label: 'settings.json',
          type: 'file',
          icon: 'json',
          color: 'var(--ce-text-3)',
          badge: 'committed',
          oneLiner: 'Permissions, hooks, and configuration',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Overrides global ", /*#__PURE__*/React.createElement(C, null, "~/.claude/settings.json"), ". Local settings, CLI flags, and managed settings override this"),
          description: 'Settings that Claude Code applies directly. Permissions control which commands and tools Claude can use; hooks run your scripts at specific points in a session. Unlike CLAUDE.md, which Claude reads as guidance, these are enforced whether Claude follows them or not.',
          contains: [/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/permissions"
          }, "permissions"), ": allow, deny, or prompt before Claude uses specific tools or commands"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/hooks"
          }, "hooks"), ": run your own scripts on events like before a tool call or after a file edit"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/statusline"
          }, "statusLine"), ": customize the line shown at the bottom while Claude works"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/settings-reference#available-settings"
          }, "model"), ": pick a default model for this project"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/settings-reference#environment-variables"
          }, "env"), ": environment variables set in every session"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/output-styles"
          }, "outputStyle"), ": select a custom system-prompt style from output-styles/")],
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Bash permission patterns support wildcards: ", /*#__PURE__*/React.createElement(C, null, "Bash(npm test *)"), " matches any command starting with ", /*#__PURE__*/React.createElement(C, null, "npm test")), /*#__PURE__*/React.createElement(React.Fragment, null, "Array settings like ", /*#__PURE__*/React.createElement(C, null, "permissions.allow"), " combine across all scopes; scalar settings like ", /*#__PURE__*/React.createElement(C, null, "model"), " use the most specific value")],
          exampleIntro: /*#__PURE__*/React.createElement(React.Fragment, null, "This example allows ", /*#__PURE__*/React.createElement(C, null, "npm test"), " and ", /*#__PURE__*/React.createElement(C, null, "npm run"), " commands without prompting, blocks ", /*#__PURE__*/React.createElement(C, null, "rm -rf"), ", and runs Prettier on files after Claude edits or writes them."),
          example: `{
"permissions": {
"allow": [
"Bash(npm test *)",
"Bash(npm run *)"
],
"deny": [
"Bash(rm -rf *)"
]
},
"hooks": {
"PostToolUse": [{
"matcher": "Edit|Write",
"hooks": [{
"type": "command",
"command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
}]
}]
}
}`,
          docsLink: '/en/settings'
        }, {
          id: 'settings-local-json',
          label: 'settings.local.json',
          type: 'file',
          icon: 'json',
          color: 'var(--ce-text-3)',
          badge: 'gitignored',
          oneLiner: 'Your personal settings overrides for this project',
          when: 'Highest of the user-editable settings files; CLI flags and managed settings still take precedence',
          description: 'Personal settings that take precedence over the project defaults. Same JSON format as settings.json, gitignored when Claude Code saves a setting to it. Use this when you need different permissions or defaults than the team config.',
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Same schema as settings.json. Array settings like ", /*#__PURE__*/React.createElement(C, null, "permissions.allow"), " combine across scopes; scalar settings like ", /*#__PURE__*/React.createElement(C, null, "model"), " use the local value"), /*#__PURE__*/React.createElement(React.Fragment, null, "When Claude Code saves a setting to this file in a repository that doesn’t already ignore it, it adds ", /*#__PURE__*/React.createElement(C, null, "**/.claude/settings.local.json"), " to your global git excludes file: ", /*#__PURE__*/React.createElement(C, null, "core.excludesFile"), " from your global git config when it’s set to an absolute or ", /*#__PURE__*/React.createElement(C, null, "~"), "-prefixed path, otherwise", /*#__PURE__*/React.createElement(C, null, "$XDG_CONFIG_HOME/git/ignore"), ", or ", /*#__PURE__*/React.createElement(C, null, "~/.config/git/ignore"), ". To share the ignore rule with your team, also add it to the project ", /*#__PURE__*/React.createElement(C, null, ".gitignore"))],
          exampleIntro: 'This example adds Docker permissions on top of whatever the team settings.json allows.',
          example: `{
"permissions": {
"allow": [
"Bash(docker *)"
]
}
}`,
          docsLink: '/en/settings'
        }, {
          id: 'rules',
          label: 'rules/',
          type: 'folder',
          icon: 'folder',
          color: '#9B7BC4',
          oneLiner: 'Topic-scoped instructions, optionally gated by file paths',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Rules without ", /*#__PURE__*/React.createElement(C, null, "paths:"), " load at session start. Rules with ", /*#__PURE__*/React.createElement(C, null, "paths:"), " load when a matching file enters context"),
          description: [/*#__PURE__*/React.createElement(React.Fragment, null, "Project instructions split into topic files that can load conditionally based on file paths. A rule without ", /*#__PURE__*/React.createElement(C, null, "paths:"), " frontmatter loads at session start like CLAUDE.md; a rule with ", /*#__PURE__*/React.createElement(C, null, "paths:"), " loads only when Claude reads a matching file."), /*#__PURE__*/React.createElement(React.Fragment, null, "Like CLAUDE.md, rules are guidance Claude reads, not configuration Claude Code enforces. For guaranteed behavior use ", /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/hooks"
          }, "hooks"), " or ", /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/permissions"
          }, "permissions"), ".")],
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Use ", /*#__PURE__*/React.createElement(C, null, "paths:"), " frontmatter with globs to scope rules to directories or file types"), /*#__PURE__*/React.createElement(React.Fragment, null, "Subdirectories work:", /*#__PURE__*/React.createElement(C, null, ".claude/rules/frontend/react.md"), " is discovered automatically"), 'When CLAUDE.md approaches 200 lines, start splitting into rules'],
          docsLink: '/en/memory#organize-rules-with-claude/rules/',
          children: [{
            id: 'rule-testing',
            label: 'testing.md',
            type: 'file',
            icon: 'md',
            color: '#9B7BC4',
            badge: 'committed',
            oneLiner: 'Test conventions scoped to test files',
            when: /*#__PURE__*/React.createElement(React.Fragment, null, "Loaded when Claude reads a file matching the ", /*#__PURE__*/React.createElement(C, null, "paths:"), " globs below"),
            description: /*#__PURE__*/React.createElement(React.Fragment, null, "An example rule that only loads when Claude is working on test files. The ", /*#__PURE__*/React.createElement(C, null, "paths:"), " globs in the frontmatter define which files trigger it; here, anything ending in .test.ts or .test.tsx. For other files, this rule is not loaded into context."),
            example: `---
paths:
- "**/*.test.ts"
- "**/*.test.tsx"
---

# Testing Rules

- Use descriptive test names: "should [expected] when [condition]"
- Mock external dependencies, not internal modules
- Clean up side effects in afterEach`
          }, {
            id: 'rule-api',
            label: 'api-design.md',
            type: 'file',
            icon: 'md',
            color: '#9B7BC4',
            badge: 'committed',
            oneLiner: 'API conventions scoped to backend code',
            when: /*#__PURE__*/React.createElement(React.Fragment, null, "Loaded when Claude reads a file matching the ", /*#__PURE__*/React.createElement(C, null, "paths:"), " glob below"),
            description: /*#__PURE__*/React.createElement(React.Fragment, null, "A second example showing a rule scoped to backend code. The ", /*#__PURE__*/React.createElement(C, null, "paths:"), " glob matches files under src/api/, so these conventions load only when Claude is editing API routes."),
            example: `---
paths:
- "src/api/**/*.ts"
---

# API Design Rules

- All endpoints must validate input with Zod schemas
- Return shape: { data: T } | { error: string }
- Rate limit all public endpoints`
          }]
        }, {
          id: 'skills',
          label: 'skills/',
          type: 'folder',
          icon: 'folder',
          color: '#D4A843',
          oneLiner: 'Reusable prompts you or Claude invoke by name',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Invoked with ", /*#__PURE__*/React.createElement(C, null, "/skill-name"), " or when Claude matches the task to a skill"),
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Each skill is a folder with a SKILL.md file plus any supporting files it needs. By default, both you and Claude can invoke a skill. Use frontmatter to control that: ", /*#__PURE__*/React.createElement(C, null, "disable-model-invocation: true"), " for user-only workflows like ", /*#__PURE__*/React.createElement(C, null, "/deploy"), ", or ", /*#__PURE__*/React.createElement(C, null, "user-invocable: false"), " to hide from the ", /*#__PURE__*/React.createElement(C, null, "/"), " menu while Claude can still invoke it."),
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Skills accept arguments: ", /*#__PURE__*/React.createElement(C, null, "/deploy staging"), " passes \"staging\" as ", /*#__PURE__*/React.createElement(C, null, "$ARGUMENTS"), ". Use ", /*#__PURE__*/React.createElement(C, null, "$0"), ", ", /*#__PURE__*/React.createElement(C, null, "$1"), ", and so on for positional access"), /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement(C, null, "description"), " frontmatter determines when Claude auto-invokes the skill"), 'Bundle reference docs alongside SKILL.md. Claude knows the skill directory path and can read supporting files when you mention them'],
          docsLink: '/en/skills',
          children: [{
            id: 'skill-review',
            label: 'security-review/',
            type: 'folder',
            icon: 'folder',
            color: '#D4A843',
            oneLiner: 'A skill bundling SKILL.md with supporting files',
            children: [{
              id: 'skill-review-md',
              label: 'SKILL.md',
              type: 'file',
              icon: 'md',
              color: '#D4A843',
              badge: 'committed',
              oneLiner: 'Entrypoint: trigger, invocability, instructions',
              when: /*#__PURE__*/React.createElement(React.Fragment, null, "User types ", /*#__PURE__*/React.createElement(C, null, "/security-review <target>"), "; Claude cannot auto-invoke this skill"),
              description: [/*#__PURE__*/React.createElement(React.Fragment, null, "This skill uses ", /*#__PURE__*/React.createElement(C, null, "disable-model-invocation: true"), " so only you can trigger it; Claude never invokes it on its own."), /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement(C, null, "!`...`"), " line runs a shell command and injects its output into the prompt. ", /*#__PURE__*/React.createElement(C, null, "$ARGUMENTS"), " substitutes whatever you typed after the skill name. Claude sees the skill directory path, so mentioning a bundled file like checklist.md lets Claude read it.")],
              example: `---
description: Reviews code changes for security vulnerabilities, authentication gaps, and injection risks
disable-model-invocation: true
argument-hint: <branch-or-path>
  ---

  ## Diff to review

  !\`git diff $ARGUMENTS\`

  Audit the changes above for:

  1. Injection vulnerabilities (SQL, XSS, command)
  2. Authentication and authorization gaps
  3. Hardcoded secrets or credentials

  Use checklist.md in this skill directory for the full review checklist.

  Report findings with severity ratings and remediation steps.`
            }, {
              id: 'skill-checklist',
              label: 'checklist.md',
              type: 'file',
              icon: 'md',
              color: '#D4A843',
              badge: 'committed',
              oneLiner: 'Supporting file bundled with the skill',
              when: 'Claude reads it on demand while running the skill',
              description: /*#__PURE__*/React.createElement(React.Fragment, null, "Skills can bundle any supporting files: reference docs, templates, scripts. The skill directory path is prepended to SKILL.md, so Claude can read bundled files by name. For scripts in bash injection commands, use the ", /*#__PURE__*/React.createElement(C, null, '${CLAUDE_SKILL_DIR}'), " placeholder."),
              example: `# Security Review Checklist

  ## Input Validation
  - [ ] All user input sanitized before DB queries
  - [ ] File upload MIME types validated
  - [ ] Path traversal prevented on file operations

  ## Authentication
  - [ ] JWT tokens expire after 24 hours
  - [ ] API keys stored in environment variables
  - [ ] Passwords hashed with bcrypt or argon2`
            }]
          }]
        }, {
          id: 'commands',
          label: 'commands/',
          type: 'folder',
          icon: 'folder',
          color: '#788C5D',
          oneLiner: /*#__PURE__*/React.createElement(React.Fragment, null, "Single-file prompts invoked with ", /*#__PURE__*/React.createElement(C, null, "/name")),
          note: commandsNote,
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "User types ", /*#__PURE__*/React.createElement(C, null, "/command-name")),
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "A file at ", /*#__PURE__*/React.createElement(C, null, "commands/deploy.md"), " creates ", /*#__PURE__*/React.createElement(C, null, "/deploy"), " the same way a skill at ", /*#__PURE__*/React.createElement(C, null, "skills/deploy/SKILL.md"), " does, and both can be auto-invoked by Claude. Skills use a directory with SKILL.md, letting you bundle reference docs, templates, or scripts alongside the prompt."),
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Use ", /*#__PURE__*/React.createElement(C, null, "$ARGUMENTS"), " in the file to accept parameters: ", /*#__PURE__*/React.createElement(C, null, "/fix-issue 123")), 'If a skill and command share a name, the skill takes precedence', 'New commands should usually be skills instead; commands remain supported'],
          docsLink: '/en/skills',
          children: [{
            id: 'cmd-example',
            label: 'fix-issue.md',
            type: 'file',
            icon: 'md',
            color: '#788C5D',
            badge: 'committed',
            oneLiner: /*#__PURE__*/React.createElement(React.Fragment, null, "Invoked as ", /*#__PURE__*/React.createElement(C, null, "/fix-issue <number>")),
            note: commandsNote,
            description: [/*#__PURE__*/React.createElement(React.Fragment, null, "An example command for fixing a GitHub issue. Type ", /*#__PURE__*/React.createElement(C, null, "/fix-issue 123"), " and the ", /*#__PURE__*/React.createElement(C, null, "!`...`"), " line runs ", /*#__PURE__*/React.createElement(C, null, "gh issue view 123"), " in your shell, injecting the output into the prompt before Claude sees it."), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(C, null, "$ARGUMENTS"), " substitutes whatever you typed after the command name. For positional access, use ", /*#__PURE__*/React.createElement(C, null, "$0"), /*#__PURE__*/React.createElement(C, null, "$1"), " and so on.")],
            example: `---
  argument-hint: <issue-number>
    ---

    !\`gh issue view $ARGUMENTS\`

    Investigate and fix the issue above.

    1. Trace the bug to its root cause
    2. Implement the fix
    3. Write or update tests
    4. Summarize what you changed and why`
          }]
        }, {
          id: 'output-styles',
          label: 'output-styles/',
          type: 'folder',
          icon: 'folder',
          color: '#5AA7A7',
          oneLiner: 'Project-scoped output styles, if your team shares any',
          when: 'Applied at session start when selected via the outputStyle setting',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Output styles are usually personal, so most live in ", /*#__PURE__*/React.createElement(C, null, "~/.claude/output-styles/"), ". Put one here if your team shares a style, like a review mode everyone uses. See ", /*#__PURE__*/React.createElement(A, {
            href: "#ce-global-output-styles"
          }, "the Global tab"), " for the full explanation and example."),
          docsLink: '/en/output-styles',
          children: []
        }, {
          id: 'agents',
          label: 'agents/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          oneLiner: 'Specialized subagents with their own context window',
          when: 'Runs in its own context window when you or Claude invoke it',
          description: 'Each markdown file defines a subagent with its own system prompt, tool access, and optionally its own model. Subagents run in a fresh context window, keeping the main conversation clean. Useful for parallel work or isolated tasks.',
          tips: ['Each agent gets a fresh context window, separate from your main session', /*#__PURE__*/React.createElement(React.Fragment, null, "Restrict tool access per agent with the ", /*#__PURE__*/React.createElement(C, null, "tools:"), " frontmatter field"), 'Type @ and pick an agent from the autocomplete to delegate directly'],
          docsLink: '/en/sub-agents',
          children: [{
            id: 'agent-reviewer',
            label: 'code-reviewer.md',
            type: 'file',
            icon: 'md',
            color: '#C46686',
            badge: 'committed',
            oneLiner: 'Subagent for isolated code review',
            when: 'Claude spawns it for review tasks, or you @-mention it from the autocomplete',
            description: /*#__PURE__*/React.createElement(React.Fragment, null, "An example subagent restricted to read-only tools. The ", /*#__PURE__*/React.createElement(C, null, "description"), " frontmatter tells Claude when to delegate to it automatically; ", /*#__PURE__*/React.createElement(C, null, "tools:"), " limits it to Read, Grep, and Glob so it can inspect code but never edit. The body becomes the subagent’s system prompt."),
            example: `---
    name: code-reviewer
    description: Reviews code for correctness, security, and maintainability
    tools: Read, Grep, Glob
    ---

    You are a senior code reviewer. Review for:

    1. Correctness: logic errors, edge cases, null handling
    2. Security: injection, auth bypass, data exposure
    3. Maintainability: naming, complexity, duplication

    Every finding must include a concrete fix.`
          }]
        }, {
          id: 'workflows',
          label: 'workflows/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          oneLiner: 'Dynamic workflow scripts that orchestrate many subagents',
          when: 'Loaded at startup; each file becomes a /<name> command',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Each ", /*#__PURE__*/React.createElement(C, null, ".js"), " file is a ", /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/workflows"
          }, "dynamic workflow"), ": a script the runtime executes to spawn and coordinate many subagents. Workflows are written by Claude and saved here from ", /*#__PURE__*/React.createElement(C, null, "/workflows"), " rather than authored from scratch."),
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Save a run from ", /*#__PURE__*/React.createElement(C, null, "/workflows"), " with ", /*#__PURE__*/React.createElement(C, null, "s"), " to create one of these"), /*#__PURE__*/React.createElement(React.Fragment, null, "A project workflow takes precedence over a personal one in ", /*#__PURE__*/React.createElement(C, null, "~/.claude/workflows/"), " with the same name")],
          docsLink: '/en/workflows'
        }, {
          id: 'agent-memory',
          label: 'agent-memory/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          badge: 'committed',
          autogen: true,
          oneLiner: 'Subagent persistent memory, separate from your main session auto memory',
          when: 'First 200 lines (capped at 25KB) of MEMORY.md loaded into the subagent system prompt when it runs',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Subagents with ", /*#__PURE__*/React.createElement(C, null, "memory: project"), " in their frontmatter get a dedicated memory directory here. This is distinct from your ", /*#__PURE__*/React.createElement(A, {
            href: "/docs/en/memory#auto-memory"
          }, "main session auto memory"), " at ", /*#__PURE__*/React.createElement(C, null, "~/.claude/projects/"), ": each subagent reads and writes its own MEMORY.md, not yours."),
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "Only created for subagents that set the ", /*#__PURE__*/React.createElement(C, null, "memory:"), " frontmatter field"), /*#__PURE__*/React.createElement(React.Fragment, null, "This directory holds project-scoped subagent memory, meant to be shared with your team. To keep memory out of version control use ", /*#__PURE__*/React.createElement(C, null, "memory: local"), ", which writes to ", /*#__PURE__*/React.createElement(C, null, ".claude/agent-memory-local/"), " instead. For cross-project memory use", /*#__PURE__*/React.createElement(C, null, "memory: user"), ", which writes to ", /*#__PURE__*/React.createElement(C, null, "~/.claude/agent-memory/")), /*#__PURE__*/React.createElement(React.Fragment, null, "The main session auto memory is a different feature; see ", /*#__PURE__*/React.createElement(C, null, "~/.claude/projects/"), " in the Global tab")],
          docsLink: '/en/sub-agents#enable-persistent-memory',
          children: [{
            id: 'agent-memory-sub',
            label: '<agent-name>/',
            type: 'folder',
            icon: 'folder',
            color: '#C46686',
            autogen: true,
            children: [{
              id: 'agent-memory-md',
              label: 'MEMORY.md',
              type: 'file',
              icon: 'md',
              color: '#C46686',
              badge: 'committed',
              autogen: true,
              oneLiner: 'The subagent writes and maintains this file automatically',
              when: 'Loaded into the subagent system prompt when the subagent starts',
              description: /*#__PURE__*/React.createElement(React.Fragment, null, "Works the same as your ", /*#__PURE__*/React.createElement(A, {
                href: "/docs/en/memory#auto-memory"
              }, "main auto memory"), ": the subagent creates and updates this file itself. You do not write it. The subagent reads it at the start of each task and writes back what it learns."),
              example: `# code-reviewer memory

        ## Patterns seen
        - Project uses custom Result<T, E> type, not exceptions
          - Auth middleware expects Bearer token in Authorization header
          - Tests use factory functions in test/factories/

          ## Recurring issues
          - Missing null checks on API responses (src/api/*)
          - Unhandled promise rejections in background jobs`
            }]
          }]
        }]
      }]
    },
    global: {
      label: '~/',
      children: [{
        id: 'claude-json',
        label: '.claude.json',
        type: 'file',
        icon: 'json',
        color: 'var(--ce-text-3)',
        badge: 'local',
        oneLiner: 'App state and UI preferences',
        when: /*#__PURE__*/React.createElement(React.Fragment, null, "Read at session start for your preferences and MCP servers. Claude Code writes back to it when you change settings in ", /*#__PURE__*/React.createElement(C, null, "/config"), " or approve trust prompts"),
        description: /*#__PURE__*/React.createElement(React.Fragment, null, "Holds state that does not belong in settings.json: theme, OAuth session, per-project trust decisions, your personal MCP servers, and UI toggles. Mostly managed through ", /*#__PURE__*/React.createElement(C, null, "/config"), " rather than editing directly."),
        tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "IDE toggles like ", /*#__PURE__*/React.createElement(C, null, "autoConnectIde"), " and ", /*#__PURE__*/React.createElement(C, null, "externalEditorContext"), " live here, not in settings.json"), /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement(C, null, "projects"), " key tracks per-project state like trust-dialog acceptance and last-session metrics. Permission rules you approve in-session go to ", /*#__PURE__*/React.createElement(C, null, ".claude/settings.local.json"), "instead"), /*#__PURE__*/React.createElement(React.Fragment, null, "MCP servers here are yours only: user scope applies across all projects, local scope is per-project but not committed. Team-shared servers go in ", /*#__PURE__*/React.createElement(C, null, ".mcp.json"), " at the project root instead")],
        example: `{
          "autoConnectIde": true,
          "externalEditorContext": true,
          "mcpServers": {
          "my-tools": {
          "command": "npx",
          "args": ["-y", "@example/mcp-server"]
          }
          }
          }`,
        docsLink: '/en/settings-reference#global-config-settings'
      }, {
        id: 'global-dot-claude',
        label: '.claude/',
        type: 'folder',
        icon: 'folder',
        color: 'var(--ce-accent)',
        oneLiner: 'Your personal configuration across all projects',
        description: 'The global counterpart to your project .claude/ directory. Files here apply to every project you work in and are never committed to any repository.',
        children: [{
          id: 'global-claude-md',
          label: 'CLAUDE.md',
          type: 'file',
          icon: 'md',
          color: '#6A9BCC',
          badge: 'local',
          oneLiner: 'Personal preferences across every project',
          when: 'Loaded at the start of every session, in every project',
          description: 'Your global instruction file. Loaded alongside the project CLAUDE.md at session start, so both are in context together. When instructions conflict, project-level instructions take priority. Keep this to preferences that apply everywhere: response style, commit format, personal conventions.',
          tips: ['Keep it short since it loads into context for every project, alongside that project\'s own CLAUDE.md', 'Good for response style, commit format, and personal conventions'],
          example: `# Global preferences

          - Keep explanations concise
          - Use conventional commit format
          - Show the terminal command to verify changes
          - Prefer composition over inheritance`,
          docsLink: '/en/memory'
        }, {
          id: 'global-settings',
          label: 'settings.json',
          type: 'file',
          icon: 'json',
          color: 'var(--ce-text-3)',
          badge: 'local',
          oneLiner: 'Default settings for all projects',
          when: 'Your defaults. Project and local settings.json override any keys you also set there',
          description: [/*#__PURE__*/React.createElement(React.Fragment, null, "Same keys as project ", /*#__PURE__*/React.createElement(C, null, "settings.json"), ": permissions, hooks, model, environment variables, and the rest. Put settings here that you want in every project, like permissions you always allow, a preferred model, or a notification hook that runs regardless of which project you’re in."), /*#__PURE__*/React.createElement(React.Fragment, null, "Settings follow a precedence order: project ", /*#__PURE__*/React.createElement(C, null, "settings.json"), " overrides any matching keys you set here. This is different from CLAUDE.md, where global and project files are both loaded into context rather than merged key by key.")],
          example: `{
          "permissions": {
          "allow": [
          "Bash(git log *)",
          "Bash(git diff *)"
          ]
          }
          }`,
          docsLink: '/en/settings'
        }, {
          id: 'keybindings',
          label: 'keybindings.json',
          type: 'file',
          icon: 'json',
          color: 'var(--ce-text-3)',
          badge: 'local',
          oneLiner: 'Custom keyboard shortcuts',
          when: 'Read at session start and hot-reloaded when you edit the file',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Rebind keyboard shortcuts in the interactive CLI. Run ", /*#__PURE__*/React.createElement(C, null, "/keybindings"), " to create or open this file with a schema reference. Ctrl+C, Ctrl+D, Ctrl+M, and Caps Lock are reserved and cannot be rebound."),
          exampleIntro: /*#__PURE__*/React.createElement(React.Fragment, null, "This example binds ", /*#__PURE__*/React.createElement(C, null, "Ctrl+E"), " to open your external editor and unbinds ", /*#__PURE__*/React.createElement(C, null, "Ctrl+U"), " by setting it to ", /*#__PURE__*/React.createElement(C, null, "null"), ". The ", /*#__PURE__*/React.createElement(C, null, "context"), " field scopes bindings to a specific part of the CLI, here the main chat input."),
          example: `{
          "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
          "$docs": "https://code.claude.com/docs/en/keybindings",
          "bindings": [
          {
          "context": "Chat",
          "bindings": {
          "ctrl+e": "chat:externalEditor",
          "ctrl+u": null
          }
          }
          ]
          }`,
          docsLink: '/en/keybindings'
        }, {
          id: 'themes',
          label: 'themes/',
          type: 'folder',
          icon: 'folder',
          color: '#5AA7A7',
          oneLiner: 'Custom color themes',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Read at session start and hot-reloaded when files change. Listed in ", /*#__PURE__*/React.createElement(C, null, "/theme")),
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Each ", /*#__PURE__*/React.createElement(C, null, ".json"), " file defines a custom color theme: a built-in ", /*#__PURE__*/React.createElement(C, null, "base"), " preset plus an ", /*#__PURE__*/React.createElement(C, null, "overrides"), " map of color tokens. Create one interactively with ", /*#__PURE__*/React.createElement(C, null, "/theme"), " or write the JSON by hand. Selecting a custom theme stores ", /*#__PURE__*/React.createElement(C, null, "custom:<slug>"), " as your theme preference."),
          example: `{
          "name": "Dracula",
          "base": "dark",
          "overrides": {
          "claude": "#bd93f9",
          "error": "#ff5555",
          "success": "#50fa7b"
          }
          }`,
          docsLink: '/en/terminal-config#create-a-custom-theme',
          children: []
        }, {
          id: 'global-projects',
          label: 'projects/',
          type: 'folder',
          icon: 'folder',
          color: '#E8A45C',
          autogen: true,
          oneLiner: "Auto memory: Claude's notes to itself, per project",
          when: 'MEMORY.md loaded at session start; topic files read on demand',
          description: 'Auto memory lets Claude accumulate knowledge across sessions without you writing anything. Claude saves notes as it works: build commands, debugging insights, architecture notes. Each project gets its own memory directory keyed by the repository path.',
          tips: [/*#__PURE__*/React.createElement(React.Fragment, null, "On by default. Toggle with ", /*#__PURE__*/React.createElement(C, null, "/memory"), " or ", /*#__PURE__*/React.createElement(C, null, "autoMemoryEnabled"), " in settings"), 'MEMORY.md is the index loaded each session. The first 200 lines, or 25KB, whichever comes first, are read', 'Topic files like debugging.md are read on demand, not at startup', 'These are plain markdown. Edit or delete them anytime'],
          docsLink: '/en/memory#auto-memory',
          children: [{
            id: 'memory-dir',
            label: '<project>/memory/',
            type: 'folder',
            icon: 'folder',
            color: '#E8A45C',
            autogen: true,
            oneLiner: "Claude's accumulated knowledge for one project",
            children: [{
              id: 'memory-md',
              label: 'MEMORY.md',
              type: 'file',
              icon: 'md',
              color: '#E8A45C',
              badge: 'local',
              autogen: true,
              oneLiner: 'Claude writes and maintains this file automatically',
              when: 'First 200 lines (capped at 25KB) loaded at session start',
              description: 'Claude creates and updates this file as it works; you do not write it yourself. It acts as an index that Claude reads at the start of every session, pointing to topic files for detail. You can edit or delete it, but Claude will keep updating it.',
              example: `# Memory Index

            ## Project
            - [build-and-test.md](build-and-test.md): npm run build (~45s), Vitest, dev server on 3001
            - [architecture.md](architecture.md): API client singleton, refresh-token auth

            ## Reference
            - [debugging.md](debugging.md): auth token rotation and DB connection troubleshooting`,
              docsLink: '/en/memory'
            }, {
              id: 'memory-topic',
              label: 'debugging.md',
              type: 'file',
              icon: 'md',
              color: '#E8A45C',
              badge: 'local',
              autogen: true,
              oneLiner: 'Topic notes Claude writes when MEMORY.md gets long',
              when: 'Claude reads this when a related task comes up',
              description: 'An example of a topic file Claude creates when MEMORY.md grows too long. Claude picks the filename based on what it splits out: debugging.md, architecture.md, build-commands.md, or similar. You never create these yourself. Claude reads a topic file back only when the current task relates to it.',
              example: `---
            name: Debugging patterns
            description: Auth token rotation and database connection troubleshooting for this project
            type: reference
            ---

            ## Auth Token Issues
            - Refresh token rotation: old token invalidated immediately
            - If 401 after refresh: check clock skew between client and server

            ## Database Connection Drops
            - Connection pool: max 10 in dev, 50 in prod
            - Always check \`docker compose ps\` first`
            }]
          }]
        }, {
          id: 'global-rules',
          label: 'rules/',
          type: 'folder',
          icon: 'folder',
          color: '#9B7BC4',
          oneLiner: 'User-level rules that apply to every project',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Rules without ", /*#__PURE__*/React.createElement(C, null, "paths:"), " load at session start. Rules with ", /*#__PURE__*/React.createElement(C, null, "paths:"), " load when a matching file enters context"),
          description: 'Same as project .claude/rules/ but applies everywhere. Use this for conventions you want across all your work, like personal code style or commit message format.',
          docsLink: '/en/memory#organize-rules-with-claude/rules/',
          children: []
        }, {
          id: 'global-skills',
          label: 'skills/',
          type: 'folder',
          icon: 'folder',
          color: '#D4A843',
          oneLiner: 'Personal skills available in every project',
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "Invoked with ", /*#__PURE__*/React.createElement(C, null, "/skill-name"), " in any project"),
          description: 'Skills you built for yourself that work everywhere. Same structure as project skills: each is a folder with SKILL.md, scoped to your user account instead of a single project.',
          docsLink: '/en/skills',
          children: []
        }, {
          id: 'global-commands',
          label: 'commands/',
          type: 'folder',
          icon: 'folder',
          color: '#788C5D',
          oneLiner: 'Personal single-file commands available in every project',
          note: commandsNote,
          when: /*#__PURE__*/React.createElement(React.Fragment, null, "User types ", /*#__PURE__*/React.createElement(C, null, "/command-name"), " in any project"),
          description: 'Same as project commands/ but scoped to your user account. Each markdown file becomes a command available everywhere.',
          docsLink: '/en/skills',
          children: []
        }, {
          id: 'global-output-styles',
          label: 'output-styles/',
          type: 'folder',
          icon: 'folder',
          color: '#5AA7A7',
          oneLiner: 'Custom system-prompt sections that adjust how Claude works',
          when: 'Applied at session start when selected via the outputStyle setting',
          description: [/*#__PURE__*/React.createElement(React.Fragment, null, "Each markdown file defines an output style: a section appended to the system prompt that, by default, also drops the built-in software-engineering task instructions. Use this to adapt Claude Code for uses beyond coding, or to add teaching or review modes."), /*#__PURE__*/React.createElement(React.Fragment, null, "Select a built-in or custom style with ", /*#__PURE__*/React.createElement(C, null, "/config"), " or the ", /*#__PURE__*/React.createElement(C, null, "outputStyle"), " key in settings. Styles here are available in every project; project-level styles with the same name take precedence.")],
          tips: ['Built-in styles Default, Proactive, Concise, Explanatory, and Learning are included with Claude Code; custom styles go here', /*#__PURE__*/React.createElement(React.Fragment, null, "Set ", /*#__PURE__*/React.createElement(C, null, "keep-coding-instructions: true"), " in frontmatter to keep the default task instructions alongside your additions"), 'Changes take effect on the next session since the system prompt is fixed at startup for caching'],
          docsLink: '/en/output-styles',
          children: [{
            id: 'output-style-example',
            label: 'teaching.md',
            type: 'file',
            icon: 'md',
            color: '#5AA7A7',
            badge: 'local',
            oneLiner: 'Example style that adds explanations and leaves small changes for you',
            when: /*#__PURE__*/React.createElement(React.Fragment, null, "Active when ", /*#__PURE__*/React.createElement(C, null, "outputStyle"), " in settings is set to ", /*#__PURE__*/React.createElement(C, null, "teaching")),
            description: /*#__PURE__*/React.createElement(React.Fragment, null, "This style appends instructions to the system prompt: Claude adds a \"Why this approach\" note after each task and leaves TODO(human) markers for changes under 10 lines instead of writing them itself. Select it by setting ", /*#__PURE__*/React.createElement(C, null, "outputStyle"), " to the filename without .md, or to the ", /*#__PURE__*/React.createElement(C, null, "name"), " field if you set one in frontmatter."),
            example: `---
            description: Explains reasoning and asks you to implement small pieces
            keep-coding-instructions: true
            ---

            After completing each task, add a brief "Why this approach" note
            explaining the key design decision.

            When a change is under 10 lines, ask the user to implement it
            themselves by leaving a TODO(human) marker instead of writing it.`
          }]
        }, {
          id: 'global-agents',
          label: 'agents/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          oneLiner: 'Personal subagents available in every project',
          when: 'Claude delegates or you @-mention in any project',
          description: 'Subagents defined here are available across all your projects. Same format as project agents.',
          docsLink: '/en/sub-agents',
          children: []
        }, {
          id: 'global-workflows',
          label: 'workflows/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          oneLiner: 'Personal dynamic workflows available in every project',
          when: 'Loaded at startup; each file becomes a /<name> command',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Workflow scripts saved here are available across all your projects. A project workflow with the same name in ", /*#__PURE__*/React.createElement(C, null, ".claude/workflows/"), " takes precedence."),
          docsLink: '/en/workflows',
          children: []
        }, {
          id: 'global-agent-memory',
          label: 'agent-memory/',
          type: 'folder',
          icon: 'folder',
          color: '#C46686',
          autogen: true,
          oneLiner: /*#__PURE__*/React.createElement(React.Fragment, null, "Persistent memory for subagents with ", /*#__PURE__*/React.createElement(C, null, "memory: user")),
          when: 'Loaded into the subagent system prompt when the subagent starts',
          description: /*#__PURE__*/React.createElement(React.Fragment, null, "Subagents with ", /*#__PURE__*/React.createElement(C, null, "memory: user"), " in their frontmatter store knowledge here that persists across all projects. For project-scoped subagent memory, see ", /*#__PURE__*/React.createElement(C, null, ".claude/agent-memory/"), " instead."),
          docsLink: '/en/sub-agents#enable-persistent-memory',
          children: []
        }]
      }]
    }
  }), []);
  const BADGE_STYLES = useMemo(() => ({
    committed: {
      bg: 'rgba(85,138,66,0.08)',
      color: 'var(--ce-badge-committed)',
      border: 'rgba(85,138,66,0.15)',
      label: 'committed'
    },
    gitignored: {
      bg: 'rgba(217,119,87,0.06)',
      color: 'var(--ce-badge-gitignored)',
      border: 'rgba(217,119,87,0.15)',
      label: 'gitignored'
    },
    local: {
      bg: 'rgba(115,114,108,0.06)',
      color: 'var(--ce-badge-local)',
      border: 'rgba(115,114,108,0.12)',
      label: 'local only'
    },
    autogen: {
      bg: 'rgba(232,164,92,0.1)',
      color: 'var(--ce-badge-autogen)',
      border: 'rgba(232,164,92,0.2)',
      label: 'Claude writes'
    }
  }), []);
  const allNodes = useMemo(() => {
    const flatten = (nodes, acc, path, parentId) => {
      for (const node of nodes) {
        const nextPath = [...path, node.label];
        acc[node.id] = {
          ...node,
          path: nextPath,
          parentId
        };
        if (node.children) flatten(node.children, acc, nextPath, node.id);
      }
      return acc;
    };
    const project = flatten(FILE_TREE.project.children, {}, [FILE_TREE.project.label]);
    const global = flatten(FILE_TREE.global.children, {}, [FILE_TREE.global.label]);
    for (const id in project) project[id].root = 'project';
    for (const id in global) global[id].root = 'global';
    return {
      ...project,
      ...global
    };
  }, [FILE_TREE]);
  const allFolderIds = useMemo(() => Object.keys(allNodes).filter(id => allNodes[id].type === 'folder'), [allNodes]);
  const DEFAULT_EXPANDED = ['dot-claude', 'rules', 'skills', 'skill-review', 'commands', 'agents', 'agent-memory', 'agent-memory-sub', 'global-dot-claude', 'global-output-styles', 'global-projects', 'memory-dir'];
  const [mounted, setMounted] = useState(false);
  const [activeRoot, setActiveRoot] = useState('project');
  const [selectedId, setSelectedId] = useState('claude-md');
  const [expandedFolders, setExpandedFolders] = useState(() => new Set(DEFAULT_EXPANDED));
  const [forceMobile, setForceMobile] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const copyTimeoutRef = useRef(null);
  const rootRef = useRef(null);
  useEffect(() => {
    setMounted(true);
    const applyHash = scroll => {
      const hash = window.location.hash.slice(1);
      if (!hash.startsWith('ce-')) return;
      const id = hash.slice(3);
      const node = allNodes[id];
      if (!node) return;
      setActiveRoot(node.root);
      setSelectedId(id);
      setExpandedFolders(new Set(allFolderIds));
      if (scroll && rootRef.current) rootRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };
    applyHash(false);
    const onHashChange = () => applyHash(true);
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);
  useEffect(() => {
    if (!mounted || !rootRef.current) return;
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('ce-') && allNodes[hash.slice(3)]) {
      rootRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [mounted]);
  if (!mounted) return null;
  const selected = allNodes[selectedId];
  const tree = FILE_TREE[activeRoot];
  const isCopied = copiedId === selected.id;
  const toggleFolder = id => {
    const next = new Set(expandedFolders);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedFolders(next);
  };
  const switchRoot = root => {
    if (root === activeRoot) return;
    setActiveRoot(root);
    const firstId = FILE_TREE[root].children[0].id;
    setSelectedId(firstId);
    try {
      history.replaceState(null, '', '#ce-' + firstId);
    } catch (e) {}
  };
  const toggleFullscreen = () => {
    if (!rootRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();else rootRef.current.requestFullscreen().catch(() => {});
  };
  const selectNode = n => {
    setSelectedId(n.id);
    if (n.type === 'folder' && !expandedFolders.has(n.id)) toggleFolder(n.id);
    try {
      history.replaceState(null, '', '#ce-' + n.id);
    } catch (e) {}
  };
  const iconBtn = {
    width: 28,
    flexShrink: 0,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--ce-text-4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const visibleFolderIds = allFolderIds.filter(id => allNodes[id].root === activeRoot);
  const allExpanded = visibleFolderIds.every(id => expandedFolders.has(id));
  const toggleAllFolders = () => {
    const next = new Set(expandedFolders);
    visibleFolderIds.forEach(id => allExpanded ? next.delete(id) : next.add(id));
    setExpandedFolders(next);
  };
  const onTreeKeyDown = e => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const visible = [];
    const walk = nodes => {
      for (const n of nodes) {
        visible.push(n.id);
        if (n.children && expandedFolders.has(n.id)) walk(n.children);
      }
    };
    walk(tree.children);
    const i = visible.indexOf(selectedId);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowDown' && i < visible.length - 1) selectNode(allNodes[visible[i + 1]]);else if (e.key === 'ArrowUp' && i > 0) selectNode(allNodes[visible[i - 1]]);else if (e.key === 'ArrowRight' && selected.type === 'folder') {
      if (!expandedFolders.has(selectedId)) toggleFolder(selectedId);else if (selected.children && selected.children.length) selectNode(allNodes[selected.children[0].id]);
    } else if (e.key === 'ArrowLeft') {
      if (selected.type === 'folder' && expandedFolders.has(selectedId)) toggleFolder(selectedId);else if (selected.parentId) selectNode(allNodes[selected.parentId]);
    }
  };
  const copyExample = (id, text) => {
    const done = () => {
      setCopiedId(id);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
    };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand('copy')) done();
      } catch (e) {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  };
  const renderIcon = (icon, color, size) => {
    const sz = size || 14;
    if (icon === 'folder') {
      return /*#__PURE__*/React.createElement("svg", {
        width: sz,
        height: sz,
        viewBox: "0 0 14 14",
        fill: "none"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M1.5 3.5a1 1 0 0 1 1-1h2.6l1 1.2h5.4a1 1 0 0 1 1 1v5.8a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V3.5z",
        fill: color,
        fillOpacity: "0.15",
        stroke: color,
        strokeWidth: "1"
      }));
    }
    if (icon === 'json') {
      return /*#__PURE__*/React.createElement("svg", {
        width: sz,
        height: sz,
        viewBox: "0 0 14 14",
        fill: "none"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "1.5",
        width: "10",
        height: "11",
        rx: "1.5",
        fill: color,
        fillOpacity: "0.15",
        stroke: color,
        strokeWidth: "1"
      }), /*#__PURE__*/React.createElement("text", {
        x: "7",
        y: "9",
        fontSize: "6",
        fontFamily: "monospace",
        fill: color,
        textAnchor: "middle",
        fontWeight: "700"
      }, '{}'));
    }
    return /*#__PURE__*/React.createElement("svg", {
      width: sz,
      height: sz,
      viewBox: "0 0 14 14",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "1.5",
      width: "10",
      height: "11",
      rx: "1.5",
      fill: color,
      fillOpacity: "0.15",
      stroke: color,
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4.5",
      y1: "5",
      x2: "9.5",
      y2: "5",
      stroke: color,
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4.5",
      y1: "7",
      x2: "9.5",
      y2: "7",
      stroke: color,
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4.5",
      y1: "9",
      x2: "8",
      y2: "9",
      stroke: color,
      strokeWidth: "1"
    }));
  };
  const renderNode = (node, depth) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedId === node.id;
    return /*#__PURE__*/React.createElement("div", {
      key: node.id
    }, /*#__PURE__*/React.createElement("button", {
      role: "treeitem",
      tabIndex: -1,
      onClick: () => selectNode(node),
      "aria-selected": isSelected,
      "aria-expanded": isFolder ? isExpanded : undefined,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        width: '100%',
        padding: `4px 8px 4px ${8 + depth * 16}px`,
        background: isSelected ? 'var(--ce-accent-bg)' : 'transparent',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: isSelected ? '2px solid var(--ce-accent)' : '2px solid transparent',
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--ce-mono)',
        fontSize: '13.5px',
        color: isSelected ? 'var(--ce-accent)' : 'var(--ce-text-2)',
        fontWeight: isSelected ? 550 : 400,
        transition: 'all 0.1s'
      }
    }, isFolder ? /*#__PURE__*/React.createElement("span", {
      onClick: e => {
        e.stopPropagation();
        toggleFolder(node.id);
      },
      style: {
        fontSize: '14px',
        color: 'var(--ce-text-4)',
        width: '20px',
        height: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
        marginLeft: '-6px',
        flexShrink: 0
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = 'var(--ce-arrow-hover)';
        e.currentTarget.style.color = 'var(--ce-text-2)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--ce-text-4)';
      }
    }, isExpanded ? '▾' : '▸') : /*#__PURE__*/React.createElement("span", {
      style: {
        width: '14px',
        flexShrink: 0
      }
    }), renderIcon(node.icon, node.color), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, node.label), node.badge && BADGE_STYLES[node.badge] && /*#__PURE__*/React.createElement("span", {
      title: BADGE_STYLES[node.badge].label,
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: BADGE_STYLES[node.badge].color,
        flexShrink: 0,
        opacity: 0.7
      }
    })), isFolder && isExpanded && node.children && /*#__PURE__*/React.createElement("div", {
      role: "group"
    }, node.children.map(child => renderNode(child, depth + 1))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, ` .ce-root {
                        --ce-mono: var(--font-mono, ui-monospace, monospace);
                        --ce-accent: #D97757;
                        --ce-accent-bg: rgba(217, 119, 87, 0.06);
                        --ce-accent-border: rgba(217, 119, 87, 0.12);
                        --ce-bg: #fff;
                        --ce-surface: #FAFAF7;
                        --ce-surface-hover: #F0EEE6;
                        --ce-border: #E8E6DC;
                        --ce-border-subtle: #F0EEE6;
                        --ce-text: #141413;
                        --ce-text-2: #5E5D59;
                        --ce-text-3: #73726C;
                        --ce-text-4: #9C9A92;
                        --ce-text-5: #B8B6AE;
                        --ce-sep: #D1CFC5;
                        --ce-code-header: #F5F4ED;
                        --ce-code-bg: #1A1918;
                        --ce-arrow-hover: rgba(0, 0, 0, 0.08);
                        --ce-badge-committed: #3d6b2e;
                        --ce-badge-gitignored: #b85c3a;
                        --ce-badge-local: #5e5d59;
                        --ce-badge-autogen: #b07520;
                        --ce-when-text: #4a7fb5;
                      }

                      .dark .ce-root {
                        --ce-bg: #1a1918;
                        --ce-surface: #232221;
                        --ce-surface-hover: #2e2d2b;
                        --ce-border: #3a3936;
                        --ce-border-subtle: #2e2d2b;
                        --ce-text: #e8e6dc;
                        --ce-text-2: #c4c2b8;
                        --ce-text-3: #9c9a92;
                        --ce-text-4: #73726c;
                        --ce-text-5: #5e5d59;
                        --ce-sep: #4a4946;
                        --ce-code-header: #2e2d2b;
                        --ce-code-bg: #0d0d0c;
                        --ce-arrow-hover: rgba(255, 255, 255, 0.08);
                        --ce-badge-committed: #6fa85c;
                        --ce-badge-gitignored: #e08a60;
                        --ce-badge-local: #9c9a92;
                        --ce-badge-autogen: #e8a45c;
                        --ce-when-text: #8bb4e0;
                      }

                      .ce-mobile-fallback {
                        display: none;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        background: rgba(0, 0, 0, 0.03);
                      }

                      .dark .ce-mobile-fallback {
                        border-color: rgba(255, 255, 255, 0.15);
                        background: rgba(255, 255, 255, 0.04);
                      }

                      @media (max-width: 700px) {
                        .ce-root:not(.ce-force) {
                          display: none !important;
                        }

                        .ce-mobile-fallback {
                          display: block;
                        }
                      }

                      `), !forceMobile && /*#__PURE__*/React.createElement("div", {
    className: "ce-mobile-fallback",
    style: {
      padding: '14px 16px',
      borderRadius: '8px',
      fontSize: '14px'
    }
  }, "The interactive explorer works best on a larger screen. See the ", /*#__PURE__*/React.createElement("a", {
    href: "#file-reference",
    style: {
      color: '#D97757'
    }
  }, "file reference table"), " below, or ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setForceMobile(true),
    style: {
      border: 'none',
      background: 'none',
      padding: 0,
      color: '#D97757',
      textDecoration: 'underline',
      cursor: 'pointer',
      font: 'inherit'
    }
  }, "show the explorer anyway"), "."), /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    className: forceMobile ? 'ce-root ce-force' : 'ce-root',
    style: {
      borderRadius: isFullscreen ? 0 : '12px',
      border: '1px solid var(--ce-border)',
      background: 'var(--ce-bg)',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans, -apple-system, sans-serif)',
      ...(isFullscreen && {
        height: '100vh'
      })
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(240px, 35%)',
      minWidth: '180px',
      flexShrink: 0,
      borderRight: '1px solid var(--ce-border-subtle)',
      background: 'var(--ce-surface)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 8px 4px',
      borderBottom: '1px solid var(--ce-border-subtle)',
      display: 'flex',
      gap: '4px'
    }
  }, ['project', 'global'].map(root => /*#__PURE__*/React.createElement("button", {
    key: root,
    onClick: () => switchRoot(root),
    style: {
      flex: 1,
      padding: '6px 0',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--ce-mono)',
      fontSize: '11.5px',
      background: activeRoot === root ? 'var(--ce-accent-bg)' : 'transparent',
      color: activeRoot === root ? 'var(--ce-accent)' : 'var(--ce-text-4)',
      fontWeight: activeRoot === root ? 600 : 430
    }
  }, root === 'project' ? 'Project' : 'Global (~/)')), /*#__PURE__*/React.createElement("button", {
    onClick: toggleAllFolders,
    title: allExpanded ? 'Collapse all' : 'Expand all',
    style: {
      ...iconBtn,
      fontSize: 11
    }
  }, allExpanded ? '⊟' : '⊞'), /*#__PURE__*/React.createElement("button", {
    onClick: toggleFullscreen,
    title: isFullscreen ? 'Exit fullscreen' : 'Fullscreen',
    style: {
      ...iconBtn,
      fontSize: 13
    }
  }, isFullscreen ? '⤡' : '⛶')), /*#__PURE__*/React.createElement("div", {
    role: "tree",
    "aria-label": "Configuration files",
    tabIndex: 0,
    onKeyDown: onTreeKeyDown,
    style: {
      padding: '6px 0',
      overflowY: 'auto',
      flex: 1,
      outline: 'none'
    }
  }, tree.children.map(node => renderNode(node, 0)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: '20px 24px',
      minHeight: '400px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-live": "polite",
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }
  }, selected.label, " selected"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ce-mono)',
      fontSize: '11px',
      color: 'var(--ce-text-4)',
      marginBottom: '10px',
      cursor: 'default'
    }
  }, selected.path.map((seg, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === selected.path.length - 1 ? 'var(--ce-accent)' : 'var(--ce-text-4)'
    }
  }, seg.replace(/\/$/, '')), i < selected.path.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ce-sep)'
    }
  }, " / ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: 'flex'
    }
  }, renderIcon(selected.icon, selected.color, 24)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 600,
      color: 'var(--ce-text)',
      letterSpacing: '-0.3px',
      lineHeight: '26px'
    }
  }, selected.label), selected.oneLiner && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '15px',
      color: 'var(--ce-text-3)',
      marginTop: '3px'
    }
  }, selected.oneLiner)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      flexShrink: 0
    }
  }, [selected.autogen && 'autogen', selected.badge].filter(Boolean).map(k => {
    const s = BADGE_STYLES[k];
    if (!s) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        fontFamily: 'var(--ce-mono)',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        padding: '2px 6px',
        borderRadius: '4px',
        background: s.bg,
        color: s.color,
        border: `0.5px solid ${s.border}`
      }
    }, s.label);
  }))), selected.note && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      borderRadius: '8px',
      marginBottom: '14px',
      background: 'rgba(217,119,87,0.06)',
      border: '1px solid rgba(217,119,87,0.2)',
      borderLeft: '3px solid var(--ce-accent)',
      fontSize: '15px',
      color: 'var(--ce-text-2)',
      lineHeight: 1.6
    }
  }, selected.note), selected.when && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: '6px',
      background: 'rgba(106,155,204,0.06)',
      border: '0.5px solid rgba(106,155,204,0.12)',
      fontSize: '15px',
      color: 'var(--ce-when-text)',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      opacity: 0.65,
      marginBottom: '3px'
    }
  }, "When it loads"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, selected.when)), selected.description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '16px',
      color: 'var(--ce-text-2)',
      lineHeight: 1.65,
      marginBottom: '16px'
    }
  }, Array.isArray(selected.description) ? selected.description.map((para, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: i < selected.description.length - 1 ? '12px' : 0
    }
  }, para)) : selected.description), selected.contains && selected.contains.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: 'var(--ce-text-4)',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      marginBottom: '8px'
    }
  }, "Common keys"), selected.contains.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '7px',
      fontSize: '15px',
      color: 'var(--ce-text-2)',
      lineHeight: 1.5,
      marginBottom: '5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '7px',
      color: 'var(--ce-text-4)',
      marginTop: '6px'
    }
  }, "●"), /*#__PURE__*/React.createElement("span", null, item)))), selected.tips && selected.tips.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      borderRadius: '8px',
      background: 'var(--ce-surface)',
      border: '1px solid var(--ce-border-subtle)',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: 'var(--ce-accent)',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      marginBottom: '6px'
    }
  }, "Tips"), selected.tips.map((tip, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '7px',
      fontSize: '14.5px',
      color: 'var(--ce-text-2)',
      marginBottom: i < selected.tips.length - 1 ? '5px' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '7px',
      color: 'var(--ce-accent)',
      marginTop: '6px'
    }
  }, "●"), /*#__PURE__*/React.createElement("span", null, tip)))), selected.example && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, selected.exampleIntro && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '15px',
      color: 'var(--ce-text-2)',
      lineHeight: 1.6,
      marginBottom: '10px'
    }
  }, selected.exampleIntro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 10px',
      background: 'var(--ce-code-header)',
      border: '1px solid var(--ce-border)',
      borderRadius: '8px 8px 0 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ce-mono)',
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--ce-text-3)'
    }
  }, selected.label), /*#__PURE__*/React.createElement("button", {
    onClick: () => copyExample(selected.id, selected.example),
    style: {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      background: isCopied ? 'rgba(85,138,66,0.08)' : 'var(--ce-code-header)',
      border: isCopied ? '0.5px solid rgba(85,138,66,0.2)' : '0.5px solid var(--ce-border)',
      color: isCopied ? '#558A42' : 'var(--ce-text-3)'
    }
  }, isCopied ? '✓ Copied' : 'Copy')), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '12px 14px',
      background: 'var(--ce-code-bg)',
      color: '#E8E6DC',
      fontFamily: 'var(--ce-mono)',
      fontSize: '13px',
      lineHeight: 1.65,
      borderRadius: '0 0 8px 8px',
      overflowX: 'auto',
      whiteSpace: 'pre'
    }
  }, selected.example)), selected.docsLink && /*#__PURE__*/React.createElement("a", {
    href: selected.docsLink,
    style: {
      display: 'inline-flex',
      padding: '5px 12px',
      borderRadius: '6px',
      background: 'var(--ce-accent-bg)',
      border: '1px solid var(--ce-accent-border)',
      color: 'var(--ce-accent)',
      fontSize: '12px',
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, "Full docs →"), selected.children && selected.children.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: 'var(--ce-text-4)',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      marginBottom: '8px'
    }
  }, "Contents"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }
  }, selected.children.map(child => /*#__PURE__*/React.createElement("button", {
    key: child.id,
    onClick: () => selectNode(child),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 8px',
      width: '100%',
      background: 'var(--ce-surface)',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'background 0.1s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--ce-surface-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--ce-surface)'
  }, renderIcon(child.icon, child.color, 13), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ce-mono)',
      fontSize: '12px',
      color: 'var(--ce-text-2)'
    }
  }, child.label), child.oneLiner && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: 'var(--ce-text-4)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, child.oneLiner))))))));
};
window.ClaudeExplorer = ClaudeExplorer;ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(ClaudeExplorer));
