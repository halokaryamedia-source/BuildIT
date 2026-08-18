# BlockIT — Texture Standard

**Status:** Active Policy  
**Version:** 1.2  
**Updated:** 2026-08-18

## Purpose

Define texture/UV quality rules for Minecraft Bedrock models after geometry is coherent.

This note defines **modelling policy**, not guaranteed MCP automation. Actual UV, texture, canvas, and persistence capability remains current source/runtime truth.

## Core Principle

**Texture supports geometry; it does not repair geometry.**

Use texture for:

- color/material identity;
- pattern;
- shading/highlight;
- small surface detail;
- information that does not need silhouette/real volume/separate motion.

If silhouette/proportion/attachment is wrong, fix geometry first.

## Workflow

```text
primary + complete geometry passes
↓
choose texture style / required detail level
↓
prepare one usable production color atlas + UV layout
↓
base color/material pass
↓
value/form shading + identity pass
↓
controlled secondary detail when required
↓
fresh texture visual gate
```

Do not begin texture polish on a primary form that still fails geometry review.

## Sequencing / Existing-Asset Boundary

For end-to-end reference-driven creation, production texture work requires the complete geometry review to have `PASS` for the shape/surfaces the texture depends on. A material geometry `FAIL` returns to modelling. A required `UNVERIFIED` geometry claim must be resolved or reported `BLOCKED`; texture is not a way to make uncertainty look finished.

For a texture-only task on an existing asset, current geometry may be accepted as the user-provided working baseline when geometry correction is outside scope. Do not turn that scope decision into a claim that the geometry matches a reference.

A minimal placeholder/flat texture may be used early solely to make geometry readable. It stays provisional and must not receive production polish/detail or be counted as completion progress.

If geometry changes after texture production begins, invalidate only the affected downstream assumptions and re-check them: Cube/face identity, UV layout, texture assignment, painted alignment, material instances, and PBR channel relationships as applicable. Sunk cost in texture work is not evidence that rejected geometry should be preserved.

## AI Authoring Canvas Standard

For **new AI-authored Bedrock Entity projects**, the logical UV baseline is **128×128**. Do not infer unusual logical resolutions from professional sample files simply because a human author used them.

The production base-color PNG must use an explicit square canvas beginning at **128×128** and scale upward only in clean 128-based sizes when the visible detail requirement justifies more room. Prefer the smallest sufficient canvas; do not rely on a generic low-resolution texture-tool default. Existing/user-supplied assets may preserve their authored nonstandard canvas/resolution.

Logical/project UV resolution and physical bitmap dimensions remain separate runtime facts. The simplified AI production rule above is an authoring standard, not a claim that every existing professional asset uses identical logical and physical dimensions.

## Single Color Atlas

Normal Bedrock Entity production uses **one base-color atlas PNG for the whole model**. Do not create separate base-color textures for body parts, Cubes, material zones, or object sections.

When current texture state is unknown:

```text
no usable color atlas → create one
one usable color atlas → reuse / activate it
multiple color textures → do not add another until explicit variants/PBR are distinguished from accidental fragmentation
```

Additional color textures are valid only for an explicit variant requirement. Normal/height/MER textures are separate PBR support channels and do not justify fragmenting the base color atlas.

## UV Requirements

Where texture is required:

- important visible surfaces have usable UVs;
- UVs remain within the intended texture canvas;
- accidental overlap is avoided;
- mirrored UV is intentional;
- focal areas receive adequate usable texel space;
- orientation remains understandable/editable;
- seam-critical regions are known before directional/detail painting.

Do not change UV layout after substantial finished painting without a concrete reason.

## Box UV / Atlas Authoring

Box UV is a first-class professional path for Cuboid Bedrock assets when it represents the intended surface workflow. Final layout may deliberately use authored per-Cube `uv_offset`, `mirror_uv`, and disabled/controlled auto-UV state. Automatic UV can be a starting aid; it is not proof of a finished atlas.

Intentional UV reuse/overlap is valid for symmetric or repeated surfaces that are meant to share pixels. Reject accidental overlap, not reuse itself. Do **not** use a universal packing-density score or maximize occupied pixels as a quality target. Multiple explicit texture variants may share one established geometry/UV layout.

Production painting waits for a usable **UV / Atlas Gate**:

```text
single color atlas selected
→ important faces mapped inside intended canvas
→ uv_offset / mirror_uv / autouv final enough for painting
→ accidental overlap rejected; intentional repeat/mirror reuse allowed
→ directional/asymmetric markings have suitable orientation
→ seam-critical regions identified
```

## Mirror UV

Use mirrored UV when visual symmetry is intended and no directional/asymmetric marking is required.

Avoid it for:

- text/symbols;
- asymmetric markings;
- left/right-specific details;
- intentionally different material wear.

## Palette / Material Ramps

A production palette is **material-aware**. Build a controlled value/hue ramp per material family instead of treating the whole model as one undifferentiated palette.

Possible roles include:

```text
base
shadow / deep shadow when needed
highlight / edge highlight when needed
material-specific secondary hue
identity/accent color
```

These roles are not a fixed color-count recipe. Metal, cloth, wood, stone, organic surfaces, paint, and accents may use different ramp behavior when the reference supports it.

## Base Texture

First establish:

- primary/secondary colors;
- material zones;
- accent/focal colors;
- basic value separation.

At the base gate, no important required surface should be unintentionally blank.

**Flat base color is not production completion** when the reference/style shows visible form shading, material variation, edge treatment, pattern, or identity detail.

## Value / Form Shading

After base regions, add controlled value/form information that makes geometry and material readable:

- coherent face-aware light/shadow separation;
- material-specific highlights/shadows;
- readable edge treatment where appropriate;
- local value changes that support form rather than random noise.

For Minecraft/pixel-art style, prefer stepped value ramps and deliberate pixel clusters over smooth airbrushed gradients. Continuous smooth gradients are optional only when the requested reference/style calls for them.

## Identity / Secondary Texture Detail

Identity-critical marks come before decorative microdetail. Add only detail that improves material/identity/readability:

- controlled hue/value variation;
- required markings, facial/identity features, emblems, wraps, seams, or panel lines;
- material-specific marks;
- purposeful pattern;
- small wear/dirt/scratches when requested and still readable.

Do not use random high-contrast noise as fake detail.

For crisp Minecraft pixel texture, use hard texel edges and avoid accidental soft/anti-aliased pixels unless the reference explicitly requires them.

## Lighting / Shading Consistency

Keep one coherent shading language across the asset. Avoid unrelated highlight directions between parts unless the requested style explicitly uses them.

## Material Readability

Texture variation should follow the intended material rather than generic noise.
For example:

- metal can use sharper contrast/highlights;
- cloth/skin normally uses softer stepped transitions;
- wood grain follows form direction;
- stone variation is irregular but controlled.

These are examples, not mandatory material recipes.

## Geometry Alignment

Texture should follow form:

- pattern direction follows surface direction;
- facial/identity features align to the intended face/view;
- recessed/raised cues are consistent with geometry;
- no accidental flip/rotation remains.

## Evidence Rule

Structural proof such as “texture is linked” or “UV exists” does not prove visual texture quality.

When texture completion is claimed, inspect fresh current-revision visual evidence in this order where applicable:

```text
UV / region placement
→ palette + material separation
→ value / form shading
→ seam / orientation
→ identity-critical marks
→ secondary detail density
```

Applicable criteria include:

- alignment;
- density/readability;
- pattern/material direction;
- missing/broken surfaces;
- identity/style match.

## Runtime Boundary

Current Reference Fidelity work has not recently proven the full UV/texture runtime/persistence path. Any claim that a particular MCP tool automatically packs UVs, chooses the optimal canvas, or persists all texture state must be verified against current Local source/runtime before use.

Use `LOCAL PROOF REQUIRED` when live proof matters.

## Completion Criteria

Texture is complete for the requested scope when:

- geometry is already coherent;
- exactly one intended base-color atlas is used unless an explicit variant requirement says otherwise;
- required UVs are usable and stable enough for the painted content;
- required surfaces have intended material/color information;
- material palette/value separation is readable;
- visible form is not left as unjustified flat fill;
- identity-critical markings/details are present when supported by the reference;
- texture density/style is coherent enough for the target;
- no unresolved critical/major texture issue remains;
- fresh visual evidence supports the texture claim;
- persistence/linkage claims are proven when they are material to delivery.

## Related

- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Validation Report](validation-report.md)
