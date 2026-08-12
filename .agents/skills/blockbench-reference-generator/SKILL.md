---
name: blockbench-reference-generator
description: Turn a source image into one Minecraft / Blockbench multi-view reference; user supplies the image + known facts, and the skill builds the brief internally.
---

# Blockbench Reference Generator

Own **Source Image / user intent → one approved visual Modelling Brief image**. Design one plausible Cuboid model first, then show that same model from multiple views.

## Simple User Contract

User only needs to upload a usable source image, ask for a Minecraft / Blockbench reference, and optionally state facts they already know: asset name, target size/height, must-preserve feature, asymmetry.

Do not expose a long prompt/questionnaire. Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata. Missing optional facts use conservative image-grounded defaults. Ask only when the target is materially ambiguous and continuing would require guessing.

## Automatic Internal Generation Brief

Silently enrich the simple request before generating.

### Identity

Source image owns identity, silhouette, major proportions, attachments, markings/palette, asymmetry. Preserve defining features; do not invent hidden features from generic knowledge.

### Blockbench Construction Grammar

Every material visible form resolves to:

```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
TEXTURE_ONLY
```

`CUBOID` when axis-aligned form is enough. `ROTATED_CUBOID` only for visible slope/orientation with plausible attachment. Use stepped/multi-Cuboid form for taper, curve-like silhouette, compound volume. `TEXTURE_ONLY` when detail does not change silhouette/real volume.

**Never lazy-voxelize.** Do not uniformly stack many equal/small Cubes. Prefer fewer, larger, purposeful primary masses plus only necessary secondary forms; avoid micro-Cube clutter.

Do not imply cone, wedge, sphere, smooth bevel, melted join, curved/deforming solid, or shading-created fake geometry. If needed, **simplify it while preserving identity**. **Geometry Standard wins** over a smoother-looking Golden Sample.

### Single-Model Cross-View Lock

Lock one conceptual model: primary masses, **major segmentation**, orientation, attachments/separations, **important negative spaces**, asymmetry. **All panels show that same model**; **do not redesign panels independently**.

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

LEFT = strict profile; FRONT/BACK = orthographic; TOP = true footprint; 3/4 = volume check. Add RIGHT SIDE only when asymmetry requires it.

### Presentation

Use a clean Minecraft / Blockbench modelling sheet: neutral background, uncropped subject, restrained pixel texture, planar lighting, visible construction boundaries. No cinematic render or shading that fakes rounding, bevels, holes, or hidden geometry.

## Buildability Visual Gate

Before returning, verify:

1. major silhouette uses the allowed grammar;
2. masses/boundaries read without shading tricks;
3. taper/curve-like parts are **visibly segmented, not smooth solids**;
4. **rotated parts are simple, purposeful, visibly attached**;
5. openings are true negative space;
6. surface detail did not become geometry clutter;
7. SIDE/FRONT/BACK/TOP/3Q keep compatible segmentation/proportions;
8. target remains recognizable and uncropped.

Unsupported primitive, lazy voxel stack, floating rotated part, hidden boundary, or cross-view drift = **NOT READY**. **Do not produce numeric buildability/fidelity/view scores**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Generate directly when the source is usable. Correct one concrete defect; if still materially conflicting, report not ready instead of looping.

Return **one image only**. **Do not generate ZIPs**, manifests, production documents, or GitHub-sync state. After approval, hand the actual image + user facts to `blockbench-bedrock-modelling` / BlockIT MCP. Filename/path/summary is not visual evidence.
