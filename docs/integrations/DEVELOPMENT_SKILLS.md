# Repository Development System

BuildIT repository development uses domain-owned responsibilities coordinated by a deterministic Task router. The system is not a linear stack in which one skill universally outranks another.

## Domain ownership

| Domain | Owner | Question answered |
| --- | --- | --- |
| Requirements | explicit user instruction + active bounded OpenSpec change | What outcome is required and what is out of scope? |
| Scope and efficiency | Ponytail | What is the smallest sufficient slice now? |
| Engineering method | Engineering Discipline | How is the change modeled, designed, implemented, tested, debugged, and reviewed? |
| Context intelligence | Code Review Graph + current source | Which files, symbols, flows, and tests are relevant? |
| Model execution | Capability Gate + Model Selector | Which eligible model route may execute with which fixed permissions? |
| Technical evidence | source, diff, tests, typecheck, build, runtime | Did the implementation actually work? |

See:

```text
CONTEXT-MAP.md
docs/architecture/SYSTEM_FOUNDATION.md
engines/codex/DEVELOPMENT_BOOTSTRAP.md
```

## Engineering Discipline

Canonical skill:

```text
engines/shared/skills/engineering-discipline/SKILL.md
```

It adapts selected practices from `mattpocock/skills`:

- domain modeling — canonical vocabulary and edge-case scenarios;
- codebase design — deep modules, small interfaces, clean seams;
- Design It Twice — compare materially different interfaces before a major design is selected;
- TDD — red/green vertical slices at public seams;
- diagnosing bugs — feedback loop, minimum repro, hypotheses, instrumentation, and regression test;
- implementation — regular targeted checks and one final full verification;
- code review — separate Standards and Spec axes.

Engineering Discipline owns engineering method. It does not own product intent, current scope, model permission, Runtime State, or source truth.

## Code Review Graph

BuildIT pins the local integration to:

```text
code-review-graph 2.3.7
```

Code Review Graph belongs to the context-intelligence domain. It builds a local Tree-sitter-backed structural graph and may help with:

- minimum-context repository exploration;
- changed-code and risk detection;
- caller/callee and execution-flow tracing;
- affected-test discovery;
- blast radius and architecture hot spots.

Graph results are navigation evidence. Every claim and mutation must be confirmed against current source and diff.

The local graph database is ignored by git. `.code-review-graphignore` excludes generated bundles, active/completed workspaces, generated API documentation, and duplicated skill adapters.

## Setup

From `mcp-blockbench/`:

```text
bun run engineering:setup
```

The setup script:

1. prefers `uvx` when available;
2. otherwise uses Python 3.10+;
3. pins and verifies the approved Code Review Graph version;
4. runs the upstream Codex installer;
5. builds the graph from the BuildIT root;
6. reports graph status.

The initial installer write modifies the user's Codex MCP configuration. Restart Codex once after that first configuration change. Ordinary graph updates do not require restart.

Maintenance:

```text
bun run graph:build
bun run graph:update
bun run graph:status
bun run engineering:check
```

## Context budget

For one bounded task:

```text
get_minimal_context first
→ detail_level=minimal
→ at most five graph calls
→ approximately 800 graph-response tokens
→ read exact source before claims or edits
```

The budget may be exceeded only when current graph evidence shows that the task crosses several independent communities.

## Task routing

### Requirement or feature

```text
required user outcome
→ active bounded OpenSpec
→ Ponytail slice
→ Engineering Discipline public seam
→ context intelligence when useful
→ behavior verification
```

### Bug or performance regression

```text
exact symptom
→ Engineering Discipline feedback loop
→ graph-assisted source narrowing when useful
→ minimum repro
→ regression test
→ smallest fix
→ original repro and full verification
```

### Refactor or architecture

```text
measured friction or accepted requirement
→ graph blast radius when useful
→ module/interface/seam analysis
→ Design It Twice for major interfaces
→ one tracer-bullet implementation
```

### Review

Code Review Graph narrows the review set. Engineering Discipline performs two independent reviews.

**Standards**

- repository and safety rules;
- module depth and seam quality;
- public-interface test quality;
- typing and error handling;
- coupling, duplication, shotgun surgery, and speculative generality;
- affected flows and missing regression coverage.

**Spec**

- missing or partial OpenSpec requirements;
- behavior that conflicts with acceptance criteria;
- non-goal violations;
- scope creep and unrequested abstraction;
- apparently completed requirements implemented incorrectly.

A graph risk score prioritizes inspection but never determines correctness or merge readiness.

## Model execution separation

Model routing is not owned by either development skill.

```text
Capability Gate
→ Candidate Pool
→ Model Selector
→ fixed permission set
```

The deterministic selector remains the current runtime baseline. RouteLLM is an evaluation-only candidate adapter until the provider seam, BuildIT calibration dataset, and shadow acceptance are proven.

## Failure and fallback

When Code Review Graph is missing, stale, unsupported, or incomplete:

```text
continue with direct repository search
→ read exact source and diff
→ run deterministic verification
```

Do not block development or ask the user to repair an optional context tool unless that integration is itself the requested task.

## Upstream and license

- `mattpocock/skills` — MIT; BuildIT adapts its engineering disciplines into one local domain-owned skill.
- `tirth8205/code-review-graph` — MIT; installed as an optional local context-intelligence MCP server.
