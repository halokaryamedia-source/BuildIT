---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Own surface authoring only. Geometry/pivot judgement stays with `blockbench-bedrock-modelling`.

## Direct Routing

Route from intent + known state. **Reuse identity/metadata already returned by the current workflow.**

```text
texture missing                    → create_texture
texture identity unknown           → list_textures
pixel/image evidence               → get_texture
active/default texture             → activate_texture
texture group                      → add_texture_group
bounded pixel edit                 → exact Painter tool
new / edit PBR                     → create_pbr_material / configure_material
PBR discovery/detail               → list_materials / get_material_info
PBR channel                        → assign_texture_channel
texture-set import                 → import_texture_set
material file                      → save_material_config
material_instance read/write       → dedicated material-instance tool
```

Known identity skips discovery. `get_texture` is evidence, not confirmation. Painter intent names the actual action.

## Deferred Spec Loading / Stage

Load a missing spec by **exact tool name** + action; otherwise call it directly. Use `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- Discover only unknown/stale state.
- Reuse mutation output; **do not re-list/re-read it only for confirmation**.
- Bounded mismatch → correct then verify affected appearance.
- Validation failure keeps the capability unless state became stale/unknown.

## Readiness

For end-to-end reference work, production texturing starts after dependent geometry has `PASS`. Material geometry `FAIL` returns to modelling; required `UNVERIFIED` becomes `BLOCKED`.

For a texture-only revision on an **existing asset**, use current geometry as baseline. **Do not claim that baseline is reference-accurate** merely because texturing can proceed. A **flat/placeholder texture** may be provisional. If geometry changes after production texturing begins, **re-check only the affected downstream state**: Cube/face identity, UV assumptions, assignments, painted alignment, material instances, and PBR channels.

## Minecraft-First Reference Texture

Reference is surface guidance, not exact pixel replication. Preserve:

```text
base palette
major color/material regions
part separation
identity-critical markings
required material/PBR meaning
```

Prefer Minecraft-readable pixels over photoreal micro-detail, dense noise, wrinkles, or baked lighting. Texture supports geometry; **do not paint fake silhouette or missing required form**.

A **minor reference discrepancy**—small shade/noise or non-critical marking drift—does not block. Choose one canonical surface: **explicit user requirement → original Source evidence → best-supported approved reference view(s) → simplest Minecraft-readable texture**.

Only a material surface contradiction affecting identity-critical marking, required material region/channel, part separation, or Minecraft readability becomes `BLOCKED`. **Do not average conflicting material evidence**.

## Native Bedrock PBR / UV

`apply_texture` is intentionally not enabled for normal Bedrock Entity `single_texture` work; **use `activate_texture` to choose the active/default working texture**, then Painter operations.

`material_instance` is Bedrock face metadata, distinct from a PBR TextureGroup. Generic Mesh UV tools stay outside BlockIT Bedrock Entity. For **Box-UV Cubes**, `uv_offset`, `mirror_uv`, and `autouv` are authored layout state; use `modify_cube` or `modify_cubes_batch`. Intentional reuse/mirroring is valid; accidental overlap is not.

Logical project UV resolution and bitmap pixel dimensions are separate facts; do not assume equality, power-of-two sizing, or a packing-density target. Inspect existing PBR state before replacing channels. Keep color/normal/height/MER identity deterministic.

## Verification

`create_texture` already returns texture identity/size/group/channel/render metadata. Read material/material-instance state only when mutation output cannot prove completion. Use model views when appearance matters; keep RTX/in-game claims bounded to evidence.
