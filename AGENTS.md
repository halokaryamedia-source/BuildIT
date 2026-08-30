# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Branch and boot

- `Local` is working authority; `main` changes only on explicit user request.
- Material GitHub work follows `GITHUB_RULES.md`.
- Reuse a boot while repo/ref/rules and execution capability remain current.

## Execution Context Gate

Classify by **actual capability**, not product/UI name, before task class or implementation.

```text
CONTEXT: REMOTE_GITHUB
CONTEXT: LOCAL_CODE
CONTEXT: LIVE_BLOCKBENCH
SWITCH CONTEXT: <REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH>
```

A marker states intended context, not proof. Confirm capability. If it overstates capability, use the highest provable context and report the mismatch. Without a marker, choose the lowest sufficient provable context. Never infer `LOCAL_CODE` from “Codex” or a local-sounding task; never infer `LIVE_BLOCKBENCH` because Blockbench is mentioned. `LIVE_BLOCKBENCH` is never assumed.

```text
REMOTE_GITHUB   = GitHub repository + CI; no local worktree/Bun/installed Blockbench
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed/reloaded BlockIT + reconnected live MCP client
```

Context persists until explicit switch or capability changes. Proof ceiling: `REMOTE_GITHUB` = source/static/CI; `LOCAL_CODE` adds local build/test/generator/filesystem; `LIVE_BLOCKBENCH` adds installed/live Blockbench proof.

```text
required acceptance <= current proof ceiling → continue
needs unavailable generator/runtime → handoff before substantial edits
bounded source result complete here → deliver + remaining proof = LOCAL PROOF REQUIRED
```

CI does not replace generator-owned committed output or live Blockbench proof.

### Observe / recover context

For read-only `amati`, inspect, audit, or recovery:

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

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** first.

#### Development Execution Gate

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

Escalate to `development-brief` only for architecture/redesign, cross-owner/material ambiguity, non-obvious public contract design, unresolved success criteria, or quality/efficiency work. The brief keeps `Forbidden Proxy / Non-Goal` explicit. **Authoring Efficiency** is cost to an accepted result; **Static Footprint** is only a guardrail.

### Bounded Maintenance

A concrete bug, stale rule/test, CI-routing defect, or behavior-preserving cleanup may start at its exact owner. Load continuity/brief only when it can change scope or acceptance.

### Standard Development

Use the standard contract when requirement and likely owner are clear but work exceeds bounded maintenance. Recover continuity only when material; add one specialist only when useful.

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

Do not preload later-phase specialists. On `HANDOFF_REQUIRED`, retain resume-critical state, switch/reload, then load only its specialist. `workspace/active/<project>/README.md` owns continuity.

For normal asset authoring, do not automatically load repository continuation/history/foundation docs. Asset authoring is not software **Development**; do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref, context transfer, atomic delivery, CI/security, retries, and STOP. One coherent multi-file change stays one logical commit.

## Source Precedence

current user → current source/proof → root/nearest `AGENTS.md` → foundation → `next-action.md` → `CONTEXT.md` → history only when rationale matters. Current source outranks stale continuation.

## Work Discipline

- Inspect owner/caller/pattern first; make the minimum complete change.
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

GitHub → `GITHUB_RULES.md`; flow → `docs/knowledge/flow.md`; continuation → `docs/knowledge/next-action.md`; assets → `workspace/active/<project>/README.md`; stable facts → `CONTEXT.md`; source ownership → `docs/knowledge/implementation-map.md`; proof → `docs/knowledge/current-validation.md`; durable policy → `docs/foundation/`; local acceptance → `docs/knowledge/operations/local-acceptance-runbook.md` when reactivated; research → `Experimental/`.

Do not create duplicate navigation, review archives, decision logs, roadmaps, or parallel state systems.
