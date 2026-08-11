# Knowledge Dashboard

Updated: 2026-08-12

Use this page as BlockIT's **current repository-memory index**. It is not mandatory context for ordinary asset authoring; root `AGENTS.md` decides the task route first.

## Current owners

```text
agent/task routing             → AGENTS.md
stable facts / terminology     → CONTEXT.md
active repository continuation → next-action.md
completed local procedure      → operations/local-acceptance-runbook.md
product/modelling policy       → docs/foundation/
source ownership               → implementation-map.md
durable decisions              → decision-log.md / decisions/
review evidence                → reviews/review-graph.md
future/non-active work         → operations/task-board.md
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
2. [Workspace Context](../../CONTEXT.md) only when stable facts matter
3. [Next Action](next-action.md)
4. affected source + nearest `AGENTS.md`
5. one relevant specialist/foundation owner only when the active boundary needs it

The [Local Acceptance Runbook](operations/local-acceptance-runbook.md) is a completed procedure. Read it only when reproducing an acceptance-specific failure or auditing that procedure; it is not default continuation boot.

Do not scan every review, decision, task-board item, or historical Git state by default.

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

## Accepted baseline

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` is exposed. `list_export_formats`, `apply_texture`, and `filter_by_material` are absent from the default callable surface; `risky_eval` and `from_geo_json` remain disabled.

The first bounded Codex + Blockbench local acceptance pass is complete. Representative live runtime, authoring, playback, visual-routing, and persistence behavior is recorded in the [Validation Report](../foundation/validation-report.md).

Current continuation is **efficiency evidence**, not another broad local acceptance pass. Static character counts are candidates only; a fresh Codex trace must establish client-visible schema/context/call cost before architecture changes.

## Knowledge spine

- [Minimal Navigation](minimal-nav.md) — shortest task-aware route.
- [Next Action](next-action.md) — one current repository-continuation state.
- [Implementation Map](implementation-map.md) — current source ownership/surface.
- [Skill Activation Matrix](skills/activation-matrix.md) — skill selection.
- [Skill Map](skills/skill-map.md) — current skill inventory/lineage.
- [Source Map](sources/source-map.md) — source/authority bridge.
- [Validation Report](../foundation/validation-report.md) — current proof status.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — completed local procedure/history reference.
- [Decision Log](decision-log.md) — durable decisions/reasons.
- [Review Index](reviews/review-graph.md) — current meaning of review evidence.
- [Task Board](operations/task-board.md) — future/non-active findings only.

## Retrieval map

| Need | Start here |
|---|---|
| Task routing / proof discipline | `AGENTS.md` |
| Stable facts | `CONTEXT.md` |
| Current continuation | `next-action.md` |
| Completed acceptance procedure | `operations/local-acceptance-runbook.md` |
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
- Completed procedures own procedure/evidence, not current status.
- Reviews own evidence; Git history owns obsolete implementation/planning detail.
- Do not create manual changelog/plan/audit/template layers when an existing owner or Git history is sufficient.
- Obsidian UI/workspace state is local and intentionally untracked.
- Prefer deleting stale routing over adding another documentation layer.
