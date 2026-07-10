# Minecraft Style Image Conversion Preflight

## Required Input

- Source image path: `C:/Users/Administrator/Downloads/Samurai-Sample-NonMinecraft.png`
- Target asset name: Ninja Samurai Enemy
- Target category: Minecraft Bedrock Entity
- Target scale: player-sized, around Steve height
- Texture style: 32x32 pixel-art logic
- Atlas target: 256x256
- Required weapon/prop: katana held in hand

## 1. Subject Type

- Subject type: humanoid armored enemy character
- Why this type: the source is a samurai/ninja warrior with helmet, armor, stance, and katana.

## 2. Recognition Features

- Horned samurai helmet with large crest.
- Dark armor with gold trim.
- Broad shoulder armor.
- Chest armor and central ornament.
- Red waist cloth / sash.
- Armored skirt and leg plates.
- Boots and lower leg wraps.
- Katana held in hand.
- Small teal/cyan accent details.
- Imposing enemy stance.

## 3. Source Design Analysis

- Main silhouette: wide horned helmet, broad shoulders, armored torso, hanging waist armor, strong legs, katana on one side.
- Proportions: player-height humanoid, broad upper body, layered armor, heavy lower armor.
- Pose or stance: strong forward-facing enemy stance with katana held upright.
- Largest shape masses: helmet, horns, shoulder armor, torso armor, waist cloth, leg armor, boots, katana.
- Iconic features: horned helmet, gold crest, red sash, dark armor, katana.
- Accessories / weapons: katana, armor cords, gold trim, teal/cyan ornaments.
- Main palette: black/dark gray armor, gold trim, red cloth, muted teal/cyan accents, small skin/mask area.
- Material zones: metal armor, cloth sash, leather/boots, blade/handle, accent gems.
- Mood / personality: elite armored ninja/samurai enemy, premium marketplace-style enemy mob.

## 4. Blockbench Model Groups

- head / mask
- helmet shell
- horn / crest assembly
- torso armor
- shoulder armor left/right
- arms and bracers
- waist sash
- hanging waist armor panels
- legs and shin armor
- boots
- katana blade
- katana handle / guard

## 5. Detail Classification

Silhouette-critical geometry:

- helmet shell
- large horns
- gold crest ring/block
- shoulder plates
- torso armor mass
- waist armor panels
- leg armor
- boots
- katana blade and handle

Secondary form cuboids:

- armor bands
- bracers
- shin guards
- sash volume
- scabbard-like side shapes
- helmet layers
- chest plate layers

Texture-only surface details:

- engravings
- fabric motifs
- stitches
- laces
- tiny studs
- scratches
- small gold ornaments
- teal/cyan inlays
- fine face details
- blade handle wrap detail

## 6. Geometry Conversion Plan

- Large cuboids: torso, helmet, shoulders, waist panels, legs, boots.
- Long cuboids: katana blade, horns, arm armor, leg armor strips.
- Limited rotated cuboids: horns, katana angle, shoulder plates, waist cloth flaps.
- Attachment risks: horns must attach to helmet, katana must attach to hand, waist panels must attach to belt/torso.
- Micro-geometry to avoid: tiny studs, lace knots, metal engravings, cloth motifs, small trim.

## 7. Detail Budget

- Geometry budget: medium humanoid enemy, broad readable cuboids only.
- Texture detail budget: 32x32 style; use larger motifs and sparse accents.
- Must simplify: realistic face, dense armor engravings, many studs, rope/lace details, complex textile patterns.

## 8. Pixel-Art Texture Logic

- Pixel style: 32x32 pixel-art logic.
- Material shading: stepped dark armor, gold trim, red cloth, muted teal/cyan accents.
- Accent policy: gold and cyan are accents only; dark armor remains dominant.
- Noise control: no random mottled texture; use deliberate bands, blocks, and simple motifs.

## 9. Pattern Simplification

- Patterns to preserve: gold trim, red sash, teal/cyan armor inlays, dark metal panels.
- How to simplify: use blocky bands, square inlays, simple cross/stripe motifs, broad shade clusters.
- Patterns to remove: realistic fabric waves, tiny studs, fine engravings, skin pores, complex lace knots.

## 10. Asset-Specific Prompt Lock

Append this after `minecraft-style-image-conversion-mandatory-prompt.md`:

```text
Image A is the uploaded samurai warrior reference.
Target asset: original Minecraft-style Ninja Samurai Enemy.
Category: Minecraft Bedrock Entity.
Scale: player-sized, around Steve height.
Texture style: 32x32 pixel-art logic.
Atlas target: 256x256.
Required prop: katana held in hand.
Preserve: horned samurai helmet, gold crest, dark armor, shoulder plates, chest armor, red waist cloth, armored skirt panels, leg armor, boots, katana, gold trim, teal/cyan accent pixels, imposing enemy stance.
Do not copy realistic face or exact ornamentation. Convert into practical Blockbench cuboid model language.
```

## 11. Generation Permission

- Subject identity is clear: yes.
- Geometry vs texture split is clear: yes.
- Style target is Minecraft / Blockbench, not generic voxel art: yes.
- Showcase output format is selected: yes.
- No required field is unknown: yes.

Status: PASS
