# Knowledge Dashboard

Updated: 2026-08-12

Use this page as BlockIT's **repository-memory index**. It is not mandatory context for ordinary asset authoring; root `AGENTS.md` decides the task route first.

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

Do not load repository history or continuity notes unless the asset decision actually depends on repository state or a protected product/capability boundary.

### Repository / plugin continuation

```text
AGENTS.md
→ next-action.md
→ affected source + nearest AGENTS.md
→ one additional owner only when needed
```

Read `CONTEXT.md` only when stable facts matter. The [Local Acceptance Runbook](operations/local-acceptance-runbook.md) is completed procedure/history and is not default boot.

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

The first bounded Codex + Blockbench acceptance pass is complete. Representative live behavior is recorded in the [Validation Report](../foundation/validation-report.md).

**Current continuation is static pre-local efficiency cleanup.** Source-provable waste is reduced first; another Codex/Blockbench run is deferred until that cleanup is stable and CI-green. Client-only questions such as schema injection, prompt co-loading, and actual token/latency cost remain future validation questions rather than reasons to change architecture now.

## Knowledge spine

- [Next Action](next-action.md) — current repository continuation.
- [Minimal Navigation](minimal-nav.md) — shortest task-aware route.
- [Implementation Map](implementation-map.md) — current source ownership/surface.
- [Skill Activation Matrix](skills/activation-matrix.md) — skill selection.
- [Validation Report](../foundation/validation-report.md) — current proof status.
- [Task Board](operations/task-board.md) — future/non-active findings.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — completed local procedure/history.
- [Review Index](reviews/review-graph.md) — historical review evidence.

Open the longer skill map, source map, decision log, or individual reviews only when the active decision needs them.

## Retrieval map

| Need | Start here |
|---|---|
| Task routing / proof discipline | `AGENTS.md` |
| Current continuation | `next-action.md` |
| Stable facts | `CONTEXT.md` |
| Current implementation | `implementation-map.md` |
| MCP runtime/build | `../../mcp/README.md` + affected source |
| Product/modelling policy | `../foundation/README.md` |
| Skill routing | `skills/activation-matrix.md` |
| Current proof status | `../foundation/validation-report.md` |
| Historical evidence | `reviews/review-graph.md` |
| Future work | `operations/task-board.md` |

## Hygiene rules

- `next-action.md` is the only active repository-task snapshot.
- Completed procedures own procedure/evidence, not current status.
- Reviews own historical evidence; Git history owns obsolete implementation/planning detail.
- Do not create another roadmap, changelog, audit tracker, or parallel planning layer when an existing owner is sufficient.
- Prefer deleting stale routing over adding more routing prose.
