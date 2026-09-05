# BlockIT — Bedrock Entity MCP

BlockIT uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** Runtime/plugin inside desktop Blockbench. `Local` is the development authority.

Do **not** use the upstream hosted plugin as runtime authority for this repository; BlockIT source/builds come from this repository. Production plugin: `dist/blockit_mcp.js`.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:full
```

Verification is layered: `test:runtime` owns root executable/import-safe tests, `verify:authoring` owns authoring semantics, `verify:repository` owns repository/docs/CI contracts, `verify:mcp` owns executable/public MCP + authoring compatibility, and `verify:full` runs the repository + MCP final gates without rerunning the same subset twice. Use the smallest targeted test during iteration.

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
→ shared AUTHORING surface
   Geometry/rig/UV focus ↔ Texturing/PBR focus
→ Animation surface when required
→ Finalization
→ validated .bbmodel
```

Geometry and Texturing retain distinct semantic owners, but their tools are available together during AUTHORING. A texture-discovered Geometry/UV defect is corrected in-session by the Geometry owner instead of forcing a Runtime phase bounce. `HANDOFF_REQUIRED` + `switch_authoring_phase` is reserved for crossing AUTHORING↔Animation.

`DIRECT` uses normal reference-guided Geometry.

`3D_ASSISTED` is one package:

```text
deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction (Hunyuan3D v1)
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ atomic Cuboid Materialization
→ Semantic Geometry Cleanup
```

Approved image remains visual authority; requested dimensions remain numeric authority. `manage_geometry_reference` may support comparison inside 3D-Assisted Geometry, but it is not a separate user-facing route and never becomes production geometry.

### 3D-Assisted external CLI

The production external owner is `scripts/three-d-assisted-run.ts`:

```bash
bun run three-d-assisted:run -- status --workspace /absolute/workspace/active/<asset>
bun run three-d-assisted:run -- run --workspace /absolute/workspace/active/<asset>
```

The Active Workspace README must contain:

```text
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: width=<n> height=<n> length=<n> blocks
```

`run` is resumable and stops at `AWAITING_SHAPE_GATE` and `AWAITING_DECOMPOSITION_GATE`; acceptance/rejection is explicit via `accept-shape|reject-shape|accept-decomposition|reject-decomposition`. Only passed artifacts become canonical `shape.glb` / `primitive-decomposition.json`; candidate evidence remains in `.cache/`.

`server/threeDAssistedMaterializer.ts` contains the fail-closed native materializer engine. Its **public Geometry ToolSpec binding is intentionally LOCAL_CODE work** because generated MCP API docs must come from the canonical generator. Bind the engine as one Runtime capability accepting only `workspace_path`, keep the Gateway at four tools, then run `bun run docs:build` and `bun run verify:full` before live proof. Generated API docs must never be hand-edited.

## Current Runtime Surface

```text
Gateway client surface        4 fixed tools
Runtime callable union       51 tools
AUTHORING surface            Geometry + Texturing families together
Animation surface            separate
```

The exact installed AUTHORING `tools/list` count is deliberately treated as a local verification result rather than hand-maintained documentation. Geometry and Texturing startup focus values must resolve to the same AUTHORING tool set. Animation crossing remains Gateway-managed and continues the same task/chat without a normal MCP reconnect or new chat.

## Capability Priority

Gateway discovery ranks Runtime capabilities internally:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering affects discovery priority only. It does not create a second authoring profile.

## Quality Gates

Technical state is not visual acceptance.

- A clean positive-volume Cube-overlap audit does not prove absence of visible coplanar surfaces, seams, penetration, or gaps.
- Assembly corrections preserve semantic cohorts; a partial child move needs an explicit local-part reason.
- UV bounds/lock/partial-overlap checks do not prove a clean unwrap. Review face aspect, texel density, orientation, padding/seams, semantic reuse, and identity-specific islands.
- User visual rejection reopens the affected gate even when an earlier structural validator passed.

## Legacy UI Fallbacks

Normal authoring has no Standard/Extended choice. The internal `bedrock_entity | extended` registration identifiers remain for compatibility; `extended` exposes Legacy UI Fallback families only for debug/maintenance. `risky_eval` and `from_geo_json` remain disabled.

## Local Development Loop

### Automatic sync — recommended

For day-to-day development, configure the exact file-based Blockbench plugin destination once through `BLOCKIT_PLUGIN_PATH` (an absolute path ending in `blockit_mcp.js`) or pass that path after `--sync`, then run:

```bash
bun run dev:sync
```

`dev:sync` is the end-to-end development loop:

```text
source change
→ successful development rebuild
→ exact-byte deploy to BLOCKIT_PLUGIN_PATH
→ file-based BlockIT detects a new build_identity
→ old MCP listener closes completely
→ native Blockbench plugin.reload()
→ new BlockIT starts
→ live /health build_identity must match the deployed build
```

Expected terminal states:

```text
LIVE_SYNCED       latest deployed build is running in Blockbench
DEPLOYED_OFFLINE  latest build is installed; Blockbench/Runtime is not running
STALE_BUILD       installed bytes changed but the running plugin did not load them
```

The auto-reload watcher exists only in development builds and only for a reloadable **file-based** BlockIT plugin. If the currently running plugin predates this auto-sync support, the first `dev:sync` can report `STALE_BUILD`; use Blockbench's plugin **Reload** action once. After that bootstrap, subsequent successful rebuilds reload automatically without user action. The Gateway already refreshes its Runtime catalog when the Runtime build/signature changes.

### Build only

Use this when automatic deploy/reload is not wanted:

```bash
bun run dev:watch
```

### Manual deploy

Install the exact current plugin bundle manually:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The manual helper builds first, copies exact bytes, verifies build identity, and intentionally does **not** reload Blockbench automatically. Runtime health exposes `build_identity`; use it to confirm the installed bundle matches the exact local artifact before reusing live proof.

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

These do not prove visual fidelity or accepted asset quality.

## Surface Guard

```text
Gateway client surface                 4 tools
retained Bedrock Runtime catalog      51 tools
initialize instructions                <= 700 characters
catalog tools/list budget              <= 82,000 characters
catalog input schemas                  <= 58,500 characters
catalog descriptions                   <= 11,500 characters
max per-tool payload                   <= 3,200 characters
runtime workflow prompt             < 9,000 characters
Texturing specialist guidance       < 4,500 characters
```

## Current Capability Shape

Normal authoring includes Cube/Group authoring, hierarchy/rig/pivots, Locator/Null lifecycle, canonical capture, UV Layout mutation/audit, Texture Atlas/Painter/PBR/material instances, animation/timeline/effects/controllers, Undo/history, `.bbmodel` persistence, Bedrock geometry export, and stage control.

3D-Assisted source includes the resumable external orchestrator, strict state/decomposition contracts, and internal atomic materializer engine. Remaining implementation is the thin public materializer ToolSpec binding + generated docs in LOCAL_CODE, followed by local/live proof.

## Source Layout

```text
gateway/      stable client boundary + Runtime adapter
index.ts      Blockbench plugin entry/lifecycle
server/       Runtime transport/tools/resources/prompts + materializer engine
lib/          schemas/factories/runtime helpers + 3D-Assisted contracts
ui/           Blockbench panel/settings
prompts/      canonical runtime workflow + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/deploy + production 3D-Assisted orchestration
tests/        contract/integration regressions
docs/         generated Runtime API documentation
```

Generated API/prompt artifacts follow canonical source + generator output and must never be hand-edited.

## Proof Boundary

Continuation → `../docs/knowledge/next-action.md`. Proof interpretation → `../docs/knowledge/current-validation.md`. Static source/CI success cannot prove installed Runtime freshness, live Gateway survival, final surface/UV quality, external GPU quality, PrimitiveAnything quality, atomic Undo behavior, playback/persistence, or visual fidelity unless those surfaces actually ran.
