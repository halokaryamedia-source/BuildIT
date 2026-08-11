# Workspace Map

Updated: 2026-08-11

Use this only when repository ownership/location is unclear.

## Top-level areas

- [Agent Rules](../../AGENTS.md) — task routing, proof discipline, anti-overdevelopment.
- [Workspace Context](../../CONTEXT.md) — stable facts/terminology.
- [Next Action](next-action.md) — one active repository continuation state.
- [Foundation](../foundation/README.md) — durable product/modelling/reference policy.
- [Knowledge Dashboard](index.md) — current documentation navigation.
- [Implementation Map](implementation-map.md) — current source ownership/surface.
- [Skill Map](skills/skill-map.md) — repository-owned skills.
- [MCP](../../mcp/README.md) — active plugin/runtime source.
- [Project Workspace](../../workspace/README.md) — model/reference packages and fixtures.

## Repository structure

```text
BuildIT/
├─ .agents/skills/       repository-owned skills
├─ .github/workflows/    repository CI only
├─ docs/
│  ├─ foundation/        durable current policy
│  └─ knowledge/         current memory + reviews/decisions
├─ mcp/                  BlockIT plugin/runtime/build/tests
└─ workspace/            project/reference packages
```

Standalone-upstream/editor configuration does not belong under `mcp/`; GitHub/IDE/AI-client state is repository-root or local-only.

## Skill root

All project-owned skills live under:

```text
.agents/skills/
```

Nested historical skill/config roots under `mcp/` are not current authorities.

## Workspace rule

`workspace/active/` may contain intentional `.bbmodel` and approved reference fixtures. `workspace/**/mcp-data/cache/` is transient and ignored; do not commit screenshots/previews merely because an experiment generated them.

## Fast rule

- start from `AGENTS.md`, not a broad repository scan;
- use `next-action.md` only for repository continuation;
- use the Local Acceptance Runbook when that continuation is active;
- use Git history/reviews for provenance instead of restoring deleted planning layers;
- verify a path/owner exists before creating a replacement.

## Parent

- [Knowledge Dashboard](index.md)
