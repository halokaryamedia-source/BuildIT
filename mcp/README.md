# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Current repository state:

```text
PRELOCAL_OPTIMIZATION_COMPLETE
```

The source/build contract and pre-local optimization closure are static verified. The exact plugin artifact loaded by Blockbench, current runtime behavior, runtime call efficiency, persistence, and current model-quality results remain **LOCAL PROOF REQUIRED**.

**Local acceptance is currently deferred.** Do not activate runtime/local proof merely because the repository is static-ready.

Do **not** use the upstream hosted plugin as BlockIT proof; validate the repository local build when local acceptance is explicitly reactivated.

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

`dist/` is generated output. Package version alone is not artifact-freshness proof. A future local acceptance records the exact `Local` HEAD and SHA-256 of the fresh `dist/mcp.js` actually loaded into Blockbench.

Runtime-only stateless smoke, only after local acceptance is explicitly reactivated and the fresh plugin is running:

```bash
bun run verify:stateless-local
```

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The server is loopback-only and request-owned/stateless. The accepted default surface remains **62 enabled tools**.

## Local Acceptance — Inactive

The single procedure owner is `../docs/knowledge/operations/local-acceptance-runbook.md`. It is not an active next step until `../docs/knowledge/next-action.md` explicitly reactivates it after a fresh user instruction.

When reactivated, it retains two modelling stages:

```text
TEST 1 — MCP / CORE MECHANICS
→ Plugin + MCP mechanics, Undo/Redo, texture/PBR, animation reachability,
  Locator/Null Object, persistence, and export

TEST 2 — REFERENCE MODEL (ELEPHANT)
→ Minecraft-first Geometry + Texture modelling from the approved reference
```

The approved elephant image is test evidence, not production plugin content.

## Bedrock Product Boundary

Normal capability includes Cube/Group authoring, bounded observation, texture/Painter/PBR/material instances, Bedrock animation including authored Molang transform strings and bounded new-animation sound events, read-only AnimationController/state inspection, Locator/Null Object state, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Reference-driven modelling is **Minecraft-first**. Minor view/texture drift may be resolved into one canonical recognizable Blockbench-buildable interpretation; unresolved material contradiction remains `CONFLICTING / BLOCKED`.

Protected gaps remain controller creation/mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Codex / Agent Routing

Normal asset authoring routes from intent + known state + current stage to the exact tool. Reuse fresh returned state instead of ritual rediscovery.

```text
known target/tool → execute directly
unknown/stale identity → focused discovery only
known coherent Cubes → place_cube(elements=[...])
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

These are serialized characters, not installed-client token measurements. Current static evidence does not justify reducing the tool surface, adding a lean profile, or shrinking the runtime prompt by assumption.

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
