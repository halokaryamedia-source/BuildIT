# Next Action

Updated: 2026-08-14

Root `AGENTS.md` owns routing; `flow.md` owns detailed sequence; `docs/foundation/validation-report.md` owns proof state.

## Status

```text
REFERENCE_MINECRAFT_FIRST_FIVE_PREVIEW_STATIC_VERIFIED
```

Working branch: **`Local` only**. `NO LOCAL RUN ACTIVE`.

**Do not claim live Blockbench/model-quality improvement without actual runtime proof.**

Retained state: **P0–P7 + REF + PRO-1, PRO-2, PRO-3–PRO-8**. No MCP source capability was added or removed.

## Current Reference Contract

The reference goal is no longer exact reconstruction. It is a **recognizable, Minecraft-appropriate, Blockbench-buildable Geometry + Texture reference**.

```text
SOURCE + USER INTENT
→ MINECRAFT-FIRST GEOMETRY + TEXTURE
→ FIVE-PREVIEW COVERAGE BOARD
   UPPER: SIDE | FRONT | BACK
   LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
→ minor drift allowed
→ material contradiction blocks
→ USER APPROVAL
```

Five previews provide broad modelling evidence, not five exact technical drawings. Geometry prioritizes major recognizable form, topology/attachment, negative spaces, and Blockbench buildability. Texture prioritizes Minecraft-readable palette/material regions/part separation/identity-critical markings rather than pixel-perfect copying.

Downstream MCP uses discrepancy triage:

```text
MINOR
→ choose ONE CANONICAL MINECRAFT INTERPRETATION
→ explicit user requirement
→ original Source evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable interpretation
→ continue consistently

MATERIAL
→ CONFLICTING / BLOCKED
```

Minor curl/angle/contour/overlap/shade/marking drift is not a blocker by itself. Do not average drift. Material conflicts remain blockers, and cross-view regression remains rejected.

These are generic reference rules, not elephant/quadruped presets.

## Current Candidate / Evidence

The current elephant Source Image remains source authority. The previous three-preview result demonstrated that a non-identical but Minecraft-buildable interpretation can be acceptable, but **no five-preview board has yet been generated and approved under the new contract**.

## Execution / Proof Boundary

```text
hardening / audit / docs / CI
→ STOP AND REPORT
→ WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

CI or this file never authorizes image generation. Future generated-image quality, installed-plugin freshness, runtime MCP exposure, P5–P7 model-facing effectiveness, and final visual quality remain `LOCAL PROOF REQUIRED` where applicable.

## Next Step

```text
WAIT — DO NOT GENERATE
→ WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

When explicitly requested, generate one fresh five-preview reference using the current Source Image and evaluate it with Minecraft-first Geometry + Texture criteria. Do not start Blockbench/Codex local acceptance before a future reference is explicitly approved. After approval, prepare a fresh `Local` build of `mcp/dist/mcp.js` and record exact HEAD + artifact hash before local acceptance.
