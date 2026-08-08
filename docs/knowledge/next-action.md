# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, and material
reference decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_APPLY_TEXTURE_TARGET_HARDENED`

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
- `apply_texture(id=..., texture=...)` now requires non-empty explicit targets,
  resolves element UUID → exact unique name across Cube/Mesh/Group, resolves
  texture UUID → exact ID → exact unique name, and rejects ambiguity/missing
  before descendant expansion and Undo.

These are **source implemented**, not live-proven.

## Latest Texture-Mutation Finding

Before the latest change:

```text
apply_texture(id=elementRef, texture=textureRef)
→ findElementOrThrow(elementRef)
→ findTextureOrThrow(textureRef)
→ first name-compatible match may win
```

Current Local behavior is:

```text
elementRef
├─ exact UUID → target
├─ exact unique name across Cube/Mesh/Group → target
└─ ambiguous / missing / empty → ERROR

textureRef
├─ exact UUID → target
├─ exact texture ID → target
├─ exact unique name → target
└─ ambiguous / missing / empty → ERROR
```

Both explicit identities are resolved before any Undo/mutation. If the resolved
element is a Group, existing behavior is preserved: all descendant Cube/Mesh
targets are collected before texture application.

The strict resolvers are local to `apply_texture`. Shared `findElementOrThrow()` /
`findTextureOrThrow()` remain unchanged because they still serve unrelated
texture/PBR/activation callers that have not been audited as one contract.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`apply_texture` transaction recoverability** in:

```text
mcp/server/tools/texture.ts
```

Current source now has strict target preflight, then:

```text
resolve element + texture
→ expand Group descendants
→ save prior selection
→ Undo.initEdit
→ try texture select/apply/update
→ finally restore prior selection
→ Undo.finishEdit
```

The `finally` protects UI selection restoration, but it is **not** a rollback
boundary. If texture application, `updateChangesAfterEdit`, selection restoration,
or `Undo.finishEdit` throws after Undo opens, current source does not call
`Undo.cancelEdit(true)`.

Audit requirements:

1. preserve the new strict element/texture target preflight unchanged;
2. preserve Group → descendant Cube/Mesh scope and current `applyTo` semantics;
3. preserve caller selection restoration on both success and failure as far as
   the runtime allows;
4. if any operation fails after `Undo.initEdit`, cancel/revert the open edit and
   rethrow;
5. keep face-level Canvas refresh on the successful path;
6. do not change paint activation, PBR/UV behavior, shared helpers, G3, or create
   a generic transaction framework.

Prefer the smallest nested `try/finally` + outer rollback boundary that preserves
selection restoration and moves `finishEdit` inside the recoverable operation.

## Proof Boundary

ChatGPT→GitHub may establish source transaction structure and static diff only.
Actual texture application, selection restoration, descendant targeting, and
rollback after a forced failure remain `LOCAL PROOF REQUIRED` until local
Blockbench testing resumes.
