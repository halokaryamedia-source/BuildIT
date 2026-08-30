# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`package.json` owns verifier composition. Use `verify:repository` for repository/static contracts, `verify:authoring` for authoring-policy contracts, `verify:mcp` for executable/public MCP changes, and `verify:release` for the `main` release boundary. During iteration, run only the smallest targeted test or primitive command that can falsify the change.

Production plugin: `dist/blockit_mcp.js`. The filename must match the stable `blockit_mcp` plugin ID. `dist/` is generated output; package version alone is not artifact-freshness proof.

`bun run build` embeds a deterministic SHA-256 `build_identity` into the production bundle. When the desktop plugin is running, `bun run verify:stateless-local` compares that exact local bundle identity, expected profile/phase, and live `tools/list`. It does not replace the later fresh-client or visual acceptance gates.

## Local Development Loop

`bun run typecheck` remains the authoritative TypeScript check. TypeScript reuses ignored local state at `mcp/.cache/tsconfig.tsbuildinfo` on repeated runs; CI starts from a clean checkout, so the same command remains a cold authoritative gate there. Use `bun run typecheck:profile` only when compiler timing itself needs diagnosis.

```bash
bun run dev:watch
```

Watch mode builds once, then observes only production runtime inputs (`index.ts`, runtime source directories, icon/about assets, and the canonical Bedrock workflow prompt). Tests, generated docs, caches, and unrelated package files do not trigger plugin rebuilds. Editing `prompts/bedrock_entity_workflow.md` regenerates `prompts/manifest.json` before the plugin rebuild so the running artifact cannot silently lag the canonical prompt. Restart watch mode after changing build tooling, dependencies, or package metadata.

Installing the built artifact remains explicit. To copy the exact production bundle into a known local Blockbench plugin file:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

The destination must be an existing directory plus an absolute file path ending in `blockit_mcp.js`. `BLOCKIT_PLUGIN_PATH` may be used instead of the positional path. The helper builds first, copies exact bytes, verifies the embedded `build_identity`, prints the deployed identity, and **does not** reload Blockbench or reconnect the MCP client automatically. Reload/reconnect explicitly, then run `bun run verify:stateless-local` when live proof is required.

Do **not** use the upstream hosted plugin as runtime authority for this repository; upstream contributors remain credited in package metadata, while BlockIT source/builds come from this repository.

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
default authoring phase      geometry
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The normal Bedrock catalog retains **65 callable tools across authoring phases**. Plugin startup exposes **Core + exactly one authoring phase** so Geometry, Texturing, and Animation work do not overlap. The default **Geometry** surface currently exposes **28 tools**. Phase changes are deliberate handoffs through the `MCP Authoring Phase` setting and require BlockIT MCP reload plus client reconnect.

```text
CORE + GEOMETRY
or
CORE + TEXTURING
or
CORE + ANIMATION
```

Geometry owns rig and UV Layout mutation. Texturing may inspect UV state but must hand back to Geometry when UV/geometry requires correction. Animation likewise hands structural rig changes back to Geometry.

## Current Capability

Normal source capability includes:

- Cube placement/correction with coherent `place_cube(elements=[...])` batching;
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
known target/tool → execute directly
unknown/stale identity → focused discovery only
fresh mutation result → reuse it
known coherent Cubes → one place_cube(elements=[...]) call
known coherent Groups → one add_group(groups=[...]) call
visual correction → affected view(s) first
phase boundary crossed → switch phase instead of borrowing another phase's mutation tools
same causal failure twice without new evidence → BLOCKED
```

Do not broad-search source for ordinary asset authoring, inspect every new Cube, capture after every mutation, or add fallback/profile/framework layers to hide an unsupported gap.

## Surface Guard

```text
retained Bedrock callable catalog  65 tools
default Geometry exposure           28 tools
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,500 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
runtime workflow prompt             < 9,000 characters
```

`authoring-phase-surface.test.ts` owns the phase-exposure contract. `measure:surface` remains the catalog/static payload guard. Character counts are regression ceilings, not installed-client token measurements.

## Source Layout

```text
index.ts      plugin entry/lifecycle
server/       transport/tools/resources/prompts
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement/local-deploy utilities
tests/        contract/integration regressions
docs/         generated API documentation
```

Generated API/prompt artifacts follow source generators and must never be hand-edited as the implementation.

## Proof Boundary

Current continuation lives in `../docs/knowledge/next-action.md`; current proof interpretation lives in `../docs/knowledge/current-validation.md`. Source or CI success does not by itself prove live Blockbench rendering, visual fidelity, playback, or current installed-plugin/client behavior.
