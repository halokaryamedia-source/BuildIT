# BlockIT — Product Requirements

**Status:** Active Policy  
**Version:** 1.2  
**Updated:** 2026-08-08  
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

- requested dimensions;
- target use;
- texture style;
- animation requirement;
- design notes;
- suggested technical method.

A suggested method is not automatically a requirement. Preserve the user's goal
while rejecting a method that conflicts with current evidence or would reduce
quality.

## 3. Canonical Product Flow

```text
Request
↓
Approved Modelling Brief
↓
Cross-view consistency check
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Explicit coarse primary Cube authoring
↓
inspect_model_bounds
↓
capture_model_views
↓
Reference ↔ model visual gate
↓
GLOBAL failure? → revise/rebuild hypothesis
LOCAL failure?  → inspect_element → causal correction
↓
Secondary geometry / hierarchy / pivots
↓
Full geometry review
↓
UV / texture
↓
Optional animation
↓
Final validation
↓
Save `.bbmodel` when in scope
```

Detailed procedure: [03-modelling-workflow.md](03-modelling-workflow.md).

## 4. Core Requirements

### PR-001 — Understand Intent

Identify the intended asset, Bedrock Entity target, expected output, required
scope, and only the material ambiguities that repository/reference evidence
cannot resolve.

### PR-002 — Use Reference Honestly

Use the approved Modelling Brief for visible silhouette, proportions, masses,
contacts, orientation, and style.

Do not convert reference pixels/panel size into Cube coordinates or invent hidden
features from ambiguous evidence.

### PR-003 — Establish Spatial Contract Before Exact Transforms

Before primary Cube authoring:

- check cross-view consistency;
- establish X/Y/Z interpretation, front direction, and ground relation;
- establish target envelope when approved dimensions exist;
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

Use structural observation to detect global scale/location problems and visual
observation to judge resemblance.

Current Local source provides:

- `inspect_model_bounds`;
- `capture_model_views`.

Successful observation calls are not visual `PASS`.

### PR-007 — Reject Bad Primary Scaffolds

If the whole object is unrecognizable or several primary relationships are wrong
together, revise/rebuild the Primary Form Hypothesis and coarse blockout.

Do not preserve a bad scaffold because many Cubes already exist.

### PR-008 — Correct Local Problems From Exact State

When whole form is sound but one bounded relationship is wrong:

1. locate/confirm exact target UUID;
2. use `inspect_element` for current authored state;
3. classify the cause;
4. apply one coherent correction;
5. re-observe affected views.

Use the causal vocabulary:

`TRANSLATE`, `RESIZE`, `ROTATE`, `REATTACH`, `SPLIT`, `MERGE/REMOVE`, `ADD MASS`.

Do not default to `ADD MASS`.

For one relationship spanning multiple Cubes, `modify_cubes_batch` may apply
different exact-UUID patches in one recoverable Undo unit.

### PR-009 — Add Secondary Structure Only After Primary Form Passes

Hierarchy, smaller geometry, pivots, texture support, and optional animation must
not be used to compensate for unresolved primary-form errors.

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
- no per-Cube screenshot/approval ceremony;
- no repeated full review for genuinely local changes;
- stop repeated failed correction direction after two attempts without new
  evidence.

## 8. Definition Of Done

A modelling task is complete when:

- request/scope and reference are understood;
- whole primary form passed the required visual gate;
- required secondary geometry/hierarchy/pivots are complete;
- texture/animation are complete only when in scope;
- no unresolved critical/major visual issue remains;
- required structural and visual evidence exists;
- save/output is complete when part of scope;
- unavailable local-only proof is reported rather than inferred.

## 9. Evidence Boundary

Current Local source contains the main Reference Fidelity observation,
correction, targeting, and pivot/initial-placement safety mechanisms. Their live
Blockbench/MCP integration is `LOCAL PROOF REQUIRED` until deliberately tested.

See [Validation Report](validation-report.md) and
[Implementation Map](../knowledge/implementation-map.md).
