---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

`ACTIVE PHASE: TEXTURING` only. Geometry owns geometry/rig/UV mutation.

## Phase Boundary

May inspect/audit UV state but must not borrow Cube mutation.

```text
UV/geometry/rig correction required
→ HANDOFF_REQUIRED
  target_phase: geometry
  reason: <defect>
  readiness: <failed gate>
  resume_from: <current target>
  action: set MCP Authoring Phase=geometry; reload BlockIT MCP
→ STOP
```

Entry: final Box UV locked with `autouv=0`; no invalid/out-of-bounds/partial-overlap blocker; reuse `box_uv_region`.

## Canonical Vocabulary

`UV Layout` = geometry→atlas; `Texture Atlas` = bitmap/PNG; `Texture Styling` = color/material/shading/detail; `Texture Verify` = fresh atlas + mapped-model validation. `create_texture` = Texture Atlas; Painter = Texture Styling; `material_instance` stays here.

## Direct Routing

Reuse fresh state; load exact spec only when needed.

```text
global UV/atlas readiness       → list_textures (`uv_audit.production_gate`)
face-specific mapping           → inspect_element only when needed
unlocked/invalid UV        → HANDOFF_REQUIRED(geometry)
blank atlas resolution unknown  → get_project_info once; known handoff state skips it
create atlas bitmap             → create_texture
inventory/select                → list_textures / activate_texture
base/material regions           → draw_shape_tool
contiguous base fill            → paint_fill_tool
stepped value/form/detail       → draw_shape_tool / paint_with_brush
supported smooth ramp           → gradient_tool
PBR/material semantics          → create_pbr_material / configure_material / assign_texture_channel
fresh atlas image               → get_texture
mapped model-view evidence      → capture_model_views
```

Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`, or another Geometry mutation while Texturing is active.

## Conditional Support — Not Default Routing

These **must not enter the normal hot path unless user intent specifically requires** them:

```text
color_picker_tool | copy_brush_tool | eraser_tool | paint_settings
create_brush_preset | load_brush_preset | texture_selection | texture_layer_management
add_texture_group | import_texture_set | save_material_config
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

Current `create_texture` has a provisional **16×16** blank default. Production Codex must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

## Deferred Spec Loading

Load routed spec only when needed. Known identity skips broad discovery; do not re-list/re-read it only for confirmation.

## Texture Atlas

Use one base-color atlas for the model, not one per body part/Cube. Production logical UV is **128×128 default, 256×256 opt-in**. Pin atlas UUID and pass `texture_id` when multiple textures are loaded. PBR normal/height/MER are support atlases.

## Texture Styling

Define **palette roles**, value/hue ramp, material zones, face shading, contact/occlusion, edge, alpha, seam, **identity marks**, detail budget, and pixels per UV unit. Flat color is a **BASE PASS only**; reject random high-contrast noise.

```text
BASE PASS             → draw_shape_tool / paint_fill_tool
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush
IDENTITY PASS         → paint_with_brush
SECONDARY DETAIL PASS → controlled detail
VERIFY                → Texture Verify
```

`gradient_tool` is only for reference-supported continuous transition. Same-color detail → one `paint_with_brush` batch with `connect_strokes=false`.

## Texture Verify / Visual Convergence

Use approved reference + fresh `get_texture` + `capture_model_views`. Review UV → material → form → identity → microdetail. Verdict: `FAIL | UNVERIFIED | PASS`. `FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
