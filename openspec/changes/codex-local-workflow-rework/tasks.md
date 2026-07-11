# Tasks: Codex Local Workflow Rework

## Completed Structure and Workflow

- [x] Keep work isolated on branch `Rework`.
- [x] Preserve OpenSpec as durable scope memory and Ponytail as execution filter.
- [x] Use Geometry, Texture, optional Animation, and Final Validation review stages.
- [x] Add deterministic `blockbench` MCP connection.
- [x] Add exact stage and repair tool profiles.
- [x] Add persistent checkpoints, standard evidence, compact validation, direct texture evidence, and atomic stage completion.
- [x] Consolidate the complete plugin package under `mcp-blockbench/`.
- [x] Consolidate AI workflow under `engines/`, runtime data under `workspace/`, and documentation under `docs/`.
- [x] Remove duplicate custom roots `Engine/`, `SavedData`, `SourceDocument`, root `src`, root `build`, root `prompts`, and root `tests`.
- [x] Move generated API output to the single `docs/api/` target.
- [x] Remove stale committed runtime artifacts and legacy documentation from the active tree; retain history in Git.
- [x] Keep one canonical naming set with no versioned or parallel folders/files.

## Local Proof Still Required

- [ ] Run focused typecheck, tests, and development build from `mcp-blockbench/`.
- [ ] Reload `mcp-blockbench/dist/mcp.js` in Blockbench.
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
