# Module Map

Updated: 2026-08-11

This note maps current `Local` repository ownership. It is not an active-task tracker.

## Current Areas

```text
BuildIT/
├─ .agents/skills/       canonical repository-owned skills
├─ docs/
│  ├─ foundation/        durable product/modelling policy
│  └─ knowledge/         continuity, maps, reviews, operations, decisions
├─ mcp/                  BlockIT Blockbench MCP plugin/runtime source
└─ workspace/            model/project packages and fixtures
```

## `.agents/skills/`

Only canonical repository-owned skill root.

Asset authoring:

```text
blockit-bedrock-entity-mcp
blockbench-bedrock-modelling
blockit-bedrock-texturing
blockit-bedrock-animation
```

Repository/plugin development:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

Do not recreate skills under historical nested `mcp/` locations.

## `docs/foundation/`

Owns stable product/modelling policy:

- product requirements;
- reference preparation;
- whole-form modelling sequence;
- Cube/rotation/pivot/hierarchy rules;
- texture/PBR policy;
- visual validation/proof boundary;
- current capability evidence matrix in `validation-report.md`.

It does not own active task status.

## `docs/knowledge/`

Owns repository memory:

- `index.md` — dashboard/navigation;
- `next-action.md` — active repository continuation;
- `operations/local-acceptance-runbook.md` — local acceptance procedure;
- `decision-log.md` / `decisions/` — durable reasons;
- `implementation-map.md` / `modules/` / `sources/` — current ownership;
- `skills/` — current skill inventory/routing;
- `reviews/` — historical evidence + current review index;
- `operations/task-board.md` — future/non-active work.

## `mcp/`

Owns the current plugin/runtime implementation:

- `index.ts` — plugin lifecycle wiring;
- `server/` — MCP server, tools, resources, prompts;
- `server/tools/` — project/geometry/element/camera/texture/paint/material-instance/animation/export tools;
- `lib/` — factories, shared schemas/identity/runtime helpers;
- `ui/` — Blockbench settings/panel UI;
- `build/` — plugin/docs/prompt-manifest generation;
- `prompts/bedrock_entity_workflow.md` — canonical bundled Bedrock workflow prompt;
- `docs/` — generated MCP API docs, secondary to source;
- `dist/` — generated plugin output.

There is no current `mcp/workflow/` owner.

## `workspace/`

Owns model/project data only. Do not make fixture layout into product/runtime policy.

## Before Creating A New Module/Note

Ask:

1. Does a current owner already cover the responsibility?
2. Is this stable policy, current status, procedure, evidence, or runtime behavior?
3. Would the new file reduce retrieval ambiguity or create another layer?
4. Is it needed for the current task rather than speculative future work?

Prefer updating an existing owner. The local acceptance runbook is the single procedural exception for the active runtime-proof stage.

## Related

- [Implementation Map](../implementation-map.md)
- [MCP Ownership](mcp-ownership.md)
- [Skill Ownership](skill-ownership.md)
- [Workspace Map](../workspace-map.md)
