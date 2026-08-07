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
| `blockbench-runtime-development` | `.agents/skills/blockbench-runtime-development/SKILL.md` | Blockbench runtime/plugin boundary: lifecycle, embedded UI/component behavior, settings, globals/APIs, Undo/Canvas, runtime permissions, mutation mechanics, events/cleanup |
| `blockbench-bedrock-modelling` | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | Minecraft Bedrock modeller judgement: approved reference → whole-form Cuboid model, proportions/silhouette, hierarchy/pivots, UV/texture scope, required animation, visual completion |

## Recovered Lineage

### `blockbench-use` → `blockbench-bedrock-modelling`

**Decision:** `RECOVER + RENAME + SLIM`.

The exact historical `blockbench-use` source was recovered from repository
history. It was a mandatory Blockbench MCP orchestrator that routed many
sub-skills, including modelling, texturing, animation, PBR, Hytale, and plugin
work, with broad pre-flight/checkpoint behavior.

That orchestration model is not restored. `development-brief` plus this
activation matrix already own routing, and Developing allows at most one useful
specialist.

The useful capability is recovered as `blockbench-bedrock-modelling`, focused on
**what Bedrock model should be built and whether it is visually coherent**.

Historical generic `blockbench-modeling` guidance was also inspected. Mesh,
sphere/cylinder/freeform workflows and generic tool catalogs were not recovered
because Local product policy is Minecraft Bedrock Entity + Cuboid-first and
runtime/tool availability is source/session truth.

The following historical behavior is explicitly not restored:

- load-all-relevant-skills orchestration;
- generic Hytale/PBR/mesh routing;
- mandatory `list_outline + list_textures` pre-flight;
- checkpoint after a fixed mutation count;
- historical first-Cube/support/contact/section construction rules;
- screenshot quotas or structural success as visual approval.

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
retained while generic project scaffolding, unrelated Bun APIs, Node→Bun
migration, and generic performance advice were removed.

### `blockbench-plugins`

Replaced by `blockbench-runtime-development`.

The old skill mixed generic plugin tutorials, custom format/codec scaffolding,
UI examples, model API mechanics, and modelling-adjacent wording. BlockIT only
needs a focused runtime specialist for the existing MCP plugin.

Both duplicate packages were retired:

- `mcp/.agents/skills/blockbench-plugins/`
- `mcp/.github/skills/blockbench-plugins/`

Generic plugin templates and copied API/event/element reference packs were not
moved into the new skill. Local source, installed Blockbench typings, and live
Blockbench behavior are the stronger authorities.

`blockbench-runtime-development` owns **how Blockbench runtime operations work**.
`blockbench-bedrock-modelling` owns **what model should be built and whether the
result is visually/model-wise correct**.

### Nested `skill-creator`

Dropped as a repository skill. It was a generic authoring toolkit with no
BlockIT-only behavior. Use the available global/user `skill-creator` capability
when a skill itself is created or materially revised; do not keep another
repository copy solely for availability.

### `vue-best-practices`

Merged into `blockbench-runtime-development` and retired as a separate skill.
Local reactive UI is embedded in Blockbench runtime surfaces, not a standalone
Vue application domain.

Do not recreate or route to retired `mcp-builder`, `typescript-expert`, `zod`,
`bun-development`, `blockbench-plugins`, nested `skill-creator`,
`vue-best-practices`, or historical `blockbench-use` orchestrator packages.

## Legacy Nested Skill Locations

There are currently **no active skills** under `mcp/.agents/skills/` or
`mcp/.github/skills/`.

Those paths are legacy locations, not active project-wide skill roots. Do not
repopulate them merely to match historical layout.

## Recovery Items

| Skill lineage | Intended function | Status |
|---|---|---|
| `reference-generator` | Source Image → modelling-brief package | **next recovery + rename/overlap audit** |
| `evidence-gate` | unsupported/disputed evidence and repeated failed directions | recovery + rename/overlap audit |

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
Preserve upstream lineage in the decision record when a rename/merge/recovery
occurs.

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
