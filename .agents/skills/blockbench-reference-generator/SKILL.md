---
name: blockbench-reference-generator
description: Generate one canonical Minecraft / Blockbench reference image in ChatGPT.
---

# Blockbench Reference Generator

This skill is the reference-generation specification. Operational generation belongs in **ChatGPT**; normal Codex/BlockIT authoring consumes the user-approved image.

Create **one Minecraft / Blockbench reference image** whose primary goal is a recognizable, Blockbench-buildable Minecraft interpretation, not exact real-world reconstruction.

## User Contract

A source image is enough; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, MCP details, or modelling method. Never infer numeric scale from pixels. Prefer zero clarification.

Resolve: explicit user fact → visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most three material items. Never invent identity-changing hidden structure. Remaining material ambiguity → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation. Generate/edit only after a **fresh explicit user instruction**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock an Internal Generation Brief with:

- identity, identity-bearing silhouette, major masses/features, attachments/asymmetry;
- one **source-nearest orthographic anchor**;
- stable pose + limb/appendage state when articulated;
- simplest recognizable Blockbench-buildable geometry target;
- Minecraft-readable palette/material regions/identity-critical markings;
- nonvisual constraints kept outside image pixels.

The original **Source Image remains** visual authority regardless of camera angle. Generated previews normalize camera projection instead of copying lens distortion.

`READY` means no ambiguity remains that could materially change identity, primary geometry, required attachment/topology, Minecraft buildability, or identity-critical texture information.

```text
READY + fresh instruction → generate once
READY without it           → STOP; wait for user
NOT READY                  → clarify once
still material             → NEEDS REVIEW
```

## Minecraft-First Geometry / Texture

### Geometry

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Preserve recognizable silhouette, major masses, important part count, attachments, negative spaces, and defining features. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, and linked segments are examples, not presets. Use few meaningful segments; never lazy-voxelize organic contour with unit-Cube clutter.

### Texture

Texture supports geometry; it does not replace required form. Preserve base palette, major color/material regions, part separation, and identity-critical markings. Prefer Minecraft-readable pixel treatment over photoreal wrinkles, dense noise, baked lighting, or micro-detail. Minor shade/noise/marking drift is acceptable when identity/material reading remain clear.

## Pose / Articulation

Choose the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**. Do not force **bilateral alignment** merely because it is easier to generate.

Preserve identity-bearing silhouette/major masses and visible root → direction/bend → terminal intent for identity-critical articulated features without inventing hidden joint precision. Duplicated, missing, merged, floating, relocated, or structurally redefined required parts are material failures.

## Five-Preview Coverage Board

Use one fixed **five-preview** layout so downstream 3D-Assisted extraction is deterministic:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP | FRONT-LEFT 3/4
```

Do not use generic SIDE, dynamically swap LEFT/RIGHT, or reorder views per asset.

- LEFT / FRONT / BACK / TOP are orthographic construction evidence.
- FRONT-LEFT 3/4 is supplemental volume/readability evidence, not authority over orthographic/source evidence.
- The five previews describe one intended Minecraft model; minor cross-view drift is allowed when it does not change identity, primary mass/count, topology/attachment, important negative space, or buildability.

### Crop-Safe Presentation / Handoff

Neutral uniform sheet; uncropped subject; consistent subject scale; generous empty separation. Keep each subject/shadow/prop inside its normalized region.

No panel borders, grid lines, dividers, labels, titles, notes, dimensions, target-use text, Blockbench UI/gizmos, gameplay UI, or cinematic scene.

The board may vary in resolution; normalized slot identity remains fixed. Requested dimensions/technical constraints stay outside the image and are collected by Codex later.

## Visual Gate

Review the actual board in this order:

1. recognizability / source identity;
2. geometry buildability;
3. texture usability;
4. major structural consistency;
5. crop-safe presentation/readability.

A discrepancy is material only when it changes identity, primary mass/required part count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information. Minor preview imperfections are not failure.

## Targeted Correction

Correction is for a material board-level defect, not minor drift. Source Image + locked Brief remain authority; failed Draft is defect evidence, not geometry authority.

- name only failed material invariant(s);
- regenerate the whole five-preview board, never patch one panel independently;
- preserve relationships that already work.

Material conflict after correction → **NEEDS REVIEW**.

## Budget / Output

For one unchanged Internal Generation Brief / review cycle:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

A materially new user-approved source, pose, target, or requirement starts a new cycle. Do not start a new cycle automatically to bypass a failed correction.

Return **one image only** and stop for user review. After approval, the user may send the actual approved reference image directly to Codex with a normal message. Do not generate ZIPs, JSON sidecars, manifests, coordinate sheets, or modelling blueprints.
