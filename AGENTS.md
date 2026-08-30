# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Branch and boot

- `Local` is the working authority; never silently use another ref. `main` changes only on explicit user request.
- Choose the smallest sufficient boot. Material GitHub work follows `GITHUB_RULES.md`.
- Reuse an in-session boot while repository/branch/rule authority remains current.

### Observe / recover context

For read-only `amati`, inspect, understand, audit, or recovery:

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ CONTEXT.md / next-action only if material
→ smallest owner
→ report → STOP
```

Do not edit, run CI, advance continuation, activate local acceptance, or execute a recorded next step unless the user also asks to continue/change something.

### Repository / Plugin Work

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ classify: Bounded | Standard | Complex
→ exact owner + nearest AGENTS.md
→ only material continuity/evidence
→ at most one useful specialist
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

Escalate to full `development-brief` only for architecture/redesign, cross-owner or material ambiguity, non-obvious public/product contract design, unresolved success criteria, or quality / efficiency / accuracy / less-usage / less-looping work. The full route keeps `Forbidden Proxy / Non-Goal` and material unknowns explicit.

Never substitute an easy proxy for the user's success condition. For quality/efficiency work, accepted result quality is the gate; **Authoring Efficiency** is cost to an accepted result; **Static Footprint** is only a context/surface guardrail. Static size or raw call count alone cannot prove improvement. Runtime/visual claims require matching evidence.

### Bounded Maintenance

A concrete bug, stale rule/test, CI-routing defect, or behavior-preserving cleanup with an exact owner may start from that owner when stable context cannot change the decision.

Do not load `CONTEXT.md`, `next-action.md`, or `development-brief` merely because work touches the repository. Load them only when stable/cross-session state can materially alter scope, ownership, or acceptance. Fix the first wrong owner; do not widen Maintenance into redesign.

### Standard Development

Use the standard contract when the requirement and likely owner are clear but the change is broader than bounded maintenance. Recover `CONTEXT.md` and `docs/knowledge/next-action.md` only when they can change the decision. Add one specialist only when it contributes material procedure.

### Complex / Ambiguous Development

Use `.agents/skills/development-brief/SKILL.md` for architecture/redesign, unclear/cross-owner requirements, material public-contract design, quality/efficiency optimization, or unresolved success criteria. This route recovers `CONTEXT.md` + `docs/knowledge/next-action.md` before implementation.

## Task Class First

### Reference Preparation

```text
source image / user intent
→ blockbench-reference-generator
→ readiness → one Draft → visual gate → user approval
```

### Asset Authoring

```text
current request / approved reference
→ persistent workspace when needed
→ blockit-bedrock-entity-mcp
→ ACTIVE PHASE
→ active specialist only
→ BlockIT MCP
```

Do not preload later-phase specialists. On `HANDOFF_REQUIRED`, preserve compact resume-critical state, switch/reload to the target phase, then load only its specialist.

`workspace/active/<project>/README.md` owns persistent asset continuity.

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, Git history, secondary indexes, or foundation docs. Asset authoring is not software **Development** merely because a model changes. Do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref authority, tool fit, atomic delivery, history, CI/API/security, retries, experimental Actions, and STOP behavior. One coherent multi-file change stays one logical commit.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. current `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. history/issues/PRs only when rationale can change the decision.

If `next-action.md` is stale, current source remains authority. Reconcile it in the same logical delivery when safe; block first only when stale continuation can materially change the decision.

## Work Discipline

- Inspect owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid. Never claim proof not obtained.
- Update status/continuity only when its owned state changed.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence.  
**Codex local / Blockbench desktop / Opencode local:** local runtime/model/visual proof when explicitly active and required.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live visual/runtime claim. Artifact existence is not visual approval until inspected.

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
