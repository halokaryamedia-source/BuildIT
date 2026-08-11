# Minimal Navigation

Updated: 2026-08-11

Use this note only when the task class is not already obvious from root `AGENTS.md`.

## 1. Classify The Request First

### Asset authoring

Creating/revising/inspecting/texturing/animating/exporting a Bedrock Entity asset without changing repository/plugin source:

```text
AGENTS.md
→ current request/reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active domain specialist
```

Do **not** automatically load `CONTEXT.md`, `next-action.md`, development history, or all foundation notes.

### Repository / plugin work

Source/docs/CI/MCP/plugin/repository maintenance:

```text
AGENTS.md
→ CONTEXT.md when stable facts matter
→ next-action.md when continuing current work
→ affected source + nearest AGENTS.md
```

For a create/change task, use `../../.agents/skills/development-brief/SKILL.md` and at most one relevant engineering specialist unless a genuinely independent boundary is proved.

## 2. Current Repository Continuation

If `next-action.md` says local acceptance, read next:

[Local Acceptance Runbook](operations/local-acceptance-runbook.md)

Then use `../../mcp/README.md` and `../../mcp/AGENTS.md` while executing the plugin/runtime checks.

Do not replan from historical reviews before running the baseline described by the runbook.

## 3. Open Only One Additional Owner When Needed

- [Foundation README](../foundation/README.md) — product/modelling policy.
- [Implementation Map](implementation-map.md) — current source ownership.
- [Activation Matrix](skills/activation-matrix.md) — skill choice.
- [Validation Report](../foundation/validation-report.md) — current evidence status.
- [Source Map](sources/source-map.md) — authority/path lookup.
- [Review Index](reviews/review-graph.md) — only when historical evidence is needed.
- [Task Board](operations/task-board.md) — future/non-active work only.

## Stop Rule

- Do not broad-scan the vault, generated output, historical branches, dependencies, or old chats by default.
- If the current owner answers the question, stop reading.
- If a material claim is not provable in the current execution channel, record the exact remaining proof instead of inventing it.
