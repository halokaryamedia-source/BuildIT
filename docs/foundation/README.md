# BlockIT Foundation

Updated: 2026-08-08  
Status: active product/modelling policy set

This folder owns **durable BlockIT policy**. Active task status does not belong
here; use [`../knowledge/next-action.md`](../knowledge/next-action.md) for that.

## Current Product Direction

BlockIT builds clean, editable Minecraft Bedrock Entity `.bbmodel` projects in
Blockbench through MCP from an approved visual Modelling Brief.

The current quality problem and solution are explicit:

```text
technical Cube success ≠ visual correctness

Reference
→ whole-form spatial reasoning
→ intentional Cube transforms
→ structural + visual observation
→ causal correction
→ secondary structure only after primary form is sound
```

The modelling flow must prevent assumption-driven Cube placement, arbitrary
rotation, and arbitrary pivot/origin authoring.

## Document Map

### Product / Agent Policy

- [00 — Agent Policy](00-agent-policy.md) — BlockIT-specific product constraints.
- [01 — Project Overview](01-project-overview.md) — purpose, target user, success.
- [02 — Product Requirements](02-product-requirements.md) — product scope and
  definition of done.

### Reference / Modelling

- [03 — Modelling Workflow](03-modelling-workflow.md) — canonical Reference
  Fidelity Loop and production sequence.
- [04 — Reference Guide](04-reference-guide.md) — Source Image → approved
  five-view Modelling Brief.
- [05 — Geometry Standard](05-geometry-standard.md) — Cuboid, proportion,
  placement, rotation, pivot, hierarchy rules.
- [06 — Texture Standard](06-texture-standard.md) — UV/texture rules after
  geometry is coherent.
- [07 — Visual Validation](07-visual-validation.md) — structural vs visual proof,
  canonical visual gates, repair loop.

### Source / Historical Adoption Records

- [08 — Source Selection](08-source-selection.md) — historical upstream source
  selection record. **Current Local source is now the runtime authority.**
- [09 — Merge Map](09-merge-map.md) — historical adoption/merge boundary. Do not
  use it to override current Local implementation.

### Proof Status

- [Validation Report](validation-report.md) — current capability/evidence matrix:
  source implemented vs official support vs local runtime proof still required.

## Current Runtime-Facing Fidelity Instruments

Current Local source contains the following fidelity-oriented surfaces; live
Blockbench proof is tracked separately in the validation report:

- `inspect_model_bounds` — rendered global Cube envelope facts;
- `capture_model_views` — named canonical model images;
- `inspect_element` — exact authored Cube/Group state;
- `modify_cubes_batch` — coherent exact-UUID multi-Cube correction;
- strict `place_cube` targeting and explicit initial `from/to` extents;
- explicit pivot requirement for newly rotated Cubes;
- pivot-only Cube correction through `Cube.transferOrigin()`;
- safer Group creation and `bone_rigging` pivot/parent targeting.

These tools provide observation/execution. They do **not** decide resemblance or
supply automatic visual `PASS`.

## Task-Specific Read Rule

| Need | Read |
|---|---|
| Product constraint | `00-agent-policy.md` |
| Product scope | `01-project-overview.md`, then `02-product-requirements.md` if needed |
| Model construction sequence | `03-modelling-workflow.md` |
| Reference preparation | `04-reference-guide.md` |
| Cube / rotation / pivot / hierarchy decision | `05-geometry-standard.md` |
| UV / texture | `06-texture-standard.md` |
| Visual evidence / acceptance | `07-visual-validation.md` |
| Current capability proof status | `validation-report.md` |

Do not read the whole folder for every task.

## Policy Rules

- Stable product/model rules belong here.
- Current source/runtime behavior can invalidate an old assumption; reconcile it
  instead of layering exceptions.
- Visual policy is allowed to be stricter than Blockbench itself. A rule can be
  **BlockIT product policy** even when it is not a universal Blockbench rule.
- A runtime claim requires runtime evidence; static GitHub work cannot prove live
  Blockbench behavior.
- Historical review/source-selection notes remain useful evidence but do not
  override current policy/source.

## Bridge To The Obsidian Vault

- [Knowledge Dashboard](../knowledge/index.md)
- [Next Action](../knowledge/next-action.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Decision Log](../knowledge/decision-log.md)
- [Review Status](../knowledge/reviews/review-graph.md)
