# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** authoring workspace built around a local Blockbench MCP Runtime and a stable AI-client-facing Gateway.

**Project snapshot:** `v0.1` (separate from the MCP package version).

## Branch Model

```text
Local  → active development / working authority
main   → stable / release authority; changes only by explicit promotion
```

Routine repository development uses `Local`. Repository behavior is routed by `AGENTS.md`; GitHub execution/history/CI rules are owned by `GITHUB_RULES.md`.

## Canonical Product Flow

```text
ChatGPT reference
→ Active Workspace + Requirement Gate
→ user selects Geometry Strategy: DIRECT | 3D_ASSISTED
→ Geometry
→ user approve + checkpoint
→ UV Layout PASS
→ Texturing
→ user approve + checkpoint
→ Animation when required
→ user approve + checkpoint
→ Finalization
→ final .bbmodel save
```

The approved image is visual authority. Requested dimensions are numeric authority. The AI authoring client never infers, defaults, or auto-switches Geometry Strategy.

### DIRECT

Normal reference-guided Blockbench Geometry using the Geometry specialist and Runtime capabilities.

### 3D_ASSISTED

One production package:

```text
Approved Reference
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction (Hunyuan3D v1)
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ dedicated atomic Cuboid Materialization
→ Semantic Geometry Cleanup
→ normal UV Layout / Texturing / optional Animation
```

The external orchestrator, canonical state/decomposition contracts, and dedicated materializer capability are source-implemented. GPU inference quality, installed materializer identity/native Undo behavior, and end-to-end 3D-Assisted asset quality remain separate local/live proof.

There is no normal GLB-only, PrimitiveAnything-only, provider-selection, or automatic fallback route.

## Current Product Surface

```text
Gateway client surface        4 fixed tools
Source callable union        54 tools
AUTHORING source surface     49 tools
Animation source surface     18 tools
```

Gateway tools are always:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Geometry and Texturing startup focus values resolve to the same shared AUTHORING capability set. AUTHORING↔Animation handoff is Gateway-managed and continues the same task/chat; normal client use does not require a manual MCP reconnect.

Normal authoring has no Standard/Extended profile choice. Internal `extended` remains Legacy UI Fallback compatibility only; `risky_eval` and `from_geo_json` remain disabled.

Installed Runtime counts and lifecycle behavior are proof results, not hand-maintained product facts. See `docs/knowledge/current-validation.md`.

## Evidence Boundary

Static source/CI proof can establish routing, contracts, schemas, deterministic build output, and fail-closed source behavior. It does **not** prove installed Blockbench state, live Gateway survival, visual fidelity, native Undo/playback/persistence, external GPU quality, or end-to-end 3D-Assisted quality.

Current state owners:

- stable project facts → `CONTEXT.md`
- product flow → `docs/knowledge/flow.md`
- repository/plugin continuation → `docs/knowledge/next-action.md`
- current proof state → `docs/knowledge/current-validation.md`
- exact source/tool ownership → `docs/knowledge/implementation-map.md`
- asset continuity → `workspace/README.md`

## Repository Map

```text
.agents/skills/    task/domain specialists loaded only when relevant
docs/foundation/  durable authoring policy
docs/knowledge/   current flow, continuation, source ownership, proof, local procedure
mcp/              Blockbench MCP plugin/runtime/Gateway/build/tests/generated API docs
workspace/        persistent active/saved asset packages
Experimental/     bounded implementation evidence and proof harnesses only
```

Historical audits, retired product paths, obsolete continuation, and old roadmaps belong in Git history rather than parallel current-state owners.

## Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:full
```

Recommended local development sync:

```bash
bun run dev:sync
```

Build/watch without deployment:

```bash
bun run dev:watch
```

Manual deployment remains explicit:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Normal AI-client use connects through the Gateway. See `mcp/gateway/README.md`.

## Contributing

Repository development conventions, verification routing, commit discipline, and transient-file rules are documented in `CONTRIBUTING.md`.

## License

BlockIT is distributed under the GNU General Public License v3.0. See `LICENSE` for the full terms.
