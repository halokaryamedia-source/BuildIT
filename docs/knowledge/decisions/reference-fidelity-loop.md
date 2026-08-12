# Reference Fidelity Loop v1

Date: 2026-08-12  
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
ACTUAL APPROVED REFERENCE IMAGE
↓
REFERENCE EVIDENCE MAP + VIEW PAIR MAP
↓
SEMANTIC FORM CONTRACT
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
PRIMARY FORM HYPOTHESIS
↓
EXPLICIT COARSE CUBE AUTHORING
↓
STRUCTURAL ENVELOPE OBSERVATION when relevant
↓
CANONICAL MODEL VIEWS
↓
CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
↓
GLOBAL OR LOCAL FAILURE?
  ├─ GLOBAL → revise Semantic Form / Primary Form Hypothesis
  └─ LOCAL  → inspect exact state when needed → causal correction
↓
FRESH AFFECTED EVIDENCE
↓
QUALITATIVE FIDELITY DELTA
  IMPROVED | UNCHANGED | REGRESSED
↺ until primary form passes or the hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / PIVOTS
↓
TEXTURE / OPTIONAL ANIMATION / FINAL PROOF
```

## Responsibility Split

### AI / Modeller

Owns:

- reading the actual approved reference as one 3D object;
- grounding material claims to visible reference views;
- choosing coordinate frame/front/ground interpretation;
- Semantic Form and Primary Form Hypothesis;
- recognizability, silhouette, proportions, placement, orientation, contact, and negative-space judgement;
- global-vs-local diagnosis;
- deciding the causal correction and whether fresh evidence actually improved.

### MCP / Blockbench Runtime

Owns:

- exact mutation execution;
- structural inspection;
- canonical visual observation;
- target identity/UUID handling;
- Undo/recovery mechanics;
- save/runtime operations when supported.

MCP must not become automatic anatomy, image-to-Cuboid, visual-PASS, or fidelity-score authority.

## Primary Authoring Rules

For new Cubes in the normal `place_cube` path:

- `from` and `to` are explicit finite values;
- there is no default geometry extent used as modelling progress;
- unrotated Cube may use neutral origin without pivot ceremony;
- non-zero initial rotation requires an explicit intentional pivot;
- explicit Group parent must resolve correctly; a typo must not fall back to root.

These are **intent safety rules**, not visual validators. They force a modelling
decision to exist but do not claim the decision is correct.

## Semantic / Reference Grounding Decision

Reference-driven geometry requires the actual approved reference image to be available to the vision-capable modeller. A filename, path, manifest, cached claim, prose summary, or memory is not equivalent visual evidence.

Material visible claims use:

```text
SUPPORTED
PROVISIONAL
CONFLICTING
UNAVAILABLE
```

and a claim/view identity before exact geometry. Confidence does not transfer between axes. A strong front result cannot validate depth. Material `CONFLICTING` evidence is not averaged into invented geometry; unresolved material conflict becomes `BLOCKED`.

Semantic Form states what must exist and how it relates. Primary Form Hypothesis states where/how large/how oriented. Neither is an exact Cube blueprint or machine-authoritative reconstruction.

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
- semantic decomposition misses material parts;
- whole silhouette is wrong;
- several primary proportions/placements/orientations fail together.

Action:

```text
reject current primary scaffold
→ revise Semantic Form when decomposition is wrong
→ otherwise revise/rebuild Primary Form Hypothesis
```

Do not preserve the scaffold because many Cubes already exist.

### Local Failure

Examples:

- one otherwise-correct mass is too long;
- one attachment is misplaced;
- one slope or pivot is wrong while whole form remains sound.

Action:

```text
reuse/inspect exact target state
→ choose TRANSLATE / RESIZE / ROTATE / REATTACH / SPLIT / MERGE-REMOVE / ADD MASS
→ one coherent mutation
→ fresh affected paired views
→ qualitative fidelity delta
```

`ADD MASS` is not the default correction.

## Reference Fidelity Verdict

Visual approval uses three states:

```text
FAIL        critical/major mismatch exists
UNVERIFIED  evidence is insufficient for the claim
PASS        fresh paired evidence was checked and no critical/major mismatch remains
```

The review is difference-first. If the reference does not constrain an important axis or view, that aspect remains `UNVERIFIED` rather than guessed into `PASS`.

## Mutation Result Boundary

Cube mutation tools separate execution from visual acceptance:

```text
execution: applied
visual_verdict: not_evaluated
```

`place_cube`, `modify_cube`, and `modify_cubes_batch` can prove authored state changed, not that geometry resembles the reference. A successful placement is not a reason to continue placing geometry.

## Observation Decision

BlockIT uses read-only observation instruments rather than numeric resemblance scoring:

- `inspect_model_bounds` — structural envelope facts;
- `capture_model_views` — canonical labeled model images;
- `inspect_element` — exact authored local state.

No IoU, projection score, SF3D, mesh fit, or similarity score may become visual approval authority.

## P7 — Fidelity Convergence / Evaluation Integrity

P7 closes the remaining correction-wandering gap without adding a new planner, scorer, tool, profile, or reconstruction system.

### Qualitative correction convergence

Before a local correction, retain the relevant fresh paired evidence for every materially affected supported claim/view. After mutation, capture fresh affected evidence and classify the visible delta:

```text
IMPROVED | UNCHANGED | REGRESSED
```

A correction counts as progress only when the target mismatch is `IMPROVED` and no previously supported material claim/view is `REGRESSED`. `UNCHANGED` or `REGRESSED` is not progress. Improvement in one view cannot cancel a material regression in another. Change the causal diagnosis or reopen the owning Primary Form Hypothesis rather than stacking compensating patches.

The delta is qualitative and claim/view-specific. It must never become a scalar fidelity score.

### Model-facing evaluation integrity

A later non-local or local model-facing reference-understanding evaluation may measure only these four dimensions:

1. **decomposition / coverage** — material masses, landmarks, counts, topology, negative spaces;
2. **cross-view consistency** — one coherent 3D interpretation without borrowing confidence across views;
3. **spatial hypothesis quality** — relative size, placement, orientation, contact, and uncertainty before exact transforms;
4. **correction direction / convergence** — diagnosed correction visibly improves the intended claim without material regression elsewhere.

The candidate receives the **actual approved reference image**, user/fixture target facts, and normal workflow rules. **The candidate must not receive the expected answer.**

Evaluation uses **independent expectations** established before candidate output from user-approved facts, pre-existing audited evidence, or another independently grounded source. Expected exact Cube transforms, mandatory Cube counts, or candidate-authored gold answers are forbidden.

The retained Zebra package may be the first evaluation fixture because pre-existing audited evidence already records material visible failures and target facts. It remains an evaluation fixture, **not runtime anatomy law**; no Zebra-specific decomposition, angle, proportion, or authoring rule belongs in product prompts/tools.

Repository tests may prove this evaluation contract and fixture separation exist. They cannot prove the candidate interpreted an image correctly. Image-understanding quality remains model-facing evidence.

## Hard Rebuild Rule

If recognizability fails or multiple primary relationships are critically wrong,
rebuild/revise the coarse hypothesis instead of serial micro-correction.

If the same correction direction fails twice without new evidence, stop patching
and revise the hypothesis or report `BLOCKED`.

## Why This Decision

This architecture directly addresses observed failure modes without adding a
large planner, automatic reconstruction service, broad new tool surface, or
self-certifying vision score.

It keeps:

- modeller judgement where visual reasoning belongs;
- MCP deterministic where execution/observation belongs;
- structural proof separate from visual proof;
- corrections accountable to visible improvement;
- wrong primary forms cheap enough to reject/rebuild.

## Explicit Rejections

Do not reintroduce as authority:

- automatic image → Cuboid reconstruction;
- SF3D/mesh decomposition;
- numeric similarity/IoU/projection/fidelity approval;
- per-Cube screenshots or approval;
- support-first/section-first/first-Cube universal rules;
- all-in-one Bedrock builder;
- automatic pivot inference/planner;
- detail Cubes used to hide global-form errors;
- a benchmark whose expected answer is produced by the same candidate being evaluated.

## Current Source Status

The observation/correction/targeting/pivot/initial-placement safety and P5–P7 decision-layer contracts described here are implemented in current `Local` source/instructions.

Live Blockbench/MCP behavior and actual model image-understanding effectiveness remain outside static GitHub proof until deliberately evaluated in an environment that exposes the real reference/model images to the candidate.

## Related

- [Modelling Workflow](../../foundation/03-modelling-workflow.md)
- [Geometry Standard](../../foundation/05-geometry-standard.md)
- [Visual Validation](../../foundation/07-visual-validation.md)
- [Implementation Map](../implementation-map.md)
- [Root-Cause Review](../reviews/mcp-reference-fidelity-root-cause.md)
- [Observation Contract](../reviews/mcp-reference-fidelity-observation-contract.md)
- [Next Action](../next-action.md)
