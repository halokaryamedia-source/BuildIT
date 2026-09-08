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
UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) when needed
blank atlas resolution unknown → get_project_info once
atlas → list_textures / activate_texture / create_texture / get_texture
regions → draw_shape_tool / paint_fill_tool
detail → draw_shape_tool / paint_with_brush
fresh-revision batch → paint_texture_transaction
erase → eraser_tool
PBR/material semantics → manage_material / manage_material_instances
```
Unknown → `search_capabilities(limit=4)`. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**

## UV Gate
`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review face aspect ratio, texel density, orientation/seams, semantic UV reuse.
Requested atlas size/density are constraints: never silently enlarge.

## First Call
`blank create_texture → explicit width+height from project UV`; **not omit blank Atlas size**.
`create_texture`: provisional **16×16 blank**; **128×128 default, 256×256 opt-in** production. Reuse existing atlas UUID.

## Texture Workplan / Coverage
material cohorts: palette roles `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY`; form/contact/occlusion/edge/identity/detail.
Face Coverage Ledger: `UNPAINTED | BASE_ONLY | STYLED | INTENTIONAL_FLAT | INTENTIONAL_TRANSPARENT | SHARED`; close all.
`list_textures.optimization_opportunities.coverage.gate`: `incomplete|partial`/`FACE_ACCOUNTING_INCOMPLETE` → no completion. one `list_textures` per pass; inspect candidates. `ready` ≠ visual PASS.
Variants/PBR require `list_textures.production_alignment.gate=ready`.

### Reference-Grounded Palette / Atlas-Island Discipline
Integer texels; **pixels per UV unit** owns scale. Hue/value ramps, hard clusters, no antialiasing; alpha 0/255 unless required.

## Texture Styling
A generic palette, copied unrelated texture, flat rectangles, or random high-contrast noise are not completion. Avoid pillow shading, banding, mixels, border-only detail.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`.

### Alpha / PBR / Paint Safety
Alpha: cutout→`entity_alphatest`; translucent→`entity_alphablend`; emissive may use alpha; unknown=`UNVERIFIED`.
Variants preserve production base role + compatible dimensions/mapping; PBR aligned; one/channel; `normal XOR height`.
`paint_settings`: `pixel_perfect`, `lock_alpha`, `paint_side_restrict`; Mirror after semantic symmetry.

## Coherent Styling Window / Anti-Micro-Loop
Prove one representative patch/cohort; formula/gradient/color count is not quality evidence; then cohort-wide.
Broad regions → `draw_shape_tool`/`paint_fill_tool`; disconnected same-color detail → one `paint_with_brush` batch (`connect_strokes=false`).
**No evidence-per-micro-mutation loop.**

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Minimum views; approval covers required hidden material surfaces.
`FAIL` → difference/cause → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
Never use stale exported PNG/bbmodel after live changes.

Animation → user Texture APPROVED + checkpoint → Animation Readiness Preflight → `HANDOFF_REQUIRED(target_phase=animation, readiness=ready)` → Gateway `switch_authoring_phase`, same task. Internal PASS is not approval.

## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path.
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.
