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

`REFERENCE_FIDELITY_PLACE_CUBE_TEXTURE_TARGET_HARDENED`

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
- strict explicit Cube extents, hierarchy targets, rotation activation, and Cube
  pivot semantics;
- explicit UUID-based single/batch Cube correction routing;
- safer `add_group` + hardened `bone_rigging` targeting/pivot/rollback behavior;
- strict destructive element target resolution plus bounded Undo rollback for
  remove/duplicate/rename;
- strict optional Group scope and fail-closed regex filtering in element discovery;
- `filter_by_material(texture=...)` resolves UUID → exact texture ID → exact
  unique name and rejects ambiguous/missing explicit references;
- `place_cube(texture=...)` now uses the same deterministic precedence for a
  supplied texture before Undo/Cube creation, while omitted texture preserves
  `Texture.getDefault()` behavior.

These are **source implemented**, not live-proven.

## Latest Initial-Placement Finding

Before the latest change:

```text
place_cube(texture=reference)
→ getProjectTexture(reference)
→ first match where texture.id OR texture.name OR texture.uuid matches
```

That meant a duplicate texture name/ID could silently texture a new Cube with the
wrong asset even though geometry, hierarchy, rotation, and pivot inputs were
already strict.

Current `mcp/server/tools/cubes.ts` behavior is:

```text
texture omitted
→ Texture.getDefault() behavior preserved

supplied exact UUID
→ target texture

supplied exact texture ID
→ target texture

supplied exact unique name
→ target texture

duplicate texture ID / name
→ ERROR + candidate identifiers

missing supplied texture
→ ERROR + use list_textures
```

Texture resolution and Group resolution both complete before `Undo.initEdit`.
The resolver is local to `place_cube`; shared `getProjectTexture()` /
`findTextureOrThrow()` remain unchanged because they still serve unrelated
texture/paint/PBR callers.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit target identity for `apply_texture`** in:

```text
mcp/server/tools/texture.ts
```

Current mutation preflight is:

```text
apply_texture(id=elementRef, texture=textureRef)
↓
findElementOrThrow(elementRef)
findTextureOrThrow(textureRef)
```

Both shared helpers retain first-match name-compatible lookup semantics. This
means duplicate element names or duplicate texture names/IDs can direct a texture
mutation to a different target than intended.

Audit requirements:

1. treat element identity and texture identity as one mutation preflight contract;
2. preserve Group behavior: Group target still means all descendant Cube/Mesh
   targets;
3. element reference should resolve exact UUID first and exact name only when
   unique across supported Cube/Mesh/Group targets;
4. supplied texture should resolve exact UUID first, then exact texture ID, then
   exact name only when unique;
5. all explicit target resolution must complete before Undo/mutation;
6. keep changes local to `apply_texture` unless caller evidence proves shared
   helper migration safe;
7. do not change face/application semantics, paint activation, PBR/UV behavior,
   G3, or create a generic resolver framework.

If existing source already provides equivalent strict preflight, `No change
required` remains valid.

## Proof Boundary

ChatGPT→GitHub may establish source lookup/error contracts and static diff only.
Actual texture application, descendant targeting, and duplicate-name behavior
remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
