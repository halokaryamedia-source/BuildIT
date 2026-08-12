---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench multi-view reference.
---

# Blockbench Reference Generator

Create **one buildable Minecraft / Blockbench reference image**.

Priority: **identity → buildability → same-model consistency → Minecraft presentation → polish**.

## Simple User Contract

User only needs to **upload a usable source image**, ask for a Minecraft / Blockbench reference, and **optionally state facts they already know**: name, size/height, must-preserve feature, asymmetry.

**Do not expose a long prompt/questionnaire.** Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata. Without dimensions, never invent numeric scale from pixels. Ask only if materially ambiguous.

## Automatic Internal Generation Brief

**Silently enrich the simple request**.

### 1. Preserve subject

Source controls identity, silhouette, proportions, visible attachments, markings/palette, asymmetry. Normalize perspective; lens distortion is not geometry.

For unseen sides, continue visible masses/colors/known attachments into a coherent 3D object. Do not invent hidden features/asymmetry. Use one neutral pose across panels.

### 2. Build Blockbench form, not voxelized sculpture

Every material form resolves to:

```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
TEXTURE_ONLY
```

These are **rectangular model parts with varied width/height/depth, not Minecraft world blocks or equal-sized voxels**.

`CUBOID` = axis-aligned. `ROTATED_CUBOID` = visible slope with plausible attachment. Stepped/multi-Cuboid = taper/curve-like form. `TEXTURE_ONLY` = surface detail without silhouette/volume.

**Never lazy-voxelize.** Do not stack many equal/small Cubes. **Prefer fewer, larger, purposeful primary masses** plus needed secondary forms; retain small identity/silhouette-critical geometry.

Do not imply cone, wedge, sphere, smooth bevel, melted join, curved/deforming solid, or shading-created fake geometry. If needed, **simplify it while preserving identity**. **Geometry Standard wins** over a smoother-looking Golden Sample.

### 3. Single-Model Cross-View Lock

Lock one model: **major segmentation**, orientation, attachments/separations, **important negative spaces**, part count, markings, pose, asymmetry. **All panels show that same model**; **do not redesign panels independently**.

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

LEFT SIDE = strict left profile, facing left. FRONT/BACK = orthographic. TOP = true top-down orthographic same-model view, not a flat diagram. 3/4 = volume check. Add RIGHT SIDE only for asymmetry.

### 4. Presentation

Neutral modelling sheet; uncropped subject; restrained pixel texture; planar lighting. No cinematic render, Blockbench UI/gizmos/grid/wireframe/bounds, or Minecraft gameplay/UI. No shading that fakes geometry. Only view labels may appear.

## Buildability Visual Gate

After the first image exists, inspect the **generated board**. Before returning, verify:

- readable masses/boundaries; allowed grammar;
- taper/curve-like parts are **visibly segmented, not smooth solids**;
- **rotated parts are simple, purposeful, visibly attached**;
- true negative space; no lazy voxel stack/clutter;
- SIDE/FRONT/BACK/TOP/3Q keep compatible segmentation, part count, pose, markings, proportions;
- correct orientation; recognizable uncropped target.

Unsupported primitive, lazy voxel stack, floating rotated part, hidden boundary, wrong view, or cross-view drift = **NOT READY**. **Do not produce numeric buildability/fidelity/view scores**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

**Generate directly when the source is usable.** Correct one concrete defect found in the generated board; if conflicting, report not ready instead of looping.

Return **one image only**. **Do not generate ZIPs** or other non-image deliverables.
