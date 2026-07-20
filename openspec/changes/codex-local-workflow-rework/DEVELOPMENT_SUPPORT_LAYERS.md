# Repository Development Domain Ownership

## Status

This document records how repository-development support was introduced during `codex-local-workflow-rework`. New foundation decisions now live in:

```text
openspec/changes/buildit-system-foundation/
```

Do not extend this historical change with new foundation scope.

## Decision

BuildIT repository development uses separate domain ownership rather than one linear authority order.

| Domain | Owner | Question answered |
| --- | --- | --- |
| Requirements | explicit user instruction + active OpenSpec | What outcome is required? |
| Scope and efficiency | Ponytail | What is the smallest sufficient slice now? |
| Engineering method | Engineering Discipline | How is the change designed, implemented, tested, debugged, and reviewed? |
| Context intelligence | Code Review Graph + current source | Which files, symbols, flows, and tests are relevant? |
| Model execution | Capability Gate + Model Selector | Which eligible route may execute? |
| Technical evidence | source, diff, tests, typecheck, build, runtime | Did it work? |

No domain owner silently takes another domain's decision.

## Operational policy

- Canonical skills live under `engines/shared/skills/` and are byte-synchronized to `.agents/skills/` and `.codex/skills/`.
- Repository development loads `engineering-discipline` and optionally `code-review-graph`; maximum two support skills.
- Blockbench production skills remain forbidden during repository development.
- Normal Blockbench production uses MCP server `blockbench`.
- Repository development may additionally use MCP server `code-review-graph`.
- Graph intelligence is local, optional, and non-blocking. Missing or stale graph data falls back to direct source search.
- Graph results are navigation evidence only.
- Generated output, workspace assets, generated API docs, and duplicated skill adapters are excluded through `.code-review-graphignore`.

## Context budget

For one bounded task:

```text
get_minimal_context first
→ detail_level=minimal
→ maximum five graph calls
→ approximately 800 graph-response tokens
→ exact source inspection before claims or mutation
```

The budget may be exceeded only when graph evidence proves several independent communities are involved.

## Upstream

- `mattpocock/skills` (MIT): domain modeling, codebase design, Design It Twice, implementation, TDD, bug diagnosis, and two-axis review practices adapted into Engineering Discipline.
- `tirth8205/code-review-graph` (MIT): optional local MCP context and impact-analysis tool.

## Current foundation authority

- `CONTEXT-MAP.md`
- `docs/architecture/SYSTEM_FOUNDATION.md`
- `docs/adr/0001-domain-owned-control-plane.md`
- `openspec/changes/buildit-system-foundation/`
