---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` only for AUTHORING↔Animation.
Entry: **Geometry APPROVED + UV Layout PASS**, final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap.
Bad UV → Geometry.

## Direct Routing
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
unknown blank size → get_project_info once
atlas → list_textures / activate_texture / create_texture / get_texture
regions → draw_shape_tool / paint_fill_tool
detail → draw_shape_tool / paint_with_brush
erase → eraser_tool
PBR → manage_material / manage_material_instances
evidence → capture_model_views
```
Pin atlas UUID; pass `texture_id` if multiple.Unknown capability → `search_capabilities(limit=4)`; no reassurance rereads.

## UV Gate
`uv_audit.production_gate=ready` is hygiene, **not UV Layout PASS**. Review density, orientation, seams and semantic reuse. Reuse needs compatible semantics/orientation.
Never enlarge size/density silently.

## First Call
`blank create_texture → explicit width+height from project UV`.
`create_texture`: provisional **16×16 blank**; production **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.

## Texture Workplan
Before paint, partition **every enabled material surface** into material cohorts. Decide palette, light/value direction, form/contact/occlusion, edge, identity, detail scale and UV-share intent.

Maintain a **Face Coverage Ledger**:
```text
UNPAINTED | BASE_ONLY | STYLED
INTENTIONAL_FLAT | INTENTIONAL_TRANSPARENT | SHARED
```
Every face closes. `SHARED` needs compatible reuse; flat/transparent explicit intent.

Check: `list_textures.optimization_opportunities.coverage.gate`.
- `FACE_ACCOUNTING_INCOMPLETE` or `incomplete|partial` → no completion claim.
- transparent/flat/intermediate-alpha candidates → inspect returned examples only; style or justify.
- `ready` = coverage clear, **not visual PASS**.

## Texture Styling
Reference-Grounded Palette + Atlas-Island Discipline.
Define `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY` per material cohort; use hue/value ramps. Integer texels, hard clusters, no antialiasing; alpha defaults 0/255 unless material requires translucency.
Top/front may read lighter and underside/back/contact darker when form/reference supports it. Avoid pillow shading, banding, mixels, random high-contrast noise and border-only detail.
A generic palette, copied unrelated texture, flat rectangles, or noise-first painting are not completion.
Cues: wood=grain; metal=edge/seam; stone=clusters; cloth=folds; glass=edge/reflection+intentional alpha.

## Coherent Styling Window / Anti-Micro-Loop
Plan material/palette/form/identity; prove one representative patch, then execute cohort-wide:
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`.
Broad work → region tools; disconnected same-color detail → one `paint_with_brush` batch (`connect_strokes=false`).
**No evidence-per-micro-mutation loop.** After a coherent pass, run one `list_textures` coverage read; no unchanged rescan/capture.

## Texture Verify
Coverage closes first. Fresh `get_texture` + minimum fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Review material/form/contact/edge, seams, identity, detail; final approval covers hidden required surfaces.
`FAIL` → cause → smallest bounded correction → one affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same direction twice → `BLOCKED`. Never use stale exported PNG/bbmodel after live changes.

Animation → user Texture APPROVED + checkpoint → Animation Readiness Preflight → `HANDOFF_REQUIRED(target_phase=animation, readiness=ready)` → Gateway `switch_authoring_phase`. Internal PASS is not approval.

## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path.
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.
