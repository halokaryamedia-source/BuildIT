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

`REFERENCE_FIDELITY_ADD_TEXTURE_GROUP_ROLLBACK_HARDENED`

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
- `apply_texture` keeps selection restoration in an inner `finally` while an
  outer rollback boundary covers texture apply/update, selection restoration,
  and `Undo.finishEdit`; failure calls `Undo.cancelEdit(true)` and rethrows;
- `activate_texture(texture=...)` requires a non-empty explicit texture
  reference, resolves exact UUID → exact unique texture ID → exact unique name,
  and rejects ambiguous/missing references before active texture selection
  changes;
- `getAndActivateTexture(texture_id?)` preserves the existing omitted-reference
  fallback to current selected texture or default texture, while explicit
  non-empty references resolve exact UUID → exact unique texture ID → exact
  unique name and reject ambiguity/missing before active texture selection. The
  direct paint callers remain unchanged and still call this helper before their
  Undo/Painter operation boundary;
- `get_texture(texture?)` preserves the existing omitted/falsy-reference fallback
  to `Texture.getDefault()`, while explicit non-empty references resolve exact
  UUID → exact unique texture ID → exact unique name and reject ambiguity/missing
  before image data is returned. Shared texture helpers remain unchanged;
- `add_texture_group(name, textures?, is_material)` preserves omitted `textures`
  as valid empty-group creation. A provided list must be non-empty and contain
  non-empty references; every reference is preflighted by exact UUID → exact
  unique texture ID → exact unique name before `Undo.initEdit`. Any missing or
  ambiguous entry fails the whole call before group creation or texture
  reassignment;
- after successful `add_texture_group` preflight, Undo now captures
  `texture_groups: []` plus the exact resolved `textureList`; group add, texture
  reassignment, and `Undo.finishEdit` run inside a rollback boundary that calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows on failure. Shared
  texture resolvers remain unchanged.

These are **source implemented**, not live-proven.

## Latest Texture-Group Rollback Finding

Before the latest change, target identity was already preflighted, but mutation
continued as:

```text
resolved textureList
→ Undo.initEdit({ elements: [], outliner: true, collections: [], textures: [] })
→ new TextureGroup(...).add()
→ textureList.forEach(texture.extend({ group: textureGroup.uuid }))
→ Undo.finishEdit
→ Canvas.updateAll
```

The Undo scope did not capture the TextureGroup list or the textures being
reassigned, and a failure after Undo opened had no rollback boundary.

Current Local behavior is:

```text
resolved textureList
→ construct unadded TextureGroup
→ Undo.initEdit({ texture_groups: [], textures: textureList })
→ try
   → textureGroup.add()
   → resolved textures extend({ group: textureGroup.uuid })
   → Undo.finishEdit
→ catch
   → Undo.cancelEdit(true)
   → Canvas.updateAll()
   → rethrow
→ Canvas.updateAll()
→ success return
```

The strict texture-list preflight remains before all mutation. The Undo capture
scope now matches existing Local TextureGroup mutation patterns: new group list
state plus the exact textures whose `group` field changes. Omitted-texture empty
group behavior, `name`, `is_material`, assignment semantics, success return, and
success Canvas refresh are unchanged.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture-channel identity for `create_pbr_material`** in:

```text
mcp/server/tools/texture.ts
```

Current observed path is:

```text
create_pbr_material(... optional channel texture refs ...)
→ for each supplied channel
   → findTextureOrThrow(reference)
   → getProjectTexture(reference)
   → first ID/name/UUID match wins
   → push resolved texture into texturesToAdd
→ Undo.initEdit({ texture_groups: [], textures: texturesToAdd })
→ create/add TextureGroup
→ for each supplied channel
   → findTextureOrThrow(reference) again
   → texture.extend({ group: textureGroup.uuid, pbr_channel: channel })
→ updateMaterial
→ Undo.finishEdit
```

A duplicate texture name/ID can therefore bind the wrong texture to a PBR
channel. The same caller reference is also resolved a second time after Undo has
opened even though an object was already found during preflight.

Audit requirements:

1. preserve optional channel behavior and the existing uniform `color_value`,
   `mer_value`, and `subsurface_value` semantics;
2. when a channel texture reference is provided, require a non-empty explicit
   reference and resolve it exactly once before `Undo.initEdit`: exact UUID first,
   then exact texture ID, then exact name only when unique;
3. ambiguous or missing supplied references must fail before Undo, TextureGroup
   creation, material config mutation, or channel assignment;
4. reuse the exact preflighted Texture objects for channel assignment after Undo;
   do not repeat legacy lookup after mutation starts;
5. keep this slice local to `create_pbr_material`; do not change shared
   `findTextureOrThrow()` / `getProjectTexture()`, `configure_material`,
   `assign_texture_channel`, `add_texture_group`, standalone activation,
   `get_texture`, `apply_texture`, paint tools, G3, or create a generic resolver
   framework.

Keep recoverability after successful `create_pbr_material` preflight as a
separate follow-up unless this target-identity audit proves it must be changed in
the same boundary.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced `apply_texture` rollback, `add_texture_group` target/rollback behavior, and
future `create_pbr_material` runtime targeting remain `LOCAL PROOF REQUIRED`
until local Blockbench testing resumes.
