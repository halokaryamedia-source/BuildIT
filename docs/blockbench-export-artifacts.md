# Blockbench Export Artifacts

BuildIT preserves the result of the Blockbench MCP export action when the export tool is available.

## Optional export behavior

`export_project` is an optional MCP tool.

If the running Blockbench MCP server exposes `export_project`, BuildIT runs it and stores the export report.

If the tool is missing, BuildIT skips export, records the skipped execution step, and still allows the job to complete.

## Output

```txt
outputs/jobs/<jobId>/blockbench_export.json
```

This file is only created when export actually runs.

## Report shape

```json
{
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "toolName": "export_project",
  "format": "bedrock_block",
  "exportPath": "optional/path/from/mcp",
  "rawResult": {}
}
```

## Current scope

This is an export foundation layer. It stores whatever the MCP export tool returns, including file paths or metadata.

Future slices can extend this into explicit `.bbmodel`, Bedrock geometry, texture, or resource-pack export handling.
