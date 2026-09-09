---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Asset-Only Visual Runtime Boundary
Texturing owns the authored asset's pixels/material appearance, not Resource Pack development. `render_profile` knowledge is used only to resolve visual behavior such as opaque/cutout/blend/emissive and to validate the loaded asset's preview/export intent. Do not build manifests, RP directory graphs, `client_entity` deliverables, or gameplay/property selection logic.

Texture variants are valid **asset variants** when they reuse compatible final Geometry + UV Layout and preserve intended bitmap dimensions/mapping. BuildIT may author and visually validate those atlases; choosing a variant from gameplay state/property logic is downstream integration and out of scope.

## Entry / Correction
**No Geometry↔Texturing phase switch.** AUTHORING↔Animation only: `HANDOFF_REQUIRED` + `switch_authoring_phase`.
Entry: **Geometry APPROVED + UV Layout PASS**; final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap.
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch.
## Direct Routing
Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
blank atlas resolution unknown → get_project_info once
atlas → list_textures / activate_texture / create_texture / get_texture
paint → draw_shape_tool / paint_fill_tool / paint_with_brush / eraser_tool
fresh-revision batch → paint_texture_transaction
PBR/material semantics → manage_material / manage_material_instances
visual render intent/preview → manage_render_profile
```
Unknown → `search_capabilities(limit=4)`. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**
## UV Gate
`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review face aspect ratio, texel density, semantic UV reuse; return to Geometry/UV if detail cannot fit.
Requested atlas size/density are constraints; never silently enlarge.
## First Call
`blank create_texture → explicit width+height from project UV`; **not omit blank Atlas size**.
`create_texture`: provisional **16×16 blank**; **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.
## Workplan / Coverage
material cohorts; palette roles `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY`; form/contact/occlusion/edge/identity/detail.
Face Coverage Ledger: `UNPAINTED | BASE_ONLY | STYLED | INTENTIONAL_FLAT | INTENTIONAL_TRANSPARENT | SHARED`.
`list_textures.optimization_opportunities.coverage.gate`: `incomplete|partial`/`FACE_ACCOUNTING_INCOMPLETE` → no completion. one `list_textures`/pass. `ready` ≠ visual PASS.
Variants/PBR: `list_textures.production_alignment.gate=ready`; `seam_continuity` advisory; `pbr_content`.
### Reference-Grounded Palette / Atlas-Island Discipline
Integer texels; **pixels per UV unit** owns scale; hue ramp; hard clusters; no antialiasing.
## Texture Styling
generic palette/copied unrelated texture/flat rectangles/random high-contrast noise ≠ completion. Avoid pillow shading, banding, mixels, border-only detail.
`BASE PASS → VALUE / FORM PASS → SURFACE PATTERN PASS → IDENTITY PASS → SECONDARY DETAIL PASS → RENDER / ALPHA VERIFY → VERIFY`.
### Render / PBR / Paint Safety
Namespaces: `render_profile`+`minecraft_material_code` | `pbr_texture_set` | `geometry_material_instance` | `surface_pattern`; `render_mode` preview-only.
cutout=`entity_alphatest`; translucent=`entity_alphablend`; emissive_mask=`entity_emissive`. Alpha follows render_profile; planar carrier silhouette stays alpha, not Cubes.
Variants preserve production base role + compatible dimensions/mapping; `normal XOR height`.
`authoring_status`; MERS=MER+`subsurface_value>0`.
`paint_settings`: `pixel_perfect`, `lock_alpha`, `paint_side_restrict`; Mirror after semantic symmetry.
## Coherent Styling Window / Anti-Micro-Loop
representative patch/cohort → cohort-wide; formula/gradient/color count is not quality evidence.
**No evidence-per-micro-mutation loop.**
## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Verify required hidden material surfaces.
`FAIL` → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
Never use stale exported PNG/bbmodel.
Animation → user Texture APPROVED + checkpoint → Animation Readiness Preflight → `HANDOFF_REQUIRED(target_phase=animation, readiness=ready)` → Gateway `switch_authoring_phase`, same task.
## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path.
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.