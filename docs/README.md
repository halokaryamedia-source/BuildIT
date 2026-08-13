# BlockIT Documentation

This folder contains BlockIT's human/project documentation. Keep current execution easy to find and historical evidence out of the normal boot path.

## Task-aware reading

Start with root [`AGENTS.md`](../AGENTS.md).

### Reference preparation

Use the source image/current request and `.agents/skills/blockbench-reference-generator/SKILL.md`. Read [04 — Reference Guide](foundation/04-reference-guide.md) only when the generation/approval decision needs durable reference policy.

Do not load BlockIT MCP merely to prepare a reference image.

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

## Documentation owners

| Area | Owns |
|---|---|
| [Foundation](foundation/README.md) | durable product, reference, modelling, geometry, texture, visual-validation policy |
| [Knowledge Dashboard](knowledge/index.md) | current repository-memory navigation |
| [Next Action](knowledge/next-action.md) | one active repository continuation state |
| [Flow](knowledge/flow.md) | compact current task/production flow |
| [Implementation Map](knowledge/implementation-map.md) | current source/skill ownership and named-tool first stops |
| [Validation Report](foundation/validation-report.md) | current evidence/proof status |
| [Task Board](knowledge/operations/task-board.md) | future/non-active evidence-driven work |
| [Local Acceptance Runbook](knowledge/operations/local-acceptance-runbook.md) | completed local-test procedure; inactive by default |
| [Decision Log](knowledge/decision-log.md) | durable decisions/reasons; older entries may be superseded by later current source/decisions |
| [Review Index](knowledge/reviews/review-graph.md) | current meaning of historical reviews |
| `mcp/docs/` | generated MCP API documentation; secondary to source |

## Current boundary

Current non-local repository state is synchronized through **P0–P7 + the minimal Reference Generator route**.

```text
non-local current-state/source/contract work
→ available now

Reference Generator visual-quality proof
→ image-capable direct evidence

installed Codex / Blockbench / model-facing behavior
→ LOCAL PROOF REQUIRED only when explicitly activated
```

No local Codex/Blockbench run is active.

## Knowledge-vault hygiene

`docs/knowledge/` can be opened as an Obsidian vault. Obsidian UI/workspace configuration is intentionally local and ignored; repository truth is the Markdown content, not editor layout state.

Keep one document per responsibility. Prefer removing stale routing or relying on Git history over adding another planning/changelog layer.
