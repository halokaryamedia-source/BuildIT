# ADR 0001: Use domain-owned authorities instead of one linear hierarchy

- Status: Accepted
- Date: 2026-07-20

## Context

BuildIT uses OpenSpec, Ponytail, Engineering Discipline, Code Review Graph, runtime state, reference contracts, model routing, and deterministic evidence. Earlier documentation placed several of these in a linear order.

The linear model is misleading because the participants answer different questions:

- OpenSpec records approved change intent and acceptance criteria.
- Ponytail limits the current execution slice and resource budget.
- Engineering Discipline governs implementation and verification quality.
- Code Review Graph narrows source and impact context.
- Agent Orchestration selects an eligible execution route.
- Technical evidence proves current implementation behavior.

A global rank creates invalid implications, such as a scope policy waiving a regression test or graph output overruling current source.

## Decision

BuildIT will use domain-owned authorities coordinated by a deterministic task router.

```text
requirements          explicit user decision + active OpenSpec
scope/efficiency      Ponytail
engineering method    Engineering Discipline
context intelligence  Code Review Graph
model execution       Capability Gate + Model Selector
technical proof       current source, tests, build, runtime, evidence
```

Conflicts are resolved by question type, not by one universal list.

No support skill, model selector, graph, or tool may redefine approved product intent. No product document may grant runtime permission. No scope optimization may remove required correctness evidence.

## Consequences

### Positive

- Clear ownership for each decision class.
- Less duplicated authority wording.
- RouteLLM and future adapters can be evaluated without becoming product authorities.
- Tests can target explicit module seams.
- User and developer workflows can evolve independently while sharing invariants.

### Negative

- The task router and domain vocabulary must remain precise.
- Documents that currently present a linear hierarchy must be migrated.
- Some decisions require consulting more than one domain owner.

## Rejected alternatives

### Keep the linear hierarchy

Rejected because it conflates requirements, scope, method, context, routing, and proof.

### Create one central orchestration authority

Rejected because it would become another mutable source of truth and duplicate OpenSpec, runtime state, and production contracts.
