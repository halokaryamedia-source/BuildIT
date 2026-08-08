# Documentation Audit

Updated: 2026-08-08

This note records the latest root `docs/` / Obsidian cleanup. It is an audit
record, not normal boot context.

## Audit Goal

Ensure active documentation describes **current Local** rather than earlier skill
recovery, upstream merge, or pre-Reference-Fidelity states.

## Current Canonical Structure

```text
AGENTS.md
CONTEXT.md

docs/
├─ README.md
├─ foundation/          durable policy
└─ knowledge/           Obsidian vault
   ├─ index.md           dashboard
   ├─ next-action.md     active task
   ├─ decision-log.md
   ├─ decisions/
   ├─ modules/
   ├─ reviews/
   ├─ skills/
   ├─ sources/
   └─ operations/

.agents/skills/          six canonical BlockIT skills
mcp/                     runtime/plugin source
workspace/               project/model data
```

## Resolved Stale Claims

The following outdated current-state claims were removed/corrected:

- `mcp/workflow/skills/` as canonical skill root;
- `mcp/.agents/skills/` as active skill ownership;
- pending recovery of `blockbench-use`, `reference-generator`, or
  `evidence-gate` skills;
- `mcp-builder` as current MCP specialist;
- nonexistent `mcp/workflow/presets/` project creation ownership;
- generic statement that MCP implementation audit is still the next engineering
  phase;
- automatic/default Cube geometry as an acceptable initial modelling path;
- old validation report that did not include current fidelity instruments;
- historical upstream source-selection/merge notes presented as current runtime
  direction.

## Current Skill Authority

Current root skills:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

Architecture is frozen. Reference generation is foundation workflow; evidence
status belongs to root `AGENTS.md`.

## Current Fidelity Documentation

The current docs now agree on:

- approved Modelling Brief, not pixel calibration;
- cross-view consistency;
- coordinate frame + target envelope;
- Primary Form Hypothesis before exact primary transforms;
- explicit `from/to` for initial Cube placement;
- explicit pivot for new non-zero-rotation Cube;
- global structural bounds observation;
- canonical model-view observation;
- reference ↔ model primary visual gate;
- GLOBAL failure rebuild vs LOCAL failure inspection/correction;
- exact target UUIDs for normal mutation;
- coherent multi-Cube correction;
- Cube/Group pivot-transfer semantics;
- structural evidence separated from visual approval.

## Files Updated In This Refresh

### Root / Foundation

- `docs/README.md`
- `docs/foundation/README.md`
- `docs/foundation/01-project-overview.md`
- `docs/foundation/02-product-requirements.md`
- `docs/foundation/03-modelling-workflow.md`
- `docs/foundation/04-reference-guide.md`
- `docs/foundation/05-geometry-standard.md`
- `docs/foundation/06-texture-standard.md`
- `docs/foundation/07-visual-validation.md`
- `docs/foundation/08-source-selection.md`
- `docs/foundation/09-merge-map.md`
- `docs/foundation/validation-report.md`

`00-agent-policy.md` was audited and remains directionally current; root
`AGENTS.md` continues to own generic agent/proof behavior.

### Knowledge / Obsidian

- `index.md`
- `implementation-map.md`
- `glossary.md`
- `workspace-structure.md`
- `modules/module-map.md`
- `modules/mcp-ownership.md`
- `modules/skill-ownership.md`
- `sources/source-map.md`
- `reviews/review-graph.md`
- `operations/task-board.md`
- `operations/roadmap.md`
- `operations/change-log.md`
- `operations/documentation-audit.md`
- `decisions/reference-fidelity-loop.md` added.

## Audited / Retained Without Semantic Rewrite

These current owners/templates were already aligned and do not need change just
to appear newer:

- `knowledge/minimal-nav.md`;
- `knowledge/flow.md`;
- `knowledge/flows/development-flow.md`;
- `knowledge/workspace-map.md`;
- `knowledge/skills/skill-map.md`;
- `knowledge/skills/activation-matrix.md`;
- `knowledge/operations/README.md`;
- `knowledge/decisions/obsidian-vault-layout.md`;
- maintenance/templates unless a future workflow change affects them.

## Historical Reviews

Historical review bodies are intentionally **not rewritten into present-tense
claims**. `reviews/review-graph.md` now records their current interpretation:
implemented, active evidence, historical, or superseded.

This preserves useful evidence while preventing an old review header from
becoming current task state.

## Known Remaining Proof Boundary

Documentation/source can now describe the intended architecture consistently,
but live Blockbench/MCP behavior is still not proven by this docs refresh.

Current source capabilities that depend on runtime remain
`LOCAL PROOF REQUIRED` until deliberate Codex local testing.

## Next Documentation Maintenance Trigger

Run another root-doc audit only when one of these changes materially:

- canonical skill architecture/path;
- Reference Fidelity architecture;
- major MCP source ownership;
- local proof upgrades a `LOCAL PROOF REQUIRED` capability;
- workspace/package structure;
- a note/path is removed or renamed.

Do not re-run a full vault rewrite after every small source edit.

## Parent

- [Operations](README.md)
- [Knowledge Dashboard](../index.md)
