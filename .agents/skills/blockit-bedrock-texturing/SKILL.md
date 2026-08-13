---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Own surface authoring only. Geometry/pivot judgement remains with `blockbench-bedrock-modelling`.

## Direct Routing

Decide from intent + known state before discovery. **Reuse identity/metadata already returned by the current workflow.**

```text
texture missing                       → create_texture
texture identity unknown              → list_textures
pixels/image evidence required        → get_texture
set active/default working texture    → activate_texture
group/material ownership needed       → add_texture_group
bounded pixel edit                    → exact Painter tool
new native PBR material               → create_pbr_material
known existing PBR material edit      → configure_material
PBR identity unknown                  → list_materials
known material detail required        → get_material_info
assign color/normal/height/MER channel→ assign_texture_channel
existing texture-set import           → import_texture_set
filesystem material deliverable       → save_material_config
material_instance read/set/bulk/clear → dedicated material-instance tool
```

Known identity skips list/discovery. `get_texture` is only for pixel/image evidence, not confirmation. Painter intent names the actual action (fill/shape/gradient/brush/erase/pick/copy/settings/layer/selection/preset), not merely "paint".

## Deferred Spec Loading

After routing, load a missing spec with the **exact tool name** + specific action; never raw user wording alone.

```text
get_texture            → "get_texture read texture image pixels"
configure_material     → "configure_material edit existing PBR material"
assign_texture_channel → "assign_texture_channel assign PBR texture channel"
texture_selection      → "texture_selection rectangle invert texture selection"
```

If the exact spec is loaded, call it directly.

## Stage / Anti-Loop

Use `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- `DISCOVER` only when texture/material/face identity required next is unknown/stale.
- After mutation, reuse returned state; **do not re-list/re-read it only for confirmation**.
- Bounded surface mismatch → correct that state, then verify affected appearance; do not restart broad discovery.
- Validation failure keeps the selected capability unless identity/state became stale/unknown.

## Readiness

For end-to-end reference work, production texturing starts after dependent geometry has `PASS`. Material geometry `FAIL` returns to modelling; required `UNVERIFIED` becomes `BLOCKED`.

For a texture-only revision on an **existing asset**, current geometry is the user-provided baseline unless geometry correction is in scope. **Do not claim that baseline is reference-accurate** merely because texturing can proceed.

A flat/placeholder texture may be provisional for visibility. If geometry changes after production texturing begins, **re-check only the affected downstream state**: Cube/face identity, UV assumptions, assignments, painted alignment, material instances, and PBR channel relationships as applicable.

## Native Bedrock PBR

`apply_texture` is intentionally not enabled for normal Bedrock Entity `single_texture` work; **use `activate_texture` to choose the active/default working texture**, then use Painter operations rather than generic per-face `Texture.apply()` semantics.

`material_instance` is Bedrock face metadata, distinct from a PBR TextureGroup. Generic Mesh UV tools stay outside BlockIT Bedrock Entity. For Box-UV Cubes, `uv_offset`, `mirror_uv`, and `autouv` are intentional authored layout state: use `modify_cube` for one known Cube or `modify_cubes_batch` for a coherent known set. Intentional reuse/mirroring is valid; accidental overlap is not.

Logical project UV resolution and bitmap pixel dimensions are separate facts; do not assume equality, power-of-two sizing, or a packing-density target. Inspect existing PBR state before replacing channels. Keep color/normal/height/MER identity deterministic.

## Verification

`create_texture` already returns texture identity/size/group/channel/render metadata. Read material/material-instance state only when mutation output does not prove the completion claim. Use model views only when appearance on geometry matters; keep RTX/in-game claims bounded to available evidence.
