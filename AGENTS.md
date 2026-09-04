# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Branch and Boot

- `Local` is working authority; `main` changes only on explicit user request.
- Material GitHub work follows `GITHUB_RULES.md`.
- Reuse a boot while repo/ref/rules and execution capability remain current.

## Execution Context Gate

Classify by **actual capability**, not product/UI name, before task class or implementation.

```text
REMOTE_GITHUB   = GitHub repository + CI; no local worktree/Bun/installed Blockbench
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed BlockIT runtime + functioning Gateway/runtime connection
```

A context marker states intended context, not proof. Use the highest actually provable context and never infer `LIVE_BLOCKBENCH` merely because Blockbench is mentioned.

```text
required acceptance <= current proof ceiling → continue
needs unavailable generator/runtime → handoff before substantial edits
bounded source result complete here → deliver + remaining proof = LOCAL PROOF REQUIRED
```

CI does not replace generator-owned committed output or live Blockbench proof.

### Observe / Recover

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

Use `.agents/skills/development-brief/SKILL.md` for architecture/redesign, unclear or cross-owner requirements, material public-contract design, unresolved success criteria, or quality/efficiency optimization. Normal asset authoring is not software Development.

## Task Class After Context

### Reference Preparation

Operational reference-image creation belongs in **ChatGPT**.

```text
source image / user intent
→ ChatGPT reference generation using the canonical five-view contract
→ user review/correction
→ user approval
→ actual approved image handed to Codex
```

`.agents/skills/blockbench-reference-generator/SKILL.md` is the reference-generation specification; normal Codex asset authoring consumes the approved image rather than trying to reproduce the generation stage.

### New Asset Authoring

Normal new-model authoring is strictly ordered:

```text
approved image arrives
→ create Active Workspace
→ mandatory Requirement Gate
→ all required values complete
→ create Blockbench project
→ Geometry
→ user approval
→ Texturing
→ user approval
→ Animation only when required
→ user approval when present
→ Finalization
→ final save
```

Mandatory new-model intake:

```text
Asset
Approved Reference
Dimensions
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

`Geometry Strategy` is a **user decision**. Never infer/default/auto-switch it. Ask for all missing mandatory values in one batch and ask follow-up only for unresolved/material ambiguity.

No Blockbench model authoring begins until the Requirement Gate passes.

The two Geometry strategies are:

```text
DIRECT
→ normal reference-guided Geometry

3D_ASSISTED
→ one indivisible package:
   Approved Reference → Shape Reconstruction → PrimitiveAnything
   → deterministic Cuboid Scaffold → semantic Geometry cleanup
```

Do not invent GLB-only, PrimitiveAnything-only, provider-specific, or automatic-fallback routes. The production 3D-Assisted orchestrator/materializer is currently design-locked but not yet promoted; when unavailable, report the exact blocker rather than emulating it.

### Stage Review / Handoff

Codex owns internal readiness; user owns final stage approval.

```text
AUTHOR
→ internal technical + visual verify
→ correct material defects
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revise → same owning stage
   └─ explicit approve → checkpoint save → next required stage
```

Internal captures may be used by Codex but do not need to be shown to the user. Never send obviously unfinished work to user review. Same material causal correction failing twice without new evidence → `BLOCKED`, not an approval request.

An approved stage reopens only for a material downstream blocker owned by that stage. Invalidate only materially affected downstream approvals.

Do not preload later-phase specialists. On an actual phase change, retain resume-critical state, invoke `switch_authoring_phase` through the Gateway, let the Gateway refresh its Runtime catalog, then load only the target specialist and continue the same task/chat.

### Existing Asset Update

```text
user supplies/identifies .bbmodel + change request
→ recover/create Active Workspace
→ if externally supplied and untracked, persist it as current baseline before mutation
→ inspect existing model
→ determine affected stage(s)
→ ask only material missing information
→ update owning stage(s)
→ internal verify
→ user approval for affected stage(s)
→ Finalization when all required states are approved
```

Reference is required only when success depends on visual/fidelity judgement. For a tracked asset, reuse stored Geometry Strategy. For an untracked external model, ask strategy only if Geometry authoring is required and the strategy is unknown.

## Gateway Routing

Normal AI-client boundary remains:

```text
AI client → BlockIT Gateway → phase-filtered Runtime → Blockbench
```

Known exact capability → invoke directly. Unknown/stale capability → `search_capabilities`; use `describe_capability` only when current schema is needed. Capability discovery is deferred spec loading, not a second router.

Do not treat a normal phase handoff as a reconnect/new-chat boundary.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref, context transfer, atomic delivery, CI/security, retries, and STOP. One coherent multi-file change stays one logical commit.

## Source Precedence

current user → current source/proof → root/nearest `AGENTS.md` → foundation → `next-action.md` → `CONTEXT.md` → history only when rationale matters. Current source outranks stale continuation.

## Work Discipline

- Inspect owner/caller/pattern first; make the minimum complete change.
- Do not broaden scope or add fallback/framework/profile/compatibility layers without proved need.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim proof above the current execution-context ceiling.
- Update status/continuity only when its owned state changed.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades live visual/runtime proof.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains default. Tool/file/coordinate success is not visual fidelity. For `mcp/**`, `mcp/AGENTS.md` owns package rules.

## Canonical Owners

GitHub → `GITHUB_RULES.md`; detailed flow → `docs/knowledge/flow.md`; continuation → `docs/knowledge/next-action.md`; active asset state → `workspace/active/<asset>/README.md`; workspace contract → `workspace/README.md`; stable facts → `CONTEXT.md`; source ownership → `docs/knowledge/implementation-map.md`; proof → `docs/knowledge/current-validation.md`; durable policy → `docs/foundation/`; research → `Experimental/`.

Do not create duplicate routing, approval, continuation, provider, or workspace-state systems.
