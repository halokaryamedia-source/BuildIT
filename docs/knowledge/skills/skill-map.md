# Skill Map

Use this note for skill availability. Use [Activation Matrix](activation-matrix.md)
for routing.

## Current Checked-In Workspace Skills

The skill files actually present in the `Local` branch live under
`mcp/.agents/skills/`.

| Skill | Owner |
|---|---|
| `mcp-builder` | MCP server and public tool surface |
| `typescript-expert` | TypeScript types and module structure |
| `zod` | schema and input validation |
| `bun-development` | Bun commands, scripts, lockfile, dependencies |
| `blockbench-plugins` | plugin lifecycle, UI, and runtime API |

## Recovery Items

Current Local policy also names these skills, but their canonical Local copies
are still being recovered:

| Skill | Intended owner |
|---|---|
| `blockbench-use` | Blockbench modelling workflow |
| `reference-generator` | Source Image to modelling-brief package |
| `evidence-gate` | unsupported claims and repeated failed approaches |

Do not silently simulate a missing skill and do not create
`mcp/workflow/skills/` merely because older documentation referenced that path.
The final canonical home remains `Needs Validation` until recovery is complete.

## Global / User Skills

Global skills such as `ponytail`, `grilling`, `domain-modeling`,
`codebase-design`, `diagnosing-bugs`, `tdd`, `research`, and `code-review` are
not copied into this workspace merely to make them available. Use the actual
installed or verified upstream source when the trigger applies.

Normal work uses `ponytail + one specialist`. GSD-style discovery, grilling,
review, and evidence handling are conditional stages, not skills to stack by
default.

## Parent

- [Knowledge Dashboard](../index.md)
- [Activation Matrix](activation-matrix.md)
