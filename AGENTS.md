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
- Initial work may use bounded batches; revisions use one named issue or a tightly related pair.
- Preserve approved areas and manual edits unless a stage is explicitly reopened.
- Reject unrelated work as `DEFERRED_NOT_REQUIRED`.
- Use only the canonical MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Do not scan ports, create alternate MCP keys, or bypass tool profiles.
- CI and merge into `V1` remain deferred until explicit final-verification approval.

## Root Boundaries

- `src/`: application logic.
- `engines/`: shared and engine-specific orchestration.
- `workspace/`: mutable local production data.
- `docs/`: human/generated documentation.
- `openspec/`: durable work agreement.
- `build/`: build tooling.

Do not recreate `Engine/`, `SavedData/`, or `SourceDocument/`. Do not add versioned duplicate folders or files.
