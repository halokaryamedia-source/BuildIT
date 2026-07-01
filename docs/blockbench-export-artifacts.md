# Blockbench Export Artifacts

BuildIT preserves the result of the Blockbench MCP export action.

## Output

```txt
outputs/jobs/<jobId>/blockbench_export.json
```

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
