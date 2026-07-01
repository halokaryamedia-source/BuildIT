# MCP Action Schema Matching

BuildIT validates and normalizes MCP actions against the real Blockbench MCP tool schemas before execution.

## Purpose

The adapter creates intended MCP actions from a model plan, but the running Blockbench MCP server may expose different input schemas.

Schema matching prevents BuildIT from blindly sending arguments that the real MCP server does not accept.

## Modular layers

- `blockbench-tool-adapter.ts` builds intended actions from `model_plan.json`.
- `mcp-tool-schema-store.ts` saves the real `tools/list` result.
- `mcp-action-schema-matcher.ts` matches intended actions against real tool schemas.
- `mcp-action-schema-store.ts` saves the schema matching report.
- `create-model.ts` executes the normalized actions from the schema matcher.

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

If a tool schema is missing for a required action, schema matching fails before execution.

If a schema disallows unknown arguments, BuildIT removes those arguments and records warnings.

The workflow executes normalized MCP actions, not raw adapter actions.
