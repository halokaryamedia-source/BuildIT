# Workspace Map

Use this as the top-level map for the repository.

## Main Areas

- [Agent Rules](../../AGENTS.md) — repository-wide working/proof rules and
  frozen skill architecture.
- [Workspace Context](../../CONTEXT.md) — stable facts/terminology.
- [Next Action](next-action.md) — single resume point/current task state.
- [Foundation](../foundation/README.md) — durable product/modelling/reference
  policy.
- [Knowledge](index.md) — project-memory dashboard/navigation.
- [Flow](flow.md) — current work routing.
- [Decision Log](decision-log.md) — durable decisions/reasons.
- [Implementation Map](implementation-map.md) — active areas/ownership.
- [Skills](skills/skill-map.md) — skill inventory/lineage.
- [MCP](../../mcp/README.md) — active plugin/runtime workspace.
- [Project Workspace](../../workspace/) — active/saved model packages.

## Canonical Skill Area

All active project-wide skills live under:

`../../.agents/skills/`

Current set:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

`mcp/.agents/skills/` and `mcp/.github/skills/` are retired legacy locations and
must not be repopulated merely to match historical layout.

Reference generation is not another root skill; its owner is
`docs/foundation/04-reference-guide.md`. Evidence-status escalation is baseline
behavior in root `AGENTS.md`.

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

### `workspace/`

- `workspace/active/<project>/`
- `workspace/saved/<project>/`

## Fast Rule

- New sessions start from `AGENTS.md` → `CONTEXT.md` → `next-action.md`.
- Read only the area matching the active task.
- If a documented path does not exist, verify before creating anything.
- Do not treat `node_modules/`, `dist/`, generated output, or old chat history as
  primary project knowledge.

## Parent

- [Knowledge Dashboard](index.md)
