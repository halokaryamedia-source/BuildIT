# BlockIT Documentation

This folder contains BlockIT's human/project documentation. Keep current execution easy to find and historical evidence out of the normal boot path.

## Task-Aware Reading

Start with root [`AGENTS.md`](../AGENTS.md). Use [Flow](knowledge/flow.md) only when you need the detailed current sequence.

### Reference preparation

Use the source image/current request and `.agents/skills/blockbench-reference-generator/SKILL.md`.

```text
understand target
→ assisted intake / internal brief
→ pre-generation readiness
→ generate only when READY
→ visual gate
→ user approval
```

Do not load BlockIT MCP merely to prepare a reference image. Read [04 — Reference Guide](foundation/04-reference-guide.md) only when durable reference policy changes the decision.

### Asset authoring

Do not boot the documentation vault by default. Use the current request + actual approved reference image, `blockit-bedrock-entity-mcp`, and only the active modelling/texturing/animation specialist.

### Repository / plugin continuation

Read only what the current boundary needs:

1. [`AGENTS.md`](../AGENTS.md)
2. [Next Action](knowledge/next-action.md) when continuing current repository work
3. [`CONTEXT.md`](../CONTEXT.md) only when stable facts materially matter
4. [Implementation Map](knowledge/implementation-map.md) for a named MCP-tool defect or source ownership
5. the specific source/foundation/review owner required by the problem
6. [Local Acceptance Runbook](knowledge/operations/local-acceptance-runbook.md) only when local acceptance is explicitly reactivated

Do not broad-read all reviews, old plans, or the whole foundation set.

## Documentation Owners

| Area | Owns |
|---|---|
| [Flow](knowledge/flow.md) | **single detailed current task/product flow** |
| [Foundation](foundation/README.md) | durable product, reference, modelling, geometry, texture, visual-validation policy |
| [Reference Guide](foundation/04-reference-guide.md) | durable reference-preparation/readiness policy |
| [Knowledge Dashboard](knowledge/index.md) | repository-memory navigation |
| [Next Action](knowledge/next-action.md) | one active repository continuation state |
| [Implementation Map](knowledge/implementation-map.md) | current source/skill ownership and named-tool first stops |
| [Validation Report](foundation/validation-report.md) | current evidence/proof status |
| [Task Board](knowledge/operations/task-board.md) | future/non-active evidence-driven work |
| [Local Acceptance Runbook](knowledge/operations/local-acceptance-runbook.md) | completed local-test procedure; inactive by default |
| [Decision Log](knowledge/decision-log.md) | durable decisions/reasons |
| [Review Index](knowledge/reviews/review-graph.md) | current meaning of historical reviews |
| `mcp/docs/` | generated MCP API documentation; secondary to source |

## Current Boundary

Current non-local repository state includes **P0–P7 + assisted Reference Generator intake + pre-generation readiness**.

```text
repository/static contracts
→ available now

Reference Generator real-image behavior
→ image-capable direct evidence

installed Codex / Blockbench / model-facing behavior
→ LOCAL PROOF REQUIRED only when explicitly activated
```

No local Codex/Blockbench run is active.

## Knowledge-Vault Hygiene

`docs/knowledge/` can be opened as an Obsidian vault. Obsidian UI/workspace configuration is intentionally local and ignored; repository truth is the Markdown content, not editor layout state.

Keep one document per responsibility. **Do not copy the full production flow into multiple entrypoints**; link to `knowledge/flow.md` instead. Prefer removing stale routing or relying on Git history over adding another planning/changelog layer.
