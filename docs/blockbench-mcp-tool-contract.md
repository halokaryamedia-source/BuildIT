# Blockbench MCP Tool Contract

This is the BuildIT-side contract for Blockbench MCP tools.

The external plugin may use different tool names or argument shapes. BuildIT handles that through:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
apps/engine/src/mcp/mcp-action-schema-matcher.ts
```

## Required canonical tools

### `create_project`

Purpose:

```txt
Create or prepare a Blockbench project for the generated model.
```

Canonical arguments:

```json
{
  "name": "Project Name",
  "format": "bedrock_block"
}
```

Accepted BuildIT formats:

```txt
bedrock
bedrock_block
```

### `add_group`

Purpose:

```txt
Create a named model group or bone/container in Blockbench.
```

Canonical arguments:

```json
{
  "name": "body",
  "origin": [0, 12, 0]
}
```

### `place_cube`

Purpose:

```txt
Place one or more cube elements into an existing group.
```

Canonical arguments:

```json
{
  "group": "body",
  "batchIndex": 0,
  "batchCount": 1,
  "elements": [
    {
      "name": "body_core",
      "from": [-4, 0, -2],
      "to": [4, 16, 2],
      "size": [8, 16, 4],
      "center": [0, 8, 0],
      "material": "main_material"
    }
  ]
}
```

Notes:

- BuildIT batches cube placement.
- Current max cube elements per action is controlled in `blockbench-tool-adapter.ts`.
- If the plugin expects `cubes`, `boxes`, `position`, or `dimensions`, adapt it in `mcp-argument-shape-adapter.ts`.

### `capture_screenshot`

Purpose:

```txt
Capture the current Blockbench viewport or project preview.
```

Canonical arguments:

```json
{}
```

Expected result:

```txt
A data URL that starts with data:image/
```

BuildIT treats missing image data as a required result validation failure.

## Optional canonical tools

### `export_project`

Purpose:

```txt
Export or save the current Blockbench project.
```

Canonical arguments:

```json
{
  "name": "Project Name",
  "format": "bedrock_block"
}
```

Expected result:

```txt
A path-like value is preferred.
```

Export is optional. Missing export support or incomplete export metadata should not fail the whole job.

## Real plugin compatibility process

When testing with `achmadawdi/mcp-blockbench`:

1. Run a BuildIT job with Blockbench MCP connected.
2. Open `mcp_tool_schema.json`.
3. Check real tool names.
4. Open `mcp_tool_name_mapping.json`.
5. Confirm all required canonical tools resolved.
6. Open `mcp_argument_shape_adaptation.json`.
7. Confirm arguments match real plugin schema.
8. Open `mcp_action_schema_match.json`.
9. Confirm no required schema errors remain.
10. Open `mcp_execution_plan.json`.
11. Confirm final payload is what the plugin expects.

## Where to update if mismatch happens

Tool name mismatch:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
```

Top-level argument mismatch:

```txt
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
```

Nested cube shape mismatch:

```txt
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
```

Schema validation behavior:

```txt
apps/engine/src/mcp/mcp-action-schema-matcher.ts
```

Execution/result behavior:

```txt
apps/engine/src/workflows/mcp-execution-runner.ts
```
