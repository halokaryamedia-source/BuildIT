# Blockbench MCP Adapter

The Blockbench MCP adapter is the bridge between `model_plan.json` and executable Blockbench MCP tool calls.

## Purpose

The planner creates a typed model plan. The geometry and material layers normalize that plan before MCP actions are built.

The adapter is responsible for:

- mapping Bedrock Entity plans to Blockbench project actions,
- mapping Bedrock Block plans to Blockbench custom block actions,
- building group actions,
- building batched cube placement actions,
- building preview capture actions,
- building optional export actions,
- validating supported tool names,
- validating required tool argument shapes,
- saving adapter warnings and errors inside `mcp_actions.json`.

## Supported tool contract

Required MCP tools:

```txt
create_project
add_group
place_cube
capture_screenshot
```

Optional MCP tools:

```txt
export_project
```

The required tool list is exported as `requiredBlockbenchToolNames` and reused by MCP capability discovery.
The optional tool list is exported as `optionalBlockbenchToolNames` and can be skipped at runtime when unavailable.

If the Blockbench MCP plugin changes its tool names or argument schema, update the MCP mapping and adapter modules instead of changing model planning code.

## Current execution flow

```txt
model_plan.json
↓
mcp_geometry_plan.json
↓
mcp_material_plan.json
↓
mcp_actions.json
↓
mcp_tool_schema.json
↓
mcp_tool_name_mapping.json
↓
mcp_argument_shape_adaptation.json
↓
mcp_action_schema_match.json
↓
mcp_execution_plan.json
↓
Blockbench MCP execution
↓
mcp_execution_report.json
```

## Runtime execution module

The workflow orchestration lives in:

```txt
apps/engine/src/workflows/create-model.ts
```

The actual Blockbench MCP execution loop lives in:

```txt
apps/engine/src/workflows/mcp-execution-runner.ts
```

This split keeps planning, adaptation, and runtime execution easier to maintain.

## Capability check

Before execution, BuildIT calls `tools/list` and compares the real MCP server tools against the adapter contract.

The capability report is stored at:

```txt
outputs/jobs/<jobId>/mcp_capabilities.json
```

When required tools are missing, the workflow stops before Blockbench MCP execution.
When optional tools are missing, the workflow logs a skip and continues.

## Output

Adapter output is stored at:

```txt
outputs/jobs/<jobId>/mcp_actions.json
```

The file includes:

- `valid`
- `format`
- `actionCount`
- `issues`
- `actions`

When adapter validation fails, the workflow stops before Blockbench MCP execution.
