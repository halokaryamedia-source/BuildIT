# Workspace Agent Routing

## Branch and boot

- `Local` is working authority; `main` changes only on explicit user request.
- Material GitHub work follows `GITHUB_RULES.md`.

## Execution Context Gate

Classify by **actual capability**, not product/UI name:

```text
CONTEXT: REMOTE_GITHUB
CONTEXT: LOCAL_CODE
CONTEXT: LIVE_BLOCKBENCH
SWITCH CONTEXT: <REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH>
```

A marker is intent, not proof. If it overstates capability, use the highest provable context and report the mismatch. Without a marker, choose the lowest sufficient provable context. Never infer `LOCAL_CODE` from “Codex” or a local-sounding task; never infer `LIVE_BLOCKBENCH` because Blockbench is mentioned. `LIVE_BLOCKBENCH` is never assumed.

```text
REMOTE_GITHUB   = GitHub repository + CI; no local worktree/Bun/installed Blockbench
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed BlockIT + functioning Gateway/runtime connection
```

Proof ceiling follows actual context; exact-commit source acceptance follows `GITHUB_RULES.md`.

```text
REMOTE_GITHUB → exhaust source/static/CI-verifiable work first
higher-context dependency → partition; prepare tests/harness/provenance/evidence here
handoff only the minimum LOCAL_CODE/LIVE_BLOCKBENCH residue
never transfer the whole task because one residue needs higher capability
covered source result complete → accept CI proof; label only genuinely missing higher-context proof
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
→ Bounded | Standard | Complex
→ nearest AGENTS.md + exact owner → only material continuity/evidence
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
Execution Partition / higher-context residue
Proof Required
STOP Condition
```

### Bounded Maintenance

Concrete bug/stale rule/test/CI routing or behavior-preserving cleanup starts at its exact owner.

### Standard Development

Use when requirement and owner are clear but work exceeds bounded maintenance. Finish the GitHub-verifiable partition before escalating any generator/filesystem/native residue.

### Complex / Ambiguous Development

Use `.agents/skills/development-brief/SKILL.md` for architecture/redesign, unclear or cross-owner requirements, material public contracts, unresolved success criteria, or quality/efficiency work. It keeps `Forbidden Proxy / Non-Goal` explicit.

## Task Class After Context

### Reference Preparation

Image generation belongs in **ChatGPT** using `blockbench-reference-generator`:

```text
source image / user intent → canonical five-preview board → user approval
→ actual approved reference image handed to Codex
```

### Asset Authoring

Before any BlockIT Bedrock Entity authoring mutation:

```text
current AGENTS.md
→ current .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ semantic owner
→ exactly one matching current specialist:

Geometry / rig / pivots / UV Layout
→ .agents/skills/blockbench-bedrock-modelling/SKILL.md

Texture Atlas / Styling / PBR / Texture Verify
→ .agents/skills/blockit-bedrock-texturing/SKILL.md

Animation / motion
→ .agents/skills/blockit-bedrock-animation/SKILL.md
```

No authoring mutation is allowed until the router + matching specialist are loaded from the current worktree and its prerequisite gate is satisfied. Prior-chat memory or remembered Skill content is not a substitute. Load a new specialist before the first mutation when semantic ownership changes.

New-model authoring:

```text
approved image → Active Workspace
→ Requirement Gate: Asset + Dimensions + Geometry Strategy + Animation Required
→ create Blockbench project
→ BlockIT Gateway → shared AUTHORING surface
→ Geometry form
→ internal verify → READY_FOR_USER_REVIEW → user Geometry APPROVED
→ Geometry-owned UV Layout → UV Layout PASS
→ Texturing → Texture Verify → user Texture APPROVED
→ Animation handoff when required → Finalization
```

`Geometry Strategy` is user-selected `DIRECT | 3D_ASSISTED`; never infer/default/auto-switch it. `3D_ASSISTED` is one package: Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → semantic Geometry cleanup. If its execution is unavailable, `BLOCKED`; never emulate/fallback.

Geometry and Texturing retain distinct semantic owners while sharing the AUTHORING Runtime surface. A texture-discovered Geometry/UV defect returns directly to the Geometry owner; no `switch_authoring_phase` is required for Geometry↔Texturing correction.

`HANDOFF_REQUIRED` is only for AUTHORING↔Animation. Retain resume-critical state, invoke `switch_authoring_phase` through Gateway, load the matching specialist, and continue the **same task/chat**.

For normal asset authoring, do not automatically load repository continuation/history/foundation docs. Asset authoring is not software **Development**; do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref, GitHub-first partitioning, transfer, atomic delivery, CI/security, retries, STOP.

## Source Precedence

current user → current source/proof → root/nearest `AGENTS.md` → foundation → `next-action.md` → `CONTEXT.md` → history.

## Work Discipline

- Fix the minimum complete owner; no fallback/framework/profile layers without evidence.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid; never claim proof above context ceiling.
- **Authoring Efficiency** = cost to accepted result; **Static Footprint** = guardrail only.

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
