# Knowledge Dashboard

Updated: 2026-08-12

Use this page as BlockIT's **repository-memory index**. It is not mandatory context for ordinary asset authoring; root `AGENTS.md` decides task route first.

## Current owners

```text
agent/task routing             → AGENTS.md
stable facts / terminology     → CONTEXT.md
active repository continuation → next-action.md
completed local procedure      → operations/local-acceptance-runbook.md
product/reference/modelling    → docs/foundation/
source ownership               → implementation-map.md
named MCP-tool defect          → implementation-map.md Hot-Path Defect Index
durable decisions              → decision-log.md / decisions/
review evidence                → reviews/review-graph.md
future/non-active work         → operations/task-board.md
```

## Start here

### Asset authoring

```text
current request + actual reference when reference-driven
→ blockit-bedrock-entity-mcp
→ only active modelling/texturing/animation specialist
```

Do not load repository history/continuity notes unless the asset decision actually depends on repository state or a protected boundary.

### Repository / plugin continuation

```text
AGENTS.md
→ next-action.md
→ named MCP-tool defect? implementation-map.md Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ one additional owner only when needed
```

Read `CONTEXT.md` only when stable facts matter. The Local Acceptance Runbook is completed procedure/history and is not default boot.

## Product snapshot

```text
actual approved reference image available
→ View Pair Map + Reference Evidence Map
→ Semantic Form Contract
→ Primary Form Hypothesis
→ coarse Cube/Group form
→ minimum useful structural evidence
→ actual reference + fresh model views
→ claim-locked difference-first FAIL / UNVERIFIED / PASS
→ causal correction or global hypothesis rebuild
→ secondary geometry/hierarchy/pivots after primary PASS
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

Tool success is execution evidence, not visual approval. Reference path/manifest/prose/memory is not a substitute for actual image evidence. `BLOCKED` is valid when continuation would require guessing or repeated failed work.

## Accepted functional baseline

The first bounded Codex + Blockbench acceptance pass is complete. Representative live behavior is recorded in the [Validation Report](../foundation/validation-report.md).

Historical acceptance measurement:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Those counts are historical, not current token measurements. `export_model` remains exposed; `list_export_formats`, `apply_texture`, `filter_by_material` are absent from default callable surface; `risky_eval` and `from_geo_json` remain disabled.

## Current continuation

**Static pre-local efficiency cleanup is complete.** P0–P4 follow-up hardening is also complete: stage-locked authoring, static discovery evaluation, exact-name deferred spec loading, bounded deterministic recovery, and repository-only hot-path defect ownership.

P5/P6 modelling hardening is also implemented at source/contract level: semantic form/orientation/pivot/contact must be grounded before exact coordinates, and reference-driven approval requires actual approved image evidence + explicit claim/view pairing + fresh current model views. Static CI cannot prove that a model interpreted the image correctly; it proves only that the workflow must fail closed rather than silently guess.

Another Codex/Blockbench run is **not active** and must not start until the user explicitly requests it. Installed-client deferred-search parity, real token/latency/image-context cost, and model-facing image-understanding accuracy remain future evidence questions—not reasons for speculative routing/scoring architecture.

## Knowledge spine

- [Next Action](next-action.md) — current repository continuation.
- [Minimal Navigation](minimal-nav.md) — shortest task-aware route.
- [Implementation Map](implementation-map.md) — source ownership/surface + named-tool first stops.
- [Skill Activation Matrix](skills/activation-matrix.md) — skill selection.
- [Validation Report](../foundation/validation-report.md) — current proof status.
- [Task Board](operations/task-board.md) — future/non-active findings.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — completed local procedure/history.
- [Review Index](reviews/review-graph.md) — historical review evidence.

Open longer maps/decision history/reviews only when the active decision needs them.

## Retrieval map

| Need | Start here |
|---|---|
| Task routing / proof discipline | `AGENTS.md` |
| Current continuation | `next-action.md` |
| Stable facts | `CONTEXT.md` |
| Current implementation | `implementation-map.md` |
| Named MCP-tool defect | `implementation-map.md` → Hot-Path Defect Index |
| MCP runtime/build | `../../mcp/README.md` + affected source |
| Product/reference/modelling policy | `../foundation/README.md` |
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
