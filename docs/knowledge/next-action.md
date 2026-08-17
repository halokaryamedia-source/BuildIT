# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T2_CI_VERIFIED
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

Audit found the main texturing bottleneck in Painter correctness, UV observability, and the lack of a semantic Cube/face → UV region authoring bridge.

**T0 Painter contract correctness — CI VERIFIED**

- direct Painter stroke tools now rely on Blockbench's native Painter lifecycle for Undo instead of nesting manual Undo around native strokes;
- `paint_with_brush` applies brush size/opacity/softness/shape/blend mode and honors connected versus separated stroke semantics;
- `eraser_tool` follows the same bounded native stroke path;
- coordinate-driven brush/eraser calls reject empty coordinate work;
- unsupported synthetic fill `tolerance` fails closed instead of being silently ignored.

**T1 UV observability — CI VERIFIED**

`inspect_element` Cube output includes focused authored UV state:

```text
uv.mode
uv.box_uv
uv.uv_offset
uv.autouv
uv.mirror_uv
uv.faces.{north,south,east,west,up,down}.uv
uv.faces.*.rotation
uv.faces.*.enabled
```

**T2 semantic UV/face layout bridge — CI VERIFIED**

`inspect_element` now maps each enabled Cube face from authored UV space to effective texture pixel space without adding another MCP tool. The default Bedrock surface remains 63 tools.

For a mapped face the focused result now exposes:

```text
uv.texture_space.state
uv.texture_space.effective_texture
uv.faces.*.mapping_state
uv.faces.*.paintable
uv.faces.*.texture_pixels.corners
uv.faces.*.texture_pixels.rect
uv.faces.*.texture_pixels.size
uv.faces.*.texture_pixels.flip_u
uv.faces.*.texture_pixels.flip_v
```

The mapping follows Blockbench Painter's native texture-space factors (`texture.width / texture.getUVWidth()` and `texture.display_height / texture.getUVHeight()`), preserves reversed UV orientation, and returns ordered floor/ceil pixel bounds ready for deterministic region authoring. No texture, texture load errors, disabled faces, and animated textures fail closed into explicit mapping states instead of guessing paint coordinates.

Regression owner: `mcp/tests/texture-authoring-contract.test.ts`.

Primary texturing commits:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee
fix(texturing): align Painter strokes and expose UV state

15053e75cf594a74cccef68878a16d1d1cd07ce6
feat(texturing): map Cube faces to texture pixels
```

MCP Verify run `32054804760` verified T0/T1. MCP Verify run `32056911088` verified T2. Both passed typecheck, contract tests, default MCP surface measurement, production build, and generated docs freshness.

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

Continue core MCP texturing with **T3 — deterministic bounded region/pixel authoring**.

Target direction:

```text
known Cube/face identity
→ reuse inspect_element texture pixel mapping
→ choose an explicit bounded region operation
→ mutate only that mapped region
→ return exact affected texture-space bounds
→ verify fresh atlas/model evidence when visual quality is claimed
```

Do not build a generic auto-texture generator yet. T3 should close deterministic region mutation first; texture design reasoning/prompt improvements and visual convergence remain later stages.

Experimental remains paused unless the user explicitly reopens it.
