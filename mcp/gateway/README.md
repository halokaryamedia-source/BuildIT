# BlockIT MCP Gateway

BlockIT Gateway is the stable MCP client boundary in front of the volatile Blockbench Runtime.

```text
AI client
   ↓ stdio — stable for client lifetime
BlockIT Gateway
   ↓ loopback Streamable HTTP
BlockIT Runtime inside Blockbench
```

## Canonical Authoring Model

Gateway does not choose the modelling strategy.

```text
Approved Reference + Dimensions + Requirements
→ user selects DIRECT | 3D_ASSISTED
→ shared AUTHORING surface: Geometry/UV ↔ Texturing/PBR
→ Animation surface when required
→ Finalization
```

`DIRECT` is normal reference-guided Geometry.

`3D_ASSISTED` is one package: Shape Reconstruction → PrimitiveAnything → dedicated atomic Cuboid Materialization → Semantic Geometry Cleanup. `manage_geometry_reference` may support comparison inside 3D-Assisted Geometry, but it is not a separate route.

## Stable Client Surface

```text
status
search_capabilities
describe_capability
invoke_capability
```

Blockbench/plugin reload and Runtime stage changes do not change this client-facing `tools/list`.

## Capability Discovery

The live Runtime catalog is surface-filtered. Geometry and Texturing startup focus values expose the same shared AUTHORING capabilities; Animation has its own surface. Gateway search assigns internal priority only for discovery:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering never deletes capability. Exact intent may still discover an exposed support/experimental/maintenance capability.

## Authoring / Animation Handoff

Geometry↔Texturing is **not** a Gateway handoff. Both capability families remain present on the AUTHORING Runtime surface; semantic ownership decides which specialist governs the correction.

A successful Runtime `switch_authoring_phase` call is reserved for the AUTHORING↔Animation boundary and remains Gateway-managed:

```text
invoke switch_authoring_phase
→ Runtime surface changes AUTHORING ↔ Animation
→ Gateway invalidates backend client/catalog
→ next capability request reconnects to Runtime and refetches the catalog
→ AI client continues the same task/chat
```

The backend reconnect above is internal to the Gateway. Gateway normalizes the result with `client_reconnect_required=false` and `new_chat_required=false`; normal AI-client use does not manually reconnect. Direct Runtime clients used for debug/conformance bypass this protection.

## Reliability Invariants

- Gateway startup does not require Blockbench to be open.
- Blockbench/plugin reload does not terminate the Gateway process.
- Runtime health is checked before catalog-dependent operations.
- Changed Runtime build/profile/stage invalidates cached backend catalog.
- Backend calls are serialized to avoid concurrent editor mutations.
- `tools/call` is never automatically retried after transport interruption.
- Interrupted non-read-only operations return `OUTCOME_UNKNOWN`; inspect current model state before retrying.
- Gateway owns no Cube, Group, texture, animation, Undo, or project state.
- Gateway connects only to localhost/loopback Runtime URLs.
- Native Runtime MCP remains available for Inspector/conformance/debugging.

## Run Locally

From `mcp/`:

```bash
bun run gateway
```

Runtime endpoint default:

```text
http://127.0.0.1:3000/bb-mcp
```

Optional loopback override:

```text
BLOCKIT_RUNTIME_URL=http://127.0.0.1:3000/bb-mcp
```

## AI Client Configuration

Use the Gateway instead of pointing a normal client directly at Blockbench. Use an absolute repository path.

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

A project-scoped client configuration may carry the same command when the repository is trusted. The AI client owns the Gateway process lifecycle; reloading/closing Blockbench does not replace the client-facing MCP process.

## Current Source Surface

```text
Gateway client tools     4
Runtime callable union  52
AUTHORING surface       47
Animation surface       19
```

These are source-owned counts. Exact installed Runtime identity and lifecycle behavior remain verification results in `../docs/knowledge/current-validation.md`.

## Proof Boundary

Source/static tests can prove the fixed Gateway surface, shared AUTHORING routing contract, loopback containment, capability priority, catalog invalidation, and retry semantics. They do not prove the live client survives Runtime lifecycle changes or that authored Geometry/UV/Texture output is visually accepted.

The pending live gate should exercise one continuous task: Runtime offline→online, shared Geometry/Texturing AUTHORING behavior, one AUTHORING↔Animation handoff through Gateway, plugin lifecycle, native authoring/history, and persistence where applicable—without a manual AI-client reconnect or new chat.
