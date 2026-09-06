---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist.
---
# BlockIT Bedrock Texturing
Geometry/UV capabilities remain callable for bounded upstream correction; Texturing **must not borrow Cube mutation**.

## Entry / Correction
**No Geometry↔Texturing phase switch.** `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation; same task/chat.
Entry: **Geometry APPROVED + UV Layout PASS**, final Box UV locked with `autouv=0`, no invalid/out-of-bounds/partial-overlap. `UV Layout`=mapping; `Texture Styling`=pixels. `manage_material_instances` owns face `material_instance`.
Unlocked/invalid UV → Geometry owner + bounded correction; no phase switch.

## Direct Routing
Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping              → inspect_elements(mode=detail) only when needed
blank atlas resolution    → get_project_info once when unknown
atlas lifecycle           → list_textures / activate_texture
create/read atlas          → create_texture / get_texture
base/material regions     → draw_shape_tool
contiguous fill           → paint_fill_tool
stepped detail            → draw_shape_tool / paint_with_brush
erase bounded pixels      → eraser_tool
PBR/material semantics    → manage_material / manage_material_instances
mapped visual evidence    → capture_model_views
```

## UV Layout Quality Gate
`uv_audit.production_gate=ready` is hygiene, **not UV Layout PASS**. Review face aspect, texel density, orientation, padding/seams and semantic reuse. Stretched/squashed face → Geometry/UV; never paint around a mapping defect.

## Discovery Discipline
Known hot-path capability + arguments documented here → invoke directly. Do not search/describe for reassurance.
Unknown capability → one precise search (`limit=4`); describe once only when the required branch is undocumented or an `INVALID_INPUT` exposes schema uncertainty.
No confirmation rereads after successful mutation.

## Reference-Grounded Palette
The approved reference is the color authority. Before the first styling mutation, choose one compact explicit palette in reasoning:
`BASE | SHADOW | HIGHLIGHT | ACCENT/IDENTITY` with stable HEX values and the surfaces/materials they own.
Separate palette from viewport lighting. Keep one material cohort on one hue/value ramp. Change the palette only after representative evidence shows the palette itself is wrong.
`color_picker_tool` samples existing atlas pixels; it is **not** a reference-color search loop. Do not guess color → paint → read back → slightly change color repeatedly.

## Atlas-Island Discipline
Integer texels; marks follow orientation. No stretched/cropped reference transfer. **pixels per UV unit** owns detail scale; simplify/omit or return to Geometry/UV if detail cannot fit. `alpha` is intentional, not antialiasing.
Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

## Coherent Styling Window / Anti-Micro-Loop
Plan the current cohort before painting: material zones, palette roles, value/form treatment, identity marks and detail budget.
Use the largest deterministic existing operation that preserves intent:
- broad rectangular/material regions → `draw_shape_tool`;
- intentional connected base fill → `paint_fill_tool`;
- repeated same-color disconnected pixels/details → one `paint_with_brush` coordinate batch with `connect_strokes=false`;
- connected stroke → one `paint_with_brush` call.

**No evidence-per-micro-mutation loop.** Do not call `get_texture` or `capture_model_views` after each rectangle, shadow, highlight, seam or pixel cluster.
Author one judgeable adjoining-pair/cohort pass first, then collect one evidence bundle. Local correction may use another bounded pass, then one fresh affected evidence bundle.
Do not split one already-known color/cohort plan into serial single-pixel or single-Cube ceremony merely because multiple tool calls are available.

## Texture Styling
Reference-derived palette roles, hue/value ramp, contact shadows, reflections, edge treatment and detail scale/direction own the design. Generic palette, unrelated copied texture, flat production rectangles and random high-contrast noise are invalid.
Verify one adjoining pair first. Surface coordinates keep shading continuous across Cubes; UV edges do not invent seams.

```text
BASE PASS
→ VALUE / FORM PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
→ VERIFY
```

BASE = material/color ownership.
VALUE/FORM = stepped form/contact/occlusion/edge/hue-value ramp.
IDENTITY = exact mapped marks.
SECONDARY = controlled detail only; stop before noise.
A pass is a coherent visual unit, **not** a requirement to read images between every paint call.

Conditional support, only when current intent requires it:
`gradient_tool | color_picker_tool | copy_brush_tool | paint_settings | create_brush_preset | load_brush_preset | texture_selection | texture_layer_management | add_texture_group | list_materials | get_material_info | import_texture_set`.
`gradient_tool` requires a reference-supported continuous transition.

## Texture Verify
After a coherent styling pass:
`approved reference + fresh get_texture + minimum sufficient affected capture_model_views → FAIL | UNVERIFIED | PASS`.
Do not automatically capture 3–5 views; request only views that can falsify the current material claim. Final stage review uses the minimum sufficient full evidence set.

Check square texels, bleed/reuse, material scale/direction, semantic color/form/identity and arbitrary-pattern absence.
`FAIL` → state one observed difference + cause → smallest coherent causal correction → one fresh affected evidence bundle → `IMPROVED | UNCHANGED | REGRESSED`.
Same causal direction twice without new evidence → `BLOCKED`.
Wrong cohort design restarts from base; local defects get local edits. User acceptance is separate from strict fidelity.

## First-Call / Lifecycle Invariants
Blank `create_texture` → explicit width+height from project UV. New production atlas uses explicit 128×128 by default, 256×256 only when opted in; do not rely on the provisional 16×16 blank default.
Reuse existing atlas UUID.
Animation → user Texture APPROVED + checkpoint → `HANDOFF_REQUIRED(target_phase=animation)` → Gateway switch → same task/chat.
