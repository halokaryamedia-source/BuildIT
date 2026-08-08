# Workspace Structure

Updated: 2026-08-08

`workspace/` is the root-level storage area for Blockbench model/project
packages. This note documents the structure that actually exists in Local; it
does not invent a project-creation script or preset owner.

## Top-Level Layout

```text
workspace/
├─ README.md
├─ active/
└─ saved/
```

- `active/` — projects currently being worked on.
- `saved/` — projects intentionally retained as completed/saved packages.

The folder location is organizational state only. A project in `saved/` is not
proof that every runtime/visual requirement was verified unless its own evidence
says so.

## Expected Project Package

A project package may contain:

```text
<project>/
├─ <project>.bbmodel
├─ export-data/
└─ mcp-data/
   ├─ cache/
   └─ references/
```

Use only the directories a real project needs.

- `<project>.bbmodel` — native Blockbench project file.
- `export-data/` — deliverable Minecraft/Bedrock outputs when the project creates
  them.
- `mcp-data/references/` — approved Modelling Brief and project-specific reference
  material.
- `mcp-data/cache/` — reproducible temporary MCP/Codex visual/cache data.

Do not put final deliverables into `mcp-data/cache/`.

## Current Lifecycle Rule

```text
model/package is active
→ keep under workspace/active/

work is intentionally finalized/saved
→ move/retain under workspace/saved/
```

How a project is created/opened/saved is runtime implementation truth. Do not
claim a `mcp/workflow/presets/` or similar creation system: that path is not
present in current Local.

## Boundaries

- reusable runtime/plugin behavior → `mcp/`;
- product/modelling policy → `docs/foundation/`;
- repository/Obsidian memory → `docs/knowledge/`;
- per-project files/data → `workspace/`.

## Reference Boundary

The generic reference-generation policy belongs to
`docs/foundation/04-reference-guide.md`. Only project-specific approved reference
material belongs in a project package.

## Proof Boundary

A `.bbmodel` file existing on disk establishes file presence only. Save/reopen
fidelity, texture persistence, animation persistence, and visual correctness are
separate claims and require their relevant proof.

## Related

- [Workspace Map](workspace-map.md)
- [Implementation Map](implementation-map.md)
- [Reference Guide](../foundation/04-reference-guide.md)
