# Reference Visual Specifications

This compatibility filename is retained to prevent broken links. Numbered technical sheets are deprecated and forbidden.

## Single board

Create exactly one `<asset_id>_reference_visual.png` using the Golden Sample design system.

### Bilateral layout

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

### Asymmetric layout

```text
UPPER: LEFT SIDE | FRONT | RIGHT SIDE
LOWER: BACK | TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Include stable borders, header/title hierarchy, labels, scale marker, compact footer, balanced whitespace, consistent subject scale, and shared ground alignment.

## Cross-view rules

All panels show the same identity, geometry, segment counts, neutral pose, material version, color family, attachments, and proportions. Only the camera changes.

The board fails when identity, scale, camera, crop, top footprint, panel label, or asymmetric Right Side is inconsistent.

Construction, Texture, Animation, and Validation information belongs in Markdown/manifest data, not additional generated images.
