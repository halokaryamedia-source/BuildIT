---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench-style multi-view reference image from an actual source image before modelling. Image-only; no MCP, package, or Codex handoff.
---

# Blockbench Reference Generator

Own **Source Image / user intent → one approved visual Modelling Brief image**. Design one plausible Cuboid model first, then show that same model from multiple views. Stop at the image; geometry execution belongs downstream.

## Input / Authority

Required: actual usable source image visible to the image-capable model.

Optional: asset name, target dimensions/height, must-preserve feature, asymmetry note. Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata.

- Source image owns identity, recognizable features, major proportions, attachments, markings/palette, asymmetry.
- Minecraft / Blockbench rules own construction language/presentation.
- Golden Samples are style evidence only; Geometry Standard wins if a sample looks smoother than buildable Cuboid form.
- Do not invent hidden features from generic object knowledge.

## Blockbench Construction Grammar

Every material visible form must resolve to:

```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
TEXTURE_ONLY
```

Use `CUBOID` when axis-aligned form is enough. `ROTATED_CUBOID` needs a visible slope/orientation and plausible attachment. Use stepped/multi-Cuboid form for taper, curve-like silhouette, or compound volume. Use `TEXTURE_ONLY` when detail does not change silhouette/real volume.

Do not imply cone, wedge, sphere, smooth bevel, melted join, curved/deforming solid, or shading-created fake geometry. If a feature cannot be expressed clearly with the grammar, simplify it while preserving identity. Keep segmentation, contacts, and negative spaces readable.

## Single-Model Cross-View Lock

Before rendering, lock one conceptual model's:

```text
primary masses
major segmentation
orientation
attachments / separations
important negative spaces
material asymmetry
```

All panels show that same model. Material segmentation, slope, attachment, and proportion must remain compatible; do not redesign panels independently.

Default:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

LEFT = strict profile facing left. FRONT/BACK = upright orthographic. TOP = true footprint. 3/4 = volume check. Add RIGHT SIDE only when asymmetry requires it.

## Buildability Visual Gate

Before returning, check:

1. Every major silhouette is explainable by the allowed grammar.
2. Primary masses/construction boundaries read without shading tricks.
3. Taper/curve-like parts are visibly segmented, not smooth solids.
4. Rotated parts are simple, purposeful, visibly attached.
5. Important openings are true negative space.
6. Surface-only detail did not become micro-Cube clutter.
7. SIDE/FRONT/BACK/TOP/3Q share compatible segmentation/proportions.
8. Subject is uncropped and recognizable.

Unsupported primitive, floating rotated part, hidden boundary, or cross-view drift = **NOT READY**.

Do not produce numeric buildability/fidelity/view scores or claim metric calibration.

## Generation Budget

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Correct only the concrete buildability defect. If one correction still leaves a material conflict, report not ready instead of looping.

## Output / Handoff

Return **one image only**. Do not generate ZIPs, manifests, Geometry/Texture/Animation/Validation documents, production-context files, or GitHub-sync state.

After approval:

```text
actual approved reference image
+ optional short target notes
→ blockbench-bedrock-modelling
→ BlockIT MCP authoring
```

The image is visual evidence; filename/path/summary is not a substitute. If the surface cannot inspect/generate it, report that boundary instead of faking completion.
