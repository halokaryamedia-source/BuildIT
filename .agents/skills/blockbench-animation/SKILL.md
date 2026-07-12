---
name: blockbench-animation
description: "Optional Bedrock Animation workflow with identity recovery, one selected Terra writer, automatic review submission, and same-profile revision."
---

# Blockbench Animation

Load only when the approved package requires Animation. Otherwise skip it during the Texture approval transition.

Use only for stage `ANIMATION` with profile `BEDROCK_CUBOID_ANIMATION`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer and acquire the Animation lease before persistent work.
4. Preserve approved Geometry and Texture.

## Work

- Verify required groups, hierarchy, neutral pose, and pivots.
- Create only required rigid cuboid clips.
- Check inherited motion, ground contact, clipping, and neutral-pose recovery.
- Save hierarchy, pivot, neutral-pose, and required-clip evidence.
- Write `animation_report.json` with a current `created_at` and explicit result.
- Run `validate_reference_contract`.
- Call `submit_stage_for_review` to enter `ANIMATION_REVIEW`.

No mesh armatures, vertex weights, new Geometry, Texture redesign, optional clips, unapproved motion ranges, or final export.

## User decision

- `APPROVED`: ensure the current session owns the Animation lease, then call `complete_stage` for `ANIMATION`.
- `REVISION`: call `prepare_stage_revision` with targeted feedback before mutation. It returns to `ANIMATION_IN_PROGRESS` in the same profile. Regenerate affected evidence and create a newer report before submitting again.

Do not activate an Animation repair profile or ask the user to edit state/checkpoint files.
