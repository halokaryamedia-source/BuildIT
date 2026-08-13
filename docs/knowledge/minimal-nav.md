# Minimal Navigation

Updated: 2026-08-13

Use this note only when the task class is not already obvious from root `AGENTS.md`. For the full current sequence, use [Flow](flow.md); do not reconstruct it from multiple docs.

## 1. Pick The Smallest Route

### Reference preparation

Creating/revising the visual reference before Blockbench modelling:

```text
source image / current request
→ .agents/skills/blockbench-reference-generator/SKILL.md
```

The skill owns assisted intake, internal brief, pre-generation readiness, one Draft, bounded visual correction, and user approval. **Do not generate before readiness passes.** Do not load BlockIT MCP or repository-development skills for this route.

Open [Reference Guide](../foundation/04-reference-guide.md) only when durable policy is needed.

### Asset authoring

Creating/revising/inspecting/texturing/animating/exporting a Bedrock Entity without changing repository/plugin source:

```text
current request + actual approved reference image when reference-driven
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active domain specialist
```

Do **not** automatically load `CONTEXT.md`, `next-action.md`, development history, or all foundation notes.

### Repository / plugin work

Source/docs/CI/MCP/plugin/repository maintenance:

```text
AGENTS.md
→ next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ named MCP-tool defect? implementation-map Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, inspect the mapped source owner + primary regression owner before broad code search.

## 2. Local Acceptance

The first Local Acceptance pass is complete. Read [Local Acceptance Runbook](operations/local-acceptance-runbook.md) only when `next-action.md` explicitly reactivates local acceptance, a reproduced acceptance defect needs its classification rules, or historical procedure evidence is being audited.

## 3. One Additional Owner At Most

- [Flow](flow.md) — full current sequence.
- [Reference Guide](../foundation/04-reference-guide.md) — durable reference policy.
- [Implementation Map](implementation-map.md) — ownership / named-tool first stops.
- [Activation Matrix](skills/activation-matrix.md) — specialist choice.
- [Validation Report](../foundation/validation-report.md) — proof state.
- [Source Map](sources/source-map.md) — authority/path lookup.
- [Review Index](reviews/review-graph.md) — historical evidence only.
- [Task Board](operations/task-board.md) — future/non-active work only.

## Stop Rule

- If the current owner answers the decision, stop reading.
- Do not broad-scan the vault, generated output, historical branches, dependencies, or old chats by default.
- If the current execution channel cannot prove a material claim, record the missing proof instead of inventing it.
