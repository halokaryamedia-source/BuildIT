# Camera and Render Lock

## Standard cameras

```text
Front orthographic         azimuth 0°, elevation 0°, roll 0°
Left orthographic          azimuth 90°, elevation 0°, roll 0°
Right orthographic         azimuth -90°, elevation 0°, roll 0° (asymmetric only)
Back orthographic          azimuth 180°, elevation 0°, roll 0°
Top / Footprint            true top-down orthographic, roll 0°
Front-left 3/4             azimuth about 35°, elevation about 8°, roll 0°
```

All panels use the same subject version, neutral pose, ground plane, Minecraft pixel material, proportions, segment counts, and displayed scale. Orthographic panels have no perspective distortion. No panel crops the subject.

## Golden Sample position lock

For a bilateral asset:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Mandatory orientation:

- Left Side is a strict profile facing left. The head/front is at the left; rear/tail is at the right.
- Front is upright and centered, with bilateral features aligned around the centerline.
- Back is upright and centered, with the same displayed height and ground line as Front and Left Side.
- Top / Footprint is true top-down. The head/front points left; rear/tail points right.
- Front-left 3/4 keeps the subject facing left and visibly exposes both the front plane and left-side plane.
- Front-left 3/4 must not be a shifted Side view.

Asymmetric assets add Right Side through the controlled six-panel layout. They do not change the Golden Sample construction language.

## Minecraft render lock

The generated subject must be an actual Minecraft Bedrock / Blockbench cuboid model.

Required:

- visibly planar rectangular masses;
- intentional variation in cuboid dimensions;
- stepped silhouette transitions;
- limited purposeful rotations for approved angled details;
- crisp pixel-art texture;
- simple neutral lighting that reveals cuboid planes;
- no visual treatment that hides Geometry structure.

Forbidden:

- realistic organic anatomy with pixelated texture;
- smooth rounded mesh-like surfaces;
- photographic fur, skin, metal, fabric, or wood rendering;
- PBR, subsurface scattering, glossy realism, depth-of-field, motion blur, or cinematic grading;
- generic voxel conversion that produces noisy micro-blocks;
- uniform same-sized cube stacking;
- arbitrary rotation noise across major masses.

## Golden Sample presentation lock

Preserve the Golden Sample's technical-board ratio, border hierarchy, header/title/subtitle, panel spacing, scale-marker position, compact footer, balanced whitespace, and subject-to-panel scale. Replace its subject content completely.

## Forbidden presentation

No environment scene, action pose, cinematic light, dramatic perspective, extra prop, hidden angle generation, unreadable generated text, alternate-style panel, or additional technical image.
