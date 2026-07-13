---
name: blockbench-validation
description: "Final Validation workflow with current Geometry readiness, project-bound final evidence, guarded upstream reopen, automatic review, and final completion."
---

# Blockbench Validation

Use only when stage is `FINAL_VALIDATION` with profile `FINAL_VALIDATION_READONLY`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer and acquire the Final Validation lease before evidence/export writes.
4. Read only the exact current contracts and evidence paths.

## Flow

```text
verify_geometry_review_ready
→ final texture atlas evidence
→ clean final required-view capture
→ validate_reference_contract: FINAL_VALIDATION
→ complete VALIDATION.md
→ export canonical final model/textures to mcp/final
→ record_stage_review_report
→ submit_stage_for_review
→ lease released
→ FINAL_REVIEW
```

`verify_geometry_review_ready` must pass against the current model. Previously approved Geometry evidence is insufficient after Geometry, hierarchy, Texture, Animation, manual edit, reopen, or export preparation changes.

`record_stage_review_report` creates the canonical `validation_report.json` and binds it to current project serialization plus hashes of final views, atlas, completed validation document, final model, and final textures. Do not write a free-form PASS report manually.

`submit_stage_for_review` verifies current report/evidence, runs fresh final contract validation, creates the next unused final candidate checkpoint, enters `FINAL_REVIEW`, then releases the writer lease.

## Failure routing

- Final-package-only issue: remain in `FINAL_VALIDATION`; after user feedback, acquire a fresh Final Validation lease and call `prepare_stage_revision`.
- Geometry, Texture, or Animation issue: do not repair silently in Final Validation. Acquire a current Final Validation lease and call `reopen_stage_for_revision` for the earliest affected approved stage.

Upstream reopen preserves approved checkpoints as rollback baselines, marks downstream stages `REVALIDATION_REQUIRED`, activates the canonical target-stage profile, releases the old lease, and continues in the same Codex and MCP session. Acquire a fresh target-stage lease; do not reconnect or activate removed repair profiles.

## User decision

- `APPROVED`: Codex acquires a fresh Final Validation lease and calls `complete_stage` for `FINAL_VALIDATION`, then runs workspace completion.
- `REVISION`: follow the failure routing above.

## Forbidden

No new features, broad polish, silent upstream repair, stale evidence acceptance, versioned output names, export outside `mcp/final/`, or manual state/checkpoint edits.
