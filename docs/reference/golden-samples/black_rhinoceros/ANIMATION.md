# Black Rhinoceros — ANIMATION

**Decision Authority:** `PRODUCTION_CONTEXT.md`  
**Visual Authority:** `black_rhinoceros_reference_visual.png`  
**Animation Created During Reference Stage:** No  
**Animation Status:** `ANIMATION_SKIPPED`  
**Animation-Ready Structure Required:** Yes  
**Derivation Rule:** Derive neutral pose, part separation, pivots, parent-child behavior, and clipping limits from the approved image. Do not author or invent animation clips in this Golden Sample scope.

## 1. Neutral Pose Lock

- Neutral Pose: Four-foot grounded standing pose with a heavy level torso, elevated shoulder, slightly lower rear, low forward head, upright ears, centered horns, near-vertical legs, and a short tail close to the rear body
- Front Direction: `-Z`
- Shared Ground Plane: `Y = 0`
- Grounded Parts:
  - `foot_front_left`
  - `foot_front_right`
  - `foot_rear_left`
  - `foot_rear_right`
- Head / Main Orientation: Head projects toward `-Z` with a restrained downward pitch; horns remain centered on the head/muzzle axis
- Limb / Support Orientation: Four leg columns are nearly vertical and evenly support the body; feet remain flat on the shared ground plane
- Tail / Attachment Orientation: Tail hangs from the rear centerline with the tip close to the body
- Pose Details That Must Not Change:
  - front horn remains larger than rear horn;
  - shoulder remains higher/heavier than rear;
  - head remains low and broad;
  - ears remain compact and upright;
  - all four feet remain grounded;
  - no action stance, charge pose, walk stride, or head turn is introduced into the neutral reference.

## 2. Motion Hierarchy

```text
black_rhinoceros_root
└─ body
   ├─ shoulder_mass [static]
   ├─ torso_core [static]
   ├─ rear_mass [static]
   ├─ neck [static reference parent]
   │  └─ head [movable-ready]
   │     ├─ muzzle [rigid head child]
   │     ├─ horn_front [rigid head child]
   │     ├─ horn_rear [rigid head child]
   │     ├─ ear_left [movable-ready]
   │     └─ ear_right [movable-ready]
   ├─ leg_front_left [movable-ready]
   │  └─ foot_front_left [movable-ready child]
   ├─ leg_front_right [movable-ready]
   │  └─ foot_front_right [movable-ready child]
   ├─ leg_rear_left [movable-ready]
   │  └─ foot_rear_left [movable-ready child]
   ├─ leg_rear_right [movable-ready]
   │  └─ foot_rear_right [movable-ready child]
   └─ tail_base [movable-ready]
      └─ tail_tip [movable-ready child]
```

## 3. Group Specifications

### `black_rhinoceros_root`

- Parent: None
- Visual Source Panels: All five panels
- Static / Movable: Static during the reference stage; global animation parent if future scope is approved
- Pivot Position: Ground-centered model origin
- Pivot in Blockbench Units: Approximately `(0u, 0u, 0u)`
- Neutral Rotation: `(0°, 0°, 0°)`
- Allowed Axes: None in current scope
- Qualitative Range: No authored motion
- Children: `body`
- Inherited Motion: None
- Ground-Contact Rule: Must not translate or rotate the model away from the approved `Y = 0` neutral contact
- Clipping Risks: Global ground penetration if moved incorrectly
- Deformation Risks: None; group contains no deformable mesh
- Notes: Root motion requires a separate approved animation scope and is not part of this Golden Sample.

### `body`

- Parent: `black_rhinoceros_root`
- Visual Source Panels: All five panels
- Static / Movable: Static in the reference stage
- Pivot Position: Near the center of the torso mass
- Pivot in Blockbench Units: Approximately `(0u, 22u, 5u)`
- Neutral Rotation: `(0°, 0°, 0°)`
- Allowed Axes: None in current scope; any future body pitch/roll requires animation approval
- Qualitative Range: No authored motion
- Children: shoulder, torso, rear, neck/head chain, four leg chains, and tail chain
- Inherited Motion: Inherits root transform only
- Ground-Contact Rule: Body height must preserve all four foot contacts in neutral pose
- Clipping Risks: Body motion could force legs into belly or feet below ground
- Deformation Risks: Body cuboids must remain rigid
- Notes: This is the common parent for anatomical motion chains.

### `neck`

- Parent: `body`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Static reference parent; no independent motion required
- Pivot Position: Front shoulder / neck base
- Pivot in Blockbench Units: Approximately `(0u, 27u, -10u)`
- Neutral Rotation: Restrained downward orientation toward `-Z`
- Allowed Axes: None in current scope
- Qualitative Range: No authored motion
- Children: `head`
- Inherited Motion: Body transform
- Ground-Contact Rule: Not applicable directly
- Clipping Risks: Shoulder and head overlap
- Deformation Risks: None; rigid cuboid
- Notes: Maintains a clean parent point so future head motion does not require rotating the shoulder geometry.

### `head`

- Parent: `neck`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Movable-ready, but no clip is authored
- Pivot Position: Neck-to-skull transition
- Pivot in Blockbench Units: Approximately `(0u, 27u, -14u)`
- Neutral Rotation: Low forward orientation with a slight downward pitch
- Allowed Axes: Local X pitch and local Y yaw only if future animation scope is approved
- Qualitative Range: Conservative; enough for natural head adjustment without horn/muzzle/shoulder clipping. No current numeric keyframe requirement.
- Children: `muzzle`, `horn_front`, `horn_rear`, `ear_left`, `ear_right`
- Inherited Motion: Neck and body transforms
- Ground-Contact Rule: Head motion must not alter foot contact or root height
- Clipping Risks: Front horn into muzzle, rear horn/ears into shoulder, head into neck
- Deformation Risks: Skull and muzzle must remain rigid
- Notes: Horns and muzzle inherit head motion as rigid children.

### `muzzle`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Static rigid child
- Pivot Position: Head-to-muzzle connection
- Pivot in Blockbench Units: Approximately `(0u, 21u, -23u)`
- Neutral Rotation: Inherits head orientation
- Allowed Axes: None
- Qualitative Range: No independent motion
- Children: None
- Inherited Motion: Full head transform
- Ground-Contact Rule: Not applicable
- Clipping Risks: Head and front-horn base
- Deformation Risks: Do not squash or stretch during motion
- Notes: Jaw animation is not authorized in this scope.

### `horn_front`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Static rigid child
- Pivot Position: Front-horn base on the nasal bridge
- Pivot in Blockbench Units: Approximately `(0u, 26u, -24u)`
- Neutral Rotation: Approved backward/upward rake
- Allowed Axes: None
- Qualitative Range: No independent motion
- Children: None
- Inherited Motion: Full head transform
- Ground-Contact Rule: Not applicable
- Clipping Risks: Muzzle and rear horn if hierarchy/rotation is incorrect
- Deformation Risks: Three cuboid segments must remain rigid and aligned
- Notes: The front horn remains the global highest point or near-highest point and may not detach from the head.

### `horn_rear`

- Parent: `head`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Static rigid child
- Pivot Position: Rear-horn base on the upper head
- Pivot in Blockbench Units: Approximately `(0u, 29u, -18u)`
- Neutral Rotation: Approved short backward/upward rake
- Allowed Axes: None
- Qualitative Range: No independent motion
- Children: None
- Inherited Motion: Full head transform
- Ground-Contact Rule: Not applicable
- Clipping Risks: Front horn, ears, and shoulder
- Deformation Risks: Two cuboid segments must remain rigid
- Notes: Must remain visibly smaller than the front horn in every pose.

### `ear_left` and `ear_right`

- Parent: `head`
- Visual Source Panels: Front, Back, Left Side, Top / Footprint, Front-left 3/4
- Static / Movable: Movable-ready, but no clip is authored
- Pivot Position: Each ear base at the upper rear head
- Pivot in Blockbench Units:
  - left: approximately `(-5u, 33u, -15u)`;
  - right: approximately `(+5u, 33u, -15u)`.
- Neutral Rotation: Small outward/backward tilt; ears remain upright
- Allowed Axes: Small local X/Z tilt only if future animation scope is approved
- Qualitative Range: Very limited; the ear base must not leave the head or intersect the shoulder
- Children: None
- Inherited Motion: Full head transform
- Ground-Contact Rule: Not applicable
- Clipping Risks: Head, rear horn, and shoulder
- Deformation Risks: Ear cuboids remain rigid
- Notes: Mirrored pivot placement is required.

### Front Leg Groups

- Groups: `leg_front_left`, `leg_front_right`
- Parent: `body`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Static / Movable: Movable-ready, but no locomotion clip is authored
- Pivot Position: Upper leg/body attachments beneath the shoulder
- Pivot in Blockbench Units:
  - left: approximately `(-8u, 16u, -4u)`;
  - right: approximately `(+8u, 16u, -4u)`.
- Neutral Rotation: Near vertical
- Allowed Axes: Primarily local X swing if future locomotion is approved; minimal local Z correction only when required for contact
- Qualitative Range: Conservative enough to clear the belly and avoid crossing the opposite leg
- Children: Corresponding front foot
- Inherited Motion: Body transform
- Ground-Contact Rule: Neutral pose returns the corresponding foot bottom to `Y = 0`
- Clipping Risks: Shoulder, belly, opposite front leg, and ground
- Deformation Risks: Leg cuboid remains rigid
- Notes: Left/right pivots mirror around X = 0.

### Rear Leg Groups

- Groups: `leg_rear_left`, `leg_rear_right`
- Parent: `body`
- Visual Source Panels: Left Side, Back, Top / Footprint, Front-left 3/4
- Static / Movable: Movable-ready, but no locomotion clip is authored
- Pivot Position: Upper leg/body attachments beneath the rear mass
- Pivot in Blockbench Units:
  - left: approximately `(-8u, 15u, +15u)`;
  - right: approximately `(+8u, 15u, +15u)`.
- Neutral Rotation: Near vertical
- Allowed Axes: Primarily local X swing if future locomotion is approved; minimal local Z correction only when required for contact
- Qualitative Range: Conservative enough to clear the belly, tail, and opposite rear leg
- Children: Corresponding rear foot
- Inherited Motion: Body transform
- Ground-Contact Rule: Neutral pose returns the corresponding foot bottom to `Y = 0`
- Clipping Risks: Rear mass, belly, tail, opposite rear leg, and ground
- Deformation Risks: Leg cuboid remains rigid
- Notes: Left/right pivots mirror around X = 0.

### Foot Groups

- Groups: `foot_front_left`, `foot_front_right`, `foot_rear_left`, `foot_rear_right`
- Parent: Corresponding leg group
- Visual Source Panels: Left Side, Front, Back, Front-left 3/4
- Static / Movable: Movable-ready child for future contact correction; no clip is authored
- Pivot Position: Lower-leg-to-foot connection
- Pivot in Blockbench Units: Approximately at `Y = 4u` with X/Z inherited from each leg
- Neutral Rotation: Flat bottom face on `Y = 0`
- Allowed Axes: Minimal local X correction only if future locomotion is approved
- Qualitative Range: Limited to keeping the foot visually planted; no independent expressive motion
- Children: None
- Inherited Motion: Full corresponding leg transform
- Ground-Contact Rule: Bottom face must return exactly to `Y = 0` in neutral pose
- Clipping Risks: Ground and lower leg
- Deformation Risks: Foot cuboid remains rigid
- Notes: Foot pivots must not introduce a permanent tilt in neutral pose.

### `tail_base`

- Parent: `body`
- Visual Source Panels: Left Side, Back, Top / Footprint, Front-left 3/4
- Static / Movable: Movable-ready, but no clip is authored
- Pivot Position: Rear-body centerline attachment
- Pivot in Blockbench Units: Approximately `(0u, 24u, +22u)`
- Neutral Rotation: Downward and close to the rear body
- Allowed Axes: Small local X/Y swing only if future animation scope is approved
- Qualitative Range: Limited so the segment does not enter the rear mass or rear legs
- Children: `tail_tip`
- Inherited Motion: Body transform
- Ground-Contact Rule: Tail must not touch or cross the ground in neutral pose
- Clipping Risks: Rear mass and rear legs
- Deformation Risks: Rigid cuboid
- Notes: Keep the tail silhouette short.

### `tail_tip`

- Parent: `tail_base`
- Visual Source Panels: Left Side, Back, Front-left 3/4
- Static / Movable: Movable-ready, but no clip is authored
- Pivot Position: End of `tail_base`
- Pivot in Blockbench Units: Approximately `(0u, 16u, +23u)`
- Neutral Rotation: Continues the downward tail line
- Allowed Axes: Small local X/Y follow-through only if future animation scope is approved
- Qualitative Range: Very limited
- Children: None
- Inherited Motion: Full tail-base transform
- Ground-Contact Rule: Must remain above `Y = 0`
- Clipping Risks: Rear legs and ground
- Deformation Risks: Rigid cuboid
- Notes: No additional tail segments are authorized.

## 4. Static Groups

- `black_rhinoceros_root` during the reference stage
- `body`
- `shoulder_mass`
- `torso_core`
- `rear_mass`
- `neck` as a static reference parent
- `muzzle` as a rigid head child
- `horn_front` as a rigid head child
- `horn_rear` as a rigid head child

Static means no independent motion is required in this package. It does not permit flattening these groups into a hierarchy that breaks future pivot inheritance.

## 5. Movable Groups

- `head`
- `ear_left`
- `ear_right`
- `leg_front_left`
- `foot_front_left`
- `leg_front_right`
- `foot_front_right`
- `leg_rear_left`
- `foot_rear_left`
- `leg_rear_right`
- `foot_rear_right`
- `tail_base`
- `tail_tip`

Movable-ready does not mean an animation clip must be created. It requires only correct group separation, pivot placement, parent-child relationships, and sufficient clearance for future approved motion.

## 6. Motion Chains

- Head chain: `black_rhinoceros_root → body → neck → head → muzzle / horns / ears`
- Front-left support chain: `body → leg_front_left → foot_front_left`
- Front-right support chain: `body → leg_front_right → foot_front_right`
- Rear-left support chain: `body → leg_rear_left → foot_rear_left`
- Rear-right support chain: `body → leg_rear_right → foot_rear_right`
- Tail chain: `body → tail_base → tail_tip`
- Rigid inheritance rule: Muzzle and horns follow the head exactly; they do not receive independent keyframes
- Mirroring rule: Left/right limb and ear pivot positions mirror around X = 0, while animation data is not required in this scope

## 7. Ground-Contact Rules

- Contact Parts: Four foot groups
- Required Shared Plane: `Y = 0`
- Foot Sliding Tolerance: `0u` in the neutral pose; future motion is outside current validation except for neutral reset
- Body-Height Stability: Neutral body height must return to the approved envelope and may not drift between validation captures
- Contact Reset Rule: Resetting all groups to neutral rotations must restore all four full foot-bottom contacts to `Y = 0`
- Root Motion Rule: Root remains at the model origin in this scope
- Tail Clearance: Tail tip remains above ground
- Horn Clearance: Front horn remains above the ground and clear of the muzzle in neutral pose

## 8. Clipping Prevention

- Head-to-shoulder: Keep conservative pitch/yaw clearance at the neck transition
- Front horn-to-muzzle: Front horn base may overlap internally, but visible surfaces may not intersect during neutral or conservative test motion
- Horn-to-horn: Preserve visible separation between the three-segment front horn and two-segment rear horn
- Ear-to-head: Ear bases attach cleanly without floating or passing through the skull
- Ear-to-shoulder: Conservative head/ear motion may not enter the shoulder mass
- Front legs-to-belly: Leg pivots must allow forward/backward movement without immediate belly penetration
- Rear legs-to-tail: Tail chain must remain behind/inside the rear centerline without crossing rear legs
- Feet-to-ground: Neutral foot bottoms stay on `Y = 0`; no cube penetrates below ground
- Paired limbs: Left/right limbs may not cross the X centerline during conservative test motion
- Deformation: Scaling keyframes, vertex deformation, armature skinning, or mesh bending are forbidden

## 9. Future Animation Notes

### Idle

- Not authorized in this Golden Sample.
- A future approved idle should preserve all four ground contacts, use only subtle head/ear/tail motion, and avoid visible body bob that changes the approved height envelope.

### Walk / Locomotion

- Not authorized in this Golden Sample.
- A future approved walk must use the documented leg/foot chains, preserve rigid cuboids, avoid belly/tail clipping, and return cleanly to the neutral pose.

### Turn

- Not authorized in this Golden Sample.
- A future approved turn should be handled through locomotion/root behavior rather than twisting the torso into a visibly deformed shape.

### Interaction / Attack / Special

- Not authorized in this Golden Sample.
- Charge, attack, hurt, death, jaw, rider, and special-effect motions require an explicit scope reopen and may not be inferred from the reference package.

## 10. Animation QA Targets

- Neutral Pose Recovery: Resetting transforms restores the exact approved pose and envelope
- Pivot Correctness: Head, ears, legs, feet, tail base, and tail tip rotate from their anatomical attachment points
- Parent-Child Behavior: Muzzle/horns/ears follow head; feet follow legs; tail tip follows tail base
- Ground Contact: Four feet share `Y = 0` after neutral reset; tail remains above ground
- Clipping: No critical intersection in neutral pose or conservative pivot checks
- Geometry Deformation: Cuboids remain rigid; no scaling, mesh deformation, or armature weighting
- Silhouette Preservation: Conservative pivot checks do not change horn count, horn dominance, body mass relationship, or recognizable species silhouette
- Required Clip Count: `0`
- Manifest Check: `animation.animation_included_in_reference_stage = false` and `animation.status = ANIMATION_SKIPPED`
- Failure Conditions:
  - wrong parent-child hierarchy;
  - pivot placed at geometric center instead of anatomical joint where documented;
  - horns or muzzle moving independently from head;
  - feet not returning to `Y = 0`;
  - body/root drift in neutral pose;
  - critical clipping at head, shoulder, belly, tail, or ground;
  - any authored clip included without approved scope;
  - mesh, armature, vertex-weight, or scaling deformation introduced.


## Deterministic Animation Quality Contract

This Golden Sample keeps `ANIMATION_SKIPPED`, so no clip may be inferred or generated. The manifest still records the current reusable quality contract for future animated candidates:

- clip length must remain within `0.05–30` seconds;
- required clips must have animators and keyframes;
- referenced moving/static groups must exist;
- root position motion is forbidden unless the package explicitly authorizes it;
- neutral-pose hierarchy and pivot evidence remain required even when clip production is skipped.
