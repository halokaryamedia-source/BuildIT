# MCP And Skills

Use this folder as the navigation index for MCP runtime, Blockbench skills, and OpenSpec guardrails.

## MCP Runtime

Canonical locations:

- `src/server/`: MCP server glue, tools, resources, prompts.
- `src/server/tools/`: exposed MCP tools.
- `src/server/resources.ts`: MCP resources.
- `src/server/prompts.ts`: MCP prompts.
- `src/lib/`: shared factories, constants, utilities, schemas.
- `src/ui/`: Blockbench plugin UI and settings.
- `src/index.ts`: Blockbench plugin entry.
- `dist/`: built plugin output.

Do not move these folders without updating build and import paths.

## Skills

Canonical locations:

- `.agents/skills/blockbench-use/`
- `.agents/skills/blockbench-mcp-overview/`
- `.agents/skills/blockbench-modeling/`
- `.agents/skills/blockbench-texturing/`
- `.codex/skills/openspec-*`

Required before modelling:

- Load `blockbench-use`.
- Load `blockbench-modeling` for geometry work.
- Load `blockbench-texturing` for UV or texture work.
- Use OpenSpec before development.
- Use Ponytail as the anti-overwork guardrail.
- For resumed sessions, run `SourceDocument/modeling/engine-bootstrap-faststart.md` before any modeling action.

## OpenSpec

Canonical locations:

- `openspec/config.yaml`
- `openspec/project.md`
- `openspec/changes/`

OpenSpec controls phase gates, scope, assumptions, and acceptance criteria.

## Session Rule

Use one active Blockbench MCP working session per model. Do not create idle helper sessions that do not perform meaningful inspection or edits.
