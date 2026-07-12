---
name: blockbench-texture
description: "Classic Bedrock Texture workflow with identity recovery, one selected Terra writer, automatic review submission, and same-profile revision."
---

# Blockbench Texture

Use only for stage `TEXTURE` with profile `BEDROCK_CUBOID_TEXTURE`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer; acquire the Texture lease before persistent work.
4. Preserve approved Geometry.

## Work

```text
UV
→ BASE_TEXTURE
→ DETAIL_TEXTURE
→ save_texture_evidence
→ capture_standard_views
→ texture_report.json with current created_at and PASS/REVISION_REQUIRED
→ validate_reference_contract
→ submit_stage_for_review
→ TEXTURE_REVIEW
```

Use Classic Bedrock, approved atlas dimensions, Per-face UV when required, sharp pixels, and approved material zones. No PBR, MER, normal map, gradients, mesh UV, Geometry redesign, Animation, or final export.

`submit_stage_for_review` validates current evidence/report, saves the next unused Texture review checkpoint, advances state/lease revision, and enters `TEXTURE_REVIEW` without profile switch or reconnect.

## User decision

- `APPROVED`: ensure the current session owns the Texture lease, then call `complete_stage` for `TEXTURE`.
- `REVISION`: call `prepare_stage_revision` with the targeted feedback before any mutation. It returns to `TEXTURE_IN_PROGRESS` in the same profile. Regenerate affected evidence and create a report newer than the revision boundary before submitting again.

Do not activate a Texture repair profile or ask the user to edit state/checkpoint files.
