# Skill Map

Use this note for skill availability/location. Use
[Activation Matrix](activation-matrix.md) for routing.

## Repository-Wide Skills

Codex is launched from root `BuildIT`, so project-wide skills belong under
`.agents/skills/`.

| Skill | Canonical path | Function |
|---|---|---|
| `development-brief` | `.agents/skills/development-brief/SKILL.md` | mandatory Developing front door: request normalization, Dual POV, execution channel, input/output contract, acceptance, proof budget, final contract gate |
| `mcp-server-development` | `.agents/skills/mcp-server-development/SKILL.md` | MCP server/public contract: tools/resources/prompts, input schemas/validation, registration, result semantics, annotations, transport/session behavior |
| `typescript-type-safety` | `.agents/skills/typescript-type-safety/SKILL.md` | TypeScript type-system boundary: compiler type errors, inference/generics/narrowing, declarations, public type contracts, compile-time module typing |
| `bun-tooling` | `.agents/skills/bun-tooling/SKILL.md` | Bun-specific build/tooling boundary: `Bun.build`, build plugins, Bun APIs used by Local, scripts, bunx, dependencies/lockfile |

## Retired / Merged Skills

### `mcp-builder`

Replaced by focused `mcp-server-development`. Generic Python/FastMCP,
external-API scaffolding, pagination defaults, mandatory evaluation suite, and
evaluation scripts were removed.

### `typescript-expert`

Replaced by `typescript-type-safety`. Normal `.ts` implementation does not load
a TypeScript specialist; only genuine type-system problems do.

### `zod`

Merged into `mcp-server-development`. BlockIT uses Zod as the MCP input-schema
mechanism, so a separate schema skill would split one semantic owner.

### `bun-development`

Replaced by `bun-tooling`. The useful Bun-specific build/tooling knowledge was
retained while generic project scaffolding, HTTP/WebSocket/SQLite/password APIs,
Node→Bun migration, and generic performance advice were removed.

Do not recreate or route to retired `mcp-builder`, `typescript-expert`, `zod`,
or `bun-development` skills.

## Nested Copies Pending One-By-One Audit

Current repository inventory under `mcp/.agents/skills/`:

| Skill | Current apparent function | Status |
|---|---|---|
| `blockbench-plugins` | Blockbench plugin lifecycle/UI/runtime API | **next audit** |
| `skill-creator` | skill authoring package | pending duplicate/ownership audit |
| `vue-best-practices` | Vue guidance | pending relevance/overlap audit |

Do not mass-move or mass-rename these. Audit one at a time.

## Recovery Items

| Skill | Intended function | Status |
|---|---|---|
| `blockbench-use` | Blockbench modelling workflow | recover + rename/overlap audit |
| `reference-generator` | Source Image → modelling-brief package | recover + rename/overlap audit |
| `evidence-gate` | unsupported/disputed evidence and repeated failed directions | recover + rename/overlap audit |

The old `mcp/workflow/skills/` path is stale and must not be recreated merely to
match historical notes.

## Global / User Skills

Global/user skills such as `ponytail`, `grilling`, `domain-modeling`,
`codebase-design`, `diagnosing-bugs`, `tdd`, `research`, `code-review`, and
`skill-creator` are not copied into BuildIT solely to increase the skill count.
Use them only when the activation matrix says their distinct function is needed.

The nested `mcp/.agents/skills/skill-creator/` copy is therefore a likely overlap
candidate, but that conclusion is not finalized until its own audit.

## Skill Audit Rule

For each skill, decide one of:

```text
KEEP    → clear unique function and name
RENAME  → function useful, name misleading
MERGE   → useful behavior overlaps another skill
MOVE    → function belongs at a different repository scope
DROP    → no distinct value after baseline rules/other skills
RECOVER → trusted source exists but canonical Local copy is missing
```

Judge the skill by its actual trigger/function, not by its upstream name.
Preserve upstream lineage in the decision record when a rename/merge occurs.

## External Complements

These are not extra default skills:

| Complement | Role |
|---|---|
| Karpathy-inspired guidelines | absorbed into root anti-slop behavior |
| CodeGraph | optional cross-file navigation accelerator |
| GSD Core discussion discipline | conditional high-impact requirement discovery |

Claude-Mem is not adopted. Repository-owned continuity remains authoritative.

## Parent

- [Knowledge Dashboard](../index.md)
- [Activation Matrix](activation-matrix.md)
