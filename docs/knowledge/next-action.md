# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T1_CI_VERIFIED
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5**. Current production source retains bounded AnimationController mutation and the existing 63-tool default Bedrock surface.

Installed-plugin freshness, live controller execution, current desktop Blockbench/model behavior, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.

**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof; CI/source proof below does not upgrade visual fidelity.**

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

`inspect_element` Cube output now includes focused authored UV state:

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

Regression owner: `mcp/tests/texture-authoring-contract.test.ts`.

Primary implementation commit:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee
fix(texturing): align Painter strokes and expose UV state
```

MCP Verify run `32054804760` passed typecheck, contract tests, default MCP surface measurement, production build, and generated docs freshness.

This is **source/CI proof only**. Actual desktop Painter behavior, Undo behavior, UV persistence, and visual texture quality remain LOCAL PROOF REQUIRED when materially claimed.

## Current Repository Closure

Production source still retains:

- bounded `manage_animation_controller` state-machine mutation;
- one native controller Undo transaction per coherent batch;
- complete plan preflight before mutation;
- compact continuation state;
- existing protected capability gaps.

Protected production gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Next Step

Continue core MCP texturing with **T2 — semantic UV/face layout authoring**.

Target direction:

```text
known Cube/face identity
→ inspect authored UV layout
→ map intended material/marking to exact face/UV region
→ bounded deterministic region/pixel operation
→ fresh atlas/model visual verification
```

Do not build a generic auto-texture generator yet. Close the semantic face/region bridge first, then improve the texturing skill/prompt and visual convergence loop.

Experimental remains paused unless the user explicitly reopens it.
