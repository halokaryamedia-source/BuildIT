---
name: code-review-graph
description: "Optional repository-development context and blast-radius layer backed by the local code-review-graph MCP server. Use for codebase exploration, debugging, refactors, and reviews; never as a specification or correctness authority."
---

# Code Review Graph

Use this skill only for BuildIT repository development. Do not load it for normal Blockbench asset production.

## Role

`code-review-graph` is a local-first context selector. It maps files, symbols, calls, imports, execution flows, tests, and changed-code impact so Codex reads the smallest relevant set of source files.

It does **not** replace:

- OpenSpec requirements or acceptance criteria;
- Ponytail scope selection;
- direct inspection of changed source;
- automated tests, typechecking, build output, or runtime evidence;
- security review or user approval.

## Mandatory query discipline

For exploration, debugging, refactoring, or review:

1. Ensure the graph is built and current. Use `code-review-graph build` for the first index and `code-review-graph update` after source changes.
2. Start with `get_minimal_context(task="<specific task>")` before broad graph calls.
3. Use `detail_level="minimal"` by default. Escalate to `standard` only when the minimal response cannot identify the required source.
4. Target no more than five graph calls and approximately 800 response tokens for one bounded task. Exceed this only when the graph itself proves the change crosses several independent communities.
5. Read the exact returned source files and hunks before making a code claim or mutation.

## Task routes

### Understand a subsystem

```text
get_minimal_context
→ get_architecture_overview_tool when structure is still unclear
→ inspect the smallest relevant community or flow
→ read exact source
```

Do not start by dumping the entire repository or all communities.

### Review changes

```text
update graph
→ detect_changes_tool
→ get_affected_flows_tool for medium/high-risk changes
→ query_graph_tool(pattern="tests_for") for changed public seams
→ get_impact_radius_tool only when blast radius remains unclear
→ read exact diff and affected tests
→ Standards review + Spec review
```

Group findings by severity and include the affected execution flow or untested seam. A graph risk score is a prioritisation signal, not a merge decision.

### Debug a bug

Use the graph only after the Engineering Discipline skill has defined the exact symptom and feedback loop.

```text
get_minimal_context for the symptom
→ find the likely entry symbol
→ trace callers/callees or execution flow
→ inspect the minimum source boundary
→ test ranked hypotheses through the feedback loop
```

Do not replace reproduction with graph speculation.

### Refactor or architecture work

Use communities, bridge nodes, hub nodes, and impact radius to identify coupling and missing seams. Any proposed change must still be justified by the active OpenSpec scope or a measured architecture problem.

## Freshness and fallback

- Run `code-review-graph status` when graph freshness is uncertain.
- Update the graph after a completed implementation before final review.
- If the MCP server is unavailable, stale, unsupported for a file type, or returns incomplete context, continue with direct repository search and source reads. Do not block normal work and do not ask the user to repair the graph unless graph functionality itself is the requested task.
- Never trust a graph node that disagrees with current source or git diff.

## Repository exclusions

Respect `.code-review-graphignore`. Generated bundles, workspace assets, generated API documentation, and duplicated skill adapters should not influence architectural or review results.

## Setup

From `mcp-blockbench/`:

```text
bun run engineering:setup
bun run graph:build
bun run graph:status
```

The setup script configures the local Codex MCP entry through the upstream installer and pins BuildIT to the approved stable release.

## Upstream attribution

Integration is based on `tirth8205/code-review-graph` (MIT). BuildIT uses it strictly as an optional local context and impact-analysis layer beneath OpenSpec, Ponytail, and Engineering Discipline.