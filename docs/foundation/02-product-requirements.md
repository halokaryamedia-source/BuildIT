# BlockIT — Product Requirements

**Status:** Active Policy  
**Version:** 1.4  
**Updated:** 2026-08-14  
**Primary Output:** editable Minecraft Bedrock Entity `.bbmodel`

## 1. Product Objective

A user can provide a simple natural-language request plus an approved visual
Modelling Brief, and BlockIT can create/revise a clean Bedrock model without
requiring the user to specify professional modelling or MCP details.

The system must prefer evidence-backed modelling decisions over assumptions.

## 2. Required Input

- user goal/request;
- approved Modelling Brief, or sufficient input to prepare one first.

Optional input:

- requested dimensions / target scale;
- explicit pose requirement;
- target use;
- texture style;
- animation requirement;
- design notes;
- suggested technical method.

A suggested method is not automatically a requirement. Preserve the user's goal
while rejecting a method that conflicts with current evidence or would reduce
quality.

Nonvisual user constraints such as target scale/height, target use, and other
downstream facts stay **outside the image** by default. Carry them as compact
Handoff Constraints alongside the approved Modelling Brief rather than forcing
them into captions, dimension text, manifests, or extra panels.

## 3. Canonical Product Flow

```text
Request
↓
Approved Modelling Brief + relevant Handoff Constraints
↓
View Pair Map + Reference Evidence Map
↓
Semantic Form
↓
Coordinate frame + target envelope when approved
↓
Construction + transform ownership + contact invariants
↓
Primary Form Hypothesis
↓
Coarse primary Cubes + required primary Groups/pivots
↓
Conditional structural observation only when it can change the decision
↓
Canonical model views
↓
Difference-first Reference ↔ model visual gate
↓
GLOBAL failure? → revise/rebuild Semantic Form or Primary Form Hypothesis
LOCAL failure?  → reuse fresh exact state, or inspect_element once if unavailable/stale
                → causal correction → fresh affected view(s) first
↓
Identity-weighted secondary geometry / neutral organization
↓
Full geometry review
↓
UV / texture when required
↓
Optional animation when required
↓
Final validation
↓
Save `.bbmodel` when in scope
```

Durable workflow policy: [03-modelling-workflow.md](03-modelling-workflow.md). Detailed current sequence: [Current Flow](../knowledge/flow.md).

## 4. Core Requirements

### PR-001 — Understand Intent

Identify the intended asset, Bedrock Entity target, expected output, required
scope, and only the material ambiguities that repository/reference evidence
cannot resolve.

### PR-002 — Use Reference Honestly

Use the approved Modelling Brief for visible silhouette, proportions, masses,
pose, contacts, orientation, and style. Use approved Handoff Constraints for
nonvisual facts such as target scale/height or target use.

Do not convert reference pixels/panel size into Cube coordinates or invent hidden
features from ambiguous evidence.

### PR-003 — Establish Spatial Contract Before Exact Transforms

Before primary Cube authoring:

- check cross-view consistency and explicit view pairing;
- for articulated subjects, confirm required limb/appendage count, pose state,
  attachment, negative-space, and ground/support consistency across views;
- form a Semantic Form for material masses/landmarks/count/topology before exact coordinates;
- establish X/Y/Z interpretation, front direction, and ground relation;
- establish target envelope when approved dimensions exist;
- identify construction/transform ownership and material contact invariants;
- form a temporary Primary Form Hypothesis for the major masses.

### PR-004 — Author Intentional Primary Geometry

Every new primary Cube must represent a known mass/necessary split.

Normal `place_cube` creation requires:

- explicit finite `from`;
- explicit finite `to`;
- explicit parent when a specific Group/bone is intended;
- explicit origin/pivot when initial rotation is non-zero.

Unrotated Cubes do not need pivot ceremony.

These input rules require intentional geometry but do not automatically prove it
is visually correct.

### PR-005 — Use Rotation/Pivot Causally

Rotation requires a visible form/slope or required-motion reason.

A material pivot requires an intended rotation center, joint, attachment, or
parent-transform reason. Do not use arbitrary/distant/copy-pasted pivots.

Pivot-only correction and geometry rewrite are different intents:

```text
Cube origin only
→ preserve visual position through pivot transfer

Cube origin + from/to/rotation
→ intentional authored transform rewrite
```

### PR-006 — Observe Before Approval

Use only observation that can change the next decision.

Current Local source provides:

- `inspect_model_bounds` for envelope/scale/ground/displacement questions;
- `capture_model_views` for canonical visual evidence.

Use `inspect_model_bounds` only when the numeric whole-model envelope materially matters. Do not call it as a ritual step after every blockout or correction. Successful observation calls are not visual `PASS`.

### PR-007 — Reject Bad Primary Scaffolds

If the whole object is unrecognizable or several primary relationships are wrong
together, revise/rebuild the Semantic Form or Primary Form Hypothesis and coarse blockout.

Do not preserve a bad scaffold because many Cubes already exist.

### PR-008 — Correct Local Problems From Exact State

When whole form is sound but one bounded relationship is wrong:

1. reuse known exact target identity when fresh; perform focused identity resolution only when missing/stale/ambiguous;
2. reuse fresh exact authored state already returned for that target; use `inspect_element` once only when required state is unavailable or stale;
3. classify the causal mismatch;
4. apply one coherent correction;
5. re-observe the affected view(s) first and expand only when material cross-view risk exists.

Use the causal vocabulary:

`TRANSLATE`, `RESIZE`, `ROTATE`, `REATTACH`, `SPLIT`, `MERGE/REMOVE`, `ADD MASS`.

Do not default to `ADD MASS`.

For one relationship spanning multiple Cubes, `modify_cubes_batch` may apply
different exact-UUID patches in one recoverable Undo unit.

### PR-009 — Gate Secondary Work After Primary Form Passes

Form/contact/articulation-defining Groups and pivots may belong in the primary blockout when they own the judged form. After primary `PASS`, add only grounded secondary geometry and neutral organization. Texture support and optional animation must not be used to compensate for unresolved primary-form errors.

### PR-010 — Texture Supports Geometry

UV/texture are applied after geometry is coherent. Texture must not hide wrong
silhouette/proportion.

### PR-011 — Animation Only When Required

Do not animate by default. Required animation must use meaningful hierarchy and
pivots and be visually checked for clipping/detachment/motion quality.

### PR-012 — Separate Structural And Visual Proof

The following do not prove visual correctness by themselves:

- tool success;
- valid coordinates;
- all Cubes existing;
- technical attachment/overlap;
- valid hierarchy;
- successful bounds check;
- valid rotation/pivot values;
- saved/reopenable file;
- numeric similarity score.

Visual claims require fresh current-revision images compared with the reference.

### PR-013 — Honest Runtime Claims

ChatGPT→GitHub can establish source contracts only. Live Blockbench/MCP behavior,
visual transport, Undo behavior, persistence, and visual model quality require
local runtime/visual proof before being reported as verified.

### PR-014 — Save/Editability

When saving is part of scope, produce a clean understandable `.bbmodel` through
the currently verified workflow. Claim reopen fidelity only when actually tested.

## 5. In Scope

- request normalization;
- approved-reference-driven Cuboid modelling;
- project/geometry observation;
- Cube creation/correction;
- Group/hierarchy/pivot work when justified;
- UV/texture;
- optional animation;
- structural and visual validation;
- saving `.bbmodel` when requested/available.

## 6. Out Of Scope

Unless separately requested/proven:

- full behavior/resource-pack integration;
- gameplay scripting;
- Marketplace publishing;
- realistic sculpt/render pipelines;
- unrelated engines/Hytale production;
- automatic image/mesh→Cuboid reconstruction;
- SF3D geometry authority;
- IoU/projection/similarity approval;
- automatic pivot/joint planner;
- all-in-one model builder that bypasses the fidelity loop.

## 7. Quality Requirements

### Visual

- recognizable whole form;
- coherent silhouette and primary proportions;
- correct major orientation/contacts;
- articulated subjects preserve approved pose, limb count/attachment, ground
  contact/support, and important negative spaces;
- important rotations justified by form/motion;
- meaningful pivots justified by transform relationships.

### Structural

- explicit/intentional authored transforms;
- clean hierarchy and semantic naming;
- exact target identity where mutation matters;
- recoverable bounded edits where practical;
- no accidental temporary/compensating geometry.

### Efficiency

- minimum meaningful Cuboids;
- minimum useful observation/proof;
- reuse fresh returned state instead of ritual readback;
- no per-Cube screenshot/approval ceremony;
- no repeated full review for genuinely local changes;
- stop repeated failed correction direction after two attempts without new
  evidence.

## 8. Definition Of Done

A modelling task is complete when:

- request/scope, approved reference, and material Handoff Constraints are understood;
- whole primary form passed the required visual gate;
- required primary hierarchy/pivots are established when form-defining;
- required secondary geometry and neutral organization are complete;
- texture/animation are complete only when in scope;
- no unresolved critical/major visual issue remains;
- required structural and visual evidence exists;
- save/output is complete when part of scope;
- unavailable local-only proof is reported rather than inferred.

## 9. Evidence Boundary

Current Local source contains the main Reference Fidelity observation,
correction, targeting, and pivot/initial-placement safety mechanisms. Their live
Blockbench/MCP integration is `LOCAL PROOF REQUIRED` until deliberately tested.

See [Current Validation](../knowledge/current-validation.md) and
[Implementation Map](../knowledge/implementation-map.md).
