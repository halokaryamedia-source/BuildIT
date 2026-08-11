# Knowledge Dashboard

Updated: 2026-08-11

Use this page as the main human/Obsidian navigation note. It is **not** a mandatory read for ordinary asset authoring; root `AGENTS.md` owns task-class routing.

## Mission

Keep repository memory current, source-backed, and separated by responsibility:

```text
agent/task routing → AGENTS.md
stable facts       → CONTEXT.md
current repository continuation → next-action.md
local acceptance procedure       → operations/local-acceptance-runbook.md
durable policy     → docs/foundation/
source ownership   → implementation-map.md
durable decisions  → decision-log.md / decisions/
review evidence    → reviews/
future/non-active work → operations/task-board.md
```

## Start Here

### Asset authoring

Do not boot the full knowledge vault. Follow root `AGENTS.md`:

```text
current request/reference
→ blockit-bedrock-entity-mcp
→ only the active modelling/texturing/animation specialist
```

Open repository memory only when the asset decision depends on repository state, a protected capability boundary, or a conflicting product rule.

### Repository / plugin continuation

Read:

1. [Agent Rules](../../AGENTS.md)
2. [Workspace Context](../../CONTEXT.md) when stable facts matter
3. [Next Action](next-action.md)
4. If the next step is local acceptance: [Local Acceptance Runbook](operations/local-acceptance-runbook.md)
5. Only the source/foundation/review owner needed by the active boundary

Do not broad-scan the vault by default.

## Current Product Snapshot

BlockIT is a Bedrock Entity-focused MCP/workflow. The modelling loop is:

```text
Approved Modelling Brief
→ Primary Form Hypothesis
→ coarse Cube/Group form
→ minimum useful structural/visual evidence
→ difference-first FAIL / UNVERIFIED / PASS
→ local causal correction or global rebuild
→ secondary structure after primary PASS
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock export
```

Tool success is execution evidence, not visual approval. `BLOCKED` is a valid workflow outcome when continuation would require guessing or repeated failed work.

## Current Pre-local State

Non-local source/CI cleanup is complete. Live Codex + Blockbench acceptance is now the active boundary.

Current pinned-SDK default surface:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`list_export_formats`, `apply_texture`, and `filter_by_material` are intentionally absent from the default callable surface. `export_model` remains exposed.

## Knowledge Spine

- [Minimal Navigation](minimal-nav.md) — shortest task-class-aware boot path.
- [Next Action](next-action.md) — one active repository continuation state.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — exact local execution procedure.
- [Implementation Map](implementation-map.md) — current source ownership/surface.
- [Skill Activation Matrix](skills/activation-matrix.md) — current skill routing.
- [Skill Map](skills/skill-map.md) — current nine-skill inventory and concise lineage.
- [Source Map](sources/source-map.md) — source/authority bridge.
- [Validation Report](../foundation/validation-report.md) — current proof-status matrix.
- [Review Index](reviews/review-graph.md) — current meaning of historical reviews.
- [Decision Log](decision-log.md) — durable decisions and superseded rules.
- [Operations](operations/README.md) — runbook/backlog/roadmap/history.

## Current Skill Inventory

All repository-owned skills live under `../../.agents/skills/`.

Asset authoring:

```text
blockit-bedrock-entity-mcp
blockbench-bedrock-modelling
blockit-bedrock-texturing
blockit-bedrock-animation
```

Repository/plugin development:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

Do not route to retired nested skill roots under `mcp/`.

## Retrieval Map

| Need | Start here |
|---|---|
| Task routing / proof discipline | `AGENTS.md` |
| Stable facts / terminology | `CONTEXT.md` |
| Current repository continuation | `next-action.md` |
| Local test procedure | `operations/local-acceptance-runbook.md` |
| Product/modelling policy | `../foundation/README.md` |
| Reference preparation | `../foundation/04-reference-guide.md` |
| Geometry/rotation/pivot policy | `../foundation/05-geometry-standard.md` |
| Visual acceptance | `../foundation/07-visual-validation.md` |
| Current source ownership | `implementation-map.md` |
| MCP build/runtime | `../../mcp/README.md` + affected source |
| Skill routing | `skills/activation-matrix.md` |
| Current proof status | `../foundation/validation-report.md` |
| Historical evidence | `reviews/review-graph.md` |
| Future/non-active work | `operations/task-board.md` |

## Continuity Rules

- `next-action.md` is the only active repository-task snapshot.
- The local acceptance runbook owns procedure, not current status.
- Historical reviews/plans keep their captured evidence but do not control current execution.
- Before ending material work, update only the canonical owner whose state changed.
- Verify a path exists before creating a replacement for an old/stale path.
- Prefer deleting stale routing to adding another documentation layer.
