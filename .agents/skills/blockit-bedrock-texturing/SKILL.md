---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

Geometry/UV capabilities remain callable for bounded upstream correction in shared `AUTHORING`; Texturing **must not borrow Cube mutation**.

## Correction

**No Geometry↔Texturing phase switch.** Geometry defects → owner in-session. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation.

Entry: **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap blocker; reuse `box_uv_region`.
`UV Layout`=geometry→atlas; `Texture Styling`=pixels. `manage_material_instances` owns face `material_instance`.

## Direct Routing

Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
face aspect/density review → inspect_element(detail=uv) on affected/reuse owners
model-wide 1-pixel scale → inspect_element(detail=uv) → project_texel_density
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch
blank atlas resolution unknown → get_project_info once
atlas lifecycle → list_textures / activate_texture; create/read → create_texture / get_texture
base/material regions → draw_shape_tool
contiguous fill → paint_fill_tool
stepped value/form/detail → draw_shape_tool / paint_with_brush
erase bounded pixels → eraser_tool
PBR/material semantics → manage_material
mapped model-view evidence → capture_model_views
```

## UV Layout Quality Gate

`uv_audit.production_gate`=ready is technical hygiene, **not UV Layout PASS**. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. `inspect_element(detail=uv)` reports face pixel scale + `project_texel_density`. Material `review_required` → Geometry/UV before detailed paint; **never force detail into an undersized UV island with a larger brush/shape**. `localized_variance` may be intentional small detail.

## Primary vs Support Capabilities

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

## Conditional Support — Not Default Routing

These **must not enter the normal hot path** unless user intent specifically requires them:

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
Painter coordinates → texture pixels; keep in bounds
```

`create_texture` has a provisional **16×16** blank default. Production authoring must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

Known → invoke. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Styling

Use one **base-color atlas** for the whole model. Production UV: **128×128 default, 256×256 opt-in**. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

Define palette roles/value-hue ramp, material zones, face/form shading, contact/occlusion, edge/alpha/seam, identity marks, detail budget, and pixels per UV unit. generic palette, copied unrelated texture, or flat rectangles are invalid; reject random high-contrast noise.

`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`

Completion needs fresh `get_texture` pixels + mapped model-view evidence. Missing/unrelated → `FAIL | UNVERIFIED`.

`gradient_tool` is only for reference-supported continuous transition.

## Texture Verify

Reference + fresh `get_texture` + `capture_model_views` → UV → material → form → identity → microdetail → `FAIL | UNVERIFIED | PASS`.
`FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.

Animation required → `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=PASS; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
