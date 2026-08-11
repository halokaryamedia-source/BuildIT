---
name: blockit-bedrock-texturing
description: Specialist for Minecraft Bedrock Entity texture work through BlockIT MCP: texture creation/application, pixel painting, paint settings, layers/selections, PBR TextureGroup materials, channel assignment, and per-face material_instance metadata. Use after geometry is coherent or when revising an existing asset's surface. Do not use generic Mesh UV workflows.
---

# BlockIT Bedrock Texturing

Own the **surface-authoring workflow** for a Bedrock Entity asset. Geometry and pivot judgement remain with `blockbench-bedrock-modelling`.

## Start With Existing State

Reuse identity/metadata already returned by the current workflow. For an existing or externally changed asset whose required state is not already known:

1. `list_textures` to identify texture UUID/ID/name and active assignments.
2. `get_texture` only when image evidence is needed.
3. `list_materials` / `get_material_info` before changing PBR TextureGroups when the required material state is not already known.
4. `get_face_material_instances` or `list_material_instances` before changing per-face material metadata when those assignments are not already known.
5. Use explicit targets; prefer UUIDs once discovered.

If the geometry is reference-driven and still structurally wrong, return to the modelling specialist before painting. Texture must not hide a broken primary form.

## Texture Readiness Gate

For end-to-end reference-driven creation, production texturing begins only after the complete geometry review has `PASS` for the surfaces/shape relationships the texture depends on. If a material geometry `FAIL` remains, return to modelling. If a required geometry claim is `UNVERIFIED`, resolve it or report `BLOCKED` instead of painting over the uncertainty.

For a texture-only revision on an existing asset, treat the current geometry as the user-provided baseline unless geometry correction is explicitly in scope. Do not claim that baseline is reference-accurate merely because texturing can proceed.

A minimal flat/placeholder texture may be used early when it is genuinely needed to see the model clearly. Mark it provisional; do not spend polish/detail effort on it and do not use it as evidence that the asset is close to finished.

If geometry changes after production texture work starts, re-check only the affected downstream state: Cube/face identity, UV assumptions, texture assignment, material instances, painted alignment, and PBR channel relationships as applicable. Downstream sunk cost never justifies keeping geometry that the modelling gate has rejected.

## Texture Management

Use the actual BlockIT texture tools:

- `create_texture`
- `list_textures`
- `get_texture`
- `activate_texture`
- `add_texture_group`

`apply_texture` is intentionally not enabled for Bedrock Entity. Native Bedrock Entity is a `single_texture` format, so use `activate_texture` to choose the active/default working texture. Use Painter operations for pixel changes and material-instance tools for native per-face material metadata.

Do not route normal Bedrock work through generic per-face `Texture.apply()` semantics.

## Paint

Available Painter-backed operations include:

- `paint_fill_tool`
- `draw_shape_tool`
- `gradient_tool`
- `paint_with_brush`
- `eraser_tool`
- `color_picker_tool`
- `copy_brush_tool`
- `paint_settings`
- `texture_selection`
- `texture_layer_management`
- brush preset create/load helpers

These depend on Blockbench's live Painter runtime. Source/CI validation does not replace local rendered/runtime proof.

Prefer bounded, deliberate pixel operations. Use pixel-perfect/mirroring only when the texture design supports it. Avoid procedural noise merely to make a surface look detailed.

## Native Bedrock PBR

PBR is part of Blockbench's native Bedrock format and is valid when the requested asset uses it.

Use:

- `create_pbr_material`
- `configure_material`
- `list_materials`
- `get_material_info`
- `assign_texture_channel`
- `import_texture_set` only when importing an existing Bedrock texture-set is explicitly required
- `save_material_config` only when a filesystem deliverable is requested

Channel work may include color, normal, height, MER, and supported uniform values/subsurface fields. Inspect the existing material before replacing a channel.

## Per-Face Material Instances

`material_instance` is native Bedrock geometry face metadata and is **not the same thing as a PBR TextureGroup**.

Use:

- `get_face_material_instances`
- `list_material_instances`
- `set_face_material_instance`
- `bulk_set_material_instances`
- `clear_material_instances`

For bulk mutation, preflight all Cube identities and face intent first. Do not assign arbitrary material-instance names as decoration when the pack/entity contract does not require them.

## UV Boundary

BlockIT removed the generic Mesh-only UV tool family. Do not use upstream instructions such as `auto_uv_mesh`, `set_mesh_uv`, or `rotate_mesh_uv`.

Cube face/box-UV semantics remain a protected Bedrock capability. Use the Cube/texture fields exposed by the actual current tools, and do not claim full Cube UV authoring coverage where a direct tool contract is still partial.

## Verification

After a material surface change:

- reuse mutation-returned identity/metadata when it already proves the required authored state; do not re-list/re-read it only for confirmation;
- `create_texture` already returns texture identity/size/group/channel/render metadata, so use `get_texture` only when pixel output itself matters;
- use `get_material_info` or material-instance reads when the mutation result does not expose configuration/face state required for the completion claim;
- use canonical model views when the surface must be judged on the model;
- distinguish structural success from visual quality;
- keep PBR appearance claims bounded because final RTX/in-game rendering is outside MCP source proof.
