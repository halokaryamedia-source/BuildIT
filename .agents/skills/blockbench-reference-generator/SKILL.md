---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image** with buildable Cuboid construction and one consistent structural interpretation across shown views. Preserve source identity.

## User Contract

The user only needs a usable source image; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, or MCP details. Never infer numeric scale from pixels. Prefer **zero clarification**.

Resolve: explicit user fact → visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most **three material items**. Never invent hidden features, asymmetry, attachments, or hidden joint precision. Remaining material ambiguity → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation. If work switches into hardening, earlier generation permission is consumed. After verification, stop and report. Generate/edit only after a **fresh explicit user instruction**.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock an Internal Generation Brief with:

- identity, major silhouette/masses/features, contacts/asymmetry;
- one **source-nearest orthographic anchor**;
- the **smallest orthographic core** needed to constrain material width/height/depth, attachments and negative spaces;
- pose + limb/appendage state when articulated;
- identity-critical articulated feature root, overall direction/bend, terminal state.

The original **Source Image remains** visual authority regardless of camera angle. A source 3/4/perspective view may be authoritative evidence; the generated anchor **normalizes camera projection** instead of copying lens distortion.

`READY` means no material ambiguity can still change identity, major form, pose/articulation, required orthographic coverage, or buildability.

```text
READY + fresh instruction → generate once
READY without it           → STOP; wait for user
NOT READY                  → clarify once
still material             → NEEDS REVIEW; do not generate
```

## Internal Generation Brief

### Subject / Pose

Preserve proportions, visible attachments, markings/colors, known asymmetry, **identity-bearing silhouette**, and major-mass relationships. Ignore unrelated scene/support objects. Normalize perspective; lens distortion is not geometry.

Choose the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Do not force **bilateral alignment** merely because it is easier to generate.

When pose is normalized, preserve identity-bearing silhouette/major masses, **not source gait/limb silhouette**. The locked modelling pose owns limb configuration. Across shown views preserve observable pose/limb phase without inventing **hidden joint precision**.

Preserve limb/appendage count, attachment, direction/proportion, terminal part, support/contact, near/far separation and important negative spaces. For each **identity-critical articulated** feature preserve the same visible **root → direction/bend → terminal** state. No **duplicated**, missing, merged, **floating**, relocated, or independently re-posed limbs/appendages.

### Blockbench Construction

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not presets. Use few meaningful segments; **never lazy-voxelize** or fake smooth form with unit-Cube clutter.

### Orthographic Core Lock

This is **not a fixed five-panel turnaround**. Use the smallest mutually compatible orthographic set that still constrains every material structure.

1. Choose the source-nearest orthographic anchor.
2. Add only views needed for missing axes or identity-critical structure.
3. Every added view must fit the same mass/pose/attachment relationships.
4. **Omit that view** if it is optional and requires contradictory invention.
5. Omission is valid only if the remaining core stays **sufficiently constrained**; otherwise stop at **NEEDS REVIEW**.

Typical guidance, not a template:

```text
ANCHOR SIDE/FRONT
+ perpendicular orthographic view
+ TOP only when footprint/depth materially matters
+ BACK only when rear structure materially matters
```

TOP, when included, is a true top-down projection of the same structure. **3/4 is not part of the default initial core.** A **generated** 3/4 is **diagnostic, never structural authority**; add it only after orthographic coherence when useful or requested. This never demotes an original Source Image captured from 3/4.

### Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, photo lighting, random dithering, or fake-geometry shading.

**Only panel/view labels may appear by default.** No title/header/subtitle/note/scale/dimensions/target-use text unless explicitly requested. Nonvisual constraints stay **outside the image**.

## Visual Gate

Review the actual board in order:

1. **anchor fidelity** — orthographic anchor preserves source identity, identity-bearing silhouette and major masses; normalized pose may change gait/limb silhouette;
2. **orthographic coherence** — views fit one structure and required coverage stays sufficiently constrained;
3. **articulation lock** — articulated state is consistent;
4. support/**naturalness** — stable support without accidental gait, floating parts, or forced symmetry;
5. construction/readability — buildable, recognizable, uncropped.

Material projection mismatch, articulated drift, pose/support conflict, underconstrained required structure, or cross-view redesign is **NOT READY / NEEDS REVIEW**. Do not average conflicts or use numeric scores.

## Targeted Correction

A structural cross-view failure is a **board-level defect**. For the one allowed correction:

- Source Image + locked Brief remain authority;
- failed Draft is **defect evidence**, **not geometry authority**;
- name failed invariants;
- regenerate the **whole shown** core, never patch one panel;
- preserve relationships that passed;
- **remove an unnecessary problematic view** only if the remaining core stays sufficiently constrained; otherwise stop at NEEDS REVIEW.

Correction still requires fresh execution consent.

## Budget / Output

For one **unchanged Internal Generation Brief / review cycle**:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

A materially new user-approved source, pose, target, or requirement **starts a new cycle**. **Do not start a new cycle automatically** to bypass a failed correction.

Return **one image only** and stop for user review. Only after approval may the **actual approved reference image** + retained nonvisual facts go to modelling. Do not generate ZIPs.
