# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T4_CI_VERIFIED
TEXTURING_T5_IMPLEMENTED_CI_UNVERIFIED
TEXTURING_T6_PRODUCTION_DISCIPLINE_SOURCE_IMPLEMENTED
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5**. Production retains bounded AnimationController mutation and the existing 63-tool default Bedrock surface.

Installed-plugin freshness, live controller execution, current desktop Blockbench/model behavior, persistence, actual runtime/call-efficiency, and visual texture-quality improvement remain **LOCAL PROOF REQUIRED**.

**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof; static/CI proof cannot upgrade that claim.**

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

Active texturing skill + runtime prompt require a **Texture Design Contract** before production pixels and route mapped regions through T2/T3 instead of mentally re-deriving atlas coordinates.

Authoring retains:

```text
MAP
→ BASE PASS
→ VALUE / FORM PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
→ VERIFY atlas + model-view evidence
```

Noise-first painting is rejected. Local mismatch taxonomy remains:

```text
REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY
UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY
```

**T5 texture visual convergence — IMPLEMENTED, CI PROOF NOT YET RECORDED**

Commit `392892025126ac63e82e6485fead2275ee18f55b` adds the difference-first texture convergence contract:

```text
actual approved reference + fresh atlas + affected model views
→ Texture Difference Table
→ smallest bounded correction
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

Repeated failure of the same causal correction direction without new evidence stops as `BLOCKED`.

**T6 professional texture production discipline — SOURCE IMPLEMENTED**

The current user-supplied professional samples were audited read-only and compared against T0–T5. The user explicitly chose a simpler AI-authoring standard instead of reproducing human-authored custom canvas choices.

T6 now requires:

```text
new Bedrock project logical UV baseline = 128×128
production base color = one atlas PNG for the whole model
color PNG = explicit 128-based square canvas; smallest sufficient size
no per-part/Cube/material-zone base-color texture fragmentation
UV / Atlas Gate before production painting
material-family palette ramps
face-aware value/form shading
identity-critical marks before decorative microdetail
hard-pixel Minecraft treatment unless the reference requires softness
flat base color cannot pass when supported form/material/detail evidence exists
```

The existing tool surface is retained. `create_project` now establishes the 128×128 logical UV baseline and returns it as continuation state. No new UV planner, auto-packer, texture generator, quality score, profile, or tool family was added.

Regression owner added:
- `mcp/tests/texture-production-discipline.test.ts`

Existing regression owners remain:
- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`
- `mcp/tests/texture-visual-convergence.test.ts`

Primary retained texturing commits:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee  T0/T1
15053e75cf594a74cccef68878a16d1d1cd07ce6  T2
d7fed4b26c7079e4d82e757f37fd35eca99a9474  T3
b88147ba78c457f6b010aa9181ebdcf66f9b0af1  T3 type closure
07e2b0981fcb300e6640aca98978bcab06fe91ad  T4 design contract
247d380df138c4678c6b83ca70078773e438f1a8  T4 final invariant closure
392892025126ac63e82e6485fead2275ee18f55b  T5 convergence contract
```

Final recorded T4 proof:
- MCP Verify `32065026451` — typecheck, contract tests, 63-tool surface, production build, docs freshness PASS.
- Repository Verify `32065026419` — repository routing/policy PASS.

Actual desktop Painter behavior, UV persistence, single-atlas execution, and visual texture quality remain LOCAL PROOF REQUIRED when materially claimed.

## Professional Sample Research Context

Historical forensic evidence remains in Git history at commit `fd7b0e7e3286fc9b198b14a619abd733e831702c` (`professional-sample-forensic-audit-2026-08-13.md`). A fresh user-supplied sample set was also audited read-only on 2026-08-18 for texture/UV evidence.

Generalizable evidence retained from the studies includes intentional Box-UV placement, explicit `uv_offset`, deliberate mirror/reuse, material-aware palette/value structure, face-aware shading, identity-weighted pixel detail, and the fact that professional quality does not require PBR or maximum atlas packing.

The user's current authoring decision overrides copying sample-specific custom resolutions:

```text
AI production standard → 128 logical baseline + simple 128-based color canvas
existing professional asset → preserve/interpret its authored resolution as evidence
```

Do not turn samples into presets, asset-specific recipes, fixed atlas templates, material-count rules, generic auto-texture generators, quality scores, or runtime profiles.

## Current Repository Closure

```text
U7  No change required — no speculative profile/router/runtime-prompt redesign without installed-client evidence
```

Protected production gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Next Step

Current T6 source must satisfy the normal MCP/repository verification gates. After source verification, **live texture-quality claims still require an explicit local Blockbench texture acceptance run**; do not start that run unless the user explicitly requests it.

Experimental remains paused unless explicitly reopened.
