# Pixel Art Style Language

## Purpose

Describe the visual grammar used by Pixel Art Authoring without tying it to one subject or palette.

## Core grammar

A coherent style is defined by relationships between:

```text
pixel scale
silhouette simplification
outline behavior
cluster size
contrast
palette economy
light direction
material highlight behavior
perspective
subject occupancy
```

## Artist judgement hierarchy

When visual concerns compete, resolve them in this order unless the user explicitly prioritizes something else:

```text
READABILITY
> FORM
> IDENTITY
> MATERIAL
> STYLE CONSISTENCY
> DETAIL
> DECORATION
```

This hierarchy exists to prevent AI-style over-decoration from defeating the asset's function.

When uncertain whether a detail is necessary:

```text
REMOVE
→ CHECK AT NATIVE SCALE
→ RESTORE ONLY IF IDENTITY / FUNCTION / MATERIAL READ MATERIALLY DECREASES
```

Absence of detail is valid design. Do not fill empty regions merely because canvas space is available.

## Low-detail style

Use fewer, larger clusters and strong shape language. Suitable for tiny icons and vanilla-like Minecraft assets.

## High-detail pixel style

Increase detail by adding meaningful cluster structure, not by sprinkling isolated pixels. Suitable for MIVUBI_HD_PIXEL when the target dimensions justify it.

Higher detail must still preserve the low-frequency read. If the asset only works when zoomed in, the detail budget is too high for its target use.

## Outline systems

Use one dominant logic per style family:

```text
FULL DARK OUTLINE
SELECTIVE OUTLINE
MATERIAL-COLORED EDGE
VALUE-SEPARATED NO-OUTLINE
```

For selective outlines, reason by edge role:

```text
OUTER CONTOUR
INTERNAL CONTOUR
CONTACT EDGE
LIGHT-FACING EDGE
SHADOW EDGE
BACKGROUND-DEPENDENT EDGE
```

A dark edge is justified when it improves separation, contact, silhouette, or material read. A lighter/material-colored edge is justified when light or local color already carries separation. Do not break outlines randomly for variety.

## Contrast hierarchy

Identity-critical regions should win over secondary texture. Keep the strongest contrast near the most important functional or identity landmarks unless a different focal strategy is requested.

Do not give every region equal contrast. Uniform emphasis creates visual noise and weakens focal hierarchy.

## Lighting

Use one readable light direction per asset/set unless the requested style deliberately uses flat/no-light rendering.

Lighting should modify form and material, not become decorative border shading.

## Cluster restraint

Every secondary cluster should earn its place by contributing to at least one of:

```text
FORM
MATERIAL
IDENTITY
FOCAL HIERARCHY
MOTION / STATE
```

If it contributes to none, remove it.

## Decorative restraint

Do not confuse decoration with style. A consistent silhouette, cluster rhythm, palette relationship, and material language matters more than repeated scratches, dots, or highlights.