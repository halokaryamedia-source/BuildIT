---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is only AUTHORING↔Animation; same task/chat.
Entry: **Geometry APPROVED + UV Layout PASS**; Box UV where used = **final Box UV locked with `autouv=0`**; no invalid/out-of-bounds/partial-overlap blocker. `UV Layout`=geometry→atlas; `Texture Styling`=pixels. `manage_material_instances` owns face `material_instance`.
`unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch`.
Do not start Painter/PBR mutation if the entry gate is not satisfied.

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

## Primary vs Support Capabilities

## Conditional Support — Not Default Routing
These **must not enter the normal hot path** unless user intent specifically requires them:
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
Support tools do not justify extra discovery/readback. `gradient_tool` is only for reference-supported continuous transition.

## First-Call Invariants
`blank create_texture → explicit width+height from project UV`
`create_texture` has a provisional **16×16** blank default; production must therefore **not omit blank Atlas size**. **128×128 default, 256×256 opt-in**. Existing base-color atlas → reuse its UUID.
Known → invoke; unknown/stale → `search_capabilities`; schema → `describe_capability` once. Do not re-list/re-read it only for confirmation.

**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.** UV islands are pixel authority.

## Reference-Grounded Texture Intent
Reference-driven Styling requires actual approved reference image. Establish surface/cohort, reference view, material, base/value, pattern direction/scale, form/contact/occlusion, edge, identity marks, unique/reused pixels, final island.

### Atlas-Island Discipline
Integer texels; directional marks follow orientation; no stretched/cropped reference transfer or motif scaling to hide density. **pixels per UV unit** owns detail scale; simplify/omit or return to Geometry/UV if detail cannot fit. `alpha` is intentional, not antialiasing.

## Texture Styling
Define **palette roles**, material **ramp**, value/hue, face/form, contact/occlusion, edge, identity, detail. **generic palette**, copied unrelated texture, flat rectangles, random high-contrast noise are not completion.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`
BASE = material/color ownership; VALUE / FORM = stepped form; IDENTITY = exact mapped marks; SECONDARY DETAIL = controlled only. **No noise-first or generic texture-pattern pass.**

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Check square texels, bleed/reuse, material scale/direction, semantic color/form/identity, no arbitrary pattern.
`FAIL` → **smallest bounded causal correction** → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.

Animation required → `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=APPROVED; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
