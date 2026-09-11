# LazyDesigner Modelling Profile — PROP_FURNITURE

Updated: 2026-09-11

This profile is a lightweight authoring knowledge layer for props, furniture, kiosks, racks, tables, containers and other mostly rigid objects. It complements `lazydesigner-modelling`; it does not replace the approved reference, dimensions, core Geometry rules, or Runtime ToolSpecs.

## Purpose

Help Codex reason about prop/furniture structure with less guessing while avoiding preset geometry.

Use when the object is primarily defined by rigid construction, support/contact, storage/opening relationships, panels, shelves, drawers, handles, hinges, frames, surfaces or assembled furniture-like parts.

Do not use merely because an asset is static if another profile is more semantically correct, such as `VEHICLE`, `MECHANICAL`, `HUMANOID`, `CREATURE`, or `PLANT_FOLIAGE`.

A prop may contain a hinge, wheel, cable, motor, or other mechanical detail and still remain `PROP_FURNITURE` when those mechanisms are secondary to the object's main prop/furniture identity. Use `MECHANICAL` only when mechanism topology, axes, linkage, or clearance become the dominant modelling problem.

## Intake Focus

Resolve only material construction evidence:

```text
primary body/frame
support/ground-contact system
openings / cavities / negative spaces
shelves / drawers / doors / panels
handles / hinges / rails / brackets
repeated or symmetric cohorts
load-bearing vs decorative members
movable vs fixed sections
material regions
identity-critical silhouette landmarks
```

Unknown detail remains explicit; do not invent hidden backing, internal shelves, fasteners or joinery because a real object would usually have them.

## Semantic Assembly Vocabulary

Use semantic names where they help continuity and correction. Typical roles include:

```text
frame
body
base
leg
support
brace
shelf
drawer
door
panel
handle
hinge
rail
bracket
countertop
seat
backrest
armrest
container
lid
canopy
signage
fixture
```

These are vocabulary only. Do not require parts that are not supported by the approved reference.

## Structural Reasoning

Prioritize the object in this order:

```text
whole envelope
→ primary load-bearing / identity masses
→ contact/support relationships
→ intentional openings/cavities
→ movable assemblies
→ secondary structural detail
→ surface-only detail
```

For each primary part determine:

```text
must-exist reason
parent/contact target
fixed | movable
symmetry/cohort relation
volume-bearing | plane-like | layered | texture-only
visible negative-space responsibility
material identity when relevant
```

Do not create filler Cubes merely to make an assembly look mechanically plausible.

## Support / Contact Rules

Ground-contact and load-bearing relationships must read intentionally.

Check:

```text
number and placement of supports
contact with floor / parent mass
overhangs
cantilevered sections
brace relationships
surface continuity where the reference requires it
intentional gaps where the design requires them
```

A support that visually floats, terminates short of its contact target, or intersects without a plausible intended relationship is a structural defect unless the reference explicitly shows that condition.

## Openings / Cavities

Furniture and props often derive identity from empty space. Treat openings as first-class geometry constraints.

Examples:

```text
shelf bays
drawer gaps
cabinet cavities
chair leg spacing
window/display openings
rack spacing
counter under-space
handle loops
```

Do not close an intentional cavity with convenience geometry. Do not fake a required opening using texture when it materially changes silhouette or depth.

## Movable Parts

When the reference or user intent indicates interaction, keep movable assemblies separable and pivot-ready.

Typical cases:

```text
door → hinge-side rotation intent
lid → hinge / lift intent
drawer → translation intent
folding panel → hinge intent
rotating handle / wheel → rotation intent
```

The profile may identify likely motion ownership but must not invent animation requirements. If movement is not supported or requested, keep the part structurally separable only when that separation is already meaningful to the model.

## Representation Guidance

Prefer the simplest representation preserving the reference:

```text
SOLID_CUBOID
SEGMENTED_FORM
PLANE_LIKE
PLANAR_CUTOUT_CARRIER
LAYERED_SURFACE
TEXTURE
OMIT
```

Typical guidance:

- structural frame, legs, shelves, drawers, thick panels → Geometry when volume/contact matters;
- thin signage, fabric-like flat inserts or alpha-owned decorative surfaces → plane/cutout when appropriate;
- panel lines, grain, printed labels, small seams → Texture when they do not change silhouette/depth;
- repeated tiny hardware → Geometry only when identity, silhouette, interaction or readable depth justifies it.

Do not model wood grain, paint variation or decorative seams as micro-geometry.

## Repetition / Symmetry

For repeated parts such as legs, shelf supports, slats, handles or identical drawers:

```text
resolve one cohort relationship
→ derive repeated members consistently
→ preserve intentional asymmetry when present
```

Do not force symmetry on asymmetric furniture or kiosks.

## Reference Views

Use only decision-changing views.

Common priority:

```text
FRONT → width/height, opening layout, major identity
LEFT or RIGHT-supported source → depth, shelf/door projection, support placement
TOP → footprint, countertop/shelf depth, asymmetry
BACK → only when rear structure/backing materially matters
FRONT-LEFT 3/4 → attachment/layering clarification
```

A turnaround is optional for simple objects already resolved by the supplied source.

## Material / Texture Handoff

Material boundaries often map to semantic assemblies. Preserve useful IDs such as:

```text
frame_wood
metal_bracket
glass_panel
fabric_seat
rubber_pad
emissive_sign
```

Material difference alone does not require geometry separation unless it also affects form, editing, motion, or UV/material ownership.

## Verification Priorities

Before Geometry PASS, check in this order:

```text
1. overall silhouette and proportions
2. support/contact correctness
3. opening/cavity correctness
4. major part count and placement
5. depth/layering
6. movable-part separation/pivot readiness when relevant
7. repeated-part consistency
8. secondary detail
```

For corrections, fix the first wrong structural cause rather than adding compensating detail.

## Common Failure Modes

Avoid:

```text
floating legs/supports
closed openings that should remain empty
shelves or drawers with wrong depth
handles/hinges detached from their owner
thick geometry for surface-only detail
micro-cube clutter
forced symmetry
unsupported hidden backing/internal structure
moving sections fused into the parent when animation/interaction requires separation
```

## Profile Exit

This profile is sufficient when Codex can identify the rigid semantic assemblies, supports, openings, movable relationships, representation choices and material boundaries needed for the current modelling decision without inventing unsupported construction.
