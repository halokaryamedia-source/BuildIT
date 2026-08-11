# Operations

Updated: 2026-08-11

This folder intentionally has a **small working surface**. Active status belongs in `../next-action.md`; historical implementation/planning detail belongs in Git history or indexed reviews.

## Current files

| Note | Purpose | Authority |
|---|---|---|
| [Local Acceptance Runbook](local-acceptance-runbook.md) | exact Codex + Blockbench local acceptance procedure | procedural owner only when activated by `next-action.md` |
| [Task Board](task-board.md) | future/non-active evidence-dependent work | never overrides `next-action.md` |

## Rule

```text
active status / next step → ../next-action.md
active local procedure    → local-acceptance-runbook.md
future/non-active work    → task-board.md
durable reason            → ../decision-log.md / decisions/
current proof status      → ../../foundation/validation-report.md
historical implementation → Git history / reviews/
```

Do not create another roadmap, manual changelog, execution bridge, documentation-audit tracker, or parallel plan unless a future requirement proves a distinct durable owner that these files cannot represent.

For the current phase, Codex should run the Local Acceptance Runbook, reproduce/classify live failures, and only then make the smallest owner-specific source change.

## Parent

- [Knowledge Dashboard](../index.md)
- [Next Action](../next-action.md)
