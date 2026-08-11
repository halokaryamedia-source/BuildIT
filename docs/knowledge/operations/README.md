# Operations

Updated: 2026-08-12

This folder intentionally has a **small working surface**. Active status belongs in `../next-action.md`; historical implementation/planning detail belongs in Git history or indexed reviews.

## Current files

| Note | Purpose | Authority |
|---|---|---|
| [Local Acceptance Runbook](local-acceptance-runbook.md) | completed Codex + Blockbench local acceptance procedure | procedural owner only when explicitly reactivated by `next-action.md` or needed to reproduce/audit acceptance behavior |
| [Task Board](task-board.md) | future/non-active evidence-dependent work | never overrides `next-action.md` |

## Rule

```text
active status / next step → ../next-action.md
completed local procedure → local-acceptance-runbook.md
future/non-active work → task-board.md
durable reason → ../decision-log.md / decisions/
current proof status → ../../foundation/validation-report.md
historical implementation → Git history / reviews/
```

Do not create another roadmap, manual changelog, execution bridge, documentation-audit tracker, or parallel plan unless a future requirement proves a distinct durable owner that these files cannot represent.

The first local acceptance pass is complete. Current work must follow `next-action.md`; do not rerun the acceptance procedure or reopen its source fixes unless a new reproduced defect or explicit requirement points back to that boundary.

## Parent

- [Knowledge Dashboard](../index.md)
- [Next Action](../next-action.md)
