# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## GitHub work

For any material GitHub read/write, read and follow [GITHUB_RULES.md](GITHUB_RULES.md) before editing.

`GITHUB_RULES.md` is the canonical ChatGPT ↔ GitHub operating policy. Repository-specific rules here may narrow domain behavior, but they do not duplicate or weaken its safety, tool-fit, validation, retry, or STOP rules.

## Task Class First

### Reference Preparation

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ readiness → one Draft → visual gate → user approval
```

Image-capable work only. Generation is output, not discovery. Detailed sequence: `docs/knowledge/flow.md`; durable policy: `docs/foundation/04-reference-guide.md`.

### Asset Authoring

```text
current request / actual approved reference
→ named workspace package when persistent
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For persistent work, `workspace/active/<project>/README.md` owns asset continuity. Read only that package and needed current files; never scan all active projects. Stored paths/prose are not visual evidence.

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, Git history, secondary skill indexes, or the whole foundation set. Asset authoring is not software **Developing** merely because a model changes. Do not route it through `development-brief` unless repository/plugin behavior changes.

### Repository / Plugin Work

```text
this file
→ GITHUB_RULES.md before material GitHub write
→ docs/knowledge/next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. current `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. Git history / GitHub issues or PRs only when historical rationale can change the decision.

## Evidence boundary

Use evidence labels only when material uncertainty remains:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live Blockbench/model/visual/runtime claim.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

For `mcp/**`, `mcp/AGENTS.md` owns package-specific engineering rules.

## Canonical Owners

- detailed current flow → `docs/knowledge/flow.md`
- repository/plugin continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- saved/parked assets → `workspace/saved/`
- asset workspace rules → `workspace/README.md`
- stable facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/foundation/validation-report.md`
- durable policy → `docs/foundation/`
- local procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- historical rationale → Git history / GitHub issues and PRs

Do not recreate duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems in the active tree.
