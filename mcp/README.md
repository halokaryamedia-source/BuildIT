# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Current repository state:

```text
PRELOCAL_CONTROLLER_MUTATION_READY
```

The source contract includes the completed pre-local optimization closure plus one bounded AnimationController mutation tool. The exact plugin artifact loaded by Blockbench, current runtime behavior, controller execution, runtime call efficiency, persistence, and current model-quality results remain **LOCAL PROOF REQUIRED**.

**Local acceptance is currently deferred.** Do not activate runtime/local proof merely because the repository is static-ready.

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

During iteration, use the smallest relevant check first. GitHub `MCP Verify` automatically runs the full gate only for executable/config changes on `Local`; MCP Markdown, generated docs, and unrelated repository documentation do not trigger it. Superseded runs are cancelled, and a deliberate full check remains available through `workflow_dispatch`.

Verification is read-only. Publishing or refreshing a distributable bundle is an explicit/manual release action; it must not be implemented as a push-triggered workflow that commits and pushes back into the working branch.

Production plugin: `dist/mcp.js`. `dist/` is generated output; package version alone is not artifact-freshness proof.

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The server is loopback-only and request-owned/stateless. The default Bedrock Entity surface is **63 enabled tools**.

## AnimationController Mutation

`manage_animation_controller` is one default experimental capability inside the existing animation family. It does **not** create a new registration profile or controller framework.

One call can create a controller or coherently mutate up to 32 ordered operations covering:

```text
controller rename
state add/update/remove
initial-state selection
transition add/update/remove
animation-link add/update/remove
state on_entry / on_exit
scalar blend_transition / shortest-path flag
```

The tool preflights the complete plan before native mutation, applies one `animation_controllers` Undo unit, rolls back an unexpectedly failed apply, and returns the controller identity plus affected state/created IDs. Reuse that returned state; do not immediately call `inspect_animation` unless additional detail is genuinely needed.

`inspect_animation` remains read-only. Controller runtime/in-game execution is not proved by source mutation success.

## Local Acceptance — Inactive

The single procedure owner is `../docs/knowledge/operations/local-acceptance-runbook.md`. It is not an active next step until `../docs/knowledge/next-action.md` explicitly reactivates it after a fresh user instruction.

When reactivated, Test 1 includes representative controller create/mutate/inspect in addition to existing core mechanics; Test 2 remains the approved elephant reference model.

## Bedrock Product Boundary

Normal capability includes Cube/Group authoring, bounded observation, texture/Painter/PBR/material instances, Bedrock animation with Molang transform strings, bounded new-animation sound events, AnimationController/state inspection and state-machine mutation, Locator/Null Object state, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Protected gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Usage Discipline

Normal asset authoring routes from intent + known state + current stage to the exact tool. Reuse fresh returned state instead of ritual rediscovery.

```text
known target/tool → execute directly
unknown/stale identity → focused discovery only
known coherent Cubes → place_cube(elements=[...])
coherent controller edit → one manage_animation_controller batch
controller returned state → reuse; inspect only if more detail is needed
geometry → modelling specialist
texture/PBR → texturing specialist
animation → animation specialist
```

Do not broad-search repository source for ordinary asset authoring, inspect every newly placed Cube, capture after every mutation, or use disabled/generic fallback capability to hide an unsupported gap.

## Surface Guard

```text
63 enabled tools
initialize instructions          <= 700 characters
tools/list response              <= 80,500 characters
input schemas                    <= 56,500 characters
descriptions                     <= 11,500 characters
max per-tool payload             <= 3,200 characters
runtime workflow prompt          < 7,000 characters
```

`measure:surface` prints exact current serialized counts. The controller closure keeps the previous `3,200` max-per-tool ceiling instead of relaxing it for a large schema. Serialized characters are not installed-client token measurements.

## Source Layout

```text
index.ts      plugin entry/lifecycle
server/       MCP transport/tools/resources/prompts
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      runtime workflow + source-only maintainer notes + generated manifest
build/        build/docs/manifest tooling
scripts/      verification/measurement utilities
tests/        contract/integration regressions
docs/         generated API documentation
```

Generated `docs/api.json`, `docs/index.html`, and `prompts/manifest.json` are secondary to source and freshness-controlled.

Do **not** use the upstream hosted plugin as BlockIT proof. Do not add compatibility shims, duplicate controller tools, new router/profile layers, generic import/eval capability, or another testing framework without a proved need.
