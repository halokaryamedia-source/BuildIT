---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` only for AUTHORING↔Animation.
Entry: **Geometry APPROVED + UV Layout PASS**, final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap.
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch.

## Direct Routing
Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
blank atlas resolution unknown → get_project_info once
atlas → list_textures / activate_texture / create_texture / get_texture
regions → draw_shape_tool / paint_fill_tool
detail → draw_shape_tool / paint_with_brush
erase → eraser_tool
PBR/material semantics → manage_material / manage_material_instances
evidence → capture_model_views
```
Unknown → `search_capabilities(limit=4)`. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**

## UV Gate
`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review face aspect ratio, texel density, orientation, padding/seams, semantic UV reuse.
Requested atlas size/density are constraints: never silently enlarge.

## First Call
`blank create_texture → explicit width+height from project UV`; **not omit blank Atlas size**.
`create_texture`: provisional **16×16 blank**; production **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.

## Texture Workplan / Coverage
Partition every enabled surface into material cohorts; define palette roles `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY`, form/contact/occlusion/edge/identity/detail and UV-share intent.
Face Coverage Ledger: `UNPAINTED | BASE_ONLY | STYLED | INTENTIONAL_FLAT | INTENTIONAL_TRANSPARENT | SHARED`. Every face closes; exceptions require explicit intent.
Check `list_textures.optimization_opportunities.coverage.gate`: `incomplete|partial`/`FACE_ACCOUNTING_INCOMPLETE` → no completion; inspect returned candidates only. `ready` ≠ visual PASS.

### Reference-Grounded Palette / Atlas-Island Discipline
Integer texels; **pixels per UV unit** owns detail scale. Use hue/value ramps, hard clusters, no antialiasing; alpha 0/255 unless translucency is required.

## Texture Styling
Top/front lighter; underside/back/contact darker when supported. Avoid pillow shading, banding, mixels, random high-contrast noise, border-only detail. A generic palette, copied unrelated texture, flat rectangles, or noise-first painting are not completion.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`.

## Coherent Styling Window / Anti-Micro-Loop
Plan material/palette/form/identity first. Prove one representative patch/cohort; formula/gradient/color count is not quality evidence. Then execute cohort-wide.
Broad regions → `draw_shape_tool`/`paint_fill_tool`; disconnected same-color detail → one `paint_with_brush` batch (`connect_strokes=false`).
**No evidence-per-micro-mutation loop.** One pass → one `list_textures` coverage read; no unchanged rescan/capture.
Variants preserve production base role + compatible dimensions/mapping.

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Use minimum affected views; final approval covers required hidden material surfaces.
`FAIL` → difference/cause → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
Never use stale exported PNG/bbmodel after live changes.

Animation → user Texture APPROVED + checkpoint → Animation Readiness Preflight → `HANDOFF_REQUIRED(target_phase=animation, readiness=ready)` → Gateway `switch_authoring_phase`, same task. Internal PASS is not approval.

## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path.
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.
