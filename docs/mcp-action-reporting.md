# MCP Action Reporting

BuildIT stores MCP actions and execution results so Blockbench MCP runs can be debugged from the job stored data folder.

## Files

```txt
mcp_actions.json
mcp_execution_plan.json
mcp_execution_report.json
```

## `mcp_actions.json`

This file contains the adapter-generated MCP action list before tool-name mapping, argument adaptation, schema matching, and execution.

## `mcp_execution_plan.json`

This file contains the final action list that BuildIT intends to send to Blockbench MCP after mapping, adaptation, and schema matching.

It is the best artifact for checking the intended execution order.

## `mcp_execution_report.json`

This file records what actually happened during Blockbench MCP execution.

Each step can include:

- canonical BuildIT tool name,
- resolved real MCP tool name,
- start time,
- finish time,
- success state,
- optional state,
- skipped state,
- non-fatal optional failure state,
- result summary,
- result validation,
- output artifact names,
- error message.

Required tool failures fail the job.

Required result validation failures also fail the job. For example, `capture_screenshot` must return an image data URL.

Optional tool failures and optional result validation failures are recorded as `nonFatal: true` and the job continues.
