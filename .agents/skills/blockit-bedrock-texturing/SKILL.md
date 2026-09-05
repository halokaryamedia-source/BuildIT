---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

Shared `AUTHORING` Runtime surface. This skill owns Texture Atlas, Painter, PBR/material judgement, and Texture Verify. Geometry/UV capabilities remain callable for bounded upstream correction, but Geometry judgement stays with `blockbench-bedrock-modelling`; Texturing **must not borrow Cube mutation** as its own judgement lane.

## Shared Authoring Correction Boundary

A texture-discovered Geometry/UV defect does **not** require a Geometry↔Texturing phase switch. Route judgement to Geometry owner, use the exact geometry capability in the same AUTHORING session, then re-run affected UV/texture evidence only. `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is reserved for AUTHORING↔Animation; same task/chat.

Entry: **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap blocker, reuse `box_uv_region`.

## Canonical Vocabulary

`UV Layout` = geometry→atlas; `Texture Atlas` = bitmap; `Texture Styling` = color/material/detail; `Texture Verify` = atlas + mapped-model validation. `manage_material_instances` owns face `material_instance` state.

## Direct Routing

Reuse fresh state; atlas lifecycle: `list_textures / activate_texture`.

```text
global UV/atlas readiness      → list_textures (`uv_audit.production_gate`)
face-specific mapping          → inspect_elements(mode=detail) only when needed
unlocked/invalid UV            → Geometry owner + bounded UV correction; no phase switch
blank atlas resolution unknown → get_project_info once
create/select/read atlas       → create_texture / activate_texture / get_texture
base/material regions          → draw_shape_tool
contiguous fill                → paint_fill_tool
stepped value/form/detail      → draw_shape_tool / paint_with_brush
erase bounded pixels           → eraser_tool
supported smooth ramp          → gradient_tool
PBR/material semantics         → manage_material
face material instances        → manage_material_instances
mapped model-view evidence     → capture_model_views
```

## UV Layout Quality Gate

Technical validity is not unwrap quality. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. Exact reuse is valid only when surfaces intentionally need the same pixels. Directional or unique identity marks need suitable islands. Wrong mapping → fix UV Layout first and invalidate only affected styling.

## Primary vs Support Capabilities

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

## Conditional Support — Not Default Routing

Must not enter the normal hot path unless user intent specifically requires them:

```text
gradient_tool | color_picker_tool | copy_brush_tool | paint_settings
create_brush_preset | load_brush_preset | texture_selection | texture_layer_management
add_texture_group | list_materials | get_material_info | import_texture_set
```

Support tools do not justify extra discovery/readback.

## First-Call Invariants

```text
blank create_texture → explicit width+height from project UV
data + fill_color    → invalid
fill_color           → layer_name required
pbr_channel          → material TextureGroup `group` required
Painter coordinates  → texture pixels; keep in bounds
```

`create_texture` has a provisional **16×16** blank default. Production authoring must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

Known → invoke. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Styling

Use one **base-color atlas** for the whole model, not one per body part/Cube. Production UV is **128×128 default, 256×256 opt-in**. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

For reference-grounded assets, the approved reference is a required styling input. Build palette roles and material-aware value/hue ramp from actual evidence; do not substitute a generic palette, copied unrelated texture, or a handful of flat rectangles. Define material zones, face shading, contact/occlusion, edge/alpha/seam, identity marks, detail budget, and pixels per UV unit. Flat color is BASE PASS only; reject random high-contrast noise.

```text
BASE PASS             → draw_shape_tool / paint_fill_tool
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush
IDENTITY PASS         → paint_with_brush
SECONDARY DETAIL PASS → controlled detail
VERIFY                → Texture Verify
```

Texture Styling is not complete until fresh `get_texture` evidence shows authored material/form/detail pixels and fresh mapped model-view evidence shows those pixels on intended surfaces. If either evidence is missing or unrelated to the approved reference, mark `FAIL` or `UNVERIFIED`.

`gradient_tool` is only for reference-supported continuous transition. Same-color detail → one `paint_with_brush` batch with `connect_strokes=false`.

## Texture Verify / Visual Convergence

Use approved reference + fresh `get_texture` + `capture_model_views`. Review UV → material → form → identity → microdetail. Verdict: `FAIL | UNVERIFIED | PASS`. `FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.

When Animation is required, `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=PASS; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
