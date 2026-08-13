---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image** whose primary goal is a **recognizable, Blockbench-buildable Minecraft interpretation**, not exact real-world reconstruction. Preserve source identity while simplifying geometry and texture when that improves Minecraft readability.

## User Contract

A usable source image is enough; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, or MCP details. Never infer numeric scale from pixels. Prefer **zero clarification**.

Resolve: explicit user fact → visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most **three material items**. Never invent identity-changing hidden structure. Remaining material ambiguity → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation. After hardening/verification, stop and report. Generate/edit only after a **fresh explicit user instruction**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock an Internal Generation Brief with:

- identity, identity-bearing silhouette, major masses/features, attachments/asymmetry;
- one **source-nearest orthographic anchor**;
- stable pose + limb/appendage state when articulated;
- geometry target: simplest recognizable Blockbench-buildable construction;
- texture target: Minecraft-readable palette, major color/material regions, identity-critical markings;
- nonvisual constraints kept outside image pixels.

The original **Source Image remains** visual authority regardless of camera angle. A source 3/4/perspective view may be authoritative evidence; generated previews normalize camera projection instead of copying lens distortion.

`READY` means no ambiguity remains that could materially change identity, primary geometry, required attachment/topology, Minecraft buildability, or identity-critical texture information.

```text
READY + fresh instruction → generate once
READY without it           → STOP; wait for user
NOT READY                  → clarify once
still material             → NEEDS REVIEW; do not generate
```

## Minecraft-First Geometry / Texture

### Geometry

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Preserve recognizable silhouette, major masses, important part count, attachments, negative spaces, and defining features. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, and linked segments are examples, not presets. Use few meaningful segments; **never lazy-voxelize** or chase organic contour with unit-Cube clutter.

Exact anatomy, exact contour, exact source pose, and engineering-grade projection are not goals when a simpler Minecraft interpretation remains recognizable and buildable.

### Texture

Texture supports geometry; it does not replace required form. Preserve base palette, major color/material regions, part separation, and identity-critical markings. Prefer Minecraft-readable pixel treatment over photoreal wrinkles, dense noise, baked lighting, or micro-detail. Minor shade/noise/marking drift between previews is acceptable when identity and material reading remain clear.

## Pose / Articulation

Choose the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Do not force **bilateral alignment** merely because it is easier to generate.

When pose is normalized, preserve identity-bearing silhouette/major masses, **not source gait/limb silhouette**. Across previews preserve observable pose/limb phase without inventing **hidden joint precision**. Preserve limb/appendage count, attachment, support/contact, and important negative spaces.

For each **identity-critical articulated** feature preserve the same visible **root → direction/bend → terminal** intent. Small terminal-angle/curl drift may remain a minor preview imperfection; duplicated, missing, merged, floating, relocated, or structurally redefined parts are material failures.

## Five-Preview Coverage Board

Default output returns **five preview positions** so MCP/modellers can inspect the subject broadly:

```text
UPPER: SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
```

Use the source-supported LEFT/RIGHT side consistently and label it explicitly when known. The source-nearest orthographic view is the anchor.

- SIDE / FRONT / BACK / TOP are orthographic construction evidence.
- TOP should show useful footprint/depth relationships, but need not be an engineering projection.
- FRONT-SIDE 3/4 is supplemental volume/readability evidence, **not structural authority over the orthographic views**.
- The five previews describe one intended Minecraft model, but **minor cross-view drift is allowed**. Do not reject a usable board because a small curl, contour, overlap, shade, or marking placement differs slightly.

A discrepancy is **material** only when it changes identity, a primary mass or required part count, topology/attachment, an important negative space, Minecraft buildability, or identity-critical texture/material information. Material contradiction → **NOT READY / NEEDS REVIEW**.

### Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, photoreal baked lighting, or random dithering.

**Only panel/view labels may appear by default.** No title/header/subtitle/note/scale/dimensions/target-use text unless explicitly requested. Nonvisual constraints stay **outside the image**.

## Visual Gate

Review the actual board in this order:

1. **recognizability / source identity**;
2. **geometry buildability** — major form can be made cleanly in Blockbench;
3. **texture usability** — palette/material/markings give useful Minecraft surface guidance;
4. **major structural consistency** — no material contradiction across five previews;
5. **presentation/readability**.

Minor preview imperfections are not failure and do not require correction by themselves. Do not use numeric similarity scores or demand 1:1 likeness.

## Targeted Correction

Correction is for a **material board-level defect**, not minor drift. For the one allowed correction:

- Source Image + locked Brief remain authority;
- failed Draft is **defect evidence**, **not geometry authority**;
- name only the material invariant(s) that failed;
- regenerate the **whole five-preview board**, never patch one panel independently;
- preserve relationships that already work.

If the remaining issue is minor and the board is still recognizable/buildable, it may proceed to user approval. Material conflict after correction → **NEEDS REVIEW**. Correction still requires fresh execution consent.

## Budget / Output

For one **unchanged Internal Generation Brief / review cycle**:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

A materially new user-approved source, pose, target, or requirement **starts a new cycle**. **Do not start a new cycle automatically** to bypass a failed correction.

Return **one image only** and stop for user review. Only after approval may the **actual approved reference image** + retained nonvisual facts go to modelling. Do not generate ZIPs.
