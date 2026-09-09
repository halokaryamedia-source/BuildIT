---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.
## Asset-Only Visual Runtime Boundary
No RP dev: opaque/cutout/blend/emissive; Texture variants asset-only.
## Entry / Correction
**No Geometry↔Texturing phase switch.** AUTHORING↔Animation only: `HANDOFF_REQUIRED` + `switch_authoring_phase`.
Entry: **Geometry APPROVED + UV Layout PASS**; final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap.
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch.
## Direct Routing
Reuse fresh state.
```text
discovery → list_textures(diagnostics=false); UV/atlas readiness → list_textures(diagnostics=true)
face mapping → inspect_elements(mode=detail) only when needed
blank atlas resolution unknown → get_project_info once
atlas → list_textures / activate_texture / create_texture / get_texture
paint → draw_shape_tool|paint_fill_tool|paint_with_brush|eraser_tool
batch → paint_texture_transaction
PBR/material semantics → manage_material / manage_material_instances
render/preview → declared profile + mapped-model evidence; explicit file integration → manage_render_profile
```
Unknown → `search_capabilities(limit=4)`. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**
## UV Gate
`uv_audit.production_gate`=ready = hygiene, **not UV Layout PASS**; review face aspect ratio, texel density, semantic UV reuse.
Requested atlas size/density are constraints; never silently enlarge; return to Geometry/UV if detail cannot fit.
## First Call
`blank create_texture → explicit width+height from project UV`; **not omit blank Atlas size**.
`create_texture`: provisional **16×16 blank**; **128×128 default, 256×256 opt-in**. Approved atlas/density takes precedence; reuse its UUID.
## Workplan / Coverage
material cohorts; palette roles `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY`; form/contact/occlusion/edge/identity/detail.
Face Coverage Ledger: `UNPAINTED | BASE_ONLY | STYLED | INTENTIONAL_FLAT | INTENTIONAL_TRANSPARENT | SHARED`.
`list_textures.optimization_opportunities.coverage.gate`: `incomplete|partial` / `FACE_ACCOUNTING_INCOMPLETE` → no completion; one `list_textures`/pass; `ready` ≠ visual PASS.
`states.varied` ≠ `STYLED`; `review.solid_color_faces` locates flat candidates, not failures.
Variants: `list_textures.production_alignment.gate=ready`; `seam_continuity` (intra-Cube only; inspect cross-Cube contacts visually); `pbr_content`.
### Reference-Grounded Palette / Atlas-Island Discipline
Integer texels; **pixels per UV unit** owns detail scale. Build stepped hue/value ramps, contact shadows and highlights from observed form. Surface coordinates keep shading continuous across Cubes; UV edges do not invent seams.
Unused atlas pixels stay transparent; opaque material does not authorize full-canvas fill. Paint mapped islands plus deliberate bounded padding only.
Pixel art must read as deliberate clusters at normal model scale with Shading ON: distinct shadow/base/light masses, folds and identity accents. Barely visible noise or smooth formula variation is BASE_ONLY, never STYLED.
## Texture Styling
generic palette; copied unrelated texture; flat rectangles/random high-contrast noise ≠ completion.
`BASE PASS → VALUE / FORM PASS → SURFACE PATTERN PASS → IDENTITY PASS → SECONDARY DETAIL PASS → RENDER / ALPHA VERIFY → VERIFY`.
### Render / PBR / Paint Safety
Namespaces: `render_profile`+`minecraft_material_code` | `pbr_texture_set` | `geometry_material_instance` | `surface_pattern`; `render_mode` preview-only.
cutout=`entity_alphatest`; translucent=`entity_alphablend`; emissive_mask=`entity_emissive`. Alpha follows render_profile; planar carrier silhouette stays alpha, not Cubes.
Variants preserve production base role + compatible dimensions/mapping; `normal XOR height`.
`authoring_status`; MERS=MER+`subsurface_value>0`.
`paint_settings`: `pixel_perfect`, `lock_alpha`, `paint_side_restrict`; Mirror after semantic symmetry.
## Coherent Styling Window / Anti-Micro-Loop
representative patch/cohort → cohort-wide; formula/gradient/color count is not quality evidence.
Finish an identity-critical patch and adjoining body surface pair before propagation. Compare landmarks, value clusters, pattern direction/scale and seams against the actual reference at matching scale. Generic bands cannot replace observed detail. This is internal verification, not a user gate.
**No evidence-per-micro-mutation loop.**
Preserve unaffected shading/identity during correction. Coordinate formulas execute observed designs, not invent them. Dark patches may be paint, occlusion or missing surfaces: diagnose the owner before repainting.
## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Record capture view, front direction, Shading ON and artifact revision. Blockbench preview is not actual in-game lighting proof. Off/unknown shading cannot support final comparison.
Verify required hidden material surfaces.
`FAIL` → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
Never use stale exported PNG/bbmodel.
Animation → user Texture APPROVED + checkpoint → Animation Readiness Preflight → `HANDOFF_REQUIRED` → Gateway `switch_authoring_phase`, same task.
Handoff: `target_phase="animation"`, `reason`, `resume_from`, and object `readiness`:
```json
{"geometry_approved":true,"uv_layout":"PASS","texture_approved":true,"checkpoint":"<saved .bbmodel path>","no_blockers":true}
```
Never infer approval.
## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path.
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.
