# MCP Execution Plan

`mcp_execution_plan.json` records the final MCP actions that BuildIT is about to send to Blockbench MCP.

## Position in workflow

```txt
mcp_actions.json
↓
tool name mapping
↓
argument shape adaptation
↓
schema matching
↓
mcp_execution_plan.json
↓
Blockbench MCP execution
↓
mcp_execution_report.json
```

## Purpose

The execution plan preserves the final action order after all adaptation layers have run.

It helps debug:

- real resolved MCP tool names,
- canonical BuildIT tool names,
- optional tools,
- skipped optional tools,
- cube placement batch metadata,
- cube element counts,
- final action arguments before execution.

## Notes

`mcp_execution_plan.json` is the best artifact to inspect when you need to know exactly what BuildIT intended to send to Blockbench MCP.

`mcp_execution_report.json` is the best artifact to inspect after execution, because it records what actually happened.
