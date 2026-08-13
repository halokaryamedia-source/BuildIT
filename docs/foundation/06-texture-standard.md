# BlockIT — Texture Standard

**Status:** Active Policy  
**Version:** 1.1  
**Updated:** 2026-08-08

## Purpose

Define texture/UV quality rules for Minecraft Bedrock models after geometry is
coherent.

This note defines **modelling policy**, not guaranteed MCP automation. Actual UV,
texture, canvas, and persistence capability remains current source/runtime truth.

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
prepare usable UV layout
↓
base color/material pass
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

## Style / Resolution

Common Minecraft-style targets may include `16×16` or `32×32` visual density,
but the user/reference can request another appropriate style.

Use lower density when readability/simplicity is more important. Use higher
density only when visible detail genuinely benefits.

Do **not** treat a specific texture-canvas size (`256`, `512`, `1024`, etc.) as a
universal product law or automatic MCP guarantee. Choose/verify canvas behavior
from the current model, project format, and actual runtime capability.

**Logical/project UV resolution and physical bitmap dimensions are separate facts.** Do not assume they must be equal, power-of-two, or share one universal scale ratio.

## UV Requirements

Where texture is required:

- important visible surfaces have usable UVs;
- UVs remain within the intended texture canvas;
- accidental overlap is avoided;
- mirrored UV is intentional;
- focal areas receive adequate usable texel space;
- orientation remains understandable/editable.

Do not change UV layout after substantial finished painting without a concrete
reason.

## Box UV / Atlas Authoring

Box UV is a first-class professional path for Cuboid Bedrock assets when it represents the intended surface workflow. Final layout may deliberately use authored per-Cube `uv_offset`, `mirror_uv`, and disabled/controlled auto-UV state. Automatic UV can be a starting aid; it is not proof of a finished atlas.

Intentional UV reuse/overlap is valid for symmetric or repeated surfaces that are meant to share pixels. Reject accidental overlap, not reuse itself. Do **not** use a universal packing-density score or maximize occupied pixels as a quality target. Multiple texture variants may share one established geometry/UV layout.

## Mirror UV

Use mirrored UV when visual symmetry is intended and no directional/asymmetric
marking is required.

Avoid it for:

- text/symbols;
- asymmetric markings;
- left/right-specific details;
- intentionally different material wear.

## Base Texture

First establish:

- primary/secondary colors;
- material zones;
- accent/focal colors;
- basic value separation.

At the base gate, no important required surface should be unintentionally blank.

## Secondary Texture Detail

Add only detail that improves material/identity/readability:

- controlled hue/value variation;
- highlights/shadows;
- material-specific marks;
- purposeful pattern;
- facial/identity details;
- small wear/dirt/scratches when requested.

Do not use random high-contrast noise as fake detail.

## Lighting / Shading Consistency

Keep one coherent shading language across the asset. Avoid unrelated highlight
directions between parts unless the requested style explicitly uses them.

## Material Readability

Texture variation should follow the intended material rather than generic noise.
For example:

- metal can use sharper contrast/highlights;
- cloth/skin normally uses softer transitions;
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

Structural proof such as “texture is linked” or “UV exists” does not prove visual
texture quality.

When texture completion is claimed, inspect fresh current-revision visual
evidence for applicable criteria:

- alignment;
- density/readability;
- pattern/material direction;
- missing/broken surfaces;
- identity/style match.

## Runtime Boundary

Current Reference Fidelity work has not recently proven the full UV/texture
runtime/persistence path. Any claim that a particular MCP tool automatically
packs UVs, chooses the optimal canvas, or persists all texture state must be
verified against current Local source/runtime before use.

Use `LOCAL PROOF REQUIRED` when live proof matters.

## Completion Criteria

Texture is complete for the requested scope when:

- geometry is already coherent;
- required UVs are usable;
- required surfaces have intended material/color information;
- texture density/style is coherent enough for the target;
- no unresolved critical/major texture issue remains;
- fresh visual evidence supports the texture claim;
- persistence/linkage claims are proven when they are material to delivery.

## Related

- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Validation Report](validation-report.md)
