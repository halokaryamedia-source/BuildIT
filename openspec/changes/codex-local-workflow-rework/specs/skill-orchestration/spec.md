# Production Skill Orchestration Specification

## Canonical Skills

The active production workflow SHALL use only these canonical production skills:

```text
blockbench-production
blockbench-geometry
blockbench-texture
blockbench-animation
blockbench-validation
```

Their canonical source SHALL be `engines/shared/skills/`. Tool-native `.agents/skills/` and `.codex/skills/` copies SHALL be synchronized adapters, not editable authorities.

## Stage Mapping

```text
BOOTSTRAP        → blockbench-production
GEOMETRY         → blockbench-production + blockbench-geometry
TEXTURE          → blockbench-production + blockbench-texture
ANIMATION        → blockbench-production + blockbench-animation
FINAL_VALIDATION → blockbench-production + blockbench-validation
```

No production profile SHALL load more than two skills. Animation skill SHALL NOT load when Animation is skipped.

## Tool and Skill Alignment

Each stage skill SHALL be used only with the matching exact MCP tool profile defined by `engines/shared/profiles/stage-profiles.json`.

Changing a skill or logical MCP tool profile SHALL NOT require an MCP reconnect, plugin reload, or new Codex session. A transition SHALL release the previous write lease, retain the stable registered tool surface, call `get_stage_context`, and acquire a fresh current-stage lease.

## Writer Selection

Exactly one Terra writer SHALL be selected for active-asset mutation. The Terra Medium parent SHALL handle normal implementation directly. `mcp_builder` SHALL become the fallback sole writer only when the parent differs or isolation is materially safer. Read-only advisors SHALL NOT acquire the write lease.

## Efficiency

The dispatcher SHALL:

- derive the selected asset from `workspace/workspace.json` and the active stage from its `mcp/state.json`;
- load `blockbench-production` plus exactly one active-stage skill;
- reuse fresh readiness and preflight results;
- read only active-stage reference documents;
- avoid loading unrelated production or repository-development skills;
- stop at the stage review gate.

## Separation from Repository Development

MCP source development SHALL NOT load production skills. It SHALL load only the smallest required development skill set, such as OpenSpec, TypeScript, Zod, or MCP builder guidance.

## Deprecated Skills

The production workflow SHALL NOT use or recreate:

```text
blockbench-use
blockbench-modeling
blockbench-texturing
```

Git history remains the archive; versioned replacement names are forbidden.