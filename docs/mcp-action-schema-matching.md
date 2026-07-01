# MCP Action Schema Matching

BuildIT validates and normalizes MCP actions against the real Blockbench MCP core app tool schemas before execution.

## Purpose

The adapter creates intended MCP actions from a model plan, but the running MCP core app may expose different input schemas.

Schema matching prevents BuildIT from blindly sending arguments that the real MCP core app does not accept.

## Modular layers

- `blockbench-tool-adapter.ts` builds intended actions from `model_plan.json`.
- `mcp-tool-schema-store.ts` saves the real `tools/list` result.
- `mcp-action-availability.ts` removes missing optional actions before schema matching.
- `mcp-argument-shape-adapter.ts` adapts action arguments to the core app schema.
- `mcp-action-schema-matcher.ts` matches executable actions against real tool schemas.
- `mcp-action-schema-store.ts` saves the schema matching report.
- `mcp-execution-runner.ts` executes the normalized actions from the schema matcher.

## Output

Schema matching output is stored as:

```txt
mcp_action_schema_match.json
```

The report includes:

- original action,
- normalized action,
- matched schema state,
- removed arguments,
- warnings,
- errors.

## Behavior

If a required tool schema is missing, schema matching fails before execution.

If an optional tool is missing, BuildIT skips it before schema matching and records it later in `mcp_execution_report.json` with `skipped: true`.

If a schema disallows unknown arguments, BuildIT removes those arguments and records warnings.

The workflow executes normalized MCP actions, not raw adapter actions.
