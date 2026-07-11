---
name: blockbench-geometry
description: "Geometry-stage skill for approved Minecraft Bedrock cuboid assets. Builds only the required form and hierarchy, produces standard previews, validates Geometry, and stops for review."
---

# Blockbench Geometry

## Entry

Use only when the active stage is `GEOMETRY` with tool profile `BEDROCK_CUBOID_GEOMETRY` or `GEOMETRY_LOCAL_REPAIR`.

Read:

1. `PRODUCTION_CONTEXT.md`
2. the approved Reference Visual
3. `GEOMETRY.md`
4. the current session state

## Work

```text
PRIMARY_FORM
→ STRUCTURAL_DETAIL
→ checkpoint
→ standard views
→ compact validation
→ GEOMETRY_REVIEW
```

- Establish the global envelope, major masses, hierarchy, front direction, and ground contacts first.
- Add only silhouette-critical secondary geometry.
- Use bounded multi-part batches for initial construction.
- Use one named issue or tightly related pair during revision.
- Prefer resizing, stretching, rotating, offsetting, and reusing cubes before adding new cubes.
- Preserve manual edits and accepted areas.

## Forbidden

- texture painting or UV editing;
- PBR or material redesign;
- mesh conversion, subdivision, or vertex editing;
- animation keyframes;
- final export;
- geometry not required by the reference package.

## Review Output

Create the Geometry review checkpoint, five standard views, and `geometry_report.json`. Run `validate_reference_contract` for Geometry and stop for `APPROVED` or `REVISION: ...`.
