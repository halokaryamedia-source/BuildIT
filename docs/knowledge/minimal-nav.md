# Minimal Navigation

Updated: 2026-08-13

Use this note only when the task class is not already obvious from root `AGENTS.md`.

## 1. Classify The Request First

### Reference preparation

Creating/revising the visual reference before Blockbench modelling:

```text
AGENTS.md
→ source image / current request
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ one approved Modelling Brief image
```

Do not load BlockIT MCP or repository-development skills just to generate the reference. Open `docs/foundation/04-reference-guide.md` only when durable reference policy changes the decision.

### Asset authoring

Creating/revising/inspecting/texturing/animating/exporting a Bedrock Entity asset without changing repository/plugin source:

```text
AGENTS.md
→ current request + actual approved reference image when reference-driven
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
→ named MCP-tool defect? implementation-map.md Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief for create/change work
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, the Hot-Path Defect Index supplies the first source owner and primary regression owner. Inspect that pair before broad code search; expand only when the pair cannot explain the defect.

## 2. Current Repository Continuation

`next-action.md` owns the current step. Follow its active boundary directly.

The first Local Acceptance Runbook pass is complete. Read [Local Acceptance Runbook](operations/local-acceptance-runbook.md) only when `next-action.md` explicitly reactivates local acceptance, a reproduced acceptance defect needs its classification rules, or historical procedure evidence is being audited.

Do not load the runbook by ritual during normal continuation, reference preparation, or asset authoring.

## 3. Open Only One Additional Owner When Needed

- [Foundation README](../foundation/README.md) — product/reference/modelling policy.
- [Reference Guide](../foundation/04-reference-guide.md) — reference preparation/grounding contract.
- [Implementation Map](implementation-map.md) — current source/skill ownership and named-tool defect first-stop index.
- [Activation Matrix](skills/activation-matrix.md) — skill choice.
- [Validation Report](../foundation/validation-report.md) — current evidence status.
- [Source Map](sources/source-map.md) — authority/path lookup.
- [Review Index](reviews/review-graph.md) — only when historical evidence is needed.
- [Task Board](operations/task-board.md) — future/non-active work only.

## Stop Rule

- Do not broad-scan the vault, generated output, historical branches, dependencies, or old chats by default.
- If the current owner—or the mapped hot-path source/test pair—answers the question, stop reading.
- If a material claim is not provable in the current execution channel, record the exact remaining proof instead of inventing it.
