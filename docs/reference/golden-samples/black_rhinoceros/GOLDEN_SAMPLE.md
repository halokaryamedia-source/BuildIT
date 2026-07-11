# Black Rhinoceros Golden Sample

- Status: `APPROVED`
- Package Type: `blockbench_reference`
- Sample Type: `golden_sample`
- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Target: Minecraft Bedrock Entity
- Validation Execution Status: `PENDING_BUILD`

## Purpose

This package is the canonical BuildIT Golden Sample for validating the full boundary between:

```text
ChatGPT reference preparation
→ approved Production Context
→ one approved Reference Visual
→ auto-generated technical package
→ Codex import
→ MCP-Blockbench geometry and texture production
→ post-build validation
→ final .bbmodel
```

The sample is intentionally complex enough to validate:

- organic smart-cuboid construction;
- a nontrivial parent-child hierarchy;
- written scale and ground-plane locks;
- cross-view silhouette consistency;
- front/rear horn differentiation;
- ears, four leg/foot chains, and a two-part tail;
- Classic Bedrock texture and UV planning;
- animation-ready pivots without authored clips;
- evidence-based final validation.

## Approved Scope

- Geometry: required
- Texture and UV: required
- Animation clips: skipped
- Animation-ready hierarchy: required
- Final Validation: required
- Final Model Filename: `black_rhinoceros.bbmodel`

## Canonical Image Policy

The package uses exactly one generated visual authority:

```text
black_rhinoceros_reference_visual.png
```

That single image contains:

- Left Side
- Front
- Back
- Top / Footprint
- Front-left 3/4
- scale marker
- technical footer

The original input is preserved separately as:

```text
source/original_reference.png
```

The source copy is not counted as generated output.

After Reference Visual approval:

```text
NO NEW REFERENCE IMAGE
NO NEW VIEWPOINT
NO NEW POSE
NO GEOMETRY SHEET
NO TEXTURE SHEET
NO ANIMATION OR MOTION SHEET
NO GHOST OR FORESHADOW MODEL
```

## Canonical Files

Runtime package files:

- `source/original_reference.png`
- `PRODUCTION_CONTEXT.md`
- `black_rhinoceros_reference_visual.png`
- `GEOMETRY.md`
- `TEXTURING.md`
- `ANIMATION.md`
- `VALIDATION.md`
- `reference_manifest.json`
- `CODEX_REFERENCE_HANDOFF.md`

Repository documentation may also include this `GOLDEN_SAMPLE.md` and the directory `README.md`; these explain selection and maintenance but do not add another runtime visual authority.

## Legacy Files Excluded

The following legacy multi-sheet files are not part of the current Golden Sample contract:

- `01_black_rhinoceros_form_scale_reference.png`
- `02_black_rhinoceros_construction_reference.png`
- `03_black_rhinoceros_texture_material_reference.png`
- `04_black_rhinoceros_motion_pivot_reference.png`

Technical construction, palette, UV, pivot, and validation information now belongs in Markdown and JSON, not additional generated images.

## Selection Rule

Codex may select this package directly when the user requests the BuildIT Black Rhinoceros Golden Sample or when runtime validation needs the canonical approved sample.

Codex must not:

- replace the package with loose images;
- search for a different subject when this package is present;
- use a numbered legacy sheet as visual authority;
- request additional technical reference images;
- report the Golden Sample as missing when all required canonical package files are available.

## Expected Production Result

A recognizable Minecraft-style Black Rhinoceros with:

- approved dimensions of `1.7 W × 3.3 D × 2.5 H` blocks;
- `27.2u W × 52.8u D × 40u H` global envelope;
- heavy elevated shoulder and long deep torso;
- broad low head and rectangular muzzle;
- two horns, with a dominant three-segment front horn and smaller two-segment rear horn;
- compact upright ears;
- four thick grounded legs and four foot blocks;
- short two-segment tail;
- warm gray-brown low-contrast hide;
- dark horns and hooves;
- Classic Bedrock `128 × 128` texture atlas;
- pivot-ready hierarchy;
- zero required animation clips.

## Conflict Rule

When the written context, approved Reference Visual, or technical package cannot be reconciled without guessing, use:

```text
REFERENCE_CONFLICT
```

Do not silently redesign, rescale, recolor, add parts, remove parts, or create another image.
