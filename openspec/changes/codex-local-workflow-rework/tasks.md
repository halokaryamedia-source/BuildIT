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
- [x] Add exact production skill profiles with a maximum of two loaded production skills.
- [x] Replace broad production skills with `blockbench-production`, Geometry, Texture, optional Animation, and Validation skills.
- [x] Add one canonical skill source plus synchronized `.agents` and `.codex` adapters.
- [x] Remove deprecated `blockbench-use`, `blockbench-modeling`, and `blockbench-texturing` production skills.
- [x] Apply the Ponytail reliability scope recorded in `PONYTAIL_EXECUTION.md`.
- [x] Add one composite project write-lease capability and enforce it at the existing tool-profile execution boundary.
- [x] Bind project mutations to owner session, project UUID, asset, session root, stage, state revision, and tool-profile revision.
- [x] Release the write lease after successful stage/profile transitions so the next stage must reacquire after reconnect.
- [x] Align session timeout defaults with the 30-minute connection contract and release ownership on session removal.
- [x] Sandbox standard-view evidence writes, use atomic file replacement, return SHA-256 metadata, and omit image payloads when files are written.
- [x] Sandbox final exports and record real checkpoint/export integrity hashes.
- [x] Add source-level tests for write ownership, stale-call checks, evidence payload control, and checkpoint integrity.
- [x] Replace the old session/archive workspace with `active/` and `completed/` lifecycles.
- [x] Separate user-facing `.bbmodel`, textures, reference PNGs, and previews under `blockbench/` from MCP internals under `mcp/`.
- [x] Add one local `workspace.json` index and one compact lifecycle command for init/list/activate/inspect/complete/reopen.
- [x] Keep completed baselines immutable while reopened revisions are active.
- [x] Preserve project/connection metadata for future revisions without persisting live sessions or write leases.
- [x] Update Codex readiness/profile scripts to resolve the selected active workspace project without directory scanning.

## Local Proof Still Required

- [ ] Run `bun run skills:check`, focused typecheck, tests, and development build from `mcp-blockbench/`.
- [ ] Run `bun run workspace -- init`, `activate`, `inspect`, `complete`, and `reopen` against a disposable local asset.
- [ ] Verify `blockbench/` alone contains the `.bbmodel`, textures, reference images, and previews needed by a user.
- [ ] Verify `mcp/` alone contains state, contracts, checkpoints, evidence, reports, and no duplicate canonical model/texture files after completion.
- [ ] Verify completion promotes `mcp/final/` staging into `blockbench/`, removes staging, and moves the project to `completed/`.
- [ ] Verify reopen preserves the completed baseline, creates an active revision, and marks downstream stages for revalidation.
- [ ] Reload `mcp-blockbench/dist/mcp.js` in Blockbench.
- [ ] Run `engines/codex/scripts/sync-local-stack.ps1` using only `workspace.json` selection.
- [ ] Verify `manage_project_write_lease` acquires for one Codex session and rejects a second writer.
- [ ] Verify a wrong project UUID, stale state revision, stale stage, and stale tool-profile revision are blocked.
- [ ] Verify exact tool profile counts and one reconnect per stage transition.
- [ ] Verify a successful stage/profile transition releases the old lease and the next stage reacquires it.
- [ ] Verify each stage loads only `blockbench-production` plus one matching stage skill.
- [ ] Verify Animation skill is not loaded when Animation is skipped.
- [ ] Verify blocked out-of-profile and cross-stage calls.
- [ ] Verify standard-view file output returns metadata without image payloads and cannot escape the session root.
- [ ] Verify checkpoint and final-export SHA-256 values match files on disk.
- [ ] Verify compact validator, texture evidence, checkpoint, and stage completion tools.
- [ ] Execute one end-to-end local dry run with a current reference package.
- [ ] Measure repeated reads, loaded skills, payload size, calls, reconnects, and repair loops.

## Deferred Until Dry-Run Evidence

- [ ] Add transformed world-space bounds only if raw bounds produce a demonstrated mismatch.
- [ ] Deepen hierarchy, UV-overlap, pivot, ground-contact, and sampled-animation validation only from observed failures.
- [ ] Add a stage-transition crash journal only if local failure injection shows the current rollback path is insufficient.
- [ ] Filter MCP resources/prompts only if the dry run shows meaningful context clutter.
- [ ] Add runtime skill-loading enforcement only if agent-side exact skill profiles fail in practice.
- [ ] Complete Claude and Ollama adapters only after the Codex path is stable.
- [ ] Add Git LFS only if completed binary history is intentionally committed and local storage alone is insufficient.

## Deferred Until Last

- [ ] Add final CI only after local runtime proof is stable.
- [ ] Open a new integration PR only after explicit user approval.
- [ ] Run final CI and request approval before merging into `V1`.

CI remains disabled during active Rework development.
