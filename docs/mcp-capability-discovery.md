# MCP Capability Discovery

BuildIT checks the real Blockbench MCP server before sending executable tool calls.

## Why this exists

The adapter can build valid canonical tool calls, but the running Blockbench MCP server must actually expose compatible tools.

Capability discovery prevents failures caused by:

- missing tool names,
- renamed MCP tools,
- incompatible Blockbench MCP plugin versions,
- a partially started MCP server.

## Required tools

Required canonical tools are exported from the adapter contract in:

```txt
apps/engine/src/mcp/blockbench-tool-adapter.ts
```

Current required canonical tools:

```txt
create_project
add_group
place_cube
capture_screenshot
```

Current optional canonical tools:

```txt
export_project
```

Optional tools are progressive enhancements. If an optional tool is missing, the job can still complete.

## Tool name mapping

Capability discovery uses the MCP tool name mapping layer.

This means a required canonical tool can still be valid when the real MCP server exposes a known alias.

Example:

```txt
canonical: create_project
real MCP: createProject
```

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
- `toolNameResolutions`
- `error`

If required canonical tools cannot be resolved, the workflow stops before Blockbench MCP execution.
If optional canonical tools are missing, the workflow records the missing optional tool and continues.

## Health API

`GET /api/health` includes `mcpCapabilities`, so the desktop app or developer can inspect MCP compatibility before creating a job.
