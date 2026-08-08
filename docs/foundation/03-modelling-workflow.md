# BlockIT — Operating Model Workflow

**Status:** Draft  
**Version:** 1.2

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
Check cross-view consistency
↓
Establish coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Prepare/open Bedrock project
↓
Coarse Primary Geometry Pass
↓
Primary structural envelope check
↓
Primary visual gate
↓
PASS? ── no → revise/rebuild Primary Form Hypothesis
  │
 yes
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

Before modelling, check that the views are compatible enough to describe one
coherent object. Use each axis only where one or more views actually provide
useful evidence:

- width is normally constrained by front/back and top/footprint evidence;
- height is normally constrained by front/back and side evidence;
- length/depth is normally constrained by side and top/footprint evidence;
- placement/orientation of a mass must cite the view(s) that make that relation
  visible.

These are **evidence directions**, not image-pixel measurements. If required
views materially disagree, stop at reference review rather than averaging them
into guessed geometry.

Exit: the reference is sufficiently clear to support a whole-form spatial
hypothesis. If the reference itself must be created/repaired, use
`04-reference-guide.md` first.

### 3.3 Coordinate Frame And Target Envelope

Goal: remove avoidable spatial ambiguity before exact Blockbench coordinates are
chosen.

Establish a simple model-space convention for the active asset:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
+Y = up
ground plane = declared project ground (normally Y=0 unless the active project says otherwise)
front direction = explicit for this asset
```

Also establish the approved overall width/height/length envelope when dimensions
are available. The coordinate frame is a reasoning convention, not an object-
specific anatomy rule.

Do not silently mirror the object, swap front/back, or infer a different ground
plane after geometry begins. If orientation is ambiguous in the reference, mark
that ambiguity instead of inventing certainty.

Exit: the agent can describe where primary masses belong in one consistent 3D
frame.

### 3.4 Primary Form Hypothesis

Goal: bridge visual understanding to numeric Cuboid authoring without jumping
straight from prose/image interpretation to arbitrary `from/to/origin/rotation`
values.

Create a **temporary normalized spatial hypothesis** for primary masses only.
For each important primary mass, record only what materially constrains the
first pass:

```text
role / semantic name
relative size within the whole envelope
relative center/placement within the whole envelope
main orientation/slope when visually important
major contact/attachment relationship
supporting reference view(s)
uncertainty when evidence is weak
```

Relative values may use approximate percentages or qualitative ranges such as
"about half the total length", "upper-front", or "narrower than body". They are
modeller hypotheses, not pixel measurements or locked transforms.

Do not create a locked per-Cube blueprint, mandatory Cube count, section plan,
or exact-transform approval sheet. The purpose is to make the whole-form spatial
reasoning explicit enough that exact Blockbench coordinates are **derived from a
coherent hypothesis instead of guessed independently Cube by Cube**.

Exit: all primary masses have a reasoned relative scale, placement, orientation,
and relationship supported by the reference.

### 3.5 Prepare / Open Bedrock Project

Goal: work in the established safe Bedrock Entity project workflow and preserve
recoverability.

Use the current verified project-opening/preset flow from the implementation and
module guidance. Do not promote a historical setup detail into policy when its
runtime behavior is unverified.

Exit: the intended Bedrock project is open and ready for geometry.

### 3.6 Coarse Primary Geometry Pass

Goal: create the minimum set of primary geometry needed for the model to read as
one coherent object.

Rules:

- build the **whole primary form**, not a polished local section while the rest
  of the object is undefined;
- every primary Cuboid must implement a declared primary-mass role or a necessary
  split of that mass; never place a Cube merely because there is empty space or
  because it can be made to touch another Cube;
- derive exact `from/to/origin/rotation` from the coordinate frame, target
  envelope, Primary Form Hypothesis, and relevant reference views;
- use axis-aligned geometry when it represents the mass correctly; rotation is
  allowed only when a visible slope/orientation or required motion makes it the
  better representation;
- preserve major attachment/contact relationships visually, not merely by
  coordinate overlap;
- use the minimum geometry needed for silhouette, volume, attachment, or motion
  intent;
- defer small details, texture-driven forms, and cosmetic cleanup;
- use bounded batches when they reduce tool churn and remain safe/recoverable.

A successful `place_cube`, numeric overlap, valid hierarchy, or a Cube that is
"attached" is **not evidence that the placement is correct**.

Exit: all important primary masses exist as a coarse blockout that can be judged
as one object.

### 3.7 Primary Structural Envelope Check

Goal: detect gross scale/position failures that camera framing can hide.

When the runtime provides the required inspection capability, compare current
model bounds with the approved target envelope and ground relationship before
visual approval.

This check may establish that the model is too large/small, mirrored, displaced,
or floating. It **cannot** prove resemblance or visual quality.

If the capability is unavailable, do not fabricate the result; proceed only with
claims that can actually be observed and keep the missing structural evidence
explicit.

### 3.8 Primary Visual Gate

Goal: determine whether the **whole primary form** is good enough to refine.

Compare model evidence directly against the corresponding reference view(s).
Check at minimum:

- recognizability;
- global silhouette;
- major proportion relationships;
- primary mass placement;
- important orientation/slopes;
- major contacts/attachments visible in the relevant views.

A valid visual review must name concrete mismatches when present. Generic prose
such as "looks good", "all parts are attached", or "the Cubes are placed" cannot
produce `PASS`.

#### Hard rebuild threshold

Reject the current primary pass instead of micro-patching it when:

- the object is not recognizable as the intended target; or
- the failure spans multiple primary relationships such as silhouette + mass
  proportion + placement/orientation; or
- the correction would require compensating detail to hide a wrong whole-form
  hypothesis.

In that case, revise/rebuild the **Primary Form Hypothesis and coarse blockout**.
Do not keep a bad primary scaffold merely because many Cubes already exist.

If the overall form is sound and only one bounded relationship is wrong, use a
targeted correction.

Exit: primary form passes, or the workflow explicitly invalidates/revises the
hypothesis with concrete visual findings.

### 3.9 Secondary Geometry / Hierarchy / Pivots

Goal: add only geometry and structure that materially improve silhouette,
readability, attachment, texture support, or required motion.

Rules:

- preserve primary masses that already passed unless a new visual finding proves
  they are responsible for an issue;
- add detail from large-to-small visual importance;
- choose hierarchy for actual organization/articulation needs;
- choose pivots only when there is a concrete transform/articulation/attachment
  reason; an arbitrary pivot is a modelling defect, not harmless metadata;
- after changing a pivot or parent transform, re-check the affected visible
  relationships before assuming they remain coherent;
- do not add geometry solely to compensate for an unresolved primary-form error.

Exit: geometry/hierarchy/pivots support the intended asset without unnecessary
parts or unexplained transforms.

### 3.10 Full Geometry Review

Goal: review the complete geometry against the full declared Model Reference
view set.

Check:

- silhouette and major proportions across views;
- presence/orientation of primary parts;
- width/depth/footprint where visible;
- coherent visible contacts and connections;
- unnecessary/intersecting/inverted geometry;
- rotations that do not correspond to a visible/form/function need;
- pivots that are distant, arbitrary, or inconsistent with intended
  articulation/attachment;
- hierarchy/pivots where they affect the intended result.

A correction reopens only affected views/relationships unless it reveals that
the primary hypothesis was wrong. Do not restart the whole model for a genuinely
local issue, but do not protect a failed primary hypothesis from rebuild either.

Exit: no unresolved critical/major geometry issue remains, or status is
`BLOCKED` / `NEEDS_REVIEW` with concrete findings.

### 3.11 UV / Texture

Goal: create usable UVs and texture appropriate to the requested scope.

Follow `06-texture-standard.md`. Do not use texture to conceal incorrect primary
geometry.

Exit: required surfaces are mapped and the requested texture scope is complete.

### 3.12 Texture Visual Gate

Goal: verify texture placement, material/readability, UV orientation, pattern
direction, and pixel-density consistency where relevant.

Exit: no unresolved texture issue that materially reduces the requested output.

### 3.13 Animation — Only When Required

Goal: add only animations required by the task.

Do not create animation as default ceremony. When animation is required, verify
pivots, hierarchy, clipping/detachment, and intended motion in Blockbench.

Exit: required animation works, or the task is explicitly blocked for local
proof/correction.

### 3.14 Final Validation

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

### 3.15 Save Project

Goal: save the reviewed `.bbmodel` through the current verified save workflow.

Exit: save is complete; reopening is proven only when actually tested.

## 4. Correction Vocabulary

When geometry is wrong, diagnose the relationship before choosing the edit.
Prefer these causal operations:

```text
TRANSLATE  → placement is wrong
RESIZE     → proportion/extent is wrong
ROTATE     → orientation/slope is wrong
REATTACH   → parent/contact relationship is wrong
SPLIT      → one mass truly needs more than one orientation/volume
MERGE/REMOVE → geometry is unnecessary or compensatory
```

Do not default to `ADD CUBE`. Adding geometry is justified only when a missing
visible volume/silhouette/detail actually requires another mass.

## 5. Workflow Rules

- Whole-form understanding precedes local polish.
- The active reference decides object-specific relationships; this document does
  not define anatomy.
- Do not author exact Cuboid transforms before the coordinate frame and primary
  spatial hypothesis are coherent enough to support them.
- A Cube being created, connected, overlapping, grouped, or syntactically valid
  never authorizes approval.
- Rotation requires a visible orientation/form or required-motion reason.
- Pivot requires a concrete transform/articulation/attachment reason.
- Use the smallest useful geometry and the smallest useful proof.
- Do not require per-cube user approval, per-cube screenshots, universal
  construction order, numeric similarity scores, or repeated full-review loops.
- Keep one active model per task unless the task explicitly requires more.
- Do not repeat a stage without a concrete reason/new evidence.
- Stop the same unsuccessful correction direction after two attempts without
  new evidence and replan instead.
- Do not claim visual completion without visual evidence.
- Stop when the requested scope and required proof are complete.

## 6. Anti-Slop Failure Modes

Reject these patterns:

- arbitrary Cubes placed because they can be attached somewhere;
- locally plausible Cubes forming a globally wrong object;
- approving a model because all planned Cubes exist;
- polishing one section before the whole primary form is coherent;
- compensating geometry added to hide a primary proportion error;
- arbitrary multi-axis rotations with no reference/form reason;
- pivots chosen because a field requires a number rather than because the model
  needs a rotation/articulation center;
- preserving a grossly wrong blockout because rebuilding feels expensive;
- fixture-specific rules promoted to generic product policy;
- per-cube planning/validation ceremony with no evidence benefit;
- automatic retries without a new visual finding/hypothesis;
- structural/tool success reported as resemblance.

## 7. Stop Conditions

Stop or replan when:

- the approved reference cannot support a required modelling decision;
- coordinate orientation/front/ground is materially ambiguous;
- the Primary Form Hypothesis lacks enough evidence for a required primary mass;
- the primary form fails the hard rebuild threshold;
- the primary form fails the visual gate and no new correction hypothesis exists;
- a critical/major full-geometry issue remains;
- required local/visual proof is unavailable;
- the requested scope is complete and further detail would not materially
  improve the intended result.
