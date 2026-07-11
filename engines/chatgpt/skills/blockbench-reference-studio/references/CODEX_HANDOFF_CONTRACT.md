# Codex Handoff Contract

## Purpose

The final ChatGPT package is an approved design contract. Codex may validate and execute it but must not reinterpret or redesign it.

## Required package root

```text
<asset_id>_blockbench_reference/
```

Required files:

```text
source/
PRODUCTION_CONTEXT.md
<asset_id>_reference_visual.png
01_<asset_id>_form_scale_reference.png
02_<asset_id>_construction_reference.png
03_<asset_id>_texture_material_reference.png
04_<asset_id>_motion_pivot_reference.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

## Import destination

```text
workspace/active/<asset_id>/mcp/references/
```

Receives:

- Production Context
- stage contracts
- manifest
- Codex handoff
- approved source package metadata

```text
workspace/active/<asset_id>/blockbench/references/
```

Receives:

- four approved sheets
- standardized reference visual
- user-facing source images useful to the modeller

## Validation before production

Codex must verify:

- package root and asset ID;
- required files;
- manifest schema;
- file hashes;
- approval status;
- visual alias identity;
- format, UV, scale, and front direction;
- animation-required decision;
- no reference conflict.

Failure result:

```text
BLOCKER: ASSET_REFERENCE_PACKAGE_INVALID
```

## Runtime mapping

```text
PRODUCTION_CONTEXT.md
reference_manifest.json
Sheet 01
GEOMETRY.md
→ Geometry

Sheet 02
Sheet 03
TEXTURING.md
→ Texture

Sheet 04
ANIMATION.md
→ optional Animation

all approved files
VALIDATION.md
→ Final Validation
```

## Non-negotiable boundaries

Codex must not:

- regenerate the reference sheets;
- change approved dimensions;
- introduce new parts or materials;
- replace the approved asset identity;
- infer animation when `ANIMATION_SKIPPED` is approved;
- continue through a user review gate automatically.

When references conflict, stop with `REFERENCE_CONFLICT` and name the conflicting files and decisions.
