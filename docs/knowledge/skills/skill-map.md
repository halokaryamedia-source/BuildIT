# Skill Map

Use this note for skill availability/location. Use
[Activation Matrix](activation-matrix.md) for routing.

## Repository-Wide Skill

Codex is launched from root `BuildIT`, so project-wide skills belong under
`.agents/skills/`.

| Skill | Canonical path | Function |
|---|---|---|
| `development-brief` | `.agents/skills/development-brief/SKILL.md` | mandatory Developing front door: request normalization, Dual POV, execution channel, input/output contract, acceptance, proof budget, final contract gate |

## MCP Specialist Copies Pending Audit

These skills currently exist under `mcp/.agents/skills/`. They are usable as
explicit repository guidance, but their names, overlap, and final root/module
location have **not** been approved yet.

| Skill | Current function | Status |
|---|---|---|
| `mcp-builder` | MCP server and public tool surface | naming/location audit pending |
| `typescript-expert` | TypeScript types/module structure | overlap audit pending |
| `zod` | schema/input validation | overlap audit pending |
| `bun-development` | Bun runtime/scripts/dependencies | overlap audit pending |
| `blockbench-plugins` | Blockbench plugin lifecycle/UI/runtime API | naming/location audit pending |

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
