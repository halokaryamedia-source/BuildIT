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

`REFERENCE_FIDELITY_LIST_TEXTURES_RENDER_OBSERVABILITY_HARDENED`

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
  must be non-empty and is resolved before `Undo.initEdit` by exact
  TextureGroup UUID, otherwise exact name only when unique. Missing or ambiguous
  group references fail before texture construction/image mutation, and the
  resolved TextureGroup UUID is passed into the Texture constructor instead of
  the caller's unresolved string;
- after successful `create_texture` optional group preflight, the existing Undo
  scope remains `textures: []` plus `collections: []`. Texture construction,
  data/file/canvas setup, `texture.add()`, and `Undo.finishEdit` run inside a
  rollback boundary; failure calls `Undo.cancelEdit(true)`, refreshes Canvas, and
  rethrows;
- `create_texture` applies its existing schema-provided `render_mode` and
  `render_sides` values exactly once through the initial `Texture` constructor.
  Blockbench's Texture data contract owns both properties, and its constructor
  merges input data before material setup; schema defaults (`"default"`, `"auto"`),
  group preflight, data/file/canvas setup, Undo rollback, result shape, and
  success refresh remain unchanged;
- `list_textures` remains read-only and preserves its existing `name`, `uuid`,
  `id`, and `group` result fields while also exposing each Texture's direct
  `render_mode` and `render_sides` metadata. No image-data read, mutation, Undo,
  `get_texture`, or `get_material_info` behavior changed.

These are **source implemented**, not live-proven.

## Latest List-Textures Render-Observability Finding

Before the latest change, `create_texture` could author render settings but the
general discovery path returned only:

```text
list_textures()
→ [{
     name,
     uuid,
     id,
     group
   }]
```

Blockbench source/typing evidence already establishes `render_mode` and
`render_sides` as direct Texture properties, and `get_material_info` reads those
same properties for grouped material textures.

Current Local behavior is:

```text
list_textures()
→ [{
     name,
     uuid,
     id,
     group,
     render_mode,
     render_sides
   }]
```

The tool remains read-only. Existing identity/group fields are unchanged and no
additional metadata such as `pbr_channel`, dimensions, source/path, or selection
state was added in this slice.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; current GitHub code search is incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`create_texture` `layer_name` contract parity when `fill_color` is used**
in:

```text
mcp/server/tools/texture.ts
```

Current observed contract/path is:

```text
createTextureParameters
→ fill_color?: color
→ layer_name?: string
→ refinement: fill_color requires layer_name

create_texture execute(..., fill_color, layer_name)
→ destructures layer_name
→ constructs Texture
→ no-data branch gets texture.getActiveCanvas()
→ fill_color paints directly to that canvas
→ updateSource/updateLayerChanges
→ layer_name is never read or applied
```

The public contract therefore requires the caller to provide a layer name for
filled textures, but current execution does not create/name/select a TextureLayer
or otherwise use that value. This can make a caller believe a named editable
layer was authored when the result is only direct texture-canvas content.

Audit requirements:

1. verify the intended Local/Blockbench TextureLayer lifecycle and existing
   `Texture.activateLayers` / `TextureLayer` creation patterns before editing;
2. determine whether `layer_name` is meant to create a real named layer or is a
   stale/incorrect public contract; do not assume either direction without source
   evidence;
3. preserve existing fill color, data-vs-fill exclusion, dimensions, group/PBR
   targeting, render settings, Undo rollback, result shape, and success refresh;
4. if a real layer is intended, ensure it is created/painted within the existing
   create-texture transaction and that Undo capture remains sufficient; if the
   contract is stale, remove only the unsupported requirement/field rather than
   inventing layer behavior;
5. keep this slice separate from new painting features, generic layer-management
   APIs, UV changes, or material redesign.

This is a contract-to-runtime parity audit first. Do not implement a layer until
Blockbench-owned source evidence establishes the correct lifecycle.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/read-shape/Blockbench-source
structure and static parity only. Actual layer creation, texture rendering, file
loading, texture creation, forced rollback, PBR material behavior, and viewport
appearance remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
