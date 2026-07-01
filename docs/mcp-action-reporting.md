# MCP Action Reporting

BuildIT stores the exact MCP tool actions that will be sent to Blockbench before execution.

## Files

```txt
outputs/jobs/<jobId>/mcp_actions.json
outputs/jobs/<jobId>/mcp_execution_report.json
```

## `mcp_actions.json`

This file contains the generated tool call list after model plan validation and Blockbench MCP adapter validation.

It is useful for debugging:

- project creation actions,
- group creation actions,
- cube placement actions,
- screenshot actions,
- optional export actions,
- action order,
- adapter warnings,
- adapter errors.

The file includes:

- `valid`
- `format`
- `actionCount`
- `issues`
- `actions`

When `valid` is false, the workflow stops before Blockbench MCP execution.

## `mcp_execution_report.json`

This file records MCP execution step by step.

Each step includes:

- tool name,
- start time,
- finish time,
- success state,
- skipped state for unavailable optional tools,
- error message when execution fails.

If a required tool fails, the workflow stops and writes the execution report before returning a failed job.
If an optional tool is unavailable during capability discovery, the workflow records it as skipped and continues.
