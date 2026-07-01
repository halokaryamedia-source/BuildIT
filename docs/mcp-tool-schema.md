# MCP Tool Schema Snapshot

BuildIT saves the real Blockbench MCP tool schema for each job.

## Purpose

The MCP adapter should not blindly assume that the running Blockbench MCP server matches BuildIT's expected tool contract.

`mcp_tool_schema.json` records the actual `tools/list` response that was available during a job.

This helps debug:

- missing MCP tools,
- renamed MCP tools,
- changed input schemas,
- partially loaded Blockbench MCP plugins,
- adapter mismatch issues.

## Output

The tool schema snapshot is stored as `mcp_tool_schema.json` in the job stored data folder.

## Workflow behavior

During the capability stage, BuildIT calls `tools/list`, saves `mcp_tool_schema.json`, then creates `mcp_capabilities.json`.

If `tools/list` fails, BuildIT saves a failed capability report and the job stops before MCP execution.
