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

`REFERENCE_FIDELITY_TEXTURE_LAYER_MOVE_HARDENED`

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
- `texture_layer_management(action="delete_layer")` uses the same outer
  transaction model, calls `TextureLayer.remove(false)` explicitly, and rolls
  back removal/update/finish failures;
- `texture_layer_management(action="duplicate_layer")` follows Blockbench's
  native copy lifecycle (`getUndoCopy(true)` → `new TextureLayer` →
  `addForEditing()`), preserves the MCP `"<name> copy"` naming rule, and rolls
  back copy/construction/addition/update/finish failures;
- `texture_layer_management(action="merge_down")` participates only in the outer
  MCP Undo transaction via `mergeDown(false)`, preserving native compositing,
  removal, adjacent selection, and no-lower-layer behavior while rolling back
  merge/update/finish failures;
- `texture_layer_management(action="set_opacity")` preserves the public and
  Blockbench-native 0..100 percentage contract, performs one texture update, and
  rolls back assignment/update/finish failures;
- `texture_layer_management(action="set_blend_mode")` validates against the
  current Blockbench-owned `TextureLayer.blend_mode` values with a file-local
  schema and has an action-specific rollback boundary with exactly one texture
  update;
- `texture_layer_management(action="move_layer")` now treats `target_index` as
  an explicit 0-based **final layer index**. The MCP schema requires a
  non-negative integer, execution rejects `target_index >= texture.layers.length`
  before array mutation, and valid moves retain the native Blockbench reorder
  pattern (`remove` → `splice` → one texture update) inside the existing outer
  MCP Undo edit. Validation/reorder/update/finish failures cancel/revert the edit,
  refresh Canvas/interface state, and rethrow. `rename_layer` and
  `flatten_layers` retain their previous common path pending their own audits.

These are **source implemented**, not live-proven.

## Latest Move-Layer Finding

Before the latest change:

```text
target_index
→ z.number().optional()

move_layer
→ require selected layer
→ require target_index
→ texture.layers.remove(selected)
→ texture.layers.splice(target_index, 0, selected)
→ common texture update + finish
```

That allowed fractional, negative, and oversized values to reach JavaScript
`splice()`, where coercion/clamping could silently move a layer somewhere other
than the requested position.

Current Local behavior is:

```text
target_index
→ z.number().int().nonnegative().optional()
→ "0-based final layer index"

outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = move_layer
   → try
      → require TextureLayer.selected
      → require target_index
      → require target_index < texture.layers.length
      → layerToMove = TextureLayer.selected
      → texture.layers.remove(layerToMove)
      → texture.layers.splice(target_index, 0, layerToMove)
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: move_layer")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return move result
```

Current Blockbench drag reorder uses the same mutation shape after it calculates a
concrete valid array index: remove the layer, splice it at that index, update the
texture, then finish one Undo edit. The MCP keeps its explicit final-index API
rather than copying UI drag/drop calculations.

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

Audit **`texture_layer_management(action="rename_layer")` Undo recoverability and
property-update parity** in:

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
→ action = rename_layer
   → require TextureLayer.selected
   → require truthy layer_name
   → oldName = TextureLayer.selected.name
   → TextureLayer.selected.name = layer_name
   → result = `Renamed layer from "${oldName}" to "${layer_name}"`
→ common texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: rename_layer")
→ updateInterfacePanels()
```

Blockbench's native layer-properties path treats the layer name as a normal
`TextureLayer` property edit: it opens Undo for the layer, applies the form data,
updates the texture, then finishes the edit.

The MCP mutation itself is therefore compatible, but the current common path has
no rollback if the selected-layer check, required-name check, assignment, update,
or outer finish fails after `Undo.initEdit()` has opened.

Important contract detail: `layer_name` is shared with `create_layer`, where an
omitted/falsy name currently falls back to the generated default name. Do **not**
globally tighten the shared schema in a way that changes `create_layer` behavior
just to harden rename.

Audit requirements:

1. keep this slice limited to `rename_layer`; do not change flatten or the
   hardened create/delete/duplicate/merge/opacity/blend/move actions;
2. preserve the current selected-layer requirement, current truthy-name
   requirement, direct name assignment, result text, and interface refresh;
3. preserve current `create_layer` `layer_name` fallback semantics and avoid a
   shared-schema change unless fresh caller proof shows it is safe;
4. confirm the existing outer Undo scope is sufficient for the selected layer
   property change; perform one required texture update and finish the outer edit;
5. if validation after Undo, assignment, update, or outer finish fails,
   cancel/revert the open edit, refresh required Canvas/interface state, and
   rethrow;
6. do not add duplicate-name rules, sanitization, generic layer-property helpers,
   or transaction abstractions in this slice.

After `rename_layer`, audit `flatten_layers` only if a concrete current source/API
transaction gap remains. Then run the single closing Texture source audit before
moving to Animation.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer ordering/renaming/selection,
undo/redo, texture rendering, UV/paint behavior, save/reopen persistence, and
viewport appearance remain `LOCAL PROOF REQUIRED` until local Blockbench testing
resumes.
