# Pixel Art Reference

Canonical reference-preparation knowledge domain for standalone pixel-art assets used by LazyDesigner.

This domain supports:

- icons;
- object / prop pixel art;
- sprites and sprite-animation references;
- tiles and repeating patterns;
- Minecraft-native and MIVUBI HD pixel references;
- reference-image conversion into deliberate pixel art;
- clean handoff into Texturing or Particle authoring when required.

## Ownership

Pixel Art owns standalone grid-based visual authoring and reference preparation.

It does **not** own:

- model geometry or rigging;
- UV layout or production atlas mutation;
- Blockbench Painter/runtime execution;
- Bedrock particle emitter, Molang, lifecycle, or event behavior;
- generic smooth illustration generation.

Those responsibilities remain with their existing canonical owners.

## Core route

```text
request
→ artifact class
→ target mode
→ grid/detail budget
→ silhouette
→ palette + clusters
→ material / identity treatment
→ QA
→ asset ready for review
→ optional downstream handoff
```

## Minimal loading

Start with `.agents/skills/lazydesigner-pixel-art-authoring/SKILL.md`.

Load only the smallest relevant owner from this folder. Do not preload every file for simple icon work.

## Target modes

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
```

`MINECRAFT_NATIVE` favors compact vanilla-like abstraction. `MIVUBI_HD_PIXEL` allows richer material definition while preserving strict grid and cluster discipline.

## Quality principle

A finished asset must read at its actual target size. More pixels, more colors, or more detail are not evidence of higher quality. Silhouette, cluster structure, palette economy, material readability, and identity fidelity are the primary quality signals.