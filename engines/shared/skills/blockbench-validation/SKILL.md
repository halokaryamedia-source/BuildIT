---
name: blockbench-validation
description: "Final Validation-stage skill for approved Blockbench assets. Performs read-mostly contract validation, captures final evidence, exports canonical outputs, and waits for final user approval."
---

# Blockbench Validation

## Entry

Use only when the active stage is `FINAL_VALIDATION` with tool profile `FINAL_VALIDATION_READONLY` and the current MCP session owns the project write lease.

Read:

1. `reference_manifest.json`
2. `PRODUCTION_CONTEXT.md`
3. the approved Reference Visual
4. `GEOMETRY.md`
5. `TEXTURING.md`
6. `ANIMATION.md`
7. `VALIDATION.md`
8. the current session state

## Work

```text
final candidate checkpoint
→ final atlas evidence
→ five standard views
→ validate_reference_contract
→ complete VALIDATION.md
→ canonical export
→ FINAL_REVIEW
```

- Keep the stage read-mostly.
- Use canonical non-versioned output names.
- Route a failure to the smallest matching local-repair profile and earliest affected stage.
- Allow no more than the approved automatic local-fix limit.
- Preserve all approved areas.

## Forbidden

- new features, broad polish, or redesign;
- silent Geometry, Texture, or Animation repair;
- alternate export names such as `v2`, `latest`, or `final-final`;
- export outside the active asset session;
- declaring `PASS` without evidence.

## Review Output

1. Save final atlas evidence directly to the active session.
2. Call `capture_standard_views` with the active project UUID, absolute session root, Final evidence directory, and `return_images: false`.
3. Run `validate_reference_contract` and complete `VALIDATION.md`.
4. Use `export_model` with `session_root`, expected project UUID, canonical final path, and `max_content_length: 0`.
5. Confirm the returned export and checkpoint SHA-256 values are present.
6. Provide the final `.bbmodel`, texture files, final views, validation report, completed `VALIDATION.md`, and concise revision summary.
7. Stop for final `APPROVED` or targeted revision feedback.
