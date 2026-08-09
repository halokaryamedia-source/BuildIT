# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, texture, and
material decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_LAYER_RENAME_UNDO_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Current Texture Exit Strategy

The user-approved direction is:

```text
finish remaining high-value Texture layer gaps
→ run one closing Texture source audit
→ if no critical/major source gap remains, freeze Texture
→ move the engineering sequence to Animation
```

Do not chase theoretical 100% Texture coverage before Animation. Continue only
when a concrete current source/API/contract gap is proven.

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
→ secondary geometry/hierarchy/pivots/textures
```

## Completed Source Boundary

Current Local source already contains:

- Bedrock-first modelling prompt route plus `inspect_model_bounds`,
  `capture_model_views`, and `inspect_element` observation paths;
- strict Cube/hierarchy/rotation/pivot targeting and explicit UUID-based
  correction routing;
- safer group/bone/destructive-element targeting with bounded rollback;
- strict texture identity for material filtering, `apply_texture`, standalone
  activation, paint activation, `get_texture`, texture groups, PBR material
  creation/configuration, and channel assignment;
- rollback boundaries for `apply_texture`, `add_texture_group`,
  `create_pbr_material`, `configure_material`, `assign_texture_channel`, and
  `create_texture` mutation paths;
- strict file-local PBR material/TextureGroup targeting for the proven material
  callers in `texture.ts` without changing the still-un-audited shared
  `findTextureGroupOrThrow()` helper;
- `create_texture(group=...)` resolves a supplied non-empty TextureGroup target
  before Undo and passes the concrete UUID into the Texture constructor;
- `create_texture` applies schema-provided `render_mode` and `render_sides`
  exactly once through the initial Texture constructor;
- `list_textures` remains read-only and exposes `render_mode` and `render_sides`
  while preserving its existing identity/group fields;
- `create_texture(fill_color=..., layer_name=...)` converts the authored bitmap
  into a real named base `TextureLayer` inside the create-texture transaction;
- `texture_layer_management(action="create_layer")` uses one outer Undo
  transaction, calls `activateLayers(false)` when layers are disabled, and rolls
  back activation/construction/addition/update/finish failures;
- `texture_layer_management(action="delete_layer")` calls
  `TextureLayer.remove(false)` inside the existing outer edit and rolls back
  removal/update/finish failures;
- `texture_layer_management(action="duplicate_layer")` follows Blockbench's
  native copy lifecycle (`getUndoCopy(true)` → `new TextureLayer` →
  `addForEditing()`), preserves the MCP `"<name> copy"` naming rule, and rolls
  back copy/construction/addition/update/finish failures;
- `texture_layer_management(action="merge_down")` participates only in the outer
  MCP Undo transaction via `mergeDown(false)`, preserving native compositing,
  removal, adjacent selection, and no-lower-layer behavior while rolling back
  merge/update/finish failures;
- `texture_layer_management(action="set_opacity")` preserves the Blockbench-native
  0..100 percentage contract, performs one texture update, and rolls back
  assignment/update/finish failures;
- `texture_layer_management(action="set_blend_mode")` validates against the
  current Blockbench-owned blend-mode values with a file-local schema, performs
  one texture update, and has an action-specific rollback boundary;
- `texture_layer_management(action="move_layer")` treats `target_index` as an
  explicit 0-based final layer index, rejects fractional/negative/out-of-range
  positions, preserves native remove/splice reorder semantics, and rolls back
  validation/reorder/update/finish failures;
- `texture_layer_management(action="rename_layer")` now has its own recoverable
  transaction path. It preserves the existing selected-layer and truthy-name
  checks, direct `TextureLayer.name` assignment, result text, one texture update,
  and interface refresh. Validation/assignment/update/finish failures call
  `Undo.cancelEdit(true)`, refresh Canvas/interface state, and rethrow. The shared
  `layer_name` schema and `create_layer` generated-name fallback remain unchanged.

These are **source implemented**, not live-proven.

## Latest Rename-Layer Finding

Before the latest source change, rename remained in the common tail:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = rename_layer
   → require TextureLayer.selected
   → require truthy layer_name
   → oldName = TextureLayer.selected.name
   → TextureLayer.selected.name = layer_name
   → result = rename result
→ common texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: rename_layer")
→ updateInterfacePanels()
```

Blockbench treats `TextureLayer.name` as a normal layer property. Its native
layer-properties flow opens an edit, changes the property, updates the owning
texture, then finishes the edit. The MCP direct assignment was therefore
compatible, but its open outer edit had no failure recovery.

Current Local behavior is:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = rename_layer
   → try
      → require TextureLayer.selected
      → require truthy layer_name
      → oldName = TextureLayer.selected.name
      → TextureLayer.selected.name = layer_name
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: rename_layer")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return rename result
```

The existing outer Undo capture is retained because `Texture.getUndoCopy()`
includes the active layer list/property state when layers are enabled. No
new duplicate-name policy, sanitization, shared-schema restriction, or generic
layer-property helper was introduced.

During implementation, one full-file write accidentally reformatted unrelated
`paint.ts` code. That commit was immediately neutralized by restoring the exact
pre-slice `paint.ts` blob before the final rename change was applied. Net source
diff from the slice starting head therefore contains only the intended
`rename_layer` transaction change.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- shared `layerBlendModeEnum` cleanup: deferred until direct callers can be
  exhaustively audited; `texture_layer_management` no longer depends on it.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="flatten_layers")` Blockbench API/Undo
parity and recoverability** in:

```text
mcp/server/tools/paint.ts
```

Current Local path is:

```text
outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = flatten_layers
   → require texture.layers_enabled
   → texture.flattenLayers()
   → result = "Flattened all layers"
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: flatten_layers")
→ updateInterfacePanels()
```

Unlike the already-audited layer operations, the current review has **not yet
established the exact current Blockbench-owned `Texture.flattenLayers()`
lifecycle**. GitHub code search has not produced an authoritative definition, so
do not infer whether that call opens its own Undo edit, how it composites layers,
or how it changes `layers_enabled` / selected-layer state.

Audit requirements:

1. keep this slice limited to `flatten_layers`; do not reopen the hardened
   create/delete/duplicate/merge/opacity/blend/move/rename actions;
2. verify from current Blockbench source/typing whether `Texture.flattenLayers()`
   exists in the target API and establish its exact mutation, Undo, layer-list,
   selected-layer, and refresh lifecycle before editing Local;
3. preserve the current `layers_enabled` guard, success text, and interface
   refresh unless source evidence proves the current contract is invalid;
4. confirm whether the existing outer Undo capture is sufficient for the
   composite bitmap plus layer-list/selection changes; avoid nested Undo if the
   native operation exposes an outer-transaction-safe path;
5. if the API is supported and compatible, make the smallest action-specific
   recoverability fix. If the call is stale/unsupported, correct only that
   contract/runtime path rather than inventing new flatten behavior;
6. do not add generic layer transactions, new flatten options, UV changes, paint
   features, or material redesign in this slice.

After this flatten audit, the next phase is the single closing Texture source
audit. If that audit finds no critical/major source gap, freeze Texture and move
the engineering sequence to Animation.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer flattening/renaming/selection,
undo/redo, texture rendering, UV/paint behavior, save/reopen persistence, and
viewport appearance remain `LOCAL PROOF REQUIRED` until local Blockbench testing
resumes.
