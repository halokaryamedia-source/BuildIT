# Pixel Art Iconography

## Purpose

Define the smallest reliable workflow for icons used in GUI, markers, maps, labels, symbols, or compact game-facing asset sets.

## Icon priorities

At small scale, prioritize:

```text
recognizable silhouette / semantic clarity
→ identity landmark
→ orientation / function cue
→ value separation
→ material cue
→ secondary detail
→ decoration
```

Do not polish surface detail on an unreadable silhouette.

## Object icons

Choose the orientation that exposes the defining feature. Diagonal placement may help tools such as shovels, fishing rods, or sickles; frontal alignment often suits parking markers and other symbols. Perspective is justified only when it materially improves recognition.

Small icons may exaggerate identity-critical features such as hook curvature, blade crescent, camera lens, shovel head, backpack flap, or frame border. Exaggeration must improve semantic recognition without changing object identity.

## UI symbols / glyphs

For abstract or typographic symbols such as parking markers, arrows, status icons, and simple GUI glyphs:
- prefer clean integer-grid geometry;
- allow optical correction when mathematical centering appears visually unbalanced at low resolution;
- preserve letter/glyph legibility before stylization;
- avoid pseudo-font detail that collapses at native size;
- use stronger figure/ground separation than material-rich object sprites when needed;
- keep stroke/cluster thickness, corner treatment, padding, and visual weight consistent across a related set.

## Occupancy and padding

Keep the subject large enough to read while preserving deliberate edge breathing room. Maintain a consistent occupancy range across a set unless recognizability requires a justified exception. Avoid accidental edge contact unless the visual system intentionally uses full bleed.

## Outline treatment

Choose one set-level approach:

```text
full dark outline
selective outline
material-colored edge
no outline / value-separated silhouette
```

Do not mix outline systems randomly within one family.

## Palette economy

Small icons should usually use fewer colors than larger object sprites. Preserve shadow/base/light hierarchy before accents. One strong identity accent is often more effective than several low-impact shades.

## Material cues at icon scale

Compress material into a few strong cues:

```text
metal   → compact bright highlight + sharp value break
wood    → warm grouping + limited grain cue
cloth   → broad folds / soft block transitions
glass   → edge reflection / transparency cue
plastic → clean broad highlight, less granular texture
```

Do not attempt full material simulation at very small resolutions.

## Set consistency

Preserve canvas family, occupancy, visible pixel scale, projection family, light direction, outline treatment, contrast range, and palette relationship. Subject-specific variation is allowed; style drift is not.

## Icon QA questions

Before finalizing:
1. Is the object/symbol recognizable at 100% scale?
2. Is it distinct from nearby icon categories?
3. Is the defining functional or semantic feature visible?
4. Does it match the current Style Lock?
5. Are tiny clusters necessary?
6. Does it remain readable by value separation?
7. Is edge transparency clean?