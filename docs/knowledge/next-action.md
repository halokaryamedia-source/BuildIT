# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, correction, and destructive mutation
decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_DUPLICATE_ROLLBACK_HARDENED`

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
- `modify_cube.id` required; editor selection is not an implicit single-Cube
  mutation target;
- strict `place_cube` Group targeting, no silent root fallback;
- safer `add_group` parent/default behavior;
- hardened `bone_rigging` preflight/rollback/Group pivot semantics;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- explicit origin requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for every new `place_cube` element;
- zero→non-zero rotation activation on an existing Cube requires explicit
  `origin` before Undo;
- `remove_element`, `duplicate_element`, and `rename_element` use UUID-first /
  exact-unique-name destructive target resolution;
- `duplicate_element` recursive Cube/Group/Mesh cloning is now wrapped in one
  rollback boundary: failure after Undo opens calls `Undo.cancelEdit(true)` and
  rethrows; successful Canvas refresh remains after `finishEdit`.

These are **source implemented**, not live-proven.

## Latest Runtime Finding

Before the latest change, `duplicate_element` opened Undo and recursively created
Group/Cube/Mesh descendants without a failure rollback boundary. A later child or
Mesh failure could therefore occur after earlier duplicate elements had already
been created.

Current source now follows the same bounded Local pattern already used by other
creation/mutation paths:

```text
Undo.initEdit
↓
try recursive clone
↓
Undo.finishEdit

failure after Undo opens
→ Undo.cancelEdit(true)
→ Canvas refresh
→ rethrow
```

No clone geometry, material, UV, hierarchy, naming, remove, or rename behavior
was changed in this slice.

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

Target identity and recoverability are part of the same no-guess boundary: a
mutation must not silently hit the wrong element or leave partial state after a
failed operation.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **scoped Group lookup ambiguity** in the normal discovery/selection route:

```text
find_elements_by_criteria(parent_group=...)
select_all_of_type(parent_group=...)
```

Current source resolves those scopes with:

```text
Group.all.find(g => g.uuid === parent_group || g.name === parent_group)
```

so duplicate exact Group names may silently select the first Group. This is
material because `find_elements_by_criteria` is part of the normal
`discover → inspect_element → mutate exact UUID` path; a wrong scope can produce
the wrong candidate UUID before the later strict mutation gates even run.

Audit requirements:

1. confirm both current callers/semantics and whether any other scoped element
   operations share this first-match pattern;
2. preserve optional no-scope behavior;
3. make an explicit scope UUID-first and allow exact name only when unique;
4. fail ambiguity before search/selection state changes;
5. preserve current root/no-parent semantics rather than broadening them
   accidentally;
6. do not change destructive resolver, duplication logic, texture lookup, mesh
   selection fallback, UV, G3, or create a generic resolver framework.

Prefer a small local Group-scope resolver or reuse an existing strict local
pattern only when its `root` semantics are compatible.

## Proof Boundary

ChatGPT→GitHub may establish source lookup contracts and static diff only.
Actual Blockbench scoped-search/selection behavior remains `LOCAL PROOF REQUIRED`
until local testing resumes.
