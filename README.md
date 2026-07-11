# BuildIT — MCP Blockbench

BuildIT contains one MCP Blockbench application package, shared AI-engine orchestration, a local production workspace, documentation, and the OpenSpec work contract.

## Repository Map

| Path | Purpose |
| --- | --- |
| `mcp-blockbench/` | Complete MCP Blockbench package: source, scripts, prompts, tests, and generated plugin output. |
| `engines/` | Shared workflow plus Codex, Claude, and Ollama integration boundaries. |
| `workspace/` | Active and completed Blockbench projects with user assets separated from MCP internals. |
| `docs/` | Product, workflow, architecture, integration, reference, and generated API documentation. |
| `openspec/` | Approved scope, decisions, tasks, and anti-overdevelopment contract. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Tool-native adapter and discovery paths. |

## Start Here

- MCP application: `mcp-blockbench/README.md`
- Shared workflow: `engines/shared/README.md`
- Codex production: `engines/codex/BOOTSTRAP.md`
- Workspace lifecycle: `workspace/README.md`
- Workspace index example: `workspace/workspace.example.json`
- Documentation: `docs/README.md`
- Current agreement: `openspec/changes/codex-local-workflow-rework/`

A real `workspace/workspace.json` is created locally and is intentionally not committed.

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
