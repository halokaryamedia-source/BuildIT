---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is only AUTHORING↔Animation; same task/chat.
Entry: **Geometry APPROVED + UV Layout PASS**, **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap. `manage_material_instances` owns face `material_instance`.
Unlocked/invalid UV → Geometry owner + bounded correction; no phase switch.

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
`uv_audit.production_gate=ready` is hygiene, **not UV Layout PASS**. Review face aspect, texel density, orientation, padding/seams, and semantic UV reuse. Stretched/squashed face → Geometry/UV; no paint compensation.

## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path:
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool` needs a reference-supported continuous transition; no extra discovery/readback.

## First-Call Invariants
`blank create_texture → explicit width+height from project UV`.
`create_texture` has a provisional **16×16 blank** default; production is **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.
Known → invoke; unknown → `search_capabilities(limit=4)`; describe only for schema uncertainty. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.** UV islands are pixel authority.

## Reference-Grounded Palette
Approved image required. Define stable `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY` HEX roles per cohort; keep one hue/value ramp per material and separate palette from lighting. `color_picker_tool` samples atlas, not reference; never loop guess → paint → readback → tiny tweak.

### Atlas-Island Discipline
Integer texels; marks follow orientation. **pixels per UV unit** owns detail scale; simplify/omit or return to Geometry/UV when detail cannot fit. `alpha` is intentional.

## Coherent Styling Window / Anti-Micro-Loop
Plan cohort material/palette/form/identity before painting. Broad regions → `draw_shape_tool`; connected base → `paint_fill_tool`; same-color disconnected detail → one `paint_with_brush` batch with `connect_strokes=false`.
**No evidence-per-micro-mutation loop.** Do not `get_texture`/capture after each edit. Finish one judgeable cohort pass, then one evidence bundle.

## Texture Styling
Reference-derived palette **ramp**, material zones, hue/value form, contact/occlusion, edge/reflection treatment, identity and detail direction. **generic palette**, copied unrelated texture, flat rectangles, random high-contrast noise are not completion.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`.
BASE = ownership; VALUE/FORM = form/contact; IDENTITY = exact mapped marks; SECONDARY DETAIL = controlled only. No noise-first pass.

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Use minimum affected views; never auto-capture 3–5.
`FAIL` → difference/cause → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`. Local defect → local edit; wrong cohort design → restart from base. User acceptance remains separate.

Animation → user Texture APPROVED + checkpoint → `HANDOFF_REQUIRED(target_phase=animation)` → Gateway `switch_authoring_phase`, same task/chat. Internal PASS is not approval.
