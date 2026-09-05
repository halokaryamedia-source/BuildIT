---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

Shared `AUTHORING` Runtime surface. Own Texture Atlas, Painter, PBR/material judgement, Texture Verify. Geometry/UV capabilities remain callable for bounded upstream correction; Geometry judgement stays with `blockbench-bedrock-modelling`.

## Shared Authoring Correction Boundary

A texture-discovered Geometry/UV defect is corrected in-session by the Geometry owner. **No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is only AUTHORING↔Animation, same task/chat.

Substantial styling entry: **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap blocker, reuse `box_uv_region`.

## Canonical Vocabulary

`UV Layout` = geometry→atlas; `Texture Atlas` = bitmap; `Texture Styling` = pixels; `Texture Verify` = atlas + mapped-model validation. `manage_material_instances` owns face `material_instance` state.

## Direct Routing

Reuse fresh state.

```text
global UV/atlas readiness      → list_textures (`uv_audit.production_gate`)
face mapping                   → inspect_elements(mode=detail) when needed
unlocked/invalid UV            → Geometry owner + bounded UV correction; no phase switch
blank atlas resolution unknown → get_project_info once
atlas lifecycle                → create_texture / activate_texture / get_texture
base/fill/detail/erase         → draw_shape_tool / paint_fill_tool / paint_with_brush / eraser_tool
supported smooth ramp          → gradient_tool
PBR/material semantics         → manage_material
face material instances        → manage_material_instances
mapped evidence                → capture_model_views
```

## UV Layout Quality Gate

Technical validity is not unwrap quality. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. Exact reuse is valid only when surfaces intentionally need the same pixels; directional/unique identity marks need suitable islands. Wrong mapping → fix UV first; invalidate only affected styling.

## Primary vs Support Capabilities

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

## Conditional Support — Not Default Routing

These must not enter the normal hot path unless user intent specifically requires them:

```text
gradient_tool | color_picker_tool | copy_brush_tool | paint_settings
create_brush_preset | load_brush_preset | texture_selection | texture_layer_management
add_texture_group | list_materials | get_material_info | import_texture_set
```

Support tools do not justify extra discovery/readback.

## First-Call Invariants

```text
blank create_texture → explicit width+height from project UV
data + fill_color → invalid
fill_color → layer_name required
pbr_channel → material TextureGroup `group` required
Painter coordinates → keep in bounds
```

`create_texture` has a provisional **16×16** blank default. Production authoring must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

Known → invoke. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Styling

One base-color atlas per model. Production UV is **128×128 default, 256×256 opt-in**. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

Use actual reference material/identity evidence. Define zones, value/hue, form/contact/edge/seam, identity marks, detail budget, **pixels per UV unit**. Flat color is provisional; reject random high-contrast noise.

`BASE → VALUE/FORM → IDENTITY → DETAIL → VERIFY`

Completion needs fresh `get_texture` pixels + mapped model views. Missing/unrelated evidence → `FAIL | UNVERIFIED`. `gradient_tool` is only for reference-supported continuous transition.

## Texture Verify / Animation Handoff

`FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same direction twice → `BLOCKED`.

Animation required → `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=PASS; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
