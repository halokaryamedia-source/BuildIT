---
name: blockbench-reference-generator
description: Generate one canonical Minecraft / Blockbench reference image in ChatGPT from one or more source images.
---

# Blockbench Reference Generator

Reference-generation specification for **ChatGPT**. Codex/BlockIT consumes the user-approved image.

Create **one Minecraft / Blockbench reference image** optimized for recognizable, Blockbench-buildable Minecraft interpretation, not exact real-world reconstruction.

A canonical board is optional and is used when stronger normalized cross-view coverage materially helps construction. Generation always requires a fresh explicit user instruction.

## User Contract

One or more source images are enough; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, MCP details, or modelling method. Never infer numeric scale from pixels. Prefer zero clarification.

With multiple sources, use each only for evidence it visibly supports: identity, depth, rear/side structure, attachment, asymmetry, material, or detail. Do not average conflicting views into invented structure or ask for another view when the current set already resolves the next material decision.

Resolve: explicit user fact → visible source evidence → leave optional unknowns unset → one clarification round only for material ambiguity, at most three material items. Never invent identity-changing hidden structure. Remaining material ambiguity → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy work, audit, CI, or `next-action.md` never authorizes image generation. Generate/edit only after a **fresh explicit user instruction**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock only:

- identity + identity-bearing silhouette;
- primary masses / required parts / attachments / asymmetry / pose;
- source-backed view evidence, including one **source-nearest orthographic anchor** when available;
- simplest recognizable Blockbench-buildable geometry target;
- Minecraft-readable palette/material regions/identity-critical markings.

Keep nonvisual constraints outside image pixels. Original **Source Image(s)** govern reference preparation; the explicitly approved interpretation governs downstream modelling. Generated previews normalize projection instead of copying lens distortion.

`READY` means no ambiguity remains that could materially change identity, primary geometry, attachment/topology, buildability, or identity-critical texture information.

```text
READY + fresh instruction → generate once
READY without it           → STOP; wait for user
NOT READY                  → clarify once
still material             → NEEDS REVIEW
```

## Minecraft-First Geometry / Texture

### Geometry

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Preserve recognizable silhouette, major masses, important part count, attachments, negative spaces, and defining features. Use few meaningful segments; never lazy-voxelize organic contour with unit-Cube clutter.

### Texture

Texture supports geometry; it does not replace required form. Preserve base palette, major color/material regions, part separation, and identity-critical markings. Prefer Minecraft-readable pixels over photoreal wrinkles, dense noise, baked lighting, or micro-detail.

## Pose / Articulation

Choose the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**. Do not force **bilateral alignment** merely because it is easier to generate.

Preserve identity-bearing silhouette/major masses and visible root → direction/bend → terminal intent for identity-critical articulated features without inventing hidden joint precision. Duplicated, missing, merged, floating, relocated, or structurally redefined required parts are material failures.

## Five-Preview Coverage Board

When normalized coverage is needed, use one fixed **five-preview** layout:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP | FRONT-LEFT 3/4
```

Do not use generic SIDE, swap LEFT/RIGHT, or reorder views.

- LEFT / FRONT / BACK / TOP are orthographic construction evidence.
- FRONT-LEFT 3/4 is supplemental volume/readability evidence, never authority over stronger source/orthographic evidence.
- Minor cross-view drift is acceptable unless it changes identity, primary mass/count, topology/attachment, important negative space, or buildability.

### Crop-Safe Presentation / Handoff

Neutral uniform sheet; uncropped subject; consistent subject scale; generous separation. Keep subject/shadow/prop inside its normalized region.

No panel borders, grid lines, dividers, labels, titles, notes, dimensions, target-use text, Blockbench UI/gizmos, gameplay UI, or cinematic scene.

Resolution may vary; slot identity stays fixed. Dimensions/technical constraints stay outside the image.

## Visual Gate

Review the actual board in this order:

1. recognizability / source identity;
2. geometry buildability;
3. texture usability;
4. major structural consistency;
5. crop-safe presentation/readability.

A defect is material only when it changes identity, primary mass/part count, topology/attachment, important negative space, buildability, or identity-critical material information.

## Targeted Correction

Correction is for a material defect, not minor drift. Source Image(s) + locked brief remain authority; the board is an editable draft.

Use **delta-first correction**: state only the defect/change plus what must remain unchanged. Do not repeat the full generation specification unless source authority or target materially changed.

Choose the smallest coherent edit:

```text
local presentation/detail defect
→ edit the affected area; preserve the rest

structural defect affecting multiple views
→ edit every materially affected view together; preserve unaffected views

global identity / pose / layout / cross-view coherence failure
→ regenerate the full board
```

Never export a corrected panel separately; output remains one complete board. Use full-board regeneration only when a bounded edit cannot preserve cross-view consistency.

Material conflict after correction → **NEEDS REVIEW**.

## Budget / Output

For one unchanged material brief / automatic review cycle:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

The automatic correction is either a bounded edit or full-board regeneration, never both.

A fresh explicit **user-directed correction** after review authorizes one revised board even if the prior automatic correction was used. Treat it as a new user-led review cycle: apply the requested delta once, preserve valid relationships, return one image, then stop for review.

A materially new user-approved source, pose, target, or requirement also starts a new cycle. Never open one automatically to bypass a failed correction.

Return **one image only** and stop for user review. After approval, the user may send it directly to Codex. Do not generate ZIPs, JSON sidecars, manifests, coordinate sheets, or modelling blueprints.
