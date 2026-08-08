# MCP Ownership

Updated: 2026-08-08

This note defines what `mcp/` owns in current Local.

## Purpose

`mcp/` is the active Blockbench MCP plugin/runtime implementation area.

It owns:

- plugin lifecycle and settings/UI integration;
- MCP server/session/transport implementation;
- tools, resources, prompts, and their public contracts;
- Blockbench mutation/observation execution mechanics;
- shared runtime helpers and schemas;
- build and generated API documentation;
- bundled Bedrock prompt source.

## Main Source Areas

| Area | Owns |
|---|---|
| `mcp/index.ts` | plugin entry and lifecycle wiring |
| `mcp/server/` | MCP server, tools, resources, prompts, transport/session surfaces |
| `mcp/server/tools/` | model/project/camera/element/cube/animation/etc. tool implementations |
| `mcp/lib/` | factories, shared schemas/utilities, runtime helpers |
| `mcp/ui/` | Blockbench UI/settings |
| `mcp/prompts/` | bundled prompt sources |
| `mcp/build/` | plugin/docs generation tooling |
| `mcp/docs/` | generated API docs, secondary to source |
| `mcp/dist/` | generated plugin output |

## Reference Fidelity Runtime Boundary

Current Local source under `mcp/` provides execution/observation mechanics for
the Reference Fidelity Loop, including:

- rendered model bounds inspection;
- canonical model-view capture;
- authored element inspection;
- strict Cube creation/targeting;
- coherent multi-Cube correction;
- Cube and Group pivot-transfer semantics;
- safer Group/bone parent and pivot targeting.

MCP does **not** own visual resemblance judgement. The agent/modelling workflow
uses these instruments to reason from evidence.

## What `mcp/` Does Not Own

- durable product/modelling policy → `docs/foundation/`;
- repository-wide project memory → `docs/knowledge/`;
- repository-wide skills → root `.agents/skills/`;
- per-model project packages → `workspace/`;
- Source Image → Modelling Brief generation policy →
  `docs/foundation/04-reference-guide.md`.

## Skill Boundary

There are no active canonical skills owned by `mcp/`.

The old paths:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

are legacy/stale locations, not current skill roots. Do not repopulate them to
match historical notes.

## Generated Documentation Boundary

`mcp/docs/` is generated from source schemas/manifests. It is useful for the MCP
surface but is not the Obsidian knowledge vault and does not override current
source.

Root `docs/` and `mcp/docs/` therefore have different jobs:

```text
root docs/ → human/project policy + Obsidian memory
mcp/docs/  → generated API description
```

## Proof Rule

Static Local source can establish that a runtime path is implemented. Actual
Blockbench/MCP behavior, visual image transport, Undo behavior, or persistence
remains `LOCAL PROOF REQUIRED` until tested locally.

## Parent

- [Module Map](module-map.md)
- [Implementation Map](../implementation-map.md)
- [Workspace Map](../workspace-map.md)
