# Pixel Art Series Guidance

Use for icon/sprite/object families that must feel authored by one visual system.

## Shared invariants

Prefer stable:

```text
canvas family
visible pixel scale
occupancy range
projection family
outline treatment
light direction
contrast range
palette relationship
cluster density
alpha convention
```

## Subject-specific freedom

Allow variation in:

- silhouette;
- local palette extension;
- material highlights;
- aspect ratio;
- functional exaggeration;
- secondary details.

These variations should not alter the shared Style Lock unless the user intentionally changes the family direction.

## Batch authoring

When multiple icons are requested together:

1. establish one representative asset or shared Style Lock;
2. apply the same visual grammar across the batch;
3. compare the batch at native scale together;
4. correct outliers rather than independently restyling each asset.

## Batch QA

Check individual readability first, then set consistency. A perfectly consistent but unreadable icon still fails.