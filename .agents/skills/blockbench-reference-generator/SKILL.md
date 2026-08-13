---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image**. Hard constraints: **buildable Cuboid construction** + **one consistent model across every view**. Preserve source identity.

## User Contract

The user only needs a usable source image; extra facts are optional. Do not expose a long questionnaire or ask for Cube counts, pivots, UVs, animation, MCP tools. Never infer numeric scale from pixels. Prefer **zero clarification**.

Resolve in order: explicit user fact → directly visible fact → leave optional unknowns unset → one compact clarification round only for material ambiguity. Do not repeat questions the user cannot answer. If needed, ask at most **three material items**, explain plainly, give one recommended interpretation, and allow **use your recommendation**. A recommendation is a working interpretation, not a user fact.

Never invent hidden features, unseen asymmetry/attachments, or hidden joint precision. Unresolved material ambiguity → **NEEDS REVIEW**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Before generation, lock an Internal Generation Brief:

- identity, silhouette, major masses, defining visible features, contacts/asymmetry;
- required views + Blockbench construction interpretation;
- when articulated: one readable pose state, limb/appendage count, attachment regions, support/contact when relevant;
- identity-critical articulated features such as trunk, tail, antenna, jaw, wing, hinged part, or tool: visible root, overall direction/bend, and terminal state.

`READY` means no material ambiguity can still change identity, major form, visible feature, pose/articulation integrity, projection consistency, or buildability.

```text
READY → generate once
NOT READY → one clarification round
still material → NEEDS REVIEW; do not generate
```

A targeted correction fixes a **concrete visual defect** in an already-ready brief; it cannot replace missing understanding.

## Internal Generation Brief

### 1. Subject

Isolate the subject; ignore unrelated hands, stands, scenery, shadows, or supports. Preserve silhouette, proportions, visible attachments, intrinsic markings/colors, and asymmetry. Normalize perspective; lens distortion is not geometry.

Unseen sides may continue known major masses only. Do not invent side-specific form or unobserved articulation. Do not blend conflicting sources.

### 2. Pose & Articulation

Choose the **most structurally readable stable pose** unless the user explicitly requires another state.

For grounded load-bearing subjects, default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Neutral need not be robotic or perfectly mirrored. **Do not force bilateral alignment merely to make generation easier**; use only plausible natural offset while keeping support stable.

If another pose is required, preserve the same **requested/observable pose state and limb phase** across every view. Do not invent hidden joint precision.

Preserve limb/appendage identity/count, plausible attachment, coherent direction/proportion, terminal part, support/contact when needed, near/far separation, and important negative spaces. Grounded supports use one coherent ground plane.

For each identity-critical articulated feature, preserve the same visible **root → direction/bend → terminal state** across views. Projection may change its appearance; the feature state may not change.

**No duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages.** Orthographic views own structural truth; 3/4 may not redesign anatomy, attachment, limb placement, or articulated state.

### 3. Blockbench Construction

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples—not exhaustive categories, presets, or asset rules.

Use varied rectangular parts, not equal world-block voxels. Rotate only for visible slope, attachment, or articulation. Curves/tapers use **few large meaningful segments**—never a smooth primitive or unit-Cube staircase. Surface-only pattern can remain texture-only.

**Never lazy-voxelize.** Prefer purposeful primary masses plus identity-critical detail. Do not fake smooth form with Cuboid clutter.

### 4. Single-Model Projection Lock

Do not design five images independently. Treat the board as **five projections of one locked structural interpretation**.

Lock major-mass relationships, part/limb count, pose/limb phase, critical articulated-feature state, markings, attachments, negative spaces, and asymmetry. Before generation, verify that the same relationships can explain every required view without contradiction.

Default board:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- LEFT = strict profile; FRONT/BACK = orthographic.
- SIDE/FRONT/BACK keep comparable scale, center, and coherent ground baseline when grounded.
- TOP = **true top-down projection of the same locked structure**, not an independent diagram. Preserve footprint, mass placement, appendage roots, limb locations, and negative spaces. If hidden detail is unknown, keep it conservative instead of inventing structure.
- 3/4 = eye-level front-left, near-orthographic/weak perspective, no wide-angle; preserve the same structure, pose, and support relation.

Use another view set only when the object actually requires it. Do not add views for completeness.

### 5. Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, baked-photo lighting, random speckle/dithering, or fake-geometry shading. **Only view labels may appear** by default.

Nonvisual constraints such as target scale/dimensions/use stay **outside the image** as compact handoff context unless explicitly requested visible. Do not create captions, manifests, or extra panels for them.

## Visual Gate

If inspectable, review the actual board in this order:

1. **projection coherence** — SIDE/FRONT/BACK/TOP all fit the same structure;
2. **articulation lock** — limbs and identity-critical articulated features keep one state across views;
3. **support/naturalness** — stable support without accidental gait, floating parts, or forced robotic symmetry;
4. **construction/readability** — buildable segmentation, consistent proportions/markings, recognizable uncropped target.

A material TOP mismatch, articulated-feature drift, pose/limb/support conflict, or cross-view redesign is **NOT READY / NEEDS REVIEW** regardless of attractiveness. Do not average conflicting shapes. If not inspectable, do not claim the gate passed. Do not produce numeric scores.

## Targeted Correction

A structural cross-view failure is a **board-level defect**, even if one panel exposes it.

For the one allowed correction:

- Source Image + locked Internal Generation Brief remain authority;
- failed Draft is defect evidence, not geometry authority;
- name failing invariants explicitly;
- regenerate the **whole board from the same locked structure**; never patch one view independently;
- preserve relationships that already passed; reject a correction that fixes one panel by redesigning another.

If material conflict remains, stop at **NOT READY / NEEDS REVIEW**; do not generate more variants.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Return **one image only** as the Modelling Brief Draft and stop for user review/approval. Only after approval may the actual approved image + retained nonvisual facts go to modelling.
