# Camera and Render Lock

## Camera lock

Use these standard views unless the approved Production Context explicitly overrides them:

```text
Front orthographic       azimuth 0°
Left orthographic        azimuth 90°
Back orthographic        azimuth 180°
Front-left three-quarter azimuth 35°, elevation 8°
Roll                     0°
```

All views must use:

- the same model version;
- the same proportions;
- the same neutral pose;
- the same ground plane;
- consistent orthographic scale;
- full-body or full-object visibility;
- no perspective distortion on orthographic views.

Do not generate an artistic top view. Sheet 02 uses a schematic top footprint derived from approved dimensions and construction.

## Render lock

Retain:

- neutral background;
- fixed light direction;
- fixed exposure;
- fixed material version;
- fixed color palette;
- fixed camera framing;
- fixed ground alignment;
- no environment scene;
- no unrelated props;
- no labels inside the generated turnaround board.

## Identity lock

Every revision must preserve:

- species or object category;
- silhouette;
- height, width, and depth relationship;
- head/body or primary-part proportions;
- limb, wheel, wing, tail, or attachment counts;
- approved focal features;
- approved color family;
- approved neutral pose.

A revision that changes these without explicit user approval is `FULL_DESIGN_REOPEN`.
