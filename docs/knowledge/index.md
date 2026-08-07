# Knowledge Dashboard

Use this page as the main Obsidian landing note.

## Mission

Keep context short, current, and easy to resume.

## Start Here

1. [Workspace Context](../../CONTEXT.md)
2. [Flow](flow.md)
3. [Next Action](next-action.md)
4. [Skill Activation Matrix](skills/activation-matrix.md)

## Knowledge Spine

- [Minimal Nav](minimal-nav.md): shortest boot path.
- [Workspace Map](workspace-map.md): area ownership and boundaries.
- [Workspace Structure](workspace-structure.md): project folders and lifecycle.
- [Source Map](sources/source-map.md): external/source bridge.
- [Glossary](glossary.md): stable terms.
- [Flow](flow.md): development lifecycle.
- [Decision Log](decision-log.md): durable decisions.
- [Implementation Map](implementation-map.md): active modules.
- [Operations](operations/README.md): backlog and short-lived work.
- [Review Graph](reviews/review-graph.md): structural review context.

## Working Set

- [Implementation Map](implementation-map.md)
- [Decision Log](decision-log.md)
- [Workspace Map](workspace-map.md)
- [Skill Map](skills/skill-map.md)

## Retrieval Map

| Need | Start here |
|---|---|
| Repo rules | `docs/foundation/README.md` |
| Workflow | `flow.md` |
| Decisions | `decision-log.md` |
| Ownership | `implementation-map.md` |
| Active work | `next-action.md` |
| MCP runtime | `mcp/README.md` |
| Skill routing | `docs/knowledge/skills/activation-matrix.md` |
| Checked-in workspace skills | `mcp/.agents/skills/` |
| Reference generation policy | `docs/foundation/04-reference-guide.md` |
| Validation | `docs/foundation/validation-report.md` |

## Read Order

```text
AGENTS
-> CONTEXT
-> next-action
-> relevant foundation/source
-> activation matrix only when skill selection is needed
```

## Rules

- One note, one job.
- Update only when the task, decision, or owner changes.
- If a note is not used, remove it.
- Start from this page; do not maintain a second dashboard for the same vault.
- If a referenced path does not exist in the current checkout, verify before
  creating anything.
