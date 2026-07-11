# CODEX REFERENCE HANDOFF — Black Rhinoceros

## Package Status

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Sample Type: `GOLDEN_SAMPLE`
- Target: Minecraft Bedrock Entity
- Reference Package Status: `APPROVED`
- Production Context Status: `APPROVED`
- Reference Visual Status: `APPROVED`
- Validation Execution Status: `PENDING_BUILD`
- Primary Visual Authority: `black_rhinoceros_reference_visual.png`
- Canonical Model Filename: `black_rhinoceros.bbmodel`
- Animation Status: `ANIMATION_SKIPPED`

## Required Read Order

1. `reference_manifest.json`
2. `PRODUCTION_CONTEXT.md`
3. `black_rhinoceros_reference_visual.png`
4. `GEOMETRY.md`
5. `TEXTURING.md`
6. `ANIMATION.md`
7. `VALIDATION.md`
8. `CODEX_REFERENCE_HANDOFF.md`

Do not use legacy numbered sheets, independently generated angle images, or unstated external references as substitutes for the canonical Reference Visual.

## Authority Rules

- `PRODUCTION_CONTEXT.md` controls intent, role, functional requirements, scale basis, assumptions, approved constraints, and resolved decision logic.
- `black_rhinoceros_reference_visual.png` controls visible identity, silhouette, proportions, neutral pose, color/material appearance, attachments, and cross-view consistency.
- `GEOMETRY.md` translates the approved decision core and visual into executable cuboid construction, dimensions, hierarchy, segment counts, and ground-contact requirements.
- `TEXTURING.md` translates the approved visual into palette, material zones, UV rules, pixel budgets, opacity rules, and Classic Bedrock restrictions.
- `ANIMATION.md` defines animation-ready hierarchy, pivots, inherited motion, allowed axes, neutral recovery, and clipping constraints. It does not authorize animation clips.
- `VALIDATION.md` defines mandatory post-build evidence and pass/fail criteria.
- Category documents may add technical precision but may not visibly redesign the asset.
- When authorities cannot be reconciled without guessing, stop and report `REFERENCE_CONFLICT`.

## One-Image Workflow Lock

- Generated Reference Visual count: `1`
- Canonical generated image: `black_rhinoceros_reference_visual.png`
- Source input copy: `source/original_reference.png` and not counted as generated output
- Maximum targeted visual correction before approval: `1`
- Images generated after Reference Visual approval: `0`
- Technical sheets or additional view images: Forbidden
- Legacy numbered image names such as `01_*`, `02_*`, `03_*`, and `04_*`: Forbidden in the final package

## Project Lock

- Global Size: `27.2u W × 52.8u D × 40u H`
- Block Scale: `1 block = 16u`
- Block Dimensions: `1.7 W × 3.3 D × 2.5 H`
- Major-Bounds Tolerance: `±1u`
- Ground Plane: `Y = 0`
- Front Direction: `-Z`
- Root Group: `black_rhinoceros_root`
- Geometry Strategy: Smart cuboids only
- Expected Cuboid Count: `22–32`
- Front Horn Segments: `3`
- Rear Horn Segments: `2`
- Tail Segments: `2`
- Leg Chains: Four; one leg group plus one foot child each
- Texture Atlas: `128 × 128`
- Texture Style: `16x`
- UV Strategy: Box UV first with selective per-face UV
- Pipeline: Classic Bedrock only
- PBR: Forbidden
- Vibrant Visuals: Forbidden
- Alpha / Emissive: Not required and not authorized
- Required Animation Clips: None

## Golden Sample Selection

Use this package directly when the task explicitly requests the BuildIT Black Rhinoceros Golden Sample. Do not search for a replacement sample, substitute a loose image, or report that a Golden Sample is missing when all required package files are present.

## Build Sequence

```text
Import package
→ parse and validate reference_manifest.json
→ read Production Context decision core
→ load the single approved Reference Visual
→ create Bedrock Entity project
→ lock units, origin, forward direction, and global envelope
→ create canonical hierarchy and pivots
→ build torso, shoulder, rear, neck, head, and muzzle masses
→ build horns, ears, four leg/foot chains, and tail chain
→ capture provisional five-view neutral comparisons
→ correct geometry without texture compensation
→ create 128 × 128 texture atlas and UV layout
→ paint approved material zones and critical pixel details
→ verify animation-ready pivots with zero required clips
→ execute every test in VALIDATION.md
→ revise failed items at the earliest affected stage
→ rerun affected tests and final full validation
→ export black_rhinoceros.bbmodel
→ return required completion output
```

## Geometry Execution Rules

- Build to the written envelope before adding silhouette details.
- Use `-Z` as forward from the first project step.
- Keep all four foot bottoms on `Y = 0` in neutral pose.
- Preserve the high-shoulder/lower-rear relationship.
- Preserve the broad low head and rectangular muzzle.
- Preserve exactly two horns, with the three-segment front horn clearly dominant over the two-segment rear horn.
- Preserve compact upright ears, four thick legs, four foot blocks, and a short two-segment tail.
- Keep total cuboid count within `22–32` unless a true conflict is reported.
- Use texture for wrinkles, eyes, nostrils, mouth, scars, folds, muscle shading, and hoof separation.
- Do not introduce mesh, spheres, cylinders, vertex weighting, armature skinning, or decorative micro-cube sculpture.

## Texture Execution Rules

- Create one primary `128 × 128` PNG atlas.
- Use nearest-neighbor pixel handling with no anti-aliasing.
- Use the approved warm gray-brown hide family.
- Keep head/muzzle slightly darker without changing material identity.
- Keep horns and hooves darker than hide.
- Keep eyes, nostrils, mouth, and ear interiors as compact near-black accents.
- Use Box UV for major simple cuboids and selective per-face UV only for documented identity/seam requirements.
- Mirror only approved paired regions.
- Keep facial and directional UV areas unique when mirroring would reverse placement.
- Do not add alpha, emissive, PBR, normal, metallic, roughness, height, material-instance, or Vibrant Visuals content.

## Animation-Readiness Rules

- Create no animation clips.
- Record status as `ANIMATION_SKIPPED`.
- Preserve the canonical parent-child hierarchy.
- Place head, ear, leg, foot, tail-base, and tail-tip pivots at documented anatomical joints.
- Keep muzzle and horns as rigid head children.
- Verify neutral reset returns all four feet to `Y = 0`.
- Use only conservative pivot checks needed to detect hierarchy or clipping errors.
- Do not infer idle, walk, charge, attack, hurt, death, jaw, rider, or special motion.

## Mandatory Restrictions

- Do not redesign the subject.
- Do not rescale approved dimensions.
- Do not recolor approved material families.
- Do not change species, age/form, horn count, or horn dominance.
- Do not invent or remove visible parts.
- Do not add saddle, armor, harness, rider seat, cargo, or fantasy attachments.
- Do not replace texture-only details with micro-cubes.
- Do not introduce PBR or Vibrant Visuals.
- Do not generate, request, or depend on additional reference images.
- Do not skip any required validation view.
- Do not mark `PASS` without direct evidence.
- Do not silently repair an authority conflict; report `REFERENCE_CONFLICT`.

## Required Validation Evidence

- `black_rhinoceros.bbmodel`
- final `128 × 128` texture atlas PNG
- Left Side neutral render
- Front neutral render
- Back neutral render
- Top / Footprint capture
- Front-left 3/4 neutral render
- hierarchy/group list
- pivot-coordinate list
- cuboid count and segment-count report
- animation list confirming zero required clips / `ANIMATION_SKIPPED`
- export/error log
- completed `VALIDATION.md`
- SHA-256 hash list for final model, texture, and evidence files

## Required Completion Output

- final `black_rhinoceros.bbmodel`
- texture file(s)
- validation evidence renders and reports
- completed `VALIDATION.md` with one final result: `PASS`, `REVISION_REQUIRED`, or `BLOCKER`
- concise revision summary describing any corrections made during validation
- explicit `REFERENCE_CONFLICT` report instead of output when an authority cannot be reconciled safely
