# QA and Revision Protocol

## Blocking QA

Check identity, panel completeness, camera intent, scale, ground alignment, top footprint, attachments, segment counts, silhouette-critical features, label readability, and cross-view consistency.

## Failure codes

```text
CONTEXT_DRIFT
IDENTITY_DRIFT
CAMERA_DRIFT
SCALE_DRIFT
CROP_DRIFT
TOP_VIEW_DRIFT
ASYMMETRY_DRIFT
STRUCTURE_DRIFT
MATERIAL_DRIFT
TEXT_DRIFT
PACKAGE_INCOMPLETE
```

## Revision budget

- Initial Reference Visual: one normal generation.
- Targeted correction: maximum one edit of that same visual.
- Use the edit only for a blocking failure code.
- Preserve every unrelated approved area.
- If a blocking inconsistency remains after the edit, stop and report; do not generate another board.

## Reopen rules

- `REFERENCE_VISUAL_REOPEN`: only when visible identity, pose, scale, panel, or appearance changes.
- `FULL_DESIGN_REOPEN`: only when category, major proportions, attachments, interaction profile, or core design changes.
- Technical contract correction without visible redesign does not reopen image generation.

## Package audit

Verify one canonical root, required files, matching asset IDs/hashes, exactly one generated visual, no numbered/technical PNGs, schema `3.3`, valid crops/contracts, `PENDING_BUILD` validation, and no draft/backup/version duplicates.
