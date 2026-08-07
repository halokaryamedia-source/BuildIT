# Skill Ownership

`mcp/workflow/skills/` is the single canonical owner of workspace-specific
skills.

It owns only concise `SKILL.md` instructions needed for MCP-Blockbench work.
Detailed product policy remains in `docs/foundation/`; runtime code remains in
its owning MCP or Reference Generator module.

## Canonical Skills

- `mcp-builder`
- `typescript-expert`
- `zod`
- `bun-development`
- `blockbench-use`
- `blockbench-plugins`
- `reference-generator`
- `evidence-gate`

## Boundaries

- Do not copy global Codex skills into the workspace.
- Do not put runtime environments, generated output, README files, or generic
  API catalogs inside a skill folder.
- Do not maintain compatibility mirrors as independent workflows.
- Use the global `skill-creator` for skill structure and validation.
- Use `Needs Validation` when a skill claim is not proven in this workspace.

## Parent

- [Module Map](module-map.md)
- [Skill Map](../skills/skill-map.md)
