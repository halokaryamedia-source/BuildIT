# Blockbench MCP Integration Plan

This document prepares BuildIT for integration with the external Blockbench MCP plugin repository:

```txt
https://github.com/achmadawdi/mcp-blockbench
```

## Current status

BuildIT does not vendor or copy the MCP Blockbench plugin code yet.

BuildIT currently connects to a running MCP Blockbench server through HTTP JSON-RPC.

Default endpoint expected by BuildIT:

```txt
http://localhost:3000/bb-mcp
```

The external plugin repository provides the Blockbench plugin/server side. BuildIT provides the job workflow, model planning, MCP action preparation, execution reporting, and desktop diagnostics.

## Intended architecture

```txt
BuildIT Desktop
↓
BuildIT Engine
↓
BlockbenchMcpClient
↓
http://localhost:3000/bb-mcp
↓
achmadawdi/mcp-blockbench plugin
↓
Blockbench desktop
```

## Do not mix responsibilities

BuildIT should own:

- job input and output flow,
- reference image handling,
- model planning,
- geometry preflight,
- material placeholder planning,
- MCP action generation,
- tool-name mapping,
- argument shape adaptation,
- schema matching,
- execution plan and execution report,
- artifact storage and desktop diagnostics.

MCP Blockbench should own:

- Blockbench plugin runtime,
- MCP server endpoint,
- actual Blockbench tool implementations,
- project creation inside Blockbench,
- group/cube/material/texture operations inside Blockbench,
- screenshots/previews from Blockbench,
- optional export from Blockbench.

## Integration options

### Option A — External plugin only

Keep `achmadawdi/mcp-blockbench` separate.

BuildIT only connects to the running endpoint.

This is the safest initial integration path.

### Option B — Git submodule

Add the MCP plugin repository under a vendor folder later, for example:

```txt
vendor/mcp-blockbench
```

BuildIT still talks to the plugin through HTTP. The submodule only helps development and version pinning.

### Option C — Monorepo package later

Move or mirror the MCP plugin into BuildIT as a package only if we need one-command development.

This requires license and build-process review because the MCP plugin is GPL-3.0-only.

## Required BuildIT contract

BuildIT currently expects these canonical tools:

```txt
create_project
add_group
place_cube
capture_screenshot
```

Optional tool:

```txt
export_project
```

The MCP plugin does not need to expose those exact names if aliases are mapped in BuildIT, but the final resolved tools must support equivalent behavior.

## Required integration checks

Before local functional testing:

1. Load the MCP plugin in Blockbench.
2. Enable the MCP server in Blockbench settings.
3. Confirm endpoint is reachable at `http://localhost:3000/bb-mcp`.
4. Run BuildIT engine health check.
5. Confirm `tools/list` returns tool schemas.
6. Save `mcp_tool_schema.json` from a real job.
7. Compare actual tool names against BuildIT canonical names.
8. Update `mcp-tool-name-mapping.ts` if tool names differ.
9. Compare actual input schemas against BuildIT action arguments.
10. Update `mcp-argument-shape-adapter.ts` if argument shapes differ.
11. Run one Bedrock Entity job.
12. Run one Bedrock Block job.
13. Inspect `mcp_execution_plan.json` before execution.
14. Inspect `mcp_execution_report.json` after execution.
15. Confirm `blockbench_preview.json` includes a valid image data URL.

## Important note

Do not copy plugin code into BuildIT until the actual MCP tool list and schema have been inspected.

The current BuildIT side is ready to connect, but final compatibility depends on the real tool names and schemas provided by `achmadawdi/mcp-blockbench`.
