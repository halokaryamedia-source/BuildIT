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

`REFERENCE_FIDELITY_CONFIGURE_MATERIAL_TEXTURE_TARGET_HARDENED`

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
- after successful `add_texture_group` preflight, Undo captures
  `texture_groups: []` plus the exact resolved `textureList`; group add, texture
  reassignment, and `Undo.finishEdit` run inside a rollback boundary that calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows on failure;
- `create_pbr_material` keeps all channel texture references optional, but a
  supplied reference must be non-empty. Each supplied color/normal/height/MER
  reference is resolved exactly once before `Undo.initEdit` by exact UUID → exact
  unique texture ID → exact unique name. Missing or ambiguous supplied references
  fail before Undo/material mutation, and the exact preflighted Texture objects
  are reused for channel assignment;
- after successful `create_pbr_material` channel preflight, the existing Undo
  capture remains `texture_groups: []` plus the exact `texturesToAdd`. Material
  config mutation, group add, channel assignment, `updateMaterial`, and
  `Undo.finishEdit` run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows;
- `configure_material` preserves omitted channel fields and the exact `"none"`
  sentinel behavior. Every provided non-`"none"` color/normal/height/MER target
  must now be non-empty and is resolved exactly once before `Undo.initEdit` by
  exact UUID → exact unique texture ID → exact unique name. Missing or ambiguous
  references fail before mutation, the preflighted Texture objects are reused for
  assignment, and Undo texture capture now includes both the material's current
  textures and any external assignment targets. Material target lookup, uniform
  values, success result, and success Canvas refresh remain unchanged.

These are **source implemented**, not live-proven.

## Latest Configure-Material Targeting Finding

Before the latest change:

```text
configure_material(material, optional channel refs / "none", uniform values)
→ findTextureGroupOrThrow(material)
→ current textures = textureGroup.getTextures()
→ Undo.initEdit({ texture_groups: [textureGroup], textures: current textures })
→ for each channel
   ├─ omitted → no channel-target change
   ├─ "none" → existing remove/reset behavior
   └─ explicit reference
       → findTextureOrThrow(reference)
       → getProjectTexture(reference)
       → first ID/name/UUID match wins
       → texture.extend({ group: textureGroup.uuid, pbr_channel: channel })
→ update uniform values / saved flag
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

A duplicate texture name/ID could bind the wrong texture. Missing references
failed only after Undo had opened, explicit empty strings behaved like omitted
falsy fields, and an external assignment target was not guaranteed to be present
in the initial Undo texture capture.

Current Local behavior is:

```text
configure_material(material, optional channel refs / "none", uniform values)
→ findTextureGroupOrThrow(material)
→ current textures = textureGroup.getTextures()
→ each provided channel schema requires a non-empty string
→ before Undo, for each provided non-"none" channel
   → resolve exactly once
      ├─ exact UUID → target
      ├─ exact unique texture ID → target
      ├─ exact unique name → target
      └─ ambiguous / missing → ERROR
→ assignmentTextures = exact preflighted targets
→ undoTextures = unique(current textures + assignmentTextures)
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ for each channel
   ├─ omitted → no channel-target change
   ├─ "none" → existing remove/reset behavior
   └─ explicit → reuse preflighted Texture object
→ update uniform values / saved flag
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

The material lookup itself remains unchanged for this slice. Existing channel
mutation semantics after successful resolution, uniform `color_value`,
`mer_value`, `subsurface_value`, `saved`, material update, result, and success
Canvas refresh were preserved. Shared `findTextureOrThrow()` /
`getProjectTexture()` and adjacent PBR tools were not changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`configure_material` mutation/Undo recoverability after successful channel
preflight** in:

```text
mcp/server/tools/texture.ts
```

Current post-preflight path is:

```text
preflighted channel targets + undoTextures
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ apply "none" resets / preflighted channel assignments
→ update uniform values / saved flag
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

The target identity and texture capture are now preflighted before mutation, but
there is still no rollback boundary after `Undo.initEdit`. A failure during a
channel reset/assignment, uniform config mutation, `updateMaterial`, or
`Undo.finishEdit` can therefore leave an open or partially applied edit.

Audit requirements:

1. preserve the strict preflight, omitted-field behavior, exact `"none"` sentinel,
   and expanded `undoTextures` capture unchanged before all mutation;
2. confirm `texture_groups: [textureGroup]` plus `undoTextures` is the minimum
   sufficient Undo scope for this mutation sequence; change it only if source
   evidence requires it;
3. if any operation fails after `Undo.initEdit`, call `Undo.cancelEdit(true)`,
   refresh Canvas, and rethrow;
4. preserve current channel mutation semantics, uniform `color_value`,
   `mer_value`, `subsurface_value`, `saved`, `updateMaterial`, return value, and
   success Canvas refresh;
5. keep the change local to `configure_material`; do not change material target
   lookup, `create_pbr_material`, `assign_texture_channel`, shared texture
   resolvers, `add_texture_group`, standalone activation, `get_texture`,
   `apply_texture`, paint tools, G3, or create a generic transaction framework.

Prefer the smallest `try/catch` rollback boundary around the existing mutation
sequence. Do not broaden this slice into channel behavior redesign.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced `apply_texture` rollback, `add_texture_group` target/rollback behavior,
`create_pbr_material` target/rollback behavior, and `configure_material`
target/rollback behavior remain `LOCAL PROOF REQUIRED` until local Blockbench
testing resumes.
