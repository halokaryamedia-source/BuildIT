---
name: blockbench-reference-generator
description: Source image → one Minecraft / Blockbench multi-view reference; skill handles the generation brief.
---

# Blockbench Reference Generator

Create **one buildable Minecraft / Blockbench reference image**. Think: **preserve subject → design one Cuboid model → show the same model in all views → reject slop**.

## Simple User Contract

User only needs to **upload a usable source image**, ask for a Minecraft / Blockbench reference, and **optionally state facts they already know**: asset name, target size/height, must-preserve feature, asymmetry.

**Do not expose a long prompt/questionnaire.** Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata. Use image-grounded defaults when optional facts are absent. Ask only if the target is materially ambiguous.

## Automatic Internal Generation Brief

**Silently enrich the simple request** with these priorities.

### 1. Preserve the subject

Source image owns identity, silhouette, major proportions, attachments, markings/palette, and asymmetry. Preserve defining features; do not invent hidden structure.

### 2. Design a Blockbench model, not a voxel filter

Every material form must resolve to:

```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
TEXTURE_ONLY
```

`CUBOID` when axis-aligned form works. `ROTATED_CUBOID` only for visible slope/orientation with plausible attachment. Use stepped/multi-Cuboid form for taper, curve-like silhouette, or compound volume. Use `TEXTURE_ONLY` when detail does not change silhouette/volume.

**Never lazy-voxelize.** Do not stack many equal/small Cubes to imitate the source. **Prefer fewer, larger, purposeful primary masses** plus necessary secondary forms; avoid micro-Cube clutter.

Do not imply cone, wedge, sphere, smooth bevel, melted join, curved/deforming solid, or shading-created fake geometry. If needed, **simplify it while preserving identity**. **Geometry Standard wins** over a smoother-looking Golden Sample.

### 3. Single-Model Cross-View Lock

Lock one conceptual model: primary masses, **major segmentation**, orientation, attachments/separations, **important negative spaces**, asymmetry. **All panels show that same model**; **do not redesign panels independently**.

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

LEFT = profile; FRONT/BACK = orthographic; TOP = footprint; 3/4 = volume check. Add RIGHT SIDE only when asymmetry requires it.

### 4. Present it as a modelling reference

Use a clean neutral sheet, uncropped subject, restrained pixel texture, planar lighting, visible construction boundaries. No cinematic render or shading that fakes geometry.

## Buildability Visual Gate

Before returning, verify:

- silhouette uses the allowed grammar;
- masses/boundaries are readable;
- taper/curve-like parts are **visibly segmented, not smooth solids**;
- **rotated parts are simple, purposeful, visibly attached**;
- openings are true negative space;
- surface detail did not become geometry clutter;
- SIDE/FRONT/BACK/TOP/3Q keep compatible segmentation/proportions;
- target remains recognizable and uncropped.

Unsupported primitive, lazy voxel stack, floating rotated part, hidden boundary, or cross-view drift = **NOT READY**. **Do not produce numeric buildability/fidelity/view scores**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

**Generate directly when the source is usable.** Correct one concrete defect; if still conflicting, report not ready instead of looping.

Return **one image only**. **Do not generate ZIPs**, manifests, production documents, or GitHub-sync state. After approval, hand the actual image to `blockbench-bedrock-modelling` / BlockIT MCP.