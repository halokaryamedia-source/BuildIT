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

## Buildable Evidence Handoff
Before generation, account for the structural evidence that downstream Geometry must be able to read from the final image:
```text
required visible part count
primary mass relationships
attachment/contact direction
intentional openings / negative spaces
front-vs-side depth character
asymmetry or orientation that changes construction
identity-critical geometry landmarks
motion-bearing parts when animation is requested or visually implied
```
The board does not need to display technical labels or metadata, but these relationships must remain visually readable. Do not simplify away a required rear attachment, side depth change, opening, articulated junction, or repeated part merely because the front view reads well.

When source coverage is incomplete, preserve uncertainty instead of inventing hidden geometry. A generated board may normalize perspective, but it must not convert `unknown` into a confident structural claim. If one view cannot resolve a material relationship, use another supported board view; if no supported view resolves it and identity/buildability depends on it, return **NEEDS REVIEW**.

**Cross-view completeness:** every identity-critical required part visible in the source set must remain accounted for across the board. A part hidden in one preview may remain visible in another; it may not silently disappear from all normalized views. Duplicated, merged, floating, relocated, or topology-changing substitutions are material failures.

**Depth readability:** FRONT cannot be the sole authority for a form whose depth materially affects silhouette, attachment, negative space, or articulation. LEFT and/or TOP must preserve the source-supported depth relationship; FRONT-LEFT 3/4 may clarify volume but never override stronger orthographic/source evidence.

## Minecraft-First Geometry / Texture

### Geometry

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Preserve recognizable silhouette, major masses, important part count, attachments, negative spaces, and defining features. Use few meaningful segments; never lazy-voxelize organic contour with unit-Cube clutter.

For curved/organic forms, simplify curvature by **meaningful silhouette segments**, not uniform voxel noise. Preserve bend direction, taper, major convex/concave transitions, attachment base, and terminal shape. More segments are justified only where they materially improve recognizability, motion clearance, or cross-view silhouette.

### Texture

Texture supports geometry; it does not replace required form. Preserve base palette, major color/material regions, part separation, and identity-critical markings. Prefer Minecraft-readable pixels over photoreal wrinkles, dense noise, baked lighting, or micro-detail.

## Pose / Articulation

Choose the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**. Do not force **bilateral alignment** merely because it is easier to generate.

Preserve identity-bearing silhouette/major masses and visible root → direction/bend → terminal intent for identity-critical articulated features without inventing hidden joint precision. Duplicated, missing, merged, floating, relocated, or structurally redefined required parts are material failures.

If animation is requested or the subject is clearly articulated, make joint neighborhoods readable enough for downstream rig planning: attachment center, neighboring volume overlap, bend direction, and plausible clearance must not be obscured by pose or perspective. Do not create exaggerated gaps at hips, knees, shoulders, elbows, neck, jaw, or waist merely to show separation.

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
2. required part-count completeness;
3. topology / attachment / negative-space correctness;
4. cross-view proportion and depth consistency;
5. geometry buildability;
6. articulation / joint readability when relevant;
7. texture usability;
8. crop-safe presentation/readability.

Correct the **largest structural difference first**. Do not spend the single automatic correction on minor presentation drift while a missing part, wrong attachment, depth error, broken opening, or articulation defect remains.

A defect is material when it changes identity, primary mass/part count, topology/attachment, important negative space, buildability, motion-readiness, or identity-critical material information.

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

A correction must not fix one view by materially breaking another. If FRONT improves but LEFT/TOP/BACK now contradict the source-supported structure, classify it as a failed correction rather than accepting the prettier panel.

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
