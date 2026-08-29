---
name: development-brief
description: Escalation contract for complex or ambiguous BlockIT Developing. Use when success criteria, ownership, architecture, cross-owner scope, or quality/efficiency evidence needs explicit grounding. Not for bounded maintenance, clear standard development, or ordinary asset authoring.
---

# Development Brief

Use this Skill only when the lightweight routes in root `AGENTS.md` are insufficient. It protects complex work without turning every repository change into planning ceremony.

Root `AGENTS.md` owns route selection, boot, source precedence, and the Developing Execution Gate. `GITHUB_RULES.md` owns GitHub execution/history/CI.

## Entry boundary

Enter this brief for architecture/redesign, unclear or cross-owner requirements, material public/product contract design, unresolved success criteria, quality/fidelity/accuracy/efficiency optimization, or when a standard task encounters a material unknown that can change the owner or acceptance.

Do **not** load this Skill for bounded maintenance or a clear standard change merely because the task touches repository/plugin source.

Normal asset authoring is not Developing. A read-only `amati / inspect / understand` request reports and stops unless the user also asks to change something.

## Mandatory Developing continuity

When this full brief is entered:

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ smallest owner/evidence needed
```

This prevents a new ChatGPT, Codex, or Opencode session from inventing boundaries or repeating completed work. Reuse an already-current in-session boot. If continuation conflicts with current source, current source wins; reconcile the stale record without creating a separate ceremony commit when safe.

## Development Contract

Always make these decision-ready:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Failure Classification / first wrong owner
In scope / out of scope
Proof Required
STOP Condition
```

Add only when they materially change the decision:

```text
Generic requirement
Suggested method / fixture
Execution channel
Input authority / expected output
Build owner / Acceptance POV
Acceptance criteria
Proof budget
Material unknowns
```

`UNKNOWN` is valid for the first wrong owner only when the evidence needed to resolve it is explicit. A proposed method is not automatically the requirement. Samples/fixtures are evidence unless object-specific behavior is requested.

## Effectiveness vocabulary

For product-quality or usage work, keep these separate:

- **Authoring Quality** — whether the intended output reaches the accepted visual/functional result.
- **Authoring Efficiency** — **Cost to Accepted Result**: the shortest justified path to that accepted result, including unnecessary discovery, readback, retry, recovery, and correction.
- **Static Footprint** — instruction/schema/surface-size guardrails only; not proof of Authoring Efficiency.

A smaller Skill, prompt, schema, tool surface, or raw call count is not improvement if accepted quality regresses or work is merely displaced elsewhere.

## Evidence before optimization

For quality, fidelity, accuracy, efficiency, less usage, or less looping:

```text
current behavior / exact artifact
→ representative evidence
→ classify failure
→ first wrong owner
→ smallest complete change
→ matching proof
```

Do not begin by shrinking Skills, prompts, schemas, or tool lists unless Static Footprint itself is the requirement. Static evidence cannot prove live authoring efficiency or visual quality.

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

1. **Recover and ground** — apply mandatory continuity and separate fact, proposal, history, and unknown.
2. **State the contract** — Goal, Success Metric, Forbidden Proxy, evidence, scope, proof, STOP.
3. **Preflight regressions** — inspect only affected owners/tests; repair stale tests as stale tests.
4. **Get first evidence** — runtime/quality claims require matching evidence, not static proxies.
5. **Diagnose first wrong owner** — `No change required` and `UNKNOWN pending named evidence` are valid.
6. **Choose one build owner** — add at most one specialist only when it contributes material procedure.
7. **Implement one coherent patch** — follow `GITHUB_RULES.md`, compare final proof to the original Success Metric, then STOP.

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
