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

`REFERENCE_FIDELITY_DESTRUCTIVE_ELEMENT_TARGET_HARDENED`

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
- `remove_element`, `duplicate_element`, and `rename_element` now resolve targets
  UUID-first and accept an exact name only when unique across Cube/Mesh/Group;
  duplicate-name ambiguity fails before destructive mutation.

These are **source implemented**, not live-proven.

## Latest Targeting Finding

The shared `mcp/lib/util.ts::findElementOrThrow` still uses first-match name
resolution, but GitHub code search for all callers is incomplete in this repo.
Therefore the latest slice deliberately **did not** broaden that shared helper.

Instead, the three known destructive element tools use a local resolver inside
`mcp/server/tools/element.ts`:

```text
UUID exact
→ target

exact name + one match
→ target

exact name + multiple Cube/Mesh/Group matches
→ ERROR + candidate UUID/type
```

This keeps the fix bounded while eliminating the proven destructive ambiguity.

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

Target identity is part of the same no-guess boundary: a correct operation on the
wrong element is still a failed model mutation.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`duplicate_element` transaction recoverability** in:

```text
mcp/server/tools/element.ts
```

Current source path:

```text
resolve target
↓
Undo.initEdit
↓
recursive cloneElement(...)
  ├─ Cube clone
  ├─ Group clone + recursive children
  └─ Mesh clone + vertices/faces/material
↓
Undo.finishEdit
```

There is currently no `try/catch + Undo.cancelEdit(true)` around the recursive
clone after Undo opens. If a child/mesh clone throws after earlier elements were
already created, partial duplicated state may remain.

Audit requirements:

1. confirm the exact mutation/failure boundary of `duplicate_element`;
2. preserve all target/clone behavior that is already correct;
3. if rollback is supported by the existing Blockbench Undo contract, wrap only
   the duplication transaction so failure reverts created elements;
4. keep Canvas refresh outside a successfully finished transaction where
   appropriate;
5. do not change remove/rename semantics, clone geometry rules, UV/material
   behavior, hierarchy, G3, or create a generic transaction framework.

## Proof Boundary

ChatGPT→GitHub may establish source transaction structure and static diff only.
Actual partial-clone rollback behavior remains `LOCAL PROOF REQUIRED` until local
Blockbench testing resumes.
