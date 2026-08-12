---
name: development-brief
description: Front door for BlockIT repository create/change tasks. Ground the actual requirement, separate suggested method/fixture from the goal, set minimal scope and 2-5 provable acceptance criteria, identify execution channel, then hand off to at most one relevant implementation specialist. Do not use for ordinary asset authoring.
---

# Development Brief

Turn a repository create/change request into the **smallest grounded development contract**. Root `AGENTS.md` owns source precedence, proof economy, evidence labels, communication, and general anti-slop discipline; do not duplicate them here.

## Load Only Needed Context

Start with the current request and affected owner.

- Read `docs/knowledge/next-action.md` only when continuing current repository work.
- Read `CONTEXT.md` only when stable project facts materially affect the decision.
- Read one relevant policy/decision/source owner only when needed to resolve scope or a conflict.
- Do not load review history, task board, foundation set, or multiple specialists by ritual.

## Development Contract

Record only fields that affect implementation:

```text
Goal:
Generic requirement:
Suggested method / fixture (if any):
Execution channel:
Input authority / expected output:
Build owner:
Acceptance POV:
In scope / out of scope:
Acceptance criteria: 2-5
Proof budget:
Material unknowns:
```

A suggested implementation is not automatically the requirement. Samples, fixtures, and Golden Samples are evidence unless object-specific behavior is explicitly requested.

## Procedure

1. **Ground the requirement** — inspect the current owner/pattern and separate fact, assumption, unknown, and optional method.
2. **Decide whether code/docs must change** — `No change required` is valid when current behavior already satisfies the goal.
3. **Choose one build owner** — use this skill alone for trivial work; otherwise add at most one specialist whose domain procedure materially changes the implementation decision.
4. **Set minimal proof** — define 2-5 acceptance criteria and use the cheapest evidence that can falsify them. `ChatGPT → GitHub` provides repository/static proof; local runtime/Blockbench proof is used only when actually available and requested by the active task.
5. **Implement and re-check the same contract** — do not broaden scope because adjacent issues are visible. Before completion, verify goal, scope, criteria, and available proof against the original contract.

## Owner Selection

Choose by primary semantic responsibility, not every technology present:

```text
MCP public/schema/result/transport contract → mcp-server-development
Blockbench API/lifecycle/UI/Undo mechanics   → blockbench-runtime-development
TypeScript type-system problem              → typescript-type-safety
Bun/build/package tooling                   → bun-tooling
model/visual judgement                      → blockbench-bedrock-modelling
```

If no specialist adds material procedure, do not load one.

## Completion Boundary

Report `implemented` separately from `verified` when required live evidence was not obtained. Do not invent another plan, persona, review layer, or escalation skill merely to make the task look more rigorous.
