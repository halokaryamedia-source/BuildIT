# BlockIT — Bedrock Entity MCP

BlockIT uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** Runtime/plugin inside desktop Blockbench. `Local` is the development authority.

Do **not** use an upstream hosted plugin as runtime authority for this repository. BlockIT source/builds come from this repository. Production plugin: `dist/blockit_mcp.js`.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:full
```

Verification is layered:

- `test:runtime` → executable/import-safe Runtime contracts;
- `verify:authoring` → authoring semantics;
- `verify:repository` → repository/docs/CI contracts;
- `verify:mcp` → executable/public MCP + authoring compatibility;
- `verify:full` → repository + MCP final gate without rerunning the same subset twice.

Use the smallest targeted test during iteration.

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

Normal AI-client use must point at the Gateway, not the native Runtime endpoint.

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

Geometry and Texturing retain distinct semantic owners, but their tools are available together during AUTHORING. A texture-discovered Geometry/UV defect is corrected in-session by the Geometry owner instead of forcing a Runtime phase bounce. `HANDOFF_REQUIRED` + `switch_authoring_phase` is reserved for AUTHORING↔Animation.

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
bun run three-d-assisted:run -- preflight
bun run three-d-assisted:run -- status --workspace /absolute/workspace/active/<asset>
bun run three-d-assisted:run -- run --workspace /absolute/workspace/active/<asset>
```

The Active Workspace README must contain:

```text
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: width=<n> height=<n> length=<n> blocks
```

`run` is resumable and stops at `AWAITING_SHAPE_GATE` and `AWAITING_DECOMPOSITION_GATE`; acceptance/rejection is explicit via `accept-shape|reject-shape|accept-decomposition|reject-decomposition`. Only passed artifacts become canonical `shape.glb` / `primitive-decomposition.json`; candidate evidence remains in `.cache/`.

`server/threeDAssistedMaterializer.ts` contains the fail-closed native engine. The Geometry capability `materialize_3d_assisted_scaffold` accepts only absolute `workspace_path` through the existing four-tool Gateway. The public binding, generated API surface, external orchestrator, and source contracts are implemented; GPU inference quality, installed materializer identity/native Undo behavior, and end-to-end asset quality remain separate local/live proof.

Generated API docs must never be hand-edited.

## Current Source Runtime Surface

```text
Gateway client surface        4 fixed tools
Source callable union        54 tools
AUTHORING surface            49 tools
Animation surface            18 tools
```

Geometry and Texturing startup focus values resolve to the same AUTHORING tool set. AUTHORING↔Animation crossing is Gateway-managed and continues the same task/chat without a normal AI-client reconnect or new chat.

Installed Runtime counts and lifecycle state are proof results; see `../docs/knowledge/current-validation.md`.

## Capability Priority

Gateway discovery ranks Runtime capabilities internally:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering affects discovery priority only. It does not create a second authoring profile. Known capabilities are invoked directly; bounded search is fallback-only and carries compact workflow aliases for high-value current authoring terminology.

## Quality Gates

Technical state is not visual acceptance.

- A clean positive-volume Cube-overlap audit does not prove absence of visible coplanar surfaces, seams, penetration, or gaps.
- Assembly corrections preserve semantic cohorts; a partial child move needs an explicit local-part reason.
- UV bounds/lock/partial-overlap checks do not prove a clean unwrap. Review face aspect, texel density, orientation, padding/seams, semantic reuse, and identity-specific islands.
- User visual rejection reopens the affected gate even when an earlier structural validator passed.

## Legacy UI Fallbacks

Normal authoring has no Standard/Extended choice. Internal `bedrock_entity | extended` registration identifiers remain implementation compatibility only; `extended` exposes Legacy UI Fallback families for debug/maintenance. `risky_eval` and `from_geo_json` remain disabled.

## Local Development Loop

### Automatic sync — recommended

Configure the exact file-based Blockbench plugin destination through `BLOCKIT_PLUGIN_PATH` (absolute path ending in `blockit_mcp.js`) or pass that path after `--sync`, then run:

```bash
bun run dev:sync
```

`dev:sync`:

```text
source change
→ successful development rebuild
→ exact-byte deploy to BLOCKIT_PLUGIN_PATH
→ file-based BlockIT detects new build_identity
→ old MCP listener closes
→ native Blockbench plugin.reload()
→ new BlockIT starts
→ live /health build_identity must match deployed build
```

Expected terminal states:

```text
LIVE_SYNCED       latest deployed build is running in Blockbench
DEPLOYED_OFFLINE  latest build is installed; Blockbench/Runtime is not running
STALE_BUILD       installed bytes changed but the running plugin did not load them
```

The auto-reload watcher exists only in development builds and only for a reloadable file-based BlockIT plugin. If the running plugin predates auto-sync support, the first `dev:sync` may report `STALE_BUILD`; use Blockbench's plugin **Reload** action once. Subsequent successful rebuilds can reload automatically. The Gateway refreshes its Runtime catalog when Runtime identity changes.

### Build only

```bash
bun run dev:watch
```

### Manual deploy

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The manual helper builds first, copies exact bytes, verifies build identity, and intentionally does **not** reload Blockbench automatically.

Gateway:

```bash
bun run gateway
```

Native Runtime proof examples:

```bash
bun run verify:stateless-local
bun run verify:geometry-live -- --confirm-disposable
```

These do not prove visual fidelity or accepted asset quality.

## Surface Guard

```text
Gateway client surface                 4 tools
retained Bedrock source catalog       54 tools
initialize instructions                <= 700 characters
catalog tools/list budget              <= 82,000 characters
catalog input schemas                  <= 58,700 characters
catalog descriptions                   <= 11,500 characters
max per-tool payload                   <= 3,200 characters
runtime workflow prompt             < 9,000 characters
Texturing specialist guidance       < 4,500 characters
```

These are static footprint guardrails, not Authoring Efficiency proof.

## Current Capability Shape

Normal authoring includes Cube/Group authoring, hierarchy/rig/pivots, Locator/Null lifecycle, canonical capture, UV Layout mutation/audit, Texture Atlas/Painter/PBR/material instances/render-profile bindings, animation/timeline/effects/controllers, Undo/history, `.bbmodel` persistence, Bedrock geometry export, stage control, and the dedicated 3D-Assisted scaffold materializer.

3D-Assisted source also includes the resumable external orchestrator and strict state/decomposition contracts. Remaining work is proof/environment closure where capability genuinely requires `LOCAL_CODE` or `LIVE_BLOCKBENCH`, not another public binding layer.

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
