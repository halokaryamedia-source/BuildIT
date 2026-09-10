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
→ native BlockIT Geometry
→ user approve + checkpoint
→ UV Layout PASS
→ Texturing
→ user approve + checkpoint
→ Animation when required
→ user approve + checkpoint
→ Finalization
→ final .bbmodel save
```

The approved image is visual authority. Requested dimensions are numeric authority. BlockIT now has **one native modelling path**; the retired 3D-assisted/Hunyuan/PrimitiveAnything path is not part of current authoring.

## Current Product Surface

```text
Gateway client surface        4 fixed tools
Active phase-union catalog   54 tools
AUTHORING source surface     47 tools
Animation source surface     20 tools
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

Static source/CI proof can establish routing, contracts, schemas, deterministic build output, and fail-closed source behavior. It does **not** prove installed Blockbench state, live Gateway survival, visual fidelity, native Undo/playback/persistence, or accepted asset quality.

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
Experimental/     bounded research; currently BlockIT Navigator only
```

Historical audits, retired product paths, obsolete continuation, and old roadmaps belong in Git history rather than parallel current-state owners.

## Development

BlockIT source/builds come from this repository; do not use an upstream hosted plugin as runtime authority for this repository. Production plugin: `dist/blockit_mcp.js`.

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
