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

Changing a skill profile SHALL NOT require MCP reconnect. Changing an MCP tool profile MAY reconnect the existing canonical `blockbench` entry once.

## Efficiency

The dispatcher SHALL:

- derive the active stage from `state.json`;
- load exactly one stage skill;
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
