# BlockIT — Texture Standard

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-18

## Purpose

Define texture/UV quality rules for Minecraft Bedrock models after geometry is coherent.

This note defines modelling policy, not proof of live runtime behavior. Current source and applicable CI own implemented MCP semantics.

## Core Principle

**Texture supports geometry; it does not repair geometry.**

Use texture for color/material identity, pattern, form readability, highlights/shadows, small surface detail, and information that does not need silhouette/real volume/separate motion. If silhouette, proportion, attachment, or required volume is wrong, fix geometry first.

## Workflow

```text
coherent geometry
↓
one base-color atlas + UV layout
↓
UV / Atlas Gate
↓
base material regions
↓
value / form / contact / edge pass
↓
identity pass
↓
controlled secondary detail
↓
fresh atlas + model-view review
```

A placeholder/flat texture may make geometry readable early, but it is provisional and is not production completion.

## AI Authoring Canvas Standard

For **new AI-authored Bedrock Entity projects**, logical UV remains **128×128**.

The production base-color bitmap uses an explicit square canvas in clean 128-based sizes:

```text
128×128
256×256
384×384
512×512
...
```

Choose the smallest sufficient bitmap. The logical UV canvas stays simple while physical bitmap density may increase.

Imported/existing user assets may preserve authored nonstandard logical or physical dimensions. Professional samples are evidence to interpret, not custom-resolution presets for new AI work.

## Single Base-Color Atlas

Normal production uses **one base-color atlas PNG for the whole model**. Do not create base-color textures per body part, Cube, material family, or object section.

```text
no base atlas      → create one
one base atlas     → reuse it
multiple base candidates → resolve fragmentation before new color authoring
```

An additional color texture is valid only as an explicit variant that intentionally reuses the established geometry/UV layout. New AI-authored variants belong to an explicit non-material TextureGroup rather than masquerading as another body-part texture.

Normal/height/MER textures are PBR support channels. They do not change the one-base-color rule and should match the base bitmap size for new AI authoring.

## Atlas Identity

After choosing the base atlas, retain its UUID as production continuation state and pass that UUID explicitly as `texture_id` for paint mutations whenever multiple textures are present.

When multiple textures exist, paint/read operations must target the intended texture explicitly instead of relying on whichever texture is selected/default in the editor. This prevents color work from drifting onto PBR channels, variants, or stale textures.

## Texel Scale Contract

Before detailed painting, establish:

```text
logical UV dimensions
physical bitmap dimensions
physical pixels per UV unit
identity-detail scale
material-detail scale
microdetail floor
```

A larger physical bitmap provides more pixels inside the same logical UV area; it does **not** justify arbitrary noise.

Example reasoning:

```text
128 logical → 128 bitmap = 1× density
128 logical → 256 bitmap = 2× density
128 logical → 512 bitmap = 4× density
```

Detail size must be readable at the chosen density.

## UV Requirements

Important visible surfaces must have usable, finite UVs. For new AI production:

- important faces remain inside the logical canvas;
- integer logical UV is the standard unless a specific requirement justifies fractional UV;
- accidental partial overlap is rejected;
- exact reuse is allowed when intentionally symmetric/repeated;
- mirror use is deliberate;
- directional/asymmetric markings have suitable orientation;
- seam-critical relationships are known before detail painting.

Do not optimize atlas occupancy as a quality score.

## Box UV / UV Lock

Box UV is a first-class professional workflow for Cuboid Bedrock assets.

Automatic UV may establish an initial layout. It is **not** the final painted state.

For AI-authored Box UV:

```text
initial auto UV
→ audit
→ author uv_offset / mirror intent
→ autouv=0
→ production paint
```

Painted Box-UV Cubes should be locked with `autouv=0` before production pixel work. This reduces the chance that later geometry/editor behavior silently moves painted regions.

Per-face authored UV follows its own explicit face rectangles.

## Global UV / Atlas Audit

The global audit must distinguish at least:

```text
invalid/non-finite UV
out-of-bounds faces
fractional UV candidates
unlocked Box-UV Cubes
exact reused regions
partial-overlap candidates
```

These are evidence categories, not a generic quality score.

Exact reuse can be correct. Partial overlap is a review condition because it can silently corrupt unrelated painted regions. Degenerate/zero-area UV may occur on sheet/zero-thickness geometry and is not automatically a defect.

## UV Stability

Do not change UV layout after substantial finished painting without a concrete reason.

Any material UV change invalidates affected downstream assumptions:

- mapped physical region;
- orientation;
- seam continuity;
- shared/reused pixels;
- painted alignment;
- variant alignment;
- PBR/channel alignment where applicable.

Re-check only affected downstream state.

## Material-Family Palette Ramps

A production texture uses **material-aware ramps**, not one global brightness ladder and not one flat color per material.

Relevant dimensions include:

```text
base
shadow / deep shadow when needed
highlight / edge highlight when needed
controlled hue movement
material-specific secondary hue
identity/accent color
```

These are roles, not a fixed color-count recipe.

Reason about **value and hue**. Brightness-only ramps often look procedural and lifeless; controlled warm/cool or hue shifts are valid when the reference/material supports them.


## Base Texture

The base pass establishes primary/secondary colors, material zones, accent/focal colors, and basic value separation. No important required surface should remain unintentionally blank.

## Material Readability

Texture variation follows the intended material rather than generic noise. Different materials may use different contrast, hue movement, edge language, or pattern direction while remaining part of one coherent asset.

## Lighting / Shading Consistency

Keep one coherent light/shading language across the asset. Face/form separation, contact darkening, and highlights must not contradict each other without reference evidence.

## Geometry Alignment

Pattern direction, identity features, shading cues, seams, and edge treatment must align to the actual geometry. Texture can reinforce form but cannot repair wrong silhouette/proportion/attachment.

## Value / Form Shading

Flat base color is not completion when supported form/material evidence exists.

After the base pass, add controlled information that helps the geometry read:

```text
face/form separation
material-specific shadow/highlight
local form transition
```

Prefer stepped pixel ramps for Minecraft/pixel-art styling. Continuous smooth gradients are optional only when the requested style actually needs them.

## Contact / Occlusion Treatment

Where geometry creates real contact, recess, overlap, joint, underside, or attachment, a small controlled darkening may reinforce depth.

Examples include:

- armor seams;
- panel recesses;
- handle connections;
- undersides;
- joint contact;
- overlapping plates.

Texture may reinforce real geometry. It must not invent missing large volume or substitute for required geometry.

## Edge Treatment

Edges are intentional design surfaces when material/readability supports them.

Possible treatment:

- sharp metal highlight;
- darker cloth/panel boundary;
- painted edge;
- restrained wear;
- silhouette-side value separation.

Do not outline every edge indiscriminately. Edge treatment follows material, light language, and readable scale.

## Identity Before Microdetail

Production priority is:

```text
material separation
→ form readability
→ identity-critical mark
→ material pattern
→ secondary variation
→ optional wear/noise
```

Identity-critical features include required markings, facial features, emblems, wraps, seams, panel lines, and recognizability-critical color breaks.

Noise-first painting is rejected.

## Pixel / Alpha Discipline

For crisp Minecraft pixel texture:

- use deliberate pixel clusters;
- use hard texel edges;
- avoid accidental brush softness/antialiasing;
- default authored alpha intent is **0 or 255**.

Intermediate alpha is valid only when reference/material behavior actually requires translucency or blending.

## Mirror / Reuse

Mirrored/reused UV is intentional when surfaces are truly meant to share pixels.

Avoid shared/mirrored regions for:

- text/symbols;
- left/right-specific detail;
- directional marks;
- deliberate asymmetric wear;
- unique identity features.

If a shared region later needs unique content, change the UV ownership before painting that unique content.

## Texture Variants

A variant reuses the same geometry/UV intent and changes texture content intentionally.

Variants do not justify separate body-part atlases.

For new AI-authored variants:

```text
one established base atlas
→ explicit variant group
→ matching bitmap dimensions
→ same UV ownership
```

## PBR Boundary

PBR is optional and evidence-driven.

A normal/height/MER channel is a support texture, not another base-color atlas. New AI-authored support textures should match the base bitmap dimensions.

Do not add PBR to imitate professionalism when the reference/sample quality is already explained by color-atlas UV placement, value, hue, material readability, and pixel detail.

## Evidence Rule

“Texture exists”, “UV exists”, or “paint tool succeeded” does not prove texture quality.

Review applicable evidence in this order:

```text
1. atlas ownership / fragmentation
2. UV validity / bounds / overlap / lock
3. palette + material separation
4. form + contact + edge readability
5. seam / orientation
6. identity-critical marks
7. secondary detail density
```

Fresh visual evidence is still required when a visual-quality claim is made; static source/CI only proves the contracts it executes.

## Completion Criteria

Texture is complete for the requested scope when:

- geometry dependency is coherent;
- exactly one intended base-color atlas exists unless explicit variants are required;
- atlas identity is deterministic;
- important UVs are finite, in-bounds, stable, and correctly oriented;
- AI-authored painted Box UV is locked;
- no unresolved accidental partial overlap remains;
- material families have readable palette/value separation;
- visible form is not left as unjustified flat fill;
- contact/edge treatment is used when it materially improves supported form;
- identity-critical markings are present;
- detail density matches physical pixels-per-UV-unit;
- no accidental soft/alpha artifacts remain for crisp pixel style;
- no unresolved critical/major texture issue remains.

## Related

- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Validation Report](validation-report.md)
