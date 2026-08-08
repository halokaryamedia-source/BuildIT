# Implementation Map

Use this note for active repository areas and ownership boundaries.

## Areas

- `.agents/skills/` — frozen canonical repository-wide skills available from
  root `BuildIT`.
- `docs/foundation/` — durable product/modelling/reference policy.
- `docs/knowledge/` — continuity, decisions, routing maps, reviews, and
  navigation.
- `mcp/` — active Blockbench MCP runtime/plugin source.
- `mcp/.agents/skills/` and `mcp/.github/skills/` — retired legacy skill
  locations; no active canonical skills live there.
- `workspace/` — active/saved Blockbench project packages and fixtures.

## Current Ownership

- Developing task contract → `.agents/skills/development-brief/SKILL.md`.
- MCP public/protocol/input contract → `mcp-server-development`.
- TypeScript type-system issue → `typescript-type-safety`.
- Bun-owned build/tooling → `bun-tooling`.
- Blockbench runtime/API/lifecycle/mutation mechanics →
  `blockbench-runtime-development`.
- Bedrock model judgement/visual result → `blockbench-bedrock-modelling`.
- Source Image → approved Modelling Brief →
  `docs/foundation/04-reference-guide.md` on an image-capable surface.
- Evidence-status escalation → root `AGENTS.md`.

## Current Focus

- Active state lives only in `docs/knowledge/next-action.md`.
- Skill architecture is frozen; do not reopen historical skill recovery without
  a current proved ownership/capability gap.
- MCP implementation audit is the next engineering phase.
- Remove stale links/rules instead of recreating historical paths or compatibility
  structure.

## Parent

- [Knowledge Dashboard](index.md)
- [Module Map](modules/module-map.md)
