# Bedrock Entity Capability Surface Audit

Updated: 2026-08-10

Status: **Active evidence for MCP reduction**

## Purpose

Determine what the BlockIT MCP must preserve for the Minecraft Bedrock Entity workflow before deleting legacy/generic capability families.

This audit distinguishes three things that must not be conflated:

1. **native Blockbench Bedrock Entity support** — capabilities enabled by the official `bedrock` `ModelFormat` and its codecs;
2. **BlockIT core product scope** — the smaller Cube/Cuboid-first modelling workflow recorded in `CONTEXT.md`;
3. **legacy/generic MCP breadth** — capabilities inherited from the broader Blockbench MCP foundation that are not part of the native Bedrock Entity path.

A capability is not deleted merely because it is not used in every model. Native Bedrock Entity support is retained unless the product explicitly decides to remove that optional capability. The first deletion slice therefore targets only capabilities that are clearly outside native Bedrock Entity.

## Official Blockbench source reviewed

Repository:

```text
JannisX11/blockbench
branch: master
```

Primary owners:

```text
js/formats/bedrock/bedrock.js
js/formats/bedrock/bedrock_animation.js
js/io/format.ts
```

Additional official ecosystem evidence:

```text
JannisX11/blockbench-plugins/plugins.json
```

The plugin registry is used only to distinguish optional plugin formats/extensions from Blockbench's native Bedrock Entity format.

## Native Bedrock Entity format flags

The official `bedrock` `ModelFormat` explicitly enables:

```text
rotate_cubes
box_uv
optional_box_uv
uv_rotation
single_texture
bone_rig
centered_grid
animated_textures
animation_files
animation_mode
animation_controllers
bone_binding_expression
locators
texture_meshes
bounding_boxes
pbr
```

The same format does **not** enable generic:

```text
meshes
armature_rig
splines
billboards
```

`ModelFormat` boolean properties default false unless explicitly enabled, except documented defaults such as `edit_mode` and `paint_mode`, which default true. Therefore absence of `meshes` / `armature_rig` from the Bedrock Entity format is meaningful rather than an omitted true default.

## Geometry codec evidence

The Bedrock geometry codec parses/compiles bone hierarchy through Blockbench `Group` objects.

Within each exported Group/bone, the official codec serializes:

```text
Cube
Locator / NullObject as locator data
TextureMesh
```

The codec does **not** serialize generic `Mesh` objects as Bedrock Entity geometry.

Cube serialization includes:

```text
origin / size
optional inflate
optional pivot / rotation
box UV or per-face UV
UV rotation
mirror UV
optional per-face material_instance
```

This means the following distinctions are important:

- generic `Mesh` is not the same thing as Bedrock `TextureMesh`;
- cube UV support must remain even if the current mesh-only MCP UV family is removed;
- `material_instance` cannot be declared categorically "Bedrock Block only" from local MCP descriptions, because the official Bedrock geometry codec can parse and compile it on cube face UV data.

## Animation codec evidence

The official Bedrock animation codec is native to the `bedrock` format.

It reads/writes animations around:

```text
Animation
Group-backed BoneAnimator
position / rotation / scale keyframe channels
animation loop/length and Molang fields
EffectAnimator sound keyframes
EffectAnimator particle keyframes
EffectAnimator timeline/script keyframes
animation controller files
```

Therefore Bedrock animation is core format capability and must not be removed merely because current TypeScript debt exists in `animation.ts` or `animation-inspection.ts`.

## Texture / paint evidence

Native Bedrock Entity explicitly enables:

```text
single_texture
animated_textures
pbr
```

`paint_mode` defaults true at the ModelFormat layer. Therefore texture authoring/inspection and paint capability are Bedrock-relevant surfaces.

BlockIT may still trim broad paint or PBR automation to the minimum proven workflow, but those families are **not** classified as unrelated-to-Bedrock deletions by this audit.

## Hytale evidence

Hytale is not the Bedrock Entity format. The official Blockbench plugin registry exposes Hytale as a separate plugin contributing:

```text
hytale_character
hytale_prop
```

Therefore BlockIT Hytale tools/resources/prompts are unrelated to the Bedrock Entity product boundary.

## Generic Mesh evidence

Native Bedrock Entity does not enable the `meshes` ModelFormat feature.

The official Blockbench plugin registry separately lists the `Meshy` plugin as enabling meshes in Bedrock formats and exporting them to Minecraft Bedrock. This is additional evidence that generic Mesh support is an extension rather than the native Bedrock Entity surface.

BlockIT's current `mcp/server/tools/mesh.ts` operates on generic `Mesh`, not Bedrock `TextureMesh`.

## Armature evidence

Native Bedrock Entity enables `bone_rig`, where Groups act as bones. It does not enable `armature_rig`.

BlockIT's current `mcp/server/tools/armature.ts` operates on:

```text
Armature
ArmatureBone
Mesh vertex weights
```

That is a different rigging model from the native Bedrock Entity Group/Cube bone hierarchy.

## Current MCP UV family evidence

`mcp/server/tools/uv.ts` currently exposes only:

```text
set_mesh_uv
auto_uv_mesh
rotate_mesh_uv
```

Every tool resolves and mutates generic Mesh faces/vertices. It does not own Cube UV.

Cube UV remains represented directly in `mcp/server/tools/cubes.ts` through face UV, auto UV, `uv_offset`, `mirror_uv`, and related Cube fields. Therefore removing the current **mesh-only UV family** does not remove Bedrock Cube UV support.

## Material instance caution

`mcp/server/tools/material-instances.ts` currently describes its behavior as Bedrock Block material-instance management.

Do **not** delete it solely from that local description. Official Bedrock geometry source also maps cube-face `material_instance` during parse/compile. Its correct BlockIT treatment therefore needs a narrower product decision / implementation audit rather than an "unrelated format" deletion.

## Capability classification

| Capability / family | Native Bedrock Entity | BlockIT action from this audit |
|---|---:|---|
| Project orientation | Yes / cross-cutting | KEEP |
| Cube/Cuboid geometry | Yes | KEEP |
| Group hierarchy as bones | Yes | KEEP |
| Cube UV / UV rotation / box UV | Yes | KEEP |
| Generic Mesh | No | REMOVE |
| Mesh-only MCP UV tools | No | REMOVE with generic Mesh |
| Armature / ArmatureBone / vertex weights | No | REMOVE |
| Hytale tools/resources/prompts | No | REMOVE |
| Bedrock TextureMesh | Yes | PRESERVE; do not confuse with generic Mesh |
| Locators / NullObject locator data | Yes | PRESERVE |
| Bounding boxes | Yes | PRESERVE / no current removal justification |
| Animation / BoneAnimator | Yes | KEEP |
| Animation controllers | Yes | PRESERVE |
| Sound / particle / timeline animation effects | Yes | PRESERVE |
| Texture create/apply/read | Yes | KEEP |
| Paint mode | Yes | KEEP/TRIM only from workflow evidence |
| PBR | Yes | PRESERVE; optional product treatment later |
| Cube-face material_instance | Present in official codec | PRESERVE pending narrower audit |
| History / Undo / Redo | Cross-cutting safety | KEEP |
| Canonical model capture | Cross-cutting proof | KEEP |
| Generic camera manipulation | Not format-specific | TRIM/REMOVE only after core proof parity |
| Generic codec/path export | Not Bedrock-core | TRIM later; preserve current Bedrock export outcome |
| Generic UI automation/eval | Not Bedrock-core | Separate removal audit; `risky_eval` already quarantined |
| `from_geo_json` | Not native Bedrock Entity contract | REMOVE candidate already quarantined |

## Safe first removal slice

The following are sufficiently proved as outside native Bedrock Entity and may be removed without deciding optional native Bedrock capabilities:

```text
Hytale integration
Generic Mesh tool family
Armature / vertex-weight tool family
Current mesh-only UV tool family
```

Required companion cleanup must remove their registrations/manifests and generic-Mesh branches from shared Bedrock-core tools where those branches only existed to support the removed generic Mesh surface.

## Explicitly not part of the first removal slice

Do not remove or broadly rewrite yet:

```text
TextureMesh
Locators
Bounding boxes
Animation / animation controllers
Texture / Paint
PBR
material_instance semantics
Cube UV
History
canonical visual capture
Bedrock current-format export
```

## Relationship to P0.4

The full-package typecheck gate exposed large compile-time debt in both relevant and irrelevant families.

The current product decision is to reduce the repository toward the actual Bedrock Entity surface rather than spend effort type-hardening clearly unrelated legacy families. The safe removal slice above should run before deciding how much TypeScript remediation remains necessary for the retained Bedrock Entity package.

This does **not** weaken the P0.4 requirement: the final retained package must still pass full `tsc --noEmit`. It changes which source is legitimately part of that package.
