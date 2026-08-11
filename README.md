# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. The product goal is a clean editable `.bbmodel` following an approved visual reference through the shortest evidence-backed workflow.

`Local` is the current product/development branch. Historical/reference branches are not current execution authority.

## Task Class First

Root [`AGENTS.md`](AGENTS.md) owns routing and proof discipline.

### Asset authoring

```text
current request / approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling, texturing, or animation specialist
→ BlockIT MCP
```

**Do not automatically load repository history**, `CONTEXT.md`, `next-action.md`, or development skills for ordinary asset authoring.

### Repository / plugin continuation

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ development-brief for create/change work
```

`docs/knowledge/next-action.md` is the only active continuation snapshot. [`docs/knowledge/operations/local-acceptance-runbook.md`](docs/knowledge/operations/local-acceptance-runbook.md) records the completed local acceptance procedure and is not default boot unless explicitly reactivated.

## Product Boundary

Normal BlockIT work targets Blockbench `bedrock`:

```text
approved reference
→ primary Cube/Group form
→ difference-first FAIL / UNVERIFIED / PASS
→ bounded correction or global reframe
→ secondary geometry / hierarchy / pivots
→ texture/PBR when required
→ animation when required
→ validation
→ .bbmodel / Bedrock geometry export
```

Tool success is execution evidence, not visual approval. `BLOCKED` is valid when continuation would require guessing or repeated failed work. Generic Mesh/Hytale workflows, risky evaluation, UI automation, or another format do not expand the Bedrock contract.

## Repository Map

| Path | Purpose |
|---|---|
| `.agents/skills/` | repository-owned skills |
| `mcp/` | BlockIT MCP source/build/tests/generated API docs |
| `workspace/` | model/reference packages and fixtures |
| `docs/foundation/` | durable product/modelling policy |
| `docs/knowledge/` | continuity, ownership, decisions, reviews, operations |

## Skill Surface

```text
asset authoring:
  blockit-bedrock-entity-mcp
  ├─ blockbench-bedrock-modelling
  ├─ blockit-bedrock-texturing
  └─ blockit-bedrock-animation

repository development:
  development-brief
  mcp-server-development
  blockbench-runtime-development
  typescript-type-safety
  bun-tooling
```

Select by current boundary; never load all skills by ritual.

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production output is `mcp/dist/mcp.js`. **Do not use the upstream hosted** Blockbench MCP plugin as proof of BlockIT; load the repository build when runtime validation is explicitly active.

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

See [`mcp/README.md`](mcp/README.md) for runtime/build details.

## Accepted Functional Baseline

The 2026-08-12 bounded local acceptance pass verified representative runtime transport, geometry/correction/Undo, visual-routing behavior, texture/Paint/PBR/material instances, animation playback, Locator/Null Object lifecycle, and `.bbmodel`/Bedrock export persistence.

Accepted default surface measurement:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` remains exposed; `list_export_formats`, `apply_texture`, and `filter_by_material` are absent from the default callable surface; `risky_eval` and `from_geo_json` remain disabled.

These static counts do not prove client token cost. Current cleanup/testing state belongs only in [`docs/knowledge/next-action.md`](docs/knowledge/next-action.md).

## Hygiene

- generated MCP API docs are tracked and checked for freshness;
- transient build/editor/preview state is ignored;
- historical implementation belongs in Git/reviews, not duplicate active plans;
- approved reference packages and intentional fixtures remain tracked.

## License / Upstream

GPL-3.0-only; see [`LICENSE`](LICENSE). BlockIT retains upstream attribution while its Bedrock-focused product surface and repository workflow remain project-owned.
