# BlockIT — UV Layout & Texture Standard

**Status:** Active Policy  
**Version:** 1.5
**Updated:** 2026-09-05

## Purpose

Define durable UV Layout, Texture Atlas, Texture Styling, and Texture Verify rules for Minecraft Bedrock models after geometry is coherent.

This policy separates concepts that must not be collapsed into a generic “texture” step.

## Canonical Vocabulary

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

Hard boundaries:

- UV Layout contains no color/style decision.
- Texture Atlas creation contains no proof of styling quality.
- Texture Styling does not own geometry shape or UV ownership.
- Texture Verify is evidence, not another authoring pass.
- `create_texture(type=blank)` creates only a **Texture Atlas**. `create_texture(type=template)` delegates UV Layout and template bitmap generation to Blockbench's native generator before Texture Styling.
- `uv_offset`, `autouv`, `mirror_uv`, per-face UV, and `box_uv_region` are **UV Layout** state.
- Painter operations are **Texture Styling**.

## Core Principle

**Texture Styling supports geometry; it does not repair geometry.**

Use styling for color/material identity, pattern, form readability, highlights/shadows, small surface detail, and information that does not need silhouette/real volume/separate motion. If silhouette, proportion, attachment, or required volume is wrong, fix Geometry first.

## Production Workflow

```text
GEOMETRY PASS
↓
UV LAYOUT
↓
UV LOCK / AUDIT
↓
TEXTURE TEMPLATE / ATLAS
  native UV arrangement + exact pixel grid
↓
TEXTURE STYLING
   BASE PASS
   VALUE / FORM PASS
   IDENTITY PASS
   SECONDARY DETAIL PASS
↓
TEXTURE VERIFY
↓
FINAL PASS
```

A placeholder/flat fill may make geometry readable early, but it is provisional and is not production completion.

## Native Texture Template

When UVs must be rebuilt, use `create_texture(type=template)` with an explicit `pixel_density` (16x means one model unit per pixel), `rearrange_uv=true`, and the required occupancy/padding/power-of-two settings. The native generator writes the UV arrangement and template bitmap with nearest-pixel behavior. Do not approximate this phase with manually guessed face rectangles, stretched source images, or color-only fills. Inspect the fresh UV audit and atlas before any styling operation.

# UV Layout

## UV Layout Purpose

UV Layout answers only:

> Which atlas region does each model surface read?

It owns mapping, orientation, reuse, mirroring, seams, bounds, and lock state. It does not own palette, shading, material appearance, or detail.

## UV Requirements

Important visible surfaces must have usable finite UVs. For new AI production:

- important faces remain inside the logical canvas;
- integer logical UV is standard unless a requirement justifies fractional UV;
- accidental partial overlap is rejected;
- exact reuse is allowed when intentionally symmetric/repeated;
- mirror use is deliberate;
- directional/asymmetric markings have suitable orientation;
- seam-critical relationships are known before Texture Styling.

Do not optimize atlas occupancy as a quality score.

## Box UV / UV Lock

Box UV is a first-class Bedrock workflow.

For fresh AI-authored Box UV:

```text
manage_cubes(operation=create)
→ deterministic initial uv_offset / returned box_uv_region
→ geometry correction while autouv remains active
→ GEOMETRY PASS
→ one coherent final UV lock with autouv=0
→ list_textures global audit
→ TEXTURE ATLAS
→ TEXTURE STYLING
```

Do not manually recalculate a fresh `box_uv_region` already returned by `manage_cubes`. Use `inspect_elements(mode=detail)` only when face-specific mapping/orientation is actually required.

Per-face authored UV follows explicit face rectangles.

## Global UV Audit

The audit distinguishes at least:

```text
invalid/non-finite UV
out-of-bounds faces
fractional UV candidates
unlocked Box-UV Cubes
exact reused regions
partial-overlap candidates
```

Exact reuse can be correct. Partial overlap is a review condition because it can silently corrupt unrelated styled regions. Degenerate/zero-area UV may occur on sheet/zero-thickness geometry and is not automatically a defect.

## UV Stability

Do not change UV Layout after substantial Texture Styling without a concrete reason.

A material UV change invalidates affected downstream assumptions:

- mapped physical region;
- orientation;
- seam continuity;
- shared/reused pixels;
- styled alignment;
- variant alignment;
- PBR/channel alignment where applicable.

Re-check only affected downstream state.

# Texture Atlas

## Atlas Purpose

Texture Atlas is the bitmap/PNG canvas that stores pixels. It is separate from logical UV mapping and separate from styling.

## AI Authoring Canvas Standard

For **new AI-authored Bedrock Entity projects**, logical UV remains **128×128** for production.

The production base-color bitmap uses explicit square 128-based sizes:

```text
128×128
256×256
384×384
512×512
...
```

Choose the smallest sufficient bitmap. Logical UV dimensions and physical bitmap dimensions are different concepts.

```text
128 logical → 128 bitmap = 1× physical pixels per UV unit
128 logical → 256 bitmap = 2×
128 logical → 512 bitmap = 4×
```

Iterative/non-production work may use provisional square 16-based canvases `16..1024`; promote to 128-based before final production. Imported/existing assets may preserve authored nonstandard dimensions.

## Single Base-Color Atlas

Normal production uses **one base-color atlas PNG for the whole model**. Do not create base-color atlases per body part, Cube, material family, or object section.

```text
no base atlas            → create one
one base atlas           → reuse it
multiple base candidates → resolve fragmentation first
```

An explicit color variant may reuse the established Geometry + UV Layout but belongs to an explicit non-material TextureGroup.

Normal/height/MER are PBR support atlas channels. They do not change UV Layout ownership and should match the base bitmap size for new AI authoring.

## Atlas Identity

Retain the base atlas UUID as continuation state and pass `texture_id` explicitly whenever multiple textures are present. Do not rely on whichever texture happens to be selected/default.

Creating an atlas, clearing it, or filling it with one color is **not Texture Styling completion**.

# Texture Styling

## Styling Purpose

Texture Styling owns the visual pixels:

```text
palette
material separation
value / hue
face/form readability
contact / occlusion
edge treatment
identity-critical marks
controlled secondary detail
```

Before detailed styling establish physical pixels per UV unit and readable detail scale.

## Material-Family Palette Ramps

A production texture uses material-aware ramps, not one global brightness ladder and not one flat color per material.

Relevant roles include:

```text
base
shadow / deep shadow when needed
highlight / edge highlight when needed
controlled hue movement
material-specific secondary hue
identity/accent color
```

Reason about **value and hue**. Brightness-only ramps often look procedural and lifeless.

## BASE PASS

The base pass establishes primary/secondary colors, material zones, accent/focal colors, and basic value separation.

A flat fill is only a **BASE PASS** when supported form/material/detail exists. No important required surface should remain unintentionally blank.

## VALUE / FORM PASS

Add controlled information that helps geometry read:

```text
face/form separation
material-specific shadow/highlight
local form transition
contact / occlusion
edge treatment
value / hue ramp
```

Prefer stepped pixel ramps for Minecraft/pixel-art styling. Continuous smooth gradients are optional only when the requested style/reference needs them.

Texture may reinforce real contact/recess/overlap/underside/joint depth but must not invent missing large volume.

## IDENTITY PASS

Identity-critical features include required markings, facial features, emblems, wraps, seams, panel lines, symbols, and recognizability-critical color breaks.

Identity comes before microdetail.

## SECONDARY DETAIL PASS

Use controlled material variation at the chosen physical pixels-per-UV-unit scale. Noise-first painting is rejected.

For crisp Minecraft texture:

- use deliberate pixel clusters;
- use hard texel edges;
- avoid accidental softness/antialiasing;
- default authored alpha intent is **0 or 255**.

Intermediate alpha is valid only when material behavior requires translucency/blending.

## Mirror / Reuse

Shared/mirrored UV regions are intentional only when surfaces should share pixels.

Avoid shared regions for text/symbols, left/right-specific detail, directional marks, deliberate asymmetric wear, and unique identity features. Change UV Layout ownership before styling unique content.

## PBR Boundary

PBR is optional and evidence-driven.

Normal/height/MER are support Texture Atlases. PBR does not replace Texture Styling quality and does not justify base-atlas fragmentation.

# Texture Verify

## Verification Purpose

Texture Verify asks whether the atlas pixels, when mapped through the final UV Layout onto the model, produce the intended result.

Required evidence for visual claims:

```text
fresh Texture Atlas image
+
fresh affected model view(s)
```

Review in this order:

```text
1. UV Layout validity / bounds / overlap / lock
2. Texture Atlas ownership / fragmentation / scale
3. palette + material separation
4. form + contact + edge readability
5. seam / orientation
6. identity-critical marks
7. secondary detail density
```

`Texture Atlas exists`, `UV Layout exists`, or `paint tool succeeded` does not prove Texture Styling quality.

Texture mutation makes visual evidence stale. Correct only diagnosed failures and re-check affected evidence.

## Completion Criteria

Requested texture scope is complete when:

- Geometry dependency is coherent;
- UV Layout is finite, in-bounds, stable, correctly oriented, and final Box UV is locked;
- no unresolved accidental partial overlap remains;
- exactly one intended base-color Texture Atlas exists unless explicit variants are required;
- atlas identity and physical pixel density are known;
- material families have readable palette/value separation;
- visible form is not left as unjustified flat fill;
- contact/edge treatment is used when materially useful;
- identity-critical markings are present;
- detail density matches physical pixels-per-UV-unit;
- no accidental soft/alpha artifacts remain for crisp pixel style;
- Texture Verify has no unresolved critical/major issue.

## Related

- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Current Validation](../knowledge/current-validation.md)
