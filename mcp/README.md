# BlockIT — Bedrock Entity MCP

BlockIT uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** Runtime/plugin inside desktop Blockbench. `Local` is the development authority.

Do **not** use the upstream hosted plugin as runtime authority for this repository; upstream contributors remain credited in package metadata, while BlockIT source/builds come from this repository.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`package.json` owns verifier composition. `verify:mcp` typechecks both the Runtime and isolated Gateway project, runs the recursive tests, measures native surfaces, builds the plugin, and checks generated docs.

Production plugin: `dist/blockit_mcp.js`. The filename must match the stable `blockit_mcp` plugin ID. `bun run build` embeds deterministic SHA-256 `build_identity` into the production bundle.

## Normal Client Boundary

```text
AI client
  ↓ stdio
BlockIT Gateway
  ↓ loopback Streamable HTTP
BlockIT Runtime
  ↓
Blockbench
```

Configure normal Codex/AI-client use through `bun run gateway`, not directly against the Runtime endpoint.

Gateway client surface stays fixed:

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

Use direct Runtime access only for Inspector, conformance, and focused debugging.

## Authoring Model

Normal authoring has one flow:

```text
approved image + optional 3D Evidence
→ Geometry
→ Texturing
→ Animation when required
→ validated .bbmodel
```

Optional 3D Evidence is Geometry-only supporting evidence. It is not a second route and never becomes production geometry.

The Runtime retains **51 callable tools across authoring phases**:

```text
Geometry   25 exposed tools
Texturing  35 exposed tools
Animation  19 exposed tools
```

Phase-scoped routing remains deliberate because it materially improves tool selection. Gateway keeps the client connection stable while Runtime phase changes.

```text
foreign-phase need
→ HANDOFF_REQUIRED
→ invoke switch_authoring_phase through Gateway
→ Gateway invalidates backend catalog
→ next capability request refreshes
→ continue same task/chat
```

No normal phase handoff requires a new chat or MCP reconnect.

## Capability Priority

Gateway discovery classifies Runtime capabilities internally:

```text
PRIMARY      normal authoring hot path
SUPPORT      conditional but valid capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  debug/legacy fallback, de-prioritized
```

Capability tiering changes discovery priority only; it does not delete Runtime capability.

Texturing is intentionally the largest phase. Do not merge/remove tools merely to reduce count. Consolidation requires evidence that it lowers **Cost to Accepted Result** without quality/capability loss.

## Legacy UI Fallbacks

Normal authoring has no Standard/Extended profile choice.

The source still retains the internal `bedrock_entity | extended` registration identifiers for compatibility. `bedrock_entity` is the normal Runtime implementation profile. Internal `extended` only enables **Legacy UI Fallback** families (`import` + `ui`) for debug/maintenance.

The Blockbench setting is therefore presented as **Legacy UI Fallbacks (Debug)**, not an authoring profile. `risky_eval` and `from_geo_json` remain disabled.

## Local Development Loop

```bash
bun run dev:watch
```

Watch mode rebuilds production Runtime inputs. Gateway source is intentionally separate so ordinary plugin reload does not replace the Codex-facing Gateway process.

To install the exact current plugin bundle:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The helper builds first, copies exact bytes, verifies `build_identity`, and does **not** reload Blockbench automatically. Reload the plugin when needed; a normal Gateway client remains alive and refreshes Runtime state lazily.

For native Runtime proof:

```bash
bun run verify:stateless-local
bun run verify:geometry-live -- --confirm-disposable
```

`verify:stateless-local` proves native installed Runtime identity/surface only. It does not prove the separate Gateway reload-survival gate or visual quality.

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
```

`gateway-contract.test.ts` owns Gateway stability/ranking contracts. `authoring-phase-surface.test.ts` owns native phase exposure and handoff semantics. `measure:surface` and `measure:phases` remain static/source footprint guards, not Authoring Efficiency proof.

## Current Capability Shape

Normal authoring includes:

- Cube placement/correction through `manage_cubes`;
- Group/bone hierarchy, transform, rig, Locator/Null authoring;
- optional `manage_geometry_reference` evidence during Geometry;
- one base-color Texture Atlas workflow plus Painter styling;
- consolidated `manage_material` PBR operations and `manage_material_instances`;
- Bedrock animation through `create_animation`, `manage_animation_timeline`, optional effects/controllers;
- Undo/history, canonical capture, `.bbmodel` persistence, and Bedrock geometry export.

Protected gaps remain tracked in `docs/knowledge/implementation-map.md`.

## Source Layout

```text
gateway/      stable client boundary + Runtime adapter
index.ts      Blockbench plugin entry/lifecycle
server/       Runtime transport/tools/resources/prompts
lib/          shared schemas/factories/identity/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement/local-deploy utilities
tests/        contract/integration regressions
docs/         generated Runtime API documentation
```

Generated API/prompt artifacts follow canonical source + generator output and must never be hand-edited.

## Proof Boundary

Current continuation lives in `../docs/knowledge/next-action.md`; current proof interpretation lives in `../docs/knowledge/current-validation.md`. Source/static success cannot prove live Gateway survival, installed Runtime freshness, Blockbench persistence/playback, or visual fidelity unless those surfaces actually ran.
