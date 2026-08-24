---
name: development-brief
description: Mandatory front door for non-trivial BlockIT Developing. Recover continuity, define the real success metric and forbidden proxies, identify first evidence/owner, bound scope and proof, then use at most one specialist. Not for ordinary asset authoring.
---

# Development Brief

Turn a repository/plugin change request into the **smallest grounded development contract without losing cross-session context**.

Root `AGENTS.md` owns boot, routing, source precedence, and the Developing Execution Gate. `GITHUB_RULES.md` owns GitHub execution/history/CI. Do not duplicate them here.

## Entry boundary

Use for non-trivial changes to BlockIT itself: MCP/plugin behavior, repository policy, skills, workflows, build/test contracts, or shared engineering.

Normal asset authoring is not Developing. A read-only `amati / inspect / understand` request does not enter implementation; recover context, report, and STOP unless the user asks to continue/change something.

## Mandatory Developing continuity

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ smallest owner/evidence needed
```

`CONTEXT.md` and `next-action.md` are mandatory so a new ChatGPT, Codex, or Opencode session does not invent boundaries, repeat completed work, or select arbitrary TODOs.

If `next-action.md` and current source materially disagree:

```text
verify exact current owner
→ identify stale record
→ reconcile it
→ continue from actual state
```

### Bounded Maintenance exception

For a concrete defect whose decision cannot be changed by stable project context, start from the exact defect/owner. Read `CONTEXT.md` only when stable project facts materially affect the decision.

## Development Contract

Record only material fields:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
Generic requirement
Suggested method / fixture (if any)
Execution channel (only when material)
Input authority / expected output
First Evidence Required
Failure Classification / first wrong owner
Build owner / Acceptance POV
In scope / out of scope
Acceptance criteria: 2-5
Proof budget
STOP Condition
Material unknowns
```

`UNKNOWN` is valid for the first wrong owner when the evidence needed to resolve it is explicit. A proposed method is not automatically the requirement. Samples/fixtures are evidence unless object-specific behavior is requested.

## Effectiveness vocabulary

For product-quality or usage work, keep these separate:

- **Authoring Quality** — whether the intended output reaches the accepted visual/functional result.
- **Authoring Efficiency** — **Cost to Accepted Result**: the shortest justified decision path, especially unnecessary discovery, readback, capture, retry, recovery, and correction work.
- **Static Footprint** — instruction characters, schema size, serialized surface size, and similar context/bloat guardrails. It is not an Authoring Efficiency success metric.

A smaller Skill, prompt, schema, tool surface, or raw call count is not product improvement when accepted quality regresses or when unnecessary work is merely displaced elsewhere.

## Evidence before optimization

For requests such as quality, fidelity, accuracy, efficiency, less usage, or less looping:

```text
current behavior / exact artifact
→ representative evidence
→ classify failure
→ first wrong owner
→ smallest complete change
→ matching proof
```

Do not start by shortening Skills, prompts, schemas, or tool lists unless **Static Footprint itself** is the user's requirement. Static source can prove footprint/contract properties; it cannot prove live authoring efficiency or visual quality.

## Failure classification

Use the first category that explains the observed failure:

```text
AGENT_REASONING
SKILL_INSTRUCTION
MCP_PUBLIC_CONTRACT
MCP_RESULT_QUALITY
STATE_DISCOVERY
VISUAL_FEEDBACK
CORRECTION_CAPABILITY
BLOCKBENCH_RUNTIME
ENVIRONMENT / INSTALL
STALE_TEST
ROUTING_FAILURE
PROOF_FAILURE
UNKNOWN
```

Do not patch a downstream owner because it is easier to edit.

## Procedure

1. **Recover and ground** — apply mandatory continuity; separate fact, proposal, history, and unknown.
2. **State the contract** — Goal, Success Metric, Forbidden Proxy, evidence, scope, proof, STOP.
3. **Preflight regressions** — inspect affected owners/tests before writing; stale tests are repaired as stale tests.
4. **Get first evidence** — when behavior/quality/efficiency is runtime-facing, do not substitute static proxies.
5. **Diagnose first wrong owner** — `No change required` and `UNKNOWN pending named evidence` are valid.
6. **Choose POVs** — Build POV owns the change; Acceptance POV determines whether it solves the real need.
7. **Choose one build owner** — add at most one specialist only when it adds material procedure.
8. **Implement one coherent patch** — follow `GITHUB_RULES.md`; no intermediary/checkpoint commits.
9. **Final gate** — compare actual proof against the original Success Metric, not against a convenient proxy; then STOP.

## Owner Selection

```text
MCP public/schema/result/transport → mcp-server-development
Blockbench API/lifecycle/UI/Undo  → blockbench-runtime-development
TypeScript type-system            → typescript-type-safety
Bun/build/package tooling         → bun-tooling
model/visual judgement            → blockbench-bedrock-modelling
```

If no specialist adds material procedure, do not load one.

## Completion Boundary

Report implementation separately from live verification where required. Do not invent another planning/review layer merely to appear more rigorous.
