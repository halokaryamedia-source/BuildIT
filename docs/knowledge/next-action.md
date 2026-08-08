# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, and correction decisions evidence-backed rather than
assumption-driven.

## Current Status

`REFERENCE_FIDELITY_EXPLICIT_EXTENTS_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Current Architecture

Canonical decision:

- [Reference Fidelity Loop v1](decisions/reference-fidelity-loop.md)

Current source ownership/status:

- [Implementation Map](implementation-map.md)
- [Foundation Validation Report](../foundation/validation-report.md)

Short loop:

```text
Approved Modelling Brief
→ cross-view consistency
→ coordinate frame + target envelope
→ Primary Form Hypothesis
→ explicit coarse Cube authoring
→ inspect_model_bounds
→ capture_model_views
→ Reference ↔ model comparison
→ GLOBAL rebuild or LOCAL inspect/correct
→ fresh affected evidence
→ secondary geometry/hierarchy/pivots
```

## Completed Source Boundary

Current Local source already contains:

- Bedrock-first modelling prompt route;
- `inspect_model_bounds` + shared rendered-bounds reader;
- `capture_model_views` canonical observations;
- `inspect_element` authored-state inspection;
- `modify_cubes_batch` exact-UUID heterogeneous correction;
- strict `modify_cube` target resolution;
- strict `place_cube` Group targeting, no silent root fallback;
- safer `add_group` parent/default behavior;
- hardened `bone_rigging` preflight/rollback/Group pivot semantics;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- explicit origin requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for every new `place_cube` element.

These are **source implemented**, not live-proven.

## Documentation State

Root `docs/` / Obsidian documentation was refreshed on 2026-08-08:

- foundation reflects the current Reference Fidelity architecture;
- current ownership no longer points to stale `mcp/workflow/` or retired skill
  roots;
- historical reviews/source-selection notes are indexed/classified as history;
- implementation/proof/backlog are separated into their canonical owners.

See [Documentation Audit](operations/documentation-audit.md).

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

These failure patterns remain the quality target for the current source program.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **existing-Cube first rotation activation safety** in:

```text
mcp/server/tools/cubes.ts
```

Current risk:

```text
Cube currently unrotated
origin may be neutral [0,0,0]
↓
modify_cube / modify_cubes_batch sets first non-zero rotation
↓
rotation may silently activate around a pivot that was never intentionally chosen
```

Required distinction:

```text
Cube already has non-zero rotation
→ rotation adjustment may reuse its inspected existing pivot

Cube currently unrotated
→ first non-zero rotation must not silently reuse an unproven neutral pivot
```

Preferred solution: the smallest execution preflight using current Cube state.
Do not require a new pivot on every later rotation adjustment; do not infer a
pivot automatically; do not add a rotation/pivot planner.

## Proof Boundary

ChatGPT→GitHub may establish the source contract and static diff only.
Actual Blockbench rotation/pivot behavior remains `LOCAL PROOF REQUIRED` until
local testing is resumed.
