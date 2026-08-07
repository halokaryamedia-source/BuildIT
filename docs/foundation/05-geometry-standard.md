# BlockIT — Operating Model Geometry

**Status:** Draft  
**Version:** 1.0

## 1. Purpose

Define the general geometry rules Codex should follow when creating Minecraft
Bedrock models in Blockbench. Object-specific requirements come from the active
reference.

## 2. Core Principle

Every cuboid must have a clear purpose.

A cuboid should contribute to at least one of these:

- volume;
- silhouette;
- separate position or rotation;
- bone or animation needs;
- visible physical detail;
- a structure that texture cannot represent well.

## 3. Geometry Stages

```text
Contact/support anchor (position + pivot + rotation approved)
↓
Attached connector (contact + silhouette approved)
↓
Parent connector / support chain complete
↓
Main mass attached to the support chain
↓
Elevated mass attached to the main mass
↓
Root-to-tip appendages and secondary detail
```

Base geometry defines the main volume, silhouette, and proportion.

Detailing adds only useful secondary parts.

The first cube is the lowest visually supported anchor, not automatically the
largest volume. Build upward through visible attachment dependencies. For
objects without a support chain, use the first reference-backed stable anchor
instead. Never add a separate foot, connector, or support cube merely to satisfy
this order when the reference does not show that part.

## 4. Grid Rules

### Dimensions

Every cuboid size must be a positive whole number on `X`, `Y`, and `Z`.
Do not create values such as `6.8`; choose the nearest visually correct whole
size, such as `7`. This rule applies to local cube size, not to the requested
overall model dimensions.

Reference dimensions are expressed in Minecraft blocks, while cube coordinates
are expressed in Blockbench geometry units: `1 block = 16 units` on each axis.
The numeric dimensions are the modelling target. The reference image is a
visual guide for proportions and landmarks; its pixels, labels, and panel
scale are not measurement data. Never calibrate cube placement from image
pixels.

For the five-view Bedrock workflow, use one fixed axis convention: width is
`X`, height is `Y`, length is `Z`, and the object faces `-Z`. `LEFT SIDE`
looks along `X`, so it must show length × height. `FRONT` and `FRONT 3/4`
look from `-Z` toward the model. A plan that places length on `X` will look
like width × height in the side view and must be corrected before further
cubes are added.
For example, `2 blocks` high becomes `32` geometry units. Texture Style
`16x16` or `32x32` is a separate pixel-density choice and must not be used as
the geometry scale.

### Position

Cube `from`, `to`, and pivot coordinates must use integers or `0.5`
increments. Values such as `23.049` and `12.4942` must not be stored.

Do not round `from`, `to`, and pivot independently after a cube is fitted.
Choose the whole-number size first, snap the intended pivot or attachment to
the `0.5` grid, then recompute `from` and `to`. Recheck contact and silhouette
after snapping.

Rotated world-space corners may naturally contain other decimals. The grid
rule applies to the local values stored by Blockbench.

### Rotation

Cube and group rotations must use `2.5` degree increments. This includes clean
angles such as:

- `15`
- `22.5`
- `30`
- `45`
- `90`

Do not store arbitrary rotations such as `8` degrees.

If a visible part is sloped, leaning, or angled in the approved reference, its
cube must use an explicit pivot and non-zero rotation unless the same
silhouette is demonstrably achieved by another justified volume arrangement.
Axis-aligned cubes are not a safe default for visibly angled parts.

Choose the pivot by function. Use a visible contact or articulation point when
rotation must preserve an attachment. Use the geometric center only when the
volume actually rotates around its center. A centered pivot is not a universal
construction rule.

## 5. Cuboid Efficiency

Prefer one cuboid for one rectangular volume.

Split a volume only when needed for:

- different rotation;
- different bone;
- different pivot;
- animation;
- silhouette;
- verified technical need.

## 6. Geometry Versus Texture

Use geometry when a detail:

- changes outer shape;
- needs real volume;
- is visible at gameplay distance;
- needs separate position or rotation;
- requires a pivot, bone, or animation.

Use texture when a detail:

- is only color, pattern, shading, or material;
- does not affect silhouette;
- is too small to justify geometry;
- does not need motion.

## 7. Hidden Geometry

Remove hidden geometry that has no purpose.

Keep hidden geometry only when it is needed for animation states or another verified requirement.

## 8. Primary and Secondary Volumes

### Primary Volumes

The largest forms that establish identity.

Examples include the main masses that establish the identity of the current
object. Their names and number come from the reference.

### Secondary Volumes

Forms that refine the design.

Examples include smaller masses that refine the current object. Their names
and number come from the reference.

Primary volumes must be stable before detailed secondary work begins.

## 9. Silhouette

A model should remain recognizable when texture is ignored.

If the silhouette is wrong, fix geometry instead of hiding the issue with texture.

Use the visual brief to plan and construct visible parts by semantic section.
An optional Blockbench image display can help inspect proportions, but it is
not an alignment target. Within each section, place and adjust each cube
immediately, including its pivot, rotation, and contact. Do not use stepped
cuboids as a temporary silhouette or postpone rotations.

If a major volume, angle, contact, or proportion is wrong, correct the cube in
Blockbench using the numeric dimensions and visual brief. A generated cuboid
plan, MCP success, valid coordinates, hierarchy, or a similarity score is not
visual approval.

Use the two-view angle map for every section: `SIDE` plus the declared
`orthogonal_view` (`FRONT` or `BACK`). SIDE establishes the main silhouette;
FRONT answers width, symmetry, and front contact questions; BACK answers rear
continuity and rear-depth questions. Choose the orthogonal view from the
reference evidence and section question, not by object-specific habit.

Per-cube checks confirm the intended feature and its contacts. Full-silhouette
checks are visual inspection only; no numeric silhouette score is used.

The duo-view map is a review contract, not a fitting score. Do not average or
reconcile screenshots into guessed coordinates. TOP or 3/4 is optional only
when one concrete unresolved question remains.

During construction, validate a completed semantic section in the current
angle, then use the next required orthographic angle to resolve width, depth,
or contact. `BACK` and `FRONT 3/4` are verification unless explicit reference
evidence requires one for safe construction. Run the complete five-view
sequence only after the full geometry Cube Draft is assembled. A local
correction reopens only the views it can affect; it does not restart the whole
sequence automatically.

## 10. Symmetry and Mirroring

Use mirroring for truly symmetrical parts.

Use asymmetry only when the reference requires it.

## 11. Overlap and Intersections

Small overlap can help hide gaps or support rotation.

A visible attachment must physically touch or overlap its neighbor across a
usable surface. Corner-only or edge-only touch is not a valid attachment.
Correct disconnected parts directly against the active reference view.

Avoid:

- accidental penetration;
- detached parts;
- excessive intersection;
- limbs or body parts merging incorrectly.

## 12. Naming

Use clear names from the active reference or request. Names are labels, not a
required vocabulary and not element identity; use UUIDs when identity matters.

Avoid names like:

- `cube1`
- `cube2`
- `new_cube`
- `box_final_2`
- `test`

## 13. Temporary Geometry

Temporary geometry must be clearly named and removed before final save.

## 14. Validation Checklist

Before UV mapping, verify:

- recognizable shape;
- correct main proportions;
- complete primary parts;
- dimensions matching the reference when dimensions are provided;
- positive whole-number cube sizes;
- `from`, `to`, and pivots on the integer or `0.5` grid;
- rotations on `2.5` degree increments;
- correct symmetry;
- no duplicate cuboids;
- no unnecessary hidden geometry;
- correct hierarchy;
- no major intersections;
- no missing or inverted parts.

## 15. Completion Criteria

Geometry is complete when:

- base geometry and details are complete;
- silhouette is recognizable;
- proportions follow the reference when visual targets are available;
- grid values are clean;
- cuboid count is efficient;
- moving parts are separated;
- hierarchy is correct;
- no known critical geometry issue remains.
