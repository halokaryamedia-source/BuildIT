---
name: blockit-bedrock-texturing
description: Bedrock Texture/Painter/PBR specialist.
---

# BlockIT Bedrock Texturing

Geometry/UV capabilities remain callable for bounded upstream correction in shared `AUTHORING`; Texturing **must not borrow Cube mutation**.

## Correction

**No Geometry↔Texturing phase switch.** Geometry defects → owner in-session. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation.

Entry: **Geometry/UV Layout PASS**. Final Box UV is locked with `autouv=0` where Box UV is used; a valid native `create_texture(type=template)` result is also an accepted UV-layout source. No invalid/out-of-bounds/partial-overlap blocker; reuse `box_uv_region`/final face UV state.
`UV Layout`=geometry→atlas; `Texture Styling`=pixels. `manage_material_instances` owns face `material_instance`.

## Direct Routing

Reuse fresh state.
```text
global UV/atlas readiness → list_textures
face mapping → inspect_elements(mode=detail) only when needed
face aspect/density review → inspect_element(detail=uv) on affected/reuse owners
model-wide 1-pixel scale → inspect_element(detail=uv) → project_texel_density
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch
blank atlas resolution unknown → get_project_info once
atlas lifecycle → list_textures / activate_texture; create/read → create_texture / get_texture
base/material regions → draw_shape_tool
contiguous fill → paint_fill_tool
stepped value/form/detail → draw_shape_tool / paint_with_brush
erase bounded pixels → eraser_tool
PBR/material semantics → manage_material
mapped model-view evidence → capture_model_views
```

Do not regenerate/rearrange a valid native template during Styling. If UV mapping is materially wrong, return judgement to the Geometry/UV owner before more painting.

## UV Layout Quality Gate

`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. `inspect_element(detail=uv)` reports `project_texel_density`. `review_required` → Geometry/UV; **never force detail into an undersized UV island with a larger brush/shape**.

A texture pixel should map to a consistent square model-space texel at the chosen density. If an important face reads stretched/squashed, or its UV aspect disagrees with its model-space aspect, stop Styling and correct UV Layout. Do not compensate with distorted artwork.

## Primary vs Support Capabilities

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

## Conditional Support — Not Default Routing

These **must not enter the normal hot path** unless user intent specifically requires them:

```text
gradient_tool | color_picker_tool | copy_brush_tool | paint_settings
create_brush_preset | load_brush_preset | texture_selection | texture_layer_management
add_texture_group | list_materials | get_material_info | import_texture_set
```

Support tools do not justify extra discovery/readback
## First-Call Invariants

```text
blank create_texture → explicit width+height from project UV
template create_texture → explicit pixel_density and native UV generation; inspect fresh atlas/UV evidence before paint
data + fill_color → invalid
fill_color → layer_name required
pbr_channel → material TextureGroup `group` required
Painter coordinates → texture pixels; keep in bounds
```

`create_texture` has a provisional **16×16** blank default. Production authoring must therefore **not omit blank Atlas size**; reuse project resolution. Existing base-color atlas → reuse its UUID.

Known → invoke. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Styling

Use one **base-color atlas** for the whole model. Keep logical UV scale and physical bitmap scale distinct: new production uses the project/native UV layout, while the bitmap may use the smallest sufficient 128-based size (`128`, `256`, `384`, `512`, ...) or the valid native-template result needed by the chosen pixel density. **Never compress/stretch UV islands merely to force a smaller atlas.** Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

### Reference-Grounded Texture Intent Gate

Reference-driven Styling requires the **actual approved reference image visible in active multimodal context**. Generic knowledge of “wood”, “metal”, “fabric”, “machine”, “creature”, or another asset class is not evidence for a particular pattern.

Before painting a material surface/cohort, establish only the information that changes authored pixels:

```text
surface / semantic cohort
supporting reference view(s)
material family / visual role
base color + value relationship
large pattern direction / scale when visible
form/contact shading that is actually supported
identity marks / seams / panel lines / accents
unique pixels vs intentional reuse/mirroring
final UV island / atlas region
```

Do not invent decorative texture because an island is blank. Unsupported microdetail is `OMIT`, not an invitation to add generic patterning.

### Atlas-Island Discipline

The final native/template UV layout is the coordinate authority for painting. Author **exact atlas pixels inside known UV regions**.

- Keep hard integer texel boundaries for crisp pixel work.
- Paint a surface according to its UV orientation; directional grain/stripes/marks must follow the intended model direction.
- Keep unrelated islands visually independent unless exact pixel reuse is intentional.
- Do not paint across atlas whitespace or neighboring islands merely to create a convenient rectangle/pattern.
- Do not stretch/crop the approved reference image onto an island as a substitute for authored pixels; the reference is visual evidence, not a texture-transfer shortcut.
- Do not scale one decorative motif independently per face to hide inconsistent texel density.

When one material continues across several surfaces, keep **material scale and visual language coherent** across those surfaces even when the islands are separate. Repetition is valid only when the reference/material relationship supports it.

### Pixel Detail Scale

Physical pixels-per-UV-unit sets the smallest honest authored feature. If a desired mark cannot be represented cleanly at the chosen density:

```text
simplify / omit non-material detail
OR
return to Geometry/UV owner for a justified higher global density / unique UV region
```

Do not fake sub-texel information with accidental antialiasing, stretched pixels, fractional-looking smears, or progressively larger brushes over an undersized island.

Define palette roles/value-hue ramp, material zones, face/form shading, contact/occlusion, edge/alpha/seam, identity marks, detail budget, and pixels per UV unit. generic palette, copied unrelated texture, or flat rectangles are invalid; reject random high-contrast noise.

`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`

### BASE PASS

Base establishes clean contiguous material/color ownership of the mapped surfaces. It is not permission to lay down arbitrary stripes, checker patterns, repeated blocks, noise, or decorative bands merely to make the atlas look “textured”.

A flat region may be a valid **intermediate base**; it is not final where the approved reference materially requires additional form/material/identity information.

### VALUE / FORM PASS

Use stepped value/hue changes to reinforce the actual geometry, material, contact, and reference-supported form. Do not paint false large bevels, recesses, gaps, shadows, or volume to conceal a Geometry defect.

### IDENTITY PASS

Author the specific markings, panel lines, seams, symbols, color breaks, directional material features, or other reference-supported identity cues at their exact mapped pixels. Unique/asymmetric features require unique UV ownership; do not accept accidental mirrored/reused pixels.

### SECONDARY DETAIL PASS

Add controlled detail only after base/form/identity are correct. Detail must have a material/reference role and a scale compatible with the chosen texel density. **No noise-first or “generic texture pattern” pass.** If removing a pattern would not reduce reference fidelity/material readability, it probably should not exist.

Completion needs fresh `get_texture` pixels + mapped model-view evidence. Missing/unrelated → `FAIL | UNVERIFIED`.

`gradient_tool` is only for reference-supported continuous transition.

## Texture Verify

Reference + fresh `get_texture` + `capture_model_views` → UV → material → form → identity → microdetail → `FAIL | UNVERIFIED | PASS`.

Verify both atlas and mapped result for:

```text
square/non-stretched texel appearance
no unintended island bleed or accidental reuse
material scale/direction consistency
clean semantic color ownership
reference-grounded form/identity detail
no arbitrary procedural pattern/noise
```

`FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.

Animation required → `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=PASS; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
