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
TEXTURING_CI_TERMINAL_PROOF_BLOCKED_BY_CURRENT_ENVIRONMENT
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5 + T0–T18 decisions**.

Actual desktop Painter behavior, UV persistence, visual quality, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.
**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof.**
**Experimental browser proof does not upgrade desktop MCP claims.**

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

`create_texture` preflights production role before Undo:

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
→ material TextureGroup required
→ new blank support texture matches established base bitmap size
```

Imported existing data may preserve authored dimensions. Non-material groups remain explicit color variants.

### T8 — global atlas / UV observability

`list_textures` returns structured atlas inventory plus bounded global UV audit:

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

```text
initial native auto UV as provisional mapping
→ audit/correct uv_offset / mirror_uv
→ autouv=0
→ production paint
```

Integer logical UV is the normal AI pixel-art target. Fractional UV, out-of-bounds state, invalid UV, unlocked Box UV, and unexplained partial overlap block the production UV gate until resolved or explicitly justified.

### T11 — texel-scale contract

Logical UV remains stable at 128×128. Physical bitmap determines detail density:

```text
128 bitmap → 1× physical pixels / UV unit
256 bitmap → 2×
384 bitmap → 3×
512 bitmap → 4×
...
```

Reasoning scales identity marks, material detail, and microdetail to reported `physical_pixels_per_uv_unit`; a larger bitmap is not itself a quality claim.

### T12–T17 — professional texture language

Active policy/skill/prompt require, when supported:

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

**No new public crop parameter/tool is justified.** Current source provides:

```text
get_texture → full-atlas image + exact texture/logical/physical density metadata
list_textures → global bounded UV atlas audit
inspect_element → exact affected face → physical texture rect
```

Do not add a crop API until a concrete limitation proves these retained surfaces insufficient.

## Regression Owners

- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`
- `mcp/tests/texture-visual-convergence.test.ts`
- `mcp/tests/texture-production-discipline.test.ts`
- `mcp/tests/texture-atlas-integrity.test.ts`

## Final Static Audit

Completed after T7–T18. It re-checked project UV ownership, atlas lifecycle/audit, Cube UV lock, explicit Painter targeting, PBR/variant ownership, guidance alignment, and convergence evidence. Routing and PBR-group gaps found by the audit were fixed. No further concrete source redesign is justified.

`mcp-verify.yml` now watches the texturing skill and Texture Standard consumed by MCP tests.

## CI Proof Retrieval Boundary

Terminal Actions proof was attempted on 2026-08-18 and could not be retrieved from the current execution environment:

```text
GitHub connector commit-run lookup → exposes PR-triggered runs only; Local work is direct push
combined commit status             → no legacy status contexts returned
GitHub CLI                         → unavailable (`gh: command not found`)
container GitHub REST fallback     → unavailable (DNS resolution failure)
```

Therefore **no CI PASS or FAIL is claimed**. This is an evidence-access blocker, not evidence that CI passed or failed.

Relevant snapshots:

```text
255f303ac2a1edb527900bdc1ec3fc9cfff214ae  last texture source/test change requiring MCP Verify
b58fbdb323227cf5d492dacd6d55bc3bb8c25794  final static-audit documentation head before this blocker note
```

Do not change source merely to trigger CI, do not reopen T7–T18, and do not substitute local testing.

## Next Step — TERMINAL CI PROOF WHEN ACCESSIBLE

1. From an environment that can see **push-triggered GitHub Actions runs**, retrieve MCP Verify for source snapshot `255f303...` (or a later source-equivalent head) and relevant Repository Verify for the continuation head.
2. If a run is terminal green, record its run/job identity and mark `TEXTURING SOURCE CLOSED`.
3. If a run fails, inspect only the failing job/log and fix the exact owner; do not redesign adjacent texture architecture or weaken a valid regression.
4. If no run exists, diagnose workflow enablement/triggering only. Do not create no-op source changes solely to manufacture proof.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
