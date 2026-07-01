# Blockbench MCP Core App Integration Plan

This document prepares BuildIT for integration with the Blockbench MCP core app repository:

```txt
https://github.com/achmadawdi/mcp-blockbench
```

## Current status

BuildIT does not vendor or copy the MCP Blockbench core app code yet.

BuildIT currently connects to the running MCP Blockbench core app through HTTP JSON-RPC.

Default endpoint expected by BuildIT:

```txt
http://localhost:3000/bb-mcp
```

The core app repository provides the Blockbench plugin/server side. BuildIT provides the job workflow, model planning, MCP action preparation, execution reporting, stored data artifacts, and desktop diagnostics.

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
achmadawdi/mcp-blockbench core app
↓
Blockbench desktop
```

## Responsibility boundary

BuildIT owns:

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

MCP Blockbench core app owns:

- Blockbench plugin runtime,
- MCP server endpoint,
- actual Blockbench tool implementations,
- project creation inside Blockbench,
- group/cube/material/texture operations inside Blockbench,
- screenshots/previews from Blockbench,
- optional export from Blockbench.

## Recommended integration mode

### Phase 1 — External core app

Keep `achmadawdi/mcp-blockbench` separate.

BuildIT connects to the running endpoint.

This is the safest current integration path because it preserves the core app as the source of truth.

### Phase 2 — Version-pinned core app

Add version pinning later by documenting the exact core app commit or release that BuildIT was tested against.

Possible future folder if needed:

```txt
vendor/mcp-blockbench
```

This should only be used for development convenience and compatibility pinning.

### Phase 3 — Monorepo package only if required

Move or mirror the MCP core app into BuildIT only if one-command development becomes necessary.

This requires license and build-process review because the MCP core app is `GPL-3.0-only`.

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

The MCP core app does not need to expose those exact names if aliases are mapped in BuildIT, but the final resolved tools must support equivalent behavior.

## Required integration checks

Before local functional testing:

1. Run or load the MCP core app in Blockbench.
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

Do not copy core app code into BuildIT until the actual MCP tool list and schema have been inspected.

The current BuildIT side is ready to connect, but final compatibility depends on the real tool names and schemas provided by `achmadawdi/mcp-blockbench`.
