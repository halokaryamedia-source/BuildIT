# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T4_CI_VERIFIED
TEXTURING_T5_IMPLEMENTED_CI_UNVERIFIED
TEXTURING_T6_PRODUCTION_DISCIPLINE_SOURCE_IMPLEMENTED
TEXTURING_T7_T17_DEEP_HARDENING_SOURCE_IMPLEMENTED
TEXTURING_T18_NO_CHANGE_REQUIRED
TEXTURING_FINAL_STATIC_AUDIT_COMPLETE
TEXTURING_CI_TERMINAL_PROOF_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5 + T0–T18 decisions**.

Actual desktop Painter behavior, UV persistence, visual quality, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.
**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof.**
**Experimental browser proof below does not upgrade desktop MCP claims.**


## Active Boundary

```text
current user instruction
→ current source + relevant proof
→ AGENTS.md + GITHUB_RULES.md
→ this continuation owner
```

The user explicitly does **not** plan local testing in the near term. Do not route UV/texture continuation to local acceptance, do not make it the next step, and do not repeatedly recommend it. `docs/knowledge/operations/local-acceptance-runbook.md` remains inactive until a fresh explicit user instruction reactivates it.

`Experimental/**` remains **PAUSED BY USER**.

## MCP Texturing State

T0–T4 retain their recorded CI-verified Painter, UV observation/mapping, bounded pixel authoring, and Texture Design Contract baseline. T5 difference-first visual convergence remains implemented; do not upgrade its CI/runtime status without exact matching proof.

### T6 — production discipline

Retained:

```text
new AI Bedrock logical UV = 128×128
one base-color atlas PNG for the whole model
physical color bitmap = smallest sufficient square 128-based size
UV / Atlas Gate before production pixels
material-family palette ramps
face-aware form shading
identity before decorative microdetail
flat fill cannot pass supported form/material/detail requirements
```

### T7 — atlas lifecycle integrity

`create_texture` now preflights production role before Undo:

```text
base color candidate
→ first atlas only
→ second normal base-color texture rejected

explicit color variant
→ explicit non-material TextureGroup
→ exactly one established base atlas
→ new blank variant matches base bitmap size

PBR support
→ normal / height / MER
→ new blank support texture matches established base bitmap size
```

Imported existing data may preserve authored dimensions. PBR support must belong to a material TextureGroup; non-material groups remain explicit color variants.

### T8 — global atlas / UV observability

`list_textures` now returns structured atlas inventory plus a bounded global UV audit:

```text
texture role / group / PBR channel
default + selected identity
bitmap dimensions
logical UV dimensions
physical pixels per UV unit
atlas state: none | single | fragmented
invalid UV
out-of-bounds UV
fractional UV
unlocked Box-UV Cubes
exact reuse regions
partial-overlap candidates
production gate: ready | review_required
```

Exact reuse is evidence, not automatically an error. Partial overlap is a review candidate, not an auto-packer judgement. Packing percentage remains non-authoritative.

### T9–T10 — UV lock and grid discipline

AI-authored Box UV intended for production painting uses:

```text
initial native auto UV as provisional mapping
→ audit/correct uv_offset / mirror_uv
→ autouv=0
→ production paint
```

Integer logical UV is the normal AI pixel-art target. Fractional UV, out-of-bounds state, invalid UV, unlocked Box UV, and unexplained partial overlap block the production UV gate until resolved or explicitly justified.

### T11 — texel-scale contract

Logical UV remains stable at 128×128. Physical bitmap size determines detail density:

```text
128 bitmap → 1× physical pixels / UV unit
256 bitmap → 2×
384 bitmap → 3×
512 bitmap → 4×
...
```

Reasoning scales identity marks, material detail, and microdetail to reported `physical_pixels_per_uv_unit`; a larger bitmap is not itself a quality claim.

### T12–T17 — professional texture language

Active policy/skill/prompt now require, when supported:

```text
material-specific value + hue ramps
face-aware form separation
contact / occlusion darkening where real geometry supports it
edge treatment appropriate to material
hard-pixel alpha discipline (normally 0 / 255)
identity-critical marks before material microdetail
material detail before optional wear/noise
```

Texture must reinforce actual geometry; shading must not invent major fake silhouette/volume.

### T18 — focused texture evidence

**No new public crop parameter/tool is justified yet.** Source now provides:

```text
get_texture → full-atlas image + exact texture/logical/physical density metadata
list_textures → global bounded UV atlas audit
inspect_element → exact affected face → physical texture rect
```

This is sufficient current source evidence for whole-atlas structure plus deterministic affected-region reasoning. Do not add a new crop API until a concrete source/runtime limitation proves that these retained surfaces cannot support the required review. `No change required` is the current T18 decision.

## Regression Owners

Primary texture regressions:

- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`
- `mcp/tests/texture-visual-convergence.test.ts`
- `mcp/tests/texture-production-discipline.test.ts`
- `mcp/tests/texture-atlas-integrity.test.ts`

## Current Repository Closure

```text
U7  No change required — no speculative profile/router/runtime-prompt redesign without installed-client evidence
```

Protected production gaps outside this texture work remain controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Final Static Audit

Completed after T7–T18. It re-checked project UV ownership, atlas lifecycle/audit, Cube UV lock, explicit Painter targeting, PBR/variant ownership, guidance alignment, and convergence evidence. Routing and PBR-group gaps found by the audit were fixed. No further concrete source redesign is justified.

`mcp-verify.yml` now watches the texturing skill and Texture Standard consumed by MCP tests.

## Next Step — CI TERMINAL PROOF ONLY

1. Record terminal MCP Verify for the final source and relevant Repository Verify for routing/policy when accessible.
2. If a gate fails, diagnose only the exact failing owner; do not redesign adjacent texture architecture or weaken a valid test.
3. On terminal green source/CI proof, record `TEXTURING SOURCE CLOSED` and stop.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
