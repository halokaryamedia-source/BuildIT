# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-08

## Purpose

Define Source Image → approved visual Modelling Brief handoff for Minecraft
Bedrock modelling.

The reference should reduce ambiguity about identity, silhouette, proportion,
major masses, visible contacts, orientation, and style. It must **not** become a
pixel-calibrated Cube blueprint.

## Core Principle

The approved five-view image is a **visual Modelling Brief**.

```text
Source Image / user intent
↓
Modelling Brief Draft
↓
user review / targeted correction when needed
↓
Approved Modelling Brief
↓
Reference Fidelity modelling workflow
```

Approval means the brief is useful enough to model from. It does not certify
metric image consistency and does not approve Cube transforms.

## Canonical Terms

- **Source Image** — original user image(s); identity/provenance authority, not
  direct geometry data.
- **Golden Sample** — layout/lighting/presentation/construction-language example;
  never target anatomy authority.
- **Modelling Brief Draft** — generated five-view reference before approval.
- **Modelling Brief** — approved visual guide consumed by modelling.
- **Requested Dimensions** — approved numeric width/height/length target.
- **Reference Package** — Modelling Brief + small metadata + optional Source
  Images/support references.

## View Baseline

Normal generated-reference baseline:

- side;
- front;
- back;
- top / footprint;
- front 3/4 volume preview.

Orthographic views carry the main shape/proportion evidence. The 3/4 view helps
read volume and identity; it is not metric calibration.

A different view set is allowed when the actual object requires it. Do not turn
one Golden Sample's panels into permanent anatomy rules.

## Cross-View Consistency

Before modelling, the required views must describe one compatible object.

Use axis evidence deliberately:

```text
width  ← front/back + top when visible
height ← front/back + side
length ← side + top
```

Placement/orientation should rely on the views that actually reveal that
relationship.

If primary-mass evidence materially conflicts across views, mark the reference
`NOT READY / NEEDS REVIEW` rather than silently averaging contradictory shapes.

## Dimensions

When dimensions are approved:

`1 block = 16 Blockbench units`

Use dimensions as the numeric whole-model target/envelope. Individual Cube
transforms remain modeller decisions based on the target envelope + visible
proportions.

Never derive scale/transforms from:

- pixels;
- subject bounding boxes in the image;
- dimension-line lengths;
- canvas/panel size;
- perspective projection;
- masks/mesh fitting/similarity score.

## Golden Sample Rule

Use a Golden Sample for:

- layout;
- background/lighting;
- labeling/presentation;
- Minecraft/Blockbench construction language;
- approximate visual density.

Rule:

```text
COPY THE CONSTRUCTION LANGUAGE AND QUALITY BAR.
REPLACE THE SUBJECT.
```

The Source Image/user intent owns target identity and recognizable features.

## Draft Quality Bar

A good generated Draft should show:

- clear primary/secondary rectangular masses;
- purposeful size variation;
- stepped transitions where useful;
- limited purposeful rotations only where an angled form requires them;
- consistent construction and identity across views;
- usable orthographic silhouettes;
- coherent visible contacts;
- a distinct 3/4 volume read.

Reject Drafts that are mainly:

- smooth/realistic forms with pixelated skin;
- generic voxel filters;
- uniform Cube stacking;
- inconsistent subjects between panels;
- cropped/missing/ambiguous required views.

The Draft is a **buildable visual target**, not an exact Cube plan.

## Hidden Geometry Rule

Distinguish:

- **hidden surface** of a known visible volume — may be completed consistently;
- **hidden feature** such as an unseen protrusion/recess/attachment — do not
  invent without evidence or user requirement.

## Metadata

Keep the package small. Typical metadata:

```text
Model
Target: Minecraft Bedrock Entity
Requested dimensions (when relevant)
Texture style: 16×16 / 32×32 / other requested style
Animation: required / not required
Additional notes
```

Do not ask the user for Cube counts, bones, pivots, UV layout, or MCP operations.

## Generation Budget

Default:

```text
five-view Draft       = maximum 1
targeted correction   = maximum 1
automatic alternatives = 0
```

Create another Draft only for a concrete defect. Do not generate variants to
simulate progress.

Do not revive the old multi-sheet/manifest/hash/ZIP machinery unless a future
requirement proves it necessary.

## Reference Generator Boundary

Reference generation belongs to an **image-capable ChatGPT/Reference Generator
surface**, not a root Codex skill.

Codex consumes the approved Modelling Brief through the Bedrock modelling
workflow. If the active surface cannot inspect/generate the required image, do
not fake a completed reference.

## Handoff To Modelling

The approved reference feeds:

```text
Cross-view consistency
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Explicit coarse primary Cubes
↓
Structural + visual observation
↓
Reference ↔ model comparison
```

The Modelling Brief provides visual requirements. The modeller decides Cube
count, exact transforms, hierarchy, pivots, UVs, texture, and optional animation.

No package field may hard-code object-specific MCP profiles or geometry rules.

## Completion Criteria

Reference is ready when:

- target identity/style are clear;
- required views describe one compatible object;
- whole-form primary masses/proportions are understandable;
- requested dimensions are available when needed;
- animation scope is known;
- no unresolved major cross-view conflict remains;
- user has approved the brief for modelling.

Reference/package validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
