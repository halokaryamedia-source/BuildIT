# BuildIT — MCP Blockbench

BuildIT contains the MCP Blockbench application, shared AI-engine orchestration, local production workspace, documentation, and OpenSpec work contract.

## Repository Map

| Path | Purpose |
| --- | --- |
| `mcp-blockbench/` | MCP Blockbench plugin package: source, build tooling, prompts, tests, and generated output. |
| `engines/` | Shared workflow plus Codex, Claude, and Ollama integration boundaries. |
| `workspace/` | Local asset sessions, state, checkpoints, evidence, reports, and final outputs. |
| `docs/` | Product, workflow, architecture, integration, reference, and generated API documentation. |
| `openspec/` | Approved scope, decisions, tasks, and anti-overdevelopment contract. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Tool-native adapter and discovery paths. |

## Start Here

- MCP application: `mcp-blockbench/README.md`
- Shared workflow: `engines/shared/README.md`
- Codex production: `engines/codex/BOOTSTRAP.md`
- Active asset pointer: `workspace/active-session.json`
- Documentation: `docs/README.md`
- Current agreement: `openspec/changes/codex-local-workflow-rework/`

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
