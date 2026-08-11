# Workspace Map

Updated: 2026-08-11

Use this note as the top-level repository map. Root `AGENTS.md` still decides what should actually be loaded for the current task.

## Main Areas

- [Agent Rules](../../AGENTS.md) — task-class routing, proof discipline, anti-slop rules.
- [Workspace Context](../../CONTEXT.md) — stable facts/terminology.
- [Next Action](next-action.md) — single active repository-continuation snapshot.
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md) — current local execution procedure when activated by `next-action.md`.
- [Foundation](../foundation/README.md) — durable product/modelling/reference policy.
- [Knowledge Dashboard](index.md) — project-memory navigation.
- [Implementation Map](implementation-map.md) — current Local source ownership/surface.
- [Skill Routing](skills/activation-matrix.md) — current skill selection.
- [Validation Report](../foundation/validation-report.md) — current proof-status matrix.
- [MCP](../../mcp/README.md) — active plugin/runtime/build instructions.
- [Project Workspace](../../workspace/) — model/project data and fixtures.

## Canonical Skill Area

All repository-owned skills live under:

`../../.agents/skills/`

Asset authoring:

```text
blockit-bedrock-entity-mcp
blockbench-bedrock-modelling
blockit-bedrock-texturing
blockit-bedrock-animation
```

Repository/plugin development:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

Retired nested skill locations are not current owners:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

Reference generation remains a foundation workflow under `docs/foundation/04-reference-guide.md`, not another root Codex skill.

## Area Shortcuts

### `docs/`

- `docs/foundation/README.md`
- `docs/foundation/validation-report.md`
- `docs/knowledge/index.md`
- `docs/knowledge/minimal-nav.md`
- `docs/knowledge/next-action.md`
- `docs/knowledge/operations/local-acceptance-runbook.md`
- `docs/knowledge/implementation-map.md`
- `docs/knowledge/skills/activation-matrix.md`

### `mcp/`

- `mcp/README.md`
- `mcp/AGENTS.md`
- `mcp/index.ts`
- `mcp/lib/`
- `mcp/server/`
- `mcp/ui/`
- `mcp/prompts/bedrock_entity_workflow.md`

### `workspace/`

- `workspace/active/` — current model packages when used;
- `workspace/saved/` — saved/completed packages when used.

Do not invent a workspace owner/path that does not exist in current `Local`.

## Fast Rule

- Asset authoring uses the direct orchestrator path; do not boot repository history.
- Repository continuation uses `AGENTS.md` → relevant `CONTEXT.md` → `next-action.md`.
- Current local acceptance then follows the runbook.
- If a documented path does not exist, verify before creating anything.
- Generated output, dependencies, old branches, and chat history are not primary project memory.

## Parent

- [Knowledge Dashboard](index.md)
