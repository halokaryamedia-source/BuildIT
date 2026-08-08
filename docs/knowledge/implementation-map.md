# Implementation Map

Updated: 2026-08-08

Use this note to answer **where current Local behavior lives**. It is a source
ownership map, not an active-task tracker.

## Repository Areas

- `.agents/skills/` — frozen canonical repository-wide skills.
- `docs/foundation/` — durable product/modelling/reference policy.
- `docs/knowledge/` — Obsidian continuity, decisions, maps, reviews, operations.
- `mcp/` — active Blockbench MCP plugin/runtime source.
- `mcp/docs/` — generated API docs; secondary to source.
- `workspace/` — active/saved Blockbench project packages and fixtures.

The old `mcp/workflow/` path does not exist in current Local and must not be
recreated merely to satisfy historical documentation.

## Semantic Ownership

| Boundary | Owner |
|---|---|
| Developing task contract | `.agents/skills/development-brief/SKILL.md` |
| MCP public/input/result contract | `.agents/skills/mcp-server-development/SKILL.md` |
| TypeScript type-system failures | `.agents/skills/typescript-type-safety/SKILL.md` |
| Bun build/tooling | `.agents/skills/bun-tooling/SKILL.md` |
| Blockbench runtime/API/mutation mechanics | `.agents/skills/blockbench-runtime-development/SKILL.md` |
| Bedrock model judgement/visual result | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` |
| Reference generation policy | `docs/foundation/04-reference-guide.md` |
| Evidence-status escalation | root `AGENTS.md` |

## Reference Fidelity Source Map

### Observation

| Capability | Source owner | Current source meaning |
|---|---|---|
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | raw rendered whole-Cube envelope facts; no resemblance/PASS |
| rendered bounds reader | `mcp/lib/renderedModelBounds.ts` | shared rendered-bounds authority used by fidelity observation |
| `capture_model_views` | `mcp/server/tools/camera.ts` | named canonical 512×512 model views with explicit front direction |
| `inspect_element` | `mcp/server/tools/element.ts` | exact authored Cube/Group state for diagnosed local correction |

### Cube Creation / Correction

| Capability | Source owner | Current source meaning |
|---|---|---|
| `place_cube` | `mcp/server/tools/cubes.ts` | explicit finite `from/to`; strict parent resolution; non-zero initial rotation requires explicit pivot |
| `modify_cube` | `mcp/server/tools/cubes.ts` | required explicit `id`; UUID-first / exact unique-name resolution; no implicit editor-selection mutation; pivot-only correction preserves visual position; zero→non-zero rotation activation requires explicit origin |
| `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | heterogeneous exact-UUID updates in one recoverable Undo unit; all targets preflight zero→non-zero rotation activation before Undo |
| Cube pivot-only semantics | `mcp/server/tools/cubes.ts` | origin-only → `Cube.transferOrigin()`; origin + geometry transform → authored rewrite |
| Existing-Cube rotation activation | `mcp/server/tools/cubes.ts` | currently unrotated target + requested non-zero rotation requires explicit origin; already-rotated target may reuse existing pivot |

### Hierarchy / Pivot

| Capability | Source owner | Current source meaning |
|---|---|---|
| `add_group` | `mcp/server/tools/element.ts` | neutral origin/rotation defaults; strict explicit parent resolution |
| `bone_rigging` | `mcp/server/tools/animation.ts` | action-specific preflight, strict Group targets, safer parent/pivot/IK/mirror behavior |
| Group pivot-only semantics | `mcp/server/tools/animation.ts` | `Group.transferOrigin()` for explicit pivot change |

### Agent-Facing Route

- `mcp/prompts/bedrock.md` — runtime-facing Bedrock modelling route aligned with
  the Reference Fidelity Loop.
- `.agents/skills/blockbench-bedrock-modelling/SKILL.md` — modeller judgement.
- `docs/foundation/03-modelling-workflow.md` — durable workflow policy.
- `docs/foundation/05-geometry-standard.md` — durable Cube/rotation/pivot rules.
- `docs/foundation/07-visual-validation.md` — proof/visual-gate policy.

## Proof Boundary

The items above are **implemented in Local source**. ChatGPT→GitHub inspection
can prove source contracts and ownership only.

Live claims such as:

- actual Blockbench camera/render behavior;
- MCP image transport reaching the vision-capable agent;
- Undo behavior in the installed Blockbench version;
- save/reopen persistence;
- visual resemblance of a produced model;

remain `LOCAL PROOF REQUIRED` until deliberately tested in Codex local +
Blockbench.

## Current Engineering Direction

Active work is no longer a generic “MCP implementation audit.” The current
engineering program is specifically **reference-fidelity hardening**: remove
assumption-driven geometry/rotation/pivot/targeting behavior and close the visual
feedback loop with the smallest useful observation/correction surface.

The exact current task and next source slice remain in
[Next Action](next-action.md).

## Related

- [Knowledge Dashboard](index.md)
- [Module Map](modules/module-map.md)
- [MCP Ownership](modules/mcp-ownership.md)
- [Skill Ownership](modules/skill-ownership.md)
- [Reference Fidelity Decision](decisions/reference-fidelity-loop.md)
