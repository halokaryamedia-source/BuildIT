---
name: blockit-bedrock-texturing
description: Mandatory BlockIT Bedrock Texture specialist. Use before Texture Atlas, pixel styling, material/PBR, or Texture Verify mutation after Geometry APPROVED and UV Layout PASS.
---

# BlockIT Bedrock Texturing

Geometry/UV capabilities remain callable for bounded upstream correction in shared `AUTHORING`; Texturing **must not borrow Cube mutation**.

## Entry / Correction

**No Geometry↔Texturing phase switch.** Geometry defects → Geometry owner in-session. `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is only AUTHORING↔Animation; continue the same task/chat.

Entry requires **Geometry APPROVED + UV Layout PASS**. Where Box UV is used: **final Box UV locked with `autouv=0`**. A valid native `create_texture(type=template)` result is also accepted. No invalid/out-of-bounds/partial-overlap blocker. `UV Layout` = geometry→atlas; `Texture Styling` = pixels.

```text
unlocked/invalid UV → Geometry owner + bounded UV correction; no phase switch
```

Do not start Painter/PBR mutation if the entry gate is not satisfied.

## Direct Routing

Reuse fresh state.

```text
global UV/atlas readiness → list_textures
face mapping / aspect     → inspect_elements(mode=detail) only when needed
model-wide density        → inspect_element(detail=uv) → project_texel_density
atlas lifecycle           → list_textures / activate_texture; create/read → create_texture / get_texture
base/material regions     → draw_shape_tool
contiguous fill           → paint_fill_tool
stepped detail            → draw_shape_tool / paint_with_brush
erase bounded pixels      → eraser_tool
PBR/material semantics    → manage_material / manage_material_instances
mapped visual evidence    → capture_model_views
```

Do not regenerate/rearrange a valid native template during Styling. If mapping is materially wrong, return to Geometry/UV before more painting.

## UV Layout Quality Gate

`uv_audit.production_gate`=ready is hygiene, **not UV Layout PASS**. Review **face aspect ratio, texel density, orientation, padding/seams, and semantic UV reuse**. A texture pixel should map to a consistent square model-space texel at the chosen density. Stretched/squashed important faces → stop Styling and correct UV; never compensate with distorted artwork.

## Primary vs Support Capabilities

```text
PRIMARY
create_texture | list_textures | activate_texture | get_texture
paint_fill_tool | draw_shape_tool | paint_with_brush | eraser_tool
manage_material | manage_material_instances | capture_model_views
```

Support tools such as `gradient_tool`, presets, layers, selection, groups, and material inspection are conditional, not default routing. `gradient_tool` is only for reference-supported continuous transition.

## First-Call Invariants

```text
blank create_texture    → explicit width+height from project UV
template create_texture → explicit pixel_density; inspect fresh atlas/UV before paint
data + fill_color       → invalid
fill_color              → layer_name required
pbr_channel             → material TextureGroup `group` required
Painter coordinates     → texture pixels; keep in bounds
```

`create_texture` has a provisional **16×16** blank default. Production authoring must therefore **not omit blank Atlas size**. New project guidance remains **128×128 default, 256×256 opt-in** unless the valid native-template density requires another supported production bitmap. Existing base atlas → reuse UUID.

Known capability → invoke. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. **Do not re-list/re-read it only for confirmation.**

## Texture Atlas / Pixel Ownership

Use one base-color atlas for the whole model. Keep logical UV scale and physical bitmap scale distinct. Never compress/stretch UV islands to force a smaller atlas. **Pin atlas UUID and pass `texture_id` when multiple textures are loaded.**

The final UV template/layout is the coordinate authority for painting. Author exact atlas pixels inside known islands; do not paint across whitespace or unrelated islands.

## Reference-Grounded Texture Intent

Reference-driven Styling requires the **actual approved reference image visible in active multimodal context**. Generic knowledge of a material/object class is not evidence for a specific pattern.

Before painting a surface/cohort, establish only what changes pixels:

```text
surface / semantic cohort
supporting reference view
material family / visual role
base color + value relationship
pattern direction / scale when visible
form/contact shading when supported
identity marks / seams / panel lines / accents
unique pixels vs intentional reuse
final UV island / atlas region
```

Unsupported microdetail is `OMIT`.

### Atlas-Island Discipline

- hard integer texel boundaries for crisp pixel work;
- directional grain/stripes/marks follow UV/model orientation;
- unrelated islands remain independent unless exact reuse is intentional;
- no stretched/cropped reference image as a texture-transfer shortcut;
- no per-face motif scaling to hide inconsistent texel density;
- material scale/language stays coherent across separate islands.

### Pixel Detail Scale

Physical **pixels per UV unit** defines the smallest honest feature. If a required mark cannot be represented cleanly:

```text
simplify / omit non-material detail
OR
return to Geometry/UV for justified higher density / unique region
```

Do not fake sub-texel detail with antialiasing, smeared/stretch pixels, or larger brushes over an undersized island.

## Styling Order

Define palette roles, material zones, form/contact value, edge/seam, identity marks, detail budget, and pixels per UV unit. Generic palette, copied unrelated texture, or flat rectangles are not production completion; reject **random high-contrast noise**.

`BASE PASS → VALUE / FORM PASS → IDENTITY PASS → SECONDARY DETAIL PASS → VERIFY`

### BASE PASS
Establish clean material/color ownership. Do not add arbitrary stripes, checker patterns, repeated blocks, noise, or decorative bands just to make the atlas look textured. Flat color may be an intermediate base.

### VALUE / FORM PASS
Use stepped value/hue changes to reinforce actual geometry, material, contact, and reference-supported form. Do not paint false large bevels, recesses, gaps, or volume to conceal Geometry defects.

### IDENTITY PASS
Author specific reference-supported markings, panel lines, seams, symbols, color breaks, and directional material features at exact mapped pixels. Unique/asymmetric features require unique UV ownership.

### SECONDARY DETAIL PASS
Add only controlled detail with material/reference purpose and density-compatible scale. **No noise-first or generic texture-pattern pass.**

## Texture Verify

Reference + fresh `get_texture` + `capture_model_views` → UV → material → form → identity → microdetail → `FAIL | UNVERIFIED | PASS`.

Verify:

```text
square/non-stretched texel appearance
no island bleed / accidental reuse
material scale + direction consistency
clean semantic color ownership
reference-grounded form/identity detail
no arbitrary procedural pattern/noise
```

`FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.

Animation required → `HANDOFF_REQUIRED(target_phase=animation, readiness=geometry=APPROVED; uv_layout=PASS; texture_verify=PASS)` → `switch_authoring_phase` through Gateway → same task/chat.
