# QA and Revision Protocol

## Automatic QA before review

Check:

- approved identity is preserved;
- all views show the same design;
- view orientation is plausible;
- scale and ground contact are consistent;
- no part is cropped;
- required attachments are present;
- no extra parts were invented;
- silhouette-critical features remain readable;
- geometry is feasible with cubes, cuboids, and limited rotated cuboids;
- surface detail is not represented as micro-cube clutter;
- technical text is added programmatically, not generated inside the render.

## Failure codes

```text
CONTEXT_DRIFT
CAMERA_DRIFT
STRUCTURE_DRIFT
SCALE_DRIFT
MATERIAL_DRIFT
HIERARCHY_CONFLICT
PIVOT_CONFLICT
PACKAGE_INCOMPLETE
```

## Revision classes

### LOCAL_REVISION

Use when one panel, label, dimension, pivot, swatch, or localized part is wrong.

Rules:

- preserve all unrelated approved content;
- edit only the affected area;
- rerun QA for dependent outputs.

### SHEET_REOPEN

Use when a sheet's authority is wrong but the overall identity remains approved.

Dependency rules:

- Sheet 01 reopen → revalidate all later sheets and stage contracts.
- Sheet 02 reopen → revalidate Sheet 04, GEOMETRY.md, ANIMATION.md, and VALIDATION.md.
- Sheet 03 reopen → revalidate TEXTURING.md and VALIDATION.md.
- Sheet 04 reopen → revalidate ANIMATION.md and VALIDATION.md.

### FULL_DESIGN_REOPEN

Use only when the approved identity, proportions, category, major attachments, pose, or scale changes.

This invalidates all sheets, contracts, manifest hashes, and handoff documents.

## Image-generation budget

- Initial turnaround: one generation.
- Targeted correction: maximum one edit.
- Additional generation requires explicit user approval.
- Sheets 02–04 must be derived deterministically from the approved turnaround and approved specifications.

## Final package audit

Before packaging verify:

- every required file exists;
- filenames use the approved `asset_id`;
- Sheet 01 and `<asset_id>_reference_visual.png` are byte-identical;
- the manifest references every file;
- SHA-256 hashes match physical files;
- all approval states are `APPROVED`;
- Animation is either fully specified or explicitly `ANIMATION_SKIPPED`;
- no temporary, draft, backup, or versioned duplicate files exist;
- the ZIP opens successfully and contains one canonical package root.
