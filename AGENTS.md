# Workspace Agent Routing

## Branch and boot

- `Local` is working authority; `main` changes only on explicit user request.
- Material GitHub work follows `GITHUB_RULES.md`.

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
LIVE_BLOCKBENCH = LOCAL_CODE + deployed BlockIT runtime + functioning Gateway/runtime connection
```

Proof ceiling follows the context above.

```text
required acceptance <= current proof ceiling → continue
needs unavailable generator/runtime → handoff before substantial edits
bounded source result complete here → deliver + remaining proof = LOCAL PROOF REQUIRED
```

### Observe / recover context

For read-only `amati`, inspect, audit, or recovery:

```text
AGENTS.md → GITHUB_RULES.md Core Rules
→ CONTEXT.md / next-action only if material
→ smallest owner → report → STOP
```

### Repository / Plugin Work

```text
AGENTS.md → GITHUB_RULES.md Core Rules → EXECUTION CONTEXT
→ classify: Bounded | Standard | Complex
→ exact owner + nearest AGENTS.md → only material continuity/evidence
```

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

Concrete bug/stale rule/test/CI routing or behavior-preserving cleanup starts at its exact owner.

### Standard Development

Use when requirement/owner are clear but work exceeds bounded maintenance.

### Complex / Ambiguous Development

Use `.agents/skills/development-brief/SKILL.md` for architecture/redesign, unclear/cross-owner requirements, material public contracts, or quality/efficiency work.

## Task Class After Context

### Reference Preparation

Image generation belongs in **ChatGPT** using `blockbench-reference-generator`:

```text
source image / user intent → canonical five-preview board → user approval
→ actual approved reference image handed to Codex
```

### Asset Authoring

New-model authoring is ordered and user-driven:

```text
approved image → Active Workspace
→ Requirement Gate: Asset + Dimensions + Geometry Strategy + Animation Required
→ create Blockbench project
→ BlockIT Gateway → shared AUTHORING surface
→ Geometry/UV focus ↔ Texturing focus without Runtime handoff
→ Animation handoff when required → Finalization
```

`Geometry Strategy` is user-selected `DIRECT | 3D_ASSISTED`; never infer/default/auto-switch it. `3D_ASSISTED` is one package: Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → semantic Geometry cleanup. If target 3D-Assisted execution is unavailable, `BLOCKED`; never emulate/fallback.

Codex internally verifies before `READY_FOR_USER_REVIEW`; user inspects live Blockbench and explicitly approves meaningful stage checkpoints. Geometry and Texturing keep distinct semantic ownership, but their capabilities remain callable in the same AUTHORING Runtime surface. A texture-discovered Geometry/UV defect is corrected directly with the Geometry owner; no `switch_authoring_phase` is required for Geometry↔Texturing correction.

`HANDOFF_REQUIRED` is reserved for crossing AUTHORING↔Animation. Retain resume-critical state, invoke `switch_authoring_phase` through Gateway, load the matching specialist, and continue the **same task/chat**; no normal reconnect/new chat.

For normal asset authoring, do not automatically load repository continuation/history/foundation docs. Asset authoring is not software **Development**; do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref, transfer, atomic delivery, CI/security, retries, STOP.

## Source Precedence

current user → current source/proof → root/nearest `AGENTS.md` → foundation → `next-action.md` → `CONTEXT.md` → history.

## Work Discipline

- Fix the minimum complete owner; do not add fallback/framework/profile layers without evidence.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid; never claim proof above context ceiling.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains default. For `mcp/**`, `mcp/AGENTS.md` owns package rules.

## Canonical Owners

GitHub → `GITHUB_RULES.md`; flow → `docs/knowledge/flow.md`; continuation → `next-action.md`; assets → `workspace/active/<project>/README.md`; facts → `CONTEXT.md`; ownership → `implementation-map.md`; proof → `current-validation.md`; policy → `docs/foundation/`; research → `Experimental/`.

Do not create duplicate navigation, review archives, decision logs, roadmaps, or parallel state systems.
