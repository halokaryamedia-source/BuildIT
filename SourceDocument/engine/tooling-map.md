# Tooling Stack Map (Execution Boundary Only)

## 1) Codex-side control (orchestration)

- `SavedData/*`: active model state, session lock, session notes (runtime inputs for a new chat)
- `SourceDocument/engine/WORKFLOW_HUB.md`: phase gate checklist and execution policy
- `SourceDocument/modeling/*`: reusable SOPs, templates, and quality rules
- `.codex/*` and `skills-*`: available Codex skills and skill settings

## 2) MCP-side execution (Blockbench actions)

- Blockbench MCP server endpoint: `http://localhost:3000/bb-mcp`
- MCP client config: direct Streamable HTTP first; `mcp-remote` fallback when needed
- Required tools are defined in workflow docs and checked before any edits

## 3) Plugin-side / repo-side codebase (unchanged in this stage)

- MCP server/plugin code remains in repository source (`src/`, `server/`, `build/`, `prompts/`, `ui/`)
- No new plugin architecture or dependency is added in this phase unless a user explicitly approves implementation

## 4) External Assistants

- ChatGPT/Claude/other LLMs can be used for:
  - reference generation,
  - review capture,
  - text-only planning and scoring drafts,
  while `SourceDocument/engine/WORKFLOW_HUB.md` and `SavedData/*` keep execution control.

## Operating Rule

Only one thing is allowed to change model state per cycle: the approved phase in one active session under `SavedData/sessions/<asset>/`.
