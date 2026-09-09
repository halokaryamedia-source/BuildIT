# BlockIT — Geometry Standard

**Status:** Active Policy  
**Version:** 1.9  
**Updated:** 2026-09-09

## Purpose

Define object-agnostic geometry-quality rules for Minecraft Bedrock Entity models created through MCP. Professional `.bbmodel` samples are **evidence of modelling decisions**, not presets, anatomy rules, fixed Cube counts, asset classes, or complexity targets.

## Core Principle

Use the **minimum geometry required to preserve correct 3D form**, not the minimum Cube count.

Every material Cuboid must have a modelling purpose in the **whole form**. Its 3D purpose is silhouette, real volume, opening/negative-space boundary, contact, 3D layering, transform ownership, or motion. Surface information that does not need those properties belongs in Texture; unsupported/immaterial detail may be omitted.

A Cube existing, touching, overlapping, being parented, or being accepted by a tool is structural state only. It does not prove correct representation, size, placement, orientation, hierarchy, pivot, or surface integrity.

## Whole-Form Contract

```text
Modelling Brief
↓
Semantic Form
↓
Representation Choice
↓
construction + transform ownership
↓
Primary Form Hypothesis + required primary hierarchy
↓
intentional coarse geometry
↓
primary visual gate
↓
conditional Surface Integrity review
↓
targeted correction or rebuild
↓
identity-weighted secondary geometry
```

There is no universal support-first, section-first, largest-first, fixed-Cube count, asset preset, watertight requirement, or per-Cube approval order.

## Primary Readiness

Before authoring an important primary part, know:

- what visible mass/landmark/relationship it represents;
- which view(s) constrain its size, placement, contact, or orientation;
- the simplest suitable representation;
- whether its transform is local to one Cube or shared by a Group/Bone;
- what pivot/contact reason exists when rotation or articulation is material.

It is a no-guess reasoning gate, not a persisted Cube plan.

## Representation Choice

Choose the **simplest construction that preserves the visible 3D requirement**. These are reasoning patterns, not presets, schemas, or asset classes:

- **solid Cuboid / `SOLID_CUBOID`** — real volume or silhouette-bearing mass;
- **thin or zero-thickness plane-like Cube / `PLANE_LIKE`** — genuinely sheet-like geometry where thickness is not material;
- **planar cutout carrier / `PLANAR_CUTOUT_CARRIER`** — plane-like host whose alpha texture owns the internal silhouette;
- **layered surface / layered/inflated shell / `LAYERED_SURFACE`** — a visible layer over/inside an established form;
- **linked meaningful segments / `SEGMENTED_FORM`** — bend/curve/articulated chain requiring purposeful pieces;
- **texture-only / `TEXTURE`** — surface information requiring no 3D behavior;
- **`OMIT`** — unsupported or immaterial detail.

Rules:

- A plane-like Cube is not a shortcut for unknown depth.
- Zero span on exactly one axis can be valid plane-like Geometry when the representation requires it. Two or more collapsed axes do not form a usable surface carrier.
- `inflate` is layer-control, not proportion repair or fake detail. Its sign and magnitude are local authored choices; do not impose a positive-only or fixed-value rule.
- Linked segments must express meaningful changes of direction/contact; reject micro-segmentation and unit-Cube staircasing used only to imitate a curve.
- A visible marking, color break, scratch, seam, painted line, or shallow graphic feature stays Texture unless it materially changes 3D behavior.
- Complexity follows visible need. A simple professional object may require very few Cubes; a complex one may require many.

### Planar cutout carrier

`PLANAR_CUTOUT_CARRIER` is inside `DIRECT`, not a new Geometry Strategy or object preset. Use it when broad plane-like faces are the minimum host for a texture/alpha silhouette and the cut-out feature needs no material depth, volume, contact, or independent motion.

- Geometry owns carrier count, envelope, placement, orientation, contact, parent, and pivot; Texture owns silhouette/holes inside carrier bounds.
- Small-detail thresholds measure the visible feature, not incidental carrier thickness.
- Prefer `SINGLE`; when yaw coverage needs a cross, `CROSSED_PAIR` uses two co-centered plane-like Cubes about 90° apart under one shared transform and one coherent creation batch. More planes need explicit evidence.
- Do not decompose alpha-owned repeated subfeatures into micro-Cubes.
- Use zero/minimal positive thickness according to format/UV/render stability; prefer per-face UV over thickening only to satisfy Box UV.

## Transform Ownership

Decide **who owns a transform** before choosing rotation values.

### Cube-owned transform

Use when one rigid local part alone needs the orientation and no shared semantic child relationship depends on that transform.

### Group/Bone-owned transform

Use when several Cubes form one semantic segment, attachment, or articulated part whose orientation should move together, or when parent-child transform continuity is itself part of the form.

Do not rotate many child Cubes independently when one shared semantic transform explains the same structure. Do not create hierarchy solely to increase depth or node count.

### Primary hierarchy timing

Hierarchy is not automatically secondary. A Group/Bone/pivot belongs in the **primary blockout** when it is required to establish:

- primary form/orientation;
- attachment/contact;
- articulation or segment continuity;
- shared transform ownership.

Neutral organization that does not affect the judged form may wait until after primary `PASS`.

## Initial Cube Creation

Every new Cube requires explicit finite:

```text
from: [x,y,z]
to:   [x,y,z]
```

Zero span on one axis is valid only for an intentional plane-like representation. Two or more zero spans are degenerate for visible surface construction. Do not create a default `[0,0,0] → [1,1,1]` Cube merely to have geometry and decide later.

### Parent

When a specific Group/bone is intended:

- use exact Group UUID or an exact unique target;
- a missing/ambiguous target must fail;
- root is valid only when root placement is intentional.

### Initial Rotation / Pivot

```text
rotation = [0,0,0]
→ valid when the orientation decision is AXIS_ALIGNED

any non-zero rotation
→ explicit origin/pivot required
```

A forgotten pivot must not silently become world `[0,0,0]`.

## Placement

Placement is justified by the represented relationship, not by technical contact.

Derive primary placement from the target envelope when defined, Primary Form Hypothesis, relevant views, and visible attachment/contact requirements.

Reject sequential Cube placement without whole-form review, gap filling just so things touch, numeric overlap treated as approval, or retaining a wrong primary mass because downstream work exists.

## Mutation Target Identity

A mutation target must be intentional. Use UUID first; exact names must be unique. Editor selection is not durable identity. Multi-Cube correction uses explicit UUIDs and one coherent diagnosed relationship.

## Dimensions / Coordinate Frame

Use one explicit interpretation:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
front direction = explicit
ground relationship = explicit
```

Approved dimensions are the numeric target envelope. Reference pixels/panel size are not geometry calibration. Do not impose arbitrary universal snapping.

## Rotation

Use axis-aligned geometry when it represents the form correctly.

Rotation is justified when:

- the reference **visibly** requires an angled orientation/slope;
- a rotated Cuboid represents that orientation more coherently than an intentional stepped construction;
- articulation/shared segment motion requires it.

Before material rotation, identify the evidence, transform owner, pivot role, and relationship it should improve.

Reject arbitrary multi-axis rotations, rotation used to compensate for wrong size/placement, angles copied from samples, accumulating small angle changes after failed corrections, or syntactically valid rotation treated as proof.

Prefer the simplest rotation that explains the visible form.

### Existing Cube rotation activation

```text
current rotation = [0,0,0]
requested rotation = non-zero
origin omitted
→ reject before mutation

current rotation = [0,0,0]
requested rotation = non-zero
origin supplied explicitly
→ allowed authored rotation/pivot decision

current rotation already non-zero
requested rotation changes
origin omitted
→ allowed; reuse the existing known pivot
```

The explicit origin may equal the stored origin when that point is genuinely intended. Do not infer pivot intent merely because a numeric origin exists.

## Pivot / Origin

A meaningful pivot serves a real transform relationship:

- rotation center;
- joint/articulation;
- attachment;
- parent/group transform.

A geometric center is not universally correct, but it is the **provisional fallback** when no material attachment/joint/parent evidence exists — `center = [(from[0]+to[0])/2, (from[1]+to[1])/2, (from[2]+to[2])/2]` or the parent Group pivot for joint-owned rotation. A distant origin is not valid merely because Blockbench accepts it. For an unrotated/non-articulated Cube, origin may remain a neutral implementation detail.

### Pivot-only Cube correction

```text
origin changes
from omitted
to omitted
rotation omitted
→ pivot-only correction
```

Current Local uses `Cube.transferOrigin()` so visual position is preserved.

### Authored geometry rewrite

When geometry/rotation and pivot intentionally change together:

```text
origin + from/to/rotation
→ one authored transform rewrite
```

### Group / Bone pivot

Material Group pivot changes use exact target identity and `Group.transferOrigin()` semantics after the joint/attachment/transform reason is known.

## Primary vs Secondary Geometry

### Primary

Minimum Cuboids **plus required transform hierarchy/pivots** that establish identity, global silhouette, primary volume, principal orientation, and main attachment relationships. Keep the first pass cheap enough to reject/rebuild.

### Secondary

Adds only grounded silhouette refinement, attachment/layering, motion support, or visible detail after primary form passes.

Secondary complexity is **identity-weighted**: concentrate geometry where recognizability, silhouette, contact, layering, or motion benefits. Do not subdivide every region uniformly or add rotation noise to look detailed.

## Cuboid Efficiency

Cube efficiency is **representation-first**, never a fixed count target.

Before adding a secondary Cube, ask whether the feature needs 3D silhouette, real volume, contact, negative-space boundary, 3D layering, transform ownership, or motion. If none apply and Texture can carry the visible information, use Texture.

Detail-only span/thickness `<= 4 Blockbench units` is an **anti-overcube guardrail, not a classifier**. It triggers a stronger representation challenge; it does not forbid Geometry when the small feature genuinely carries required 3D form.

Prefer fewer meaningful Cuboids over dense approximations. Split a mass only for demonstrated different silhouette/orientation, separate transform/pivot/motion, genuinely separate visible volume, or verified technical constraint. Adding another Cube is not the default correction.

For `3D_ASSISTED`, PrimitiveAnything output is an editable scaffold, not final Cube-count authority. Semantic Geometry Cleanup must merge/remove/replace primitive Cubes and technical Groups that do not remain necessary for silhouette, volume, contact, negative space, layering, or transform/motion.

## Surface Integrity Contract

Surface integrity means **every material surface relationship is intentional**, not that every model is universally watertight.

Reasoning relationships:

```text
CLOSED_BOUNDARY          surfaces must meet/cover as one enclosure
INTENTIONAL_OPENING      visible opening/negative space is required
LAYERED_OFFSET           surfaces are deliberately separated/inset
INTENTIONAL_INTERSECTION hidden/structural penetration is deliberate
CUTOUT_CARRIER           plane-like surface carries alpha silhouette
```

When adjacency, layering, or contact is material, combine fresh whole-form views with one bounded `inspect_model_bounds` review. The runtime may report:

```text
z_fighting
micro_gap
coplanar_edge_gap
shallow_penetration
```

These are objective **review hints**, not semantic verdicts. They identify relationships that require judgement:

- exposed same-facing coplanar overlap is a Z-fighting risk and must be corrected or removed;
- a micro-gap or uncovered coplanar edge-gap is a defect when the relationship is `CLOSED_BOUNDARY`;
- a large visible opening is judged from reference/semantic evidence, not auto-filled by a watertight rule;
- deep hidden structural intersection may be intentional;
- shallow penetration remains review-required until the intended relationship is demonstrated;
- a valid zero-thickness plane-like carrier is not a degenerate solid merely because one axis has zero span.

Geometry `PASS` requires no unresolved material surface risk. A clean diagnostic does not create visual PASS, and positive-volume overlap never proves contact.

## Correction Vocabulary

```text
TRANSLATE    placement wrong
RESIZE       extent/proportion wrong
ROTATE       orientation/slope wrong
REATTACH     contact/parent wrong
LAYER OFFSET visible layer separation/inset wrong
SPLIT        distinct orientation/volume genuinely needed
MERGE/REMOVE unnecessary or compensating geometry
ADD MASS     required visible volume genuinely missing
```

`LAYER OFFSET` describes the cause, not a mandatory numeric mechanism. Use translate/resize or justified inflate/deflate according to the visible relationship; never apply a universal epsilon.

Use `ADD MASS` only when evidence shows missing volume.

## Correction Accuracy Contract

Reuse fresh exact authored state already returned for the target when sufficient. Call `inspect_elements(mode=detail)` once only when required current state is missing or stale.

Before mutating a diagnosed local mismatch:

```text
mismatch + supporting view(s)
causal class: TRANSLATE | RESIZE | ROTATE | REATTACH | LAYER OFFSET | SPLIT | MERGE/REMOVE | ADD MASS
exact target UUID(s)
current authored state
invariant(s) that must remain unchanged
expected structural effect
```

Keep this compact.

- **TRANSLATE** — size remains unchanged; preserve intended pivot relationship.
- **RESIZE** — name changed axis and fixed center/face/contact.
- **ROTATE** — do not change `from/to/size`; use existing known or explicitly justified pivot.
- **REATTACH** — distinguish visual contact from hierarchy-parent correction.
- **LAYER OFFSET** — preserve the parent form while correcting only intended surface separation/inset.

After `manage_cubes(operation=update|batch_update)`, inspect returned `geometry_effect`:

```text
changed_fields
center_delta
size_delta
origin_delta
rotation_delta
inflate_delta
visibility_changed
```

If the structural effect violates the declared invariant, the correction is invalid before visual review. Undo when safe, revise the hypothesis, and do not call it progress. No geometry/visibility effect does not count as successful correction.

Only after structural effect matches intent should fresh affected views decide visual improvement.

## Global vs Local Failure

Global failure (unrecognizable object, wrong decomposition, several primary relations wrong) reopens Semantic Form or Primary Form Hypothesis. A local failure diagnoses/corrects only the responsible relationship.

After two failed attempts in the same causal direction without new evidence, stop patching and reframe.

## Geometry vs Texture

Use Geometry for required 3D behavior. Use Texture for surface information. Texture must not hide incorrect Geometry, but Geometry must not duplicate detail that Texture can carry without changing the 3D requirement.

## Attachment / Intersection

Visible connection quality is judged visually. **AABB overlap or hierarchy alone is not proof.**

Avoid floating required parts, accidental penetration, exposed coplanar overlap, excessive unreadable intersection, or compensating Cubes used to conceal a wrong mass relationship.

## Symmetry

Use symmetry/mirroring only when the reference supports it. Preserve meaningful asymmetry. Do not infer hidden features from symmetry without evidence.

## Hierarchy / Naming

Hierarchy exists for transform ownership, articulation, attachment, or useful organization. Use semantic names and stable UUIDs for mutation identity. Hierarchy never justifies bad placement/pivot/contact.

## Functional Anchors / Locators

A required non-visible effect, hold, or attachment point that needs transform identity but no visible volume is **Locator intent**, not a hidden/placeholder Cube. Use geometry only when the target actually has visible form.

## Completion Criteria

Geometry is ready for UV/texture only when:

- whole primary form passed visual review;
- representation choices match the visible 3D requirement instead of convenience;
- small/detail Geometry survived the anti-overcube representation challenge;
- major proportions/contacts are coherent;
- required continuous surfaces are covered and intentional openings preserved;
- no unresolved Z-fighting, micro-gap, edge-gap, or accidental shallow penetration remains;
- material shared transforms have an intentional owner;
- required primary hierarchy/pivots are established;
- each material rotation and pivot has a form/motion/attachment reason;
- Cuboid count and detail distribution are purposeful;
- no unresolved critical/major geometry issue remains;
- visual claims use fresh current-revision evidence.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Visual Validation](07-visual-validation.md)
- [Current Flow](../knowledge/flow.md)
