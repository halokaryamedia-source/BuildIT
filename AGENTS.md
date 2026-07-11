# Repository Agent Rules

## Required Authorities

1. Read `openspec/config.yaml` and the active OpenSpec change before workflow development.
2. Read `engines/shared/workflow/GOVERNANCE.md` after context loss.
3. For local Codex production, start at `engines/codex/BOOTSTRAP.md`.
4. Use `workspace/sessions/<asset>/state.json` as runtime authority.
5. Use `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` as stage/tool authority.

## Execution Guardrails

- OpenSpec preserves approved scope and decisions.
- Ponytail selects the smallest safe work required now.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Stop after each stage preview for approval or targeted revision.
- Initial work may use bounded batches; revisions use one named issue or one tightly related pair.
- Preserve approved areas and manual edits unless a stage is explicitly reopened.
- Reject unrelated work as `DEFERRED_NOT_REQUIRED`.
- Use only the canonical MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Do not scan ports, create alternate MCP keys, or bypass tool profiles.
- CI and merge into `V1` remain deferred until explicit final-verification approval.

## Root Boundaries

- `mcp-blockbench/`: the complete MCP Blockbench package, including `src/`, `scripts/`, `prompts/`, `tests/`, and `dist/`.
- `engines/`: shared and engine-specific AI orchestration.
- `workspace/`: mutable local production data.
- `docs/`: authored documentation; generated API output belongs only in `docs/api/`.
- `openspec/`: durable work agreement.
- `.agents/`, `.codex/`, `.github/`, and `.vscode/`: tool-native adapters and discovery paths.

Run Bun package commands from `mcp-blockbench/`.

Do not recreate root `src/`, `build/`, `prompts/`, `tests/`, `Engine/`, `SavedData/`, or `SourceDocument/`. Do not add versioned, `new`, `latest`, `backup`, or parallel-authority names.
