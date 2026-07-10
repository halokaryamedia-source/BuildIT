# Ninja Samurai Enemy Reference Package Plan

Status: Draft.

Use this file to control the package before modelling starts.

## Target Source

```text
SavedData/sessions/ninja-samurai-enemy/source/uploaded_samurai_reference.png
```

## Ground Truth

- Format: Minecraft Bedrock Entity reference package.
- Source texture resolution: not applicable; uploaded image is realistic inspiration only.
- UV atlas target: 256x256.
- Texture style: 32x32 pixel style.
- Measured or intended bounds: player-sized, around Steve height.
- Role: enemy mob.
- Animation need: no animation for now.
- Weapon: katana held in hand.

## Conversion Rule

The source image is not Minecraft style. Every sheet must convert it into original Minecraft / Blockbench cuboid style.

Required conversion logic:

```text
SourceDocument/modeling/minecraft-style-image-conversion-preflight.md
SourceDocument/modeling/minecraft-style-image-conversion-rules.md
SourceDocument/modeling/minecraft-style-image-conversion-mandatory-prompt.md
```

The preflight must be filled before generation. The mandatory prompt must then be used verbatim for the first style-conversion showcase. Append only this asset lock:

- Subject: armored ninja/samurai enemy.
- Scale: player-sized.
- Texture style: 32x32 pixel-art logic.
- Atlas target: 256x256.
- Required weapon: katana held in hand.

Use:

- horned helmet silhouette,
- shoulder armor,
- chest armor,
- waist cloth,
- leg armor,
- boots,
- katana in hand,
- dark armor with gold/red/cyan accent potential.

Do not copy:

- realistic human face,
- exact armor ornament,
- exact historical design identity,
- exact pose,
- tiny studs/laces as geometry,
- high-poly or painterly details.

## Required Outputs

| Order | Image | Notes | Status |
| --- | --- | --- | --- |
| 01 | `01_ninja_samurai_enemy_orthographic_views.png` | `01_ninja_samurai_enemy_orthographic_views.notes.md` | Draft |
| 02 | `02_ninja_samurai_enemy_scale_sheet.png` | `02_ninja_samurai_enemy_scale_sheet.notes.md` | Draft |
| 03 | `03_ninja_samurai_enemy_silhouette_sheet.png` | `03_ninja_samurai_enemy_silhouette_sheet.notes.md` | Draft |
| 04 | `04_ninja_samurai_enemy_part_breakdown_sheet.png` | `04_ninja_samurai_enemy_part_breakdown_sheet.notes.md` | Draft |
| 05 | `05_ninja_samurai_enemy_color_palette_sheet.png` | `05_ninja_samurai_enemy_color_palette_sheet.notes.md` | Draft |
| 06 | `06_ninja_samurai_enemy_closeup_detail_sheet.png` | `06_ninja_samurai_enemy_closeup_detail_sheet.notes.md` | Draft |
| 07 | `07_ninja_samurai_enemy_execution_target_sheet.png` | `07_ninja_samurai_enemy_execution_target_sheet.notes.md` | Draft |
| 08 | `08_ninja_samurai_enemy_animation_pivot_sheet_optional.png` | `08_ninja_samurai_enemy_animation_pivot_sheet_optional.notes.md` | Optional |

## Sheet Purpose

- Sheet 01: Minecraft-style orthographic form conversion.
- Sheet 02: player-height scale, 256x256 atlas, 32x32 texture style.
- Sheet 03: readable ninja/samurai enemy silhouette.
- Sheet 04: head, body, lower body, katana, and armor part breakdown.
- Sheet 05: palette and texture placement.
- Sheet 06: close-up detail targets for helmet, face/mask, shoulder armor, chest, waist cloth, katana, boots.
- Sheet 07: DO-only execution target for Codex.
- Sheet 08: optional pivot overview only if animation readiness becomes required.

## Geometry vs Texture Lock

Build as geometry:

- helmet mass and horns,
- shoulder armor,
- torso/chest armor,
- waist cloth mass,
- leg armor,
- boots,
- katana blade and handle,
- broad arm/hand pose holding katana.

Keep as texture:

- engravings,
- cloth patterns,
- small laces,
- gold trim,
- tiny studs,
- face detail,
- blade wrap detail,
- small scratches and metal shine.

## Shared Sheet Style

- Same header pattern on every sheet.
- `SHEET ##` in the top-right corner.
- Clean white/off-white background.
- Thin dividers and bold uppercase section labels.
- Minimal text on images; detailed interpretation belongs in `.notes.md`.
- Minecraft / Blockbench cuboid style must be obvious.

## Acceptance Rule

Do not start Blockbench modelling until:

- required sheets are approved.
- every required image has matching notes.
- `reference_manifest.json` is valid.
- `CODEX_REFERENCE_HANDOFF.md` exists.
- scale, atlas target, and texture style are locked.
- geometry-level and texture-only details are separated.
