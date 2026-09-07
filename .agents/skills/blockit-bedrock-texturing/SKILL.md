---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` only for AUTHORING↔Animation.
Entry: **Geometry APPROVED + UV Layout PASS**, **final Box UV locked with `autouv=0`**, no invalid/out-of-bounds/partial-overlap.
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

## UV Gate
`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review face aspect ratio, texel density, orientation, padding/seams, semantic UV reuse. Reuse needs compatible semantics/orientation; zero reuse is valid.
Requested atlas size/density are constraints: never silently enlarge; test native/per-face/reuse first, then report tradeoff.

## Conditional Support — Not Default Routing
Conditional on user intent; not normal hot path:
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool`: reference-supported continuous transition; no extra discovery/readback.

## First Call
`blank create_texture → explicit width+height from project UV`; **not omit blank Atlas size**.
`create_texture`: provisional **16×16 blank**; production **128×128 default, 256×256 opt-in**. Reuse existing atlas UUID.
Known → invoke; unknown → `search_capabilities(limit=4)`; describe on schema uncertainty. No confirmation rereads.
**Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**

## Reference-Grounded Palette
Approved image required. Define palette roles `BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY` per cohort; one hue ramp/material; separate palette from lighting. `color_picker_tool` samples atlas, not reference.

### Atlas-Island Discipline
Integer texels; marks follow orientation. **pixels per UV unit** owns detail scale. Omit immaterial detail; return to Geometry/UV when detail cannot fit at the approved density. `alpha` is intentional.

## Coherent Styling Window / Anti-Micro-Loop
Plan material/palette/form/identity first. Prove one representative patch/cohort has material identity, form/contact and detail scale; formula/gradient/color count is not quality evidence.
Broad → `draw_shape_tool`/`paint_fill_tool`; same-color disconnected detail → one `paint_with_brush` batch (`connect_strokes=false`).
**No evidence-per-micro-mutation loop.** Do not `get_texture`/capture after each edit; finish one cohort pass, then one evidence bundle.
Variants preserve production base role + compatible dimensions/mapping; never demote/re-group base to pass preflight.

## Texture Styling
Palette **ramp**, material zones, form/contact/occlusion, edge, identity/detail. **generic palette**, copied unrelated texture, flat rectangles, random high-contrast noise are not completion.
`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`. No noise-first pass.

## Texture Verify
Reference + fresh `get_texture` + fresh **mapped model-view evidence** from `capture_model_views` → `FAIL | UNVERIFIED | PASS`.
Use minimum affected views; final approval also covers required hidden material surfaces.
`FAIL` → difference/cause → **smallest bounded causal correction** → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
After material live changes, never derive correction masks from stale exported PNG/bbmodel; refresh affected live authority once.

Animation → user Texture APPROVED + checkpoint → `HANDOFF_REQUIRED(target_phase=animation, readiness=ready)` → Gateway `switch_authoring_phase`, same task. Internal PASS is not approval.
