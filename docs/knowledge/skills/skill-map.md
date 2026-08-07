# Skill Map

Use this note for skill availability. Use [Activation Matrix](activation-matrix.md)
for routing.

## Current Checked-In Workspace Skills

The skill files actually present in the `Local` branch live under
`mcp/.agents/skills/`.

| Skill | Owner |
|---|---|
| `development-brief` | mandatory Developing front door: request normalization, Dual POV, input/output contract, acceptance and proof |
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

Mode defaults stay lean:

- Plan: `ponytail`;
- Developing: mandatory `development-brief`, plus at most one specialist when it
  adds real domain value; trivial fast-path work may use `development-brief`
  alone;
- Maintenance: `ponytail + the smallest diagnostic/specialist`.

GSD-style discovery, grilling, review, evidence handling, and navigation tools
are conditional stages, not extra skills to stack by default.

## External Complements

These are deliberately **not** additional default skills:

| Complement | Role | Routing |
|---|---|---|
| Karpathy-inspired guidelines | anti-slop behavior: think first, simplicity, surgical changes, verifiable goals | principles are absorbed into root `AGENTS.md`; do not load a duplicate skill |
| CodeGraph | local cross-file source navigation, call-chain and blast-radius acceleration | optional when broad structural discovery is genuinely needed; source/tests remain authority |
| GSD Core discussion discipline | recover missing high-impact requirements from an incomplete prompt | use only when needed; no `.planning/` hierarchy in Local |

CodeGraph generated/index state is not project knowledge and must not replace
`CONTEXT.md`, `next-action.md`, source, tests, or Git history.

## Explicitly Not Adopted

- Claude-Mem is not part of the Local workflow. Persistent model-generated
  memory would duplicate the repository's explicit continuity system and could
  preserve stale or false conclusions.

## Parent

- [Knowledge Dashboard](../index.md)
- [Activation Matrix](activation-matrix.md)
