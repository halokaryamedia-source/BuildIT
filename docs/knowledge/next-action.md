# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T3_CI_VERIFIED
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5**. Current production source retains bounded AnimationController mutation and the existing 63-tool default Bedrock surface.

Installed-plugin freshness, live controller execution, current desktop Blockbench/model behavior, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.

**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof; the Experimental browser proof below does not upgrade desktop MCP claims.**

## Active Boundary

Repository/plugin continuation is source-first:

```text
current user instruction
→ current source + relevant proof
→ AGENTS.md + GITHUB_RULES.md
→ this continuation owner when current work is resumed
```

Local acceptance remains explicitly deferred. `docs/knowledge/operations/local-acceptance-runbook.md` is inactive until a fresh explicit user instruction reactivates it.

Reference generation remains execution-gated:

```text
WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

### Experimental research — PAUSED BY USER

`Experimental/README.md` retains the verified **On-Demand Blockbench Web Authoring** proof contract, but further Experimental development/execution is paused until a fresh explicit user instruction resumes it.

```text
PAUSED BY USER
CUBE POC VERIFIED
DATA-ONLY AUTHORING POC VERIFIED
CHATGPT VISUAL LOOP VERIFIED
NOT PRODUCTION
```

Do not edit/run `Experimental/**`, continue the correction loop, or add new Experimental capability while this pause is active.

### Development reliability — COMPLETE

R1 Write Safety, R2 Verification Quality, R3 CI Efficiency, R4 Proof Reliability, and R5 Supply Chain are complete and retained. Active verification workflows keep audited Actions pinned by immutable SHA; Bun uses exact `.bun-version` plus committed `mcp/bun.lock` with `bun install --frozen-lockfile`.

Experimental supply-chain hardening remains deferred while Experimental is paused.

### Core MCP texturing — ACTIVE

Audit found the main texturing bottleneck in Painter correctness, UV observability, semantic Cube/face → UV mapping, bounded mutation, and higher-level texture-design reasoning.

**T0 Painter contract correctness — CI VERIFIED**

- native Painter stroke tools use Blockbench's Painter lifecycle without nested Undo;
- brush size/opacity/softness/shape/blend mode and connected/separated strokes are honored;
- empty coordinate work is rejected;
- unsupported synthetic fill `tolerance` fails closed.

**T1 UV observability — CI VERIFIED**

`inspect_element` Cube output includes authored UV mode/offset/mirroring plus all six per-face UV rectangles, rotations, and enabled state.

**T2 semantic UV/face layout bridge — CI VERIFIED**

`inspect_element` maps each enabled Cube face from authored UV space to effective texture pixel space without adding another MCP tool. It exposes explicit mapping state, effective texture identity, ordered pixel `rect`/`size`, original mapped corners, and `flip_u`/`flip_v`. Mapping follows Blockbench Painter's native texture-space factors. No texture, texture error, disabled face, and animated texture states fail closed instead of guessing coordinates.

**T3 deterministic bounded region/pixel authoring — CI VERIFIED**

No new MCP tool was added; the default Bedrock surface remains 63 tools.

- `draw_shape_tool` normalizes an explicit integer pixel rectangle, converts that rectangle back to the matching UV tag, and passes the UV tag through native Blockbench Painter so rectangle/ellipse authoring is clipped to the declared texture region;
- bounded shape authoring fails closed while mirror painting is enabled because mirrored writes could escape the reported bounds;
- the result reports exact `affected_rect` and `affected_size`;
- `paint_with_brush` keeps its normal native Painter path, but uses a deterministic exact-pixel fast path only for explicit safe requests: integer coordinates, 1px square brush, opacity 255, softness 0, explicit default blend mode, separated points, mirror off, alpha lock off, and erase mode off;
- the exact-pixel path validates texture/layer bounds before mutation, uses one Undo transaction, and reports exact affected bounds;
- a narrow `Texture.edit` runtime overload is declared in `mcp/types.d.ts` because official Blockbench runtime passes the Painter edit environment as a second callback argument while the published `blockbench-types` declaration exposes only the first argument.

Regression owner: `mcp/tests/texture-authoring-contract.test.ts`.

Primary texturing commits:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee
fix(texturing): align Painter strokes and expose UV state

15053e75cf594a74cccef68878a16d1d1cd07ce6
feat(texturing): map Cube faces to texture pixels

d7fed4b26c7079e4d82e757f37fd35eca99a9474
feat(texturing): add bounded pixel authoring

b88147ba78c457f6b010aa9181ebdcf66f9b0af1
fix(types): align Texture.edit runtime callback
```

MCP Verify runs `32054804760`, `32056911088`, and final T3 run `32060431079` passed their required typecheck, contract tests, default MCP surface measurement, production build, and generated docs freshness gates.

This is **source/CI proof only**. Actual desktop Painter behavior, Undo behavior, UV persistence, and visual texture quality remain LOCAL PROOF REQUIRED when materially claimed.

## Current Repository Closure

Production source still retains:

- bounded `manage_animation_controller` state-machine mutation;
- one native controller Undo transaction per coherent batch;
- complete plan preflight before mutation;
- compact continuation state;
- existing protected capability gaps.

```text
U7  No change required — no speculative profile/router/runtime-prompt redesign without installed-client evidence
```

Protected production gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Next Step

Continue core MCP texturing with **T4 — texture design reasoning and authoring procedure**.

Target direction:

```text
reference/material intent
→ Texture Design Contract
→ palette + material-zone plan
→ use T2 mapped faces and T3 bounded mutations
→ base pass
→ controlled value/detail pass
→ atlas + model-view evidence
```

T4 should improve the active texturing skill/runtime guidance so the agent reasons about palette hierarchy, face-aware shading, material readability, UV continuity, and controlled detail instead of merely selecting Painter tools. Do not build a generic auto-texture generator yet; visual convergence remains a later stage.

Experimental remains paused unless the user explicitly reopens it.
