# Tasks: Codex Local Workflow Rework

## Completed Structure and Workflow

- [x] Keep work isolated on branch `Rework`.
- [x] Preserve OpenSpec as durable scope memory and Ponytail as execution filter.
- [x] Use Geometry, Texture, optional Animation, and Final Validation review stages.
- [x] Add deterministic `blockbench` MCP connection.
- [x] Add exact stage and repair tool profiles.
- [x] Add persistent checkpoints, standard evidence, compact validation, direct texture evidence, and atomic stage completion.
- [x] Consolidate root architecture into `src/`, `engines/`, `workspace/`, `docs/`, `openspec/`, and `build/`.
- [x] Remove duplicate custom roots `Engine/`, `SavedData/`, and `SourceDocument/`.
- [x] Remove stale committed runtime artifacts and legacy documentation from the active tree; retain them in Git history.
- [x] Keep one canonical naming set with no versioned duplicate folders/files.

## Local Proof Still Required

- [ ] Run focused typecheck, tests, and development build locally.
- [ ] Reload `dist/mcp.js` in Blockbench.
- [ ] Run `engines/codex/scripts/sync-local-stack.ps1` against one project.
- [ ] Verify exact profile counts and one reconnect per stage transition.
- [ ] Verify blocked out-of-profile and cross-stage calls.
- [ ] Verify compact validator, texture evidence, checkpoint, and stage completion tools.
- [ ] Execute one end-to-end local dry run with a current reference package.
- [ ] Measure repeated reads, payload size, calls, reconnects, and repair loops.

## Deferred Until Last

- [ ] Add final CI only after local runtime proof is stable.
- [ ] Open a new integration PR only after explicit user approval.
- [ ] Run final CI and request approval before merging into `V1`.

CI remains disabled during active Rework development.
