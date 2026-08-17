# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T4_CI_VERIFIED
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5**. Production retains bounded AnimationController mutation and the existing 63-tool default Bedrock surface.

Installed-plugin freshness, live controller execution, current desktop Blockbench/model behavior, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.

**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof; the Experimental browser proof below does not upgrade desktop MCP claims.**

## Active Boundary

```text
current user instruction
→ current source + relevant proof
→ AGENTS.md + GITHUB_RULES.md
→ this continuation owner when current work is resumed
```

Local acceptance remains explicitly deferred. `docs/knowledge/operations/local-acceptance-runbook.md` is inactive until a fresh explicit user instruction reactivates it.

Reference generation remains:

```text
WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

### Experimental research — PAUSED BY USER

`Experimental/README.md` retains the research proof contract.

```text
PAUSED BY USER
CUBE POC VERIFIED
DATA-ONLY AUTHORING POC VERIFIED
CHATGPT VISUAL LOOP VERIFIED
NOT PRODUCTION
```

Do not edit/run `Experimental/**` or add new Experimental capability while this pause is active.

### Development reliability — COMPLETE

R1 Write Safety, R2 Verification Quality, R3 CI Efficiency, R4 Proof Reliability, and R5 Supply Chain are retained. Active verification Actions remain immutable-SHA pinned; Bun uses exact `.bun-version` + committed `mcp/bun.lock` with `bun install --frozen-lockfile`.

### Core MCP texturing — ACTIVE

**T0 Painter contract correctness — CI VERIFIED**

Native Painter lifecycle owns direct stroke Undo; brush parameters and connected/separated semantics are honored; empty work is rejected; unsupported synthetic fill tolerance fails closed.

**T1 UV observability — CI VERIFIED**

`inspect_element` exposes Cube UV mode/offset/mirroring and all six per-face UV rectangles, rotations, and enabled state.

**T2 semantic UV/face layout bridge — CI VERIFIED**

`inspect_element` maps enabled Cube faces to effective texture pixels with explicit mapping state, effective texture, `rect`/`size`, mapped corners, and `flip_u`/`flip_v`; invalid/animated/disabled states fail closed.

**T3 deterministic bounded region/pixel authoring — CI VERIFIED**

`draw_shape_tool` supports bounded mapped regions and reports exact affected bounds. `paint_with_brush` keeps native behavior plus a narrow exact-pixel path for explicit safe 1px separated writes. No new tool was added.

**T4 texture design reasoning and authoring procedure — CI VERIFIED**

Active texturing skill + runtime prompt now require a **Texture Design Contract** before production pixels:

```text
palette roles
material zones: Cube/face + mapped region
value hierarchy / part separation
face-aware shading language
directional/asymmetric marks + mirror constraints
seam-critical edges / pattern direction
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Authoring now follows:

```text
MAP
→ BASE PASS
→ VALUE / FORM PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
→ VERIFY atlas + model-view evidence
```

T4 explicitly reuses T2 `mapping_state` / `paintable` / `texture_pixels.rect` / `flip_u` / `flip_v` and T3 bounded `draw_shape_tool` / exact-pixel authoring instead of mentally re-deriving atlas coordinates. Noise-first painting is rejected. Local mismatch taxonomy is:

```text
REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY
UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY
```

Regression owners:
- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`

Primary texturing commits:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee  T0/T1
15053e75cf594a74cccef68878a16d1d1cd07ce6  T2
d7fed4b26c7079e4d82e757f37fd35eca99a9474  T3
b88147ba78c457f6b010aa9181ebdcf66f9b0af1  T3 type closure
07e2b0981fcb300e6640aca98978bcab06fe91ad  T4 design contract
247d380df138c4678c6b83ca70078773e438f1a8  T4 final invariant closure
```

Final T4 proof:
- MCP Verify `32065026451` — typecheck, contract tests, 63-tool surface, production build, docs freshness PASS.
- Repository Verify `32065026419` — repository routing/policy PASS.

This is **source/CI proof only**. Actual desktop Painter behavior, UV persistence, and visual texture quality remain LOCAL PROOF REQUIRED when materially claimed.

## Current Repository Closure

```text
U7  No change required — no speculative profile/router/runtime-prompt redesign without installed-client evidence
```

Protected production gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Next Step

Continue core MCP texturing with **T5 — texture visual convergence**.

Target direction:

```text
fresh atlas + model-view evidence
→ difference-first texture table
→ REGION / VALUE / MATERIAL / UV / SEAM / IDENTITY / DENSITY diagnosis
→ smallest bounded correction
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

T5 should improve visual verification/correction discipline, not add a generic auto-texture generator or new runtime profile. Experimental remains paused unless explicitly reopened.
