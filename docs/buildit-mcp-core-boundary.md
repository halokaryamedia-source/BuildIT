# BuildIT and MCP Core App Boundary

`achmadawdi/mcp-blockbench` is treated as the Blockbench MCP core app.

BuildIT is not replacing that core app. BuildIT orchestrates model generation jobs and sends validated actions to the core app.

## Boundary

```txt
BuildIT
= desktop UI + local engine + planning + job/output system

mcp-blockbench
= Blockbench MCP core app + actual Blockbench tool execution
```

## BuildIT responsibilities

BuildIT is responsible for:

- collecting prompt and reference image input,
- validating uploads,
- creating model jobs,
- storing job snapshots,
- analyzing reference images,
- generating model plans,
- validating plans,
- preparing geometry,
- preparing material placeholders,
- generating MCP actions,
- adapting actions to the real MCP tool schema,
- running MCP actions through the core app endpoint,
- storing diagnostics and artifacts,
- showing job progress in the desktop UI.

## MCP core app responsibilities

`mcp-blockbench` is responsible for:

- running inside or beside Blockbench,
- exposing the MCP HTTP endpoint,
- listing available tools through `tools/list`,
- executing tool calls through `tools/call`,
- creating projects in Blockbench,
- placing groups/cubes/materials/textures in Blockbench,
- capturing previews from Blockbench,
- exporting projects from Blockbench when supported.

## Integration rule

Do not duplicate Blockbench behavior inside BuildIT.

BuildIT should prepare and validate instructions, then let the MCP core app execute them in Blockbench.

## Current integration method

BuildIT connects to:

```txt
http://localhost:3000/bb-mcp
```

through:

```txt
apps/engine/src/mcp/blockbench-client.ts
```

The actual execution loop is in:

```txt
apps/engine/src/workflows/mcp-execution-runner.ts
```
