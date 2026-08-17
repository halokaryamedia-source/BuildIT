---
name: development-brief
description: Mandatory front door for non-trivial BlockIT repository/plugin Developing. Recover stable context and active continuation, ground the real goal, define minimal scope with 2-5 provable criteria and a proof budget, then use at most one relevant specialist. Do not use for ordinary asset authoring.
---

# Development Brief

Turn a repository/plugin change request into the **smallest grounded development contract without losing cross-session context**.

Root `AGENTS.md` owns boot, routing, source precedence, and evidence. `GITHUB_RULES.md` owns GitHub execution/history/CI. Do not duplicate them here.

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

`CONTEXT.md` and `next-action.md` are mandatory so a new session does not invent boundaries, repeat completed work, or select arbitrary TODOs.

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
Generic requirement
Suggested method / fixture (if any)
Input authority / expected output
Build owner / Acceptance POV
In scope / out of scope
Acceptance criteria: 2-5
Proof budget
Material unknowns
```

A proposed method is not automatically the requirement. Samples/fixtures are evidence unless object-specific behavior is requested.

## Procedure

1. **Recover and ground** — apply mandatory continuity, then read only extra evidence that can change the decision. Separate fact, proposal, history, and unknown.
2. **Preflight regression assertions** — collect all affected owners and required invariants before writing; inspect targeted tests/invariants before editing.
3. **Need development?** — inspect current behavior first. `No change required` is valid. Old audits/TODOs and adjacent cleanup are not scope by default.
4. **Choose POVs** — Build POV owns the change; Acceptance POV is the downstream consumer/operator that determines whether it solves the need.
5. **Set minimal scope/proof** — define 2-5 falsifiable criteria and the cheapest evidence that can falsify them.
6. **Choose one build owner** — add at most one specialist.
7. **Implement one coherent patch** — follow `GITHUB_RULES.md`. Do not use intermediary commits/pushes as regression discovery when assertions were available up front.
8. **Final gate** — re-check goal, out-of-scope, criteria, and actual proof. Distinguish implemented from verified when live Blockbench/browser proof remains unavailable. Update `next-action.md` only if active continuation changed.

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
