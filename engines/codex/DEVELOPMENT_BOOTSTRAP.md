# Codex Repository Development Bootstrap

Use this entry point only when changing BuildIT source, tests, documentation, workflows, architecture, or repository tooling. Normal Blockbench asset production continues to use `engines/codex/BOOTSTRAP.md`.

## Foundation

Read:

1. `CONTEXT-MAP.md` and the glossary for the context being changed;
2. `docs/architecture/SYSTEM_FOUNDATION.md`;
3. the active bounded OpenSpec change;
4. `openspec/changes/buildit-system-foundation/DECISION_MAP.md` when the work depends on an unresolved foundation decision.

The old `codex-local-workflow-rework` change is implementation history for the existing production flow. Do not add new foundation decisions to it.

## Domain ownership

BuildIT does not use one linear development hierarchy.

| Question | Owner |
| --- | --- |
| What outcome is required? | explicit user instruction and active OpenSpec |
| What is the smallest sufficient slice now? | Ponytail |
| How should it be built and proved? | Engineering Discipline |
| Which source and dependents are relevant? | Code Review Graph, confirmed by current source |
| Which capabilities and models are eligible? | Agent Orchestration Capability Gate and Model Selector |
| Did it actually work? | current source, tests, typecheck, build, runtime, and evidence |

No owner may silently take another owner's decision.

## One-time local setup

From `mcp-blockbench/`:

```text
bun run engineering:setup
```

This configures the optional local `code-review-graph` MCP integration and builds its graph. Graph availability is not a development blocker.

Maintenance commands:

```text
bun run graph:build
bun run graph:update
bun run graph:status
bun run engineering:check
```

## Session startup

1. Classify the Task Kind before loading support skills.
2. Read only the owning context, active OpenSpec, and relevant decision.
3. Load `engineering-discipline` for repository implementation, debugging, architecture, or review.
4. Load `code-review-graph` only when context or blast-radius selection is useful and current.
5. Never load Blockbench production skills during repository development.
6. Keep one active repository writer and work on the branch requested by the user.

## Deterministic task router

### Requirement or acceptance change

```text
requirements domain
→ active OpenSpec change
→ Ponytail slice
→ Engineering Discipline implementation/testing
```

### Feature

```text
required user outcome
→ smallest vertical slice
→ highest existing public seam
→ failing behavior when meaningful
→ minimum implementation
→ targeted verification
```

### Bug or performance regression

```text
exact symptom
→ tight red-capable feedback loop
→ reproduce and minimise
→ ranked falsifiable hypotheses when needed
→ targeted instrumentation
→ regression test at the correct seam
→ smallest fix
→ original repro + full verification
```

OpenSpec is checked for product-contract conflicts; it does not replace the debugging loop.

### Refactor or architecture work

```text
measured friction or accepted change requirement
→ Code Review Graph blast radius when useful
→ identify module/interface/seam
→ design at least two materially different interfaces for major changes
→ select by depth, locality, and testability
→ implement one tracer bullet
```

### Code review

```text
fixed comparison point
→ minimal affected source/test set
→ exact diff inspection
→ Standards review
→ Spec review
```

Keep the two review axes separate.

## Code Review Graph route

When available:

```text
get_minimal_context(task="specific bounded task")
→ minimal graph query only when needed
→ read exact source and diff
→ implement and verify
→ graph:update
```

Use at most five graph calls and minimal detail for one bounded task unless graph evidence proves several independent communities are involved. Graph results are navigation evidence, not proof.

## Model execution

Repository model execution follows `engines/codex/MODEL_ROUTING.md`:

```text
Capability Gate
→ Candidate Pool
→ Model Selector
→ fixed permission set
```

The current deterministic selector remains the runtime baseline. RouteLLM is evaluation-only until ADR 0002 acceptance requirements are met.

## Testing rule

Tests verify behavior through the highest stable seam. Source-marker tests may protect generated adapter identity, compatibility markers, or static declarations, but they do not prove runtime behavior.

## Completion

```text
active bounded requirement satisfied
→ Ponytail slice not exceeded
→ targeted checks pass
→ full CI-equivalent verification passes once
→ Standards review complete
→ Spec review complete
→ graph updated when installed
→ no debug artifacts, adapter drift, or unresolved critical finding
```
