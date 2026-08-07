# BlockIT — Operating Model Workflow

**Status:** Draft  
**Version:** 1.1

## 1. Purpose

Define the generic modelling sequence for creating a Minecraft Bedrock model in
Blockbench through MCP.

This workflow is **object-agnostic**. It must not encode Zebra, Rhino, animal,
prop, or other fixture-specific anatomy/build order into product policy.

Reference preparation is handled in [`04-reference-guide.md`](04-reference-guide.md).
Geometry, texture, and visual-quality details remain in their dedicated
foundation notes.

## 2. Workflow

```text
Understand request
↓
Review approved Model Reference
↓
Whole-form interpretation
↓
Prepare/open Bedrock project
↓
Primary Geometry Pass
↓
Primary visual gate
↓
Secondary geometry / hierarchy / pivots
↓
Full geometry review
↓
UV / texture
↓
Texture visual gate
↓
Animation only when required
↓
Animation visual gate when required
↓
Final validation
↓
Save .bbmodel
```

Do not add extra stages merely because a tool or previous experiment used them.

## 3. Stage Rules

### 3.1 Understand Request

Goal: understand the requested asset, platform, intended use, required scope, and
expected output.

The user is not required to provide modelling or MCP expertise. Use the current
Developing rules to separate the real goal from any suggested implementation.

Exit: the request is clear enough to evaluate the reference and define the
modelling scope.

### 3.2 Review Approved Model Reference

Goal: understand the visible whole form: silhouette, major proportions, major
masses, contacts/attachments, orientation, style, and declared target
dimensions.

The Model Reference is a visual modelling brief, not pixel calibration. Do not
invent exact geometry from ambiguous pixels.

Exit: the reference is sufficiently clear to support a whole-form plan. If the
reference itself must be created/repaired, use `04-reference-guide.md` first.

### 3.3 Whole-Form Interpretation

Goal: reason about the object as one coherent 3D composition before optimizing
individual Cubes.

Define only what is needed to make the first pass coherent:

- primary masses and their relative scale;
- major attachment/contact relationships;
- overall orientation and silhouette direction;
- hierarchy/pivot needs that materially affect construction or animation;
- the most informative reference views for the primary pass.

Do **not** lock every cube transform, create a per-cube approval plan, or impose
a universal support-first/section-first construction order. Build order depends
on the actual object and reference.

Exit: the next action is a bounded primary geometry pass, not more speculative
planning.

### 3.4 Prepare / Open Bedrock Project

Goal: work in the established safe Bedrock Entity project workflow and preserve
recoverability.

Use the current verified project-opening/preset flow from the implementation and
module guidance. Do not promote a historical setup detail into policy when its
runtime behavior is unverified.

Exit: the intended Bedrock project is open and ready for geometry.

### 3.5 Primary Geometry Pass

Goal: create the minimum set of primary geometry needed for the model to read as
one coherent object.

Rules:

- build the **whole primary form**, not a polished local section while the rest
  of the object is undefined;
- choose Cubes/rotations from the active reference and modeller reasoning, not
  from universal anatomy templates;
- preserve major attachment/contact relationships;
- use the minimum geometry needed for silhouette, volume, support/attachment,
  or motion intent;
- defer small details, texture-driven forms, and cosmetic cleanup;
- use bounded batches when they reduce tool churn and remain safe/recoverable.

MCP tool success, numeric overlap, valid hierarchy, or a saved project is not
proof that the primary form looks correct.

Exit: all important primary masses exist and the object is recognizable enough
for a global visual check.

### 3.6 Primary Visual Gate

Goal: determine whether the **whole primary form** is good enough to refine.

Check at minimum:

- recognizable global silhouette;
- major proportion relationships;
- orientation;
- major mass placement;
- major contacts/attachments visible in the relevant views.

Use fresh Blockbench visual evidence from the active reference views. Do not
capture after every cube. Capture only views needed to judge the current whole
form.

If the global shape is wrong, repair primary relationships; do not hide the
problem by adding compensating detail Cubes.

Exit: primary form passes, or the workflow stops/replans with concrete visual
findings.

### 3.7 Secondary Geometry / Hierarchy / Pivots

Goal: add only geometry and structure that materially improve silhouette,
readability, attachment, texture support, or required motion.

Rules:

- preserve primary masses that already passed unless a new visual finding proves
  they are responsible for an issue;
- add detail from large-to-small visual importance;
- choose pivots/hierarchy for actual articulation or organization needs;
- after changing a parent transform, re-check affected child relationships when
  the change could alter visible attachment;
- do not add geometry solely to compensate for an unresolved primary-form error.

Exit: geometry/hierarchy/pivots support the intended asset without unnecessary
parts.

### 3.8 Full Geometry Review

Goal: review the complete geometry against the full declared Model Reference
view set.

Check:

- silhouette and major proportions across views;
- presence/orientation of primary parts;
- width/depth/footprint where visible;
- coherent visible contacts and connections;
- unnecessary/intersecting/inverted geometry;
- hierarchy/pivots where they affect the intended result.

A correction reopens only affected views/relationships. Do not restart every
view or rebuild the entire model automatically.

Exit: no unresolved critical/major geometry issue remains, or status is
`BLOCKED` / `NEEDS_REVIEW` with concrete findings.

### 3.9 UV / Texture

Goal: create usable UVs and texture appropriate to the requested scope.

Follow `06-texture-standard.md`. Do not use texture to conceal incorrect primary
geometry.

Exit: required surfaces are mapped and the requested texture scope is complete.

### 3.10 Texture Visual Gate

Goal: verify texture placement, material/readability, UV orientation, pattern
direction, and pixel-density consistency where relevant.

Exit: no unresolved texture issue that materially reduces the requested output.

### 3.11 Animation — Only When Required

Goal: add only animations required by the task.

Do not create animation as default ceremony. When animation is required, verify
pivots, hierarchy, clipping/detachment, and intended motion in Blockbench.

Exit: required animation works, or the task is explicitly blocked for local
proof/correction.

### 3.12 Final Validation

Goal: verify the current model revision against the requested output.

Required proof depends on the claim:

- structural claims require relevant structural inspection;
- visual claims require fresh visual evidence;
- animation claims require live animation evidence;
- saved-project claims require the project to be saved/reopenable when that can
  be tested in the active environment.

Do not turn unavailable local proof into a fake static check. ChatGPT → GitHub
may prepare implementation and hand off one exact local test to Codex.

Exit: `PASS`, `ISSUES_FOUND`, or `BLOCKED`/`NEEDS_REVIEW` with the limitation
stated accurately.

### 3.13 Save Project

Goal: save the reviewed `.bbmodel` through the current verified save workflow.

Exit: save is complete; reopening is proven only when actually tested.

## 4. Workflow Rules

- Whole-form understanding precedes local polish.
- The active reference decides object-specific relationships; this document does
  not define anatomy.
- Use the smallest useful geometry and the smallest useful proof.
- Do not require per-cube user approval, per-cube screenshots, universal
  construction order, numeric similarity scores, or repeated full-review loops.
- Keep one active model per task unless the task explicitly requires more.
- Do not repeat a stage without a concrete reason/new evidence.
- Stop the same unsuccessful correction direction after two attempts without
  new evidence and replan instead.
- Do not claim visual completion without visual evidence.
- Stop when the requested scope and required proof are complete.

## 5. Anti-Slop Failure Modes

Reject these patterns:

- locally plausible Cubes forming a globally wrong object;
- polishing one section before the whole primary form is coherent;
- compensating geometry added to hide a primary proportion error;
- fixture-specific rules promoted to generic product policy;
- per-cube planning/validation ceremony with no evidence benefit;
- automatic retries without a new visual finding/hypothesis;
- structural/tool success reported as resemblance.

## 6. Stop Conditions

Stop or replan when:

- the approved reference cannot support a required modelling decision;
- the primary form fails the visual gate and no new correction hypothesis exists;
- a critical/major full-geometry issue remains;
- required local/visual proof is unavailable;
- the requested scope is complete and further detail would not materially
  improve the intended result.
