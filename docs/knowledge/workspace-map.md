# Workspace Map

Use this as the top-level map for the whole repo.

## Main Areas

- [Foundation](../foundation/README.md): product rules and operating model.
- [Workspace Structure](workspace-structure.md): project folders and lifecycle.
- [Knowledge](index.md): vault dashboard and navigation.
- [Flow](flow.md): current development path.
- [Decision Log](decision-log.md): current why and tradeoff record.
- [Implementation Map](implementation-map.md): active files and modules.
- [Next Action](next-action.md): resume point.
- [Source Map](sources/source-map.md): external source bridge.
- [Glossary](glossary.md): stable workspace terms.
- [Operations](operations/README.md): backlog and short-lived work.
- [Modules](modules/module-map.md): ownership boundaries.
- [Skills](skills/skill-map.md): skill routing.
- [Reviews](reviews/review-graph.md): structural review context.
- [MCP](../../mcp/README.md): active plugin/runtime workspace.
- [Workspace Skills](../../mcp/workflow/skills/): canonical skill bundles.
- [Blockbench Workflow](../../mcp/workflow/): presets, scripts, Reference Generator, and skills.
- [Project Workspace](../../workspace/): active and saved project packages.
- [Reference Workflow](../foundation/04-reference-guide.md): reference-image pipeline.
- [Foundation Validation](../foundation/validation-report.md): validated findings and open questions.

## Area Shortcuts

### `docs/`

- `docs/README.md`
- `docs/foundation/README.md`
- `docs/knowledge/index.md`
- `docs/knowledge/flow.md`
- `docs/knowledge/decision-log.md`
- `docs/knowledge/implementation-map.md`
- `docs/knowledge/next-action.md`
- `docs/knowledge/workspace-map.md`

### `mcp/`

- `mcp/README.md`
- `mcp/README-INDEX.md`
- `mcp/AGENTS.md`
- `mcp/CLAUDE.md`
- `mcp/CONTRIBUTING.md`
- `mcp/index.ts`
- `mcp/lib/`
- `mcp/server/`
- `mcp/ui/`

### `mcp/workflow/`

- `mcp/workflow/presets/`
- `mcp/workflow/scripts/`
- `mcp/workflow/reference-generator/`
- `mcp/workflow/skills/mcp-builder/`
- `mcp/workflow/skills/typescript-expert/`
- `mcp/workflow/skills/zod/`
- `mcp/workflow/skills/bun-development/`
- `mcp/workflow/skills/blockbench-use/`
- `mcp/workflow/skills/blockbench-plugins/`
- `mcp/workflow/skills/reference-generator/`
- `mcp/workflow/skills/evidence-gate/`

### `workspace/`

- `workspace/active/<project>/` (`<project>.bbmodel`, `export-data/`, `mcp-data/`)
- `workspace/saved/<project>/`

## Fast Rule

- Read only the area that matches the task.
- Start with the matching index note.

## Parent

- [Knowledge Dashboard](index.md)

## Exclusions

- Do not treat `node_modules/`, `dist/`, or other build output as primary knowledge.
- Use generated output only when source files are not enough.
