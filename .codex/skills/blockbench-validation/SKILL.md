---
name: blockbench-validation
description: "Final Validation-stage skill for approved Blockbench assets. Re-verifies current Geometry visual/rotation evidence, performs read-mostly contract validation, writes validated output to MCP staging, and waits for final user approval."
---

# Blockbench Validation

## Entry

Use only when stage is `FINAL_VALIDATION`, profile is `FINAL_VALIDATION_READONLY`, and the current MCP session owns the write lease.

Call `get_stage_context` first, then read only the exact final contracts and evidence paths recorded in the active project.

## Mandatory order

```text
verify_geometry_review_ready
→ final candidate checkpoint
→ final texture atlas evidence
→ clean five-view final capture
→ validate_reference_contract: FINAL_VALIDATION
→ complete VALIDATION.md
→ export to mcp/final staging
→ FINAL_REVIEW
```

`verify_geometry_review_ready` must pass against the current model before final validation continues. A previously approved Geometry report is insufficient if Geometry changed during Texture, Animation, manual edits, reopen, or export preparation.

The Geometry gate must confirm:

- current project UUID;
- current Geometry fingerprint;
- actual Reference Visual hash;
- all five multimodal views;
- all five fixed-scale diagnostic views;
- current non-legacy analyzer;
- current evidence files;
- safe rotations and pivots.

If Geometry fails, route back to `BEDROCK_CUBOID_GEOMETRY`. Do not activate `GEOMETRY_LOCAL_REPAIR` or `GEOMETRY_VISUAL_REBUILD`; those profiles do not exist. After returning to Geometry, use `analyze_geometry_views` to classify `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` internally. Do not silently fix Geometry during Final Validation.

## Work rules

- Keep this stage read-mostly.
- Use canonical non-versioned output names.
- Preserve approved areas.
- Route each failure to the earliest affected stage and its current canonical profile.
- Allow no more than the configured automatic local-fix limit.
- Treat `mcp/final/` as temporary validated staging only.

## Forbidden

- new features, redesign, or broad polish;
- silent Geometry, Texture, or Animation repair;
- accepting stale Geometry evidence;
- alternate names such as `v2`, `latest`, or `final-final`;
- export outside the active project's `mcp/final/` directory;
- copying MCP state/checkpoints/reports into `blockbench/`;
- declaring `PASS` without current evidence.

## Review output

1. Verify Geometry review readiness first.
2. Save final atlas evidence to `mcp/evidence/final/`.
3. Capture final standard views with the active UUID and canonical evidence names.
4. Run final contract validation and complete `VALIDATION.md`.
5. Export `mcp/final/<asset_id>.bbmodel` with `max_content_length: 0`.
6. Place validated textures under `mcp/final/textures/`.
7. Confirm model, texture, checkpoint, evidence, and report hashes.
8. Stop for final user `APPROVED` or targeted revision feedback.

After final approval, run workspace completion to promote validated user files into `blockbench/`, remove temporary staging, freeze MCP metadata, and move the project to `workspace/completed/`.
