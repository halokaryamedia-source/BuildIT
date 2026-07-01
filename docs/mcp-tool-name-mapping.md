# MCP Tool Name Mapping

BuildIT uses canonical internal MCP tool names, then resolves them to the real tool names exposed by the running Blockbench MCP core app.

The core app is the source of truth. BuildIT adapts to it.

## Purpose

The MCP core app may expose different tool names for the same operation.

For example, project creation could appear as:

```txt
create_project
project_create
createProject
blockbench.createProject
```

BuildIT should not force the core app to use BuildIT's internal naming.

## Modular layer

Tool name mapping is handled by:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
```

The mapping report is saved by:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping-store.ts
```

## Resolution order

BuildIT resolves tool names in this order:

```txt
1. canonical exact match
2. alias match
3. normalized alias match
4. semantic match
```

Semantic match uses:

```txt
tool name
tool description
input schema keys
```

This is intentionally defensive so BuildIT can adapt to the core app without requiring tool renames.

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
- semantic score when semantic matching is used,
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
argument shape adaptation
↓
schema matching
↓
execution
```

The workflow executes real resolved MCP tool names, while internal logic still uses canonical BuildIT names.

## Maintenance

When the MCP core app changes tool names, update alias and semantic rules in `mcp-tool-name-mapping.ts`.
