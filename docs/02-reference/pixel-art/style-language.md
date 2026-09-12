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

## Low-detail style

Use fewer, larger clusters and strong shape language. Suitable for tiny icons and vanilla-like Minecraft assets.

## High-detail pixel style

Increase detail by adding meaningful cluster structure, not by sprinkling isolated pixels. Suitable for MIVUBI_HD_PIXEL when the target dimensions justify it.

## Outline systems

Use one dominant logic per style family:

```text
FULL DARK OUTLINE
SELECTIVE OUTLINE
MATERIAL-COLORED EDGE
VALUE-SEPARATED NO-OUTLINE
```

## Contrast hierarchy

Identity-critical regions should win over secondary texture. Keep the strongest contrast near the most important functional or identity landmarks unless a different focal strategy is requested.

## Lighting

Use one readable light direction per asset/set unless the requested style deliberately uses flat/no-light rendering.

## Decorative restraint

Do not confuse decoration with style. A consistent silhouette, cluster rhythm, palette relationship, and material language matters more than repeated scratches, dots, or highlights.