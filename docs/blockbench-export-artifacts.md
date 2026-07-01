# Blockbench Export Artifacts

BuildIT preserves and validates the result of the Blockbench MCP export action when the export tool is available.

## Optional export behavior

`export_project` is an optional MCP tool.

If the running Blockbench MCP server exposes `export_project`, BuildIT runs it and stores the export report.

If the tool is missing, BuildIT skips export, records the skipped execution step, and still allows the job to complete.

If export runs but returns incomplete metadata, BuildIT records warnings instead of failing the whole job.

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
  "validation": {
    "valid": true,
    "expectedFormat": "bedrock_block",
    "exportPath": "optional/path/from/mcp",
    "exportExtension": ".bbmodel",
    "issues": []
  },
  "rawResult": {}
}
```

## Validation

Export validation checks:

- whether a path-like value was returned,
- whether the output path has an extension,
- whether the extension is common for the target format.

Common expected extensions include:

```txt
.bbmodel
.json
.geo.json
```

## Current scope

This remains an export foundation layer. It validates MCP export metadata, but final `.bbmodel`, Bedrock geometry, texture, or resource-pack packaging can be extended later.
