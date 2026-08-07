# MCP Ownership

This note defines what `mcp/` owns in this workspace.

## Purpose

`mcp/` is the active runtime and plugin area for the BlockIT MCP plugin.

It owns:

- plugin source and build output;
- runtime code;
- local docs that ship with or support the plugin;
- generated docs that describe the current MCP surface;
- prompt-library material that belongs to the plugin runtime;
- repo-local skill bundles mirrored into the plugin workspace.

## Boundary

`mcp/` does not own the product foundation rules.

`mcp/` does not own the repo-wide knowledge vault.

`mcp/` does not own archive material unless the archive is being used as a migration source.

## Main Subareas

- `index.ts`, `lib/`, `build/`, `server/`, `ui/`: runtime and plugin implementation.
- `.agents/skills/`: local skill mirror used by the plugin workspace.
- `.github/`: repo-specific instructions, prompts, and workflow helpers.
- `generated-docs/`: generated documentation for the current plugin surface.
- `dist/`, `build/`, `.tmp/`: generated or working output.

## Working Rules

- Keep plugin/runtime changes in `mcp/`.
- Keep stable product policy in `docs/foundation/`.
- Keep cross-repo working knowledge in `docs/knowledge/`.
- Use `Needs Validation` for any behavior that is inferred but not yet proven in the runtime.

## Review Questions

- Does the change belong in runtime or in documentation?
- Does the change affect the shipped plugin surface?
- Is this a generated artifact or a source file?
- Can the same rule live in `docs/foundation/` instead?
# Parent

- [Module Map](module-map.md)
- [Workspace Map](../workspace-map.md)
