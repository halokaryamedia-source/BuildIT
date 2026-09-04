# BlockIT — Bedrock Entity MCP

BlockIT uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** Runtime/plugin inside desktop Blockbench. `Local` is the development authority.

Do **not** use the upstream hosted plugin as runtime authority for this repository; BlockIT source/builds come from this repository. Production plugin: `dist/blockit_mcp.js`.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`verify:mcp` typechecks Runtime + Gateway, runs the recursive test suite, measures native surfaces, builds the plugin, and checks generated docs.

## Normal Client Boundary

```text
Codex / AI client
  ↓ stdio
BlockIT Gateway
  ↓ loopback Streamable HTTP
BlockIT Runtime
  ↓
Blockbench
```

Normal Codex use must point at the Gateway, not the native Runtime endpoint.

Gateway surface:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Native Runtime/debug endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Direct Runtime access is for Inspector/conformance/focused debugging only.

## Authoring Model

```text
Approved Reference + Dimensions + Requirements
→ user-selected Geometry Strategy: DIRECT | 3D_ASSISTED
→ Geometry
→ Texturing
→ Animation when required
→ Finalization
→ validated .bbmodel
```

`DIRECT` uses normal reference-guided Geometry.

`3D_ASSISTED` is one target package:

```text
Shape Reconstruction (Hunyuan3D v1)
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ dedicated atomic Cuboid Materialization
→ Semantic Geometry Cleanup
```

The approved image remains visual authority; requested dimensions remain numeric authority. `manage_geometry_reference` may support comparison inside 3D-Assisted Geometry, but it is not a separate user-facing route and never becomes production geometry.

## Current Runtime Surface

```text
Gateway client surface        4 fixed tools
Runtime callable union       51 tools
Geometry                     25 exposed tools
Texturing                    35 exposed tools
Animation                    19 exposed tools
```

Foreign-phase work returns `HANDOFF_REQUIRED`; phase switching is invoked through Gateway and continues the same task/chat without normal MCP reconnect or new chat.

## Capability Priority

Gateway discovery ranks Runtime capabilities internally:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering affects discovery priority only. It does not create a second authoring profile.

## Legacy UI Fallbacks

Normal authoring has no Standard/Extended choice. The internal `bedrock_entity | extended` registration identifiers remain for compatibility; `extended` exposes Legacy UI Fallback families only for debug/maintenance. `risky_eval` and `from_geo_json` remain disabled.

## Local Development Loop

Watch build:

```bash
bun run dev:watch
```

Install the exact current plugin bundle:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The helper builds first, copies exact bytes, verifies build identity, and does not reload Blockbench automatically. Runtime health exposes `build_identity`; use it to confirm the installed bundle matches the exact local artifact before reusing live proof.

Gateway:

```bash
bun run gateway
```

Codex configuration is documented in `gateway/README.md`.

Native Runtime proof:

```bash
bun run verify:stateless-local
bun run verify:geometry-live -- --confirm-disposable
```

These do not prove Gateway lifecycle survival or visual quality.

## Surface Guard

```text
Gateway client surface                 4 tools
retained Bedrock Runtime catalog      51 tools
default native Geometry exposure       25 tools
initialize instructions                <= 700 characters
catalog tools/list budget              <= 82,000 characters
catalog input schemas                  <= 58,500 characters
catalog descriptions                   <= 11,500 characters
max per-tool payload                   <= 3,200 characters
runtime workflow prompt             < 9,000 characters
Texturing specialist guidance       < 4,500 characters
```

## Current Capability Shape

Normal authoring includes Cube/Group authoring, hierarchy/rig/pivots, Locator/Null lifecycle, canonical capture, Texture Atlas/Painter/PBR/material instances, animation/timeline/effects/controllers, Undo/history, `.bbmodel` persistence, Bedrock geometry export, and phase control.

3D-Assisted external orchestration and the dedicated production scaffold materializer remain implementation work tracked in `../docs/knowledge/next-action.md`.

## Source Layout

```text
gateway/      stable client boundary + Runtime adapter
index.ts      Blockbench plugin entry/lifecycle
server/       Runtime transport/tools/resources/prompts
lib/          schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      canonical runtime workflow + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement/local-deploy utilities
tests/        contract/integration regressions
docs/         generated Runtime API documentation
```

Generated API/prompt artifacts follow canonical source + generator output and must never be hand-edited.

## Proof Boundary

Continuation → `../docs/knowledge/next-action.md`. Proof interpretation → `../docs/knowledge/current-validation.md`. Static source/CI success cannot prove installed Runtime freshness, live Gateway survival, external 3D model/decomposition quality, atomic Undo behavior, playback/persistence, or visual fidelity unless those surfaces actually ran.
