---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image** with buildable Cuboid construction and **one consistent structural interpretation across every shown view**. Preserve source identity.

## User Contract

The user only needs a usable source image; extra facts are optional. Do not ask for Cube counts, pivots, UVs, animation, or MCP details. Never infer numeric scale from pixels. Prefer **zero clarification**.

Resolve: explicit user fact → visible fact → leave optional unknowns unset → one clarification round only for material ambiguity, at most **three material items**. Never invent hidden features, asymmetry, attachments, or hidden joint precision. Material ambiguity that remains → **NEEDS REVIEW**.

## Execution Consent Gate

**Readiness is not permission to generate.** Repository/policy hardening, audit, CI, or `next-action.md` never authorizes image generation.

If work switches into workflow/repository hardening, earlier generation permission is consumed. After verification, **stop and report**. Generate/edit only after a **fresh explicit user instruction**. Do not infer permission from an earlier draft request, plan, CI success, or repository next step.

## Pre-Generation Readiness

**Generation is output, not discovery.** Lock an Internal Generation Brief:

- identity, silhouette, major masses/features, contacts/asymmetry;
- one **source-nearest orthographic anchor**: the canonical orthographic orientation closest to and best supported by the Source Image;
- the **smallest orthographic core** needed to constrain width, height, depth, key attachments and negative spaces;
- for articulated subjects: pose state, limb/appendage count, attachment/support where relevant;
- identity-critical articulated features: visible root, overall direction/bend, terminal state.

The original Source Image remains visual authority regardless of whether its camera angle is side, front, 3/4, elevated, or perspective. The generated anchor is orthographic; it does not copy source lens distortion or make a source 3/4 panel into generated structural authority.

`READY` means no material ambiguity can still change identity, major form, pose/articulation, chosen orthographic core, or buildability.

```text
READY + fresh execution instruction → generate once
READY without fresh instruction      → STOP; wait for user
NOT READY                            → clarify once
still material                       → NEEDS REVIEW; do not generate
```

A targeted correction fixes a concrete visual defect; it cannot replace missing understanding.

## Internal Generation Brief

### Subject

Isolate the subject; ignore unrelated hands, stands, scenery, shadows, or supports. Preserve proportions, visible attachments, intrinsic markings/colors, known asymmetry, and **identity-bearing silhouette / major-mass relationships**. Normalize perspective; lens distortion is not geometry.

When pose is intentionally normalized, do **not** preserve pose-dependent gait/limb silhouette merely to imitate the Source Image. Source identity remains authority; the locked modelling pose owns limb configuration. Unknown hidden form stays conservative; do not blend conflicting sources.

### Pose & Articulation

Choose the **most structurally readable stable pose** unless another state is explicitly required.

For grounded load-bearing subjects, default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. **Do not force bilateral alignment merely to make generation easier**; allow plausible natural offset while support stays stable.

Preserve the same requested/observable pose state and limb phase across shown views without inventing hidden joint precision. Preserve limb/appendage count, plausible attachment, direction/proportion, terminal part, support/contact when needed, near/far separation, and important negative spaces.

For each **identity-critical articulated** feature, preserve the same visible **root → direction/bend → terminal** state across views. Projection may change appearance; state may not change.

**No duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages.** Orthographic views own generated structural truth.

### Blockbench Construction

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not presets.

Use varied rectangular parts, not equal world-block voxels. Rotate only for visible slope/attachment/articulation. Curves/tapers use few meaningful segments, never a smooth primitive or unit-Cube staircase. **Never lazy-voxelize.**

### Orthographic Core Lock

This is **not a fixed five-panel turnaround**. Use the **smallest mutually compatible orthographic view set** that still constrains every material structure needed for modelling.

1. Choose the source-nearest orthographic anchor first.
2. Add only views needed to constrain missing axes or identity-critical structure.
3. Every added view must fit the same locked mass/pose/attachment relationships.
4. If an optional view requires contradictory invention, **omit that view** rather than fabricate coherence.
5. Omission is valid only if the remaining core still constrains all material structure. If removing the view makes the model materially underconstrained, stop at **NEEDS REVIEW** instead of approving an incomplete core.

Typical core may be:

```text
ANCHOR SIDE/FRONT
+ perpendicular orthographic view
+ TOP only when footprint/depth materially matters
+ BACK only when rear structure materially matters
```

This is guidance, not a fixed template.

- SIDE/FRONT/BACK shown together keep comparable scale and coherent ground relation when grounded.
- TOP, when included, is a true top-down projection of the same locked structure. Preserve footprint, mass placement, appendage roots, limb locations, and negative spaces.
- **3/4 is not part of the default initial core.** A **generated** 3/4 may be added only after the orthographic core is coherent and only when it resolves real volume ambiguity or the user asks. It is **diagnostic, never structural authority**. This does not reduce the authority of an original Source Image captured from 3/4.

Do not add views for completeness.

### Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, baked-photo lighting, random speckle/dithering, or fake-geometry shading.

**Only panel/view labels may appear by default.** No title, header, subtitle, explanatory note, status text, scale, dimensions, or target-use text unless explicitly requested. Nonvisual constraints stay **outside the image**.

## Visual Gate

Review the actual board in this order:

1. **anchor fidelity** — source-nearest orthographic anchor preserves identity-bearing silhouette and major-mass proportions; normalized pose may legitimately change gait/limb silhouette;
2. **orthographic coherence** — every shown view fits the same mass/pose/attachment relationships and the remaining core is sufficiently constrained;
3. **articulation lock** — limbs and identity-critical articulated features keep one state;
4. **support/naturalness** — stable support without accidental gait, floating parts, or forced robotic symmetry;
5. **construction/readability** — buildable, recognizable, uncropped target.

A material projection mismatch, articulated-feature drift, pose/support conflict, underconstrained required structure, or cross-view redesign is **NOT READY / NEEDS REVIEW** regardless of attractiveness. Do not average conflicting shapes or use numeric scores.

## Targeted Correction

A structural cross-view failure is a **board-level defect**. For the one allowed correction:

- Source Image + locked Internal Generation Brief remain authority;
- failed Draft is defect evidence, **not geometry authority**;
- name failed invariants;
- regenerate the **whole shown core from the same locked structure**, never patch one panel independently;
- preserve relationships that already passed;
- **remove an unnecessary problematic view** only when the remaining core stays sufficiently constrained; otherwise stop at NEEDS REVIEW.

The correction still requires the Execution Consent Gate. If material conflict remains, stop at **NOT READY / NEEDS REVIEW**.

## Budget / Output

For one **unchanged Internal Generation Brief / review cycle**:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

A materially new user-approved source, pose, target, or requirement starts a new review cycle. Do not start a new cycle automatically to bypass a failed correction.

Return **one image only** and stop for user review/approval. Only after approval may the actual approved image + retained nonvisual facts go to modelling. **Do not generate ZIPs**.
