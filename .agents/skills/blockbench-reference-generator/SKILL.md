---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench-style multi-view reference image from an actual source image before modelling. Image-only; no MCP execution, technical package, manifest, or Codex handoff.
---

# Blockbench Reference Generator

Own **Source Image / user intent → one approved visual Modelling Brief image**. Stop at the image; downstream geometry belongs to `blockbench-bedrock-modelling` + BlockIT MCP.

## Input

Minimum:

- actual usable source image visible to the image-capable model.

Optional only when supplied or materially needed:

- asset name;
- approximate target height/dimensions;
- must-preserve feature;
- material asymmetry note.

Do not block on missing optional fields or ask a broad production questionnaire. Do not ask for Cube counts, pivots, UVs, animation, MCP tools, or package metadata.

## Visual Authority

- **Source image** owns subject identity, recognizable features, major visible proportions, attachments, markings/palette family, and asymmetry.
- **Minecraft / Blockbench quality rules** own construction language and board presentation only.
- A Golden Sample, when available, is a style/quality example; never copy its anatomy, proportions, segmentation, or subject details.

Never invent a hidden feature because the object “usually” has one. Complete only hidden surfaces needed to make already-visible volumes coherent.

## Minecraft / Blockbench Construction Language

The generated subject must read as a model that could reasonably be built from Blockbench Cubes/Cuboids:

- clear intentional primary masses;
- smaller secondary masses only when visually useful;
- varied rectangular Cuboid dimensions;
- stepped silhouette transitions where useful;
- limited purposeful rotation where a visible angled form requires it;
- readable part separation and visible contacts;
- important negative spaces preserved;
- crisp Minecraft/pixel-art presentation with simple neutral lighting.

Reject smooth/realistic forms with pixelated skin, generic voxel filters, uniform Cube piles, micro-Cube clutter, arbitrary rotation noise, cinematic scenery, PBR-style presentation, logos/watermarks, UV/pivot/hierarchy overlays, or extra sheets.

## Board Layout

Default five-view board:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Rules:

- LEFT SIDE: strict profile facing left;
- FRONT/BACK: upright orthographic views with consistent displayed scale;
- TOP / FOOTPRINT: true top-down footprint; object front/head points left when meaningful;
- FRONT-LEFT 3/4: clearly distinct volume/readability view;
- all panels show the **same model**; only the camera changes.

Add RIGHT SIDE only when material asymmetry cannot be represented honestly without it. Do not add views for completeness.

## Internal QA

Before returning the image, check only material issues:

1. subject remains recognizable as the source target;
2. construction is clearly Minecraft / Blockbench Cuboid-based;
3. primary masses and proportions are readable;
4. visible slopes use stepped form or purposeful rotation instead of universal axis alignment;
5. required attachments look connected and important gaps stay open;
6. all panels are the same coherent model with no cropping or orientation drift;
7. board is clean enough to use as a modelling brief.

Do not produce a numeric fidelity/view score or claim metric calibration.

## Generation Budget

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Correct only a concrete visible defect. If one targeted correction still leaves a material conflict, report the reference as not ready instead of looping.

## Output / Handoff

Return **one image only** as the Reference Generator deliverable. Do not generate ZIPs, manifests, Geometry/Texture/Animation/Validation documents, production-context files, or GitHub-sync state.

After user approval:

```text
actual approved reference image
+ optional short target notes already supplied by user
→ blockbench-bedrock-modelling
→ BlockIT MCP authoring
```

The approved image is visual evidence; a filename/path/summary is not a substitute. If the active surface cannot inspect or generate the image, report that boundary instead of faking completion.
