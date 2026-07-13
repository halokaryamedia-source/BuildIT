# QA and Revision Protocol

## Gate order

Run QA before the Reference Visual is shown to the user. Evaluate the gates in this order:

1. Minecraft cuboid construction and Blockbench buildability;
2. Golden Sample layout, panel position, facing direction, camera, and scale;
3. identity and must-preserve features;
4. proportions, segment counts, neutral pose, ground contacts, and attachments;
5. cross-view Geometry, Texture, material, and label consistency.

A later gate cannot override failure of an earlier gate.

## Gate 1 — Mandatory Minecraft construction

PASS only when the subject visibly reads as an actual Minecraft Bedrock / Blockbench cuboid model.

Required characteristics:

- primary and secondary masses are visibly decomposable into rectangular cuboids;
- cuboid width, height, and depth vary intentionally according to form;
- the silhouette is shaped through planned massing and stepped transitions;
- angled approved parts use limited purposeful one-axis rotation or a deliberate stepped-cuboid solution;
- major masses remain stable and readable;
- parts needed for hierarchy or animation remain separable;
- surface treatment is crisp Minecraft pixel art;
- the model is feasible to recreate through the approved Geometry workflow.

Pixelated texture does not make a realistic render valid. Smooth organic anatomy, rounded mesh surfaces, photographic fur/skin, PBR highlights, realistic muscle deformation, or a generic voxel filter are blocking failures.

Cuboid-first also does not permit lazy construction. Repeated same-sized boxes, uniform cube piling, random rotation, micro-cube noise, or unplanned segmentation are blocking failures.

## Gate 2 — Golden Sample construction and presentation

Check:

- bilateral panel layout is `LEFT SIDE | FRONT | BACK` over `TOP / FOOTPRINT | FRONT-LEFT 3/4`;
- Left Side is strict profile facing left;
- Front and Back are upright and centered;
- Top / Footprint is true top-down with the head/front pointing left;
- Front-left 3/4 shows front and left planes while keeping the subject facing left;
- subject scale, ground line, padding, border hierarchy, labels, and whitespace follow the Golden Sample;
- all panels show the same model, not separately invented variants.

## Gate 3 — Subject consistency

Check identity, panel completeness, scale, ground alignment, top footprint, attachments, segment counts, silhouette-critical features, label readability, and cross-view consistency.

## Blocking failure codes

```text
NON_MINECRAFT_GEOMETRY
REALISTIC_ORGANIC_RENDER
PIXEL_TEXTURE_ONLY
GENERIC_VOXEL_FILTER
UNPLANNED_CUBE_STACKING
INSUFFICIENT_CUBOID_VARIATION
MISSING_REQUIRED_ANGLED_FORM
EXCESSIVE_ROTATION_NOISE
NON_BLOCKBENCH_BUILDABLE_FORM
GOLDEN_SAMPLE_CONSTRUCTION_DRIFT
GOLDEN_SAMPLE_LAYOUT_DRIFT
CAMERA_POSITION_DRIFT
TOP_VIEW_NOT_FOOTPRINT
CROSS_VIEW_MODEL_DRIFT
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

Use the most specific failure code. Multiple codes may be returned when they identify independent blockers.

## Automatic rejection examples

Reject before user review when:

- the subject is anatomically realistic and only its texture is pixelated;
- the body uses smooth or rounded non-cuboid surfaces;
- the image looks like a photo, cinematic render, generic voxel conversion, or game-engine animal render;
- the cuboids are merely stacked with little size variation or structural intent;
- an angled approved feature is forced into a poor axis-aligned shape despite the existing rotation/stepped-form rules;
- rotations are scattered arbitrarily across major masses;
- Left Side faces the wrong direction or behaves like a 3/4 view;
- Top view is artistic perspective rather than a measurable footprint;
- panels depict different geometry or markings.

## Revision budget

- Initial Reference Visual: one normal generation.
- Targeted correction: maximum one edit of that same visual.
- Use the edit only for one or more blocking failure codes.
- A global Minecraft-style failure may consume the one edit, but the correction must preserve source identity and approved Production Context.
- Preserve every unrelated correct area.
- Do not use the edit for optional polish, experimentation, alternate styles, or preference exploration.
- If a blocking inconsistency remains after the edit, stop and report; do not generate another board.

## Review gate

Only a QA-passing visual may be labeled approval-ready or shown with an `APPROVED / REVISION` request.

A failed visual must be described internally by its failure codes and corrected before display. The user must not be asked to approve a known-invalid result.

## Reopen rules

- `REFERENCE_VISUAL_REOPEN`: only when visible identity, pose, scale, panel, or appearance changes after approval.
- `FULL_DESIGN_REOPEN`: only when category, major proportions, attachments, interaction profile, or core design changes.
- Technical contract correction without visible redesign does not reopen image generation.
- A Minecraft-style correction before visual approval is not a Production Context reopen.

## Package audit

Verify one canonical root, required files, matching asset IDs/hashes, exactly one generated visual, no numbered/technical PNGs, schema `3.3`, valid crops/contracts, `PENDING_BUILD` validation, no draft/backup/version duplicates, and a recorded PASS for all mandatory Minecraft construction and Golden Sample gates.
