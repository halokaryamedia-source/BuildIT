# MCP Tool Name Mapping

BuildIT uses canonical internal MCP tool names, then resolves them to the real tool names exposed by the running Blockbench MCP server.

## Purpose

Blockbench MCP plugins may expose different tool names for the same operation.

For example, project creation could appear as:

```txt
create_project
project_create
createProject
blockbench.createProject
```

BuildIT should not force the workflow to know every possible MCP tool name.

## Modular layer

Tool name mapping is handled by:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
```

The mapping report is saved by:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping-store.ts
```

## Output

Each job can save:

```txt
mcp_tool_name_mapping.json
```

The report includes:

- available real MCP tool names,
- canonical required tool names,
- canonical optional tool names,
- resolved real tool names,
- match type,
- aliases,
- missing required tools,
- missing optional tools.

## Workflow behavior

BuildIT flow:

```txt
adapter canonical action
↓
tool name mapping
↓
real MCP action name
↓
schema matching
↓
execution
```

The workflow executes real resolved MCP tool names, while internal logic still uses canonical BuildIT names.

## Maintenance

When a Blockbench MCP plugin changes tool names, update only the alias map in `mcp-tool-name-mapping.ts`.
