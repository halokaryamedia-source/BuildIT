# Model Session Folder Convention

Use one self-contained runtime workspace per asset.

## Folder Layout

```text
SavedData/sessions/<asset>/
├─ state.json
├─ session.md                 # optional human summary
├─ session-lock.md            # compact lock mirror
├─ references/
│  ├─ PRODUCTION_CONTEXT.md
│  ├─ <asset>_reference_visual.png
│  ├─ GEOMETRY.md
│  ├─ TEXTURING.md
│  ├─ ANIMATION.md
│  ├─ VALIDATION.md
│  ├─ reference_manifest.json
│  └─ CODEX_REFERENCE_HANDOFF.md
├─ checkpoints/
│  ├─ 00_session_start.bbmodel
│  ├─ 00_session_start.json
│  ├─ 10_geometry_review.bbmodel
│  ├─ 10_geometry_review.json
│  ├─ 20_geometry_approved.bbmodel
│  ├─ 20_geometry_approved.json
│  ├─ 30_texture_review.bbmodel
│  ├─ 30_texture_review.json
│  ├─ 40_texture_approved.bbmodel
│  ├─ 40_texture_approved.json
│  ├─ 50_animation_review.bbmodel
│  ├─ 50_animation_review.json
│  ├─ 60_animation_approved.bbmodel
│  ├─ 60_animation_approved.json
│  ├─ 60_animation_skipped.bbmodel
│  ├─ 60_animation_skipped.json
│  ├─ 70_final_candidate.bbmodel
│  ├─ 70_final_candidate.json
│  ├─ 80_validation_pass.bbmodel
│  └─ 80_validation_pass.json
├─ evidence/
│  ├─ geometry/
│  │  ├─ geometry_front.png
│  │  ├─ geometry_left.png
│  │  ├─ geometry_back.png
│  │  ├─ geometry_top.png
│  │  ├─ geometry_front_left_3_4.png
│  │  └─ geometry_report.json
│  ├─ texture/
│  │  ├─ texture_atlas.png
│  │  ├─ texture_front.png
│  │  ├─ texture_left.png
│  │  ├─ texture_back.png
│  │  ├─ texture_front_left_3_4.png
│  │  └─ texture_report.json
│  ├─ animation/
│  │  ├─ animation_neutral_pose.png
│  │  ├─ animation_hierarchy.json
│  │  ├─ animation_pivots.json
│  │  ├─ animation_<clip_name>.<preview_format>
│  │  └─ animation_report.json
│  └─ final/
│     ├─ final_front.png
│     ├─ final_left.png
│     ├─ final_back.png
│     ├─ final_top.png
│     ├─ final_front_left_3_4.png
│     ├─ final_texture_atlas.png
│     ├─ validation_report.json
│     └─ completed_VALIDATION.md
├─ reports/
│  ├─ connection.json
│  ├─ preflight.json
│  └─ validation.json
└─ final/
   ├─ <asset>.bbmodel
   ├─ textures/
   └─ revision_summary.md
```

Create only relevant Animation files. When Animation is skipped, do not create fake clips or hierarchy evidence.

## Naming

```text
<asset> = lowercase_snake_case
```

Do not add timestamps, `_v2`, `_final_final`, or other version suffixes to approved checkpoint/evidence filenames. Use cache/archive folders for failed or superseded attempts.

## Authority

- `state.json`: runtime authority.
- `reports/connection.json`: canonical Codex ↔ Blockbench MCP readiness result.
- `session.md`: optional human summary generated from state when useful.
- `session-lock.md`: session ownership mirror; cannot override state.
- `references/`: approved immutable input unless the reference stage is reopened.
- `checkpoints/`: persistent recovery states and adjacent metadata.
- `evidence/`: stable user-review and validation evidence.
- `reports/`: connection, preflight, and validation results.
- `final/`: only final accepted model, textures, and concise revision summary.

## Connection Rule

Use:

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/scripts/sync-local-stack.ps1
```

`connection.json` must be `PASS` before asset preflight or any MCP write. Do not create alternate endpoint reports or project-specific MCP keys.

## Checkpoint Rule

Use `save_project_checkpoint` at:

- session start;
- each stage review;
- each approved stage;
- final candidate;
- validation pass.

Checkpoint creation must succeed before `state.json` points to it. See `Engine/codex/CHECKPOINT_RECOVERY.md`.

## Evidence Rule

Use `capture_standard_views` for Geometry and final five-view sets, and for the required Texture subset. See `Engine/codex/EVIDENCE_CONTRACT.md`.

A revision recaptures affected views only unless the change affects global consistency.

## Temporary Files

Use:

```text
SavedData/cache/<asset>/
```

for failed screenshots, experiments, temporary exports, diagnostics, and superseded candidates not needed for recovery. Do not mix temporary files with approved evidence or final output.

## Session Creation

For a new asset:

1. create the folder structure;
2. copy the approved reference package into `references/`;
3. create `state.json` from `Engine/codex/state.template.json`;
4. open one Blockbench instance and the intended project;
5. run `sync-local-stack.ps1 -Asset <asset>`;
6. continue only when `reports/connection.json` is `PASS`;
7. validate package and Animation requirement;
8. create/verify the Codex session lock;
9. call `save_project_checkpoint` for `00_session_start.bbmodel`;
10. update state only after checkpoint success;
11. enter `GEOMETRY_IN_PROGRESS`.

## Cleanup

Keep approved stage checkpoints, current review candidate, validation pass, approved evidence, connection/preflight/validation reports, and final accepted output.

Move failed attempts to cache after resolution. Do not retain redundant reports that duplicate `state.json`.

## Acceptance Criteria

- Each asset has one clear workspace.
- Connection identity is recorded before preflight.
- New sessions recover from governance, OpenSpec, state, references, and active-stage documents.
- Runtime state is not fragmented across competing Markdown files.
- Checkpoints, evidence, reports, and final paths match active contracts.
- Approved work can be recovered without relying on Undo history alone.
