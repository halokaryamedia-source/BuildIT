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

## Edge topology

Pixel-art quality depends on how clusters meet, not only on whether clusters exist.

Review these explicitly:

```text
JAGGIES
BANDING
HUGGING
TANGENTS
STAIRCASE RHYTHM
CURVE ECONOMY
CORNER CONTROL
CLUSTER INTERLOCK
```

### Jaggies

A diagonal or curve fails when step lengths change without supporting the intended form. Prefer a deliberate progression of run lengths over irregular one-pixel wobble.

### Banding

Avoid parallel cluster edges that unintentionally track each other and expose the grid as repeated bands. Break or reshape one boundary when the visual result reads as striping rather than form.

### Hugging

Avoid highlight/shadow clusters that merely trace another contour at constant distance without describing volume, material, or light. A contour-following band needs a causal reason.

### Tangents

Avoid unrelated edges touching at one pixel or one short run when that contact merges forms or creates a false joint. Preserve intentional negative-space separation.

### Staircase rhythm

Curves and diagonals should use intentional step sequences. At low resolutions, a simplified clean arc is better than literal noisy tracing.

### Corner control

Use corners to clarify plane change, silhouette, or contact. Do not create accidental square bumps because two clusters meet poorly.

### Cluster interlock

Shadow, light, and material clusters should interlock into readable form. Avoid disconnected islands that look pasted on top of the base mass.

## Curve economy

Use the fewest directional changes needed to communicate the characteristic arc. More contour samples are not automatically more accurate at pixel-art scale.

When several curve variants are plausible, prefer the one with:
- clearer silhouette;
- smoother staircase rhythm;
- fewer accidental tangents;
- stronger native-scale readability.

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
2. enlarged nearest-neighbor view for grid/cluster/topology defects.

Native scale owns semantic success. Enlarged view owns craft cleanup. Neither view alone is sufficient.