# Operator One-Page Checklist

Start with:

```text
Engine/codex/BOOTSTRAP.md
```

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

## Before the First MCP Write

- [ ] Read governance and active OpenSpec summary.
- [ ] Read `state.json`.
- [ ] Validate the approved reference package.
- [ ] Read manifest, Production Context, Reference Visual, and active-stage document.
- [ ] Apply the Ponytail batch gate.
- [ ] Load `blockbench-use` and the active-stage skill only.
- [ ] Verify endpoint, active-stage tools, project UUID, format, UV mode, and texture size.
- [ ] Confirm one active write session.
- [ ] Record manual edits and accepted areas to preserve.
- [ ] Confirm `save_project_checkpoint` and `capture_standard_views` are available when required.
- [ ] Save `00_session_start.bbmodel` with `save_project_checkpoint`.
- [ ] Update `state.json` after checkpoint success.

Run the full preflight once. Re-run only stale or failed checks.

## Stage Flow

```text
GEOMETRY
→ GEOMETRY_REVIEW
→ TEXTURE
→ TEXTURE_REVIEW
→ ANIMATION or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when used
→ FINAL_VALIDATION
→ FINAL_REVIEW
```

## Geometry

Internal passes:

- Primary Form;
- Structural Detail.

Required review output:

- `10_geometry_review.bbmodel`;
- Front, Left Side, Back, Top / Footprint, Front-left 3/4 via `capture_standard_views`;
- dimensions/hierarchy/cube report.

Do not perform UV, texture painting, animation, or final export.

After approval:

- save `20_geometry_approved.bbmodel`;
- record accepted areas;
- continue to Texture.

## Texture

Internal passes:

- UV;
- Base Texture;
- Detail Texture.

Required review output:

- `30_texture_review.bbmodel`;
- atlas and UV summary;
- Front, Left Side, Back, Front-left 3/4 via `capture_standard_views`.

Do not broadly rebuild Geometry or add PBR/Vibrant Visuals.

After approval:

- save `40_texture_approved.bbmodel`;
- record accepted areas;
- continue to Animation or Final Validation.

## Animation — Optional

Skip when no required motion family or interaction is listed.

When required, review:

- `50_animation_review.bbmodel`;
- hierarchy and pivots;
- required clips/samples;
- neutral-pose recovery;
- clipping and ground contact.

After approval, save `60_animation_approved.bbmodel`.

When skipped, record `ANIMATION_SKIPPED`; do not create fake clips.

## Final Validation

- [ ] Save `70_final_candidate.bbmodel`.
- [ ] Execute `VALIDATION.md`.
- [ ] Run Blockbench validator.
- [ ] Capture five final views with `capture_standard_views` stage `FINAL`.
- [ ] Verify `.bbmodel`, textures, hierarchy, pivots, and Animation/skip.
- [ ] Repair at most two clearly local failures automatically.
- [ ] Route broad failures back to the relevant stage.
- [ ] Save `80_validation_pass.bbmodel` after PASS.
- [ ] Wait at Final Review for user approval or correction request.

## Approval Rule

Request user approval only after:

1. Geometry;
2. Texture;
3. Animation when used;
4. Final Validation.

Do not ask for approval between internal passes.

## Revision Rule

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

One named issue or tightly related pair per revision cycle.

Do not rebuild accepted areas.

## Token and Tool Rules

- Use only governance, active OpenSpec summary, state, reference core, and active-stage document.
- Open playbooks only when triggered.
- Use one active MCP session.
- Use bounded batches for initial construction.
- Use one focused evidence set per stage/revision.
- Do not repeat unchanged context or full preflight output.
- Do not create a new tool unless repeated production evidence justifies it.
- Stop when stage acceptance criteria are met.
