# Workflow Governance

## Authorities

- OpenSpec: approved goal, scope, decisions, non-goals, blockers, and acceptance criteria.
- Ponytail: smallest safe action required by the active stage.
- `workspace/sessions/<asset>/state.json`: runtime state.
- Reference package: asset intent and visual/technical authority.
- Stage/tool profiles: allowed execution surface.

## Rules

1. Read only the active-stage document and required reference core.
2. Do not repeat full preflight when checks are still fresh.
3. Do not add features for completeness.
4. Preserve accepted areas and manual edits.
5. Initial construction may use bounded batches; revision work is one named issue or tightly related pair.
6. Stop at each user-visible review gate.
7. Record deferred ideas as `DEFERRED_NOT_REQUIRED` instead of implementing them.
8. Never create versioned duplicate authorities. Git history is the archive.
