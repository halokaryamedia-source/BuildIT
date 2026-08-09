# Operations

This folder holds the active working layer for the vault.

## Roles

| Note | Purpose | Authority |
|---|---|---|
| [MCP Reduction & Stabilization Plan](mcp-reduction-stabilization-plan.md) | Ordered P0→P2 work plan after the MCP development-quality audit | Governs stabilization order; `next-action.md` owns the single active slice |
| [Task Board](task-board.md) | Backlog and waiting ideas | Never overrides `next-action.md` |
| [Roadmap](roadmap.md) | Broad priorities for improving the workspace | Direction only |
| [Change Log](change-log.md) | Short history of meaningful documentation changes | Historical record |
| [Documentation Audit](documentation-audit.md) | Evidence and cleanup findings | Audit record |
| [Context Boot Baseline](context-boot-baseline.md) | Manual context-efficiency checks | Update only after a real check |

## Rule

- Keep this layer short-lived and practical.
- Move stable knowledge into `flows/`, `decisions/`, `modules/`, `skills/`, or `maintenance/`.
- During MCP stabilization, do not skip ahead in the P0→P2 work order merely because a later legacy defect is easier to fix.

## Usage

- Check `next-action.md` for the active task; do not duplicate it here.
- Use the MCP stabilization plan only for ordering/classification; implementation still proceeds one bounded slice at a time.
- Put possible future work in `task-board.md`, not `roadmap.md`.
- Keep `roadmap.md` limited to a few broad priorities.
- Add only meaningful structural changes to `change-log.md`.
- Keep audit findings in review/audit notes rather than turning the backlog into duplicate evidence.

## Parent

- [Knowledge Dashboard](../index.md)
