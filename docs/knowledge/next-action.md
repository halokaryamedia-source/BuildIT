# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T4_CI_VERIFIED
TEXTURING_T5_IMPLEMENTED_CI_UNVERIFIED
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

Active texturing skill + runtime prompt require a **Texture Design Contract** before production pixels:

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

Authoring follows:

```text
MAP
→ BASE PASS
→ VALUE / FORM PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
→ VERIFY atlas + model-view evidence
```

T4 reuses T2 mapped state and T3 bounded authoring instead of mentally re-deriving atlas coordinates. Noise-first painting is rejected. Local mismatch taxonomy is:

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

Repeated failure of the same causal correction direction without new evidence stops as `BLOCKED`. Do not mark T5 CI VERIFIED until an exact terminal workflow proof is available.

Regression owners:
- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`
- `mcp/tests/texture-visual-convergence.test.ts`

Primary texturing commits:

```text
4ec722f61a00dfcb4e9fda67320ee28feacf31ee  T0/T1
15053e75cf594a74cccef68878a16d1d1cd07ce6  T2
d7fed4b26c7079e4d82e757f37fd35eca99a9474  T3
b88147ba78c457f6b010aa9181ebdcf66f9b0af1  T3 type closure
07e2b0981fcb300e6640aca98978bcab06fe91ad  T4 design contract
247d380df138c4678c6b83ca70078773e438f1a8  T4 final invariant closure
392892025126ac63e82e6485fead2275ee18f55b  T5 convergence contract
```

Final T4 proof:
- MCP Verify `32065026451` — typecheck, contract tests, 63-tool surface, production build, docs freshness PASS.
- Repository Verify `32065026419` — repository routing/policy PASS.

This remains **source/CI proof only** for T0–T4 and **source implementation only** for T5. Actual desktop Painter behavior, UV persistence, and visual texture quality remain LOCAL PROOF REQUIRED when materially claimed.

## Professional Sample Research Context

A prior forensic study exists in Git history at commit `fd7b0e7e3286fc9b198b14a619abd733e831702c` (`professional-sample-forensic-audit-2026-08-13.md`). It analyzed nine supplied professional `.bbmodel` assets and established useful evidence around Box UV, explicit `uv_offset`, `mirror_uv`, logical-vs-bitmap resolution, material/atlas choices, geometry ownership, and animation patterns.

The original `.bbmodel` sample files are **not present in the current `Local` or `main` tree**; only the learned policy/source changes survive. Do not assume those original assets are available.

## Current Repository Closure

```text
U7  No change required — no speculative profile/router/runtime-prompt redesign without installed-client evidence
```

Protected production gaps remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Next Step — WAIT FOR USER-SUPPLIED TEXTURING SAMPLES

**Do not start local/runtime testing yet.** The user will move to a new chat and provide professional Blockbench sample files for a deeper texturing study.

On receipt of those samples, first perform a **read-only forensic texturing audit** before proposing implementation changes. Study the supplied `.bbmodel` data and available texture assets for evidence such as:

```text
UV mode / authored atlas layout / uv_offset / mirror reuse
logical UV resolution vs physical bitmap dimensions
palette hierarchy and color-family structure
material zones and part separation
face-aware value/shading language
pixel clustering vs random noise
seam continuity and pattern direction
identity-critical markings
detail density and readable Minecraft pixel scale
texture variants / shared atlas layouts
PBR or material_instance usage when actually present
```

Compare the new evidence against the historical nine-sample forensic findings and current **T0–T5 texturing architecture**. Extract only generalizable professional patterns.

Decision rule after the audit:

```text
sample evidence
→ identify concrete remaining texturing weakness
→ map it to T2/T3 runtime, T4 design reasoning, or T5 convergence
→ propose the smallest evidence-backed improvement
```

Do **not** turn samples into presets, asset-specific recipes, fixed atlas templates, material-count rules, generic auto-texture generators, quality scores, or new runtime profiles. Do not expand geometry/animation scope unless required to interpret the texture evidence.

Experimental remains paused unless explicitly reopened.
