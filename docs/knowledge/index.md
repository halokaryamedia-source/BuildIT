# Knowledge Dashboard

Updated: 2026-08-08

Use this page as the main Obsidian landing note for BlockIT.

## Mission

Keep project memory current, auditable, easy to resume, and separated by
responsibility:

```text
stable rules      → docs/foundation/
current task      → next-action.md
durable decisions → decision-log.md / decisions/
source ownership  → implementation-map.md
review evidence   → reviews/
future work       → operations/task-board.md
```

Repository state is authority. Chat history is supporting context only.

## Start Here

### For a new ChatGPT / Codex session

1. [Agent Rules](../../AGENTS.md)
2. [Workspace Context](../../CONTEXT.md)
3. [Next Action](next-action.md)
4. Open only the foundation/source note that owns the active boundary.
5. [Skill Activation Matrix](skills/activation-matrix.md) only when specialist
   selection is needed.

### For a human browsing in Obsidian

- **What is BlockIT?** → [Project Overview](../foundation/01-project-overview.md)
- **How does modelling work now?** → [Modelling Workflow](../foundation/03-modelling-workflow.md)
- **What is implemented?** → [Implementation Map](implementation-map.md)
- **What are we doing next?** → [Next Action](next-action.md)
- **Why did we choose this architecture?** → [Decision Log](decision-log.md) and
  [Reference Fidelity Decision](decisions/reference-fidelity-loop.md)
- **What did earlier audits find?** → [Review Index](reviews/review-graph.md)
- **What still needs future work?** → [Task Board](operations/task-board.md)

## Current Product Snapshot

The active modelling architecture is the **Reference Fidelity Loop**:

```text
Approved Modelling Brief
↓
Cross-view consistency
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Explicit coarse Cube extents
+ intentional rotation/pivot when required
↓
inspect_model_bounds
↓
capture_model_views
↓
Reference ↔ model comparison
↓
GLOBAL failure → revise/rebuild hypothesis
LOCAL failure  → inspect_element → causal correction
↓
Secondary geometry / hierarchy / pivots
↓
Texture / optional animation / final proof
```

The governing rule is simple:

> A Cube existing, attaching, validating, or being saved is structural evidence,
> not visual approval.

## Current Local Source State

Source already contains the main fidelity instruments and safety boundaries:

- `inspect_model_bounds` — whole rendered Cube envelope facts;
- `capture_model_views` — stable named visual observations;
- `inspect_element` — exact authored Cube/Group state;
- `modify_cubes_batch` — coherent exact-UUID multi-Cube correction;
- strict `place_cube` parent targeting;
- explicit finite `from/to` required for new Cubes;
- explicit pivot required for a newly placed non-zero-rotation Cube;
- pivot-only Cube correction through `Cube.transferOrigin()`;
- stricter Group creation and `bone_rigging` targeting/pivot semantics.

These are **source implemented**. Live Blockbench/MCP behavior remains
`LOCAL PROOF REQUIRED` until a local proof is intentionally run.

## Knowledge Spine

- [Minimal Nav](minimal-nav.md) — shortest boot path.
- [Next Action](next-action.md) — single active goal/status/next step.
- [Decision Log](decision-log.md) — durable decisions and superseded rules.
- [Flow](flow.md) — agent work routing.
- [Workspace Map](workspace-map.md) — top-level repository map.
- [Workspace Structure](workspace-structure.md) — current project-data layout.
- [Implementation Map](implementation-map.md) — source ownership and implemented
  fidelity surfaces.
- [Skill Map](skills/skill-map.md) — frozen six-skill architecture and lineage.
- [Source Map](sources/source-map.md) — current source/authority bridge.
- [Glossary](glossary.md) — canonical terminology.
- [Reviews](reviews/review-graph.md) — historical evidence plus current review
  status.
- [Operations](operations/README.md) — backlog/roadmap/audit/history.

## Retrieval Map

| Need | Start here |
|---|---|
| Agent rules / proof boundary | `AGENTS.md` |
| Stable project facts | `CONTEXT.md` |
| Current work | `next-action.md` |
| Product/modelling policy | `../foundation/README.md` |
| Reference preparation | `../foundation/04-reference-guide.md` |
| Geometry / rotation / pivot rules | `../foundation/05-geometry-standard.md` |
| Visual acceptance | `../foundation/07-visual-validation.md` |
| Current implementation | `implementation-map.md` |
| MCP runtime | `../../mcp/README.md` + affected source |
| Skill routing | `skills/activation-matrix.md` |
| Historical audit/reasoning | `reviews/review-graph.md` |
| Future/non-active work | `operations/task-board.md` |

## Canonical Skill Location

All repository-wide BlockIT skills live under:

`../../.agents/skills/`

There are exactly six canonical skills. `mcp/.agents/skills/`,
`mcp/.github/skills/`, and the old `mcp/workflow/skills/` path are not active
skill roots.

Reference generation is a foundation workflow, not another root skill. Evidence
status is root `AGENTS.md` behavior, not an `evidence-gate` skill.

## Continuity Rules

- `next-action.md` is the only active-task snapshot.
- Do not copy active status into every dashboard/review/module note.
- Historical review notes may retain the state they recorded; use the Review
  Index to understand whether their recommendations were later implemented or
  superseded.
- Before ending material work, update the canonical owner whose state changed.
- Verify a path exists before creating a replacement for an old/stale path.

## Vault Maintenance Rule

One note, one job. Prefer updating an existing owner to creating another layer.
If a note becomes historical, mark/index it as historical rather than rewriting
its evidence as though it was produced today.
