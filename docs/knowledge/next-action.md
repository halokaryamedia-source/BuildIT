# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, and destructive
mutation decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_DESTRUCTIVE_ROLLBACK_HARDENED`

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
- `inspect_element` authored-state inspection in
  `mcp/server/tools/element-inspection.ts`;
- `modify_cubes_batch` exact-UUID heterogeneous correction;
- `modify_cube.id` required; editor selection is not an implicit single-Cube
  mutation target;
- strict `place_cube` Group targeting, explicit extents, and rotated-Cube pivot
  requirements;
- safer `add_group` + hardened `bone_rigging` targeting/pivot/rollback behavior;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- zero→non-zero existing-Cube rotation activation requires explicit `origin`;
- `remove_element`, `duplicate_element`, and `rename_element` use UUID-first /
  exact-unique-name destructive target resolution;
- all three destructive element operations now have bounded Undo failure recovery:
  failure after Undo opens calls `Undo.cancelEdit(true)` and rethrows;
- scoped element discovery/selection uses strict optional Group resolution;
- explicit invalid/rejected `name_pattern` fails instead of silently broadening
  the search.

These are **source implemented**, not live-proven.

## Latest Runtime Finding

Before the latest change, `remove_element` and `rename_element` resolved the
correct target before Undo but then had no failure cleanup after `Undo.initEdit`:

```text
Undo.initEdit
→ element.remove() / element.extend(...)
→ Undo.finishEdit
```

Current Local behavior is:

```text
resolve exact target
↓
Undo.initEdit
↓
try mutation + finishEdit
├─ success → Canvas.updateAll()
└─ failure → Undo.cancelEdit(true)
             Canvas.updateAll()
             rethrow
```

This matches the bounded Local pattern already used by `duplicate_element`, Cube
mutation, and hierarchy creation. Targeting, remove semantics, and rename
semantics were not changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture-reference ambiguity** in the read-only material discovery
route:

```text
filter_by_material(texture=...)
→ findTextureOrThrow(texture)
→ getProjectTexture(texture)
```

Current `getProjectTexture()` resolves with one first-match lookup across:

```text
texture.id === reference
or texture.name === reference
or texture.uuid === reference
```

A duplicate exact texture name may therefore select one texture silently and
return element/material candidates for the wrong texture.

Audit requirements:

1. confirm `filter_by_material` current semantics and whether its explicit
   reference should prefer UUID / texture ID before name;
2. determine whether exact name should be accepted only when unique;
3. keep this read-only discovery fix local if shared `getProjectTexture` /
   `findTextureOrThrow` callers are not proven compatible with stricter behavior;
4. ambiguity/missing reference must fail before result discovery;
5. do not change paint activation, texture mutation, UV behavior, G3, or create a
   generic texture resolver framework;
6. treat this as discovery correctness, not a texture/UV feature expansion.

## Proof Boundary

ChatGPT→GitHub may establish source lookup/error contracts and static diff only.
Actual live texture resolution and destructive rollback remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
