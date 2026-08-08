# Open Spec Guide

Updated: 2026-08-08

This is the lightweight decision/change standard for BlockIT. It does not create
a second planning/state hierarchy.

## Source-Of-Truth Rules

- product/modelling policy → `docs/foundation/`;
- active task → `docs/knowledge/next-action.md`;
- durable decisions → `docs/knowledge/decision-log.md` or `decisions/`;
- module/source ownership → `docs/knowledge/modules/` /
  `implementation-map.md`;
- runtime behavior → current source + relevant proof.

Code/docs must not disagree silently.

## When To Write A Decision

Write a durable decision when:

- a choice changes architecture/workflow across sessions;
- several notes/modules depend on the same reason;
- a tradeoff should survive chat history;
- an old method is explicitly superseded;
- future agents need the **why**, not only the implementation diff.

Do not create one decision note for every small edit.

## Default Change Rules

- solve the verified problem with the smallest complete change;
- reuse existing owners before adding files/skills/abstractions;
- do not add fallback/compatibility layers without proof they are needed;
- keep runtime uncertainty under root evidence labels (`LOCAL PROOF REQUIRED`,
  `UNKNOWN`, etc.);
- do not turn temporary workaround or fixture behavior into permanent policy;
- shorter owner notes are preferred over duplicated explanation.

## Decision Boundaries

- stable product policy → `docs/foundation/`;
- architecture/working decisions → `docs/knowledge/decisions/` or decision log;
- ownership changes → `docs/knowledge/modules/` / implementation map;
- evidence/findings → `docs/knowledge/reviews/`;
- future/non-active work → operations task board.

## Decision Record Shape

```text
Context
Decision
Why
Tradeoffs
Evidence / validation boundary
Follow-up
```

## Full OpenSpec Threshold

Ordinary bounded work does **not** need formal OpenSpec machinery.

Escalate only for a genuine cross-cutting boundary such as:

- several subsystems must change as one coordinated public contract;
- migration/compatibility promise spans multiple phases;
- several developers/phases require one durable contract;
- existing decision/task owners cannot represent the architectural tradeoff
  clearly.

Do not use full OpenSpec for documentation cleanup, one MCP tool/schema change,
one modelling workflow correction, or speculative future work.

## Review Rules

- review the actual boundary before wording/style;
- use [Review Index](../reviews/review-graph.md) for evidence/history;
- use `code-review` only when independent post-implementation critique adds real
  value;
- use `grilling` when a plan/decision benefits from adversarial challenge;
- use minimal/deletion-first reasoning rather than adding ceremony.

## Validation Rules

- prove the claim at the level it requires;
- static source proof does not become live Blockbench proof;
- visual claims need current visual evidence;
- unavailable runtime proof stays `LOCAL PROOF REQUIRED`;
- no validation status should be upgraded merely because implementation looks
  plausible.

## Parent

- [Knowledge Dashboard](../index.md)
- [Decision Log](../decision-log.md)
