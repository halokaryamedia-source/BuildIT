# Bedrock Block Geometry Rules

BuildIT applies a dedicated geometry rule layer for Bedrock Block jobs.

## Purpose

Bedrock Block output should read as a placeable Minecraft Bedrock custom block, not as a loose prop, mob, item, or entity-like shape.

This module sits on top of the general MCP geometry planner and applies block-specific structure rules.

## Modular layer

Bedrock Block geometry rules are handled by:

```txt
apps/engine/src/mcp/mcp-bedrock-block-geometry.ts
```

The general planner calls this module only when the geometry format is:

```txt
bedrock_block
```

## Core block groups

The block rule layer ensures these groups exist:

```txt
root
base
block_body
decorative_details
```

Cubes from raw model plans can be reassigned into these block groups when their original group is too entity-like or too vague.

## Cube classification

Cubes can be assigned by:

- name hints,
- group hints,
- material hints,
- vertical placement.

Examples:

```txt
base / bottom / floor / pedestal → base
top / cap / trim / lamp / crystal → decorative_details
middle body cubes → block_body
```

## Generated support cubes

If the model plan does not provide a grounded block base, BuildIT can generate:

```txt
generated_block_base
```

If the model plan does not provide a readable static body, BuildIT can generate:

```txt
generated_block_body
```

These generated cubes are recorded as warnings in `mcp_geometry_plan.json`.

## Silhouette warnings

The block rule layer can warn when:

- the block footprint is too narrow,
- the block height is too low,
- cube groups were reassigned into block groups.

## Workflow behavior

BuildIT flow:

```txt
model_plan.json
↓
general geometry normalization
↓
Bedrock Block geometry rules
↓
mcp_geometry_plan.json
↓
mcp_actions.json
```

The MCP adapter receives the corrected block geometry, not raw model plan coordinates.
