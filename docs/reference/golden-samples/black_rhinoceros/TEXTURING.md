# Black Rhinoceros — TEXTURING

**Decision Authority:** `PRODUCTION_CONTEXT.md`  
**Visual Authority:** `black_rhinoceros_reference_visual.png`  
**Pipeline:** Classic Minecraft Bedrock only  
**PBR / Vibrant Visuals:** Not used  
**Derivation Rule:** Derive color, pattern, material separation, and visible shading from the approved image without changing the approved geometry or silhouette.

## 1. Texture System

- Texture Style: `16x` classic Minecraft pixel art
- UV Atlas: `128 × 128`
- UV Strategy: Box UV first with selective per-face UV only where identity, direction, seam control, or pixel placement requires it
- Box UV Default: Required for the main torso masses, neck, leg columns, feet, and simple tail segments
- Selective Per-Face Use: Allowed for the head, muzzle, horns, ears, eye zones, nostril/mouth zones, hoof accents, and seam-sensitive transitions
- Texel Density: Target approximately `16 texels per block` on primary visible surfaces; minor parts may use a lower effective density only when their features remain pixel-sharp and consistent
- Pixel-Perfect: Required
- Anti-Aliasing: Forbidden
- Filtering: Nearest-neighbor / no smoothing
- Palette Size Target: Approximately `18–28` purposeful colors across all material families; avoid uncontrolled near-duplicate noise colors
- Texture File Format: `.png`, RGBA-compatible but used as fully opaque for this asset
- Texture Count: One primary atlas preferred; additional maps are forbidden
- Color Space Intent: Standard non-PBR color texture
- Gradient Rule: No smooth gradients; use stepped pixel clusters and plane-aware value changes

## 2. Visual Color Locks

- Base Color Family: Medium warm gray-brown hide
- Deep Shadow Family: Charcoal brown / dark umber-gray
- Shadow Family: Muted dark taupe
- Light Family: Desaturated beige-gray
- Highlight Family: Restrained warm stone-gray
- Accent Colors:
  - dark olive-brown to charcoal for horns and hooves;
  - near-black for eyes, nostrils, mouth line, and ear interiors.
- Approximate Working Palette:
  - Hide deep shadow: `#3A352E`
  - Hide shadow: `#514A40`
  - Hide dark base: `#62594C`
  - Hide base: `#756B5B`
  - Hide light: `#8E8270`
  - Hide highlight: `#A79A85`
  - Muzzle shadow: `#463F36`
  - Horn/hoof deep: `#26251F`
  - Horn/hoof shadow: `#38362D`
  - Horn/hoof base: `#504B3E`
  - Horn/hoof light: `#6B6351`
  - Facial near-black: `#171714`
- Palette Interpretation: Hex values are implementation targets derived from the approved visual, not permission to recolor the asset. Adjust only enough to match the actual Reference Visual under nearest-neighbor display.
- Areas That Must Not Drift:
  - body hide must remain warm gray-brown;
  - horns and hooves must remain visibly darker than hide;
  - muzzle may be slightly darker but must remain in the same material family;
  - eyes, nostrils, mouth, and ear interiors must remain compact near-black accents.
- Forbidden Color Changes:
  - blue-gray body;
  - saturated brown/orange body;
  - green hide;
  - black body with lost plane readability;
  - ivory/white horns;
  - bright saturated accent colors;
  - metallic, glossy, wet, or emissive appearance.

## 3. Material Palette

| Material / Zone | Deep Shadow | Shadow | Base | Light | Highlight | Visual Source Panel |
|---|---|---|---|---|---|---|
| Main hide | `#3A352E` | `#514A40` | `#756B5B` | `#8E8270` | `#A79A85` | All five panels |
| Shoulder / torso shade | `#35312B` | `#4A443A` | `#675E50` | `#817665` | `#978B78` | Left Side, Front-left 3/4 |
| Head / muzzle | `#302D27` | `#463F36` | `#62584B` | `#7A6E5E` | `#8E806D` | Left Side, Front, Front-left 3/4 |
| Horns | `#24231E` | `#35332B` | `#4C483B` | `#655E4D` | `#7A725E` | Left Side, Front, Top / Footprint, Front-left 3/4 |
| Hooves | `#20201C` | `#302F28` | `#454238` | `#5A5548` | `#6B6555` | Left Side, Front, Back, Front-left 3/4 |
| Ear interiors | `#171714` | `#29261F` | `#3E382F` | `#51493D` | `#62584B` | Front, Back, Front-left 3/4 |
| Eyes / nostrils / mouth | `#0F0F0E` | `#171714` | `#20201C` | `#2B2924` | `#36322B` | Left Side, Front, Front-left 3/4 |
| Tail tip | `#24221E` | `#35312A` | `#4B4439` | `#5D5447` | `#6E6454` | Left Side, Back, Front-left 3/4 |

## 4. Material Zones

### Main Hide — Shoulder, Torso, Rear Mass, and Legs

- Geometry Group: `shoulder_mass`, `torso_core`, `rear_mass`, four leg groups
- Visual Source Panels: All five panels
- Base Material: Matte warm gray-brown hide
- Pattern / Direction: Broad low-contrast clusters; larger clusters on torso planes and smaller restrained clusters on legs
- Shading Intention: Plane-aware value shifts with the top slightly lighter, side planes mid-value, and undersides darker; do not bake dramatic directional lighting
- Edge Treatment: Hard pixel edges with no outline unless a one-pixel dark separation is required at a joint
- Mirrored / Unique: Paired legs may mirror; body planes should not repeat an obvious tile pattern
- Seam Sensitivity: High at shoulder-to-torso, torso-to-rear, belly, and leg attachment zones
- Opacity Mode: Opaque
- Emissive: No
- Risks: Repetitive checker noise, visible atlas tiling, over-dark belly, or highlights that imply gloss

### Head and Muzzle

- Geometry Group: `head`, `muzzle`, `neck`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Base Material: Slightly darker version of the hide family
- Pattern / Direction: Directional facial placement with controlled muzzle darkening and minimal mottling
- Shading Intention: Preserve broad skull planes and muzzle separation; emphasize shape through small value steps rather than fake depth
- Edge Treatment: Crisp mouth and nostril pixels; avoid thick cartoon outlines
- Mirrored / Unique: Base side shading may mirror, but eye/nostril/mouth placement must be authored per visible face orientation
- Seam Sensitivity: Very high across head-to-muzzle, head-to-neck, and front-to-side faces
- Opacity Mode: Opaque
- Emissive: No
- Risks: Misaligned eye, nostril repeated on side faces, oversized mouth line, or a muzzle that appears detached

### Horns

- Geometry Group: `horn_front`, `horn_rear`
- Visual Source Panels: Left Side, Front, Top / Footprint, Front-left 3/4
- Base Material: Dark olive-brown / charcoal keratin-like pixel material
- Pattern / Direction: Value bands follow the segment taper from darker base to restrained lighter upper planes; tips remain dark or mid-dark rather than white
- Shading Intention: Separate horn segments and direction while keeping a matte Minecraft appearance
- Edge Treatment: Hard stepped values; no glossy streaks
- Mirrored / Unique: Each horn is unique because size and segment count differ
- Seam Sensitivity: High at segment overlaps and horn-to-head bases
- Opacity Mode: Opaque
- Emissive: No
- Risks: Equalizing horn values until segment structure disappears, white tips, or metallic contrast

### Hooves

- Geometry Group: `foot_front_left`, `foot_front_right`, `foot_rear_left`, `foot_rear_right`
- Visual Source Panels: Left Side, Front, Back, Front-left 3/4
- Base Material: Dark charcoal-brown hoof
- Pattern / Direction: Minimal value variation; front faces carry a restrained toe/hoof split
- Shading Intention: Read as darker terminal foot blocks without appearing like separate boots
- Edge Treatment: One-pixel separation lines only where enough texel area exists
- Mirrored / Unique: Front pair may share; rear pair may share; front/rear UVs may differ to maintain silhouette and face orientation
- Seam Sensitivity: Medium at leg-to-foot boundary
- Opacity Mode: Opaque
- Emissive: No
- Risks: Toe lines too bright, feet reading as shoes, or loss of ground-contact edge

### Ears and Tail

- Geometry Group: `ear_left`, `ear_right`, `tail_base`, `tail_tip`
- Visual Source Panels: Front, Back, Left Side, Top / Footprint, Front-left 3/4
- Base Material: Main hide family with darker interior/tip accents
- Pattern / Direction: Ears receive a compact inner dark patch; tail tip receives a small darker terminal patch
- Shading Intention: Maintain part separation at small scale without thick outlines
- Edge Treatment: Crisp one- or two-pixel accents
- Mirrored / Unique: Ears may mirror; tail remains unique
- Seam Sensitivity: High at ear bases; medium at tail joint
- Opacity Mode: Opaque
- Emissive: No
- Risks: Ear interior bleeding across exterior faces or tail tip appearing oversized

### Facial Accents

- Geometry Group: Texture-only details on `head` and `muzzle`
- Visual Source Panels: Left Side, Front, Front-left 3/4
- Base Material: Near-black compact accents
- Pattern / Direction: One eye per side, paired nostrils on appropriate muzzle faces, and a restrained mouth line
- Shading Intention: Identity/readability only; no cartoon expression or glowing eyes
- Edge Treatment: Single-pixel or two-pixel clusters, depending available UV area
- Mirrored / Unique: Eye placement mirrors left/right; front nostrils are paired; mouth line follows the correct lower side/front faces
- Seam Sensitivity: Very high
- Opacity Mode: Opaque
- Emissive: No
- Risks: Eyes placed too high, duplicated facial features, or line thickness changing the perceived muzzle shape

## 5. UV Strategy

### Box UV Areas

- `shoulder_mass`
- `torso_core`
- `rear_mass`
- `neck`
- four leg columns
- four foot blocks when toe pixels fit correctly
- `tail_base`
- `tail_tip`

Use Box UV to preserve stable texel density and simplify mirrored paired parts. Keep cube inflation disabled unless required for export compatibility.

### Selective Per-Face Areas

- `head` for eye placement and side/front distinction
- `muzzle` for nostrils and mouth line
- `horn_front` and `horn_rear` for directional value bands
- `ear_left` and `ear_right` for dark interiors
- foot front faces when toe/hoof separation requires exact placement
- any seam-sensitive shoulder or rear transition that cannot remain clean under default Box UV

### Shared / Mirrored Areas

- left/right front legs may share a mirrored island set;
- left/right rear legs may share a mirrored island set;
- left/right feet may share within the corresponding front/rear pair;
- ears may mirror if interior placement stays on the inward-facing plane;
- simple body underside faces may reuse non-directional hide patches when seams remain invisible.

### Unique / Directional Areas

- left and right head side faces with correct eye positions;
- muzzle front and side faces;
- horn front/rear segment progression;
- torso front/back planes;
- tail tip;
- any visible face with approved directional shading that would reverse incorrectly under mirroring.

### Seam-Sensitive Areas

- head-to-muzzle junction;
- head-to-neck junction;
- shoulder-to-torso boundary;
- torso-to-rear boundary;
- horn segment overlaps;
- ear bases;
- leg-to-foot transitions;
- top-to-side edges on the broad torso where obvious repeating patterns can expose the seam.

### Atlas Packing Rules

- Keep at least one texel of padding around manually placed islands.
- Do not overlap islands except intentionally mirrored/shared regions.
- Reserve contiguous facial space before packing low-priority underside faces.
- Keep horn islands separated from hide islands to prevent accidental palette bleeding.
- Prefer readable island grouping by material family.
- Do not scale a critical face below the pixel budget listed in Section 6.

## 6. Critical Pixel Details

### Eyes

- Geometry Face: Left and right outer head side faces
- Visual Source Panel: Left Side and Front-left 3/4; symmetry verified by Front
- Available Texel Area: Preserve at least `6 × 6` texels per side-face region around the eye
- Pixel Budget: Eye mark approximately `2 × 2` to `3 × 3` pixels including its darkest core and optional one-pixel brow shadow
- Placement: Upper-middle side of the head, behind the horn line and above the muzzle
- Mirroring: Mirror placement, not the entire directional side-face island when it reverses other shading
- Contrast Requirement: Clearly readable against hide without a white sclera or bright outline
- Material Behavior: Opaque near-black
- Risks: Eye too large, too high, too forward, or duplicated on front/back faces

### Nostrils

- Geometry Face: Front/upper-side muzzle faces as supported by UV orientation
- Visual Source Panel: Left Side, Front, Front-left 3/4
- Available Texel Area: At least `5 × 4` texels per nostril region
- Pixel Budget: `1 × 2`, `2 × 2`, or restrained L-shaped near-black cluster
- Placement: Near the forward muzzle corners, symmetrically paired
- Mirroring: Allowed with correct face orientation
- Contrast Requirement: Dark enough to read, but not large enough to look like holes cut through geometry
- Material Behavior: Opaque near-black
- Risks: Placement on the wrong face or excessive size

### Mouth Line

- Geometry Face: Lower side/front muzzle faces
- Visual Source Panel: Left Side and Front-left 3/4
- Available Texel Area: Continuous horizontal region of at least `8–14` texels
- Pixel Budget: One-pixel-thick broken or stepped line
- Placement: Low on the muzzle, following the approved mouth angle
- Mirroring: Side treatment may mirror; front joining pixels must remain coherent
- Contrast Requirement: Subtle but readable
- Material Behavior: Opaque dark brown/near-black
- Risks: Thick outline, smile expression, or line crossing UV seams

### Hoof Separation

- Geometry Face: Front and side faces of all feet
- Visual Source Panel: Front, Back, Left Side, Front-left 3/4
- Available Texel Area: At least `6 × 4` texels on each principal foot face
- Pixel Budget: One-pixel vertical or stepped separation marks; no modeled toes
- Placement: Lower/front foot faces, aligned consistently across the pair
- Mirroring: Allowed by front/rear pair
- Contrast Requirement: Low-to-medium contrast within the dark hoof family
- Material Behavior: Opaque
- Risks: Reading as bright shoe laces or splitting the foot into too many toes

### Ear Interiors

- Geometry Face: Inward/front-facing ear planes
- Visual Source Panel: Front and Front-left 3/4
- Available Texel Area: At least `3 × 5` texels per ear
- Pixel Budget: `1–2` pixel dark inset with hide-colored border retained
- Placement: Centered within the visible ear plane
- Mirroring: Allowed when the interior remains inward-facing
- Contrast Requirement: Medium-to-high, but contained
- Material Behavior: Opaque
- Risks: Dark color wrapping around the entire ear

### Horn Value Progression

- Geometry Face: Main visible faces of each horn segment
- Visual Source Panel: Left Side, Front, Top / Footprint, Front-left 3/4
- Available Texel Area: Minimum `3` texels across each segment's widest face
- Pixel Budget: Two to four stepped values per horn, with each segment remaining distinct
- Placement: Darker base/underside, restrained lighter upper/forward plane, compact darker tip if supported by the visual
- Mirroring: Not applicable; horns are unique centerline parts
- Contrast Requirement: Enough to preserve taper without appearing striped
- Material Behavior: Opaque matte
- Risks: White tips, metallic bands, or excessive striping

## 7. Classic Bedrock Material Rules

- Opaque Zones: Entire asset
- Alpha-Test Zones: None
- Alpha-Blend Zones: None
- Emissive Zones: None
- Transparent Emissive Zones: None
- PBR Maps: Forbidden
- Vibrant Visuals Materials: Forbidden
- Normal Maps: Forbidden
- Metallic Maps: Forbidden
- Roughness Maps: Forbidden
- Height/Parallax Maps: Forbidden
- Material Instance Dependency: Forbidden

## 8. Texture QA Targets

- Palette Comparison:
  - body remains within the approved warm gray-brown family;
  - horns and hooves remain darker than hide;
  - facial accents remain near-black and compact;
  - no unapproved saturated or cool color drift.
- View-by-View Material Comparison:
  - Left Side: eye, muzzle, horn values, hoof separation, and body mottling match the approved read;
  - Front: paired eyes/nostrils/ears and centered horn values remain coherent;
  - Back: rear mass, tail, rear legs, and hoof values remain balanced;
  - Top / Footprint: top-plane light values do not flatten shoulder/head separation;
  - Front-left 3/4: all material zones remain consistent across adjacent faces.
- UV Seam Inspection: No visible hard seam at head/muzzle, neck/shoulder, torso/rear, horn segments, ear bases, or leg/foot boundaries
- Pixel-Art Sharpness: Nearest-neighbor appearance with no blur, anti-aliasing, compression halo, or smooth gradient
- Alpha Inspection: Atlas contains no required transparency; unexpected transparent pixels are a failure
- Emissive Inspection: No emissive material, emissive texture, or glow behavior exists
- Atlas Inspection: Exactly `128 × 128`, valid PNG, no accidental overlap outside approved mirrored regions, and at least one-pixel padding around manual islands
- Failure Conditions:
  - body color no longer matches the Reference Visual;
  - high-frequency random noise obscures form;
  - facial details land on wrong faces or become oversized;
  - horns/hooves are not visually distinct from hide;
  - visible UV seams or stretched critical pixels;
  - blurred or anti-aliased output;
  - unapproved alpha, emissive, PBR, or Vibrant Visuals content;
  - texture work changes or compensates for incorrect geometry instead of reporting the geometry issue.


## Deterministic Texture Quality Contract

The manifest enforces the current Texture quality policy before review:

- anti-aliasing is forbidden;
- partial alpha ratio must remain `0`;
- visible atlas coverage must be at least `0.5%`;
- unique colors must not exceed `96`;
- visible pixels are compared against the approved palette with maximum color distance `72` and maximum outlier ratio `20%`;
- atlas dimensions, UV bounds, PBR absence, and current evidence hashes are mandatory.

`record_stage_review_report` cannot replace these checks; `validate_reference_contract` must pass before `submit_stage_for_review`.
