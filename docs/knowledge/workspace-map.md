# Workspace Map

Use this as the top-level map for the whole repo.

## Main Areas

- [Agent Rules](../../AGENTS.md): repository-wide working rules.
- [Workspace Context](../../CONTEXT.md): stable facts/terminology.
- [Next Action](next-action.md): single resume point/current task state.
- [Foundation](../foundation/README.md): durable product/modelling policy.
- [Knowledge](index.md): project-memory dashboard/navigation.
- [Flow](flow.md): current work routing.
- [Decision Log](decision-log.md): durable decisions/reasons.
- [Implementation Map](implementation-map.md): active areas/ownership.
- [Skills](skills/skill-map.md): skill availability/location/status.
- [MCP](../../mcp/README.md): active plugin/runtime workspace.
- [Project Workspace](../../workspace/): active/saved model packages.

## Skill Areas

### Repository-wide

- `../../.agents/skills/development-brief/` — mandatory Developing front door,
  available from root `BuildIT`.

### MCP specialists pending audit

- `../../mcp/.agents/skills/` — current specialist copies pending one-by-one
  naming/overlap/location audit.

Do not mass-migrate/rename them. Their final scope is decided one skill at a
time.

### Recovery

Still missing canonical Local copies:

- `blockbench-use`
- `reference-generator`
- `evidence-gate`

Do not invent `mcp/workflow/` or `mcp/workflow/skills/` as replacements.

## Area Shortcuts

### `docs/`

- `docs/foundation/README.md`
- `docs/knowledge/index.md`
- `docs/knowledge/minimal-nav.md`
- `docs/knowledge/flow.md`
- `docs/knowledge/decision-log.md`
- `docs/knowledge/implementation-map.md`
- `docs/knowledge/next-action.md`

### `mcp/`

- `mcp/README.md`
- `mcp/AGENTS.md`
- `mcp/index.ts`
- `mcp/lib/`
- `mcp/server/`
- `mcp/ui/`
- `mcp/.agents/skills/`

### `workspace/`

- `workspace/active/<project>/`
- `workspace/saved/<project>/`

## Fast Rule

- New sessions start from `AGENTS.md` → `CONTEXT.md` → `next-action.md`.
- Read only the area that matches the active task.
- If a documented path does not exist, verify before creating anything.
- Do not treat `node_modules/`, `dist/`, generated output, or old chat history as
  primary project knowledge.

## Parent

- [Knowledge Dashboard](index.md)
