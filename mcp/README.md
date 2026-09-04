# BlockIT — Bedrock Entity MCP

BlockIT uses a stable MCP **Gateway** for normal AI-client connections and a Minecraft **Bedrock Entity-focused** runtime/plugin inside desktop Blockbench. `Local` is the development authority.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`package.json` owns verifier composition. Use `verify:repository` for repository/static contracts, `verify:authoring` for authoring-policy contracts, `verify:mcp` for executable/public MCP changes, and `verify:release` for the `main` release boundary. `verify:mcp` typechecks both the Blockbench runtime and the isolated Gateway project. During iteration, run only the smallest targeted test or primitive command that can falsify the change.

Production plugin: `dist/blockit_mcp.js`. The filename must match the stable `blockit_mcp` plugin ID. `dist/` is generated output; package version alone is not artifact-freshness proof.

`bun run build` embeds a deterministic SHA-256 `build_identity` into the production bundle. When the desktop plugin is running, `bun run verify:stateless-local` compares that exact local bundle identity, expected profile/phase, and live native `tools/list`. It does not replace the later Gateway-stability or visual acceptance gates.

## Local Development Loop

`bun run typecheck` remains the authoritative Runtime TypeScript check; `bun run typecheck:gateway` checks the separate Gateway graph. TypeScript reuses ignored local state at `mcp/.cache/tsconfig.tsbuildinfo` on repeated Runtime checks; CI starts from a clean checkout. Use `bun run typecheck:profile` only when compiler timing itself needs diagnosis.

```bash
bun run dev:watch
```

Watch mode builds once, then observes only production runtime inputs (`index.ts`, runtime source directories, icon/about assets, and the canonical Bedrock workflow prompt). Tests, generated docs, caches, Gateway source, and unrelated package files do not trigger plugin rebuilds. Editing `prompts/bedrock_entity_workflow.md` regenerates `prompts/manifest.json` before the plugin rebuild so the running artifact cannot silently lag the canonical prompt. Restart watch mode after changing build tooling, dependencies, or package metadata.

Installing the built artifact remains explicit. To copy the exact production bundle into a known local Blockbench plugin file:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The destination must be an existing directory plus an absolute file path ending in `blockit_mcp.js`. `BLOCKIT_PLUGIN_PATH` may be used instead of the positional path. The helper builds first, copies exact bytes, verifies the embedded `build_identity`, prints the deployed identity, and **does not** reload Blockbench automatically. Reload the plugin when needed; a normal Gateway client stays connected and refreshes its Runtime backend lazily. A client connected directly to the native Runtime endpoint is a debug/conformance path and may need its own refresh.

Do **not** use the upstream hosted plugin as runtime authority for this repository; upstream contributors remain credited in package metadata, while BlockIT source/builds come from this repository.

## Client Boundary / Runtime Containment

```text
normal client boundary          stdio Gateway (`bun run gateway`)
Gateway public surface          4 stable tools
runtime/debug endpoint          http://127.0.0.1:3000/bb-mcp
default runtime profile         Standard MCP Profile
default authoring phase         geometry
Extended MCP Profile            OFF
risky_eval                      disabled
from_geo_json                   disabled
```

The normal Bedrock Runtime catalog retains **51 callable tools across authoring phases**. The plugin exposes **Core + exactly one authoring phase**; the default native **Geometry** surface currently exposes **25 tools**. Normal AI clients do not consume that changing native `tools/list` directly. The Gateway keeps a fixed client surface:

```text
status
search_capabilities
describe_capability
invoke_capability
```

A phase change through `switch_authoring_phase` invalidates the Gateway's Runtime connection/catalog and the next capability request refreshes it automatically. The Codex-facing Gateway process and chat remain alive. Direct native MCP clients used for debugging/conformance bypass this protection and may need to refresh their own `tools/list`.

```text
RUNTIME: CORE + GEOMETRY
or
RUNTIME: CORE + TEXTURING
or
RUNTIME: CORE + ANIMATION
```

Geometry owns rig and UV Layout mutation. Texturing may inspect UV state but must hand back to Geometry when UV/geometry requires correction. Animation likewise hands structural rig changes back to Geometry.

## Current Capability

Normal Runtime source capability includes:

- Cube placement/correction with coherent `manage_cubes(operation=create|update|batch_update)` batching;
- Group/bone creation including coherent `add_group(groups=[...])` batching;
- project creation with logical UV resolution `128` by default and explicit `256` opt-in;
- texture/Painter/PBR/material-instance authoring;
- Bedrock animation with numeric/Molang values, existing-animation effects, controller state-machine and state-effect mutation;
- Locator/Null Object lifecycle;
- Undo/history;
- editable `.bbmodel` persistence and Bedrock geometry export.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Usage Discipline

```text
known current capability → invoke directly
unknown/stale capability → focused Gateway search/describe
fresh mutation result → reuse it
known coherent Cubes → one manage_cubes(operation=create, elements=[...]) call
known coherent Groups → one add_group(groups=[...]) call
visual correction → affected view(s) first
phase boundary crossed → switch Runtime phase; Gateway client stays alive
same causal failure twice without new evidence → BLOCKED
```

Do not broad-search source for ordinary asset authoring, inspect every new Cube, capture after every mutation, or add fallback/profile/framework layers to hide an unsupported gap.

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

`gateway-contract.test.ts` owns the fixed Gateway boundary and recovery invariants. `authoring-phase-surface.test.ts` owns native phase-exposure correctness. `measure:surface` remains the full callable-catalog/static payload guard. `measure:phases` measures source-owned Core + active-phase native `tools/list` payloads over the loopback Runtime transport. These are static/source measurements: none is installed-client token usage or Authoring Efficiency proof.

## Live Geometry E2E

After building, explicitly deploying/reloading BlockIT, and confirming Geometry is active, the disposable live verifier can prove the basic native authoring path:

```bash
bun run verify:stateless-local
bun run verify:geometry-live -- --confirm-disposable
```

`verify:geometry-live` intentionally replaces/discards the active Blockbench project, then checks create → Group/Cube authoring → exact readback → fixed-frame render change → Undo → Redo. It leaves the disposable project open. Passing this gate proves those live Runtime effects only; it does **not** prove the separate Codex-facing Gateway reload-survival gate, score visual similarity, or establish accepted model quality.

## Source Layout

```text
gateway/      stable client boundary + Runtime adapter
index.ts      Blockbench plugin entry/lifecycle
server/       Runtime transport/tools/resources/prompts
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement/local-deploy utilities
tests/        contract/integration regressions
docs/         generated Runtime API documentation
```

Generated API/prompt artifacts follow source generators and must never be hand-edited as the implementation.

## Proof Boundary

Current continuation lives in `../docs/knowledge/next-action.md`; current proof interpretation lives in `../docs/knowledge/current-validation.md`. Gateway source/static contracts can pass without proving that a real Codex process survives repeated Blockbench reload/close/open cycles. Source or CI success also does not by itself prove live Blockbench rendering, visual fidelity, playback, or current installed-plugin behavior.
