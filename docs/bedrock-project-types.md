# Bedrock Project Types

BuildIT currently supports two project types only: Bedrock Entity and Bedrock Block.

## Bedrock Entity

Use Bedrock Entity for Minecraft Bedrock entity models.

Examples:

- mobs
- creatures
- companions
- NPCs
- vehicles implemented as entities
- animated-capable objects
- character-like models

Planning rules:

- Treat the model as an entity model.
- Do not treat it as a placeable block.
- Prefer groups such as `root`, `body`, `head`, `limbs`, `accessories`, and `details`.
- Keep the structure suitable for future animation.
- Internal format value: `bedrock`.

## Bedrock Block

Use Bedrock Block for Minecraft Bedrock custom blocks.

Examples:

- decorative blocks
- furniture blocks
- lamp blocks
- machine blocks
- crate blocks
- ore blocks
- statue blocks
- static world blocks

Planning rules:

- Treat the model as a placeable Minecraft Bedrock custom block.
- Do not treat it as an entity, mob, wearable, free prop, or item model.
- Prefer groups such as `root`, `base`, `sides`, `top`, `core`, and `decorative_details`.
- Keep the model readable as a static world object.
- Internal format value: `bedrock_block`.

## Correct prompt examples

```txt
Project type: Bedrock Entity
Prompt: Create a small backpack creature companion.
```

```txt
Project type: Bedrock Block
Prompt: Create a custom Minecraft Bedrock block shaped like a medieval street light.
```
