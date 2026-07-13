# Reference Visual Specifications

This compatibility filename is retained to prevent broken links. Numbered technical sheets are deprecated and forbidden.

## Single board

Create exactly one `<asset_id>_reference_visual.png` using the Golden Sample's Minecraft cuboid construction language and technical-board design system.

The source controls subject identity. The output style is fixed to actual Minecraft Bedrock / Blockbench cuboid pixel art.

## Bilateral layout and position

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- Left Side is strict profile facing left.
- Front and Back are upright, centered, and share displayed height/ground alignment.
- Top / Footprint is true top-down with the subject front/head pointing left.
- Front-left 3/4 keeps the subject facing left and exposes front plus left planes.

## Asymmetric layout

```text
UPPER: LEFT SIDE | FRONT | RIGHT SIDE
LOWER: BACK | TOP / FOOTPRINT | FRONT-LEFT 3/4
```

The additional Right Side does not change subject scale, construction style, or camera discipline.

## Minecraft construction requirements

The subject must visibly use:

- planned rectangular primary and secondary masses;
- varied cuboid width, height, and depth;
- stepped silhouette transitions;
- limited purposeful one-axis rotations where approved angled features require them;
- readable hierarchy and separable parts;
- crisp Minecraft pixel-art texture.

The board fails when the subject is a realistic or smooth organic render with pixelated texture, a generic voxel conversion, a uniform cube stack, micro-cube clutter, arbitrary rotation noise, or a form that cannot be reproduced through the approved Blockbench Geometry workflow.

## Presentation

Include stable borders, header/title hierarchy, labels, scale marker, compact footer, balanced whitespace, consistent subject scale, shared ground alignment, and simple lighting that exposes cuboid planes.

## Cross-view rules

All panels show the same identity, cuboid geometry, segment counts, rotations, neutral pose, material version, color family, attachments, and proportions. Only the camera changes.

The board fails when Minecraft construction, identity, scale, camera, position, crop, top footprint, panel label, cross-view model, or asymmetric Right Side is inconsistent.

Construction, Texture, Animation, and Validation information belongs in Markdown/manifest data, not additional generated images.
