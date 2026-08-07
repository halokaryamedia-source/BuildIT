# BlockIT — Operating Model Workflow

**Status:** Draft  
**Version:** 1.0

## 1. Purpose

This document defines the modelling sequence Codex must follow.

It does not repeat detailed geometry or texture rules.

Reference image creation is handled in [`04-reference-guide.md`](04-reference-guide.md).

## 2. Workflow

```text
Understand request
↓
Review reference
↓
Create short plan
↓
Prepare copied preset and open project
↓
Build base geometry and hierarchy
↓
Capture preview if available
↓
Refine geometry and pivots
↓
Validate geometry
↓
Internal visual critic and release gate
↓
Plan UV
↓
Create UV
↓
Apply base texture
↓
Capture preview if available
↓
Apply advanced texture
↓
Validate texture
↓
Internal texture visual gate
↓
Add animation if required
↓
Capture preview if available
↓
Internal animation visual gate if required
↓
Final validation
↓
Save project
```

## 3. Stage Rules

### 3.1 Understand Request

Goal: understand the object, platform, and expected output.

Exit: the request is clear enough to start planning.

### 3.2 Review Reference

Goal: understand shape, proportion, silhouette, scale, and style.

Exit: the reference is clear enough to support modelling.
If the task involves generating that reference image, follow `04-reference-guide.md` first.

### 3.3 Create Short Plan

Goal: define the main parts, build order, hierarchy, and required texture or animation work.

This is the request-level plan. It does not replace the per-section Geometry
Plan required in `3.5 Build Base Geometry and Hierarchy`.

Exit: the next step is implementation, not more speculation.

### 3.4 Prepare Copied Preset and Open Project

Goal: copy the immutable Bedrock Entity preset on Windows, assign a safe output
name, and open the copy through Windows file association.

Do not create a new project in the normal preset-first workflow.

Exit: the copied project is open, the path and Bedrock format are verified, and
the project is ready for geometry.

### 3.5 Build Base Geometry and Hierarchy

Goal: establish the primary shape and major structural parts.

Exit: the model is recognizable without texture.
Register one high-level Geometry Plan before the first cube. It must declare
semantic sections, dependencies, cube roles, order, parents, attachment intent,
and the SIDE plus FRONT or BACK view contract. It must not lock exact cube
transforms before the active section is visually inspected. Codex chooses the
reviewed transform at `place_cube` or `modify_cube` time. The plan is not
visual proof and does not require reporting every cube to the user.

Build one semantic section at a time from that single plan.

Inspect the fresh screenshot returned by each `place_cube` or `modify_cube`
call. Do not issue an extra capture call after every cube; capture one fresh
section-boundary view when it adds evidence.

Keep one MCP session for the Geometry task. Execute each planned dependency
batch continuously and inspect returned images internally; do not ask the user
to stop after every cube. A user-facing stop is allowed only at the full-plan
gate, a major dependency checkpoint, a concrete visual defect requiring repair,
missing visual evidence, or two failed corrections to the same issue.

#### Mandatory construction dependency order

The modelling order is determined by physical support and attachment, not by
which part is visually largest:

1. **Contact/support anchors** — feet, ground contacts, wheels, or the lowest
   stable base that is actually supported by the reference.
2. **Immediate connectors** — lower legs, stems, struts, or other parts that
   visibly attach to those anchors.
3. **Parent connectors** — upper legs, hips, branches, or equivalent parts that
   complete the support chain to the main mass.
4. **Main mass** — torso, body, chassis, or central volume attached to the
   completed support chain.
5. **Elevated attached masses** — neck, head, cabin, or other volumes attached
   to the main mass.
6. **Root-to-tip appendages** — tail, ears, horns, handles, or similar chains;
   build each chain from its root attachment toward its tip.
7. **Secondary silhouette details** — only after the primary support and mass
   structure is connected and visually coherent.

If the reference does not show a separate foot or base volume, use the lowest
part of the visible support as the contact anchor; do not invent a cube just to
follow the list. Build equivalent supports as a group before moving upward.
MCP supports this only through an explicit `root_anchor=true` declaration on
each separate support/contact cube; that declaration is structural metadata,
not visual proof.
Every later section must attach to an existing section. A floating torso or
other free-standing primary mass is not a valid first cube when the reference
shows a support chain. If the support chain or attachment is not visually
established, stop as `NEEDS_REVIEW` instead of choosing an order by habit.

Each cube also requires an orientation decision before placement. If the
primary construction view shows the part's long axis or silhouette direction
leaving the world-grid-orthogonal directions, the cube must be planned as
rotated; an axis-aligned substitute is not equivalent. The plan records
`axis-aligned` or `rotated`, the rotation axis, the modeller-chosen grid angle,
the evidence view, and the attachment point after rotation. The reference
determines whether a slope exists; the screenshot checkpoint determines
whether the chosen angle works. Do not infer an exact angle from image pixels.

Rotating a parent invalidates the visual assumption for every attached child.
After a parent rotation, inspect the affected primary view and revalidate or
repair each visible child connection before adding another cube. A successful
numeric transform is not proof that descendants remain connected.

Every section uses SIDE plus its declared FRONT or BACK view. TOP or 3/4 is
optional only for one explicitly unresolved question and is never a score.

### 3.6 Refine Geometry and Pivots

Goal: add only useful secondary detail and place pivots where rotation or animation needs them.

Exit: geometry and pivots support the intended behaviour.

### 3.7 Validate Geometry

Goal: check silhouette, proportion, hierarchy, intersections, and unnecessary parts.
During construction, start from the active reference's declared
`model_reference.primary_view`, then use `FRONT`, `TOP / FOOTPRINT`, `BACK`,
and `FRONT 3/4 PREVIEW` in that order. The first three are construction views;
`BACK` verifies the rear and `FRONT 3/4 PREVIEW` verifies volume and
connections. If the primary view is missing or ambiguous, stop as `BLOCKED`.
After the complete Cube Draft exists, review the same mapped view order. A
local correction reopens only affected views; do not restart all views
automatically.
Dimensions, landmarks, contacts, and tolerances come from the active
reference; no object-specific dimensions or anatomy are defined by this
workflow. MCP may use parent-relative positions and group pivots internally,
but those are implementation details rather than reference requirements.

Exit: the visual critic has checked the complete mapped view set. If the critic
is unavailable or finds a major issue, stop as `BLOCKED` or `NEEDS_REVIEW`;
do not expose the draft or continue to UV work.

### 3.8 Plan UV

Goal: choose the texture style, canvas size, and UV strategy.

Exit: the UV approach is clear.

### 3.9 Create UV

Goal: map important surfaces cleanly and keep them inside the canvas.

Exit: required surfaces have usable UVs.

### 3.10 Apply Base Texture

Goal: establish the main visual identity.

Exit: the model has a complete base texture.
Base texture is a checkpoint only unless the task explicitly stops at a structural milestone.

### 3.11 Apply Advanced Texture

Goal: improve material definition, depth, and controlled variation when required.

Exit: texture quality matches the target scope.
Skip only when the request is explicitly structural-only.

### 3.12 Validate Texture

Goal: check alignment, pixel density, pattern direction, and missing areas.

Exit: the texture visual gate has no unresolved issue. Otherwise stop as
`BLOCKED` or `NEEDS_REVIEW` before animation or final validation.

### 3.13 Add Animation

Goal: create animation only when it is required.

Exit: animation works, or it is explicitly not required.
If animation is required, run the internal animation visual gate and stop as
`BLOCKED` or `NEEDS_REVIEW` when it is unavailable or fails. If animation is
not required, skip this gate.

### 3.14 Final Validation

Goal: verify geometry, hierarchy, pivots, UV, texture, optional animation, and project cleanliness.

Exit: the result is `PASS`, `ISSUES_FOUND`, or `BLOCKED`.

The visual release is invalidated by a model revision change. Export must
re-check the current revision before writing the model.

### 3.15 Save Project

Goal: save the final `.bbmodel` file.

Exit: the file reopens correctly.

## 4. Workflow Rules

- Follow the stage order.
- Keep one active model per task unless the user explicitly asks for more.
- Do not skip a stage without a reason.
- Do not repeat a stage unless there is a clear benefit.
- Do not change requirements independently.
- Do not claim visual success without visual evidence.
- Do not treat base texture as the final state when the task requires advanced texture.
- Stop when the required scope is complete.

## 5. Stop Conditions

Stop when:

- the request is understood;
- the required stages are complete;
- no known critical issue remains;
- animation is complete or not required;
- validation status is accurate;
- `.bbmodel` is saved.
