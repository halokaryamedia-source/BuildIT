---
name: blockbench-validation
description: "Final Validation with one evidence-free preflight, current Geometry readiness, canonical final evidence/export, validation-owned submission, and guarded completion."
---

# Blockbench Validation

Use only for `FINAL_VALIDATION` with `FINAL_VALIDATION_READONLY`.

```text
get_stage_context
→ identity/lease
→ verify_geometry_review_ready
→ validate_reference_contract(stage=FINAL_VALIDATION, require_evidence=false) once
→ final atlas evidence
→ clean final manifest-required views
→ complete VALIDATION.md
→ export canonical final model/textures to mcp/final
→ record_stage_review_report
→ submit_stage_for_review
→ FINAL_REVIEW
```

The preflight catches upstream/project issues before final output work. It is not repeated after the report; submission performs the final evidence-aware validation.

The bound final report includes current project serialization plus hashes of final views, atlas, validation document, final model, and final textures.

Final-only issue: remain in Final Validation and use `prepare_stage_revision` after feedback. Upstream Geometry/Texture/Animation issue: call `reopen_stage_for_revision` for the earliest affected stage. Preserve approved checkpoints and accepted areas; continue in the same session.

`APPROVED`: fresh Final Validation lease → `complete_stage(FINAL_VALIDATION)` → workspace completion. No new features, broad polish, silent upstream repair, stale evidence, versioned outputs, export outside `mcp/final`, or manual state edits.

## Session invariant

Every final-only revision or upstream reopen continues in the same Codex and MCP session. It may require a fresh target-stage lease, never a reconnect.
