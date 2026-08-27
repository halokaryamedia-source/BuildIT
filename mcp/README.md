# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

## Build / Verify

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin: `dist/blockit_mcp.js`. The filename must match the stable `blockit_mcp` plugin ID. `dist/` is generated output; package version alone is not artifact-freshness proof.

`bun run dev:watch` is build/watch only. Loading or replacing the installed desktop Blockbench plugin is a separate explicit local action. Do **not** use the upstream hosted plugin as runtime authority for this repository; upstream contributors remain credited in package metadata, while BlockIT source/builds come from this repository.

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
default authoring phase      geometry
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The normal Bedrock catalog retains **64 callable tools across authoring phases**. Plugin startup exposes **Core + exactly one authoring phase** so Geometry, Texturing, and Animation work do not overlap. The default **Geometry** surface currently exposes **27 tools**. Phase changes are deliberate handoffs through the `MCP Authoring Phase` setting and require plugin/MCP reload.

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
retained Bedrock callable catalog  64 tools
default Geometry exposure           27 tools
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,000 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
runtime workflow prompt             < 7,000 characters
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
scripts/      verification/measurement utilities
tests/        contract/integration regressions
docs/         generated API documentation
```

Generated API/prompt artifacts follow source generators and must never be hand-edited as the implementation.

## Proof Boundary

Current continuation lives in `../docs/knowledge/next-action.md`; proof history/current evidence lives in `../docs/foundation/validation-report.md`. Source or CI success does not by itself prove live Blockbench rendering, visual fidelity, playback, or current installed-plugin behavior.
