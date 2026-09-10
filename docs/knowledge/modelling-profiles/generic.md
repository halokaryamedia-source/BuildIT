# LazyDesigner Modelling Profile — GENERIC

Updated: 2026-09-11

## Purpose

`GENERIC` is the fail-safe modelling profile for assets that do not fit another LazyDesigner asset profile well enough to improve downstream decisions.

It is not the default profile and it is not a catch-all shortcut. Use it only after considering:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
```

If one of those profiles materially improves reasoning, use that profile instead.

## Entry Rule

Use `GENERIC` only when:

- the asset is unusual, hybrid, abstract, or insufficiently classifiable;
- forcing another profile would introduce assumptions not supported by the approved reference;
- the current task only needs universal modelling rules;
- the asset class itself does not materially change hierarchy, articulation, reference coverage, or representation decisions.

Do not use `GENERIC` merely because classification requires thought.

## Universal Modelling Contract

Start from evidence rather than asset stereotypes:

```text
approved reference / user intent
→ identity-bearing silhouette
→ primary masses / required part count
→ attachment / contact relationships
→ depth / negative spaces
→ motion participation when relevant
→ representation ownership
→ hierarchy / transform ownership
→ geometry
```

The reference remains authority. `GENERIC` adds no domain-specific anatomy, mechanism, vehicle layout, furniture construction, or foliage behavior.

## Semantic Part Discovery

Name only decision-critical parts.

For each relevant part, determine when supported:

```text
identity / function
parent or contact target
symmetry / repetition
motion participation
representation owner
reference evidence state
```

Do not create a per-Cube plan.

If a part cannot be classified without inventing structure, keep it `UNRESOLVED` and use the normal blocking/non-blocking unknown contract.

## Representation Decision

Choose the simplest representation that preserves the approved requirement:

```text
SOLID_CUBOID
SEGMENTED_FORM
PLANE_LIKE
PLANAR_CUTOUT_CARRIER
LAYERED_SURFACE
TEXTURE
ANIMATION_ONLY
EFFECT
OMIT
UNRESOLVED
```

Use Geometry when the part materially owns 3D silhouette, volume, depth, attachment/contact, opening/negative-space boundary, layering, transform, or motion.

Use Texture when the information is surface-only.

Do not use a technical representation merely because it is common for a superficially similar asset.

## Hierarchy / Transform Ownership

Create hierarchy from actual semantic and motion relationships, not from arbitrary organization.

Ask only:

```text
what must transform together?
what may transform independently?
what owns the attachment?
what owns the pivot/axis when movement exists?
```

Rigid parts that always move together should not be split into unnecessary transform groups.

If animation is required, preserve future motion ownership and clearance without constructing speculative rig complexity.

## Contact / Negative Space

For every material relationship, preserve whether it is:

```text
CONNECTED
INTENTIONAL_OPENING
LAYERED
INTERSECTING_BY_DESIGN
DETACHED_BY_DESIGN
UNRESOLVED
```

Do not fill openings or create contact merely to make the model look structurally complete.

Do not leave accidental floating parts, micro-gaps, or unsupported intersections.

## Symmetry / Repetition

Use only evidence-supported symmetry or repetition:

```text
NONE
PAIRED
MIRRORED
REPEATED
ASYMMETRIC
UNKNOWN
```

Repeated cohorts may share a coherent construction approach, but reference-supported differences must remain.

Do not mirror uncertainty into false certainty.

## Reference Priorities

For `GENERIC`, Reference Preparation should expose only what materially affects construction:

```text
identity silhouette
primary part inventory
depth-bearing views
attachment/contact
negative spaces
asymmetry/repetition
motion-bearing regions
material boundaries when relevant
```

Do not request profile-specific sheets merely because no specialized profile exists.

Use `TURNAROUND`, `STRUCTURAL_DETAIL`, `MATERIAL_TEXTURE`, `RIG_DEFORMATION`, or `ANIMATION_KEYFRAME` only when they actually resolve a downstream decision.

## Verification Priority

Verify in this order:

1. identity and overall silhouette;
2. required part completeness;
3. primary proportions and depth;
4. attachment/contact and negative spaces;
5. representation correctness;
6. hierarchy/transform ownership when relevant;
7. motion readiness when required;
8. secondary detail and material readability.

The same largest-difference-first and bounded-correction rules from `lazydesigner-modelling` apply.

## Common Failure Modes

```text
using GENERIC when a specific profile clearly applies
inventing hidden structure because no domain profile exists
copying assumptions from a similar object class
premature Cube-by-Cube planning
micro-geometry for texture-owned detail
unnecessary hierarchy splitting
unsupported symmetry/mirroring
filling intentional openings
ignoring depth because front silhouette matches
creating speculative rig/mechanism complexity
```

## Escalation Rule

If modelling reveals that the asset actually has a clear dominant class, migrate the task to the more specific profile for subsequent reasoning.

Examples:

```text
GENERIC abstract machine
→ mechanism becomes materially important
→ MECHANICAL

GENERIC organic figure
→ body plan clearly non-humanoid
→ CREATURE

GENERIC decorative plant-like object
→ foliage representation becomes material
→ PLANT_FOLIAGE
```

This is a profile correction, not a new workflow or new asset state.

## Handoff Expectations

A `GENERIC` Reference Package should stay minimal:

```text
profile: GENERIC
semantic parts only when decision-critical
representation hints only when evidence-backed
attachment/contact relationships
critical views
motion participation when relevant
blocking vs non-blocking unknowns
```

Do not add domain-specific assumptions simply to make the package look complete.

## Completion Condition

`GENERIC` has done its job when Codex can proceed using universal modelling rules without needing unsupported asset-class assumptions.

If a specific profile becomes materially useful, stop treating the asset as `GENERIC` and switch to that profile for later decisions.
