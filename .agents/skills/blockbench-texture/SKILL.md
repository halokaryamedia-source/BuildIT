---
name: blockbench-texture
description: "Classic Bedrock Texture workflow with identity recovery, one selected Terra writer, project-bound evidence, automatic review, and same-profile revision."
---

# Blockbench Texture

Use only for stage `TEXTURE` with profile `BEDROCK_CUBOID_TEXTURE`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer and acquire the Texture lease before persistent work.
4. Preserve approved Geometry.

## Work

```text
UV
→ BASE_TEXTURE
→ DETAIL_TEXTURE
→ save_texture_evidence
→ capture_standard_views
→ record_stage_review_report
→ validate_reference_contract
→ submit_stage_for_review
→ lease released
→ TEXTURE_REVIEW
```

Use Classic Bedrock, approved atlas dimensions, Per-face UV when required, sharp pixels, and approved material zones. No PBR, MER, normal map, gradients, mesh UV, Geometry redesign, Animation, or final export.

`record_stage_review_report` creates the canonical `texture_report.json` and binds it to the current project serialization plus hashes of the atlas and review views. Do not write a free-form PASS report manually.

`submit_stage_for_review` verifies the bound report and current evidence, runs fresh contract validation, saves the next unused Texture review checkpoint, enters `TEXTURE_REVIEW`, then releases the writer lease without profile switch or reconnect.

## User decision

- `APPROVED`: Codex acquires a fresh Texture lease, then calls `complete_stage` for `TEXTURE`.
- `REVISION`: Codex acquires a fresh Texture lease, then calls `prepare_stage_revision` with targeted feedback before mutation. It returns to `TEXTURE_IN_PROGRESS` in the same profile. Regenerate affected evidence and call `record_stage_review_report` again before submitting.

Do not activate a Texture repair profile or ask the user to edit state/checkpoint files.
