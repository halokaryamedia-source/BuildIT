# Repository Agent Rules

## Required Authorities

1. Read `openspec/config.yaml` and the active OpenSpec change before workflow development.
2. Read `engines/shared/workflow/GOVERNANCE.md` after context loss.
3. For local Codex production, start at `engines/codex/BOOTSTRAP.md`.
4. Use `workspace/sessions/<asset>/state.json` as runtime authority.
5. Use `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` as stage/tool authority.
6. Use `engines/shared/skills/skill-profiles.json` as production-skill authority.
7. Use `openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md` as the current reliability implementation boundary.

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
- Acquire `manage_project_write_lease` before asset mutations or evidence/checkpoint/final writes.
- Never bypass `WRITE_LEASE_*` errors; realign project, state, stage, profile, and owner session instead.
- A successful stage/profile transition releases the old lease; reacquire it after the one allowed reconnect.
- Asset production loads `blockbench-production` plus exactly one active-stage skill; maximum loaded production skills is `2`.
- Repository development must not load production skills.
- Skill changes do not require MCP reconnects; tool-profile changes may reconnect the canonical entry once.
- CI and merge into `V1` remain deferred until explicit final-verification approval.

## Root Boundaries

- `mcp-blockbench/`: the complete MCP Blockbench package, including `src/`, `scripts/`, `prompts/`, `tests/`, and `dist/`.
- `engines/`: shared and engine-specific AI orchestration.
- `workspace/`: mutable local production data.
- `docs/`: authored documentation; generated API output belongs only in `docs/api/`.
- `openspec/`: durable work agreement.
- `.agents/`, `.codex/`, `.github/`, and `.vscode/`: tool-native adapters and discovery paths.

Run Bun package commands from `mcp-blockbench/`.

Do not recreate deprecated production skills `blockbench-use`, `blockbench-modeling`, or `blockbench-texturing`. Do not recreate root `src/`, `build/`, `prompts/`, `tests/`, `Engine/`, `SavedData/`, or `SourceDocument/`. Do not add versioned, `new`, `latest`, `backup`, or parallel-authority names.
