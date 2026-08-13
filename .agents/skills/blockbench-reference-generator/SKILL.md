---
name: blockbench-reference-generator
description: Generate one Minecraft / Blockbench reference image.
---

# Blockbench Reference Generator

Create **one Minecraft / Blockbench reference image**. Hard constraints: **buildable Cuboid construction** + **one consistent model across every view**. Preserve source identity within them.

## Simple User Contract

User only needs to **upload a usable source image**; extra facts are optional. Do not expose a long questionnaire. Never ask for Cube counts, pivots, UVs, animation, MCP tools, or package data. Without dimensions, preserve visual proportions only; never infer numeric scale from pixels.

Prefer **zero clarification**. AI resolves everything it safely can from the actual image + user request before asking the user anything.

## AI-Assisted Intake Resolution

When information is missing or the user says they do not know:

1. **Use explicit user facts** as constraints.
2. **Resolve directly visible facts** from the source image when they are clear: subject identity, visible defining feature, visible asymmetry, visible attachment/contact, or current pose/state.
3. **Leave optional unknowns unset** when they are not required. Unknown does not mean the user must provide an answer.
4. **Ask only for material ambiguity** that changes identity or buildability and cannot be resolved honestly from the image/request.

Never infer numeric dimensions/scale from pixels. Never invent hidden features, unseen asymmetry, unseen attachments, or other non-visible facts just to complete intake.

If clarification is required, use **one compact round** with at most **three material items**. Explain each item in plain language, state what the image appears to show, and give one recommended interpretation. Offer alternatives only when they materially matter. The user may simply say **use your recommendation**.

Do not repeat a question after the user says they do not know. If the remaining unknown is optional, leave it unset. If it is still material after the one clarification round, return **NEEDS REVIEW** instead of guessing. Each AI recommendation is a working interpretation, not a user-provided fact, until the user accepts it.

## Pre-Generation Readiness Gate

**Do not generate an image until understanding is complete enough to define one coherent target.** Generation is output, not discovery.

Before the first image-generation call, the AI must have internally resolved:

- intended subject / identity;
- material visible silhouette, major masses, defining features, attachments/contacts, visible asymmetry, and pose/state;
- which unknowns are safely optional and remain unset;
- the required view set for an honest representation;
- the Blockbench construction interpretation needed to keep the same model across views.

`READY` means there is **no unresolved material ambiguity that could change identity, major form, required visible feature, or buildability**. It does **not** mean every optional field has a value.

```text
intake resolution
→ internal generation brief
→ readiness check
   ├─ READY → generate once
   └─ NOT READY → clarify within the existing one-round limit
                  → still material? NEEDS REVIEW; do not generate
```

Never generate a draft to discover what the target should be. The post-generation targeted correction budget is only for a **concrete visual defect in an already-ready brief**; it must not compensate for missing pre-generation understanding.

## Automatic Internal Generation Brief

### 1. Subject

Isolate the intended subject; ignore hands, stands, scenery, shadows, supports, and unrelated objects unless required.

Preserve silhouette, proportions, attachments, intrinsic colors/markings, known asymmetry. Normalize perspective; lens distortion is not geometry. Highlights/reflections/shadows/AO are not markings.

Unseen sides may continue known major masses only. Do not mirror/invent side-specific markings, damage, holes, protrusions, accessories, attachments, or asymmetry. Keep one fixed state; articulated subjects use neutral stance. Do not blend conflicting sources.

### 2. Blockbench construction

Every visible form resolves to:
```text
CUBOID
ROTATED_CUBOID
STEPPED_CUBOIDS
MULTI_CUBOID_MASS
TEXTURE_ONLY
```

Use **rectangular parts with varied dimensions**, not world blocks/equal voxels. Axis-align when enough; rotate only for slope and plausible attachment. Curves/tapers use **a few large meaningful segments**—never one smooth primitive or unit-Cube staircase. Surface-only color/pattern stays texture-only.

**Never lazy-voxelize.** Prefer fewer purposeful primary masses plus needed secondary forms; retain identity/silhouette-critical small parts. No smooth cone/wedge/sphere/bevel/melted/deforming solid. Boundaries come from real steps/plane changes/rotations/intersections, not fake seam lines.

### 3. Single-Model Cross-View Lock

Lock geometry, **major segmentation**, part count, state/pose, markings, attachments, **important negative spaces**, asymmetry. **All panels show that same model**; **do not redesign panels independently**. Orthographic panels keep **same scale, center, and ground/baseline**.

Default board:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

LEFT = strict left profile, facing left. FRONT/BACK = orthographic. TOP = true top-down orthographic same 3D model, not flat diagram. 3/4 = eye-level front-left, near-orthographic/weak perspective, no wide-angle. RIGHT only for visible/user-stated asymmetry.

Use a **different view set only when the actual object's geometry/asymmetry requires it to represent the subject honestly**. Do not add views for completeness.

### 4. Presentation

Neutral sheet; uncropped subject; low-noise Minecraft pixel texture, simple colors, neutral planar lighting. No cinematic scene, Blockbench UI/gizmos/grid/wireframe/bounds, gameplay UI, baked photo lighting, random speckle/dithering, or fake-geometry shading. Only view labels may appear.

## Buildability Visual Gate

If inspectable, inspect the **actual generated board**: buildable segmentation; no smooth primitive/voxel staircase; real boundaries; attached rotations; true negative spaces; correct views; same scale/state/parts/markings/proportions; recognizable uncropped target.

Material defect = **NOT READY** → one targeted correction. If material cross-view conflict still remains after that correction, return **NOT READY / NEEDS REVIEW**; do not average conflicting shapes or redesign panels independently. If not inspectable, do not claim the visual gate passed; user review is first visual proof. **Do not produce numeric buildability/fidelity/view scores**.

## Budget / Output

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

**Generate only after the Pre-Generation Readiness Gate passes.** Keep user dimensions/must-preserve facts for modelling handoff; do not print unless requested.

Return **one image only** as the Modelling Brief Draft. Stop for **user review / approval**. Only after user approval may the actual approved image plus already-supplied target facts be handed to modelling. **Do not generate ZIPs** or other deliverables.
