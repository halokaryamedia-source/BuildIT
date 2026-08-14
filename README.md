# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. `Local` is the current product/development authority.

## Current Status

```text
PRELOCAL_PLUGIN_FRESHNESS_READY
```

The current source contract is static/CI verified. **Installed-plugin freshness, live Blockbench behavior, model quality, and persistence on the current build remain `LOCAL PROOF REQUIRED` until the local test is run.**

Do not claim live Blockbench/model-quality improvement without actual runtime proof.

## Product Flow

```text
1. PREPARE REFERENCE
2. AUTHOR BEDROCK MODEL
3. FINISH ASSET
```

Reference fidelity is **Minecraft-first**: recognizable Geometry + Texture that can be built cleanly in Blockbench matters more than exact 1:1 reconstruction. Minor reference drift may be resolved into one canonical Minecraft interpretation; unresolved material contradiction remains `BLOCKED`.

Root `AGENTS.md` owns routing. `docs/knowledge/flow.md` owns the detailed product sequence. Tool success is execution evidence, not visual approval.

## Local Acceptance Flow

The next live acceptance is deliberately simple:

```text
current Local
→ clean tree + exact HEAD
→ static gate + fresh build
→ record mcp/dist/mcp.js SHA-256
→ load the exact local BlockIT build
→ restart Blockbench + reconnect MCP
→ verify endpoint + 62-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

**Test 1** proves the Plugin/MCP mechanics. **Test 2** proves reference-driven Minecraft Geometry + Texture judgement using the approved elephant reference. The approved image must be visible to the local modelling context; it is not bundled into the production plugin.

The single procedure owner is `docs/knowledge/operations/local-acceptance-runbook.md`.

## Current Documentation Owners

- `CONTEXT.md` — stable facts
- `docs/knowledge/next-action.md` — active continuation
- `docs/knowledge/flow.md` — detailed current workflow
- `docs/knowledge/implementation-map.md` — source/tool ownership
- `docs/foundation/validation-report.md` — current proof state
- `docs/foundation/` — durable current policy
- `docs/knowledge/operations/local-acceptance-runbook.md` — active local acceptance procedure when `next-action.md` points to it

Historical audits, decisions, plans, and experiments belong in Git history, not parallel current-owner documents.

## Repository Map

```text
.agents/skills/     canonical Codex/agent skills and authoring judgement
mcp/                Blockbench plugin/runtime/build/tests/generated API docs
docs/foundation/    durable current policy + proof state
docs/knowledge/     current flow/continuation/ownership/procedure
workspace/fixtures/ bounded reusable evidence/acceptance fixtures
```

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production output is the local build at `mcp/dist/mcp.js`. `dist/` is generated and not repository authority. **Package version alone is not freshness proof**; local acceptance records the exact Git HEAD plus SHA-256 of the built `mcp/dist/mcp.js` actually loaded by Blockbench.

Do not use the upstream hosted plugin as BlockIT proof.

Current static surface:

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters
max per-tool payload: 3,167 characters
runtime workflow prompt: 6,959 characters
```

P0–P7, the Minecraft-first Reference Generator contract, and PRO-1–PRO-8 are implemented at their documented proof level. PRO-8 is read-only AnimationController/state inspection; controller creation/mutation remains deferred. Serialized character counts are not token measurements.

## Runtime / Security Baseline

```text
default profile              bedrock_entity
endpoint                     http://127.0.0.1:3000/bb-mcp
transport                    stateless Streamable HTTP / JSON
Extended MCP Families        OFF by default
risky_eval                   disabled
from_geo_json                disabled
```

Normal asset authoring should route from current intent + known state to the exact MCP tool and active modelling/texturing/animation specialist. Do not broad-scan the repository, repeatedly rediscover known state, inspect every Cube, or capture after every mutation.

## Protected Capability Gaps

The following remain explicit gaps rather than being faked through generic fallbacks:

- AnimationController creation/mutation
- existing-animation direct sound/timeline-effect mutation
- TextureMesh direct authoring/inspection
- native Bedrock visible bounding-box fields
- animated-texture authoring
- bone-binding expressions

## Hygiene

One current owner per responsibility. Git history owns removed historical documentation. Do not add another routing, planning, review, scoring, profile, compatibility, or packaging layer without concrete need.

## License

GPL-3.0-only; see `LICENSE`.
