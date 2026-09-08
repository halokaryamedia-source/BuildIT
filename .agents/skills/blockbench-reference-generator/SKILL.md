---
name: blockbench-reference-generator
description: Generate one canonical Minecraft / Blockbench reference image in ChatGPT from one or more source images.
---

# Blockbench Reference Generator

This skill is the reference-generation specification. Operational generation belongs in **ChatGPT**; normal Codex/BlockIT authoring consumes the user-approved image.

Create **one Minecraft / Blockbench reference image** whose primary goal is a recognizable, Blockbench-buildable Minecraft interpretation, not exact real-world reconstruction.

A canonical board is an optional preparation step for `DIRECT` and required preparation for `3D_ASSISTED`. Do not generate one merely because source imagery exists; generation still requires a fresh explicit user instruction.

## User Contract

One or more source images are enough; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, MCP details, or modelling method. Never infer numeric scale from pixels. Prefer zero clarification.

When multiple source images are supplied, use each only for evidence it visibly supports: identity, front/rear/side depth, attachment, asymmetry, material, or detail. Do not average conflicting views into invented structure, and do not ask for another view when the current set already resolves the next material decision.

Resolve: explicit user fact → visible source evidence → leave optional unknowns unset → one clarification round only for material ambiguity, at most three material items. Never invent identity-changing hidden structure. Remaining material ambiguity → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation. Generate/edit only after a **fresh explicit user instruction**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock only the material generation brief:

- identity + identity-bearing silhouette;
- primary masses / required parts / attachments / asymmetry / pose;
- source-backed view evidence, including one **source-nearest orthographic anchor** when available;
- simplest recognizable Blockbench-buildable geometry target;
- Minecraft-readable palette/material regions/identity-critical markings.

Keep dimensions and other nonvisual constraints outside image pixels. Original **Source Image(s)** remain visual authority regardless of camera angle. Generated previews normalize projection instead of copying lens distortion.

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

Correction is for a material defect, not minor drift. Source Image(s) + locked brief remain authority; the current board is an editable draft, not new geometry authority.

Use **delta-first correction**: state only the defect/change plus the relationships that must remain unchanged. Do not repeat the full generation specification unless source authority or the target materially changed.

Choose the smallest coherent edit:

```text
local presentation/detail defect
→ edit only the affected area while preserving the rest of the board

structural defect affecting multiple views
→ edit every materially affected view together and preserve unaffected views

global identity / pose / layout / cross-view coherence failure
→ regenerate the full board
```

Never export a corrected panel as a separate deliverable; the result remains one complete five-preview board. Escalate to full-board regeneration only when a bounded edit cannot reliably preserve cross-view consistency.

Material conflict after correction → **NEEDS REVIEW**.

## Budget / Output

For one unchanged material brief / automatic review cycle:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

The automatic correction may be a bounded edit or a full-board regeneration according to the defect class above; do not do both automatically.

A fresh explicit **user-directed correction** after review authorizes one new revised board even if the prior automatic targeted-correction budget was used. Treat it as a new user-led review cycle, not an automatic retry: apply the requested delta once, preserve still-valid relationships, return one image, then stop for review again.

A materially new user-approved source, pose, target, or requirement also starts a new cycle. Do not start a new cycle automatically to bypass a failed correction.

Return **one image only** and stop for user review. After approval, the user may send the actual approved reference image directly to Codex with a normal message. Do not generate ZIPs, JSON sidecars, manifests, coordinate sheets, or modelling blueprints.
