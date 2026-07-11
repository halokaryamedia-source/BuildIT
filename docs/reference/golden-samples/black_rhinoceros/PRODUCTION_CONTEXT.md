# Production Context

Status: `APPROVED`
Sample Type: `GOLDEN_SAMPLE`

## Asset Identity

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Subject Type: Black rhinoceros creature
- Primary Source: `source/approved_reference_source.png`
- Primary Visual Authority: `01_black_rhinoceros_form_scale_reference.png`
- Standardized Visual Alias: `black_rhinoceros_reference_visual.png`
- Recognizable Features:
  - large shoulder mass and deep torso;
  - broad, low head and rectangular muzzle;
  - two horns, with a dominant front horn;
  - compact upright ears;
  - four thick grounded legs with dark hoof tips;
  - short thin tail;
  - warm gray-brown hide with low-contrast pixel mottling.
- Neutral Pose: Four-foot grounded standing pose
- Front Direction: `-Z`, toward the head
- Approval Reference: User request to complete the Black Rhinoceros Golden Sample package from approved Sheet 01

## Main Format

- Target Format: Bedrock Entity
- Geometry Type: Cuboid-first
- UV Mode: Box UV baseline with selective per-face UV only where required
- Texture Width: `128`
- Texture Height: `128`
- Pixel Style: `16x`
- Classic Bedrock: required
- PBR: forbidden
- Vibrant Visuals: forbidden
- Mesh geometry: forbidden for this Golden Sample

## Scale

- Baseline: `16u = 1 Minecraft block`
- Player Reference: `28.8u = 1.8 blocks`
- Asset Width: `27.2u` (`1.7 blocks`)
- Asset Length/Depth: `52.8u` (`3.3 blocks`)
- Asset Height: `40u` (`2.5 blocks`)
- Ground Plane: `Y = 0`
- Coordinate Envelope:
  - X: approximately `-13.6u` to `+13.6u`
  - Y: `0u` to `40u`
  - Z: approximately `-30u` to `+22.8u`
- Scale Tolerance: `±1u` on major bounds
- Collision Bounds: not finalized by this Golden Sample
- Rider Seat: not applicable

## Geometry

- Expected Cuboid Count: `22–32`
- Required Root Group: `black_rhinoceros_root`
- Required Hierarchy:
  - body
  - head
  - muzzle
  - horn_front
  - horn_rear
  - ear_left
  - ear_right
  - leg_front_left and foot
  - leg_front_right and foot
  - leg_rear_left and foot
  - leg_rear_right and foot
  - tail_base and tail_tip
- Primary Masses:
  - shoulder block;
  - central torso;
  - rear/belly mass;
  - head wedge assembled from cuboids;
  - separate muzzle;
  - four thick legs and four hoof blocks.
- Silhouette-Critical Geometry:
  - two horns;
  - sloped head;
  - high shoulder;
  - rear body taper;
  - ears;
  - tail.
- Texture-First Details:
  - eyes;
  - nostrils;
  - mouth line;
  - skin folds;
  - scars;
  - subtle muscle shading;
  - hoof separation.
- Forbidden Geometry:
  - micro-cube wrinkles;
  - decorative skin strips;
  - separate nostril or eyelid cubes;
  - dense voxel sculpture;
  - unapproved mesh parts.

## Texture

- Atlas: `128 × 128`
- Base Palette: warm gray-brown sampled from Sheet 01
- Material Zones:
  - body hide;
  - darker face and muzzle planes;
  - dark horns and hooves;
  - near-black eyes, nostrils, mouth, and ear interiors.
- UV Strategy:
  - Box UV for major cuboids;
  - selective per-face UV for face, horns, ears, and hoof accents;
  - mirrored leg and ear UVs permitted when markings remain symmetric.
- Alpha: not required
- Emissive: not allowed
- Surface Style:
  - broad low-contrast pixel clusters;
  - hard pixel edges;
  - no smooth gradients;
  - no random high-frequency noise.

## Animation

- Animation Required: `false`
- Status: `ANIMATION_SKIPPED`
- Reason: This Golden Sample validates the ChatGPT reference package, Codex handoff, Geometry, Texture, evidence, checkpoints, and final validation. It does not validate clip production.
- Pivot Readiness Required:
  - head;
  - four legs;
  - ears;
  - horns as head children;
  - tail base and tail tip.
- Required Clips: none
- Forbidden Clips: walk, idle, charge, attack, death, or other invented clips

## Validation

- Required Views:
  - front;
  - left;
  - back;
  - top;
  - front-left three-quarter.
- Required Geometry Checks:
  - scale envelope;
  - hierarchy;
  - ground contact;
  - required parts;
  - cuboid-only geometry;
  - no major z-fighting.
- Required Texture Checks:
  - `128 × 128` atlas;
  - pixel-sharp output;
  - approved material zones;
  - no PBR or Vibrant Visuals.
- Animation Check:
  - manifest records `ANIMATION_SKIPPED`;
  - no clip is required.
- Final Export:
  - canonical filename `black_rhinoceros.bbmodel`;
  - final hashes and standard evidence required.

## Approval

- Status: `APPROVED`
- Approved By: User
- Approval Reference: User request to complete the Black Rhinoceros Golden Sample package from approved Sheet 01
