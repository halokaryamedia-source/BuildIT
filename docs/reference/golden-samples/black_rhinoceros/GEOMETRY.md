# Black Rhinoceros — GEOMETRY

**Decision Authority:** `PRODUCTION_CONTEXT.md`  
**Visual Authority:** `black_rhinoceros_reference_visual.png`  
**Unit Rule:** `1 Block = 16 Blockbench units`  
**Derivation Rule:** Translate the approved image into buildable cuboid geometry without redesigning visible form.

## 1. Global Envelope

- Height: `2.5 blocks`
- Width: `1.7 blocks`
- Depth: `3.3 blocks`
- Height in Blockbench Units: `40u`
- Width in Blockbench Units: `27.2u`
- Depth in Blockbench Units: `52.8u`
- Major-Bounds Tolerance: `±1u`
- Coordinate Convention:
  - X: left/right;
  - Y: up;
  - Z: front/back;
  - front direction: `-Z`.
- Approximate Coordinate Envelope:
  - X: `-13.6u` to `+13.6u`;
  - Y: `0u` to `40u`;
  - Z: `-30u` to `+22.8u`.
- Ground Plane: `Y = 0`
- Front Direction: `-Z`
- Neutral Pose: Four-foot grounded standing pose; head low; ears upright; legs near vertical; tail close to the rear body
- Highest Geometry Point: Front-horn tip, approximately `Y = 40u`
- Lowest Ground Contact: Bottom faces of all four feet at `Y = 0`
- Center of Main Mass: Approximately `(0u, 24u, 5u)`
- Expected Cuboid Count: `22–32`
- Geometry Type: Smart cuboid construction only
- Mesh Geometry: Forbidden

## 2. Visual Form Locks

- Primary Silhouette: A long, deep, heavy quadruped with a raised shoulder, lower rear mass, low projecting head, dominant front horn, smaller rear horn, four thick legs, and a short tail
- Primary Mass Ratios:
  - body length is substantially greater than body height;
  - shoulder is the tallest and visually heaviest body region;
  - head and muzzle occupy a broad, low front profile;
  - legs are short-to-medium and thick rather than long or slender;
  - front horn is clearly larger than rear horn.
- Left-Side Profile:
  - head slopes down toward the muzzle;
  - front horn rises sharply from the nasal bridge;
  - neck transitions into the elevated shoulder;
  - torso remains broad and almost level through the center;
  - rear tapers modestly;
  - tail hangs close to the rear outline.
- Front Profile:
  - horns align near the centerline;
  - head and muzzle remain broad;
  - ears sit high and apart;
  - front legs are thick, vertical, and visibly separated;
  - shoulder width dominates the upper silhouette.
- Back Profile:
  - rear mass remains broad and slightly rounded through stepped cuboids;
  - rear legs are separated and grounded;
  - tail remains centered or near-centered without widening the body silhouette.
- Top / Footprint Profile:
  - head and muzzle narrow toward the front;
  - shoulder is the widest region;
  - torso remains long and rectangular;
  - rear tapers slightly;
  - all four legs sit within or close to the body footprint.
- Front-left 3/4 Read:
  - must show the front and left planes simultaneously;
  - must preserve horn alignment, head slope, shoulder height, torso depth, leg spacing, and rear taper;
  - must not collapse into a duplicate left-side profile.
- Must-Preserve Geometry:
  - two horns;
  - two ears;
  - one head and one muzzle mass;
  - four legs and four feet;
  - two-part tail;
  - elevated shoulder and lower rear relationship.
- Forbidden Visual Changes:
  - horse-like legs or narrow torso;
  - equal horn size;
  - upward-facing head;
  - wide fan-shaped ears;
  - long tail;
  - rounded mesh anatomy;
  - decorative armor or additional appendages;
  - surface wrinkles modeled as cubes.

## 3. Build Strategy

- Geometry Strategy: Smart cuboids
- Cube-Density Target: `22–32` total cuboids, with approximately `26–29` preferred when the approved silhouette can be matched cleanly
- Before Adding a New Cube:
  1. resize an existing cuboid;
  2. stretch it along one axis;
  3. flatten it;
  4. apply a restrained rotation;
  5. offset it;
  6. reuse or mirror a paired structure;
  7. add a new cuboid only when the silhouette or a functional joint cannot be represented otherwise.
- Surface Detail Rule: Texture-first
- Mirroring Strategy:
  - mirror paired leg and ear construction around X = 0;
  - mirror body-side geometry only when it does not flatten visible shoulder or rear transitions;
  - do not mirror front/rear anatomy;
  - horns remain unique by size and placement.
- Rotation Strategy:
  - use restrained cuboid rotations for head slope, horn taper, ears, and tail;
  - keep torso and leg columns predominantly axis-aligned;
  - avoid compound rotations that make UV or Bedrock export unstable.
- Intersection Strategy: Small internal overlaps are permitted at body joints to prevent gaps. Visible z-fighting or floating seams are forbidden.

## 4. Build Order

1. Create `black_rhinoceros_root` at the ground-centered origin and lock `-Z` as forward.
2. Establish the `40u × 27.2u × 52.8u` envelope with temporary guides only.
3. Build `torso_core` as the primary long body mass.
4. Add `shoulder_mass` and `rear_mass`, preserving the taller shoulder and modest rear taper.
5. Add a short `neck` transition and establish the low head angle.
6. Build `head` and `muzzle`, checking Front and Top / Footprint width before adding details.
7. Build the three-segment `horn_front` and two-segment `horn_rear` as rigid head children.
8. Add paired upright ears with minimal segment count.
9. Add four leg columns at the approved footprint positions, then add one foot cuboid to each leg.
10. Add `tail_base` and `tail_tip` at the rear-body centerline.
11. Align all four foot bottoms to `Y = 0` and correct body height without changing the approved envelope.
12. Compare Left Side, Front, Back, Top / Footprint, and Front-left 3/4 views before UV or texture work begins.

## 5. Hierarchy

```text
black_rhinoceros_root
└─ body
   ├─ shoulder_mass
   ├─ torso_core
   ├─ rear_mass
   ├─ neck
   │  └─ head
   │     ├─ muzzle
   │     ├─ horn_front
   │     ├─ horn_rear
   │     ├─ ear_left
   │     └─ ear_right
   ├─ leg_front_left
   │  └─ foot_front_left
   ├─ leg_front_right
   │  └─ foot_front_right
   ├─ leg_rear_left
   │  └─ foot_rear_left
   ├─ leg_rear_right
   │  └─ foot_rear_right
   └─ tail_base
      └─ tail_tip
```

Hierarchy names are canonical. Additional organizational groups may be introduced only when they do not alter this parent-child motion structure or create visible redesign.

## 6. Part Specifications

### `black_rhinoceros_root`

- Parent: None
- Visual Source Panels: All panels
- Approximate Size: No geometry
- Approximate Position: `(0u, 0u, 0u)`
- Purpose: Global scale, export origin, and motion parent
- Cuboid Strategy: Group only
- Rotation: `(0°, 0°, 0°)`
- Attachment Point: Ground-centered model origin
- Required Segment Count: `0`
- Mirrored / Unique: Unique
- Must Remain Geometry: No
- Texture-Only Details: None
- Clipping / Intersection Risks: None
- Visual-Match Notes: Moving the root away from the shared ground origin invalidates scale and validation captures.

### `torso_core`

- Parent: `body`
- Visual Source Panels: Left Side, Front, Back, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `1.55 W × 1.25 H × 1.85 D`
- Approximate Size in Blockbench Units: `24.8u W × 20u H × 29.6u D`
- Approximate Position: Centered near `(0u, 24u, 5u)`
- Purpose: Main long body volume
- Cuboid Strategy: One dominant cuboid, optionally supported by one restrained belly cuboid if required by the approved lower silhouette
- Rotation: Axis-aligned
- Attachment Point: Body center
- Required Segment Count: `1–2`
- Mirrored / Unique: Bilaterally symmetric
- Must Remain Geometry: Yes
- Texture-Only Details: Hide mottling, folds, and muscle shading
- Clipping / Intersection Risks: Shoulder/rear seams and belly-to-leg intersections
- Visual-Match Notes: Do not shorten the body or make it square when viewed from the left or top.

### `shoulder_mass`

- Parent: `body`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `1.7 W × 1.45 H × 0.75 D`
- Approximate Size in Blockbench Units: `27.2u W × 23.2u H × 12u D`
- Approximate Position: Forward body region near `(0u, 26u, -7u)`
- Purpose: Create the approved elevated and heavy shoulder silhouette
- Cuboid Strategy: One main shoulder cuboid; one shallow top/transition cuboid only if needed
- Rotation: Axis-aligned or a very small Z/X transition rotation
- Attachment Point: Forward torso
- Required Segment Count: `1–2`
- Mirrored / Unique: Bilaterally symmetric, unique front/back profile
- Must Remain Geometry: Yes
- Texture-Only Details: Shoulder crease and subtle muscle shading
- Clipping / Intersection Risks: Neck penetration and visible torso seam
- Visual-Match Notes: This must remain visibly taller and heavier than the rear mass.

### `rear_mass`

- Parent: `body`
- Visual Source Panels: Left Side, Back, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `1.5 W × 1.25 H × 0.75 D`
- Approximate Size in Blockbench Units: `24u W × 20u H × 12u D`
- Approximate Position: Rear body region near `(0u, 23u, 17u)`
- Purpose: Complete the hindquarter volume and rear taper
- Cuboid Strategy: One main cuboid with an optional shallow lower/rear transition
- Rotation: Axis-aligned; slight taper through stepped size rather than mesh deformation
- Attachment Point: Rear torso
- Required Segment Count: `1–2`
- Mirrored / Unique: Bilaterally symmetric
- Must Remain Geometry: Yes
- Texture-Only Details: Rear-plane shading and hide mottling
- Clipping / Intersection Risks: Rear-leg and tail-base intersections
- Visual-Match Notes: Keep the rear heavy but lower and slightly narrower than the shoulder.

### `neck`

- Parent: `body`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `1.15 W × 1.0 H × 0.55 D`
- Approximate Size in Blockbench Units: `18.4u W × 16u H × 8.8u D`
- Approximate Position: Near `(0u, 26u, -12u)`
- Purpose: Connect shoulder to the low head without a visible gap
- Cuboid Strategy: One short transitional cuboid
- Rotation: Slight downward pitch toward `-Z`
- Attachment Point: Front shoulder
- Required Segment Count: `1`
- Mirrored / Unique: Bilaterally symmetric
- Must Remain Geometry: Yes
- Texture-Only Details: Neck fold and shadow transition
- Clipping / Intersection Risks: Head/shoulder overlap
- Visual-Match Notes: Avoid a long giraffe-like neck; the head should remain close to the shoulder mass.

### `head`

- Parent: `neck`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `1.05 W × 0.9 H × 0.9 D`
- Approximate Size in Blockbench Units: `16.8u W × 14.4u H × 14.4u D`
- Approximate Position: Near `(0u, 24u, -20u)`
- Purpose: Primary skull volume and parent for facial anatomy
- Cuboid Strategy: `1–2` cuboids forming a broad low skull with a downward front slope
- Rotation: Conservative downward pitch around local X
- Attachment Point: Neck-to-skull transition near `(0u, 27u, -14u)`
- Required Segment Count: `1–2`
- Mirrored / Unique: Bilaterally symmetric base; directional facial UVs unique
- Must Remain Geometry: Yes
- Texture-Only Details: Eyes, brow shading, cheek shading
- Clipping / Intersection Risks: Shoulder, muzzle, horns, and ears
- Visual-Match Notes: Keep the head broad and low; do not create a narrow snout or tall forehead.

### `muzzle`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: `0.95 W × 0.55 H × 0.75 D`
- Approximate Size in Blockbench Units: `15.2u W × 8.8u H × 12u D`
- Approximate Position: Near `(0u, 19u, -27u)`
- Purpose: Rectangular mouth and nose volume
- Cuboid Strategy: One broad cuboid; a second shallow lower-jaw cuboid only if necessary to match the approved profile
- Rotation: Inherit head pitch; avoid independent dramatic rotation
- Attachment Point: Front/lower head
- Required Segment Count: `1–2`
- Mirrored / Unique: Bilaterally symmetric geometry; unique front and side UVs
- Must Remain Geometry: Yes
- Texture-Only Details: Nostrils, mouth line, lip separation, subtle nose shading
- Clipping / Intersection Risks: Front horn base and head seam
- Visual-Match Notes: The muzzle must remain broad and rectangular rather than pointed.

### `horn_front`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: Overall projection approximately `0.3 W × 1.05 H × 0.45 D`
- Approximate Size in Blockbench Units: Overall envelope approximately `4.8u W × 16.8u H × 7.2u D`
- Approximate Position: Centered on the forward nasal bridge, rising toward the global highest point
- Purpose: Dominant species-defining horn
- Cuboid Strategy: Three stacked/overlapping tapered cuboids that reduce toward the tip
- Rotation: Backward/upward rake consistent with the Reference Visual
- Attachment Point: Upper-front muzzle/head bridge
- Required Segment Count: `3`
- Mirrored / Unique: Unique centerline part
- Must Remain Geometry: Yes
- Texture-Only Details: Value progression and subtle surface bands
- Clipping / Intersection Risks: Muzzle penetration and front-view centerline drift
- Visual-Match Notes: Must be substantially longer and taller than `horn_rear` and may define the `40u` height.

### `horn_rear`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Size in Blocks: Overall projection approximately `0.25 W × 0.55 H × 0.35 D`
- Approximate Size in Blockbench Units: Overall envelope approximately `4u W × 8.8u H × 5.6u D`
- Approximate Position: On the upper head behind `horn_front`
- Purpose: Secondary horn and silhouette cue
- Cuboid Strategy: Two tapered cuboids
- Rotation: Similar rake to front horn but shorter
- Attachment Point: Upper head centerline
- Required Segment Count: `2`
- Mirrored / Unique: Unique centerline part
- Must Remain Geometry: Yes
- Texture-Only Details: Dark base-to-tip value steps
- Clipping / Intersection Risks: Front horn overlap and head penetration
- Visual-Match Notes: Do not enlarge it until it competes with the front horn.

### `ear_left` and `ear_right`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Back, Top / Footprint, Front-left 3/4
- Approximate Size per Ear in Blocks: `0.3 W × 0.55 H × 0.2 D`
- Approximate Size per Ear in Blockbench Units: `4.8u W × 8.8u H × 3.2u D`
- Approximate Position: Upper rear-left and upper rear-right head corners
- Purpose: Compact upright ear silhouette and future pivot readiness
- Cuboid Strategy: One main cuboid per ear; optional smaller tip cuboid only when needed by the approved shape
- Rotation: Small outward and backward tilt
- Attachment Point: Upper rear head
- Required Segment Count: `1–2` per ear
- Mirrored / Unique: Mirrored pair
- Must Remain Geometry: Yes
- Texture-Only Details: Dark ear interior
- Clipping / Intersection Risks: Head and shoulder when rotated
- Visual-Match Notes: Ears remain compact and upright; do not widen them into large plates.

### Front Leg Pair

- Groups: `leg_front_left`, `foot_front_left`, `leg_front_right`, `foot_front_right`
- Parent: `body` for legs; corresponding leg for each foot
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Approximate Leg Size per Side in Blocks: `0.42 W × 0.9 H × 0.5 D`
- Approximate Leg Size per Side in Units: `6.7u W × 14.4u H × 8u D`
- Approximate Foot Size per Side in Blocks: `0.5 W × 0.25 H × 0.6 D`
- Approximate Foot Size per Side in Units: `8u W × 4u H × 9.6u D`
- Approximate Position: Forward underside of shoulder, X mirrored around centerline
- Purpose: Primary front support and heavy stance
- Cuboid Strategy: One leg column and one foot cuboid per side
- Rotation: Near vertical in neutral pose
- Attachment Point: Lower shoulder/body
- Required Segment Count: `2` per side
- Mirrored / Unique: Mirrored pair
- Must Remain Geometry: Yes
- Texture-Only Details: Hoof split, lower-leg shading, subtle fold marks
- Clipping / Intersection Risks: Belly, shoulder, and ground
- Visual-Match Notes: Front legs should appear strong and slightly more visually dominant than rear legs.

### Rear Leg Pair

- Groups: `leg_rear_left`, `foot_rear_left`, `leg_rear_right`, `foot_rear_right`
- Parent: `body` for legs; corresponding leg for each foot
- Visual Source Panels: Left Side, Back, Top / Footprint, Front-left 3/4
- Approximate Leg Size per Side in Blocks: `0.4 W × 0.85 H × 0.48 D`
- Approximate Leg Size per Side in Units: `6.4u W × 13.6u H × 7.7u D`
- Approximate Foot Size per Side in Blocks: `0.48 W × 0.25 H × 0.58 D`
- Approximate Foot Size per Side in Units: `7.7u W × 4u H × 9.3u D`
- Approximate Position: Rear underside of body, X mirrored around centerline
- Purpose: Rear support and approved back silhouette
- Cuboid Strategy: One leg column and one foot cuboid per side
- Rotation: Near vertical in neutral pose
- Attachment Point: Lower rear body
- Required Segment Count: `2` per side
- Mirrored / Unique: Mirrored pair
- Must Remain Geometry: Yes
- Texture-Only Details: Hoof split and restrained lower-leg shading
- Clipping / Intersection Risks: Rear mass, tail, and ground
- Visual-Match Notes: Keep rear legs thick and stable; do not make them slender or strongly angled.

### `tail_base` and `tail_tip`

- Parent: `body` for `tail_base`; `tail_base` for `tail_tip`
- Visual Source Panels: Left Side, Back, Top / Footprint, Front-left 3/4
- Approximate Overall Size in Blocks: `0.18 W × 0.9 H × 0.18 D`
- Approximate Overall Size in Units: `2.9u W × 14.4u H × 2.9u D`
- Approximate Position: Rear-body centerline near `Z = +22u`
- Purpose: Short narrow rear attachment and future two-part pivot chain
- Cuboid Strategy: Two slim cuboids; avoid additional decorative segments
- Rotation: Mostly downward with slight rearward offset
- Attachment Point: Rear center of `rear_mass`
- Required Segment Count: `2`
- Mirrored / Unique: Unique centerline chain
- Must Remain Geometry: Yes
- Texture-Only Details: Darker tip accent
- Clipping / Intersection Risks: Rear mass and rear legs
- Visual-Match Notes: Keep the tail short and close to the body; it must not become a long swinging silhouette element.

## 7. Footprint and Ground Contacts

- Forward Axis: `-Z`
- Main Body Envelope: Approximately X `-13u` to `+13u`, Y `13u` to `37u`, Z `-10u` to `+22.8u`
- Head / Front Envelope: Approximately X `-8.5u` to `+8.5u`, Y `14u` to `40u`, Z `-30u` to `-9u`
- Left-Right Extents: Shoulder is the maximum-width region at approximately `27.2u`
- Front-Rear Extents: Front-horn/muzzle system reaches approximately `Z = -30u`; rear body/tail base reaches approximately `Z = +22.8u`
- Attachment Extents: Ears remain inside the approved width envelope; tail remains close to the rear centerline
- Ground-Contact Count: `4`
- Contact Positions: One full bottom face per foot, arranged as front-left, front-right, rear-left, and rear-right
- Shared Ground Plane Rule: Every foot bottom must equal `Y = 0` in neutral pose; no foot may be below or visibly above this plane
- Tail / Rear Direction: Tail attaches at positive Z and descends close to the rear body
- Stance Rule: Left/right spacing must match Front and Back panels; front/rear spacing must match Left Side and Top / Footprint panels

## 8. Geometry-Only Features

- overall body envelope and stepped mass transitions;
- high shoulder and lower rear relationship;
- broad low skull and rectangular muzzle;
- front and rear horns with distinct segment counts and sizes;
- compact upright ears;
- four thick leg columns and four foot volumes;
- short two-segment tail;
- major silhouette breaks visible in the five approved panels.

## 9. Texture-Only Features

- eyes and eyelid impression;
- nostrils;
- mouth line and lip separation;
- skin folds and wrinkles;
- scars or subtle hide marks;
- muscle and belly shading;
- toe/hoof separation lines;
- small horn surface bands;
- ear interior shading;
- low-contrast hide mottling.

## 10. Forbidden Micro-Cubes

- individual wrinkle cubes;
- nostril or eye cubes;
- separate toe cubes;
- scar strips;
- random hide bumps;
- lip strips;
- decorative horn ridges;
- dense voxel smoothing layers;
- concealed cubes with no silhouette, joint, or export function.

## 11. Geometry QA Targets

- Height Tolerance: `40u ± 1u`
- Width Tolerance: `27.2u ± 1u`
- Depth Tolerance: `52.8u ± 1u`
- Cuboid Count: `22–32`
- Required Comparison Views:
  - Left Side
  - Front
  - Back
  - Top / Footprint
  - Front-left 3/4
- Required Group Check: All canonical hierarchy groups exist and have the documented parent
- Ground Check: Four full foot contacts at `Y = 0`
- Segment Check: Front horn `3`, rear horn `2`, tail `2`, each leg chain `2`
- Failure Conditions:
  - wrong species silhouette;
  - missing or equal-sized horns;
  - shoulder not higher/heavier than rear;
  - head or muzzle too narrow/high;
  - long/slender legs;
  - missing foot or tail segment;
  - bounds outside tolerance;
  - mesh or forbidden micro-cube usage;
  - visible z-fighting, floating major parts, or incorrect ground contact;
  - Top / Footprint inconsistent with side/front/back construction.


## Machine-Readable Enforcement and Review Route

- Manifest schema: `3.3`.
- Symmetry policy: `BILATERAL`, with executable ear, front-leg, and rear-leg pair contracts. `right_side` is therefore not a required final panel for this sample.
- The manifest contains numeric primary-mass center/size ranges, exact segment-count limits for horns/tail/limbs, parent contracts, and eight rotation contracts.
- Normal correction runs `analyze_geometry_views` without returning the diff image. The final required-view pass writes the canonical diff.
- Review submission uses `submit_geometry_for_review`, which performs fresh structural and visual readiness validation, creates the next unused checkpoint, releases the lease, and enters `GEOMETRY_REVIEW`.
- Revision remains inside `BEDROCK_CUBOID_GEOMETRY` using `LOCAL_REPAIR` or `MAJOR_FORM_REVISION`; no reconnect or removed repair profile is allowed.
