# Repository Development Skill Stack

BuildIT repository development uses four composable layers:

```text
OpenSpec
→ Ponytail
→ Engineering Discipline
→ Code Review Graph
```

This document applies to source-code and repository development. It does not alter the ChatGPT Reference Studio → Codex + MCP Blockbench production architecture.

## Responsibilities

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| OpenSpec | Preserve goal, scope, non-goals, decisions, and acceptance criteria. | Select implementation tactics or duplicate runtime state. |
| Ponytail | Select the smallest safe action required now and stop when sufficient. | Expand scope or create speculative work. |
| Engineering Discipline | Apply public-seam TDD, reproducible debugging, architecture care, and Standards/Spec review. | Create another PRD, ticket workflow, state machine, or approval hierarchy. |
| Code Review Graph | Select minimal source context, affected flows, tests, and blast radius. | Replace source inspection, tests, OpenSpec, or human judgment. |

## Engineering Discipline

The canonical BuildIT skill is:

```text
engines/shared/skills/engineering-discipline/SKILL.md
```

It adapts selected engineering practices from `mattpocock/skills`:

- `implement` — regular targeted checks and final review;
- `tdd` — red/green vertical slices at public seams;
- `diagnosing-bugs` — feedback loop, minimum repro, hypotheses, instrumentation, regression test;
- `code-review` — separate Standards and Spec axes;
- `codebase-design` — deep modules and small interfaces.

BuildIT intentionally does not install the upstream planning and issue-tracker flows. OpenSpec and Ponytail already own those responsibilities.

## Code Review Graph

BuildIT pins the local integration to:

```text
code-review-graph 2.3.5
```

The tool runs locally, builds a Tree-sitter-backed structural graph, and exposes it to Codex through MCP. It is used for:

- minimum-context repository exploration;
- change and risk detection;
- caller/callee and execution-flow tracing;
- affected-test discovery;
- impact radius and architecture hot spots.

The graph database is local and ignored by git. `.code-review-graphignore` removes generated bundles, workspace assets, generated API documentation, and duplicated skill adapters from analysis.

## Setup

From `mcp-blockbench/`:

```text
bun run engineering:setup
```

The script:

1. prefers `uvx` when available;
2. otherwise uses Python 3.10+ and installs the pinned package;
3. runs the upstream `install --platform codex` command;
4. builds the graph from the BuildIT repository root;
5. verifies graph status.

The first installation modifies the user's Codex MCP configuration. Restart Codex once after that initial configuration change. Normal graph updates do not require a restart.

Maintenance:

```text
bun run graph:build
bun run graph:update
bun run graph:status
bun run engineering:check
```

## Query budget

For one bounded task:

```text
get_minimal_context first
→ detail_level=minimal
→ at most five graph calls
→ approximately 800 graph-response tokens
→ read exact source before claims or edits
```

The budget may be exceeded only when the graph proves that several independent communities are involved.

## Review contract

Code Review Graph narrows the review set. Engineering Discipline performs the review:

### Standards

- repository rules and safety boundaries;
- public-interface test quality;
- typing and error handling;
- coupling, duplication, shotgun surgery, and speculative generality;
- affected flows and missing regression coverage.

### Spec

- missing or partial OpenSpec requirements;
- behavior that conflicts with acceptance criteria;
- scope creep and unrequested abstractions;
- incorrect implementation of apparently completed requirements.

Graph risk scores prioritise inspection but never determine merge readiness.

## Failure and fallback

If Code Review Graph is missing, stale, unsupported for a file, or returns incomplete context:

```text
continue with direct repository search
→ read exact files and diff
→ run deterministic verification
```

Do not block development or ask the user to repair an optional context tool unless the requested task is specifically about that integration.

## Upstream and licence

- `mattpocock/skills` — MIT; BuildIT uses an adapted local skill rather than copying the upstream workflow wholesale.
- `tirth8205/code-review-graph` — MIT; installed as an optional local developer tool and MCP server.
