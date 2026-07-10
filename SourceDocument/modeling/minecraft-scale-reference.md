# Minecraft Scale Reference

This is the scale source of truth for Minecraft Bedrock / Blockbench reference planning.

Use this before creating any scale sheet, geometry blueprint, or Codex handoff.

## Core Unit Baseline

| Concept | Correct value | Use |
| --- | ---: | --- |
| 1 full Minecraft block | `16u x 16u x 16u` | Main visual scale anchor |
| 1 half block | `8u` high | Secondary scale anchor |
| Standing player reference | `1.8 blocks = 28.8u` | Relative entity comparison |
| 2-block clearance | `32u` high | Door/tall clearance reference |

`u` means Minecraft / Blockbench model unit in this workflow.

Do not label one Minecraft block as `1u`.

## Source-Backed Rules

Microsoft Bedrock geometry schema describes geometry values such as visible bounds, pivots, rotations, and inflate in model-space units. Custom block documentation describes standard block geometry as `16x16x16` pixels/model units. Therefore this workflow treats a full block as `16u`.

Player height is used as a practical reference target:

```text
1.8 blocks x 16u = 28.8u
```

Use this as a standing player visual comparison, not as a replacement for behavior collision boxes.

## Visual Ratio Checks

When a sheet includes player, block, and asset comparison:

```text
reference block height / player height = 16u / 28.8u = 0.5556
```

So the 16u reference block must appear about 55.56% of the player height.

For an 18u asset:

```text
asset height / reference block height = 18u / 16u = 1.125
asset height / player height = 18u / 28.8u = 0.625
```

So an 18u asset should appear slightly taller than one block and clearly shorter than the player.

## Separate These Concepts

Do not mix these without labels:

- model units: geometry planning values such as 16u, 18u, 28.8u
- texture pixels: atlas resolution such as 16x16, 32x32, 64x64
- visible bounds: render visibility box in model-space units
- collision box: gameplay/physics size in behavior JSON block units
- seat/rider position: gameplay mount placement, not necessarily visual center
- export/render scale: final in-game tuning if the entity needs scale adjustment

## Entity Scale Rules

For Bedrock Entity models:

- Define the visual model envelope first: width, depth, height in `u`.
- Define visible bounds separately from the visual envelope.
- Define collision/hitbox separately from visual bounds.
- Define seat/rider position separately from visual center.
- For floating entities, define hover reference plane separately from ground contact.

The visual model may be taller/wider than the collision box when gameplay needs it, but this must be documented as an approved assumption.

## Scale Sheet Acceptance Criteria

Every scale sheet must show:

- `16u = 1 full Minecraft block`
- reference block labelled `16u x 16u x 16u`
- standing player reference labelled `28.8u = 1.8 blocks` when a player is shown
- asset envelope in `u`: width, depth, height
- all comparison objects drawn to the same visual ratio
- final-enough dimensions for Main Geometry
- dimensions that still need confirmation in Part Breakdown

Fail the sheet if:

- a full block is labelled `1u`
- a 16u block is drawn far smaller than 55.56% of player height
- an 18u asset is drawn almost player-height
- texture pixels are confused with model units
- collision box, visible bounds, and visual model envelope are treated as the same thing

## Codex Handoff Requirement

Every Codex handoff must state:

```text
Scale baseline:
- 1 Minecraft block = 16u
- Player reference = 28.8u high = 1.8 blocks
- Asset envelope = [width]u W x [depth]u D x [height]u H
- Collision / visible bounds / rider seat are not finalized unless explicitly listed.
```
