---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter operations, native PBR TextureGroups/channels, and per-face material_instance metadata. Use after dependent geometry is coherent or for a scoped existing-asset surface revision.
---

# BlockIT Bedrock Texturing

Own surface authoring only. Geometry/pivot judgement remains with `blockbench-bedrock-modelling`.

## Start With Existing State

**Reuse identity/metadata already returned by the current workflow.** Read only missing state:

- `list_textures` for texture identity when unknown;
- `get_texture` only when pixel/image evidence matters;
- `list_materials` / `get_material_info` when PBR state is unknown;
- material-instance reads when face assignments are unknown.

Prefer explicit UUIDs after discovery.

## Readiness

For end-to-end reference work, production texturing starts after the geometry it depends on has `PASS`. Material geometry `FAIL` returns to modelling; required `UNVERIFIED` becomes `BLOCKED` rather than being painted over.

For a texture-only revision on an **existing asset**, current geometry is the user-provided baseline unless geometry correction is in scope. **Do not claim that baseline is reference-accurate** merely because texturing can proceed.

A flat/placeholder texture may be provisional when needed for visibility, but do not polish it as fake progress. If geometry changes after production texturing begins, **re-check only the affected downstream state**: Cube/face identity, UV assumptions, assignments, painted alignment, material instances, and PBR channel relationships as applicable.

## Texture / Paint

Normal texture lifecycle:

```text
create_texture
list_textures          only when identity is unknown
get_texture            only for image evidence
activate_texture
add_texture_group      when grouping/material ownership is needed
```

`apply_texture` is intentionally not enabled for normal Bedrock Entity work because native Bedrock Entity is `single_texture`. Use the active/default texture plus Painter operations; do not route through generic per-face `Texture.apply()` semantics.

Painter tools own deliberate pixel edits (`paint_fill_tool`, shapes, gradient, brush, eraser, picker/copy, settings, selections/layers/presets). Use bounded operations; avoid procedural noise whose only purpose is to look detailed.

## Native Bedrock PBR

Use native PBR only when the asset requires it:

```text
create_pbr_material
configure_material
list_materials / get_material_info
assign_texture_channel
import_texture_set      only for an explicit existing texture-set import
save_material_config   only for a filesystem deliverable
```

Inspect existing material state before replacing channels. Keep color/normal/height/MER identity deterministic.

## Material Instances / UV Boundary

`material_instance` is native Bedrock face metadata, distinct from a PBR TextureGroup. Use the dedicated read/set/bulk/clear tools with explicit Cube/face intent.

Generic Mesh UV tools are outside BlockIT Bedrock Entity. Do not claim direct Cube UV coverage beyond the fields actually exposed by current Cube/texture contracts.

## Verification

After a surface mutation, reuse returned state and **do not re-list/re-read it only for confirmation**. **`create_texture` already returns texture identity/size/group/channel/render metadata**; call `get_texture` only when pixels themselves must be judged.

Read material/material-instance state only when the mutation result does not prove the completion claim. Use model views only when appearance on geometry matters, and keep RTX/in-game appearance claims bounded to evidence actually available.
