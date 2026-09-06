---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is only AUTHORING↔Animation; same task/chat.
Entry: **Geometry APPROVED + UV Layout PASS**, **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap. `UV Layout`=mapping; `Texture Styling`=pixels. `manage_material_instances` owns face `material_instance`.
`unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch`.

## Direct Routing
Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
blank atlas resolution unknown → get_project_info once
atlas lifecycle → list_textures / activate_texture; create/read → create_texture / get_texture
base/material regions → draw_shape_tool
contiguous fill → paint_fill_tool
stepped detail → draw_shape_tool / paint_with_brush
erase bounded pixels → eraser_tool
PBR/material semantics → manage_material / manage_material_instances
mapped model-view evidence → capture_model_views
```

## UV Layout Quality Gate
`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. Stretched/squashed face → Geometry/UV; no paint compensation.

## Conditional Support — Not Default Routing
Conditional on user intent, not normal hot path:
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool` requires reference-supported continuous transition; no extra discovery/readback.

## First-Call Invariants
`blank create_texture → explicit width+height from project UV`
`create_texture`: provisional **16×16** blank; **not omit blank Atlas size**. **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.
Known → invoke; unknown → `search_capabilities`; schema → `describe_capability` once. No confirmation rereads.

**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.** UV islands are pixel authority.

## Reference-Grounded Texture Intent
Actual approved image required: surface/cohort, view, material, base/value, pattern direction/scale, form/contact/occlusion, edge, identity, reuse, final island.

### Atlas-Island Discipline
Integer texels; marks follow orientation. No stretched/cropped reference transfer. **pixels per UV unit** owns detail scale; simplify/omit or return to Geometry/UV if detail cannot fit. `alpha` is intentional, not antialiasing.

## Texture Styling
Define reference-derived **palette roles**, hue/value **ramp**, contact shadows, reflections and detail scale/direction. **generic palette**, copied unrelated texture, flat rectangles, random high-contrast noise are not completion. Better/HD preserves resolution, density and style.

Verify an adjoining pair first (lift: facade + left), at matching view/scale. Separate palette from lighting. Surface coordinates keep shading continuous across Cubes; UV edges do not invent seams.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`
BASE = material/color ownership; VALUE / FORM = stepped form; IDENTITY = exact mapped marks; SECONDARY DETAIL = controlled only. **No noise-first or generic texture-pattern pass.**

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Check square texels, bleed/reuse, material scale/direction, semantic color/form/identity, no arbitrary pattern.
`FAIL` → **smallest bounded causal correction** → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`. Record difference/cause before repaint. Local defects get local edits; wrong cohort designs restart from base, not patch overlays. User acceptance is separate from strict fidelity; unresolved material differences cannot be PASS.

Animation → user Texture APPROVED + checkpoint → `HANDOFF_REQUIRED(target_phase=animation)` → Gateway `switch_authoring_phase`, same task/chat. Internal PASS is not approval.
