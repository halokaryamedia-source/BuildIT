# BlockIT — Geometry Standard

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-08

## Purpose

Define object-agnostic geometry-quality rules for Minecraft Bedrock Entity models
created in Blockbench through MCP.

The active Modelling Brief owns object-specific shape/proportion/anatomy. This
standard owns how geometry decisions must be reasoned and validated.

## Core Principle

Every material Cuboid must have a modelling purpose in the **whole form**.

A Cube existing, being attached, overlapping, parented, or accepted by a tool is
structural state only. It does not prove correct size, placement, orientation, or
pivot.

## Whole-Form Contract

```text
Modelling Brief
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Intentional coarse Cuboids
↓
Global bounds observation
↓
Global visual gate
↓
Targeted correction or rebuild
↓
Secondary geometry / hierarchy / pivots
```

There is no universal support-first, section-first, largest-first, fixed-Cube
count, or per-Cube approval order.

## Primary Cube Readiness

Before authoring an important primary Cube, the modeller should know:

- what mass/role it represents;
- what view(s) support width/height/length or placement;
- its relationship to other primary masses;
- whether rotation is actually required;
- what pivot/rotation-center reason exists when rotation is material.

This does not become a persisted Cube plan. It is a no-guess reasoning gate.

## Initial Cube Creation

The normal `place_cube` path is intentionally strict.

### Extents

Every new Cube requires explicit finite:

```text
from: [x,y,z]
to:   [x,y,z]
```

Do not create a default `[0,0,0] → [1,1,1]` Cube merely to have something in the
scene and decide its geometry later.

The validator does not decide whether the chosen extents are visually good; it
requires the decision to be intentional.

### Parent

When a specific Group/bone is intended:

- use exact Group UUID or an exact unique target;
- a missing/ambiguous target must fail;
- root is valid only when root placement is intentional.

### Initial Rotation / Pivot

```text
rotation = [0,0,0]
→ origin may stay neutral / omitted

any non-zero rotation
→ explicit origin/pivot required
```

Do not allow a forgotten pivot to silently become world `[0,0,0]` for a rotated
Cube.

## Placement

Placement is justified by the mass relationship it represents, not by technical
contact.

Derive primary placement from:

- target envelope when defined;
- Primary Form Hypothesis;
- relevant reference views;
- visible attachment/contact requirements.

Reject:

- sequential Cube placement without whole-silhouette review;
- filling gaps just so everything touches;
- moving parts until numeric overlap exists and calling that approval;
- retaining a visibly wrong primary mass because later geometry depends on it.

## Dimensions / Coordinate Frame

Use one explicit model-space interpretation during a run:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
front direction = explicit
ground relationship = explicit
```

Approved dimensions are the numeric target envelope. Reference pixels/panel
sizes are not geometry calibration.

Do not impose arbitrary universal snapping rules unless the current project
requires them.

## Rotation

Use axis-aligned geometry when it represents the form correctly.

Rotation is justified when:

- the reference visibly requires an angled orientation/slope;
- a rotated Cuboid represents the intended silhouette more coherently than a
  stepped approximation;
- requested articulation/motion requires it.

Before material rotation, identify the evidence and the relationship it should
improve.

Reject:

- arbitrary multi-axis rotations;
- rotation used to compensate for wrong size/placement;
- angles copied from unrelated parts/fixtures;
- accumulating small angle changes after failed corrections;
- syntactically valid rotation treated as proof.

Prefer the simplest rotation that explains the visible form.

## Pivot / Origin

A meaningful pivot serves a real transform relationship:

- rotation center;
- joint/articulation;
- attachment;
- parent/group transform.

A geometric center is not universally correct. A distant origin is not valid
merely because Blockbench accepts it.

For an unrotated/non-articulated Cube, origin may remain a neutral implementation
detail. Do not invent a modelling story for it.

### Pivot-only Cube correction

When the Cube's visual geometry is already correct and only the pivot is wrong:

```text
origin changes
from omitted
to omitted
rotation omitted
→ pivot-only correction
```

Current Local uses `Cube.transferOrigin()` so `from/to` compensate to keep the
same visual position.

### Authored geometry rewrite

When the modeller intentionally changes geometry/rotation and pivot together:

```text
origin + from/to/rotation
→ one authored transform rewrite
```

Do not use pivot-transfer compensation in that case because the geometry/pivot
relationship itself is being redefined.

### Group / bone pivot

Material Group pivot changes should use exact target identity and Blockbench
`Group.transferOrigin()` semantics after the joint/attachment reason is known.

## Primary vs Secondary Geometry

### Primary

Minimum Cuboids establishing identity, global silhouette, primary volume, and
main attachment relationships.

Keep the first pass coarse enough to reject/rebuild cheaply.

### Secondary

Adds silhouette refinement, attachment, motion support, or visible detail only
after primary form passes.

Do not use secondary geometry to hide a primary proportion error.

## Cuboid Efficiency

Prefer fewer meaningful Cuboids over dense approximations.

Split a mass only for a demonstrated reason:

- different silhouette/orientation;
- separate pivot/hierarchy/motion;
- genuinely separate visible volume;
- verified technical constraint.

Adding another Cube is not the default correction.

## Correction Vocabulary

```text
TRANSLATE    placement wrong
RESIZE       extent/proportion wrong
ROTATE       orientation/slope wrong
REATTACH     contact/parent wrong
SPLIT        distinct orientation/volume genuinely needed
MERGE/REMOVE unnecessary or compensating geometry
ADD MASS     required visible volume genuinely missing
```

Use `ADD MASS` only when evidence shows missing volume.

## Multi-Cube Correction

If one diagnosed relationship spans several Cubes, correction should remain one
coherent decision. Current Local provides `modify_cubes_batch` for different
exact-UUID updates in one recoverable Undo unit.

Do not batch unrelated cleanup/speculative edits together.

## Global vs Local Failure

### Global

If the object is unrecognizable or several primary relationships are wrong:

```text
invalidate current scaffold
→ revise/rebuild Primary Form Hypothesis
```

### Local

If whole form is sound and one bounded relationship is wrong:

```text
inspect_element
→ causal correction
→ fresh affected view(s)
```

After two failed attempts in the same correction direction without new evidence,
stop patching and reframe the hypothesis.

## Geometry vs Texture

Use geometry for silhouette/real volume/separate motion. Use texture for surface
information that does not require volume.

Texture must not hide incorrect geometry.

## Attachment / Intersection

Visible connection quality is judged visually. AABB overlap or hierarchy alone
is not proof.

Avoid floating required parts, accidental penetration, excessive unreadable
intersection, and compensating Cubes inserted to conceal a wrong mass relation.

## Symmetry

Use symmetry/mirroring only when the reference supports it. Preserve meaningful
asymmetry.

Do not infer hidden geometry from symmetry when reference evidence does not
support it.

## Hierarchy / Naming

Hierarchy exists for understandable organization and actual articulation needs.
Use semantic names, but use stable UUIDs where mutation identity matters.

Hierarchy must never justify bad placement/pivot/attachment.

## Completion Criteria

Geometry is ready for UV/texture only when:

- whole primary form passed visual review;
- major proportions and contacts are coherent;
- each material rotation has a form/motion reason;
- each meaningful pivot has a transform/joint/attachment reason;
- no important Cube is justified only by “it is placed/attached”;
- Cuboid count is purposeful;
- required hierarchy is understandable/editable;
- no unresolved critical/major geometry issue remains;
- visual claims use fresh current-revision evidence.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Visual Validation](07-visual-validation.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
