---
name: engineering-discipline
description: "Repository-development method for domain modeling, deep-module design, TDD, disciplined debugging, architecture work, and two-axis review. It owns engineering method, not product requirements or scope."
---

# Engineering Discipline

Use this skill for BuildIT repository development. Do not load it for normal Blockbench asset production.

## Domain role

Engineering Discipline owns **how repository changes are designed, implemented, tested, debugged, and reviewed**.

It does not own:

- product intent or acceptance criteria;
- the current minimum-sufficient scope;
- model permissions or writer selection;
- source/context truth;
- runtime production state.

Those questions are answered by their owning domains. BuildIT has no single linear authority hierarchy.

## Foundation startup

1. Read `CONTEXT-MAP.md` and the glossary for the context being changed.
2. Read `docs/architecture/SYSTEM_FOUNDATION.md` when module ownership or interfaces are relevant.
3. Read the active bounded OpenSpec change for required outcomes.
4. Use Ponytail to limit the current implementation slice.
5. Use Code Review Graph only to narrow context and blast radius; confirm every claim in current source.

## Domain modeling

When terminology or ownership is unclear:

- challenge overloaded terms;
- test the language with concrete edge cases;
- compare the claimed model with current code and contracts;
- update the owning `CONTEXT.md` as soon as a term is resolved;
- keep glossary files free of implementation procedure;
- create an ADR only for a hard-to-reverse, surprising, real trade-off.

## Feature or refactor

1. Extract one vertical slice that satisfies one active acceptance condition.
2. Identify the highest existing public seam where behavior can be observed.
3. Use red → green at that seam when a meaningful automated test is possible.
4. Implement only enough behavior to pass the slice.
5. Run the narrow test and relevant typecheck after the slice.
6. Repeat only when the next slice remains inside the active scope.
7. Run full required verification once at the end.

## Bug or performance regression

Do not begin with a speculative fix.

1. Build one tight, agent-runnable pass/fail loop for the user's exact symptom.
2. Reproduce and minimise until every remaining element is load-bearing.
3. Record three to five ranked, falsifiable hypotheses when the cause is not already proven.
4. Instrument only the seams that distinguish those hypotheses; change one variable at a time.
5. Turn the minimum repro into a failing regression test at the correct public seam when possible.
6. Apply the smallest fix, rerun the minimum repro, then rerun the original scenario.
7. Remove temporary instrumentation and record the proven cause.

When no correct seam exists, report the architectural limitation rather than adding a shallow test that cannot catch the real bug.

## Architecture and module design

Architecture work requires measured friction: repeated edits, missing test seams, duplicated authority, broad blast radius, or an observed defect.

Design deep modules:

- small interface;
- substantial behavior hidden behind it;
- one clean seam for callers and tests;
- high leverage and locality;
- dependencies accepted at the seam rather than created invisibly;
- results returned where possible instead of uncontrolled side effects.

For a major new interface, design it at least twice:

1. minimum interface with maximum leverage;
2. common-case interface with trivial default usage;
3. optionally a flexible or ports-and-adapters alternative when a real second adapter exists.

Compare alternatives by depth, locality, seam placement, invariants, error modes, and testability. Be opinionated and select one design; do not leave an unranked menu.

## Review

Review against a fixed point and keep two axes separate:

- **Standards:** repository rules, safety, type quality, tests, duplication, coupling, code smells, module depth, and seam quality.
- **Spec:** missing or partial requirements, scope creep, incorrect behavior, non-goal violations, and acceptance gaps.

Use Code Review Graph to select the minimal affected files and tests when its graph is current. Then inspect the exact source and diff. Graph results are navigation evidence, not proof.

## Testing rules

- Tests verify behavior through public interfaces, not private implementation details.
- Source-marker tests are acceptable only for generated identity, explicit compatibility markers, or static policy declarations.
- Expected values require an independent source of truth: an approved contract, known-good fixture, protocol specification, or worked example.
- Work in vertical slices; do not write all imagined tests before understanding the first behavior.
- Avoid internal mocks when the actual seam can run cheaply and deterministically.
- Deterministic checks precede additional model review.

## Completion gate

Before reporting repository work complete:

```text
bounded OpenSpec outcome satisfied
→ Ponytail slice not exceeded
→ targeted behavior tests pass
→ relevant typecheck/lint/build pass
→ full required verification passes once
→ Standards review complete
→ Spec review complete
→ Code Review Graph updated when installed
→ no temporary instrumentation, adapter drift, or unresolved critical finding
```

## Upstream attribution

This BuildIT adaptation incorporates engineering practices from `mattpocock/skills` (MIT), especially domain modeling, codebase design, Design It Twice, TDD, diagnosing bugs, implementation, and two-axis code review. BuildIT assigns these practices to the engineering-method domain rather than placing them in one global hierarchy.
