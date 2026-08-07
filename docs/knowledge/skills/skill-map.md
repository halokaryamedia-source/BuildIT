# Skill Map

Use this note for skill availability/location. Use
[Activation Matrix](activation-matrix.md) for routing.

## Repository-Wide Skills

Codex is launched from root `BuildIT`, so project-wide skills belong under
`.agents/skills/`.

| Skill | Canonical path | Function |
|---|---|---|
| `development-brief` | `.agents/skills/development-brief/SKILL.md` | mandatory Developing front door: request normalization, Dual POV, execution channel, input/output contract, acceptance, proof budget, final contract gate |
| `mcp-server-development` | `.agents/skills/mcp-server-development/SKILL.md` | MCP server/protocol boundary: tools/resources/prompts, registration, result semantics, annotations, transport/session behavior |
| `typescript-type-safety` | `.agents/skills/typescript-type-safety/SKILL.md` | TypeScript type-system boundary: compiler type errors, inference/generics/narrowing, declarations, public type contracts, compile-time module typing |

### Retired: `mcp-builder`

`mcp-builder` was audited and retired. Its useful MCP ideas were narrowed into
`mcp-server-development`; generic Python/FastMCP, external-API scaffolding,
pagination defaults, mandatory evaluation suite, and evaluation scripts were
removed.

Do not recreate or route to `mcp-builder`.

### Retired: `typescript-expert`

`typescript-expert` was audited and retired. Its useful TypeScript-specific
value was narrowed into `typescript-type-safety`.

Removed from the active skill were broad "use for any TypeScript/JavaScript"
routing, automatic environment scanning, generic npm validation, monorepo/Nx/
Turborepo decisions, Biome/ESLint migration advice, JavaScript→TypeScript
migration guidance, broad tooling/performance checklists, generic utility-type
reference bundles, and the Python diagnostic script.

Normal `.ts` implementation does not require a TypeScript specialist. Use
`typescript-type-safety` only when the type system itself owns the problem.

## Nested Copies Pending One-By-One Audit

Current repository inventory under `mcp/.agents/skills/`:

| Skill | Current apparent function | Status |
|---|---|---|
| `zod` | schema/input validation | **next audit** |
| `bun-development` | Bun runtime/scripts/dependencies | pending overlap audit |
| `blockbench-plugins` | Blockbench plugin lifecycle/UI/runtime API | pending naming/location audit |
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
