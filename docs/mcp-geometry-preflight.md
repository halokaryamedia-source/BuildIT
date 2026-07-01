# MCP Geometry Preflight

Geometry preflight checks whether the geometry instructions are safe to send to Blockbench MCP.

This does not create the model outside Blockbench. Blockbench still creates the model through MCP tools. Preflight only checks the instruction quality before execution.

## Module

```txt
apps/engine/src/mcp/mcp-geometry-preflight.ts
```

## Stored in

Preflight results are embedded in:

```txt
mcp_geometry_plan.json
```

## Checks

Preflight currently checks:

- cube count,
- group coverage,
- height,
- footprint,
- geometry warning/error count.

## Status

Preflight can return:

```txt
ready
warning
blocked
```

`blocked` prevents MCP execution because the geometry instruction is not safe enough to send to Blockbench.

## Purpose

The goal is to avoid sending broken or unusable geometry instructions into Blockbench MCP. This keeps Blockbench execution cleaner and easier to debug.
