# Pixel Art Prompt Contract

## Purpose

Keep pixel-art requests compact while preserving production-critical constraints.

## Minimum intent packet

Use available evidence to resolve:

```text
subject
artifact class
target use / target mode
size or size constraint when material
reference image(s) when supplied
background/alpha requirement
series/style reference when supplied
animation requirement when supplied
```

Do not force the user to specify every field when a conservative reversible choice is possible.

## Blocking vs provisional

Ask only when an unknown would materially alter identity or target compatibility.

Potential blockers:

- exact required output dimensions imposed by an external target;
- conflicting reference identity;
- required sprite-sheet layout with unknown frame contract;
- target style explicitly dependent on an unavailable prior accepted asset.

Usually provisional:

- precise palette shades;
- minor light direction when no series lock exists;
- small padding adjustments;
- secondary texture density.

## Natural-language classification examples

```text
"buat icon sekop pixel art"
→ ICON

"buat botol bensin seperti gambar ini, pixel style Minecraft"
→ OBJECT / PROP + reference conversion + MINECRAFT_NATIVE

"buat sprite kucing jalan 6 frame"
→ SPRITE + animation

"buat pattern bata pixel yang seamless"
→ TILE / PATTERN

"buat konsep texture pixel untuk model ini"
→ TEXTURE_REFERENCE
```

## Context economy

Compile the request into the smallest owner bundle. Do not include every Pixel Art document in each task.