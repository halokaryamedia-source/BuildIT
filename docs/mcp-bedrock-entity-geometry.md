# Bedrock Entity Geometry Rules

BuildIT applies a dedicated geometry rule layer for Bedrock Entity jobs.

## Purpose

Bedrock Entity output should read as an entity model, not as a placeable static block.

This module sits on top of the general MCP geometry planner and applies entity-specific structure rules.

## Modular layer

Bedrock Entity geometry rules are handled by:

```txt
apps/engine/src/mcp/mcp-bedrock-entity-geometry.ts
```

The general planner calls this module when the geometry format is:

```txt
bedrock
```

## Core entity groups

The entity rule layer ensures these groups exist:

```txt
root
body
head
accessories
```

These groups are intentionally simple for now, but they provide a clean foundation for future pivot, limb, and animation-ready structure.

## Cube classification

Cubes can be assigned by:

- name hints,
- group hints,
- material hints,
- vertical placement.

Examples:

```txt
head / face / eye / horn / helmet → head
backpack / bag / wing / tail / weapon / tool → accessories
middle body cubes → body
```

## Generated support cubes

If the model plan does not provide a readable entity body, BuildIT can generate:

```txt
generated_entity_body
```

This generated cube is recorded as a warning in `mcp_geometry_plan.json`.

## Entity warnings

The entity rule layer can warn when:

- entity height is too low,
- entity footprint is very wide,
- block-style groups were reassigned into entity groups.

## Workflow behavior

BuildIT flow:

```txt
model_plan.json
↓
general geometry normalization
↓
Bedrock Entity geometry rules
↓
mcp_geometry_plan.json
↓
mcp_actions.json
```

The MCP adapter receives corrected entity geometry, not raw model plan coordinates.
