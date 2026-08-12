# Workspace Agent Routing

This repository is project memory. Current user intent owns the task; current source and relevant proof own behavior.

## Task Class First

Choose the smallest route before loading context.

### Asset Authoring

Use when the user wants to create, revise, texture, animate, inspect, validate, or export a Minecraft Bedrock Entity asset without changing plugin/repository source.

```text
current request/reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, engineering history, activation matrices, or all foundation docs. Load another owner only when the current asset decision depends on it.

Normal asset tool selection must **not search repository files/source/docs first**. The BlockIT orchestrator decides from intent + known state, then calls a loaded tool or one precise native `tool_search`. Repository/code search is only for actual source/plugin work or reproduced defects.

Asset authoring is not software **Developing** merely because it changes a model. Do not route it through `development-brief` unless source/plugin behavior itself is being changed.

### Repository / Plugin Work

Use for source, docs, tests, CI, MCP/plugin behavior, architecture, or maintenance.

```text
this file
→ docs/knowledge/next-action.md when continuing active work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md for create/change work
→ at most one relevant engineering specialist
```

Do not broad-scan reviews/foundation/history before a concrete boundary needs them.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. `docs/foundation/` policy;
5. `docs/knowledge/next-action.md` active continuation;
6. `CONTEXT.md` stable facts;
7. decision/review history for rationale.

Resolve material conflicts explicitly; never choose a convenient source silently.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before creating another layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures and named assets are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim a check, runtime result, or visual approval that was not obtained.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only. Do not invent Blockbench runtime proof.

**Codex local:** use shell/MCP/Blockbench only when the current claim actually requires it; do not run broad checks by ritual.

Use the cheapest evidence that can falsify the claim:

- docs/routing → changed owner + relevant diff;
- bounded source → affected contract/caller + targeted gate;
- destructive/public contract → stronger regression proof;
- Blockbench/UI/visual claim → live evidence;
- local correction → affected state/view only unless it exposes a global issue.

Do not create tests, screenshots, reports, or builds merely to look rigorous. Source/CI proof never upgrades a live visual claim.

Evidence labels, only when materially useful:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) is the retained default. Tool success is execution evidence, not visual fidelity. Reference-driven visual judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation requires guessing or repeated failed work.

Detailed modelling judgement belongs to `blockbench-bedrock-modelling`; texture/PBR to `blockit-bedrock-texturing`; animation to `blockit-bedrock-animation`. Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format.

For `mcp/**`, `mcp/AGENTS.md` owns the engineering contract: strict TypeScript, Zod boundary validation, runtime-global separation, registration/result rules, generated docs, loopback containment, and dangerous-default quarantine.

## Canonical Owners

- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- product/modelling policy → `docs/foundation/`
- durable rationale → `docs/knowledge/decision-log.md`
- plugin/runtime → `mcp/` source + proof
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`
- repository change contract → `.agents/skills/development-brief/`

Do not recreate retired generic skills or parallel planning/state systems.

## Communication

Keep progress compact. Report decisions, proof, blockers, and one next step; do not narrate every call.