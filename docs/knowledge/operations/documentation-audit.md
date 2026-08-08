# Documentation Audit

Updated: 2026-08-08

This note records the latest root `docs/` / Obsidian cleanup. It is an audit
record, not normal boot context.

## Audit Goal

Ensure active documentation describes **current Local** rather than earlier skill
recovery, upstream merge, pre-Reference-Fidelity, obsolete evidence labels, or an
old Obsidian workspace state.

## Current Canonical Structure

```text
AGENTS.md
CONTEXT.md

docs/
├─ README.md
├─ foundation/          durable policy
└─ knowledge/           Obsidian vault
   ├─ .obsidian/         vault UI/workspace configuration
   ├─ index.md           dashboard
   ├─ next-action.md     active task
   ├─ decision-log.md
   ├─ decisions/
   ├─ modules/
   ├─ reviews/
   ├─ skills/
   ├─ sources/
   ├─ maintenance/
   └─ operations/

.agents/skills/          six canonical BlockIT skills
mcp/                     runtime/plugin source
workspace/               project/model data
```

## Resolved Stale Claims

Corrected/removed current-state claims that referenced:

- `mcp/workflow/skills/` as canonical skill root;
- `mcp/.agents/skills/` as active skill ownership;
- pending recovery of `blockbench-use`, `reference-generator`, or
  `evidence-gate` skills;
- `mcp-builder` as current MCP specialist;
- nonexistent `mcp/workflow/presets/` project creation ownership;
- generic “MCP implementation audit” as the next engineering phase;
- default Cube geometry as acceptable initial modelling progress;
- unchosen `[0,0,0]` pivot for newly rotated Cubes;
- old validation status that omitted current fidelity instruments;
- historical upstream source-selection/merge records presented as current
  runtime direction;
- `Needs Validation` as a catch-all status where current root evidence labels
  (`LOCAL PROOF REQUIRED`, `UNKNOWN`, etc.) are more precise;
- `code-review-graph` as a current review owner.

## Obsidian Workspace Cleanup

The tracked `.obsidian/workspace.json` was also stale even though the Markdown
vault had a configured dashboard concept.

Before refresh it opened:

`reviews/anti-slop-skill-candidates.md`

and retained several obsolete/non-current history paths such as:

- `rag-index.md`;
- `vault-overview.md`;
- `review-notes/`;
- `graph/`;
- `Untitled.canvas`.

Current workspace now opens:

`index.md` → **Knowledge Dashboard**

and `lastOpenFiles` contains only current high-value vault notes.

No other Obsidian appearance/plugin preferences were changed.

## Current Skill Authority

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

The active docs now agree on:

- approved Modelling Brief, not pixel calibration;
- cross-view consistency;
- coordinate frame + target envelope;
- Primary Form Hypothesis before exact primary transforms;
- explicit finite `from/to` for initial Cube placement;
- explicit pivot for new non-zero-rotation Cube;
- strict Group/element identity targeting;
- global rendered-bounds observation;
- canonical model-view observation;
- reference ↔ model primary visual gate;
- GLOBAL failure rebuild vs LOCAL inspect/correct;
- coherent exact-UUID multi-Cube correction;
- Cube/Group pivot-transfer semantics;
- structural evidence separated from visual approval;
- local runtime effectiveness still `LOCAL PROOF REQUIRED`.

## Files Updated In This Refresh

### Root / Foundation

- `docs/README.md`
- `docs/foundation/README.md`
- `docs/foundation/00-agent-policy.md`
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

### Knowledge / Obsidian

- `knowledge/.obsidian/workspace.json`
- `knowledge/index.md`
- `knowledge/next-action.md`
- `knowledge/flow.md`
- `knowledge/implementation-map.md`
- `knowledge/glossary.md`
- `knowledge/workspace-structure.md`
- `knowledge/modules/module-map.md`
- `knowledge/modules/mcp-ownership.md`
- `knowledge/modules/skill-ownership.md`
- `knowledge/sources/source-map.md`
- `knowledge/reviews/review-graph.md`
- `knowledge/maintenance/maintenance-flow.md`
- `knowledge/decisions/open-spec-guide.md`
- `knowledge/decisions/reference-fidelity-loop.md` (new)
- `knowledge/operations/task-board.md`
- `knowledge/operations/roadmap.md`
- `knowledge/operations/change-log.md`
- `knowledge/operations/context-boot-baseline.md`
- `knowledge/operations/documentation-audit.md`

## Audited / Retained Without Semantic Rewrite

These notes are already aligned or are neutral templates/history and should not
be rewritten merely to show a newer date:

- `knowledge/minimal-nav.md`;
- `knowledge/flows/development-flow.md`;
- `knowledge/workspace-map.md`;
- `knowledge/skills/skill-map.md`;
- `knowledge/skills/activation-matrix.md`;
- `knowledge/operations/README.md`;
- `knowledge/decisions/obsidian-vault-layout.md`;
- neutral decision/module/review/maintenance templates;
- historical review bodies listed in `reviews/review-graph.md`.

Obsidian `app.json`, `appearance.json`, `core-plugins.json`, and `graph.json` were
also retained because no product/routing drift was found that required changing
those UI preferences.

## Historical Reviews

Historical review bodies are intentionally **not rewritten into present-tense
claims**. `reviews/review-graph.md` owns their current classification:

- active evidence;
- implemented in source;
- historical/reference;
- superseded;
- local proof required.

This preserves evidence while preventing an old review header from becoming
current task state.

## Historical Foundation Records

`08-source-selection.md` and `09-merge-map.md` are explicitly marked historical
adoption records. Current Local source is runtime authority.

## Known Remaining Proof Boundary

The docs and source now describe the intended architecture consistently, but this
documentation refresh does not prove live Blockbench/MCP behavior.

Source-implemented camera/image transport, bounds, Undo, pivot transfer,
persistence, and end-to-end reference fidelity remain local-proof claims where
applicable.

See [Validation Report](../../foundation/validation-report.md).

## Next Documentation Maintenance Trigger

Run another broad root-doc audit only when one of these changes materially:

- canonical skill architecture/path;
- Reference Fidelity architecture;
- major MCP source ownership;
- local proof changes a capability evidence status;
- workspace/package structure;
- a note/path is removed or renamed.

Do not full-rewrite the vault after every small source edit.

## Parent

- [Operations](README.md)
- [Knowledge Dashboard](../index.md)
