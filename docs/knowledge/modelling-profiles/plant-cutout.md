# LazyDesigner Modelling Profile — PLANT_CUTOUT

Updated: 2026-09-11

## Purpose

`PLANT_CUTOUT` is a modelling knowledge profile for foliage, grass, flowers, crops, leaves, reeds, thin plant clusters, and other assets whose visual identity is primarily carried by alpha-shaped texture rather than volumetric geometry.

This profile is not a fixed Minecraft vegetation preset. It helps Codex choose the simplest native Blockbench representation that preserves the approved reference.

## Entry Rule

Use `PLANT_CUTOUT` when most identity-bearing silhouette can be represented by thin carriers with texture/alpha, and full volumetric Cube construction would add complexity without materially improving the result.

Do not use this profile merely because the asset is biologically a plant. Thick trunks, large roots, fruit, pots, structural branches, or other substantial volumes may still require normal Geometry.

## Primary Decision

Before authoring, classify each visible part as one of:

```text
VOLUMETRIC_GEOMETRY
PLANE_LIKE
CROSSED_CUTOUT
LAYERED_CUTOUT
TEXTURE_ONLY
OMIT
UNRESOLVED
```

The reference remains authority. `PLANT_CUTOUT` does not force crossed planes when a single plane, solid form, or mixed representation is more faithful.

## Common Structural Vocabulary

Use only when supported by the reference:

```text
root/contact base
stem / stalk
main branch
secondary branch
leaf cluster
individual identity-critical leaf
flower head
petal cluster
fruit / seed / crop body
hanging element
canopy / foliage mass
```

Semantic naming exists to preserve identity and editing clarity, not to generate botanical anatomy that is not visible.

## Carrier Selection

### Single plane

Use when:
- the element is intentionally flat or viewed primarily from one relevant orientation;
- reverse-side visibility is either valid or not material;
- one carrier preserves silhouette and attachment.

### Crossed pair

Use when:
- a thin plant cluster must read from several horizontal viewing directions;
- alpha owns the internal silhouette;
- one plane would collapse visually from important views.

A typical crossed pair is approximately perpendicular, but exact angle follows the reference and gameplay readability rather than a ritual `90°` requirement.

### Layered cutout

Use when:
- depth separation between foliage layers materially improves silhouette, density, or overlap;
- a single crossed pair cannot represent the intended visual mass;
- layers remain few and meaningful.

Do not stack many near-coplanar carriers to simulate volume through clutter.

### Volumetric geometry

Use when the part materially owns:
- 3D silhouette;
- thickness/volume;
- contact/attachment boundary;
- collision-relevant or visually important depth;
- moving rigid structure.

Examples may include a trunk, thick stem, fruit, pot, branch junction, bulb, or large flower center when the reference supports that volume.

## Silhouette Ownership

For cutout-dominant parts:

```text
carrier geometry = placement / orientation / gross envelope
alpha texture    = internal edge / leaf / petal / blade silhouette
```

Do not reconstruct alpha-owned serration, blades, leaf edges, petals, or small gaps with micro-Cubes.

If the visible silhouette must remain physically dimensional from profile views, route that portion to volumetric Geometry instead.

## Attachment / Contact

Every carrier or cluster must have a readable structural relationship:

```text
what it grows from / attaches to
where the attachment begins
whether overlap is intentional
whether the base must appear embedded, touching, or emerging
```

Avoid floating leaves, flowers, or crossed planes whose visual center does not align with the supporting stem/root/branch.

For ground vegetation, verify that the root/contact base visually meets the intended ground plane without obvious floating or excessive burial.

## Orientation

Reference-supported orientation matters more than uniformity.

Preserve when material:
- vertical vs leaning growth;
- directional leaf spread;
- droop/hanging direction;
- asymmetric canopy;
- flower/fruit facing;
- wind-bent or stylized growth direction.

Do not force all planes into identical rotation merely for implementation convenience.

## Repetition / Clusters

Repeated leaves, blades, petals, fruit, or crop elements may be handled as coherent cohorts when their repeated pattern is visually supported.

Use repetition to reduce unnecessary planning overhead, but preserve material variation in:
- scale;
- orientation;
- spacing;
- density;
- asymmetric grouping.

Do not randomize for its own sake. Reference-driven repetition outranks procedural variation.

## Texture / Alpha Guidance

Texture is usually the primary identity carrier for thin vegetation.

Prioritize:
- clean alpha silhouette;
- readable base color regions;
- identity-critical markings/veins only when they survive intended resolution;
- clear separation between leaf/petal/fruit/stem regions;
- minimal baked lighting;
- no noisy photoreal micro-detail that collapses in-game.

Transparent unused atlas regions remain transparent.

Avoid painting fake volume where an important 3D thickness/contact boundary is actually required.

## Material Boundary

Use `MATERIAL_TEXTURE` when material distinction changes downstream texturing decisions, for example:

```text
green leaf vs dry leaf
stem vs blossom
fruit vs foliage
wet/mossy surface
emissive fantasy plant
```

Do not require a separate material sheet for simple vegetation whose palette and surface are already obvious from the approved reference.

## Animation / Motion

If animation is required, distinguish:

```text
RIGID_SWAY
SEGMENTED_BEND
HINGE_LIKE
TEXTURE_ONLY_MOTION
NONPARTICIPATING
```

Simple grass/leaf sway should not automatically cause a dense bone hierarchy.

Use a separate semantic transform only when independent motion materially matters.

For segmented stems, vines, branches, or fantasy appendages, use the minimum meaningful chain needed to preserve the required motion arc.

Do not create one bone/segment per decorative leaf by default.

## Reference Priorities

For `PLANT_CUTOUT`, Reference Preparation should make these readable when material:

```text
overall growth silhouette
carrier-facing direction
stem/root attachment
cluster depth
front-vs-side collapse risk
alpha-owned internal silhouette
repeated element distribution
moving/flexible regions when animation is required
```

A turnaround is not mandatory when one or two views already establish carrier orientation and depth.

Use `STRUCTURAL_DETAIL` only for complex branch/flower/fruit attachment. Use `RIG_DEFORMATION` or `ANIMATION_KEYFRAME` only when motion materially requires them.

## Verification Priority

Check in this order:

1. overall silhouette and recognizable growth form;
2. carrier orientation and cross-view readability;
3. attachment/contact to stem/root/branch/ground;
4. alpha silhouette completeness;
5. depth/layering where material;
6. unnecessary geometry / micro-Cube clutter;
7. animation clearance/motion hierarchy when required;
8. texture/material readability.

A front-view match is not enough when a plane collapses from a required side or gameplay viewing direction.

## Common Failure Modes

```text
micro-Cubes tracing leaf/blade edges
crossed planes used automatically when one plane is sufficient
one plane used when critical side views collapse
floating foliage detached from stem/root
excessive near-coplanar layers
uniform procedural rotation that ignores the reference
volumetric geometry used for texture-owned internal silhouette
texture used to fake required trunk/fruit/branch volume
too many bones for simple sway
hidden plant anatomy invented from species assumptions
```

## Handoff Expectations

Reference Package should expose only decision-critical data, for example:

```text
profile: PLANT_CUTOUT
semantic parts and carrier role
VOLUMETRIC_GEOMETRY / PLANE_LIKE / CROSSED_CUTOUT / LAYERED_CUTOUT hints
growth/contact relationships
critical viewing directions
alpha-owned silhouette notes
material regions when relevant
motion participation when relevant
blocking vs non-blocking unknowns
```

Do not include fixed Cube counts, fixed carrier angles, arbitrary bone counts, or invented hidden structure.

## Completion Condition

The profile has done its job when Codex can distinguish:

```text
what genuinely needs volume
what only needs a thin carrier
what silhouette belongs to alpha texture
how parts attach
which views must remain readable
what may move independently
```

The exact geometry, dimensions, UV placement, texture pixels, and animation remain downstream authoring decisions grounded in the approved reference and LazyDesigner modelling standards.
