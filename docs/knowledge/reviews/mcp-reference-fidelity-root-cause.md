# MCP Reference Fidelity Root-Cause Review

**Status:** ROOT CAUSE CONFIRMED / RULES HARDENED
**Date:** 2026-08-08
**Scope:** Why Reference Image / Modelling Brief → Blockbench `.bbmodel` can diverge grossly even when MCP tools execute correctly.

## Problem Statement

The primary BlockIT issue is not that MCP cannot create Cubes. The issue is that a
visually understandable reference can become a Blockbench model whose whole form,
silhouette, proportions, primary mass relationships, rotations, or pivots are far
from the target.

This is a **Reference → 3D reasoning → numeric Cuboid → visual feedback** failure.

A technically successful MCP call, valid Cuboid coordinates, valid hierarchy,
successful attachment, or successful save does not prove reference fidelity.

## Confirmed Testing Insights

Repeated prior testing has shown two concrete failure patterns:

1. **Placement-by-existence:** the agent tends to place Cubes wherever they can be
   made to fit/connect, then treats "all Cubes are placed/attached" as progress or
   approval even when the whole object is visibly wrong.
2. **Abstract transform authoring:** rotations and pivots can become arbitrary or
   overcomplicated because values are chosen without a clear reference-visible
   slope, joint, attachment, or transform purpose.

These are not harmless implementation details. They explain how a model can be
structurally valid while visually unrecognizable.

## Central Diagnosis

Current Local historically allowed a direct jump from qualitative visual
understanding to exact mutation values:

```text
Reference / Modelling Brief
↓
"I see body / head / handle / support / etc."
↓
agent invents exact from/to/origin/rotation
↓
MCP faithfully executes them
↓
Cubes are technically present/attached
↓
weak/non-standardized review
↓
agent can rationalize or micro-patch the wrong whole form
```

The missing control layer is not another large planner. It is a small,
evidence-backed **Reference Fidelity Loop** that prevents exact transforms from
being authored without a coherent spatial reason and prevents structural success
from becoming visual approval.

The old Zebra audit already demonstrated the same architectural failure: exact
Cube transforms were chosen without a stable reference-grounded spatial contract,
local contact could pass while global shape failed, and free-form visual reports
could accept a visibly bad model.

## Root Causes — Ranked

### R1 — No stable coordinate frame + normalized Primary Form Hypothesis before exact transforms

The agent needs a bridge between visual understanding and Blockbench numbers.
Before primary authoring it should establish:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
front direction
ground relationship
overall target envelope when supplied
```

Then, for primary masses only:

```text
role
relative size
relative center/placement
important orientation/slope
major contact/attachment
supporting reference view(s)
uncertainty when evidence is weak
```

This is temporary modeller reasoning, not pixel measurement, not a locked Cube
plan, and not a machine-authoritative geometry contract.

### R2 — Placement can be justified by attachment instead of visual role

A Cube can touch another Cube and still be completely wrong for the reference.
Every important primary Cuboid must implement a known primary mass/necessary
split and preserve a reference-backed relationship.

The following are explicitly invalid approval reasons:

```text
Cube exists
Cube is attached
AABBs overlap
hierarchy accepts it
tool returned success
```

If a Cube's only explanation is "it fits here" or "it connects", the placement is
not sufficiently reasoned.

### R3 — Rotation is under-constrained

Rotation should not be used merely to make the model look more sophisticated.
A material rotation needs a visible/form/motion reason:

- a reference view shows a meaningful slope/orientation;
- one rotated Cuboid better expresses the silhouette than a stepped stack; or
- required articulation/motion needs the orientation.

Arbitrary multi-axis rotations, copied fixture angles, and repeated small angle
patches without new evidence are anti-patterns.

Rotation must not compensate for wrong size or placement.

### R4 — Pivot is under-constrained

A pivot/origin becomes visually dangerous when it is treated as a number that
must simply be filled.

A meaningful pivot must correspond to an intended:

- rotation center;
- joint/articulation;
- attachment relationship; or
- parent/group transform.

Random distant pivots, copied pivot values, and pivots chosen without a transform
purpose are modelling defects even when Blockbench accepts them.

### R5 — Current visual feedback is not standardized enough for direct comparison

`capture_screenshot` returns the current Blockbench view. Local still lacks a
simple canonical multi-view observation capability with named view semantics,
controlled projection/framing, and state restoration.

Model/reference comparison can therefore drift because of camera orientation,
projection, zoom, framing, selection, or active-project state.

### R6 — Auto-framing can hide global scale/ground errors

A perfectly framed screenshot can make an oversized, undersized, displaced, or
floating model appear compositionally reasonable.

Visual evidence therefore needs a cheap **structural envelope companion**:
current model bounds, size, center, and ground relation compared with approved
target dimensions when available.

That evidence catches gross scale/position failure but cannot prove resemblance.

### R7 — No precise authored-state read after a local mismatch is identified

Once the visual critic says "this mass is too high/short/rotated", the agent
needs exact current authored state before correcting it:

- parent;
- from/to/size;
- origin/pivot;
- rotation;
- visibility;
- relevant texture/UV summary when needed.

Without a focused read, the correction itself can become another guess.

### R8 — Corrections are too easy to make as isolated micro-edits

Primary-form errors often involve several masses. Repeated one-Cube patches can
preserve the wrong whole-form hypothesis.

A simple heterogeneous batch correction is useful only **after** the visible
problem and responsible relationship are known.

### R9 — The reference can itself be inconsistent

A generated five-view Modelling Brief must describe one compatible object.
Width, height, length, placement, and important slope decisions should have
supporting views. Materially conflicting views should stop at reference review;
they must not be averaged into guessed coordinates.

### R10 — The normal MCP surface is broader than the Bedrock modelling problem

Generic mesh, armature, PBR, Hytale, UI automation, evaluation, and import tools
increase context/tool-choice surface without improving reference fidelity.
This remains a later curation concern, not the first fix.

## Rules Now Hardened

The canonical modelling rules now require:

1. cross-view consistency before primary authoring;
2. explicit coordinate frame/front/ground convention where relevant;
3. temporary normalized Primary Form Hypothesis before exact Cuboid transforms;
4. every primary Cube to implement a reasoned mass role;
5. "placed/attached/valid" never to count as visual approval;
6. rotation to have a reference/form/motion reason;
7. meaningful pivots to have a transform/joint/attachment reason;
8. direct reference↔model comparison for visual gates;
9. hard rejection/rebuild when the whole primary scaffold is unrecognizable or
   fails several primary relationships;
10. causal correction vocabulary rather than default `ADD CUBE` behavior.

Canonical owners updated:

- `docs/foundation/03-modelling-workflow.md`;
- `docs/foundation/05-geometry-standard.md`;
- `docs/foundation/07-visual-validation.md`;
- `.agents/skills/blockbench-bedrock-modelling/SKILL.md`;
- `mcp/prompts/bedrock.md`.

## Reference Fidelity Loop v1

```text
APPROVED REFERENCE
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
NORMALIZED PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY BLOCKOUT
↓
STRUCTURAL ENVELOPE OBSERVATION
↓
CANONICAL MODEL VIEWS
↓
REFERENCE ↔ MODEL COMPARISON
↓
CLASSIFY FAILURE
  │
  ├─ GLOBAL → invalidate/revise hypothesis + rebuild coarse blockout
  │
  └─ LOCAL → inspect authored state → causal correction
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or the hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Primary Form Hypothesis Boundary

### It MAY contain

```text
overall envelope / requested dimensions
coordinate/front/ground convention
primary mass names/roles
relative size estimates
relative center/placement estimates
important orientation/slopes
major attachment relationships
supporting view constraints
explicit uncertainty
```

### It MUST NOT become

```text
locked per-Cube transforms
a mandatory Cube count
pixel-derived calibration
IoU/similarity targets
section-first construction order
per-Cube approval
object-specific anatomy law
```

Approximate normalized ratios are internal modeller hypotheses. They are not
measurements from image pixels and must remain revisable by visual evidence.

## Evidence-Backed Axis Rule

For important primary dimensions/placement, identify which view(s) constrain the
reasoning rather than pretending every view supplies every axis.

Typical evidence directions:

```text
WIDTH  ← front/back + top
HEIGHT ← front/back + side
LENGTH ← side + top
```

Object/view packages can vary; this is not a fixed camera law. The principle is
that a spatial claim must come from a view that actually shows it.

If an important decision has weak evidence, mark uncertainty and check it early.
Do not manufacture exact confidence.

## Global Vs Local Failure

### Global failure

Examples:

- object is not recognizable;
- whole silhouette is wrong;
- several primary proportions/placements are wrong together;
- primary orientation/front/ground relation is wrong.

Action:

```text
invalidate current primary hypothesis
→ revise/rebuild coarse blockout
```

Do not protect the blockout because many Cubes already exist.

### Local failure

Examples:

- one otherwise-correct mass is slightly too long/high/wide;
- one attachment is misplaced;
- one clear slope/rotation is wrong;
- one pivot is wrong while the primary form remains sound.

Action:

```text
inspect exact authored state
→ choose causal correction
→ fresh affected views
```

## Causal Correction Vocabulary

Before mutation, classify the issue:

```text
TRANSLATE   placement is wrong
RESIZE      extent/proportion is wrong
ROTATE      orientation/slope is wrong
REATTACH    contact/parent relationship is wrong
SPLIT       one mass genuinely needs separate orientation/volume
MERGE/REMOVE geometry is unnecessary/compensatory
ADD MASS    a required visible volume is genuinely missing
```

`ADD MASS` is not the default response to a mismatch.

## Visual Approval Contract

Free-form "looks good" review is invalid.

At a primary gate, answer concrete applicable questions:

1. Does the whole silhouette read as the intended target?
2. Which primary mass is too large/small/long/short/wide/narrow?
3. Which primary mass is misplaced relative to another?
4. Which important orientation/slope is wrong?
5. Which visible contact is wrong?
6. Which reference/model view(s) prove the mismatch?
7. Are any important rotations/pivots unexplained by reference/form/function?

A `PASS` whose main evidence is structural validity is invalid.

## Required Observation Capabilities — Next Architectural Work

The hardened rules expose a small runtime observation gap. Before adding more
mutation power, define the public read-only contracts for:

### `inspect_model_bounds`

Purpose:

- current min/max/size/center;
- ground relation;
- orientation/target-envelope metadata when available;
- no visual score or approval.

This prevents camera auto-framing from hiding gross scale/position errors.

### `capture_model_views`

Purpose:

- named requested model views;
- principal orthographic views + perspective 3/4 where relevant;
- stable framing metadata;
- restore prior project/camera/selection state;
- return actual image evidence usable by the vision-capable client;
- no similarity score or automatic PASS.

These are **observation instruments**, not a new modelling brain.

Later, after observation works:

```text
inspect_element
→ modify_cubes_batch
→ focused mutation safety
→ static/default Bedrock surface reduction
```

## What Not To Build

Do not attempt to solve fidelity by adding:

- more mutation primitives before observation/reasoning is fixed;
- automatic image→Cube conversion;
- SF3D/mesh decomposition;
- projection/IoU/similarity scoring as authority;
- fixed section/anchor/contact rules;
- all-in-one Bedrock builder;
- arbitrary rotation/pivot helpers that make unexplained transforms easier;
- automatic detail generation before primary-form pass;
- a second large orchestration framework;
- an external vision verifier before the simpler same-agent visual loop is shown
  insufficient.

## Hard Dependency To Prove Later

The visual loop only works if the MCP client/agent actually receives captured
model views as image content that the vision-capable model can inspect. A path,
base64 string, or tool-success message that is never exposed as usable visual
input does not satisfy this dependency.

This is a future runtime proof requirement, not the current ChatGPT→GitHub task.

## Immediate Direction

Local testing is not the current focus.

G3 remains paused.

The next step is to define the **minimal read-only observation contract** for
`inspect_model_bounds` + `capture_model_views` from these hardened modelling
rules before implementing either tool. The contracts must expose only evidence
needed to prevent assumption-driven authoring and false visual approval.
