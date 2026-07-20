# BuildIT — MCP Blockbench

BuildIT contains one MCP Blockbench application package, shared AI-engine orchestration, a ChatGPT reference-generation boundary, a local production workspace, documentation, and the OpenSpec work contract.

## Repository Map

| Path | Purpose |
| --- | --- |
| `mcp-blockbench/` | Complete MCP Blockbench package: source, scripts, prompts, tests, and generated plugin output. |
| `engines/shared/` | Engine-neutral production workflow, profiles, templates, and canonical skills. |
| `engines/chatgpt/` | ChatGPT-only reference studio that creates the approved per-asset package before Codex/MCP production. |
| `engines/codex/`, `engines/claude/`, `engines/ollama/` | Host-specific production and integration boundaries. |
| `workspace/` | Active and completed Blockbench projects with user assets separated from MCP internals. |
| `docs/` | Product, workflow, architecture, integration, reference, and generated API documentation. |
| `openspec/` | Approved scope, decisions, tasks, and anti-overdevelopment contract. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Tool-native adapter and discovery paths. |

## Start Here

- MCP application: `mcp-blockbench/README.md`
- ChatGPT reference generation: `engines/chatgpt/README.md`
- ChatGPT reference skill: `engines/chatgpt/skills/blockbench-reference-studio/SKILL.md`
- Shared workflow: `engines/shared/README.md`
- Codex production: `engines/codex/BOOTSTRAP.md`
- Codex repository development: `engines/codex/DEVELOPMENT_BOOTSTRAP.md`
- Development skill integration: `docs/integrations/DEVELOPMENT_SKILLS.md`
- Workspace lifecycle: `workspace/README.md`
- Workspace index example: `workspace/workspace.example.json`
- Documentation: `docs/README.md`
- Current agreement: `openspec/changes/codex-local-workflow-rework/`

A real `workspace/workspace.json` is created locally and is intentionally not committed.

## Reference-to-Production Boundary

```text
ChatGPT Reference Studio
source image
→ Production Context
→ one approved Reference Visual
→ stage contracts
→ reference manifest
→ Codex handoff
→ <asset_id>_blockbench_reference.zip

Codex + MCP-Blockbench
approved ZIP
→ Geometry
→ Texture
→ Animation when required
→ Final Validation
```

The ChatGPT skill does not use MCP directly and is not synchronized into `.codex/skills/` or `.agents/skills/`. Runtime production continues to use only the shared stage skills registered in `engines/shared/skills/skill-profiles.json`.

## Repository Development Stack

```text
OpenSpec
→ Ponytail
→ Engineering Discipline
→ Code Review Graph when available
→ direct source and deterministic verification
```

OpenSpec and Ponytail remain the planning and scope authorities. `engineering-discipline` adds TDD, debugging, architecture, and two-axis review. `code-review-graph` is an optional local MCP context layer that narrows source and affected-test reads.

From `mcp-blockbench/`:

```text
bun run engineering:setup
bun run graph:update
bun run graph:status
```

Normal Blockbench production uses only the `blockbench` MCP server. Repository development may additionally use `code-review-graph`.

## Workspace Separation

```text
workspace/active/<asset>/ or workspace/completed/<asset>/
├─ blockbench/   # .bbmodel, textures, reference PNGs, approved previews
└─ mcp/          # state, technical contracts, checkpoints, evidence, reports
```

Users may copy the `blockbench/` folder alone. The `mcp/` folder is retained for future revisions and recovery.

## Production Stages

```text
Geometry
→ Texture
→ Animation when required
→ Final Validation
```

Each stage has one preview/review gate. Internal passes do not add routine approvals.

## Naming Rule

Use one canonical path and filename for every concern. Do not create `v2`, `new`, `latest`, `backup`, or parallel authority names. Git history stores revisions.