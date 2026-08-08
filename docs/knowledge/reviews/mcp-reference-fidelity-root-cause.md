# MCP Reference Fidelity Root-Cause Review

**Status:** DISCUSSION / ARCHITECTURE REVIEW
**Date:** 2026-08-08
**Scope:** Why Reference Image / Modelling Brief → Blockbench `.bbmodel` can diverge grossly even when MCP tools execute correctly.

## Problem Statement

The primary BlockIT issue is not that MCP cannot create Cubes. The issue is that a
visually understandable reference can become a Blockbench model whose whole form,
silhouette, proportions, or primary mass relationships are far from the target.

This is a **Reference → 3D reasoning → numeric Cuboid → visual feedback** failure.

A technically successful MCP call, valid Cuboid coordinates, valid hierarchy, or
successful save does not prove reference fidelity.

## Central Diagnosis

Current Local has a gap between visual reasoning and exact numeric mutation:

```text
Reference / Modelling Brief
↓
qualitative visual understanding
↓
MISSING: stable whole-form spatial hypothesis
↓
agent invents exact from/to/origin/rotation values
↓
MCP faithfully executes them
↓
current-view screenshot / weak comparison
↓
agent can rationalize the result instead of correcting global form
```

The old Zebra audit already demonstrated this failure mode: exact Cube transforms
were chosen without a reference-grounded spatial contract, local contact could
pass while global shape failed, and free-form visual reporting could accept a
visibly bad model.

The current foundation correctly rejects structural success as visual success,
but policy alone does not supply the missing spatial hypothesis or deterministic
visual feedback surface.

## Root Causes — Ranked

### R1 — No explicit whole-form spatial hypothesis before numeric Cuboid authoring

Current guidance says to understand primary masses and the whole form, but the
runtime input still requires exact numeric `from`, `to`, `origin`, and `rotation`.
There is no lightweight intermediate representation that stabilizes the agent's
interpretation before those numbers are chosen.

This does **not** justify returning to a locked per-Cube plan. The missing object
should be a temporary **Primary Form Hypothesis** describing only major masses
and relationships.

Useful contents:

- overall target dimensions/envelope when supplied;
- primary masses only;
- approximate size ratios relative to the whole object;
- relative center/placement relationships;
- main orientation/slope where visually important;
- major contacts/attachments;
- the few reference views that constrain each relationship.

This hypothesis is modeller reasoning, not reference truth or MCP validation.
It may be revised after visual feedback.

### R2 — Current visual feedback is not standardized enough for direct comparison

`capture_screenshot` returns the current Blockbench view. `set_camera_angle` can
set arbitrary transforms, but Local has no simple canonical multi-view capture
with named view semantics, auto-framing, and guaranteed state restoration.

That means model/reference comparison can vary by camera orientation, projection,
zoom, framing, selected project, and editor state. A bad shape may therefore be
harder for the agent to compare consistently.

The most valuable idea from Sample is the small core of
`capture_bedrock_preview`: named generic views, auto-frame, bounded batch capture,
and restoration. The particle/file-output complexity is not required.

### R3 — No precise authored-state read for the element responsible for a visual mismatch

`find_elements_by_criteria` is useful for locating elements, but normal results
primarily identify element name/UUID/type/parent. After the visual critic says
"the front mass is too high and too short", the agent still needs exact current
Cuboid bounds/origin/rotation/parent/UV state before making a targeted correction.

A small `inspect_element` / authored-element resource would close this gap and
avoid `risky_eval` or full project dumps.

### R4 — Corrections are too easy to make as isolated micro-edits

Primary-form errors often involve relationships among several masses. A one-Cube
correction can preserve the wrong global relationship and trigger patch churn.

A simple heterogeneous `modify_cubes_batch` would allow one coherent correction
hypothesis to update several explicit primary masses inside one Undo transaction.
It should not inherit Rework's analyzer/manifest/gap machinery.

### R5 — The reference can itself be an invalid modelling target

A generated five-view reference must be internally consistent and intentionally
Blockbench/Cuboid-buildable. If views disagree materially, show smooth realistic
geometry with pixel skin, or depict different constructions per view, no MCP
workflow can reliably reconstruct it.

Reference readiness therefore remains a real gate. But when a human can clearly
understand the same reference while the generated model is grossly wrong, the
main failure is downstream spatial reasoning/feedback rather than reference
preparation.

### R6 — The normal MCP surface is broader than the Bedrock modelling problem

Generic mesh, armature, PBR, Hytale, UI automation, evaluation, and import tools
increase context/tool-choice surface without improving the normal Cuboid visual
control loop.

Slice A improves prompt routing, but the client may still receive a large public
tool catalog. A later static/default Bedrock production surface may reduce noise.
Do not build dynamic Rework profiles/state machines to solve this.

## What Slice A Solves — And Does Not Solve

Slice A correctly changes normal guidance from:

```text
choose ui | programmatic | import
```

to:

```text
orient
→ whole-form
→ primary Cuboids
→ visual gate
→ correction
→ secondary structure
→ texture / optional animation
```

This is necessary, but not sufficient.

It changes the **order of reasoning**; it does not yet improve:

- how whole-form understanding becomes stable numeric geometry;
- how model views are normalized for comparison;
- how an identified visual mismatch maps to exact current model state;
- how several responsible masses are corrected coherently.

## Recommended Control Architecture

The intended system should behave as a visual closed loop:

```text
APPROVED REFERENCE
↓
REFERENCE READINESS CHECK
↓
PRIMARY FORM HYPOTHESIS
  - overall envelope
  - 3–8 primary masses as needed
  - relative size/placement/orientation
  - major contacts
  - relevant views
↓
BOUNDED PRIMARY BUILD
↓
CANONICAL MODEL VIEWS
  front / side / back / top / 3/4 as needed
↓
VISION-BASED COMPARISON
  silhouette
  mass ratios
  placement
  orientation
  contacts
↓
NAME ONE OR FEW MATERIAL MISMATCHES
↓
TARGETED AUTHORED-STATE INSPECTION
↓
COHERENT BATCH CORRECTION
↓
FRESH AFFECTED VIEWS
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

MCP is the actuator and evidence provider. The vision-capable agent remains the
visual modeller/judge. Do not attempt to make MCP itself infer semantic 3D form
from pixels.

## Primary Form Hypothesis — Important Boundary

The hypothesis must not recreate the rejected historical Geometry Plan.

### It MAY contain

```text
overall envelope / requested dimensions
primary mass names
relative size estimates
relative center/placement estimates
important orientation/slopes
major attachment relationships
view constraints
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

Approximate normalized ratios such as a mass occupying roughly 60% of the total
length may be used as an internal modeller hypothesis. They are not measurements
from image pixels and are revised by visual evidence.

## Visual Review Contract

Free-form "looks good" review is too weak. At each whole-form gate, the agent
should answer concrete applicable questions:

1. Does the global silhouette read as the target?
2. Which primary mass is too large/small/long/short/wide/narrow?
3. Which primary mass is misplaced relative to another?
4. Which major orientation/slope is wrong?
5. Which required visible contact is detached or merged incorrectly?
6. Which views prove the mismatch?

A `PASS` without concrete comparison against these questions is invalid.

The server should not produce a visual `PASS` from structural conditions.

## Tool Priorities Reconsidered For Fidelity

Because the active issue is gross visual mismatch, implementation priority should
change from the previous curation order.

### P0 — `capture_model_views`

Recover only the useful core from Sample:

- named generic front/back/left/right/top/bottom/3/4 views;
- orthographic for principal views, perspective for 3/4;
- auto-frame current geometry or selected scope;
- batch only requested views;
- restore camera/project/selection/state in `finally`;
- return images + simple metadata;
- no automatic visual score.

This is the highest-leverage missing capability because visual correction is
impossible when the observation surface is unstable.

### P1 — `inspect_element`

Return exact authored state for one explicit Cube/group:

- UUID/name/type;
- parent;
- Cube from/to/size/origin/rotation/visibility;
- group origin/rotation when applicable;
- texture/UV summary when useful.

Read only. No selection dependence and no arbitrary JavaScript execution.

### P2 — `modify_cubes_batch`

Apply heterogeneous explicit updates to several Cube IDs in one Undo transaction.
Preflight all targets before opening Undo; cancel/rollback on error.

### P3 — safer existing Cuboid mutations

Recover focused Rework safety only:

- provided missing group = error by default;
- untextured Geometry allowed;
- explicit target preferred over implicit selection;
- cancel Undo on mutation error.

### P4 — static/default Bedrock public surface curation

After the visual loop works, reduce normal context noise by hiding generic
mesh/PBR/Hytale/UI/eval surfaces from the normal Bedrock path while retaining them
for explicit specialist use. Do not add dynamic profiles or a production state
machine.

## What Not To Build

Do not attempt to solve fidelity by adding:

- more primitive shape/mutation tools without observation/feedback;
- automatic image→Cube conversion;
- SF3D/mesh decomposition;
- projection/IoU/similarity scoring as authority;
- fixed section/anchor/contact rules;
- all-in-one Bedrock builder;
- automatic detail generation before primary-form pass;
- a second large orchestration framework;
- an external vision verifier before the simpler same-agent visual loop is proven
  insufficient.

These either preserve the missing reasoning gap or add false confidence.

## Failure Classification For Future Examples

Before changing tools, classify a bad result:

### A — Reference failure

Human/agent cannot reconstruct the intended form consistently from the provided
views. Fix Reference Generator / Modelling Brief.

### B — Primary synthesis failure

Reference is clear, but first whole-form Cuboid pass is grossly wrong. Rebuild the
Primary Form Hypothesis; do not add details.

### C — Observation failure

Model may be closer than reported, but camera/framing/projection makes direct
comparison unreliable. Fix canonical capture.

### D — Correction failure

Mismatch is visible but current exact model state cannot be inspected or several
responsible masses cannot be corrected coherently. Improve authored-state read /
batch correction.

### E — Secondary drift

Primary form was acceptable, but hierarchy/detail/texture/animation later damages
it. Reopen only the affected relationship/stage.

## Recommended Immediate Direction

Do not make local prompt proof the active project goal.

Do not resume G3 yet.

The next architectural discussion should approve/refine this **Visual Control
Loop** and especially the Primary Form Hypothesis boundary. Once accepted, the
first implementation slice should be the minimal canonical `capture_model_views`
capability plus prompt/skill routing that requires a primary visual gate before
secondary detail.

No runtime code is changed by this review.
