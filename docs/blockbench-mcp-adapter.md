# Blockbench MCP Adapter

The Blockbench MCP adapter is the only official bridge between `model_plan.json` and executable Blockbench MCP tool calls.

## Purpose

The planner should only create a model plan. It must not decide raw MCP tool names or tool arguments directly.

The adapter is responsible for:

- mapping Bedrock Entity plans to Blockbench project actions,
- mapping Bedrock Block plans to Blockbench custom block actions,
- building group and cube placement actions,
- building preview capture actions,
- building export actions,
- validating supported tool names,
- validating required tool argument shapes,
- saving adapter warnings and errors inside `mcp_actions.json`.

## Supported tool contract

The current adapter contract uses these tool names:

```txt
create_project
add_group
place_cube
capture_screenshot
export_project
```

The required tool list is exported as `requiredBlockbenchToolNames` and reused by MCP capability discovery.

If the Blockbench MCP plugin changes its tool names or argument schema, update `apps/engine/src/mcp/blockbench-tool-adapter.ts` instead of changing workflow or planning code.

## Capability check

Before execution, BuildIT calls `tools/list` and compares the real MCP server tools against the adapter contract.

The capability report is stored at:

```txt
outputs/jobs/<jobId>/mcp_capabilities.json
```

When required tools are missing, the workflow stops before Blockbench MCP execution.

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
