# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Branch and boot

- `Local` is the working authority; `main` changes only on explicit user request.
- Use the smallest sufficient boot; material GitHub work follows `GITHUB_RULES.md`.
- Reuse an in-session boot while repository/ref/rules remain current.

## Execution Context Gate

Before task classification or implementation, classify by **actual capability**, not product/UI name:

```text
REMOTE_GITHUB   = GitHub repository + CI; no local worktree/Bun/installed Blockbench
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed/reloaded BlockIT + reconnected live MCP client
```

`REMOTE_GITHUB` may implement work provable by source/static/CI. `LOCAL_CODE` may additionally prove local build/test/generator/filesystem behavior. `LIVE_BLOCKBENCH` is required for installed `build_identity`, live `tools/list`, Undo/playback/persistence, and live model/visual/runtime claims.

```text
required acceptance <= current proof ceiling → continue
required complete delivery/proof needs unavailable generator/runtime → handoff before substantial edits
bounded source result is complete here → deliver + mark remaining proof LOCAL PROOF REQUIRED
```

CI is not a substitute for generator-owned committed output or live Blockbench proof.

### Observe / recover context

For read-only `amati`, inspect, understand, audit, or recovery:

```text
AGENTS.md → GITHUB_RULES.md Core Rules
→ CONTEXT.md / next-action only if material
→ smallest owner → report → STOP
```

Do not edit, run CI, advance continuation, activate local acceptance, or execute a recorded next step unless the user also asks to continue/change something.

### Repository / Plugin Work

```text
AGENTS.md → GITHUB_RULES.md Core Rules → EXECUTION CONTEXT
→ classify: Bounded | Standard | Complex
→ exact owner + nearest AGENTS.md → only material continuity/evidence
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad search.

#### Development Execution Gate

Use the smallest contract that protects the real result.

**Bounded contract**
```text
Goal
Failure Classification / first wrong owner
Acceptance
Proof Required
STOP Condition
```

**Standard contract**
```text
Goal
Success Metric
First Evidence Required / first wrong owner
In Scope / Out of Scope
Proof Required
STOP Condition
```

Escalate to `development-brief` only for architecture/redesign, cross-owner/material ambiguity, non-obvious public contract design, unresolved success criteria, or quality/efficiency work. It keeps `Forbidden Proxy / Non-Goal` and material unknowns explicit. Never substitute an easy proxy for the user's success condition; **Authoring Efficiency** is cost to an accepted result and **Static Footprint** is only a guardrail.

### Bounded Maintenance

A concrete bug, stale rule/test, CI-routing defect, or behavior-preserving cleanup with an exact owner may start from that owner. Load `CONTEXT.md`, `next-action.md`, or `development-brief` only when they can materially change scope/acceptance. Fix the first wrong owner; do not widen Maintenance into redesign.

### Standard Development

Use the standard contract when requirement and likely owner are clear but work is broader than bounded maintenance. Recover `CONTEXT.md` / `next-action.md` only when material; add one specialist only when useful.

### Complex / Ambiguous Development

Use `.agents/skills/development-brief/SKILL.md` for architecture/redesign, unclear/cross-owner requirements, material public-contract design, quality/efficiency optimization, or unresolved success criteria. Recover `CONTEXT.md` + `next-action.md` before implementation.

## Task Class After Context

### Reference Preparation

```text
source image / user intent → blockbench-reference-generator
→ readiness → one Draft → visual gate → user approval
```

### Asset Authoring

```text
current request / approved reference → persistent workspace when needed
→ blockit-bedrock-entity-mcp → ACTIVE PHASE → active specialist only → BlockIT MCP
```

Do not preload later-phase specialists. On `HANDOFF_REQUIRED`, preserve compact resume-critical state, switch/reload phase, then load only its specialist. `workspace/active/<project>/README.md` owns persistent asset continuity.

For normal asset authoring, do not automatically load repository continuation/history/foundation docs. Asset authoring is not software **Development** merely because a model changes; do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref authority, execution-context transfer, atomic delivery, history, CI/API/security, retries, experimental Actions, and STOP behavior. One coherent multi-file change stays one logical commit.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. current foundation policy;
5. `next-action.md`;
6. `CONTEXT.md`;
7. history only when rationale can change the decision.

If continuation is stale, current source remains authority; reconcile it only when its owned state matters.

## Work Discipline

- Inspect owner/caller/pattern before shared changes; make the minimum complete change.
- Do not broaden scope or add fallback/framework/profile/compatibility layers without proved need.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid. Never claim proof above the current execution-context ceiling.
- Update status/continuity only when its owned state changed.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades live visual/runtime proof. Artifact existence is not visual approval until inspected.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains default. Tool/file/coordinate success is not visual fidelity. For `mcp/**`, `mcp/AGENTS.md` owns package rules.

## Canonical Owners

- GitHub execution/history/CI/security → `GITHUB_RULES.md`
- product flow → `docs/knowledge/flow.md`
- continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- stable facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/knowledge/current-validation.md`
- durable policy → `docs/foundation/`
- local procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when reactivated
- research → `Experimental/`

Do not create duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems.
