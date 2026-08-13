---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image** with buildable Cuboid construction and **one consistent model across every view**. Preserve source identity.

## User Contract

The user only needs a usable source image; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, or MCP details. Never infer numeric scale from pixels. Prefer **zero clarification**.

Resolve: explicit user fact → directly visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most **three material items**. Give one plain recommendation when useful. Never invent hidden features, asymmetry, attachments, or hidden joint precision. Material ambiguity that remains → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI verification, or `next-action.md` never authorizes image generation.

If work switches from generation into workflow/repository hardening, earlier generation permission is consumed. After hardening/verification, **stop and report**. Generate/edit only after a **fresh explicit user instruction** to generate/execute. Do not infer permission from an earlier draft request, approved plan, CI success, or repository next step.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock an Internal Generation Brief before generation:

- identity, silhouette, major masses/features, contacts/asymmetry;
- required views + Blockbench construction interpretation;
- for articulated subjects: pose state, limb/appendage count, attachment/support where relevant;
- identity-critical articulated features: visible root, overall direction/bend, terminal state.

`READY` means no material ambiguity can still change identity, major form, pose/articulation, projection consistency, or buildability.

```text
READY + fresh execution instruction → generate once
READY without fresh instruction      → STOP; wait for user
NOT READY                            → clarify once
still material                       → NEEDS REVIEW; do not generate
```

A targeted correction fixes a concrete visual defect; it cannot replace missing understanding.

## Internal Generation Brief

### Subject

Isolate the subject; ignore unrelated hands, stands, scenery, shadows, or supports. Preserve silhouette, proportions, visible attachments, intrinsic markings/colors, and known asymmetry. Normalize perspective; lens distortion is not geometry. Unknown hidden form stays conservative; do not blend conflicting sources.

### Pose & Articulation

Choose the **most structurally readable stable pose** unless another state is explicitly required.

For grounded load-bearing subjects, default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. **Do not force bilateral alignment merely to make generation easier**; allow plausible natural offset while support remains stable.

Preserve the same requested/observable pose state and limb phase across every view without inventing hidden joint precision. Preserve limb/appendage count, plausible attachment, direction/proportion, terminal part, support/contact when needed, near/far separation, and important negative spaces.

For each identity-critical articulated feature, preserve the same visible **root → direction/bend → terminal state** across views. Projection may change appearance; state may not change.

**No duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages.** Orthographic views own structural truth; 3/4 may not redesign anatomy, attachment, limb placement, or articulated state.

### Blockbench Construction

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not presets.

Use varied rectangular parts, not equal world-block voxels. Rotate only for visible slope/attachment/articulation. Curves/tapers use few meaningful segments, never a smooth primitive or unit-Cube staircase. **Never lazy-voxelize.**

### Single-Model Projection Lock

**Do not design five images independently.** Treat the board as **five projections of one locked structural interpretation**. Lock major-mass relationships, part/limb count, pose/limb phase, critical articulated-feature state, markings, attachments, negative spaces, and asymmetry.

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- LEFT strict profile; FRONT/BACK orthographic.
- SIDE/FRONT/BACK keep comparable scale and coherent ground relation when grounded.
- TOP is a true **top-down projection of the same locked structure**, not an independent diagram. Preserve footprint, mass placement, appendage roots, limb locations, and negative spaces.
- 3/4 is near-orthographic/weak perspective and preserves the same structure, pose, and support relation.

Use another view set only when the object requires it; do not add views for completeness.

### Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, baked-photo lighting, random speckle/dithering, or fake-geometry shading.

**Only panel/view labels may appear by default.** No title, header, subtitle, explanatory note, status text, scale, dimensions, or target-use text unless explicitly requested. Nonvisual constraints stay **outside the image** as compact handoff context.

## Visual Gate

Review the actual board in this order:

1. **projection coherence** — SIDE/FRONT/BACK/TOP fit the same structure;
2. **articulation lock** — limbs and identity-critical articulated features keep one state;
3. **support/naturalness** — stable support without accidental gait, floating parts, or forced robotic symmetry;
4. **construction/readability** — buildable, recognizable, uncropped target.

A material TOP mismatch, articulated-feature drift, pose/support conflict, or cross-view redesign is **NOT READY / NEEDS REVIEW** regardless of attractiveness. Do not average conflicting shapes or use numeric scores.

## Targeted Correction

A structural cross-view failure is a **board-level defect**. For the one allowed correction:

- Source Image + locked Internal Generation Brief remain authority;
- failed Draft is defect evidence, **not geometry authority**;
- name failed invariants;
- regenerate the **whole board from the same locked structure**, never one panel independently;
- preserve relationships that already passed.

The correction still requires the Execution Consent Gate. If material conflict remains, stop at **NOT READY / NEEDS REVIEW**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Return **one image only** and stop for user review/approval. Only after approval may the actual approved image + retained nonvisual facts go to modelling. **Do not generate ZIPs**.
