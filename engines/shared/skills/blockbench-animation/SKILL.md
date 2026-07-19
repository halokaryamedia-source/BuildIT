---
name: blockbench-animation
description: "Optional required-clips-only Bedrock Animation workflow with automatic session ownership, one bound report, validation-owned submission, and same-profile revision."
---

# Blockbench Animation

Load only when the approved manifest requires Animation. Otherwise keep it skipped and continue to Final Validation. Project identity, profile activation, and write ownership are automatic.

```text
get_stage_context once
→ verify hierarchy/pivots
→ create required clips only
→ verify neutral pose, inheritance, ground contact, clipping
→ write required evidence
→ record_stage_review_report
→ submit_stage_for_review
→ ANIMATION_REVIEW
```

Submission verifies the current report/evidence and runs fresh validation. Do not duplicate validation immediately before normal submission. On validation failure, call validation once for diagnostics, repair named issues, refresh evidence/report, and resubmit.

No optional clips, new Geometry, Texture redesign, mesh armatures, vertex weights, scale deformation, or final export.

`APPROVED`: call `complete_stage(ANIMATION)` and continue in the same session. `REVISION`: call `prepare_stage_revision`, then perform targeted repair in the same profile. Never call identity, profile, or lease management during the normal path.
