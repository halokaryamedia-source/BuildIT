---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

`ACTIVE PHASE: TEXTURING` only. Geometry owns geometry/rig/UV mutation; Texturing may inspect UV but **must not borrow Cube mutation**.

## Entry / Phase Boundary

Enter only after Geometry is explicitly user-approved and checkpointed.

```text
UV/geometry/rig correction required
→ HANDOFF_REQUIRED
  target_phase: geometry
  reason: <material blocker>
  readiness: <failed prerequisite>
  resume_from: <current target>
→ switch_authoring_phase through Gateway
→ refresh Runtime catalog
→ continue same task
```

Reopen Geometry only for a material Geometry-owned blocker that prevents correct Texturing; do not bounce phases for optional improvements.

Entry technical prerequisite: final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap blocker, reuse `box_uv_region`.

## Canonical Vocabulary

`UV Layout` = geometry→atlas; `Texture Atlas` = bitmap; `Texture Styling` = color/material/detail; `Texture Verify` = atlas + mapped-model validation. `manage_material_instances` owns face `material_instance` state.

## Direct Routing

Reuse fresh state.

```text
global UV/atlas readiness      → list_textures (`uv_audit.production_gate`)
face-specific mapping          → inspect_elements(mode=detail) only when needed
unlocked/invalid UV            → HANDOFF_REQUIRED(geometry)
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

## Primary vs Support

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

Conditional support only when user intent specifically requires it:

```text
gradient_tool | color_picker_tool | copy_brush_tool | paint_settings
create_brush_preset | load_brush_preset | texture_selection | texture_layer_management
add_texture_group | list_materials | get_material_info | import_texture_set
```

Support tools do not justify extra discovery/readback and never outrank primary authoring.

## First-Call Invariants

```text
blank create_texture → explicit width+height from project UV
data + fill_color    → invalid
fill_color           → layer_name required
pbr_channel          → material TextureGroup `group` required
Painter coordinates  → texture pixels; keep in bounds
```

`create_texture` has a provisional 16×16 blank default. Production authoring must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

Known capability → invoke. Unknown/stale → one `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Styling

Use one base-color atlas, not one per body part/Cube. Production UV is **128×128 default, 256×256 opt-in**. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

Define palette roles, value/hue ramp, material zones, face shading, contact/occlusion, edge, alpha, seam, identity marks, detail budget, and pixels per UV unit. Flat color is BASE PASS only; reject random high-contrast noise.

```text
BASE PASS             → draw_shape_tool / paint_fill_tool
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush
IDENTITY PASS         → paint_with_brush
SECONDARY DETAIL PASS → controlled detail
VERIFY                → Texture Verify
```

`gradient_tool` is only for reference-supported continuous transition. Same-color detail → one `paint_with_brush` batch with `connect_strokes=false`.

## Internal Verify / User Approval

Use the Approved Reference + fresh `get_texture` + internal `capture_model_views` when visual comparison is needed. Review UV → material → form → identity → microdetail.

Internal verdict: `FAIL | UNVERIFIED | PASS`. `FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice without new evidence → `BLOCKED`.

Internal Texture `PASS` means **READY_FOR_USER_REVIEW**, not approval. User inspects the live Blockbench result.

```text
revision request → continue Texturing
explicit approve → Texturing APPROVED → checkpoint save
```

Only after explicit approval may the router hand off to Animation when required or proceed to Finalization for static assets.
