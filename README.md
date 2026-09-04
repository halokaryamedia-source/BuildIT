# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** authoring workspace built around a local Blockbench MCP Runtime and a stable Codex-facing Gateway.

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
→ Texturing
→ user approve + checkpoint
→ Animation when required
→ user approve + checkpoint
→ Finalization
→ final .bbmodel save
```

The approved image is visual authority. Requested dimensions are numeric authority. Codex never infers, defaults, or auto-switches Geometry Strategy.

### DIRECT

Normal reference-guided Blockbench Geometry using the existing Geometry specialist and Runtime capabilities.

### 3D_ASSISTED

Target production package:

```text
Approved Reference
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction (Hunyuan3D v1)
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ dedicated atomic Cuboid Materialization
→ Semantic Geometry Cleanup
→ normal Texturing / optional Animation
```

`3D_ASSISTED` is **design-locked but not yet production-implemented end-to-end**. There is no normal GLB-only, PrimitiveAnything-only, provider-selection, or automatic fallback route.

## Current Product Surface

```text
Gateway client surface           4 fixed tools
Runtime callable union          51 tools
Geometry native surface         25 tools
Texturing native surface        35 tools
Animation native surface        19 tools
```

Gateway tools are always:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Normal authoring has no Standard/Extended profile choice. Internal `extended` remains Legacy UI Fallback compatibility only; `risky_eval` and `from_geo_json` remain disabled.

## Evidence Boundary

Static source/CI proof can establish routing, contracts, schemas, deterministic build output, and fail-closed source behavior. It does **not** prove installed Blockbench state, live Gateway survival, visual fidelity, Undo behavior, external GPU quality, or end-to-end 3D-Assisted quality.

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

## Local Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

Development watch:

```bash
bun run dev:watch
```

Deployment into desktop Blockbench is explicit:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Normal Codex use connects through the Gateway. See `mcp/gateway/README.md`.

## Contributing

Repository development conventions, verification routing, commit discipline, and transient-file rules are documented in `CONTRIBUTING.md`.

Historical audits, retired product paths, test-model iterations, and obsolete continuation belong in Git history rather than parallel current-state files.

## License

BlockIT is distributed under the GNU General Public License v3.0. See `LICENSE` for the full terms.
