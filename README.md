# BlockIT Workspace

This workspace is split into active areas:

## MCP

- `mcp/` - imported upstream source from `jasonjgardner/blockbench-mcp-plugin` and the active working plugin area.
- `mcp/workflow/` - Blockbench presets, preparation scripts, and Blockbench-specific skills.

## Project Workspace

- `workspace/active/` - projects currently being developed.
- `workspace/saved/` - completed and validated projects.
- Each project contains its `.bbmodel` file directly, plus `export-data/` and `mcp-data`; references and preview cache live under `mcp-data/`.

## Docs

- `docs/` - BlockIT product docs, workflow, standards, and validation notes.

## Skills

- `mcp/workflow/skills/` - the single source of workspace-specific skills.
- Global Codex skills live outside this workspace in
  `C:\Users\Administrator\.codex\skills`.

## Where to start

1. Read `AGENTS.md` for agent behavior.
2. Read `CONTEXT.md` for stable workspace facts.
3. Read `docs/knowledge/next-action.md` for the current task snapshot.
4. Open the matching area index only after the affected area is known.
5. If Blockbench is already running, reuse that instance instead of opening a new one.

## Sync rule

If the task is reference image generation, use `docs/foundation/04-reference-guide.md` for the canonical workflow.
