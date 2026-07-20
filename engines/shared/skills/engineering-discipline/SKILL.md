---
name: engineering-discipline
description: "Repository-development discipline used after OpenSpec and Ponytail. Applies TDD, disciplined debugging, architecture care, and two-axis review without creating another planning authority."
---

# Engineering Discipline

Use this skill for BuildIT repository development. Do not load it for normal Blockbench asset production.

## Authority order

```text
OpenSpec
→ Ponytail minimum-sufficient execution
→ Engineering Discipline
→ Code Review Graph context selection when available
→ repository tools and tests
```

OpenSpec owns the approved goal, scope, non-goals, acceptance criteria, and durable decisions. Ponytail selects the smallest safe action required now. This skill governs implementation quality only. It must not create another state machine, issue-tracker workflow, approval stage, PRD authority, or competing decomposition system.

## Route by task type

### Feature or refactor

1. Read `openspec/config.yaml`, the active OpenSpec change, and its `PONYTAIL_EXECUTION.md`.
2. Extract the smallest vertical slice that satisfies one active acceptance condition.
3. Identify the public seam where behavior can be observed. When the seam is already explicit in OpenSpec, existing tests, a public tool contract, or a user-visible workflow, proceed without another user question.
4. Use red → green at that seam when a meaningful automated test is possible.
5. Implement only enough code to satisfy the current failing behavior.
6. Run the narrow test and relevant typecheck after each slice. Run the full required verification once at the end.
7. Defer cleanup that is unrelated to the active requirement. Refactor only when it improves the verified seam or removes duplication introduced by the current work.

### Bug or performance regression

Do not begin with a speculative fix.

1. Build one tight, agent-runnable pass/fail loop for the user's exact symptom.
2. Reproduce and minimise until every remaining element is load-bearing.
3. Record three to five ranked, falsifiable hypotheses when the cause is not already proven.
4. Instrument only the boundaries that distinguish those hypotheses; change one variable at a time.
5. Turn the minimum repro into a failing regression test at the correct public seam when possible.
6. Apply the smallest fix, rerun the minimum repro, then rerun the original scenario.
7. Remove temporary instrumentation and document the proven cause.

When no correct test seam exists, report that architectural limitation rather than adding a shallow test that cannot catch the real bug.

### Architecture improvement

Architecture work is justified by measured friction: repeated edits, missing test seams, duplicated authority, broad blast radius, or an observed defect. Prefer deep modules with small interfaces. Do not perform a wholesale rewrite, introduce speculative abstraction, or expand the active OpenSpec scope.

### Review

Review against a fixed point and keep two axes separate:

- **Standards:** repository rules, security boundaries, type safety, tests, duplication, coupling, and code smells.
- **Spec:** missing or partial requirements, scope creep, incorrect behavior, and acceptance-criteria gaps.

Use Code Review Graph first to select the minimal affected files and tests when its graph is current. Then read the exact source hunks and OpenSpec authority directly. Graph results are navigation evidence, not proof.

## Implementation rules

- Tests verify behavior through public interfaces, not private implementation details.
- Work in vertical slices: one failing behavior, one minimal implementation, then repeat.
- Do not write all imagined tests before understanding the first slice.
- Expected values need an independent source of truth: OpenSpec, a known-good fixture, protocol contract, or worked example.
- Avoid internal mocks when the actual seam can run cheaply and deterministically.
- Run deterministic checks before spending another model review call.
- Preserve the repository's one-writer rule and current branch policy.

## Completion gate

Before reporting repository work complete:

```text
active OpenSpec requirement satisfied
→ Ponytail scope not exceeded
→ targeted tests pass
→ relevant typecheck/lint/build pass
→ full required verification passes once
→ Standards review complete
→ Spec review complete
→ Code Review Graph updated when installed
→ no temporary instrumentation or generated drift remains
```

## Upstream attribution

This BuildIT adaptation incorporates engineering practices from `mattpocock/skills` (MIT), especially its `implement`, `tdd`, `diagnosing-bugs`, `code-review`, and `codebase-design` skills. BuildIT's OpenSpec and Ponytail authorities override any upstream workflow assumption.