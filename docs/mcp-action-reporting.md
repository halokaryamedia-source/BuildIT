# MCP Action Reporting

BuildIT stores MCP actions and execution results so Blockbench MCP runs can be debugged from the job stored data folder.

## Files

```txt
mcp_actions.json
mcp_execution_report.json
```

## `mcp_actions.json`

This file contains the adapter-generated MCP action list before tool-name mapping, argument adaptation, schema matching, and execution.

It is useful for debugging:

- project creation,
- group creation,
- cube placement,
- preview capture,
- optional export,
- action order,
- adapter warnings and errors.

## `mcp_execution_report.json`

This file records the actual MCP execution step by step.

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
- output artifact names,
- error message.

Required tool failures fail the job.

Optional tool failures are recorded as `nonFatal: true` and the job continues. For example, if export fails but project creation, groups, cubes, and preview succeeded, the job can still complete with a recorded optional export failure.
