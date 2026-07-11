# Turnaround Generation Prompt

Create one clean Minecraft Bedrock / Blockbench-ready turnaround board from the approved source image and Production Context.

## Locked asset

- Asset ID: `{{asset_id}}`
- Display Name: `{{display_name}}`
- Subject Type: `{{subject_type}}`
- Approved Height: `{{height_u}}u`
- Approved Width: `{{width_u}}u`
- Approved Depth: `{{depth_u}}u`
- Neutral Pose: `{{neutral_pose}}`
- Front Direction: `{{front_direction}}`
- Recognizable Features: `{{recognizable_features}}`
- Required Attachments: `{{required_attachments}}`
- Main Color Family: `{{color_family}}`

## Required board

Show exactly the same approved design in:

1. front orthographic;
2. left-side orthographic;
3. back orthographic;
4. front-left three-quarter orthographic preview.

## Construction style

- practical Blockbench cuboids;
- large readable masses first;
- limited rotated cuboids only where silhouette requires them;
- no dense voxel sculpture;
- no micro-cube decoration;
- surface markings and small details represented as simple Minecraft-style texture;
- future animation groups visually separable;
- consistent ground contact.

## Camera and render

- neutral background;
- identical lighting, material, pose, and scale across views;
- orthographic views without perspective distortion;
- three-quarter view at approximately 35° azimuth and 8° elevation;
- roll 0°;
- complete subject visible without cropping.

## Do not include

- technical labels;
- dimensions;
- hierarchy diagrams;
- pivot markers;
- UV layouts;
- palette cards;
- environment scenes;
- extra characters or props;
- logos or watermark;
- an artistic top view;
- a redesign of the approved subject.
