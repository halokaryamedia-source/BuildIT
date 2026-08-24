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

Production plugin: `dist/mcp.js`. `dist/` is generated output; package version alone is not artifact-freshness proof.

`bun run dev:watch` is build/watch only. Loading or replacing the installed desktop Blockbench plugin is a separate explicit local action.

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The default Bedrock Entity surface contains **64 enabled tools** and remains loopback-only/request-owned/stateless.

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
same causal failure twice without new evidence → BLOCKED
```

Do not broad-search source for ordinary asset authoring, inspect every new Cube, capture after every mutation, or add fallback/profile/framework layers to hide an unsupported gap.

## Surface Guard

```text
64 enabled tools
initialize instructions          <= 700 characters
tools/list response              <= 82,000 characters
input schemas                    <= 58,000 characters
descriptions                     <= 11,500 characters
max per-tool payload             <= 3,200 characters
runtime workflow prompt          < 7,000 characters
```

`measure:surface` owns exact serialized values. Character counts are regression ceilings, not installed-client token measurements.

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
