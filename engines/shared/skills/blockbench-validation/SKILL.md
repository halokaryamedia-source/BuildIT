---
name: blockbench-validation
description: "Final Validation-stage skill for approved Blockbench assets. Performs read-mostly contract validation, writes validated output to MCP staging, and waits for final user approval before workspace completion promotes user files."
---

# Blockbench Validation

## Entry

Use only when the active stage is `FINAL_VALIDATION` with tool profile `FINAL_VALIDATION_READONLY` and the current MCP session owns the project write lease.

Read:

1. `mcp/project.json`
2. `reference_manifest.json`
3. `PRODUCTION_CONTEXT.md`
4. the approved Reference Visual
5. `GEOMETRY.md`
6. `TEXTURING.md`
7. `ANIMATION.md`
8. `VALIDATION.md`
9. `mcp/state.json`

## Work

```text
final candidate checkpoint
→ final atlas evidence
→ five standard views
→ validate_reference_contract
→ complete VALIDATION.md
→ export to mcp/final staging
→ FINAL_REVIEW
```

- Keep the stage read-mostly.
- Use canonical non-versioned output names.
- Route a failure to the smallest matching local-repair profile and earliest affected stage.
- Allow no more than the approved automatic local-fix limit.
- Preserve all approved areas.
- Treat `mcp/final/` as temporary validated staging, not the user handoff folder.

## Forbidden

- new features, broad polish, or redesign;
- silent Geometry, Texture, or Animation repair;
- alternate export names such as `v2`, `latest`, or `final-final`;
- export outside the active project's `mcp/final/` staging directory;
- copying MCP state/checkpoints/reports into the user-facing `blockbench/` folder;
- declaring `PASS` without evidence.

## Review Output

1. Save final atlas evidence directly to `mcp/evidence/final/`.
2. Call `capture_standard_views` with the active project UUID, absolute `mcp/` session root, Final evidence directory, and `return_images: false`.
3. Run `validate_reference_contract` and complete `VALIDATION.md`.
4. Use `export_model` with `session_root`, expected project UUID, `mcp/final/<asset_id>.bbmodel`, and `max_content_length: 0`.
5. Place validated textures under `mcp/final/textures/`.
6. Confirm the returned export and checkpoint SHA-256 values are present.
7. Provide final review evidence and stop for final `APPROVED` or targeted revision feedback.

After final user approval, run the workspace completion command. It promotes the validated model, textures, and approved previews into `blockbench/`, removes temporary staging, freezes MCP metadata, and moves the project to `workspace/completed/`.
