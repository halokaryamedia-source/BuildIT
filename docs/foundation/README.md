# BlockIT Foundation

Updated: 2026-08-12  
Status: active product/modelling policy

This folder contains **durable current BlockIT policy**. Active task state belongs in [`../knowledge/next-action.md`](../knowledge/next-action.md); local test procedure belongs in [`../knowledge/operations/local-acceptance-runbook.md`](../knowledge/operations/local-acceptance-runbook.md).

## Product Direction

BlockIT builds clean editable Minecraft Bedrock Entity `.bbmodel` projects in Blockbench through MCP from an approved visual reference/Modelling Brief.

```text
technical tool success ≠ visual correctness

actual approved reference image available
→ explicit view pairing + grounded observable claim IDs
→ Semantic Form: what exists/how parts relate
→ Primary Form: where/how large/how oriented
→ intentional Cube/Group transforms
→ minimum useful structural observation
→ actual reference + fresh model views
→ claim-locked difference-first verdict
→ causal correction or semantic/spatial rebuild
→ downstream surface/motion only after geometry is sound
```

Filename/path/manifest/prose/memory is not visual evidence. If the actual approved image cannot be inspected for a material reference-driven decision, use `UNVERIFIED/BLOCKED` instead of guessing.

## Current Policy Set

| Document | Owns |
|---|---|
| [00 — Agent Policy](00-agent-policy.md) | BlockIT-specific product/no-guess constraints |
| [01 — Project Overview](01-project-overview.md) | purpose, target user, success definition |
| [02 — Product Requirements](02-product-requirements.md) | scope and definition of done |
| [03 — Modelling Workflow](03-modelling-workflow.md) | actual-reference-grounded production sequence |
| [04 — Reference Guide](04-reference-guide.md) | Source Image/user intent → approved image + evidence/view grounding |
| [05 — Geometry Standard](05-geometry-standard.md) | Cube, proportion, placement, rotation, pivot, hierarchy rules |
| [06 — Texture Standard](06-texture-standard.md) | UV/texture policy after geometry is coherent |
| [07 — Visual Validation](07-visual-validation.md) | claim/view-grounded structural vs visual proof + repair loop |
| [Validation Report](validation-report.md) | current source/official/local-proof status |

Historical source-selection/merge records remain Git/review evidence, not current policy.

## Runtime-facing instruments

Current `Local` source includes:

- `inspect_model_bounds` — structural rendered Cube envelope facts;
- `capture_model_views` — bounded labeled canonical **model** images;
- `inspect_element` — focused authored state;
- `modify_cube` / `modify_cubes_batch` — bounded causal Cube correction;
- strict `place_cube` finite extents + non-zero-rotation pivot requirement;
- direct Locator / Null Object state operations;
- retained Bedrock texture/Paint/PBR/material-instance + animation capability.

These provide observation/execution, not automatic reference loading, anatomy inference, or resemblance approval. The approved reference must be supplied/visible to the modelling model through the active multimodal input path; `capture_model_views` returns model evidence only.

## Read only what the task needs

| Need | Read |
|---|---|
| Product constraint | `00-agent-policy.md` |
| Scope / definition of done | `01-project-overview.md`, then `02-product-requirements.md` if needed |
| Construction sequence | `03-modelling-workflow.md` |
| Reference preparation/grounding | `04-reference-guide.md` |
| Cube / rotation / pivot / hierarchy | `05-geometry-standard.md` |
| UV / texture | `06-texture-standard.md` |
| Visual evidence / acceptance | `07-visual-validation.md` |
| Current capability proof | `validation-report.md` |

Do not read the whole folder for routine work.

## Policy rules

- Stable product/model rules belong here; implementation status does not.
- Current source/runtime evidence can supersede old assumptions; reconcile rather than layer exceptions.
- BlockIT policy may be stricter than generic Blockbench behavior.
- Static source/CI cannot prove live Blockbench behavior, model image understanding, or visual fidelity.
- Historical reviews/Git explain why; current policy/source owns what applies now.

## Related

- [Knowledge Dashboard](../knowledge/index.md)
- [Next Action](../knowledge/next-action.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Decision Log](../knowledge/decision-log.md)
- [Review Index](../knowledge/reviews/review-graph.md)
