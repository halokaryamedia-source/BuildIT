# Operations

Updated: 2026-08-11

This folder holds **procedural, backlog, roadmap, audit, and history notes**. Active task status still belongs only in `../next-action.md`.

## Current Roles

| Note | Purpose | Authority |
|---|---|---|
| [Local Acceptance Runbook](local-acceptance-runbook.md) | exact Codex + Blockbench local acceptance procedure | procedural owner only when `next-action.md` activates local acceptance |
| [Task Board](task-board.md) | future/non-active findings and waiting work | never overrides `next-action.md` |
| [Roadmap](roadmap.md) | broad product/engineering direction | direction only |
| [MCP Reduction & Stabilization Plan](mcp-reduction-stabilization-plan.md) | historical approved plan that drove the completed non-local stabilization pass | **historical/completed; no longer current execution order** |
| [Change Log](change-log.md) | short documentation/knowledge history | historical record |
| [Documentation Audit](documentation-audit.md) | documentation cleanup evidence | audit record, not boot context |
| [Context Boot Baseline](context-boot-baseline.md) | manual context-efficiency checks | update only after a real check |

## Current Execution Rule

If `next-action.md` says:

```text
LOCAL — follow operations/local-acceptance-runbook.md
```

Codex should use the runbook rather than reopening the reduction/stabilization plan or historical audits.

The baseline local pass is evidence collection. Reproduce/classify a failure before source edits.

## Usage

- Check `next-action.md` for current status; do not duplicate it here.
- Use the local acceptance runbook only during the local-proof stage.
- Put future/non-active findings in `task-board.md`.
- Keep `roadmap.md` broad and short.
- Treat the MCP reduction/stabilization plan as historical provenance; its source work has already been executed and superseded by the current pre-local baseline.
- Keep audit/review evidence out of the task board unless it creates a future action.
- Add only meaningful structural changes to `change-log.md`.

## Maintenance Rule

One note, one job. Prefer updating an existing owner to adding a parallel plan/state layer.

## Parent

- [Knowledge Dashboard](../index.md)
