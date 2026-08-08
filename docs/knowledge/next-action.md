# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, and correction decisions evidence-backed
rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_EXISTING_ROTATION_ACTIVATION_HARDENED`

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
- strict explicit-target resolution when `modify_cube.id` is supplied;
- strict `place_cube` Group targeting, no silent root fallback;
- safer `add_group` parent/default behavior;
- hardened `bone_rigging` preflight/rollback/Group pivot semantics;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- explicit origin requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for every new `place_cube` element;
- zero→non-zero rotation activation on an existing Cube now requires explicit
  `origin` before Undo; already-rotated Cubes may adjust angle while reusing the
  existing pivot.

These are **source implemented**, not live-proven.

## Documentation State

Root `docs/` / Obsidian owners remain aligned with the current source slice:

- `docs/foundation/05-geometry-standard.md` owns the rotation/pivot policy;
- `implementation-map.md` owns source locations;
- `validation-report.md` owns evidence level;
- this note owns only the next active task.

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

Audit the **legacy implicit selected-Cube fallback** in `modify_cube`:

```text
modify_cube(id omitted)
→ current source uses Cube.selected
→ one or several editor-selected Cubes may receive the patch
```

Normal Reference Fidelity routing already requires exact confirmed UUIDs, so this
implicit targeting path may no longer belong in the normal public mutation
contract.

Before changing it:

1. search current Local source/docs for real callers that intentionally depend on
   omitted `id` / editor selection;
2. distinguish actual compatibility requirement from inherited upstream behavior;
3. if no current need is proven, prefer making `id` explicit/required rather
   than adding another selection-state safeguard;
4. if a real caller depends on selection fallback, preserve it only with a clear
   bounded reason instead of assuming compatibility is valuable by default.

Do not change `modify_cubes_batch`, hierarchy, UV, G3, or add another targeting
tool in this slice.

## Proof Boundary

ChatGPT→GitHub may establish caller evidence, the public contract, and static
diff only. Actual Blockbench selection/mutation behavior remains
`LOCAL PROOF REQUIRED` if the runtime path is changed.
