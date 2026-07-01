# Blockbench MCP Integration Checklist

Use this checklist when integrating or testing `achmadawdi/mcp-blockbench` with BuildIT.

## Plugin setup

- Install or load the Blockbench plugin from the external repository.
- Confirm Blockbench desktop is running.
- Enable the MCP server in Blockbench settings.
- Confirm the MCP endpoint uses:

```txt
http://localhost:3000/bb-mcp
```

- If multiple Blockbench windows are open, confirm the active endpoint from the plugin panel.

## BuildIT engine setup

- Start the BuildIT engine.
- Open the BuildIT health endpoint.
- Confirm `blockbench.connected` is true.
- Confirm MCP capability data is present.

## First real schema capture

Run one test job and inspect the generated stored data folder.

Required files to inspect:

```txt
mcp_tool_schema.json
mcp_tool_name_mapping.json
mcp_argument_shape_adaptation.json
mcp_action_schema_match.json
mcp_execution_plan.json
mcp_execution_report.json
```

## Required tool resolution

Confirm these canonical tools resolve:

```txt
create_project
add_group
place_cube
capture_screenshot
```

If any are missing, update:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
```

## Optional tool resolution

Confirm whether this optional tool resolves:

```txt
export_project
```

If missing, the job should continue and record a skipped optional step.

## Argument compatibility

Confirm the final `mcp_execution_plan.json` arguments match the actual plugin schema.

Especially check:

```txt
create_project.name
create_project.format
add_group.name
add_group.origin
place_cube.group
place_cube.elements
place_cube.elements[].from
place_cube.elements[].to
place_cube.elements[].material
```

If mismatched, update:

```txt
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
```

## Result validation

Confirm:

- `capture_screenshot` returns a `data:image/` result.
- `blockbench_preview.json` has `validation.valid: true`.
- optional export either succeeds or is recorded as non-fatal.

## Acceptance target

A first successful integration is accepted when:

- BuildIT creates one Bedrock Entity project in Blockbench.
- BuildIT creates one Bedrock Block project in Blockbench.
- Preview capture succeeds.
- Stored Data Root contains all expected MCP diagnostic files.
- Required MCP execution steps are successful.
- Optional export failure, if any, is non-fatal.
