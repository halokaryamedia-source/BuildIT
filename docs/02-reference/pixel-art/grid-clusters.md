# Pixel Art Grid and Clusters

## Grid integrity

Author against one integer grid. Every visible mark should occupy whole pixels in the production asset.

A larger preview may be scaled by whole-number nearest-neighbor enlargement for inspection, but the underlying production grid remains authoritative.

## Pixel-scale consistency

Do not mix regions that imply different source resolutions.

Examples of scale drift:

- one part uses 1-pixel highlights while another uses broad 4-pixel 'pixels' on the same production grid;
- pasted photographic detail creates sub-grid texture;
- a resized element has uneven repeated pixel blocks.

## Cluster hierarchy

Use:

```text
PRIMARY MASS
SECONDARY MASS
SHADOW MASS
LIGHT MASS
EDGE / OUTLINE
DETAIL CLUSTER
ACCENT
```

Clusters may overlap roles visually, but each authored region should have a reason.

## Edge rhythm

Curves and diagonals should use intentional staircase patterns. Avoid accidental alternating jaggies that break the form.

At low resolutions, a clean simplified curve is better than literal but noisy contour tracing.

## Orphan pixels

A single pixel is valid when it carries a strong function such as:

- eye or indicator light;
- tiny identity marking;
- specular accent;
- critical separation point.

Otherwise merge it into a cluster or remove it.

## Anti-noise rule

Do not use random isolated pixels to simulate quality, age, grain, or surface texture. Texture should form grouped, scale-appropriate motifs that survive native-size viewing.

## Native-scale check

Inspect both:

1. native target scale for readability;
2. enlarged nearest-neighbor view for grid/cluster defects.

Neither view alone is sufficient.