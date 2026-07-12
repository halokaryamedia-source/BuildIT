---
name: blockbench-validation
description: "Final Validation workflow with identity recovery, current Geometry freshness, automatic final review submission, same-stage package revision, and guarded upstream reopen."
---

# Blockbench Validation

Use only for stage `FINAL_VALIDATION` with profile `FINAL_VALIDATION_READONLY`.

## Entry

1. Call `get_stage_context`.
2. Rebind identity before lease acquisition when requested.
3. Use the selected Terra writer for required evidence/export/state writes and acquire the Final Validation lease.
4. Read only current final contracts and evidence paths.

## Mandatory order

```text
verify_geometry_review_ready
→ final texture atlas evidence
→ clean five-view final capture
→ validate_reference_contract: FINAL_VALIDATION
→ complete VALIDATION.md
→ export to mcp/final staging
→ validation_report.json with current created_at and PASS/REVISION_REQUIRED
→ submit_stage_for_review
→ FINAL_REVIEW
```

`verify_geometry_review_ready` must pass against the current model, compatibility fingerprint, transformed world-space signature, Reference Visual hash, five views, analyzer output, and rotations. Previously approved Geometry evidence is insufficient after any Geometry/hierarchy/group-transform change.

## Failure routing

- Final packaging/evidence issue only: during `FINAL_REVIEW`, call `prepare_stage_revision` and remain in `FINAL_VALIDATION`.
- Geometry, Texture, or Animation issue: call `reopen_stage_for_revision` for the earliest affected stage. Preserve approved checkpoints, mark downstream stages for revalidation, reconnect the canonical MCP entry once after the profile transition, and acquire the target-stage lease.
- Never silently repair an earlier stage during Final Validation.

## Work rules

Keep this stage read-mostly. Use canonical non-versioned final output names. Preserve approved areas. Treat `mcp/final/` as temporary validated staging. No new features, redesign, broad polish, stale evidence, alternate `v2/latest/final-final` names, or exports outside the active session.

`submit_stage_for_review` validates current evidence/report, saves the next unused final candidate checkpoint, advances state/lease revision, and enters `FINAL_REVIEW` without profile switch.

## User decision

- `APPROVED`: ensure the current session owns the Final Validation lease, then call `complete_stage` for `FINAL_VALIDATION` and run workspace completion.
- Final-package `REVISION`: call `prepare_stage_revision`, regenerate affected final evidence/export, create a newer report, and submit again.
- Earlier-stage `REVISION`: use `reopen_stage_for_revision` as described above.
