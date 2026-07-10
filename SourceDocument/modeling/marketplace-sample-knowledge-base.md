# Marketplace Sample Knowledge Base

This document distills general marketplace-quality patterns from the local sample packs.

Use it as quality intelligence only. Do not copy mesh, texture, UV layout, names, exact designs, or product identity from any sample.

Sample source:

```text
D:\Research\Maps Browser\Sample Marketplace
```

Observed scope:

```text
30 marketplace packs
40,505 files
1,844 geometry files
6,125 client entity JSON files
1,465 animation JSON files
921 animation controllers
951 render controllers
705 attachables
19,087 textures
```

## General Entity Lessons

- Bedrock Entity is used for creatures, props, projectiles, furniture-like objects, vehicles, armor displays, weapons, effects, NPCs, and static displays.
- Marketplace-grade entity work usually includes geometry, texture, render controller, and often animation/script/spawn-egg wiring.
- Even when animation is out of scope, geometry should remain animation-ready through clean pivots and parent groups.

## Geometry Budget Baseline

Most marketplace geometry is not extremely high cube count.

Observed cube count distribution:

```text
1-2 cubes      very simple projectile/effect/prop
3-8 cubes      simple prop
9-20 cubes     common small entity or prop
21-50 cubes    common medium marketplace model
51-100 cubes   detailed entity/vehicle/armor/prop
101+ cubes     complex showcase, boss, dragon, large scene prop
```

Default planning guide:

```text
Tiny / projectile / effect: 1-8 cubes
Simple prop entity: 9-20 cubes
Medium entity or prop: 21-50 cubes
Detailed creature / armor / vehicle: 51-100 cubes
Boss / dragon / showcase: 101+ cubes only when justified
```

Cube count is not the quality goal. Use more cubes only when they improve silhouette, structure, attachment, pivot, gameplay readability, or focal identity.

## Bone And Pivot Baseline

Observed bone count distribution:

```text
1 bone        tiny/simple props
2-5 bones     simple entities or grouped props
6-15 bones    small/medium entities
16-40 bones   common marketplace entity range
41-100 bones  complex armor, vehicle, creature, or boss
101+ bones    large showcase or highly articulated assets
```

Common production patterns:

- Nearly every model has pivots.
- Rotated bones, mirrored cubes, inflate, and locators are normal marketplace tools.
- Bone names are usually functional, not decorative.

Preferred naming style:

```text
root / main
body / torso / waist
head
left_arm / right_arm
left_leg / right_leg
tail / wing / fin
weapon / prop / projectile
cloth / armor / accessory
effect / glow / flame
```

## Texture And Atlas Baseline

Important term split:

- Atlas size means the texture image canvas: `64x64`, `128x128`, `256x256`, `512x512`.
- Pixel style means the visual density: default Minecraft `16x style` or cleaner `32x style`.
- Do not confuse atlas size with pixel style.

Observed geometry texture sizes were most commonly:

```text
64x64
128x128
32x32
256x256
16x16
512x512+
```

Planning guide:

```text
64x64      small entity, simple weapon, simple prop
128x128    medium entity/prop baseline, humanoid, armor, detailed item
256x256    vehicle, large prop, complex armor, high-detail creature
512x512+   boss, dragon, large showcase entity, many material zones
```

Texture size must follow visible complexity, material count, and focal detail. Do not force one atlas size for every asset.

## Category Rules

### Creature / Dinosaur / Animal

- Prioritize body mass, head, limbs, tail, wing/fin continuity.
- Front and side silhouettes must pass before detail.
- Animation-ready pivots matter even before animation.
- Texture handles skin patterns, scales, fur, scars, stripes, and small claws unless they change silhouette.

### Dragon / Boss / Showcase

- Use higher atlas only when justified by size, materials, or focal detail.
- Separate major animation groups early: body, head, jaw, wings, limbs, tail, effect parts.
- Do not add spikes, scales, or ornament as cube spam if texture can carry them.

### Weapon / Armor / Equipment Entity

- Profile silhouette is the first priority.
- Grip/socket/attachment points must be explicit.
- Ornament, engravings, scratches, edge wear, runes, and color bands are texture-first.
- Bone hierarchy should support holding, display, attachable, or animation use.

### Furniture / Static Display Entity

- Treat as Bedrock Entity display prop unless explicitly overridden.
- Start from axis-aligned major masses.
- Use material blocks and silhouette edges for geometry.
- Use texture for trim, seams, fabric pattern, scratches, labels, and panels.

### Vehicle / Mech

- Plan repeated parts and symmetry before geometry.
- Wheels, joints, doors, turrets, limbs, or cockpit pieces need clear parent groups.
- Larger atlas is usually justified by material zones and focal panels.
- Avoid unparented floating mechanical pieces.

### Projectile / Effect / Small Pickup

- Keep geometry very small.
- Texture carries identity.
- Use 16x16 or 32x32 unless the effect has a strong visible form.
- Do not over-model particles, glow pixels, sparks, or trails.

## Reference Requirements For ChatGPT

Every marketplace-grade reference package should include:

- orthographic views with consistent proportions,
- scale sheet with player/block/item comparison,
- silhouette sheet with gameplay-distance readability,
- part breakdown with parent/attachment/pivot notes,
- color palette and material families,
- texture reference with gradient/material depth,
- close-up sheet for focal detail,
- do/don't sheet for common quality failures,
- valid `reference_manifest.json`,
- Geometry Blueprint table,
- Negative Geometry Constraints,
- View Consistency status.

## Codex Requirements Before Main Geometry

Codex should verify:

```text
category selected:
atlas size justified:
cube budget selected:
bone budget selected:
scale envelope complete:
front/side silhouette clear:
part build order complete:
major part bounding boxes complete:
attachment/pivot plan complete:
texture-only detail list complete:
marketplace do/don't risks complete:
```

If any item is missing, stay in Reference Collection.

## Anti-Patterns

Block these before progression:

- copying sample mesh or texture,
- starting from detail instead of silhouette,
- using many tiny cubes for scratches, seams, fur, glow, cracks, wrinkles, runes, or fabric weave,
- floating accessories without parent/attachment logic,
- one atlas size for every asset,
- unclear front direction,
- no side-view depth proof,
- no pivot plan for animation-ready parts,
- flat single-color large surfaces in texture phases,
- broad redesign during polish.

## Acceptance Criteria

- Marketplace samples are used as generalized quality intelligence.
- All new assets target marketplace-grade quality by default.
- Category, atlas, cube, bone, and texture decisions are explicit before Main Geometry.
- No sample is copied directly.
