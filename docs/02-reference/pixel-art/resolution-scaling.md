# Pixel Art Resolution and Scaling

## Purpose

Choose canvas size and presentation scaling without losing intentional pixel structure.

## Resolution choice

Use the smallest canvas that can preserve the requested identity and function.

Planning tiers:

```text
MICRO      8×8 / 12×12
ICON       16×16
DETAILED   24×24 / 32×32
HD_PIXEL   48×48 / 64×64
SPECIAL    explicit/custom
```

These are planning aids, not mandatory dimensions.

## Detail budget

A larger canvas should only be used when it enables meaningful:

- silhouette nuance;
- material distinction;
- identity markings;
- animation clarity;
- target-format requirements.

Do not choose a larger grid simply because it can hold more noise.

## Scaling

For display/inspection, prefer whole-number nearest-neighbor enlargement.

Avoid smooth interpolation in any production or QA view used to judge pixel edges.

## Downscaling

Do not author at high resolution and rely on automatic downscaling as the primary pixel-art method. If a smaller target is required, rebuild or clean the clusters at the target grid.

## Multi-size icon families

When multiple target sizes are required, treat each materially different size as its own readability problem. A 32×32 asset reduced to 16×16 may need a simplified silhouette, fewer colors, and different cluster placement.