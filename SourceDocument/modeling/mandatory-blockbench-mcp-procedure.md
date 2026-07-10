# Mandatory Blockbench MCP Procedure

This is the hard baseline for Codex + Blockbench MCP production.

Use `../../Engine/codex/BOOTSTRAP.md` for the normal execution path.

## 1. Non-Negotiable Startup

Before the first MCP write in a session:

1. read `openspec/config.yaml` and the active change;
2. read `Engine/codex/BOOTSTRAP.md`;
3. read active `state.json`;
4. validate the approved reference package;
5. load `blockbench-use` and the active-stage skill profile;
6. verify endpoint, runtime tool availability, active project, UUID, format, UV mode, and texture size;
7. confirm one active write session;
8. record manual edits to preserve;
9. save a persistent start checkpoint;
10. record the preflight result in `state.json`.

The complete preflight runs once per session. Repeat only a stale or failed check.

If a required item is missing, stop:

```text
BLOCKER: preflight incomplete
Missing:
- ...
Safe next action:
- ...
```

## 2. Runtime Authority

Use:

```text
SavedData/sessions/<asset>/state.json
```

as the runtime authority.

`ACTIVE_PROJECT.md`, `session.md`, and `session-lock.md` may summarize state but must not override `state.json`.

## 3. Approved Reference Authority

Read order:

1. `reference_manifest.json`
2. `PRODUCTION_CONTEXT.md`
3. `<asset>_reference_visual.png`
4. active-stage document
5. `CODEX_REFERENCE_HANDOFF.md` when starting or recovering

Authority:

- Production Context: intent, function, assumptions, and resolved decisions.
- Reference Visual: visible identity, silhouette, proportions, pose, color, materials, and attachments.
- Category document: implementation details for the active stage.
- Validation: test contract.

Use `REFERENCE_CONFLICT` instead of guessing.

## 4. User-Visible Stages

```text
1. GEOMETRY
2. TEXTURE
3. ANIMATION — optional
4. FINAL_VALIDATION
```

Each completed stage ends with previews and waits for user approval or revision feedback.

Internal passes do not create extra approval gates.

## 5. Stage Execution Loop

For each stage:

1. lock stage scope from `state.json` and the stage document;
2. state the smallest complete stage batch;
3. save or confirm a rollback checkpoint;
4. execute bounded work;
5. run focused verification;
6. capture only the required evidence;
7. update `state.json`;
8. report stage result;
9. wait for user approval or targeted revision.

Stage report:

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## 6. Geometry Stage

Internal passes:

### Pass A — Primary Form

- global envelope;
- root and parent hierarchy;
- primary masses;
- ground contacts;
- large defining attachments;
- placeholder colors only.

### Pass B — Structural Detail

- silhouette-critical geometry;
- body/part transitions;
- required attachment continuity;
- pivot/parent readiness;
- cube reduction;
- remove geometry that belongs in texture.

Initial Geometry may use bounded multi-part batches.

Forbidden:

- UV work;
- texture painting;
- decorative micro-cubes;
- animation clips;
- export.

Required Geometry evidence:

- Front;
- Left Side;
- Back;
- Top / Footprint;
- Front-left 3/4;
- cube/group count;
- scale envelope;
- hierarchy summary;
- persistent checkpoint.

Exit:

- recognizable without texture;
- approved scale and silhouette;
- required large parts exist;
- no floating major parts or major z-fighting;
- hierarchy and attachments are stable;
- user approves Geometry Review.

## 7. Texture Stage

Internal passes:

### Pass A — UV

- atlas and UV strategy;
- compact packing;
- safe mirrored/shared areas;
- focal-area density.

### Pass B — Base Texture

- broad material zones;
- approved base palette;
- readable large color separation.

### Pass C — Detail Texture

- stepped shading;
- edge highlights;
- overlap shadows;
- seams, bands, patterns, scars, symbols, and focal pixels;
- local polish.

No approval is requested between these passes.

Forbidden:

- broad geometry redesign;
- geometry for texture-only details;
- PBR/Vibrant Visuals;
- animation work;
- export.

Required Texture evidence:

- texture atlas;
- UV summary;
- Front;
- Left Side;
- Back;
- Front-left 3/4;
- persistent checkpoint.

Exit:

- palette and material zones match the Reference Visual;
- UVs are compact and intentional;
- focal areas are readable;
- no unacceptable seams, blur, or unapproved material behavior;
- user approves Texture Review.

## 8. Animation Stage — Optional

Run only when the approved manifest or `ANIMATION.md` requires it.

If not required:

```text
stage: ANIMATION_SKIPPED
reason: not required by approved package
```

When required:

- build only approved hierarchy/pivots and animation families;
- preserve approved geometry and texture;
- maintain neutral-pose recovery;
- preserve ground contacts;
- prevent clipping and rigid-cuboid deformation.

Required evidence:

- hierarchy and pivot summary;
- required clips or sampled poses;
- neutral pose;
- clipping and ground-contact result;
- persistent checkpoint.

Exit after user approves Animation Review.

## 9. Final Validation Stage

Execute `VALIDATION.md`.

Required inputs:

- `.bbmodel` candidate;
- textures;
- five standard views;
- hierarchy/pivots;
- animations when applicable;
- Blockbench validator result;
- export readiness.

Codex may automatically repair at most two clearly local failures.

Do not silently repair anything that changes:

- identity;
- approved scale;
- major silhouette;
- approved palette/material read;
- accepted earlier-stage scope.

Result:

- `PASS`;
- `REVISION_REQUIRED`;
- `BLOCKER`.

Then stop for Final Review.

## 10. Revision Rule

The one-issue-per-cycle rule applies to revisions only.

Revision input:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Reference:
```

Rules:

- patch locally;
- preserve accepted areas;
- one issue or tightly related pair;
- one focused verification set;
- return to the same stage review;
- after two repeated failures, stop and use the relevant failure playbook.

## 11. Tool Efficiency

- Load only tools relevant to the active stage.
- Prefer bounded batch creation for initial geometry.
- Prefer explicit IDs, parents, pivots, and project UUIDs.
- Prefer one standard-view capture set over repeated arbitrary screenshots.
- Do not request large data dumps when a focused screenshot or structured result is enough.
- Do not create a new MCP session unless the active session is unavailable or explicitly reset.

## 12. Checkpoints

Use persistent `.bbmodel` checkpoints, not only Undo markers.

Recommended:

```text
checkpoints/
├─ 00_session_start.bbmodel
├─ 10_geometry_review.bbmodel
├─ 20_texture_review.bbmodel
├─ 30_animation_review.bbmodel
└─ 40_validation_pass.bbmodel
```

## 13. Stop Conditions

Stop for:

- `REFERENCE_CONFLICT`;
- missing required MCP capability;
- ambiguous session/project ownership;
- repeated blocker after two focused attempts;
- requested change that requires reopening an approved stage;
- export target not explicitly approved.
