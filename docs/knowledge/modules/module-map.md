# Module Map

This note maps the repo at a working level.

## Current Areas

- `docs/foundation/`: BlockIT source of truth for policy and workflow.
- `docs/foundation/04-reference-guide.md`: reference image workflow.
- `docs/knowledge/`: Obsidian knowledge vault.
- `mcp/`: active plugin and MCP working area.
- `mcp/workflow/skills/`: canonical workspace-specific skill bundles.

## Boundary Rules

- Keep product policy in `docs/foundation/`.
- Keep working knowledge and decision notes in `docs/knowledge/`.
- Keep code changes in the relevant runtime area.
- Keep archived material read-only unless a migration is explicitly needed.

## Recommended Module Notes

- `docs/foundation/` - product policy and workflow SSOT.
- `docs/knowledge/` - vault workflow, decisions, review, and maintenance.
- `mcp/` - plugin/runtime and MCP integration.
- `mcp/workflow/skills/` - local skill instructions only.

## Notes To Maintain

- `docs` needs the strongest navigation discipline because it is the vault map.
- `mcp/` needs an ownership note because it is the active runtime area.
- `mcp/workflow/skills/` uses one ownership note and one activation matrix.

## Boundary Check

Before creating a new note, ask:

1. Does this belong to an existing module note?
2. Is this stable enough for `docs/foundation/`?
3. Is this only a temporary working note?
4. Can this be merged into an existing page instead?

## Suggested Reading

- `docs/README.md`
- `docs/foundation/README.md`
- `docs/knowledge/index.md`
- Open only one module note at a time unless you are comparing boundaries.

## Parent

- [Knowledge Dashboard](../index.md)
- [Implementation Map](../implementation-map.md)
- [MCP Ownership](mcp-ownership.md)
- [Skill Ownership](skill-ownership.md)
