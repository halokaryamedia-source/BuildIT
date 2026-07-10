# Operator One-Page Checklist

Use `../../Engine/codex/BOOTSTRAP.md` first.

## Before the First MCP Write

- [ ] Read active `state.json`.
- [ ] Validate the approved reference package.
- [ ] Read manifest, Production Context, Reference Visual, and active-stage document.
- [ ] Read active OpenSpec change.
- [ ] Load `blockbench-use` and the active-stage skill.
- [ ] Verify endpoint, tool availability, project UUID, format, UV mode, and texture size.
- [ ] Confirm one active write session.
- [ ] Record manual edits to preserve.
- [ ] Save persistent start checkpoint.
- [ ] Update `state.json`.

Run the full checklist once. Re-run only stale or failed checks.

## Stage Flow

```text
GEOMETRY
→ GEOMETRY REVIEW
→ TEXTURE
→ TEXTURE REVIEW
→ ANIMATION or SKIP
→ ANIMATION REVIEW when used
→ FINAL VALIDATION
→ FINAL REVIEW
```

## Geometry

Internal passes:

- Primary Form
- Structural Detail

Required review evidence:

- Front
- Left Side
- Back
- Top / Footprint
- Front-left 3/4
- cube/group count
- scale and hierarchy summary
- persistent checkpoint

Do not perform UV, texture painting, animation, or export.

## Texture

Internal passes:

- UV
- Base Texture
- Detail Texture

Required review evidence:

- atlas
- UV summary
- Front
- Left Side
- Back
- Front-left 3/4
- persistent checkpoint

Do not broadly rebuild geometry or add PBR/Vibrant Visuals.

## Animation — Optional

Skip when not required by the approved package.

When required, review:

- hierarchy/pivots
- required clips or sampled poses
- neutral-pose recovery
- clipping and ground contact
- persistent checkpoint

## Final Validation

- [ ] Execute `VALIDATION.md`.
- [ ] Run Blockbench validator.
- [ ] Capture five standard views.
- [ ] Verify `.bbmodel`, textures, hierarchy, pivots, and animations when used.
- [ ] Repair at most two local failures automatically.
- [ ] Return `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.
- [ ] Wait for final user approval or correction request.

## Approval Rule

Request user approval only after each user-visible stage:

1. Geometry
2. Texture
3. Animation when used
4. Final Validation

Do not ask for approval between internal passes.

## Revision Rule

One issue per revision cycle:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Verification:
```

Do not rebuild accepted areas.

## Token and Tool Rules

- Read only the active-stage document during normal work.
- Open playbooks only when triggered.
- Use one active MCP session.
- Use bounded batches for initial construction.
- Use one focused evidence set per stage/revision.
- Do not repeat long workflow documents in chat.
