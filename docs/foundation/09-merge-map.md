# BlockIT Merge Map — Historical Adoption Record

**Status:** Historical Record  
**Updated classification:** 2026-08-08

## Purpose

This note records the earlier merge/adoption principle used while forming the
current Local BlockIT workspace from upstream references.

It no longer describes a pending merge. Current Local source is already the
implementation authority.

## Historical Decision

The adopted direction was:

- keep the Blockbench-first plugin/MCP shape;
- borrow only safety/contract ideas that materially improved it;
- reject unrelated applications/engines and duplicate ways to solve the same
  problem;
- keep generated output secondary to source;
- keep the workspace readable rather than mirroring upstream directory layouts.

## Current Merge Rule

For any future upstream adoption:

```text
current Local gap proved?
↓
existing owner cannot solve it cleanly?
↓
yes → inspect smallest useful upstream idea
↓
adapt into the current owner
```

Do **not**:

- copy an upstream subsystem wholesale because it exists;
- restore stale `mcp/workflow/` or nested skill paths;
- create a parallel runtime/framework;
- revive Hytale/generic mesh/PBR scope without a current requirement;
- import generated docs/output as implementation authority.

## Current Local Result

- `mcp/` is the active Blockbench MCP plugin/runtime.
- `.agents/skills/` is the only canonical repository-wide skill root.
- `docs/foundation/` is durable product/modelling policy.
- `docs/knowledge/` is the Obsidian project-memory vault.
- `workspace/` stores per-model project packages.

Current Reference Fidelity implementation and ownership are documented in the
[Implementation Map](../knowledge/implementation-map.md).

## Related

- [Source Selection](08-source-selection.md)
- [Source Map](../knowledge/sources/source-map.md)
- [Module Map](../knowledge/modules/module-map.md)
