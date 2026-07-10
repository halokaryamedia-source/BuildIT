# Codex + Blockbench MCP Bootstrap

This is the single operational entry point for local model production.

## Goal

Build only what the approved reference package requires, with the fewest safe reads, MCP calls, screenshots, and user interruptions.

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

If `state.json` does not exist, create it from `Engine/codex/state.template.json`.

## Minimum Read Order

Read once when starting or recovering a session:

1. `SavedData/sessions/<asset>/state.json`
2. `references/reference_manifest.json`
3. `references/PRODUCTION_CONTEXT.md`
4. `references/<asset>_reference_visual.png`
5. the document for the active stage only

Do not load every workflow document. Open failure playbooks only when their trigger occurs.

## One-Time Preflight

Before the first MCP write in a session:

1. validate the reference package;
2. confirm one active asset and one write session;
3. verify MCP endpoint and tool availability;
4. verify active Blockbench project, UUID, format, UV mode, and texture size;
5. record manual edits that must be preserved;
6. save a persistent start checkpoint;
7. update `state.json`.

Do not repeat the full preflight for every small edit. Re-run only the failed or stale check.

## Production Stages

```text
REFERENCE_READY
→ GEOMETRY
→ GEOMETRY_REVIEW
→ TEXTURE
→ TEXTURE_REVIEW
→ ANIMATION or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when used
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

### Stage 1 — Geometry

Internal passes:

```text
Pass A: scale envelope, root hierarchy, primary masses, ground contacts
Pass B: silhouette-critical structure, attachments, transitions, cube reduction
```

Initial construction may use bounded multi-part batches. The one-issue rule applies only to revision cycles.

Forbidden during Geometry:

- UV packing;
- texture painting;
- decorative micro-cubes;
- animation clips;
- final export.

Stage output:

- persistent geometry checkpoint;
- cube/group count;
- Front, Left Side, Back, Top/Footprint, and Front-left 3/4 previews;
- short geometry result against `GEOMETRY.md` and the Reference Visual.

Then stop at `GEOMETRY_REVIEW`.

User response:

- `APPROVED` → continue to Texture;
- `REVISION: ...` → revise only the named geometry issue, recapture affected evidence, and return to review.

### Stage 2 — Texture

Internal passes:

```text
UV planning and packing
→ base material placement
→ detail texturing and focal-area polish
```

Do not stop for separate UV, base-texture, and detail-texture approvals.

Forbidden during Texture:

- broad geometry redesign;
- new geometry used to imitate pixels, seams, bands, or scratches;
- PBR or Vibrant Visuals;
- animation work.

Stage output:

- persistent textured checkpoint;
- texture atlas preview;
- UV summary;
- Front, Left Side, Back, and Front-left 3/4 textured previews;
- short texture result against `TEXTURING.md` and the Reference Visual.

Then stop at `TEXTURE_REVIEW`.

User response:

- `APPROVED` → continue to Animation when required, otherwise Final Validation;
- `REVISION: ...` → revise only the named texture/UV issue and return to review.

### Stage 3 — Animation (Optional)

Run only when `reference_manifest.json` or `ANIMATION.md` requires animation.

If animation is not required:

```text
stage: ANIMATION_SKIPPED
reason: not required by approved reference package
```

When used, build hierarchy/pivots and required clips without altering approved geometry or texture.

Stage output:

- persistent animation checkpoint;
- hierarchy and pivot summary;
- required animation clips or sampled poses;
- neutral-pose recovery capture;
- clipping and ground-contact result.

Then stop at `ANIMATION_REVIEW`.

User response:

- `APPROVED` → continue to Final Validation;
- `REVISION: ...` → revise only the named motion, pivot, clipping, or timing issue.

### Stage 4 — Final Validation

Execute `VALIDATION.md` against:

- final `.bbmodel` candidate;
- texture files;
- standard-view evidence;
- hierarchy and pivots;
- animations when required;
- Blockbench validator output;
- export readiness.

Codex may repair at most two clearly local validation failures automatically. A fix that changes approved identity, scale, silhouette, palette, or stage scope must return to the relevant review stage.

Stage output:

- final candidate `.bbmodel`;
- texture files;
- completed `VALIDATION.md`;
- Front, Left Side, Back, Top/Footprint, and Front-left 3/4 final previews;
- animation evidence when applicable;
- concise revision summary;
- result: `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

Then stop at `FINAL_REVIEW` and wait for approval or user-requested corrections.

## Revision Rule

For revisions only:

```text
one cycle = one named issue or one tightly related issue pair
```

Each revision cycle must state:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Verification:
```

Do not rebuild accepted areas.

## Stop Conditions

Stop and report only when:

- `REFERENCE_CONFLICT`;
- required MCP capability is unavailable;
- active project/session ownership is ambiguous;
- the same blocker fails twice;
- a requested fix requires reopening an approved earlier stage.

## Compact Stage Report

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```
