# MCP Argument Shape Adapter

BuildIT adapts canonical MCP action arguments to the argument shape expected by the real Blockbench MCP core app schema.

The core app is the source of truth. This adapter exists so the core app does not need to change for BuildIT.

## Purpose

Tool name mapping resolves which tool should be called. Argument shape adaptation resolves what argument names and payload shapes should be sent.

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
- expanded action count,
- source element name for expanded cube calls,
- warnings,
- errors.

## place_cube batch adaptation

BuildIT may initially create batched `place_cube` actions for efficiency.

If the core app schema supports batch fields, BuildIT keeps the batch:

```txt
elements
cubes
cubeElements
cube_elements
boxes
```

If the core app schema only supports a single cube shape, BuildIT expands the batch into one action per cube.

The adapter can also adapt to wrapper fields:

```txt
cube
box
element
```

or flattened top-level cube fields:

```txt
name
from
to
position
dimensions
size
material
```

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

When the real MCP core app schema changes argument names or payload shapes, update the alias and expansion rules in `mcp-argument-shape-adapter.ts`.
