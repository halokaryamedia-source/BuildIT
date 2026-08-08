# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, and material
reference decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_APPLY_TEXTURE_ROLLBACK_HARDENED`

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
- `inspect_model_bounds` + `capture_model_views` observation;
- `inspect_element` authored-state inspection in
  `mcp/server/tools/element-inspection.ts`;
- strict explicit Cube extents, hierarchy targets, rotation activation, Cube
  pivot semantics, and deterministic initial texture targeting;
- explicit UUID-based single/batch Cube correction routing;
- safer `add_group` + hardened `bone_rigging` targeting/pivot/rollback behavior;
- strict destructive element target resolution plus bounded Undo rollback for
  remove/duplicate/rename;
- strict optional Group scope and fail-closed regex filtering in element discovery;
- `filter_by_material(texture=...)` resolves UUID → exact texture ID → exact
  unique name and rejects ambiguous/missing explicit references;
- `apply_texture(id=..., texture=...)` requires non-empty explicit targets,
  resolves element UUID → exact unique name across Cube/Mesh/Group, resolves
  texture UUID → exact ID → exact unique name, and rejects ambiguity/missing
  before descendant expansion and Undo;
- `apply_texture` now keeps selection restoration in an inner `finally` while an
  outer rollback boundary covers texture apply/update, selection restoration,
  and `Undo.finishEdit`; failure calls `Undo.cancelEdit(true)` and rethrows.

These are **source implemented**, not live-proven.

## Latest Texture-Mutation Finding

Before the latest change:

```text
resolve element + texture
→ expand Group descendants
→ save prior selection
→ Undo.initEdit
→ try texture select/apply/update
→ finally restore prior selection
→ Undo.finishEdit
```

The selection was restored, but a failure after Undo opened could leave an open
or partially applied edit.

Current Local behavior is:

```text
resolve strict element + texture targets
→ expand Group descendants
→ save prior selection
→ Undo.initEdit
→ outer try
   → inner try: select/apply/update texture
   → inner finally: restore caller selection
   → Undo.finishEdit
→ outer catch
   → Undo.cancelEdit(true)
   → Canvas.updateAll()
   → rethrow
```

The successful path still performs the existing face-level `Canvas.updateView`
plus `Canvas.updateAll()` after `finishEdit`. Target identity, `applyTo`, and
Group descendant semantics were not changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit target identity for `activate_texture`** in:

```text
mcp/server/tools/texture.ts
```

Current source is:

```text
activate_texture(texture=reference)
→ findTextureOrThrow(reference)
→ target.select()
```

Shared `findTextureOrThrow()` still uses the legacy first-match texture lookup.
A duplicate texture name/ID can therefore activate a different texture than the
caller intended, which can then misdirect later paint operations.

Audit requirements:

1. require a non-empty explicit texture reference;
2. resolve exact UUID first, then exact texture ID, then exact name only when
   unique;
3. ambiguous or missing references must fail before active texture selection
   changes;
4. keep the change local to `activate_texture`; do not migrate shared texture
   helpers without caller proof;
5. do not change paint tools, PBR/UV behavior, `apply_texture`, G3, or create a
   generic texture resolver framework.

Prefer reusing the same small local resolution semantics already established for
strict texture references, but do not introduce a cross-file abstraction merely
to deduplicate a few lines.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error contracts and static diff only.
Actual live activation targeting and forced `apply_texture` rollback remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
