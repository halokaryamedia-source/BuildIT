# MCP Argument Shape Adapter

BuildIT adapts canonical MCP action arguments to the argument shape expected by the real Blockbench MCP tool schema.

## Purpose

Tool name mapping resolves which tool should be called. Argument shape adaptation resolves what argument names should be sent.

Example:

```txt
BuildIT canonical argument: group
Real MCP schema argument: groupName
```

The adapter can transform this before schema matching and execution.

## Modular layer

Argument shape adaptation is handled by:

```txt
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
```

The report is saved by:

```txt
apps/engine/src/mcp/mcp-argument-shape-store.ts
```

## Output

Each job can save:

```txt
mcp_argument_shape_adaptation.json
```

The report includes:

- canonical tool name,
- real tool name,
- original action,
- adapted action,
- renamed arguments,
- warnings,
- errors.

## Workflow behavior

BuildIT flow:

```txt
canonical action
↓
tool name mapping
↓
argument shape adaptation
↓
schema matching
↓
execution
```

The schema matcher validates adapted actions, not raw canonical actions.

## Maintenance

When the real MCP schema changes argument names, update the alias rules in `mcp-argument-shape-adapter.ts`.
