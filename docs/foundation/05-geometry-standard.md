# BlockIT — Operating Model Geometry

**Status:** Draft  
**Version:** 1.1

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

## 3. Whole-Form Geometry

Reason about major masses and relationships before local detail.

```text
Model Reference
↓
whole-form interpretation
↓
primary masses + major relationships
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

## 4. Primary And Secondary Geometry

### Primary Geometry

Primary masses establish identity, global silhouette, volume, and the main
attachment relationships.

The first geometry pass should use the minimum set of Cuboids required for the
object to read as one coherent form.

Primary geometry must pass a global visual check before detail work expands.

### Secondary Geometry

Secondary geometry refines silhouette, attachment, motion, or visible detail.
Add it only after the primary form is coherent.

Do not add secondary geometry to hide an unresolved primary proportion or
relationship error.

## 5. Dimensions And Coordinate Cleanliness

Declared target dimensions are the numeric model target/envelope when the
active reference/policy provides them. Reference pixels, panel dimensions, and
visual labels are not calibration data.

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

## 6. Orientation And Rotation

Use axis-aligned geometry when it correctly represents the form. Use rotation
when the reference clearly requires a sloped/angled mass or when rotation is the
simplest coherent construction.

Do not default every uncertain part to zero rotation, and do not rotate merely
because a previous fixture used a similar angle.

Choose pivots from actual articulation/attachment needs. A geometric-center
pivot is not universal.

After a parent/group transform that can affect visible children, re-check the
affected relationships before assuming they remain visually connected.

## 7. Cuboid Efficiency

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

## 8. Geometry Versus Texture

Use geometry when the feature changes outer shape, needs real volume, requires
separate movement/pivot, or remains visually important at intended viewing
distance.

Use texture when the feature is mainly color, pattern, material, shading, or
small surface detail that does not need volume/motion.

Texture must not be used to hide incorrect primary geometry.

## 9. Attachment And Intersections

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

## 10. Symmetry

Use mirroring/symmetry only when the reference supports it. Preserve meaningful
asymmetry when the requested object requires it.

Do not infer hidden-side detail beyond what the approved reference/policy can
support.

## 11. Hierarchy And Naming

Hierarchy should make editing/animation understandable and preserve real parent-
child relationships needed by the asset.

Use clear semantic names from the current object/request. Names help humans and
agents navigate the project but are not proof of identity; use stable element
IDs/UUIDs where implementation identity matters.

Avoid meaningless names such as `cube1`, `new_cube`, or version-churn labels
when a clear semantic name is available.

## 12. Hidden And Temporary Geometry

Remove geometry that has no current purpose.

Keep hidden/temporary geometry only when a verified animation/state/workflow
requires it. Temporary geometry must not remain accidentally in the release
candidate.

## 13. Visual Correction Rule

If the silhouette, proportion, mass relationship, orientation, or visible
attachment is wrong, fix the responsible geometry relationship.

Do not:

- approve a bad shape because coordinates are valid;
- use similarity/IoU/projection scores as geometry authority;
- average multiple views into guessed coordinates;
- add more detail to compensate for a global-form error;
- restart the whole model for a local issue unless the local finding actually
  invalidates the primary form.

Use fresh visual evidence after a correction. If the same correction direction
fails twice without new evidence, stop and replan.

## 14. Geometry Review

Before UV/texture work, verify only applicable criteria:

- whole silhouette is recognizable;
- major masses/proportions are coherent across the declared reference views;
- required primary parts are present/oriented correctly;
- width/depth/footprint are plausible where the reference shows them;
- visible connections are coherent;
- Cuboid count is purposeful rather than compensatory;
- hierarchy/pivots support the requested editability/motion;
- no unresolved critical/major intersection, inversion, or missing-part issue
  remains;
- target dimensions are respected when they are defined as a current project
  requirement.

Exact numeric cleanliness rules should be validated against current project/
runtime constraints rather than assumed from historical experiments.

## 15. Completion Criteria

Geometry is complete only when:

- the whole primary form has passed visual review;
- required secondary geometry/hierarchy/pivots are complete;
- no known critical/major geometry issue remains;
- the result is structurally usable/editable for downstream UV/texture/
  animation work;
- claims about visual correctness are backed by fresh visual evidence.
