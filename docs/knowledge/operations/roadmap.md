# Roadmap

Updated: 2026-08-08

This roadmap holds **broad direction**, not the active task. Current execution is
always owned by [`next-action.md`](../next-action.md).

## 1. Finish Reference Fidelity Safety

Close the remaining assumption-driven mutation gaps while keeping the solution
small:

- explicit geometry decisions;
- intentional rotation/pivots;
- strict identity/parent targeting;
- coherent recoverable correction;
- no extra visual-planning framework unless a proved gap demands it.

## 2. Prove The Loop Locally

When local testing becomes the priority, run one real approved-reference →
Blockbench modelling loop and answer the central product question:

> Does the current observation + spatial-hypothesis + correction architecture
> actually converge toward the reference better than the old placement-first
> behavior?

Use the smallest useful live proof; do not run a large validation program first.

## 3. Prove Delivery / Persistence

After the modelling loop is viable:

- prove save/reopen `.bbmodel` behavior;
- prove texture/UV persistence when in scope;
- verify the final project is understandable/editable downstream.

## 4. Curate The Normal MCP Surface

After the core path is proven:

- keep normal Bedrock modelling focused on stable goal-oriented tools;
- hide unrelated/unsafe/diagnostic breadth from the default route;
- do not delete capabilities without evidence;
- do not add duplicate tools for behavior the current source already provides.

## 5. Texture / Animation Only From Proven Need

Improve UV/texture/animation workflow only when the actual model pipeline proves
a concrete gap. Do not expand them pre-emptively while reference fidelity remains
the dominant product problem.

## 6. Keep Repository Memory Clean

Maintain the Obsidian vault as a lightweight source-backed system:

- foundation = durable policy;
- next-action = current state;
- decisions = durable why;
- implementation map = current source ownership;
- reviews = historical evidence/current review index;
- task board = future work.

Prefer removing stale routing to adding another documentation layer.
