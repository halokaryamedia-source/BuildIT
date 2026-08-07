# Knowledge Dashboard

Use this page as the main Obsidian landing note.

## Mission

Keep project memory short, current, auditable, and easy to resume across
ChatGPT/Codex sessions.

## Start Here

1. [Agent Rules](../../AGENTS.md)
2. [Workspace Context](../../CONTEXT.md)
3. [Next Action](next-action.md)
4. Read only the relevant foundation/source for the active boundary.
5. [Skill Activation Matrix](skills/activation-matrix.md) only when skill
   selection is needed.

Do not reconstruct project state from old chats before following this path.

## Knowledge Spine

- [Minimal Nav](minimal-nav.md): shortest new-session boot path.
- [Next Action](next-action.md): single active goal/state/next step.
- [Decision Log](decision-log.md): durable decisions and reasons.
- [Flow](flow.md): current work routing.
- [Workspace Map](workspace-map.md): area ownership and boundaries.
- [Workspace Structure](workspace-structure.md): project folders and lifecycle.
- [Implementation Map](implementation-map.md): active implementation areas.
- [Skill Map](skills/skill-map.md): skill availability/location/status.
- [Source Map](sources/source-map.md): external/source bridge.
- [Glossary](glossary.md): stable terms.
- [Reviews](reviews/review-graph.md): evidence/review context, not active state.

## Retrieval Map

| Need | Start here |
|---|---|
| Agent working rules | `AGENTS.md` |
| Stable project facts | `CONTEXT.md` |
| Current work / resume point | `docs/knowledge/next-action.md` |
| Product/modelling policy | `docs/foundation/README.md` |
| Workflow | `docs/knowledge/flow.md` |
| Durable decisions | `docs/knowledge/decision-log.md` |
| Ownership | `docs/knowledge/implementation-map.md` |
| MCP runtime | `mcp/README.md` + affected source |
| Skill routing | `docs/knowledge/skills/activation-matrix.md` |
| Root workflow skills | `.agents/skills/` |
| MCP specialists pending audit | `mcp/.agents/skills/` |
| Reference-generation policy | `docs/foundation/04-reference-guide.md` |
| Validation policy | `docs/foundation/validation-report.md` and relevant foundation rule |

## Continuity Rule

- Chat history/product memory is optional convenience, not project authority.
- `next-action.md` is the only active-task snapshot.
- Do not duplicate active status into decision/review/module notes.
- Before ending material work, update only the canonical owner whose state
  actually changed.
- If a referenced path does not exist, verify before creating anything.

## Rules

- One note, one job.
- Keep notes short enough to be useful in a fresh session.
- Remove or supersede misleading routing/policy instead of compensating with
  more context.
- Do not maintain a second dashboard/state hierarchy for the same workspace.
