---
name: blockbench-texture
description: "Classic Bedrock Texture workflow with one selected Terra writer, direct evidence, one bound report, validation-owned submission, and same-profile revision."
---

# Blockbench Texture

Use only for `TEXTURE` with `BEDROCK_CUBOID_TEXTURE`. Preserve approved Geometry.

```text
get_stage_context
→ identity/lease
→ UV
→ base texture
→ detail texture
→ save atlas and required view evidence
→ record_stage_review_report
→ submit_stage_for_review
→ TEXTURE_REVIEW
```

Submission verifies the bound report/evidence and runs fresh contract validation. Do not call `validate_reference_contract` immediately before a normal submission.

If submission returns `STAGE_VALIDATION_NOT_PASS`, call validation once for structured diagnostics, repair only named issues, regenerate affected evidence/report, and resubmit.

Use Classic Bedrock, approved atlas, sharp pixels, approved UV/material/palette/alpha rules. No PBR, gradients, Geometry redesign, Animation, or final export.

`APPROVED`: fresh Texture lease → `complete_stage(TEXTURE)`. `REVISION`: fresh lease → `prepare_stage_revision` → targeted repair in the same profile.
