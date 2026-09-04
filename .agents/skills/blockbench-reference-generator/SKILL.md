---
name: blockbench-reference-generator
description: Specification for one canonical Minecraft / Blockbench reference image generated in ChatGPT.
---

# Blockbench Reference Generator

This skill is the **reference-generation specification**. Operational generation belongs in **ChatGPT**, not normal Codex/BlockIT authoring. Codex consumes the user-approved image rather than reproducing this stage.

Create **one Minecraft / Blockbench reference image** whose primary goal is a recognizable, Blockbench-buildable Minecraft interpretation, not exact real-world reconstruction.

## User Contract

A source image is enough; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, MCP details, or modelling method. Never infer numeric scale from pixels. Prefer zero clarification.

Resolve: explicit user fact → visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most three material items. Never invent identity-changing hidden structure. Remaining material ambiguity → `NEEDS REVIEW`.

## Execution Consent Gate

Readiness is not permission to generate. Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation. Generate/edit only after a fresh explicit user instruction.

## Internal Generation Brief

Lock only material image-generation facts:

- identity and recognizable silhouette;
- major masses/features and attachments/asymmetry;
- stable/readable pose and articulated feature state;
- simplest Minecraft/Blockbench-buildable geometry language;
- Minecraft-readable palette/material regions/identity markings;
- source-supported visible structure without invented hidden precision.

Requested dimensions and downstream technical requirements stay outside image pixels and are collected by Codex during authoring intake.

## Canonical Five-View Board

The layout is fixed and uses normalized regions so downstream 3D-Assisted extraction is deterministic:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

Do not use generic `SIDE`, dynamically choose right/left, or change the panel order per asset.

- `LEFT`, `FRONT`, `BACK`, and `TOP` are orthographic construction evidence.
- `FRONT-LEFT 3/4` is supplemental volume/readability evidence.
- All five views describe one intended Minecraft model.
- Minor cross-view drift is allowed when it does not change identity, primary mass/count, topology/attachment, important negative space, or Minecraft buildability.

The approved board is the visual authority. Downstream crops are derived inputs, not new authority.

### Crop-safe presentation

Use a neutral uniform background, consistent subject scale, and generous empty separation between slots. Keep the subject and shadow fully inside its intended region. Do not allow one view to cross into another region.

Default board contains no panel borders, grid lines, dividers, labels, title, header, notes, dimensions, target-use text, Blockbench UI/gizmos, gameplay UI, or cinematic scene.

The board need not be pixel-perfect engineering projection; it must be structurally coherent and crop-safe enough for deterministic normalized extraction of `LEFT`, `FRONT`, and `BACK` when 3D-Assisted is later selected.

## Minecraft-First Geometry / Texture

### Geometry

Choose the simplest Blockbench-buildable representation preserving recognizable silhouette, major masses, important part count, attachments, negative spaces, and defining features. Use few meaningful segments. Never lazy-voxelize or chase organic contour with unit-Cube clutter.

### Texture

Texture supports geometry; it does not replace required form. Preserve base palette, major material regions, part separation, and identity-critical markings. Prefer Minecraft-readable pixel treatment over photoreal micro-detail, dense noise, wrinkles, or baked lighting.

## Pose / Articulation

Choose a structurally readable stable pose unless another state is required. Preserve identity-bearing silhouette/major masses and visible root → direction/bend → terminal intent for identity-critical articulated features. Do not invent hidden joint precision.

Duplicated, missing, merged, floating, relocated, or structurally redefined required parts are material failures.

## Visual Gate

Review in this order:

1. recognizability / source identity;
2. geometry buildability;
3. texture usability;
4. major structural consistency across five views;
5. crop-safe presentation/readability.

A discrepancy is material only when it changes identity, primary mass/required part count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information.

## Targeted Correction

Correction is only for a material board-level defect. Source Image + locked brief remain authority; failed draft is defect evidence, not geometry authority.

For one unchanged review cycle:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Regenerate the whole five-view board rather than patching one panel independently. Material conflict after the allowed correction → `NEEDS REVIEW`.

## Output / Handoff

Return **one image only** and stop for user review. After user approval, the user may send that actual image directly to Codex with a normal message. Do not generate ZIPs, JSON sidecars, manifests, coordinate sheets, or modelling blueprints.
