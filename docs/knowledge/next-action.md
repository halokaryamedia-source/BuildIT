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

`REFERENCE_FIDELITY_MATERIAL_DISCOVERY_TEXTURE_TARGET_HARDENED`

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
- `filter_by_material(texture=...)` now resolves exact UUID first, then exact
  texture ID, then exact name only when unique; ambiguous ID/name and missing
  references fail before discovery.

These are **source implemented**, not live-proven.

## Latest Material-Discovery Finding

Before the latest change:

```text
filter_by_material(texture=reference)
→ findTextureOrThrow(reference)
→ getProjectTexture(reference)
→ first match where id OR name OR uuid matches
```

That allowed duplicate texture names to silently choose one texture.

Current read-only discovery behavior is:

```text
exact UUID
→ target

exact texture ID
→ target

exact unique name
→ target

duplicate texture ID / name
→ ERROR + candidate IDs/UUIDs

missing
→ ERROR + use list_textures
```

`list_textures` already exposes texture `name`, `uuid`, and `id`, so callers can
recover with a stable explicit identifier.

The stricter resolver is intentionally local to `filter_by_material`. Shared
`getProjectTexture()` / `findTextureOrThrow()` remain unchanged because they also
serve `apply_texture`, `get_texture`, PBR configuration/channel assignment,
texture activation, and other mutation/paint paths.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture targeting during initial Cube placement**:

```text
place_cube(texture=...)
→ getProjectTexture(texture)
```

Current source resolves a supplied texture using the shared first-match helper
across texture `id`, `name`, or `uuid` before opening Undo. Duplicate names can
therefore select an unintended texture even though Cube geometry, parent target,
and rotation/pivot inputs are now strict.

Audit requirements:

1. preserve omitted texture behavior (`Texture.getDefault()`);
2. when texture is supplied, prefer exact UUID, then exact texture ID, then exact
   name only when unique;
3. ambiguous or missing explicit texture must fail before Undo/Cube creation;
4. keep the change local to `place_cube` unless caller evidence proves a shared
   resolver migration is safe;
5. do not change Cube geometry, face UV behavior, auto-UV, hierarchy, paint,
   PBR tools, G3, or add a texture-resolution framework.

## Proof Boundary

ChatGPT→GitHub may establish source lookup/error contracts and static diff only.
Actual Blockbench texture application and duplicate-name behavior remain
`LOCAL PROOF REQUIRED` until local testing resumes.
