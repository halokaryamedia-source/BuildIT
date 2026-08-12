---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench-style multi-view reference image from an actual source image before modelling. Image-only; no MCP, package, or Codex handoff.
---

# Blockbench Reference Generator

Own **Source Image / user intent → one approved visual Modelling Brief image**. Stop at the image; downstream geometry belongs to modelling + BlockIT MCP.

## Input

Required: actual usable source image visible to the image-capable model.

Optional: asset name, approximate target dimensions/height, must-preserve visible feature, material asymmetry note. Continue with safe defaults when absent. Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata.

## Authority

- **Source image** owns identity, recognizable features, major visible proportions, attachments, markings/palette family, and asymmetry.
- Minecraft / Blockbench rules own construction language and board presentation only.
- A Golden Sample, when available, is style/quality evidence only; never copy its anatomy, proportions, segmentation, or subject details.

Do not invent hidden features from generic object knowledge. Complete only hidden surfaces needed to make already-visible volumes coherent.

## Construction Language

The subject must read as a Blockbench-buildable Cuboid model:

- clear intentional primary masses;
- secondary masses only when visually useful;
- varied rectangular Cuboid dimensions;
- stepped silhouette transitions;
- limited purposeful rotation where visible angled form requires it;
- readable contacts, separations, and important negative spaces;
- crisp Minecraft/pixel-art presentation with neutral lighting.

Reject realistic forms with pixelated skin, generic voxel filters, uniform Cube piles, micro-Cube clutter, arbitrary rotations, cinematic/PBR scenery, logos/watermarks, UV/pivot/hierarchy overlays, or extra sheets.

## Board Layout

Default:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- LEFT SIDE: strict profile facing left.
- FRONT/BACK: upright orthographic, consistent displayed scale.
- TOP: true top-down footprint; front/head points left when meaningful.
- FRONT-LEFT 3/4: distinct volume/readability view.
- Every panel shows the **same model**; only camera changes.

Add RIGHT SIDE only when material asymmetry cannot be represented honestly without it. Do not add views for completeness.

## Internal QA

Before returning the image, check only material issues:

1. recognizable as the source target;
2. clearly Minecraft / Blockbench Cuboid construction;
3. readable primary masses/proportions;
4. visible slopes use stepped form or purposeful rotation;
5. required attachments connect and important gaps remain open;
6. all views show one coherent uncropped model without orientation drift;
7. board is clean enough for modelling.

Do not produce numeric fidelity/view scores or claim metric calibration.

## Generation Budget

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Correct only a concrete visible defect. If one targeted correction still leaves a material conflict, report the reference as not ready instead of looping.

## Output / Handoff

Return **one image only**. Do not generate ZIPs, manifests, Geometry/Texture/Animation/Validation documents, production-context files, or GitHub-sync state.

After user approval:

```text
actual approved reference image
+ optional short target notes already supplied
→ blockbench-bedrock-modelling
→ BlockIT MCP authoring
```

The approved image is visual evidence; a filename/path/summary is not a substitute. If the active surface cannot inspect or generate the image, report that boundary instead of faking completion.
