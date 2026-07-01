# MCP Capability Discovery

BuildIT checks the real Blockbench MCP server before sending executable tool calls.

## Why this exists

The adapter can build valid tool calls, but the running Blockbench MCP server must actually expose the required tools.

Capability discovery prevents failures caused by:

- missing tool names,
- renamed MCP tools,
- incompatible Blockbench MCP plugin versions,
- a partially started MCP server.

## Required tools

Required tools are exported from the adapter contract in:

```txt
apps/engine/src/mcp/blockbench-tool-adapter.ts
```

Current required tools:

```txt
create_project
add_group
place_cube
capture_screenshot
```

Current optional tools:

```txt
export_project
```

Optional tools are progressive enhancements. If an optional tool is missing, the job can still complete.

## Job output

Each job saves a capability report at:

```txt
outputs/jobs/<jobId>/mcp_capabilities.json
```

The report includes:

- `connected`
- `valid`
- `availableTools`
- `requiredTools`
- `optionalTools`
- `missingTools`
- `missingOptionalTools`
- `extraTools`
- `error`

If required tools are missing, the workflow stops before Blockbench MCP execution.
If optional tools are missing, the workflow records the missing optional tool and continues.

## Health API

`GET /api/health` includes `mcpCapabilities`, so the desktop app or developer can inspect MCP compatibility before creating a job.
