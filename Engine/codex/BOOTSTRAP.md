# Codex + Blockbench MCP Bootstrap

This is the single operational entry point for local model production.

## Goal

Build only what the approved reference package requires, with the fewest safe reads, MCP calls, screenshots, and user interruptions.

## Governance

Read once at session start or after context loss:

```text
Engine/codex/GOVERNANCE.md
```

Core separation:

```text
OpenSpec = remembers what was agreed, scope, stages, non-goals, and acceptance criteria
Ponytail = selects the smallest efficient action needed now to satisfy that agreement
```

OpenSpec prevents scope drift and forgotten decisions.

Ponytail prevents token waste, unnecessary tools, redundant checks, speculative work, and overdevelopment.

Do not repeat the full OpenSpec or governance text before every small edit. Use them at session start, stage transition, scope conflict, broad change, or recovery.

## Runtime Contracts

Read these only when their rule is needed:

```text
Engine/codex/STATE_MACHINE.md
Engine/codex/EVIDENCE_CONTRACT.md
Engine/codex/CHECKPOINT_RECOVERY.md
Engine/codex/stage-profiles.json
Engine/codex/LEGACY_WORKFLOW_AUDIT.md
```

- `STATE_MACHINE.md`: review, approval, revision, reopen, and accepted-area protection.
- `EVIDENCE_CONTRACT.md`: exact preview views and stable filenames.
- `CHECKPOINT_RECOVERY.md`: persistent `.bbmodel` paths and rollback logic.
- `stage-profiles.json`: required files, tool domains, checkpoints, and evidence per stage.
- `LEGACY_WORKFLOW_AUDIT.md`: prevents accidental fallback to the old workflow.

## Required Input

```text
SavedData/sessions/<asset>/references/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

Create missing state from:

```text
Engine/codex/state.template.json
```

## Minimum Read Order

Read once when starting or recovering:

1. `Engine/codex/GOVERNANCE.md`
2. active OpenSpec summary
3. `SavedData/sessions/<asset>/state.json`
4. `references/reference_manifest.json`
5. `references/PRODUCTION_CONTEXT.md`
6. `references/<asset>_reference_visual.png`
7. the active-stage document only

Do not load every workflow document. Open detailed playbooks only when their trigger occurs.

## Ponytail Batch Gate

Before a meaningful work batch, answer internally:

```text
Stage:
Approved goal:
Required now: Yes / No
Smallest complete batch:
Reuse available:
Forbidden changes:
Required tool profile:
Verification:
Stop condition:
Estimated MCP/evidence cost: Low / Medium / High
```

If `Required now` is `No`, do not execute it.

Defer it only when there is a clear later value and revisit condition.

## One-Time Preflight

Before the first MCP write in a session:

1. validate the reference package;
2. confirm one active asset and one write session;
3. verify MCP endpoint and active-stage tool capability;
4. verify Blockbench project, UUID, format, UV mode, and texture size;
5. record manual edits that must be preserved;
6. call `save_project_checkpoint` for `00_session_start.bbmodel`;
7. update `state.json` only after checkpoint success.

Do not repeat the full preflight for every edit. Re-run only the failed or stale check.

## Production State Sequence

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when used
→ ANIMATION_APPROVED when used
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

Revision states are defined in `STATE_MACHINE.md`.

Internal passes do not create additional routine approval gates.

# Stage 1 — Geometry

Internal passes:

```text
Pass A: scale envelope, root hierarchy, primary masses, ground contacts
Pass B: silhouette-critical structure, attachments, transitions, cube reduction
```

Initial construction may use bounded multi-part batches.

The one-issue rule applies to revisions, not initial construction.

Forbidden:

- UV packing;
- texture painting;
- decorative micro-cubes;
- animation clips;
- final export.

Required output:

- `save_project_checkpoint` → `checkpoints/10_geometry_review.bbmodel`;
- cube/group count;
- scale and hierarchy summary;
- `capture_standard_views` using stage `GEOMETRY` for Front, Left Side, Back, Top / Footprint, and Front-left 3/4;
- `evidence/geometry/geometry_report.json`;
- short result against `GEOMETRY.md` and the Reference Visual.

Stop at `GEOMETRY_REVIEW`.

User response:

- `APPROVED` → save `20_geometry_approved.bbmodel`, protect accepted areas, continue to Texture;
- `REVISION: ...` → create a Geometry revision scope, patch only the named issue, recapture focused evidence, and return to review.

# Stage 2 — Texture

Internal passes:

```text
UV planning and packing
→ base material placement
→ detail texturing and focal-area polish
```

Do not stop for separate UV, Base Texture, and Detail Texture approvals.

Forbidden:

- broad Geometry redesign;
- geometry used to imitate pixels, seams, bands, or scratches;
- PBR or Vibrant Visuals;
- Animation work.

Required output:

- `save_project_checkpoint` → `checkpoints/30_texture_review.bbmodel`;
- texture atlas preview;
- UV summary;
- `capture_standard_views` using stage `TEXTURE` for Front, Left Side, Back, and Front-left 3/4;
- `evidence/texture/texture_report.json`;
- short result against `TEXTURING.md` and the Reference Visual.

Stop at `TEXTURE_REVIEW`.

User response:

- `APPROVED` → save `40_texture_approved.bbmodel`, protect accepted areas, continue to Animation when required or Final Validation;
- `REVISION: ...` → create a Texture revision scope, patch only the named Texture/UV issue, recapture atlas and affected views, and return to review.

# Stage 3 — Animation (Optional)

Run only when `reference_manifest.json` or `ANIMATION.md` lists at least one required animation family or interactive motion.

If not required:

```text
state: ANIMATION_SKIPPED
reason: not required by approved reference package
checkpoint: 60_animation_skipped.bbmodel or approved Texture checkpoint as recovery source
```

Do not add optional animations merely for completeness.

When used, build only approved hierarchy, pivots, and clips without altering accepted Geometry or Texture.

Required output:

- `save_project_checkpoint` → `checkpoints/50_animation_review.bbmodel`;
- hierarchy and pivot summary;
- required clips or sampled poses;
- neutral-pose recovery;
- clipping and ground-contact result;
- stable Animation evidence paths from `EVIDENCE_CONTRACT.md`.

Stop at `ANIMATION_REVIEW`.

User response:

- `APPROVED` → save `60_animation_approved.bbmodel`, protect accepted areas, continue to Final Validation;
- `REVISION: ...` → patch only the named motion, pivot, clipping, or timing issue.

# Stage 4 — Final Validation

Execute `VALIDATION.md` against:

- final `.bbmodel` candidate;
- textures;
- standard-view evidence;
- hierarchy and pivots;
- animations when required;
- Blockbench validator output;
- export readiness.

Codex may repair at most two clearly local validation failures automatically.

A fix that changes approved identity, scale, silhouette, palette, material read, or accepted stage scope must return to the relevant review stage.

Do not add new features during Final Validation.

Required output:

- `save_project_checkpoint` → `checkpoints/70_final_candidate.bbmodel`;
- final candidate `.bbmodel` in `final/`;
- texture files;
- completed `VALIDATION.md`;
- `capture_standard_views` using stage `FINAL` for five final views;
- final texture atlas;
- concise revision summary;
- result: `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

After validation PASS, save `80_validation_pass.bbmodel`.

Stop at `FINAL_REVIEW` and wait for approval or corrections.

## Revision Rule

For revisions only:

```text
one cycle = one named issue or one tightly related issue pair
```

Required feedback mapping:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Reference:
Verification:
Rollback checkpoint:
```

Do not rebuild accepted areas.

Follow `STATE_MACHINE.md` for local-fix versus stage-reopen decisions.

## Overdevelopment Stop Test

Do not execute work when any is true:

- it does not serve the active stage acceptance criteria;
- it is not requested by the user or required by the approved package;
- it duplicates existing authority/state;
- it creates a new abstraction without reducing current risk or repeated work;
- it solves only a hypothetical future problem;
- it consumes meaningful tokens/tool calls without reviewable progress;
- it requires reopening accepted work without a proven conflict.

Record only when useful:

```text
DEFERRED_NOT_REQUIRED
Reason:
Revisit condition:
```

## Stop Conditions

Stop and report only when:

- `REFERENCE_CONFLICT`;
- required MCP capability is unavailable;
- active project/session ownership is ambiguous;
- checkpoint or evidence creation fails;
- the same blocker fails twice;
- a requested fix requires reopening an approved earlier stage.

## Compact Stage Report

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Checkpoint:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## Local Dry Run

After contracts and required tools are available locally, execute:

```text
Engine/codex/LOCAL_DRY_RUN.md
```

Do not use CI as a substitute for the local Blockbench/MCP dry run.

## CI and Release Rule

CI, deployment preview, release preparation, and final comprehensive verification are deferred until the workflow implementation is intentionally ready for final review.

During active rework:

- use focused local verification for changed areas;
- do not trigger continuous CI on every branch update;
- do not open a merge PR merely to run automated checks;
- keep all work isolated on `Rework` until the user explicitly approves final integration.
