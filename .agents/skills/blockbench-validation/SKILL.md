---
name: blockbench-validation
description: "Final Validation-stage skill for approved Blockbench assets. Performs read-mostly contract validation, captures final evidence, exports canonical outputs, and waits for final user approval."
---

# Blockbench Validation

## Entry

Use only when the active stage is `FINAL_VALIDATION` with tool profile `FINAL_VALIDATION_READONLY`.

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
- declaring `PASS` without evidence.

## Review Output

Provide the final `.bbmodel`, texture files, final views, validation report, completed `VALIDATION.md`, and concise revision summary. Stop for final `APPROVED` or targeted revision feedback.
