# ChatGPT Kangaroo Layout And Minecraft Style Guide

Use this file before generating any reference image.

## What To Copy From Kangaroo Samples

Copy the reference package structure only:

- clean white/light background
- clear title labels
- separated panels with enough spacing
- consistent proportions across views
- one sheet purpose per image
- orthographic layout for Sheet 01:
  - front view
  - side view
  - back view
  - top view when useful
  - 3/4 preview
- simple guide arrows or labels only when they help orientation
- readable planning layout for Codex, not a decorative illustration

Do not copy the kangaroo asset, anatomy, colors, pose, or proportions.

## Required Minecraft / Blockbench Visual Style

The generated asset must look buildable in Blockbench for Minecraft Bedrock.

Required:

- cuboid-based forms
- visible blocky/stepped silhouette
- low-poly Blockbench model feel
- Minecraft-style pixel-art material treatment
- stepped shading, not smooth painterly gradients
- simple readable geometry
- texture-only small carvings, seams, runes, scratches, wood grain, glow pixels, and tiny trims
- clear separation between large geometry shapes and texture details

Avoid:

- smooth fantasy concept art
- ornate hand-painted illustration style
- high-poly sculpted curves
- realistic wood carving detail as geometry
- soft rounded furniture silhouettes
- too many tiny decorative curls or swirls
- cinematic render lighting
- generic mobile-game fantasy prop style

## Prompt Wording To Use

When generating each sheet, include wording like:

```text
Minecraft Bedrock Blockbench reference sheet, cuboid-built asset, blocky stepped silhouette, low-poly cuboid proportions, pixel-art material shading, clean white planning sheet, separate labelled panels, same layout discipline as the uploaded kangaroo reference sheet, not a smooth fantasy illustration, not high-poly, not painterly.
```

## Sheet 01 Layout Rule

`01_[asset]_orthographic_views.png` should follow the kangaroo orthographic layout discipline:

- top row: front, side, back
- bottom row: top view and 3/4 preview when useful
- labels must be plain and readable
- each panel must show the same model proportions
- no scale sheet, silhouette sheet, palette sheet, texture sheet, or do/don't content inside Sheet 01

## Self-Check Before Accepting Any Image

Reject or rewrite the prompt if:

- the result looks like fantasy concept art instead of Minecraft/Blockbench
- the model has smooth carved curves instead of cuboid construction
- layout does not resemble the kangaroo sheet structure
- multiple planned sheets are merged into one image
- small details are shown as geometry instead of texture-only details
