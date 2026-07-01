# MCP Geometry Planner

BuildIT converts `model_plan.json` into a normalized geometry plan before creating Blockbench MCP actions.

## Purpose

The model planner can produce cube coordinates, but the MCP adapter should not execute raw coordinates directly.

The geometry planner normalizes and repairs cube placement so the Blockbench MCP action layer receives safer geometry instructions.

Blockbench still creates the actual model through MCP tools. The geometry planner only prepares and checks the instructions before they are sent to Blockbench.

## Modular layer

Geometry planning is handled by:

```txt
apps/engine/src/mcp/mcp-geometry-planner.ts
```

The report is saved by:

```txt
apps/engine/src/mcp/mcp-geometry-store.ts
```

Format-specific rules live in separate modules:

```txt
apps/engine/src/mcp/mcp-bedrock-block-geometry.ts
apps/engine/src/mcp/mcp-bedrock-entity-geometry.ts
```

Preflight checks live in:

```txt
apps/engine/src/mcp/mcp-geometry-preflight.ts
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
- geometry errors,
- preflight score,
- preflight status.

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

## Format-specific rules

For `bedrock_block`, BuildIT applies Bedrock Block rules after general normalization.

For `bedrock`, BuildIT applies Bedrock Entity rules after general normalization.

## Preflight

After format-specific rules, BuildIT evaluates preflight metrics.

Preflight can return:

```txt
ready
warning
blocked
```

Only `blocked` prevents MCP execution.

## Workflow behavior

```txt
model_plan.json
↓
general geometry normalization
↓
format-specific geometry rules
↓
geometry preflight
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
Blockbench MCP execution
```

The Blockbench tool adapter builds MCP actions from the normalized geometry report, not directly from raw model plan parts.
