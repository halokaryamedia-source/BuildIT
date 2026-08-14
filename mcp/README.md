# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Current repository state:

```text
PRELOCAL_PLUGIN_FRESHNESS_READY
```

The source/build contract is static verified. The exact plugin artifact loaded by Blockbench, current runtime behavior, and current model-quality results remain **LOCAL PROOF REQUIRED** until local acceptance is run.

Do **not** use the upstream hosted plugin as BlockIT proof; validate the repository local build.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin:

```text
dist/mcp.js
```

`dist/` is generated output. Package version alone is not artifact-freshness proof. Before local acceptance, record the exact `Local` HEAD and SHA-256 of the fresh `dist/mcp.js` that will be loaded into Blockbench.

Windows PowerShell:

```powershell
Get-FileHash .\dist\mcp.js -Algorithm SHA256
```

Runtime-only stateless smoke, after the fresh plugin is running:

```bash
bun run verify:stateless-local
```

## Endpoint / Containment

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

The server is loopback-only and request-owned/stateless. Extended MCP Families are off by default. `risky_eval` and `from_geo_json` remain disabled.

Required local baseline:

```text
62 enabled tools
Extended MCP Families = OFF
risky_eval = disabled
from_geo_json = disabled
local BlockIT build only
```

## Local Acceptance

The current live test has two clear stages:

```text
TEST 1 — MCP / CORE MECHANICS
→ prove Plugin + MCP mechanics, Undo/Redo, texture/PBR, animation reachability,
  Locator/Null Object, persistence, and export

TEST 2 — REFERENCE MODEL (ELEPHANT)
→ prove Minecraft-first Geometry + Texture modelling from the approved reference
```

The approved elephant image is **test evidence, not production plugin content**. It must be visible to the local modelling context during Test 2; do not bundle it into `dist/` just to run the test.

Detailed procedure: `../docs/knowledge/operations/local-acceptance-runbook.md`.

## Bedrock Product Boundary

Normal capability includes Cube/Group authoring, bounded observation, texture/Painter/PBR/material instances, Bedrock animation including authored Molang transform strings and bounded new-animation sound events, read-only AnimationController/state inspection, Locator/Null Object state, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Reference-driven modelling is **Minecraft-first**. Exact source likeness is not the acceptance target. Minor view/texture drift may be resolved into one canonical recognizable Blockbench-buildable interpretation; unresolved material contradiction remains `CONFLICTING / BLOCKED`.

Controller creation/mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions remain protected gaps.

## Codex / Agent Routing

Normal asset authoring routes from intent + known state + current stage to the exact tool. Reuse fresh returned state instead of ritual rediscovery.

```text
known target/tool → execute directly
unknown/stale identity → focused discovery only
geometry → modelling specialist
texture/PBR → texturing specialist
animation → animation specialist
```

Do not broad-search repository source for ordinary asset authoring, inspect every newly placed Cube, capture after every mutation, or use disabled/generic fallback capability to hide an unsupported gap.

## Current Serialized Proof

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters
max per-tool payload: 3,167 characters
runtime workflow prompt: 6,959 characters
```

These are serialized characters, not model-visible token measurements.

## Source Layout

```text
index.ts      plugin entry/lifecycle
server/       MCP transport/tools/resources/prompts
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + source-only maintainer notes + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement utilities
tests/        contract/integration regressions
docs/         generated API documentation
```

Generated `docs/api.json`, `docs/index.html`, and `prompts/manifest.json` are secondary to source and checked for freshness.

Repository continuation follows root `AGENTS.md`, `docs/knowledge/next-action.md`, and the affected owner. Named MCP defects use the `implementation-map.md` Hot-Path Defect Index first.

Do not add compatibility shims, duplicate project tools, new router/profile layers, generic import/eval capability, or another testing framework without a proved need.

## Upstream attribution

BlockIT retains upstream attribution in package/license metadata while the Bedrock-focused product surface and repository workflow remain project-owned.
