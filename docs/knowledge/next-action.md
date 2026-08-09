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

`REFERENCE_FIDELITY_CREATE_TEXTURE_GROUP_TARGET_HARDENED`

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
  and rejects ambiguity/missing references before active texture selection
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
  must be non-empty and is resolved exactly once before `Undo.initEdit` by
  exact UUID → exact unique texture ID → exact unique name. Missing or ambiguous
  references fail before mutation, the preflighted Texture objects are reused for
  assignment, and Undo texture capture includes both the material's current
  textures and any external assignment targets;
- after successful `configure_material` preflight, the existing Undo scope remains
  `texture_groups: [textureGroup]` plus the deduplicated `undoTextures`. Channel
  resets/assignments, uniform config mutation, `updateMaterial`, and
  `Undo.finishEdit` run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows;
- `assign_texture_channel(texture=...)` requires a non-empty explicit texture
  reference and resolves it exactly once before `Undo.initEdit` by exact UUID →
  exact unique texture ID → exact unique name. Missing or ambiguous references
  fail before mutation. Existing textures occupying the requested channel are
  identified before Undo, excluding the assignment target, and Undo texture
  capture is the unique union of the preflighted target plus every texture whose
  `pbr_channel` will be reset to `"color"`. The exact preflighted target is reused
  for assignment;
- after successful `assign_texture_channel` target/reset preflight, the Undo scope
  remains `texture_groups: [textureGroup]` plus the deduplicated `undoTextures`.
  Channel resets, target assignment, material `saved` mutation, `updateMaterial`,
  and `Undo.finishEdit` now run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows;
- the four proven material-target boundaries in `texture.ts` —
  `configure_material`, `get_material_info`, `assign_texture_channel`, and
  `save_material_config` — require non-empty material references and resolve
  exact UUID first, otherwise exact name only when unique. Ambiguous names fail
  with candidate UUIDs and missing targets fail before caller mutation/read/save
  effects. Their existing result, mutation, Undo, and save semantics remain
  unchanged;
- `create_texture(group=...)` preserves omitted `group` as valid and preserves the
  existing rule that `pbr_channel` requires a group. A supplied group reference
  must now be non-empty and is resolved before `Undo.initEdit` by exact
  TextureGroup UUID, otherwise exact name only when unique. Missing or ambiguous
  group references fail before texture construction/image mutation, and the
  resolved TextureGroup UUID is passed into the Texture constructor instead of
  the caller's unresolved string. Data/fill, layer, dimensions, render settings,
  and `pbr_channel` behavior remain unchanged.

These are **source implemented**, not live-proven.

## Latest Create-Texture Group-Target Finding

Before the latest change:

```text
create_texture(..., group?, pbr_channel?)
→ schema: group = optional plain string
→ refinement: pbr_channel requires a truthy group
→ Undo.initEdit({ textures: [], collections: [] })
→ new Texture({ ..., group: callerString, pbr_channel, internal: true })
→ image/canvas setup
→ texture.add()
→ Undo.finishEdit
```

A supplied group name could be ambiguous, and missing/non-UUID strings could reach
Texture construction without validating that the intended TextureGroup existed.

Current Local behavior is:

```text
create_texture(..., group?, pbr_channel?)
→ group omitted → preserve undefined group
→ supplied group schema requires non-empty string
→ before Undo, resolve group
   ├─ exact TextureGroup UUID → target
   ├─ exact unique TextureGroup name → target
   ├─ duplicate exact name → ERROR with candidate UUIDs
   └─ missing → actionable ERROR
→ Undo.initEdit({ textures: [], collections: [] })
→ new Texture({ ..., group: resolvedGroup?.uuid, pbr_channel, internal: true })
→ existing image/canvas setup
→ texture.add()
→ Undo.finishEdit
→ Canvas.updateAll()
```

The existing file-local `resolveTextureToolMaterial()` owner was reused. Shared
`mcp/lib/util.ts::findTextureGroupOrThrow()` remains unchanged. No material-type
validation, file-loading redesign, PBR channel redesign, or rollback change was
included in this identity slice.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; current GitHub code search is incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`create_texture` mutation/Undo recoverability after successful optional
TextureGroup preflight** in:

```text
mcp/server/tools/texture.ts
```

Current post-preflight path is:

```text
optional resolved TextureGroup
→ Undo.initEdit({ textures: [], collections: [] })
→ construct Texture
→ data branch
   ├─ data URL → mutate source/size
   └─ file path → texture.fromFile(...) → load/fillParticle/layer state
→ no-data branch
   → active canvas clear/fill
   → updateSource/updateLayerChanges
→ texture.add()
→ Undo.finishEdit
→ Canvas.updateAll()
→ return imageContent(texture.getDataURL())
```

Target preflight now fails before Undo, but there is still no rollback boundary
after `Undo.initEdit`. A failure during Texture construction/setup, file loading,
canvas/source mutation, `texture.add()`, or `Undo.finishEdit` can therefore leave
an open or partially applied edit.

Audit requirements:

1. preserve optional group preflight and resolved UUID behavior unchanged before
   all mutation;
2. preserve current data-vs-fill rules, layer requirement, dimensions,
   `pbr_channel`, render settings, file-loading path, return shape, and success
   Canvas refresh;
3. audit whether the existing `textures: []` plus `collections: []` Undo scope is
   sufficient for the actual create-texture path; change capture only if source
   evidence proves a missing mutation owner;
4. if any operation fails after `Undo.initEdit`, cancel/revert the open edit,
   refresh Canvas, and rethrow;
5. keep the change local to `create_texture`; do not modify group/material
   resolvers, other texture/PBR tools, shared helpers, file-loading semantics, G3,
   or create a generic transaction framework.

Prefer the smallest rollback boundary around the existing create/setup/add/
`Undo.finishEdit` sequence. Keep success `Canvas.updateAll()` outside the rollback
boundary after a successful `Undo.finishEdit`, matching the existing Local
transaction pattern.

## Proof Boundary

ChatGPT→GitHub may establish schema/resolver/control-flow/Undo structure and static
diff only. Actual live paint targeting, PBR material targeting, TextureGroup
assignment, file loading, texture creation, forced rollback, and save behavior
remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
