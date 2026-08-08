# Reference Fidelity Loop v1

Date: 2026-08-08  
Status: active architecture decision

## Context

Repeated MCP modelling tests showed a consistent failure:

- Cubes were placed because they could fit/connect;
- technically successful placement was treated as modelling progress or approval;
- exact `from/to/origin/rotation` values were invented too early;
- rotation and pivots could become arbitrary or distant;
- local patches accumulated on top of a globally wrong whole form.

The problem was not a shortage of Cube mutation tools. It was the missing closed
loop between visual understanding, a coherent spatial hypothesis, exact Cuboid
mutation, and fresh visual evidence.

## Decision

BlockIT uses an evidence-backed **Reference Fidelity Loop** as the normal Bedrock
modelling architecture:

```text
APPROVED MODELLING BRIEF
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
PRIMARY FORM HYPOTHESIS
↓
EXPLICIT COARSE CUBE AUTHORING
↓
STRUCTURAL ENVELOPE OBSERVATION
↓
CANONICAL MODEL VIEWS
↓
REFERENCE ↔ MODEL COMPARISON
↓
GLOBAL OR LOCAL FAILURE?
  ├─ GLOBAL → revise/rebuild primary hypothesis
  └─ LOCAL  → inspect exact authored state → causal correction
↓
FRESH AFFECTED EVIDENCE
↺
↓
SECONDARY GEOMETRY / HIERARCHY / PIVOTS
↓
TEXTURE / OPTIONAL ANIMATION / FINAL PROOF
```

## Responsibility Split

### AI / Modeller

Owns:

- reading the approved reference as one 3D object;
- choosing coordinate frame/front/ground interpretation;
- Primary Form Hypothesis;
- recognizability, silhouette, proportions, placement, orientation, and contact
  judgement;
- global-vs-local diagnosis;
- deciding the causal correction.

### MCP / Blockbench Runtime

Owns:

- exact mutation execution;
- structural inspection;
- canonical visual observation;
- target identity/UUID handling;
- Undo/recovery mechanics;
- save/runtime operations when supported.

MCP must not become automatic anatomy, image-to-Cuboid, or visual-PASS authority.

## Primary Authoring Rules

For new Cubes in the normal `place_cube` path:

- `from` and `to` are explicit finite values;
- there is no default geometry extent used as modelling progress;
- unrotated Cube may use neutral origin without pivot ceremony;
- non-zero initial rotation requires an explicit intentional pivot;
- explicit Group parent must resolve correctly; a typo must not fall back to root.

These are **intent safety rules**, not visual validators. They force a modelling
decision to exist but do not claim the decision is correct.

## Pivot Decision

Pivot-only correction is different from geometry rewrite.

### Cube

```text
origin only
→ pivot-only correction
→ Cube.transferOrigin()
→ preserve visual position
```

```text
origin + from/to/rotation
→ authored geometry rewrite
```

### Group / Bone

A material pivot change uses `Group.transferOrigin()` against an explicit target
and only when there is a real joint/attachment/transform-center reason.

## Failure Classification

### Global Failure

Examples:

- object is not recognizable;
- whole silhouette is wrong;
- several primary proportions/placements/orientations fail together.

Action:

```text
reject current primary scaffold
→ revise/rebuild Primary Form Hypothesis
```

Do not preserve the scaffold because many Cubes already exist.

### Local Failure

Examples:

- one otherwise-correct mass is too long;
- one attachment is misplaced;
- one slope or pivot is wrong while whole form remains sound.

Action:

```text
inspect exact target state
→ choose TRANSLATE / RESIZE / ROTATE / REATTACH / SPLIT / MERGE-REMOVE / ADD MASS
→ one coherent mutation
→ fresh affected view(s)
```

`ADD MASS` is not the default correction.

## Observation Decision

BlockIT uses read-only observation instruments rather than numeric resemblance
scoring:

- `inspect_model_bounds` — structural envelope facts;
- `capture_model_views` — canonical labeled model images;
- `inspect_element` — exact authored local state.

No IoU, projection score, SF3D, mesh fit, or similarity score may become visual
approval authority.

## Hard Rebuild Rule

If recognizability fails or multiple primary relationships are critically wrong,
rebuild/revise the coarse hypothesis instead of serial micro-correction.

If the same correction direction fails twice without new evidence, stop patching
and revise the hypothesis.

## Why This Decision

This architecture directly addresses the observed failure mode without adding a
large planner, automatic reconstruction service, or broad new tool surface.

It keeps:

- modeller judgement where visual reasoning belongs;
- MCP deterministic where execution/observation belongs;
- structural proof separate from visual proof;
- wrong primary forms cheap enough to reject/rebuild;
- the public surface small and recoverable.

## Explicit Rejections

Do not reintroduce as authority:

- automatic image → Cuboid reconstruction;
- SF3D/mesh decomposition;
- numeric similarity/IoU/projection approval;
- per-Cube screenshots or user approval;
- support-first/section-first/first-Cube universal rules;
- all-in-one Bedrock builder;
- automatic pivot inference/planner;
- detail Cubes used to hide global-form errors.

## Current Source Status

The core observation/correction/targeting/pivot/initial-placement safety described
by this decision is implemented in current Local source.

Live Blockbench/MCP behavior and visual effectiveness are still
`LOCAL PROOF REQUIRED` until deliberately tested in the local environment.

## Related

- [Modelling Workflow](../../foundation/03-modelling-workflow.md)
- [Geometry Standard](../../foundation/05-geometry-standard.md)
- [Visual Validation](../../foundation/07-visual-validation.md)
- [Implementation Map](../implementation-map.md)
- [Root-Cause Review](../reviews/mcp-reference-fidelity-root-cause.md)
- [Observation Contract](../reviews/mcp-reference-fidelity-observation-contract.md)
- [Next Action](../next-action.md)
