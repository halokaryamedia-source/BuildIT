# Blockbench Scale Rules

Read `minecraft-scale-reference.md` first when available. That document is the source of truth for units and ratios.

## Minecraft Scale References

- One full Minecraft block is `16u x 16u x 16u`.
- `u` means Minecraft model unit / Blockbench model unit for planning.
- Player standing height reference is `1.8 blocks = 28.8u`.
- A 1-block-high visual reference cube must be `16u` tall, about 55.56% of a `28.8u` player reference.
- Player height is the main entity comparison reference, but the reference cube is the scale anchor.
- Items should remain readable in hand, inventory, and dropped states.
- Blocks should align to expected Minecraft grid proportions unless the brief says otherwise.
- Entities should keep proportions understandable from normal gameplay camera distance.

## Hard Unit Rules

| Reference | Blocks | Model units |
| --- | ---: | ---: |
| Full block | 1.0 | 16u |
| Half block | 0.5 | 8u |
| Player height reference | 1.8 | 28.8u |
| Two-block doorway clearance | 2.0 | 32u |

Rules:

- Never label a Minecraft block as `1u`.
- Never draw a 16u block as a tiny prop next to a 28.8u player.
- If a sheet shows a player, a 16u reference block, and an asset, their visual heights must match the unit ratios.
- For an 18u asset, show it as slightly taller than a 16u block and clearly shorter than a 28.8u player.
- If the asset is an entity, separate visual model size from gameplay hitbox, collision, and ride position.

## Item, Entity, and Block Proportion Rules

- Items: prioritize silhouette and inventory readability.
- Blocks: avoid oversized detail that breaks grid expectations.
- Entities: define height, width, and key pivots before modelling.
- Props: define whether the asset behaves like a block, item, or entity.
- Rideable entities: define seat position, rider clearance, hover/contact plane, and visual center separately.
- Floating entities: define hover reference plane separately from physical ground contact.

## Scale Sheet Requirements

Every scale sheet must include:

- unit definition: `16u = 1 full Minecraft block`
- player reference: `28.8u = 1.8 blocks`
- reference block: `16u x 16u x 16u`
- asset envelope: width, depth, height in `u`
- visual comparison drawn to the same unit ratio
- separate labels for visual envelope, visible bounds, collision/hitbox, and rider/seat position when relevant
- note whether dimensions are proportional planning targets or final export scale
- list of dimensions final enough for Main Geometry
- list of dimensions that need confirmation in Part Breakdown

Fail the sheet if:

- the block is labelled as `1u`
- the block is visually far smaller than 55% of player height
- player, block, and asset are not drawn to the same scale
- the sheet mixes `block`, `u`, pixel, and export scale without defining them

## Texture Size Rules

- Use 16x for vanilla-like or low-detail assets.
- Use 32x when the asset needs clearer decorative detail.
- Use 64x only when the target platform and brief justify higher detail.
- Avoid mixing texture sizes without a clear reason.

## UV and Size Cautions

- Avoid stretched UVs.
- Avoid oversized models unless explicitly required.
- Keep pixel density consistent across visible faces.
- Recheck proportions after export.

## Acceptance Criteria

- Scale is documented against Minecraft block or player reference.
- Texture size is selected and justified.
- UV stretching is checked.
- Oversized dimensions are approved or corrected.
- Item/entity/block category rules are applied.
