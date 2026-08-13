---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image**. Hard constraints: **buildable Cuboid construction** + **one consistent model across every view**. Preserve source identity.

## Simple User Contract

The user only needs to **upload a usable source image**; extra facts are optional. Do not expose a long questionnaire. Never ask for Cube counts, pivots, UVs, animation, MCP tools, or package data. Without approved dimensions, preserve visual proportions only; never infer numeric scale from pixels.

Prefer **zero clarification**. Resolve what is safely visible or explicitly supplied before asking anything.

## AI-Assisted Intake Resolution

Resolve missing information in this order:

1. explicit user fact → constraint;
2. directly visible fact → resolve from source;
3. optional unknown → **leave optional unknowns unset**;
4. material identity/buildability ambiguity → one compact clarification round.

Do not repeat a question after the user says they do not know. If clarification is required, use **one compact round** with at most **three material items**; explain plainly, state what the source appears to show, give one recommended interpretation, and allow **use your recommendation**. A recommendation is a **working interpretation**, **not a user-provided fact**.

Never infer numeric dimensions/scale from pixels. Never invent hidden features, unseen asymmetry, unseen attachments, or hidden joint precision. If material ambiguity remains, return **NEEDS REVIEW**.

## Pre-Generation Readiness Gate

**Generation is output, not discovery.** Build an Internal Generation Brief before generation and lock:

- subject/identity, material silhouette, major masses, defining visible features, visible contacts/asymmetry;
- required view set and Blockbench construction interpretation;
- for articulated subjects, one structurally readable pose state, required limb/appendage count, attachment regions, and support/contact relation when applicable.

`READY` means **no unresolved material ambiguity** can still change identity, major form, required visible feature, pose integrity, or buildability.

```text
READY → generate once
NOT READY → clarify within existing one-round budget
still material → NEEDS REVIEW; do not generate
```

The single targeted correction is only for a **concrete visual defect** in an already-ready brief; it cannot compensate for **missing pre-generation understanding**. Generate only after the Pre-Generation Readiness Gate passes.

## Automatic Internal Generation Brief

### 1. Subject

Isolate the subject; ignore hands, stands, scenery, shadows, supports, and unrelated objects unless required. Preserve silhouette, proportions, visible attachments, intrinsic colors/markings, and known asymmetry. Normalize perspective; lens distortion is not geometry. Highlights/reflections/shadows/AO are not markings.

Unseen sides may continue known major masses only. Do not mirror/invent side-specific markings, damage, holes, protrusions, accessories, attachments, asymmetry, or unobserved articulation. Do not blend conflicting sources.

### 2. Pose & Articulation Integrity

Choose the **most structurally readable stable pose** for modelling unless the user explicitly requests another state.

For grounded load-bearing subjects, the normal default is a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Neutral does not mean robotic symmetry; small natural offsets are valid when they preserve stable support and do not read as an unintended gait/action phase.

If a different pose is explicitly required, preserve the same **requested/observable pose state and limb phase** across every view. Do not invent hidden joint precision that the source does not establish.

For every required limb or load-bearing appendage, preserve identity/count, plausible attachment, coherent chain direction, stable relative proportion, terminal part, and support/contact relation when applicable. Near/far limbs remain distinguishable; required negative spaces remain open.

For grounded load-bearing subjects, feet/supports use one coherent ground plane. **No duplicated, missing, merged, floating, relocated, or independently re-posed limbs.** No accidental gait phase. Orthographic views own structural pose truth; the 3/4 view must not redesign anatomy, attachment, limb placement, or pose state.

### 3. Blockbench Construction

Choose the **simplest Blockbench-buildable representation that preserves the visible requirement**. Common reasoning examples include:

```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
PLANE_LIKE_CUBE
LAYERED_OR_INFLATED_FORM
LINKED_SEGMENTS
TEXTURE_ONLY
```

These are **reasoning examples, not exhaustive categories, presets, or asset-class rules**.

Use rectangular parts with varied dimensions, **not world blocks/equal voxels**. Axis-align when enough; rotate only for visible slope, attachment, or articulation. Curves/tapers use **few large meaningful segments**—never one smooth primitive or unit-Cube staircase. Surface-only color/pattern stays texture-only when geometry is unnecessary.

**Never lazy-voxelize.** Prefer fewer purposeful primary masses plus needed identity-critical secondary forms. No smooth cone/wedge/sphere/bevel/melted/deforming solid as fake Cuboid geometry. Boundaries come from real steps/plane changes/rotations/intersections, **not fake seam lines**.

### 4. Single-Model Cross-View Lock

Lock geometry, major segmentation, part/limb count, pose state/limb phase, markings, attachments, important negative spaces, and asymmetry. **All panels show that same model**; **do not redesign panels independently**.

Default board:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Structural presentation rules:

- LEFT = strict left profile;
- FRONT/BACK = orthographic;
- SIDE/FRONT/BACK keep comparable scale, center, and one coherent ground baseline when the subject is grounded;
- TOP = **true top-down orthographic same 3D model, not flat diagram**; preserve footprint, center, proportions, part/limb placement, and negative spaces rather than inventing a ground baseline;
- 3/4 = eye-level front-left, **near-orthographic/weak perspective, no wide-angle**; preserve the same structure, pose state, and ground/support relation.

Use a **different view set only when the actual object's geometry/asymmetry requires it**. Do not add views for completeness.

### 5. Presentation / Handoff

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture; neutral planar lighting. No cinematic scene, **Blockbench UI/gizmos/grid/wireframe/bounds**, gameplay UI, baked-photo lighting, **random speckle/dithering**, or fake-geometry shading. **Only view labels may appear** by default.

User-supplied nonvisual constraints—target dimensions/scale, target use, or other downstream facts—stay **outside the image** as compact handoff context unless the user explicitly asks to render them. Do not turn them into captions, dimension text, manifests, or extra panels.

## Buildability Visual Gate

If inspectable, inspect the **actual generated board** before approval:

- same model + same pose state/limb phase across views;
- correct required limb/appendage count, plausible attachment, support/contact, separation, and negative spaces;
- usable orthographic silhouettes and truthful TOP / footprint;
- buildable segmentation; no smooth primitive/voxel staircase;
- consistent scale/state/parts/markings/proportions;
- recognizable uncropped target.

A material pose, limb, attachment, support/contact, or cross-view conflict makes the board **NOT READY / NEEDS REVIEW** regardless of texture or attractiveness. Do not average conflicting shapes. If not inspectable, do not claim the visual gate passed; user review is first visual proof. **Do not produce numeric buildability/fidelity/view scores**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

Return **one image only** as the Modelling Brief Draft and stop for **user review / approval**. Only after user approval may the **actual approved image** plus retained nonvisual handoff facts go to modelling. **Do not generate ZIPs** or other deliverables.
