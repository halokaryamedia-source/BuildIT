# Minecraft Style Image Conversion Preflight

Run this before any image generation when the source image is not Minecraft style.

This preflight is mandatory. Do not generate until every field is filled or marked `Needs verification`.

## Required Input

- Source image path:
- Target asset name:
- Target category:
- Target scale:
- Texture style:
- Atlas target:
- Required weapon/prop:

## 1. Subject Type

- Subject type:
- Why this type:

## 2. Recognition Features

List the features that must survive the conversion:

- 

## 3. Source Design Analysis

- Main silhouette:
- Proportions:
- Pose or stance:
- Largest shape masses:
- Iconic features:
- Accessories / weapons:
- Main palette:
- Material zones:
- Mood / personality:

## 4. Blockbench Model Groups

List logical build groups:

- 

## 5. Detail Classification

Silhouette-critical geometry:

- 

Secondary form cuboids:

- 

Texture-only surface details:

- 

## 6. Geometry Conversion Plan

- Large cuboids:
- Long cuboids:
- Limited rotated cuboids:
- Attachment risks:
- Micro-geometry to avoid:

## 7. Detail Budget

- Geometry budget:
- Texture detail budget:
- Must simplify:

## 8. Pixel-Art Texture Logic

- Pixel style:
- Material shading:
- Accent policy:
- Noise control:

## 9. Pattern Simplification

- Patterns to preserve:
- How to simplify:
- Patterns to remove:

## 10. Asset-Specific Prompt Lock

Append this after `minecraft-style-image-conversion-mandatory-prompt.md`:

```text
[asset-specific lock goes here]
```

## 11. Generation Permission

Only generate when all are true:

- Subject identity is clear.
- Geometry vs texture split is clear.
- Style target is Minecraft / Blockbench, not generic voxel art.
- Showcase output format is selected.
- No required field is unknown.

Status: PASS / BLOCKED
