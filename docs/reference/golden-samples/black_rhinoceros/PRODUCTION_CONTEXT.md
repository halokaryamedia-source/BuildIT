# Black Rhinoceros — PRODUCTION CONTEXT

## 1. MAIN FORMAT

### Context Decision Core

- Asset Archetype: Organic quadruped creature entity
- Secondary Archetype: Large grounded animal / production-pipeline Golden Sample
- Intended Gameplay / Usage: Canonical BuildIT Golden Sample used to validate the complete handoff from an approved ChatGPT Reference Visual to Codex and MCP-Blockbench model production.
- Fidelity Priority: Preserve the approved silhouette, proportions, neutral pose, anatomy, horn arrangement, material family, and readable Minecraft cuboid style. Implementation may simplify hidden construction but may not alter visible identity.
- Scale Basis: Written scale lock from the approved reference: `2.5 blocks` high, `1.7 blocks` wide, and `3.3 blocks` deep at `16 Blockbench units = 1 block`.
- Interaction Profile: Non-rideable creature reference. No seat, held item, equipment socket, inventory interaction, or gameplay attachment is required.
- Functional State: Static approved neutral reference with an animation-ready hierarchy. No animation clips are included in this Golden Sample scope.
- Symmetry Policy: Bilateral geometry may be mirrored for the core body, legs, ears, and UV layout when the approved visual remains unchanged. Face details must retain one eye and one nostril treatment per visible side.
- Hidden-Side Reconstruction Policy: Reconstruct unseen or weakly shown surfaces through bilateral symmetry and the Front, Back, and Top / Footprint panels. Do not invent asymmetrical scars, damage, accessories, or anatomy.
- Variant Policy: One approved Black Rhinoceros variant only. No juvenile, alternate horn, color, biome, armored, saddled, or damaged variants.
- Technical Constraints: Minecraft Bedrock Entity; smart cuboid construction; mesh forbidden; Classic Bedrock texture pipeline; `128 × 128` atlas; 16x pixel style; no PBR; no Vibrant Visuals; exactly one generated Reference Visual; no post-approval technical images.
- User-Confirmed Decisions:
  - `Black Rhinoceros` is the exact Display Name.
  - The approved Reference Visual is the sole visual authority.
  - Approved height is `2.5 blocks`.
  - The asset uses cuboid-only Minecraft-style geometry.
  - Geometry and texture production are required.
  - Animation clips are skipped, while pivot readiness is retained.
  - Technical documentation is generated automatically after Reference Visual approval.
- Recommended Defaults Accepted:
  - `-Z` is the forward direction toward the head.
  - Ground contact uses `Y = 0`.
  - Major left/right construction may be mirrored.
  - Surface wrinkles, eyes, nostrils, mouth line, scars, skin folds, and hoof separation are texture-first details.
- Unresolved Blockers: None

### Source Evidence

- Primary Identity Source: `black_rhinoceros_reference_visual.png`
- Form / Anatomy Source: Left Side, Front, Back, Top / Footprint, and Front-left 3/4 panels in `black_rhinoceros_reference_visual.png`
- Color / Material Source: The approved warm gray-brown hide, darker horn/hoof family, and near-black facial details visible in `black_rhinoceros_reference_visual.png`
- Equipment / Detail Source: No external equipment. Anatomical attachments are two horns, two ears, four feet, and a short tail.
- Alternate-Angle Source: The five approved panels inside the single Reference Visual; no additional viewpoint image is authorized.
- Original Intake Source: `source/original_reference.png`
- Source Contradictions: None recorded. Written scale and format values resolve any visual ambiguity.
- Confidence Summary: High confidence for identity, silhouette, scale, material family, neutral pose, and required parts. Exact hidden cuboid boundaries remain implementation guidance and must not create visible redesign.

### Resolved Context Decisions

| Decision Axis | Evidence or Contextual Question | Final Resolution | Technical Consequence | Confidence |
|---|---|---|---|---|
| Intended Use | Golden Sample scope and approved package role | Canonical BuildIT reference-to-production validation asset | Documents must be complete, deterministic, and directly consumable by Codex | High |
| Scale | Approved scale marker and written lock | `2.5 H × 1.7 W × 3.3 D` blocks | Global bounds are `40 H × 27.2 W × 52.8 D` units with `±1u` major-bound tolerance | High |
| Fidelity / Style | Approved five-view visual | Minecraft cuboid pixel-art rhinoceros, not realistic mesh sculpture | Use smart cuboids and texture-first surface detail | High |
| Geometry Separation | Visible joints and anatomical boundaries | Separate body, neck/head, muzzle, horns, ears, four legs/feet, and two-part tail | Required group hierarchy and pivot-ready part separation | High |
| Interaction / Attachments | No saddle, rider, carried item, or socket shown or requested | No gameplay attachment points beyond anatomical parent-child joints | Do not create seat, saddle, harness, armor, or held-item sockets | High |
| Texture / Material | Approved visual color family | Opaque warm gray-brown hide with darker horns/hooves and near-black facial accents | `128 × 128`, Box UV first, selective per-face UV, no alpha or emissive | High |
| Symmetry / Hidden Side | Front, Back, and Top panels support bilateral construction | Mirror structural left/right parts; keep directional facial placement coherent | Shared UVs allowed for symmetric limbs and ears | High |
| Animation / Motion | Golden Sample explicitly skips clip production | No required clips; animation-ready hierarchy only | Pivots and motion clearances are documented, but no animation file is authored | High |
| Variants / Reuse | Single approved sample | No variants in this package | Manifest and textures describe one canonical appearance only | High |

### Main Asset Lock

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Object Type / Species: Black rhinoceros creature
- Target: Minecraft Bedrock Entity
- Source Priority:
  1. `PRODUCTION_CONTEXT.md` for intent, scale, and resolved decisions
  2. `black_rhinoceros_reference_visual.png` for visible identity and form
  3. Category documents for executable technical precision
- Intended Role: Golden Sample and production-ready entity reference
- Height: `2.5 blocks` (`40u`)
- Width: `1.7 blocks` (`27.2u`)
- Recommended Depth: `3.3 blocks` (`52.8u`)
- Bounds Tolerance: `±1u` on major envelope checks
- Ground Plane: `Y = 0`
- Front Direction: `-Z`, toward the muzzle and front horn
- Neutral Pose: Four-foot grounded standing pose with the body level, shoulder mass slightly higher than the rear, head carried low, ears upright, and tail hanging close to the rear body
- Visual Style: Classic Minecraft Bedrock cuboid entity with restrained 16x pixel-art material variation
- Must-Preserve Identity:
  - heavy elevated shoulder mass;
  - long deep torso with a slightly tapered rear;
  - low broad head and rectangular muzzle;
  - two horns, with the front horn substantially longer and taller than the rear horn;
  - compact upright ears;
  - four thick near-vertical legs with dark hoof ends;
  - short narrow tail;
  - warm gray-brown hide with low-contrast mottling.
- Equipment / Attachments: No external equipment. Anatomical attachments are the front horn, rear horn, left/right ears, four feet, tail base, and tail tip.
- Assumptions:
  - The approved visual represents the canonical adult-like form for this sample.
  - Collision bounds are implementation-dependent and are not finalized by the reference package.
  - Hidden surfaces use the same restrained material family unless contradicted by an approved visible panel.
  - Toe separation is painted rather than modeled as individual toe cubes.
- Forbidden Redesigns:
  - changing species, age/form, horn count, or horn dominance;
  - adding armor, saddle, harness, rider seat, cargo, damage, or fantasy elements;
  - replacing cuboids with mesh, spheres, cylinders, or dense voxel sculpture;
  - narrowing the torso into a horse-like body or lengthening the legs;
  - changing the approved neutral pose or forward direction;
  - introducing a new color variant, PBR material, or Vibrant Visuals dependency.

### Approval Record

- Production Context Status: `APPROVED`
- Reference Visual Status: `APPROVED`
- Technical Package Policy: Auto-generated after visual approval; no additional routine approval required
- Approval Basis: Existing user-approved Black Rhinoceros Golden Sample and current instruction to complete the `.md` and `.json` package according to the one-image skill flow
- Documentation Revision Date: `2026-07-12`

## 2. GEOMETRY

### Context-Derived Geometry Logic

- Functional Geometry Requirements: The model must read immediately as a heavy black rhinoceros from normal gameplay distance and from all five validation views. The silhouette must remain stable without relying on texture-only fake depth.
- Required Separate Groups:
  - `black_rhinoceros_root`
  - `body`
  - `shoulder_mass`
  - `torso_core`
  - `rear_mass`
  - `neck`
  - `head`
  - `muzzle`
  - `horn_front`
  - `horn_rear`
  - `ear_left`
  - `ear_right`
  - `leg_front_left` and `foot_front_left`
  - `leg_front_right` and `foot_front_right`
  - `leg_rear_left` and `foot_rear_left`
  - `leg_rear_right` and `foot_rear_right`
  - `tail_base` and `tail_tip`
- Required Attachment / Seat / Socket Points: Anatomical pivots only. No rider seat, equipment socket, held-item point, or gameplay attachment is required.
- Collision / Hitbox Considerations: Keep the visual envelope suitable for later collision tuning, but do not infer a final hitbox from decorative horn or tail extents. Collision is outside this reference package.
- Ground / Wall / Ceiling Attachment: Four-foot ground attachment only. All feet share `Y = 0`; no wall or ceiling attachment.
- Symmetry and Mirroring Logic: Mirror paired legs and ears around the X centerline. Maintain unique front/rear proportions and distinct horn sizes.
- Hidden Geometry Policy: Avoid fully enclosed decorative cubes. Internal overlap is allowed only when needed to remove visible gaps at body, neck, leg, and tail joints.

### Construction Lock

- Strategy: Smart cuboid construction
- Expected Cuboid Count: `22–32`
- Primary Masses:
  - elevated shoulder block;
  - central torso core;
  - rear/belly mass;
  - short neck transition;
  - sloped head assembly;
  - rectangular muzzle;
  - four leg columns and four hoof blocks.
- Silhouette-Critical Parts:
  - dominant front horn;
  - smaller rear horn;
  - high shoulder ridge;
  - low head angle;
  - broad muzzle;
  - upright ears;
  - thick legs;
  - rear taper;
  - short tail.
- Required Segment Counts:
  - body mass system: `4–6` cuboids;
  - head and muzzle system: `3–5` cuboids;
  - front horn: `3` tapered cuboid segments;
  - rear horn: `2` tapered cuboid segments;
  - each ear: `1–2` cuboids;
  - each leg chain: `1` leg cuboid plus `1` foot cuboid;
  - tail: `2` segments.
- Geometry-Only Features: body masses, head slope, muzzle volume, horns, ears, legs, feet, tail, and major shoulder/rear silhouette breaks
- Texture-Only Features: eyes, nostrils, mouth line, skin folds, wrinkles, scars, subtle muscle shading, toe/hoof split, and small hide variation
- Forbidden Micro-Cube Details: individual wrinkles, nostril cubes, eyelid cubes, toe cubes, scar strips, random hide bumps, or decorative skin plates
- Build Order:
  1. root and coordinate lock;
  2. central torso and global envelope;
  3. shoulder and rear masses;
  4. neck transition, head, and muzzle;
  5. front and rear horns;
  6. ears;
  7. four legs and feet;
  8. tail base and tip;
  9. ground-contact and silhouette correction;
  10. texture preparation without geometry redesign.
- Recommended Hierarchy: Root → body → mass groups / neck / limbs / tail; neck → head → muzzle / horns / ears; each leg → corresponding foot; tail base → tail tip
- Ground Contacts: Four feet, all on `Y = 0`, with no floating corner and no body penetration below the ground plane
- Structural Fingerprint: A long heavy rectangular torso led by a raised shoulder, a low forward-projecting head, one dominant horn followed by a smaller horn, four thick support columns, and a short rear tail
- Risks:
  - over-segmenting hide details into cubes;
  - making the head too narrow or too high;
  - making the front and rear horns equal;
  - losing the shoulder-to-rear height difference;
  - using leg spacing that conflicts with the Front, Back, or Top / Footprint panels;
  - allowing intersecting horns, ears, or legs after pivot placement.

## 3. TEXTURE

### Context-Derived Texture Logic

- Material Behavior Requirements: Opaque, matte, non-metallic hide with restrained plane-to-plane variation. Horns and hooves remain darker and slightly more compact in value range than the hide.
- Readability Priority: Third-person and normal gameplay distance first; facial accents must remain readable without oversized high-contrast marks.
- Directional / Unique Markings: Eyes, nostrils, mouth line, ear interiors, muzzle shading, and horn-tip value progression must follow their correct face orientation.
- Variant Requirements: None. One canonical palette and marking layout only.
- Transparency Requirements: None
- Emissive Requirements: None
- First-Person / Third-Person Texture Priority: Third-person entity readability; first-person-specific texture treatment is not applicable.

### Texture Lock

- Texture Style: `16x` classic pixel art with hard edges and broad low-frequency clusters
- UV Atlas: `128 × 128`
- UV Strategy: Box UV first, selective per-face when justified
- Main Material Families:
  - warm gray-brown hide;
  - darker muzzle/face shadow;
  - dark olive-brown to charcoal horns and hooves;
  - near-black eyes, nostrils, mouth, and ear interiors.
- Base Color Lock: Medium warm gray-brown; do not drift to blue-gray, saturated brown, green, or near-black body coloration
- Critical Pixel Details: one eye per side, nostrils, mouth line, hoof separation, ear interiors, horn value steps, and restrained shoulder/belly shading
- Shared / Mirrored Areas: paired legs, feet, and ears may share or mirror UV regions when visible markings remain consistent
- Unique / Directional Areas: face, muzzle, front/back planes, horn progression, tail tip, and any approved asymmetric shading required by the Reference Visual
- Alpha-Test Zones: None
- Alpha-Blend Zones: None
- Emissive Zones: None
- Pipeline: Classic Bedrock only
- PBR / Vibrant Visuals: Not used
- Risks:
  - high-frequency noise that obscures form;
  - gradients or anti-aliasing that break pixel sharpness;
  - mirrored facial features landing on the wrong face;
  - insufficient contrast between hide and horns/hooves;
  - texture seams across the muzzle, shoulder, or leg fronts;
  - painted fake depth that changes the approved silhouette.

## 4. ANIMATION

### Context-Derived Motion Logic

- Required Animation Families: None in this Golden Sample reference scope
- Required Interactive Motions: None
- Rigid-Part Requirements: All cuboids remain rigid. Horns inherit head motion; feet inherit their leg groups; ears remain discrete rigid parts; tail uses two rigid segments.
- Required Motion Clearances: Head must clear the shoulder and front horn must not clip the muzzle; front/rear legs must clear the belly; tail must clear the rear body and rear legs.
- Root Motion Policy: No root translation or locomotion is authored during the reference stage.
- Seat / Rider / Held-Item Motion Behavior: Not applicable

### Animation Lock

- Animation Included Now: No
- Animation Status: `ANIMATION_SKIPPED`
- Animation-Ready: Yes
- Moving Groups: `head`, four leg groups, four foot groups as leg children, `ear_left`, `ear_right`, `tail_base`, and `tail_tip`
- Static Groups: `black_rhinoceros_root`, body mass groups, neck base during neutral reference, `muzzle` relative to head, and both horns as rigid head children
- Required Pivots:
  - root at the ground-centered model origin;
  - body near the center of the torso mass;
  - head at the neck-to-skull transition;
  - each leg at its body attachment;
  - each foot at its lower-leg connection;
  - each ear at its head attachment;
  - tail base at the rear-body attachment;
  - tail tip at the tail-base end.
- Parent–Child Motion Chains:
  - `black_rhinoceros_root → body → neck → head → muzzle / horn_front / horn_rear / ears`
  - `body → leg_* → foot_*`
  - `body → tail_base → tail_tip`
- Allowed Motion Axes:
  - head: conservative pitch and yaw;
  - legs: primarily forward/back swing around local X;
  - feet: limited corrective rotation inherited from legs;
  - ears: small local tilt;
  - tail: limited side-to-side and vertical motion.
- Neutral Pose Lock: Four feet grounded, head low, horns centered, ears upright, legs near vertical, tail close to the rear body
- Ground-Contact Behavior: Neutral pose must return all four feet to `Y = 0`. No permanent foot sliding, floating, or body-height drift.
- Clipping Risks: Front horn into muzzle, head into shoulder, legs into belly, rear legs into tail, ear bases into head, and feet below the ground plane
- Validation-Critical Motions: Pivot placement, parent-child inheritance, neutral pose recovery, rigid-cuboid preservation, and clipping clearance only; no clip timing or performance validation is required.
