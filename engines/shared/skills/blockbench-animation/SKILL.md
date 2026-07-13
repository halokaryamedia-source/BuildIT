---
name: blockbench-animation
description: "Optional Bedrock Animation workflow with identity recovery, one Terra writer, project-bound evidence, automatic review, and same-profile revision."
---

# Blockbench Animation

Load only when the approved package requires Animation. Otherwise keep Animation skipped and continue to Final Validation. Use only profile `BEDROCK_CUBOID_ANIMATION`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer and acquire the Animation lease before persistent work.
4. Preserve approved Geometry and Texture.

## Work

```text
verify hierarchy and pivots
→ create only required clips
→ check neutral pose, inherited motion, ground contact, and clipping
→ write hierarchy/pivot/neutral evidence
→ record_stage_review_report
→ validate_reference_contract
→ submit_stage_for_review
→ lease released
→ ANIMATION_REVIEW
```

Use rigid cuboid group/bone motion. Do not add mesh armatures, vertex weights, optional clips, new Geometry, Texture redesign, or final export.

`record_stage_review_report` creates the canonical `animation_report.json` and binds it to current project serialization plus hashes of hierarchy, pivot, and neutral-pose evidence. Fresh `validate_reference_contract` also checks required clips, duration, animator/keyframe presence, referenced groups, and forbidden root motion before submission. Do not write a free-form PASS report manually.

`submit_stage_for_review` verifies current report/evidence, validates the Animation contract, creates the next unused review checkpoint, enters `ANIMATION_REVIEW`, then releases the writer lease without profile switch or reconnect.

## User decision

- `APPROVED`: Codex acquires a fresh Animation lease, then calls `complete_stage` for `ANIMATION`.
- `REVISION`: Codex acquires a fresh Animation lease, then calls `prepare_stage_revision` before mutation. It returns to `ANIMATION_IN_PROGRESS` in the same profile. Regenerate affected evidence and record a new bound report before submitting again.

Do not create an Animation repair profile or ask the user to edit state/checkpoint files.
