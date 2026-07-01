# Blockbench MCP Core App Integration Checklist

Use this checklist when integrating or testing `achmadawdi/mcp-blockbench` with BuildIT.

## Core app setup

- Run or load the Blockbench MCP core app from `achmadawdi/mcp-blockbench`.
- Confirm Blockbench desktop is running.
- Enable the MCP server in Blockbench settings.
- Confirm the MCP endpoint uses:

```txt
http://localhost:3000/bb-mcp
```

- If multiple Blockbench windows are open, confirm the active endpoint from the core app/plugin panel.

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
place_cube
capture_screenshot
```

If any are missing, update:

```txt
apps/engine/src/mcp/mcp-tool-name-mapping.ts
```

## Optional tool resolution

Confirm whether these optional tools resolve:

```txt
add_group
export_project
```

If missing, the job should continue and record a skipped optional step.

## Tool name adaptation

Open:

```txt
mcp_tool_name_mapping.json
```

Confirm each resolved tool records one of:

```txt
canonical
alias
normalized
semantic
```

If semantic matching resolves a tool, manually confirm the selected real tool is correct before trusting the execution result.

## Argument compatibility

Confirm the final `mcp_execution_plan.json` arguments match the actual core app schema.

Especially check:

```txt
create_project.name
create_project.format
place_cube batch support or single-cube expansion
place_cube.group or equivalent parent field
place_cube.elements/cubes/boxes or single cube payload
place_cube name/from/to/material or equivalent fields
```

If mismatched, update:

```txt
apps/engine/src/mcp/mcp-argument-shape-adapter.ts
```

## Cube batch compatibility

Open:

```txt
mcp_argument_shape_adaptation.json
```

Confirm one of these is true:

- The core app supports batch cube fields and BuildIT keeps batch placement.
- The core app only supports single cube placement and BuildIT records `PLACE_CUBE_BATCH_EXPANDED`.

## Result validation

Confirm:

- `capture_screenshot` returns a `data:image/` result.
- `blockbench_preview.json` has `validation.valid: true`.
- optional export either succeeds or is recorded as non-fatal.

## Acceptance target

A first successful integration is accepted when:

- BuildIT creates one Bedrock Entity project in Blockbench through the MCP core app.
- BuildIT creates one Bedrock Block project in Blockbench through the MCP core app.
- Preview capture succeeds.
- Stored Data Root contains all expected MCP diagnostic files.
- Required MCP execution steps are successful.
- Optional group/export failure, if any, is non-fatal.
