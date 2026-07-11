# BuildIT — MCP Blockbench

BuildIT contains one MCP Blockbench application package, shared AI-engine orchestration, a local production workspace, documentation, and the OpenSpec work contract.

## Repository Map

| Path | Purpose |
| --- | --- |
| `mcp-blockbench/` | Complete MCP Blockbench package: source, scripts, prompts, tests, and generated plugin output. |
| `engines/` | Shared workflow plus Codex, Claude, and Ollama integration boundaries. |
| `workspace/` | Local asset sessions, state, checkpoints, evidence, reports, and final outputs. |
| `docs/` | Product, workflow, architecture, integration, reference, and generated API documentation. |
| `openspec/` | Approved scope, decisions, tasks, and anti-overdevelopment contract. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Tool-native adapter and discovery paths. |

## Start Here

- MCP application: `mcp-blockbench/README.md`
- Shared workflow: `engines/shared/README.md`
- Codex production: `engines/codex/BOOTSTRAP.md`
- Local active-session template: `workspace/active-session.example.json`
- Documentation: `docs/README.md`
- Current agreement: `openspec/changes/codex-local-workflow-rework/`

A real `workspace/active-session.json` is created locally and is intentionally not committed.

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
