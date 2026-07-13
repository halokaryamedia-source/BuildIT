# Reference Visual Generation Prompt

Create one polished Minecraft Bedrock / Blockbench `REFERENCE VISUAL` from the approved source and Production Context.

## Non-negotiable interpretation

Do **not** render the source subject directly in its realistic style. Reconstruct the source identity as an **actual Minecraft / Blockbench cuboid model**.

The source image is authoritative for:

- subject identity;
- recognizable anatomy or object features;
- major proportions;
- markings, palette, attachments, and asymmetry.

The Black Rhinoceros Golden Sample is authoritative for:

- Minecraft cuboid construction language;
- primary and secondary mass planning;
- varied cuboid sizes and proportions;
- stepped silhouette transitions;
- limited purposeful rotated cuboids;
- panel layout, camera, facing direction, spacing, borders, scale marker, footer, and technical presentation.

Copy the Golden Sample's modelling language and quality bar. Replace the rhinoceros subject completely.

## Locked asset

- Asset ID: `{{asset_id}}`
- Display Name: `{{display_name}}`
- Subject Type: `{{subject_type}}`
- Symmetry: `{{symmetry_policy}}`
- Height: `{{height_u}}u`
- Width: `{{width_u}}u`
- Depth: `{{depth_u}}u`
- Neutral Pose: `{{neutral_pose}}`
- Front: `{{front_direction}}`
- Recognizable Features: `{{recognizable_features}}`
- Attachments: `{{required_attachments}}`
- Segment Counts: `{{segment_counts}}`
- Primary Masses: `{{primary_masses}}`
- Angled Features Requiring Stepped or Rotated Cuboids: `{{angled_features}}`
- Material/Color Family: `{{color_family}}`

## Mandatory Minecraft construction

The same subject in every panel must look like a real Blockbench-ready Minecraft model built from intentional rectangular cuboids.

Use:

- large readable primary masses first;
- smaller secondary cuboids only when structurally justified;
- clearly varied cuboid width, height, and depth;
- planned segmentation and separable parts;
- stepped cuboids to create taper and controlled silhouette transitions;
- limited purposeful one-axis rotations where an approved angled feature needs them;
- mostly stable major masses;
- crisp Minecraft pixel-art texture that follows cuboid faces.

`cuboid-first` does not mean stacking repeated cubes. Avoid uniform same-sized box piles, lazy rectangular approximation, micro-cube clutter, or arbitrary rotation noise.

The final result must be visibly reproducible with the existing Blockbench Geometry rules. It must not rely on smooth meshes, curved skin, hidden deformation, or material effects to create the silhouette.

## Required panels and exact positions

### Bilateral

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- LEFT SIDE: strict orthographic profile facing left; head/front at left, rear/tail at right.
- FRONT: strict orthographic, upright and centered.
- BACK: strict orthographic, upright and centered.
- TOP / FOOTPRINT: true top-down orthographic; head/front points left, rear/tail points right.
- FRONT-LEFT 3/4: controlled three-quarter view; subject faces left; both front and left planes are visible.

The Top / Footprint panel is a measurable true top-down footprint, not an artistic camera view.

### Asymmetric

Add RIGHT SIDE and use the controlled six-panel layout without changing construction style or subject scale.

## Global consistency

- Same exact model, cuboid dimensions, segmentation, rotations, proportions, pose, pixel texture, lighting, color, and attachments in every panel.
- Rotate the camera only; do not independently redesign each panel.
- Preserve approved segment counts and left/right relationships.
- Front, Side, Back, and optional Right Side use equal displayed height and shared ground alignment.
- Front-left 3/4 must be clearly distinct from Left Side.
- Complete subject without cropping.
- Use the Golden Sample's board ratio, borders, label hierarchy, padding, scale marker, footer, and balanced whitespace.

## Mandatory negative instructions

Do not produce:

- a realistic animal, character, vehicle, prop, or object with pixelated skin;
- a semi-realistic organic render;
- smooth rounded anatomy or mesh-like surfaces;
- photographic fur, skin, fabric, wood, stone, or metal;
- a voxel filter applied to a realistic source;
- PBR, subsurface scattering, cinematic shading, dramatic perspective, depth-of-field, or motion blur;
- uniform same-sized cube stacking;
- random rotations or rotated major masses used only to fake form;
- environment scenery, extra characters, action pose, logo, watermark, UV layout, pivot overlay, hierarchy diagram, or additional sheet;
- any redesign outside the approved Production Context.

Pixel texture alone is not Minecraft Geometry. The silhouette and mass construction themselves must be cuboid and Blockbench-buildable.

## Output requirement

Return exactly one approval-candidate technical board only when all Minecraft construction, Golden Sample layout, camera, identity, scale, and cross-view checks pass. A failed draft must be corrected internally with the single allowed targeted edit or rejected with failure codes; it must not be presented as approval-ready.
