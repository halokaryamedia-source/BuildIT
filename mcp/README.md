# BlockIT — Bedrock Entity MCP

Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Current repository state:

```text
PRELOCAL_CONTROLLER_MUTATION_READY
```

The source contract includes the completed pre-local optimization closure, bounded AnimationController state-machine mutation, existing-animation particle/sound/timeline effect mutation, controller-state particle/sound lifecycle, and animation-level `anim_time_update` / `blend_weight` mutation. The current source surface expects 64 enabled tools. Canonical CI/build/generated-doc freshness for this 64-tool state is still pending; the exact plugin artifact loaded by Blockbench, runtime behavior, controller execution, runtime call efficiency, persistence, and current model-quality results remain **LOCAL PROOF REQUIRED**.

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

Production plugin: `dist/mcp.js`. `dist/` is generated output; package version alone is not artifact-freshness proof.

## Endpoint / Containment

```text
endpoint                     http://127.0.0.1:3000/bb-mcp
default profile              bedrock_entity
Extended MCP Families        OFF
risky_eval                   disabled
from_geo_json                disabled
```

The server is loopback-only and request-owned/stateless. The current source default Bedrock Entity surface is **64 enabled tools**; `measure:surface` must confirm that exact final surface before canonical PASS is claimed.

## Animation Mutation

`manage_animation_controller` remains one bounded experimental capability inside the existing animation family. One call can create a controller or coherently mutate up to 32 ordered operations covering controller/state/transition/animation-link ownership plus state particle/sound lifecycle.

`manage_animation_effects` owns existing authored Animation particle, sound, and timeline effect add/update/remove using inspected keyframe/data-point identity, bounded collision/no-op preflight, and one Undo transaction.

`animation_timeline` also owns animation-level `anim_time_update` and `blend_weight` mutation while preserving authored Molang text without evaluating it.

These capabilities stay inside the existing animation registration family; they do **not** create a new registration profile, controller framework, generic evaluator, or UI fallback. `inspect_animation` remains the read owner. Source mutation success does not prove live controller/game execution.

## Local Acceptance — Inactive

The single procedure owner is `../docs/knowledge/operations/local-acceptance-runbook.md`. It is not an active next step until `../docs/knowledge/next-action.md` explicitly reactivates it after a fresh user instruction.

When reactivated, Test 1 includes representative animation/controller create-mutate-inspect coverage in addition to existing core mechanics; Test 2 remains the approved elephant reference model.

## Bedrock Product Boundary

Normal source capability includes Cube/Group authoring, bounded observation, texture/Painter/PBR/material instances, Bedrock animation with numeric/Molang transform values, new- and existing-animation particle/sound/timeline effects, animation-level timing/blend properties, AnimationController/state inspection and state-machine plus state-effect mutation, Locator/Null Object state, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Usage Discipline

Normal asset authoring routes from intent + known state + current stage to the exact tool. Reuse fresh returned state instead of ritual rediscovery.

```text
known target/tool → execute directly
unknown/stale identity → focused discovery only
known coherent Cubes → place_cube(elements=[...])
coherent controller edit → one manage_animation_controller batch
existing animation effects → manage_animation_effects
controller/effect returned state → reuse; inspect only if more detail is needed
geometry → modelling specialist
texture/PBR → texturing specialist
animation → animation specialist
```

Do not broad-search repository source for ordinary asset authoring, inspect every newly placed Cube, capture after every mutation, or use disabled/generic fallback capability to hide an unsupported gap.

## Surface Guard

```text
64 enabled tools
initialize instructions          <= 700 characters
tools/list response              <= 80,500 characters
input schemas                    <= 56,500 characters
descriptions                     <= 11,500 characters
max per-tool payload             <= 3,200 characters
runtime workflow prompt          < 7,000 characters
```

`measure:surface` prints exact current serialized counts. The animation effect closure keeps the previous `3,200` max-per-tool ceiling instead of relaxing it for a new public tool. Serialized characters are not installed-client token measurements.

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

Generated `docs/api.json`, `docs/index.html`, and `prompts/manifest.json` are secondary to source and freshness-controlled. They are currently pending canonical regeneration for the 64-tool animation source state; do not hand-edit them.

Do **not** use the upstream hosted plugin as BlockIT proof. Do not add compatibility shims, duplicate controller/effect tools, new router/profile layers, generic import/eval capability, or another testing framework without a proved need.
