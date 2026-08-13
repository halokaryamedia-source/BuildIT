# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Do **not** use the upstream hosted plugin as BlockIT proof; validate the repository local build.

## Build / Verify

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin: `dist/mcp.js`.

Runtime-only stateless smoke, only when local proof is explicitly active:

```bash
bun run verify:stateless-local
```

## Endpoint / Containment

Default endpoint: `http://127.0.0.1:3000/bb-mcp`.

The server is loopback-only and request-owned/stateless. Extended MCP Families are off by default. `risky_eval` and `from_geo_json` remain disabled.

## Bedrock Product Boundary

Normal capability includes Cube/Group authoring, bounded observation, texture/Painter/PBR/material instances, Bedrock animation including authored Molang transform strings and bounded new-animation sound events, read-only AnimationController/state inspection, Locator/Null Object state, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Controller creation/mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions remain protected gaps.

## Current Serialized Proof

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters
max per-tool payload: 3,167 characters
```

These are serialized characters, not model-visible token measurements.

## Source Layout

```text
index.ts      plugin entry/lifecycle
server/       MCP transport/tools/resources/prompts
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + two source-only maintainer notes + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement utilities
tests/        contract/integration regressions
docs/         generated API documentation
```

Generated `docs/api.json`, `docs/index.html`, and `prompts/manifest.json` are secondary to source and checked for freshness.

Repository continuation follows root `AGENTS.md`, `docs/knowledge/next-action.md`, and the affected owner. Named MCP defects use the `implementation-map.md` Hot-Path Defect Index first.

Do not add compatibility shims, duplicate project tools, new router/profile layers, or generic import/eval capability without a proved need.
