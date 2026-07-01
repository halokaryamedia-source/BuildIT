# MCP Geometry Planner

BuildIT converts `model_plan.json` into a normalized geometry plan before creating Blockbench MCP actions.

## Purpose

The model planner can produce cube coordinates, but the MCP adapter should not execute raw coordinates directly.

The geometry planner normalizes and repairs cube placement so the Blockbench MCP action layer receives safer geometry.

## Modular layer

Geometry planning is handled by:

```txt
apps/engine/src/mcp/mcp-geometry-planner.ts
```

The report is saved by:

```txt
apps/engine/src/mcp/mcp-geometry-store.ts
```

Format-specific rules can live in separate modules. Bedrock Block rules are handled by:

```txt
apps/engine/src/mcp/mcp-bedrock-block-geometry.ts
```

## Output

Each job can save:

```txt
mcp_geometry_plan.json
```

The report includes:

- target format,
- geometry bounds,
- group list,
- cube list,
- cube size,
- cube center,
- geometry warnings,
- geometry errors.

## Format-specific bounds

Bedrock Block geometry is clamped to a block-style space:

```txt
x: -8 to 8
y:  0 to 16
z: -8 to 8
```

Bedrock Entity geometry uses a larger entity-style space:

```txt
x: -16 to 16
y:   0 to 32
z: -16 to 16
```

## Repairs

The geometry planner can:

- sanitize group names,
- sanitize cube names,
- clamp cube bounds,
- reorder inverted coordinates,
- expand tiny cubes to a visible minimum size,
- round coordinates to quarter units,
- calculate cube size and center.

## Bedrock Block rules

For `bedrock_block`, BuildIT applies a second rule layer after general normalization.

That layer can:

- enforce block core groups,
- reassign vague or entity-like cube groups,
- generate a grounded base cube when missing,
- generate a readable static body cube when missing,
- warn when the block footprint is too narrow,
- warn when the block height is too low.

## Workflow behavior

BuildIT flow:

```txt
model_plan.json
↓
general geometry normalization
↓
format-specific geometry rules
↓
mcp_geometry_plan.json
↓
mcp_actions.json
↓
tool name mapping
↓
argument shape adaptation
↓
schema matching
↓
execution
```

The Blockbench tool adapter builds MCP actions from the normalized geometry report, not directly from raw model plan parts.
