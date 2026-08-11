# Knowledge Dashboard

Updated: 2026-08-11

Use this page as BlockIT's **current repository-memory index**. It is not mandatory context for ordinary asset authoring; root `AGENTS.md` decides the task route first.

## Current owners

```text
agent/task routing            → AGENTS.md
stable facts / terminology    → CONTEXT.md
active repository continuation → next-action.md
local acceptance procedure    → operations/local-acceptance-runbook.md
product/modelling policy      → docs/foundation/
source ownership              → implementation-map.md
durable decisions             → decision-log.md / decisions/
review evidence               → reviews/review-graph.md
future/non-active work        → operations/task-board.md
```

## Start here

### Asset authoring

```text
current request/reference
→ blockit-bedrock-entity-mcp
→ only the active modelling/texturing/animation specialist
```

Open project-memory notes only when an asset decision depends on repository state or a protected capability/product boundary.

### Repository / plugin continuation

1. [Agent Rules](../../AGENTS.md)
2. [Workspace Context](../../CONTEXT.md) when stable facts matter
3. [Next Action](next-action.md)
4. [Local Acceptance Runbook](operations/local-acceptance-runbook.md) when activated
5. only the source/foundation/review owner needed by the active boundary

Do not scan every review, decision, or historical Git state by default.

## Product snapshot

```text
Approved reference
→ Primary Form Hypothesis
→ coarse Cube/Group form
→ minimum useful structural/visual evidence
→ difference-first FAIL / UNVERIFIED / PASS
→ causal correction or global rebuild
→ secondary geometry/hierarchy/pivots after primary PASS
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

Tool success is execution evidence, not visual approval. `BLOCKED` is valid when continuation would require guessing or repeated failed work.

## Current pre-local baseline

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` is exposed. `list_export_formats`, `apply_texture`, and `filter_by_material` are absent from the default callable surface; `risky_eval` and `from_geo_json` remain disabled.

Non-local source/contract/CI/documentation work is complete. Live Codex + Blockbench behavior is now the active evidence boundary.

## Knowledge spine

- [Minimal Navigation](minimal-nav.md) — shortest task-aware route.
- [Next Action](next-action.md) — one current repository-continuation state.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — exact current local procedure.
- [Implementation Map](implementation-map.md) — current source ownership/surface.
- [Skill Activation Matrix](skills/activation-matrix.md) — skill selection.
- [Skill Map](skills/skill-map.md) — current skill inventory/lineage.
- [Source Map](sources/source-map.md) — source/authority bridge.
- [Validation Report](../foundation/validation-report.md) — current proof status.
- [Decision Log](decision-log.md) — durable decisions/reasons.
- [Review Index](reviews/review-graph.md) — current meaning of review evidence.
- [Task Board](operations/task-board.md) — future/non-active findings only.

## Retrieval map

| Need | Start here |
|---|---|
| Task routing / proof discipline | `AGENTS.md` |
| Stable facts | `CONTEXT.md` |
| Current continuation | `next-action.md` |
| Local test procedure | `operations/local-acceptance-runbook.md` |
| Product/modelling policy | `../foundation/README.md` |
| Reference preparation | `../foundation/04-reference-guide.md` |
| Geometry / pivot | `../foundation/05-geometry-standard.md` |
| Visual acceptance | `../foundation/07-visual-validation.md` |
| Current implementation | `implementation-map.md` |
| MCP runtime/build | `../../mcp/README.md` + affected source |
| Skill routing | `skills/activation-matrix.md` |
| Current proof status | `../foundation/validation-report.md` |
| Historical evidence | `reviews/review-graph.md` |
| Future work | `operations/task-board.md` |

## Hygiene rules

- `next-action.md` is the only active repository-task snapshot.
- The local runbook owns procedure, not status.
- Reviews own evidence; Git history owns obsolete implementation/planning detail.
- Do not create manual changelog/plan/audit/template layers when an existing owner or Git history is sufficient.
- Obsidian UI/workspace state is local and intentionally untracked.
- Prefer deleting stale routing over adding another documentation layer.
