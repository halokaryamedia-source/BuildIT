# Module Map

Updated: 2026-08-08

This note maps the current Local repository at a working level.

## Current Areas

```text
BuildIT/
├─ .agents/skills/       canonical BlockIT skills
├─ docs/
│  ├─ foundation/        durable product/modelling policy
│  └─ knowledge/         Obsidian project-memory vault
├─ mcp/                  Blockbench MCP plugin/runtime source
└─ workspace/            active/saved Blockbench project data
```

## Boundary Rules

### `.agents/skills/`

The only canonical repository-wide skill root.

Current frozen set:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

Do not recreate skills under old nested locations merely for compatibility.

### `docs/foundation/`

Owns stable product and modelling policy:

- product requirements;
- reference preparation;
- Reference Fidelity modelling flow;
- geometry / rotation / pivot standards;
- texture standards;
- visual validation and proof boundary.

It does not own daily implementation status.

### `docs/knowledge/`

Owns repository memory for Obsidian:

- `index.md` — dashboard;
- `next-action.md` — active task snapshot;
- `decision-log.md` / `decisions/` — durable reasoning;
- `implementation-map.md` / `modules/` — ownership;
- `reviews/` — evidence/history;
- `operations/` — backlog, roadmap, audit, change history.

### `mcp/`

Owns current plugin/runtime implementation. Important subareas:

- `index.ts` — plugin entry/lifecycle wiring;
- `server/` — MCP server/tools/resources/prompts;
- `lib/` — shared runtime/factory/schema helpers;
- `ui/` — Blockbench settings/panel UI;
- `build/` — build/docs generation;
- `prompts/` — bundled prompt source;
- `docs/` — generated MCP API docs;
- `dist/` — generated plugin output.

There is **no current `mcp/workflow/` module**.

### `workspace/`

Owns model/project data only:

- `workspace/active/` — current model packages;
- `workspace/saved/` — completed/saved packages.

See [Workspace Structure](../workspace-structure.md) for the actual current
layout. Do not invent a preset/script owner that does not exist in Local.

## Historical / Retired Paths

These are not current owners:

```text
mcp/workflow/
mcp/workflow/skills/
mcp/.agents/skills/
mcp/.github/skills/
```

Historical notes may mention them as lineage. Current code or documentation must
not route new work there.

## Before Creating A New Module/Note

Ask:

1. Does an existing owner already cover this responsibility?
2. Is this stable product policy (`foundation`) or working memory (`knowledge`)?
3. Is this runtime behavior (`mcp`) or per-project data (`workspace`)?
4. Is the new file needed now, or would it duplicate an existing note?

## Parent

- [Knowledge Dashboard](../index.md)
- [Implementation Map](../implementation-map.md)
- [MCP Ownership](mcp-ownership.md)
- [Skill Ownership](skill-ownership.md)
