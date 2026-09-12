# Pixel Art Iconography

## Purpose

Define the smallest reliable workflow for icons used in GUI, markers, maps, labels, or compact game-facing asset sets.

## Icon priorities

At small scale, prioritize in this order:

```text
recognizable silhouette
→ identity landmark
→ orientation / function cue
→ value separation
→ material cue
→ secondary detail
```

Do not reverse this order by polishing surface detail on an unreadable silhouette.

## Occupancy and padding

Keep the subject large enough to read but leave deliberate edge breathing room. Use a consistent occupancy ratio across a set unless one subject requires an exception for recognizability.

Avoid accidental touching of canvas edges unless the visual system intentionally uses full-bleed icons.

## Axis and orientation

Choose the orientation that exposes the defining feature.

Examples:

```text
shovel / fishing rod / sickle
→ diagonal often exposes function better than straight vertical

parking P / UI symbol
→ frontal alignment and geometric clarity

frame / monitor / CCTV
→ perspective only when it improves object recognition
```

These are heuristics, not fixed presets.

## Functional exaggeration

Small icons may exaggerate identity-critical features:

- hook curvature;
- blade crescent;
- camera lens;
- shovel head;
- backpack flap;
- frame border.

Exaggeration must improve semantic recognition, not distort the subject into a different object.

## Outline treatment

Choose one set-level approach:

```text
full dark outline
selective outline
material-colored edge
no outline / value-separated silhouette
```

Do not mix outline systems randomly within one icon family.

## Palette economy

Small icons should usually use fewer colors than larger object sprites. Preserve a clear shadow/base/light hierarchy before adding accents.

One bright accent can carry identity more effectively than several low-impact shades.

## Material cues at icon scale

At low resolution, material is compressed into a few strong cues:

```text
metal   → compact bright highlight + sharp value break
wood    → warm value grouping + limited grain cue
cloth   → broad folds / soft block transitions
glass   → edge reflection / transparency cue
plastic → clean broad highlight, less granular texture
```

Do not attempt full material simulation at 16×16.

## Set consistency

For a related icon family, preserve:

```text
canvas size
subject occupancy
visible pixel scale
projection family
light direction
outline treatment
contrast range
palette relationship
```

Subject-specific changes are allowed, style drift is not.

## Icon QA questions

Before finalizing:

1. Is the object recognizable at 100% scale?
2. Does the silhouette remain distinct from nearby icon categories?
3. Is the defining functional feature visible?
4. Does the icon match the current Style Lock?
5. Are any single pixels or tiny clusters unnecessary?
6. Does the icon still read in grayscale/value separation?
7. Is transparency clean at the edge?