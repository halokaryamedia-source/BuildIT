# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. The goal is a clean, editable `.bbmodel` that follows an approved visual reference through the shortest evidence-backed workflow.

`Local` is the current product/development branch. `Rework` and `Sample` are reference/history only.

## Task Class First

Root [`AGENTS.md`](AGENTS.md) owns agent routing and proof discipline.

### Asset authoring

For creating or revising a Bedrock Entity asset without changing repository/plugin source:

```text
current request / approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling, texturing, or animation specialist
→ BlockIT MCP
```

Do not automatically load repository history, `CONTEXT.md`, `next-action.md`, or development skills by default for ordinary asset authoring.

### Repository / plugin continuation

For source, documentation, CI, MCP/plugin implementation, or repository maintenance:

```text
AGENTS.md
→ CONTEXT.md when stable project facts matter
→ docs/knowledge/next-action.md when continuing current work
→ affected source + nearest AGENTS.md
→ development-brief for a create/change task
```

The current repository continuation is **Codex + Blockbench local acceptance**. When `next-action.md` activates it, use [`docs/knowledge/operations/local-acceptance-runbook.md`](docs/knowledge/operations/local-acceptance-runbook.md) as the single procedure.

## Product Boundary

Normal BlockIT work targets Blockbench format `bedrock`.

```text
Approved reference
→ whole-form interpretation
→ primary Cube/Group geometry
→ difference-first visual gate
→ causal correction or global rebuild
→ secondary geometry / hierarchy / pivots
→ texture / PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

Tool success is execution evidence, not visual approval. Visual verdicts are `FAIL / UNVERIFIED / PASS`; use `BLOCKED` when valid continuation would require guessing or repeated failed work.

Generic Mesh/Hytale workflows, risky evaluation, and editor-UI automation do not expand the default Bedrock Entity contract.

## Repository Map

| Path | Purpose |
|---|---|
| `.agents/skills/` | repository-owned agent skills |
| `mcp/` | BlockIT Blockbench MCP source, tests, build, generated API docs |
| `workspace/` | model/reference packages and user fixtures |
| `docs/foundation/` | durable product/modelling/reference policy |
| `docs/knowledge/` | current continuity, source maps, decisions, reviews, operations |

Project memory is repository-backed. Do not reconstruct current state from old chats when the canonical owner exists.

## Current Skill Surface

Asset authoring:

```text
blockit-bedrock-entity-mcp
├─ blockbench-bedrock-modelling
├─ blockit-bedrock-texturing
└─ blockit-bedrock-animation
```

Repository/plugin development:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

The packages are selected by task boundary; they are not a load-all stack.

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production plugin output is `mcp/dist/mcp.js`. Load that file locally in desktop Blockbench; do not use the upstream hosted plugin as proof of this repository.

Default endpoint after the local plugin is loaded:

```text
http://127.0.0.1:3000/bb-mcp
```

See [`mcp/README.md`](mcp/README.md) for runtime details.

## Current Pre-local Baseline

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` remains exposed. `list_export_formats`, `apply_texture`, and `filter_by_material` are intentionally absent from the default callable surface; `risky_eval` and `from_geo_json` remain disabled.

Live Codex/Blockbench behavior is still `LOCAL PROOF REQUIRED`; see [`docs/knowledge/next-action.md`](docs/knowledge/next-action.md).

## Workspace Hygiene

- transient build output, editor state, Obsidian UI state, and MCP preview caches are ignored;
- approved reference packages and intentional `.bbmodel` fixtures remain tracked;
- historical implementation evidence belongs in Git history/reviews, not duplicate active plans;
- generated MCP API docs remain tracked because `bun run docs:check` verifies freshness.

## License / Upstream

BlockIT is licensed under **GPL-3.0-only**; see [`LICENSE`](LICENSE).

The MCP implementation is derived from the open-source Blockbench MCP work by Jason J. Gardner and contributors. Upstream attribution is preserved while BlockIT's Bedrock-focused product surface, repository routing, and local validation procedure are maintained here.
