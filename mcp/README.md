# LazyDesigner — Bedrock Entity MCP

LazyDesigner uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** Runtime/plugin inside desktop Blockbench. `Local` is the development authority.

Do **not** use an upstream hosted plugin as runtime authority for this repository. LazyDesigner source/builds come from this repository. The current compatibility bundle filename remains `dist/blockit_mcp.js` until bundle/package identifier migration is explicitly mapped.

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
LazyDesigner Gateway
  ↓ loopback Streamable HTTP
LazyDesigner Runtime
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
→ native LazyDesigner Geometry on shared AUTHORING
→ Geometry approval
→ UV Layout PASS
→ Texturing/PBR on shared AUTHORING
→ Texture approval
→ Animation surface when required
→ Finalization
→ validated .bbmodel
```

Geometry and Texturing retain distinct semantic owners, but their tools are available together during AUTHORING. A texture-discovered Geometry/UV defect is corrected in-session by the Geometry owner instead of forcing a Runtime phase bounce. `HANDOFF_REQUIRED` + `switch_authoring_phase` is reserved for AUTHORING↔Animation.

The previous 3D-assisted/Hunyuan/PrimitiveAnything modelling path is retired. Normal modelling now has one native Group/Cube authoring path.

Generated API docs must never be hand-edited.

## Current Source Runtime Surface

```text
Gateway client surface        4 fixed tools
Active phase-union catalog   54 tools
AUTHORING surface            47 tools
Animation surface            20 tools
```

The current generated source-doc snapshot may temporarily retain retired compatibility descriptors until its next `LOCAL_CODE` generator pass. They are excluded from active Runtime phase surfaces and are not current authoring capabilities.

Installed Runtime counts and lifecycle state are proof results; see `../docs/05-operations/current-validation.md`.

## Capability Priority

Gateway discovery ranks Runtime capabilities internally:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering affects discovery priority only. It does not create a second authoring profile. Known capabilities are invoked directly; bounded search is fallback-only.

## Quality Gates

Technical state is not visual acceptance.

- A clean positive-volume Cube-overlap audit does not prove absence of visible coplanar surfaces, seams, penetration, or gaps.
- Assembly corrections preserve semantic cohorts; a partial child move needs an explicit local-part reason.
- UV bounds/lock/partial-overlap checks do not prove a clean unwrap. Review face aspect, texel density, orientation, padding/seams, semantic reuse, and identity-specific islands.
- User visual rejection reopens the affected gate even when an earlier structural validator passed.

## Legacy UI Fallbacks

Normal authoring has no Standard/Extended choice. Internal `bedrock_entity | extended` registration identifiers remain implementation compatibility only; `extended` exposes Legacy UI Fallback families for debug/maintenance. `risky_eval` and `from_geo_json` remain disabled.

## Local Development Loop

The existing environment variable `BLOCKIT_PLUGIN_PATH` is retained as a compatibility identifier until environment/deploy migration is explicitly mapped. Configure it, or pass the destination after `--sync`, then run:

```bash
bun run dev:sync
```

`dev:sync` performs successful development rebuild → exact-byte deploy → file-based native plugin reload → live build-identity verification. Expected states are `LIVE_SYNCED`, `DEPLOYED_OFFLINE`, or `STALE_BUILD`.

Build only:

```bash
bun run dev:watch
```

Manual deploy currently uses the compatibility bundle filename:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

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

Static footprint guardrails are maintained by `scripts/measure-default-surface.ts` and `scripts/measure-phase-surfaces.ts`. Control payload diagnostics use `scripts/measure-control-context.ts`. They are not Authoring Efficiency proof.

## Current Capability Shape

Normal authoring includes Cube/Group authoring, hierarchy/rig/pivots, Locator/Null lifecycle, canonical capture, UV Layout mutation/audit, Texture Atlas/Painter/PBR/material instances/render-profile bindings, animation/timeline/effects/controllers, Undo/history, `.bbmodel` persistence, Bedrock geometry export, and stage control.

## Source Layout

```text
gateway/control/ canonical LazyDesigner Control
gateway/         stable client boundary + Runtime adapter
index.ts         Blockbench plugin entry/lifecycle
server/          Runtime transport/tools/resources/prompts
lib/             schemas/factories/runtime helpers
ui/              Blockbench panel/settings
prompts/         canonical runtime workflow + generated manifest
build/           build/docs/manifest tooling
scripts/         verification/deploy/measurement utilities
tests/           contract/integration regressions
docs/            generated Runtime API documentation
```

Generated API/prompt artifacts follow canonical source + generator output and must never be hand-edited.

## Identity Migration Boundary

Current product-facing identity is LazyDesigner. Primary LazyDesigner Skill identities are already migrated; do not recreate the removed legacy Skill paths.

The following compatibility-bound identifiers remain intentionally unchanged until their dependency boundary is mapped:

```text
package name / MCP server IDs
bundle filename `blockit_mcp.js`
BBPlugin id `blockit_mcp`
BLOCKIT_* environment variables
x-blockit-* affinity headers
persisted setting identifiers
build/provenance identities coupled to the above
```

Do not bulk-rename them.

## Proof Boundary

Continuation → `../docs/05-operations/next-action.md`. Proof interpretation → `../docs/05-operations/current-validation.md`. Static source/CI success cannot prove installed Runtime freshness, live Gateway survival, final surface/UV quality, native Undo/playback/persistence, or visual fidelity unless those surfaces actually ran.
