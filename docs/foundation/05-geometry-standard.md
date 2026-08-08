# BlockIT — Operating Model Geometry

**Status:** Draft  
**Version:** 1.2

## 1. Purpose

Define generic geometry-quality rules for Minecraft Bedrock models created in
Blockbench through MCP.

Object-specific anatomy, proportions, view priorities, and build order come from
the active Model Reference and current verified project/runtime constraints—not
from this document.

## 2. Core Principle

Every Cuboid must have a clear modelling purpose and must contribute to the
**whole model**, not only look plausible in isolation.

A Cuboid should materially contribute to one or more of:

- primary volume;
- silhouette;
- attachment/contact;
- separate orientation/pivot/hierarchy;
- required animation/motion;
- visible detail that texture cannot represent effectively.

If a Cuboid does not improve the intended result, do not add it.

A Cube existing, touching another Cube, overlapping validly, or being assigned to
a group is **structural state only**. None of those facts prove that its
placement, size, rotation, or pivot is visually correct.

## 3. Whole-Form Geometry

Reason about major masses and relationships before local detail.

```text
Model Reference
↓
coordinate frame + target envelope
↓
normalized Primary Form Hypothesis
↓
coarse primary masses + major relationships
↓
structural envelope check
↓
global visual gate
↓
secondary geometry / hierarchy / pivots
↓
full geometry review
```

There is **no universal support-first, section-first, largest-first, or
per-cube approval order**. Construction order should follow whichever sequence
best preserves the current object's major relationships and safe editability.

Do not finish/polish one local section while the rest of the primary form is
still undefined.

## 4. Evidence-Backed Authoring Rule

Before authoring an important primary Cuboid, the modeller must be able to answer:

```text
What primary mass/role does this Cuboid implement?
Which reference view(s) support its width/height/length or relative placement?
What relationship must it preserve with another primary mass?
Does it actually need rotation?
If rotation/pivot is used, what visible/form/motion reason requires it?
```

The answer does **not** need to become a persisted per-Cube form or approval
artifact. It is a reasoning gate that prevents arbitrary transforms.

If the modeller cannot explain a primary Cube beyond "it fits here", "it touches
the previous Cube", or "the tool accepted it", the Cube is not ready to author.

Uncertain reference evidence should be marked as uncertainty and tested with the
smallest informative visual gate rather than converted into false precision.

## 5. Primary And Secondary Geometry

### Primary Geometry

Primary masses establish identity, global silhouette, volume, and the main
attachment relationships.

The first geometry pass should use the minimum set of Cuboids required for the
object to read as one coherent form.

Each primary mass should remain coarse enough that a wrong hypothesis can be
revised or rebuilt cheaply. Do not prematurely split a mass into many detail
Cubes.

Primary geometry must pass a global visual check before detail work expands.

### Secondary Geometry

Secondary geometry refines silhouette, attachment, motion, or visible detail.
Add it only after the primary form is coherent.

Do not add secondary geometry to hide an unresolved primary proportion or
relationship error.

## 6. Dimensions, Coordinate Frame, And Cleanliness

Declared target dimensions are the numeric model target/envelope when the
active reference/policy provides them. Reference pixels, panel dimensions, and
visual labels are not calibration data.

Use one explicit coordinate interpretation during a modelling run:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
```

The asset's front direction and ground relationship must be established before
primary authoring when they materially affect placement.

Use clean, intentional authored values appropriate to the current Bedrock
project and modelling style. Avoid noisy accidental decimals introduced by
uncontrolled fitting.

Exact universal snapping rules such as mandatory whole-number Cube sizes,
mandatory `0.5` transforms, or mandatory `2.5°` rotations must not be treated as
Bedrock/product law unless the current preset, source, or approved project rule
actually requires them. When a clean grid convention is useful, apply the
smallest convention that preserves the intended form.

Do not sacrifice visible proportion/silhouette merely to satisfy an arbitrary
historic grid rule.

## 7. Placement Rule

A Cuboid's placement is justified by the **mass relationship it represents**, not
by the fact that it can be made to connect.

For primary geometry, placement should be derived from:

- the target envelope;
- the Primary Form Hypothesis;
- supporting reference views;
- required visible contact/attachment relationships.

Reject these placement patterns:

- sequentially placing Cubes next to previous Cubes without checking the whole
  silhouette;
- filling gaps merely so every part touches;
- moving a part until coordinates overlap and treating the overlap as approval;
- preserving a visibly wrong mass because later Cubes were already built around
  it.

If several primary masses are wrong relative to each other, revise the primary
hypothesis or correct them as one coherent relationship rather than patching the
model Cube by Cube.

## 8. Orientation And Rotation

Use axis-aligned geometry when it correctly represents the form. Rotation is not
an automatic way to make a model look more complex or organic.

A rotation is justified only when at least one of these is true:

- the reference visibly shows a primary/secondary mass with an important slope
  or angled orientation;
- one rotated Cuboid represents the silhouette more coherently than a stepped
  stack of axis-aligned Cuboids;
- the requested articulation/motion requires the authored orientation.

Before applying a material rotation, identify the supporting view(s) and the
visible relationship the rotation is meant to improve.

Do not:

- use arbitrary multi-axis rotations because an angle "looks plausible";
- rotate a Cube to compensate for wrong size or placement;
- copy an angle from another fixture/object;
- accumulate small rotations after repeated failed visual corrections;
- treat a syntactically valid rotation as evidence that orientation is correct.

Prefer the simplest rotation that explains the visible form. If one principal
axis captures the slope, do not add extra-axis rotation without evidence.

After rotating a primary mass, re-check its silhouette, envelope, and visible
contacts in the views that motivated the rotation.

## 9. Pivot Rule

A pivot/origin is not decoration and must not be chosen arbitrarily.

A material pivot is justified only when it serves a concrete purpose such as:

- the center of a visible rotation/slope operation;
- an attachment/joint relationship that must remain coherent under transform;
- intended articulation/animation;
- a parent/group transform that requires a meaningful local origin.

Choose the pivot from the intended **rotation center, joint, attachment, or
transform relationship**. A geometric center is not universally correct, and a
random distant origin is never acceptable merely because Blockbench permits it.

For an unrotated, non-articulated Cuboid, origin may remain an implementation
detail, but it must not be presented as a meaningful modelling decision unless a
real transform/hierarchy need exists.

Reject pivots that:

- are far from the part with no explained transform reason;
- make a simple rotation orbit around an unrelated point;
- are copied from another part/fixture without the same relationship;
- exist only because the tool/schema requires an origin value;
- break visible attachment when the parent/group transforms.

After changing a meaningful pivot or parent transform, inspect the affected
connection/orientation rather than assuming hierarchy validity means visual
validity.

## 10. Cuboid Efficiency

Prefer fewer meaningful Cuboids over dense approximations.

Split a rectangular volume only for a demonstrated reason such as:

- different silhouette direction;
- separate rotation/pivot;
- separate hierarchy/bone/animation;
- distinct visible volume;
- verified technical constraint.

Do not create stepped stacks as a substitute for understanding a smooth/angled
primary relationship when a simpler rotated or proportioned construction would
serve the form better.

Do not add another Cube as the default correction. First classify the error as
placement, size, orientation, attachment, unnecessary geometry, or a genuinely
missing visible mass.

## 11. Geometry Versus Texture

Use geometry when the feature changes outer shape, needs real volume, requires
separate movement/pivot, or remains visually important at intended viewing
distance.

Use texture when the feature is mainly color, pattern, material, shading, or
small surface detail that does not need volume/motion.

Texture must not be used to hide incorrect primary geometry.

## 12. Attachment And Intersections

Visible connections must look coherent in the relevant reference views.
Technical overlap/contact alone is not visual proof.

Avoid:

- detached/floating required parts;
- accidental penetration;
- excessive intersection that destroys readability;
- parts merged only because their coordinates overlap;
- compensating Cuboids inserted solely to conceal a gap caused by a wrong
  primary relationship.

Small intentional overlap is acceptable when it supports a clean visible
connection or required motion.

An attachment must be judged by what it looks like in the relevant views, not by
whether two AABBs intersect.

## 13. Symmetry

Use mirroring/symmetry only when the reference supports it. Preserve meaningful
asymmetry when the requested object requires it.

Do not infer hidden-side detail beyond what the approved reference/policy can
support.

## 14. Hierarchy And Naming

Hierarchy should make editing/animation understandable and preserve real parent-
child relationships needed by the asset.

Use clear semantic names from the current object/request. Names help humans and
agents navigate the project but are not proof of identity; use stable element
IDs/UUIDs where implementation identity matters.

Avoid meaningless names such as `cube1`, `new_cube`, or version-churn labels
when a clear semantic name is available.

Hierarchy alone must never be used to justify a bad pivot, bad placement, or
visually incoherent attachment.

## 15. Hidden And Temporary Geometry

Remove geometry that has no current purpose.

Keep hidden/temporary geometry only when a verified animation/state/workflow
requires it. Temporary geometry must not remain accidentally in the release
candidate.

## 16. Visual Correction Rule

If the silhouette, proportion, mass relationship, orientation, or visible
attachment is wrong, fix the responsible geometry relationship.

Use this causal vocabulary before selecting a mutation:

```text
TRANSLATE  → placement is wrong
RESIZE     → proportion/extent is wrong
ROTATE     → orientation/slope is wrong
REATTACH   → contact/parent relationship is wrong
SPLIT      → one mass genuinely needs separate orientations/volumes
MERGE/REMOVE → geometry is unnecessary or compensatory
ADD MASS   → a required visible volume is genuinely missing
```

Do not:

- approve a bad shape because coordinates are valid;
- use similarity/IoU/projection scores as geometry authority;
- average multiple views into guessed coordinates;
- add more detail to compensate for a global-form error;
- keep changing rotations/pivots without identifying the visible problem they
  are meant to solve;
- restart the whole model for a local issue unless the local finding actually
  invalidates the primary form.

If the object is unrecognizable or several primary relationships fail together,
invalidate/revise the primary hypothesis rather than applying a sequence of local
patches.

Use fresh visual evidence after a correction. If the same correction direction
fails twice without new evidence, stop and replan.

## 17. Geometry Review

Before UV/texture work, verify only applicable criteria:

- whole silhouette is recognizable;
- major masses/proportions are coherent across the declared reference views;
- required primary parts are present/oriented correctly;
- width/depth/footprint are plausible where the reference shows them;
- visible connections are coherent;
- every material rotation has a visible/form/motion reason;
- meaningful pivots correspond to an intended transform/joint/attachment;
- no obviously arbitrary/distant pivot remains;
- Cuboid count is purposeful rather than compensatory;
- hierarchy/pivots support the requested editability/motion;
- no unresolved critical/major intersection, inversion, or missing-part issue
  remains;
- target dimensions are respected when they are defined as a current project
  requirement.

Exact numeric cleanliness rules should be validated against current project/
runtime constraints rather than assumed from historical experiments.

## 18. Completion Criteria

Geometry is complete only when:

- the whole primary form has passed visual review;
- required secondary geometry/hierarchy/pivots are complete and purposeful;
- no known critical/major geometry issue remains;
- no important Cube is justified only by "it is attached/placed";
- no important rotation/pivot remains without an evidence-backed modelling
  reason;
- the result is structurally usable/editable for downstream UV/texture/
  animation work;
- claims about visual correctness are backed by fresh visual evidence.
