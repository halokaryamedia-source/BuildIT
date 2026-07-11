# BuildIT — MCP Blockbench

BuildIT is the MCP Blockbench application and its shared AI-engine workflow.

## Repository Map

| Path | Purpose |
| --- | --- |
| `src/` | MCP Blockbench plugin and runtime implementation. |
| `engines/` | Shared workflow plus Codex, Claude, and Ollama integration boundaries. |
| `workspace/` | Local asset sessions, state, checkpoints, evidence, reports, and final outputs. |
| `docs/` | Human guides, architecture, integration notes, references, and generated API docs. |
| `openspec/` | Approved scope, decisions, tasks, and anti-overdevelopment contract. |
| `build/` | Build and documentation tooling. |
| `prompts/` | MCP prompt assets. |
| `tests/` | Focused source and workflow verification. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Tool-native integration paths that must remain at repository root. |

## Start Here

- MCP development: `src/`
- Shared workflow: `engines/shared/README.md`
- Codex production: `engines/codex/BOOTSTRAP.md`
- Active asset pointer: `workspace/active-session.json`
- Documentation: `docs/README.md`
- Current work agreement: `openspec/changes/codex-local-workflow-rework/`

## Production Stages

```text
Geometry
→ Texture
→ Animation when required
→ Final Validation
```

Each stage ends with one preview/review gate. Internal passes do not add approval gates.

## Naming Rule

There is one canonical path for every concern. Do not create parallel `v2`, `new`, `latest`, or duplicate root folders. Git history is the archive.
