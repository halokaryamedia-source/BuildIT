# Task Board

Use this page for backlog and waiting ideas that do not yet deserve a
permanent note. It is not boot context and never overrides
`docs/knowledge/next-action.md`.

## Backlog

### P0 — Product proof

- [ ] Run one minimal Codex → MCP → Blockbench modelling workflow.
- [ ] Verify MCP connection and the selected tool/schema path.
- [ ] Save a `.bbmodel` and verify it can be reopened.
- [ ] Verify texture/project persistence where applicable.
- [ ] Capture or inspect the available visual result.
- [ ] Report honestly whether the result is `Selesai`, `Perlu pemeriksaan`, or `Terhenti`.

### P1 — Context and workflow proof

- [ ] Run the MCP small-task context baseline.
- [ ] Run the bug-without-reproduction scenario.
- [ ] Run the cross-module refactor scenario.
- [ ] Run the ambiguous-prompt scenario.
- [ ] Record files read, approximate words, skills used, broad-scan status, and validation clarity.
- [ ] Test the maintenance flow with at least one real maintenance task.

### P1 — Product and foundation decisions

- [ ] Lock the MVP scope and acceptance criteria.
- [ ] Decide which stages are mandatory: texture, animation, visual review, and save/reopen proof.
- [ ] Resolve the remaining `Needs Validation` claims in the foundation validation report.
- [ ] Recheck the foundation documents still marked `Draft` after the MVP decisions are locked.

### P2 — Engineering proof

- [ ] Add the smallest useful automated proof for MCP schema/tool behavior.
- [ ] Run a real MCP Inspector or Blockbench integration check.
- [ ] Verify generated docs are produced from the manifest and remain secondary to source.

### P2 — Skill and documentation maintenance

- [ ] Confirm whether `mcp/.agents/skills/` and `mcp/.github/skills/` are required by external workflows.
- [ ] Decide whether the skill mirrors need synchronization guidance or can be retired later.
- [ ] Resolve the 38 unresolved links inside packaged `zod` and `skill-creator` references from the correct upstream source.
- [ ] Keep module ownership notes aligned when runtime or skill areas change.
- [ ] Promote repeated decisions into decision notes only when they become permanent.
- [ ] Prune stale notes and backlog items periodically.

## Waiting

- None.

## Done

- vault root created;
- foundation bridge added;
- glossary added;
- templates added;
- operations layer created.
- context boot and user-friendly anti-slop rules documented.
- canonical agent routing flowchart added.
- workspace documentation source-of-truth cleanup completed.

## Use Rule

- Put the current task only in `next-action.md`.
- Keep parallel or future work here as backlog/reference.
- Do not read this page during normal context boot.
