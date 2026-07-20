# Repository Development Support Layers

## Decision

BuildIT repository development adds two composable support skills beside the existing OpenSpec and Ponytail authorities:

```text
OpenSpec
→ Ponytail
→ engineering-discipline
→ code-review-graph when available
```

This decision does not modify the ChatGPT Reference Studio → Codex + MCP Blockbench production architecture, production stage state machine, Blockbench tool profiles, user approval gates, or production skill budget.

## Authority boundaries

### OpenSpec

Owns goal, scope, non-goals, durable decisions, blockers, deferred work, and acceptance criteria.

### Ponytail

Owns the smallest safe execution slice, reuse, call/evidence budgets, accepted-area preservation, and the stop point.

### Engineering Discipline

Owns implementation quality for repository development:

- public-seam red/green development when meaningful;
- exact-symptom debugging feedback loops;
- minimum repro and falsifiable hypotheses;
- architecture improvements justified by measured friction;
- separate Standards and Spec reviews.

It does not own requirements, tickets, state, approvals, or decomposition beyond the active Ponytail slice.

### Code Review Graph

Owns optional local context selection for repository development:

- minimal relevant symbols and files;
- callers, callees, imports, communities, and flows;
- changed-code risk and blast radius;
- affected-test discovery.

It is navigation evidence only. Source, git diff, tests, typecheck, build, OpenSpec, and runtime evidence remain authoritative.

## Operational policy

- Canonical skills live under `engines/shared/skills/` and are byte-synchronized to `.agents/skills/` and `.codex/skills/`.
- Repository development loads `engineering-discipline` and optionally `code-review-graph`; maximum two support skills.
- Blockbench production skills remain forbidden during repository development.
- Normal Blockbench production uses only MCP server `blockbench`.
- Repository development may additionally use MCP server `code-review-graph`.
- Code Review Graph is pinned to stable version `2.3.5` by the setup script.
- The graph is local, optional, and non-blocking. Missing or stale graph data falls back to direct repository search.
- Generated output, workspace assets, generated API docs, and duplicated skill adapters are excluded through `.code-review-graphignore`.

## Query budget

For one bounded task:

```text
get_minimal_context first
→ detail_level=minimal
→ maximum five graph calls
→ approximately 800 graph-response tokens
→ exact source inspection before claims or mutation
```

The budget may be exceeded only when graph evidence proves several independent communities are involved.

## Verification

Integration is complete only when:

- canonical and host-adapter skill files are byte-identical;
- skill registry preserves the production maximum of two skills;
- repository-development authority order is explicit;
- setup script is typechecked and pins the approved Code Review Graph version;
- package scripts expose setup/build/update/status;
- regression tests verify production/development separation;
- normal MCP verification remains green.

## Upstream

- `mattpocock/skills` (MIT): adapted practices from implement, TDD, bug diagnosis, code review, and codebase design.
- `tirth8205/code-review-graph` (MIT): optional local MCP context and impact-analysis tool.
