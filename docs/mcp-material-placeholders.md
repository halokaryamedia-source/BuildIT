# MCP Material Placeholders

BuildIT prepares placeholder material names before sending cube placement actions to Blockbench MCP.

This does not generate final texture files yet. It creates a clean material plan that can later be connected to richer Blockbench material or texture tools.

## Module

```txt
apps/engine/src/mcp/mcp-material-planner.ts
```

The report is saved by:

```txt
apps/engine/src/mcp/mcp-material-store.ts
```

## Output

```txt
mcp_material_plan.json
```

## Purpose

The material placeholder layer makes cube material references consistent before MCP action building.

It can:

- normalize material names,
- infer fallback material names from cube/group hints,
- assign placeholder colors for debugging,
- record cube-to-material assignments,
- keep the geometry action payload cleaner.

## Workflow position

```txt
model_plan.json
↓
mcp_geometry_plan.json
↓
mcp_material_plan.json
↓
mcp_actions.json
↓
Blockbench MCP execution
```

## Notes

Final texture generation, texture UVs, and resource-pack packaging are not part of this layer yet.
