# BlockIT Foundation

Updated: 2026-08-11  
Status: active durable product/modelling policy

This folder owns **stable BlockIT policy**. Active repository state belongs in [`../knowledge/next-action.md`](../knowledge/next-action.md); local test procedure belongs in [`../knowledge/operations/local-acceptance-runbook.md`](../knowledge/operations/local-acceptance-runbook.md).

## Product Direction

BlockIT creates clean, editable Minecraft Bedrock Entity `.bbmodel` projects in Blockbench through MCP from an approved visual Modelling Brief.

Core rule:

```text
technical execution success ≠ visual correctness

Reference
→ whole-form reasoning
→ intentional Cube/Group authored state
→ minimum useful structural + visual observation
→ difference-first judgement
→ causal correction / rebuild
→ downstream texture/animation only after prerequisites are sound
```

The product must prevent assumption-driven geometry, arbitrary rotation/pivots, false visual approval, and generic-format shortcuts that bypass native Bedrock ownership.

## Document Map

### Product / Agent Policy

- [00 — Agent Policy](00-agent-policy.md) — BlockIT-specific product constraints.
- [01 — Project Overview](01-project-overview.md) — purpose, target user, success.
- [02 — Product Requirements](02-product-requirements.md) — product scope / definition of done.

### Reference / Modelling

- [03 — Modelling Workflow](03-modelling-workflow.md) — durable Reference Fidelity production sequence.
- [04 — Reference Guide](04-reference-guide.md) — Source Image/user intent → approved Modelling Brief.
- [05 — Geometry Standard](05-geometry-standard.md) — Cube, proportion, placement, rotation, pivot, hierarchy rules.
- [06 — Texture Standard](06-texture-standard.md) — UV/texture/PBR policy after geometry prerequisites are satisfied.
- [07 — Visual Validation](07-visual-validation.md) — structural vs visual proof, difference-first gates, correction loop.

### Proof Status

- [Validation Report](validation-report.md) — current source/official/local evidence matrix and pre-local baseline.

### Historical Adoption Records

- [08 — Source Selection](08-source-selection.md)
- [09 — Merge Map](09-merge-map.md)

These explain earlier upstream adoption only. Current `Local` source is runtime authority.

## Current Runtime-Facing Capability Groups

Current `Local` source includes Bedrock-oriented ownership for:

- project lifecycle and Bedrock/project export;
- Cube/Group authoring and bounded correction;
- structural bounds and named model-view observation;
- exact element inspection/discovery;
- texture/Painter/PBR/material-instance work;
- animation/keyframe/timeline/rig-related execution;
- Locator / Null Object authored-state operations;
- bounded history/recovery and validation resources.

`apply_texture` and `filter_by_material` are intentionally not default-callable for current Bedrock semantics. Generic Mesh/Hytale/risky-eval behavior is not a substitute for missing native Bedrock ownership.

These surfaces provide execution/observation. They do **not** decide resemblance automatically.

## Task-Specific Read Rule

| Need | Read |
|---|---|
| Product constraint | `00-agent-policy.md` |
| Product scope | `01-project-overview.md`, then `02-product-requirements.md` when needed |
| Model construction sequence | `03-modelling-workflow.md` |
| Reference preparation | `04-reference-guide.md` |
| Cube / rotation / pivot / hierarchy | `05-geometry-standard.md` |
| UV / texture / surface policy | `06-texture-standard.md` |
| Visual evidence / acceptance | `07-visual-validation.md` |
| Current source-vs-live proof state | `validation-report.md` |
| Exact local acceptance procedure | `../knowledge/operations/local-acceptance-runbook.md` |

Do not read the entire folder for every task.

## Evidence Boundary

Source/CI and official-source evidence may establish contracts/semantics, but live claims still require the target environment. Current remaining runtime evidence is owned by the local acceptance runbook.

Use only:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Policy Maintenance

- Stable product/model rules belong here.
- Current runtime/source behavior can invalidate an old assumption; reconcile rather than layering exceptions.
- BlockIT policy may intentionally be stricter than generic Blockbench behavior.
- A runtime/visual claim requires runtime/visual evidence.
- Historical reviews/source-selection records cannot override current policy/source.

## Bridge To Repository Memory

- [Knowledge Dashboard](../knowledge/index.md)
- [Next Action](../knowledge/next-action.md)
- [Local Acceptance Runbook](../knowledge/operations/local-acceptance-runbook.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Review Index](../knowledge/reviews/review-graph.md)
