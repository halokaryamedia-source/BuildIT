# Codex Repository Development Bootstrap

Use this entry point only when changing BuildIT source, tests, documentation, workflows, or repository tooling. Normal Blockbench asset production continues to use `engines/codex/BOOTSTRAP.md`.

## Authority

```text
openspec/config.yaml + active OpenSpec change
→ PONYTAIL_EXECUTION.md
→ engineering-discipline
→ code-review-graph when installed and current
→ direct source, tests, typecheck, build, and runtime evidence
```

OpenSpec and Ponytail remain authoritative. The two development skills add implementation discipline and context efficiency; they do not create another plan, issue state machine, approval gate, or product decision source.

## One-time local setup

Run from `mcp-blockbench/`:

```text
bun run engineering:setup
```

This uses the official upstream installer to add the `code-review-graph` MCP server to Codex, pins BuildIT to the approved stable version, builds the local graph, and reports its status. Restart Codex only after the first MCP configuration write.

Maintenance commands:

```text
bun run graph:build
bun run graph:update
bun run graph:status
bun run engineering:check
```

## Session startup

1. Read `openspec/config.yaml` and the active change.
2. Read `PONYTAIL_EXECUTION.md` and select one smallest safe slice.
3. Load `engineering-discipline`.
4. Load `code-review-graph` only for repository exploration, debugging, refactoring, or review when the MCP server is available.
5. Never load Blockbench production skills during repository development.
6. Keep one active writer and work on the branch explicitly requested by the user.

## Context route

When Code Review Graph is available:

```text
get_minimal_context(task="specific active slice")
→ minimal graph query only when needed
→ read exact source and diff
→ implement and verify
→ graph:update
→ Standards review + Spec review
```

Use at most five graph calls and minimal detail for a bounded task unless the graph proves several independent communities are involved.

When it is unavailable or stale, continue with direct GitHub/git search and source reads. Graph availability is not a blocker.

## Development route

### Feature or refactor

```text
OpenSpec acceptance condition
→ Ponytail slice
→ identify public seam
→ failing behavior test when meaningful
→ minimum implementation
→ targeted test/typecheck
→ repeat by vertical slice
```

### Bug or performance issue

```text
exact symptom
→ tight red-capable feedback loop
→ reproduce and minimise
→ ranked falsifiable hypotheses
→ targeted instrumentation
→ regression test at the correct seam
→ smallest fix
→ original repro + full verification
```

### Final review

Review separately:

- **Standards:** repository rules, safety, type quality, tests, coupling, duplication, and maintainability.
- **Spec:** OpenSpec requirements, non-goals, acceptance criteria, missing behavior, incorrect behavior, and scope creep.

Do not let one axis hide the other.

## Completion

```text
active requirement satisfied
→ no Ponytail scope expansion
→ targeted checks pass
→ full required CI-equivalent verification passes
→ graph updated when installed
→ Standards and Spec reviews complete
→ no debug artifacts or adapter drift
```
