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

`REFERENCE_FIDELITY_TEXTURE_LAYER_BLEND_UNDO_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Current Texture Exit Strategy

The current user-approved direction is to avoid indefinite low-level Texture
hardening:

```text
finish remaining high-value Texture layer gaps
→ run one closing Texture source audit
→ if no critical/major source gap remains, freeze Texture
→ move the engineering sequence to Animation
```

Do not chase theoretical 100% coverage before Animation. Remaining Texture work
must be justified by a concrete current source/API/contract gap.

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
  current Blockbench-owned `TextureLayer.blend_mode` values using a file-local
  schema: `default`, `set_opacity`, `color`, `multiply`, `add`, `darken`,
  `lighten`, `screen`, `overlay`, `difference`, and `alpha_mask`. The older
  shared `layerBlendModeEnum` and paint-tool `blendModeEnum` remain unchanged;
- `texture_layer_management(action="set_blend_mode")` now also has an
  action-specific recoverable transaction path. It preserves the validated
  direct assignment, performs exactly one `texture.updateChangesAfterEdit()`,
  finishes the existing outer MCP edit, and on assignment/update/finish failure
  calls `Undo.cancelEdit(true)`, refreshes Canvas/interface state, and rethrows.
  `move_layer`, `rename_layer`, and `flatten_layers` retain their previous common
  path pending their own evidence-backed audits.

These are **source implemented**, not live-proven.

## Latest Layer-Blend Undo Finding

After the input-contract slice, the remaining runtime path was:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = set_blend_mode
   → require TextureLayer.selected
   → require validated blend_mode
   → TextureLayer.selected.blend_mode = blend_mode
   → texture.updateChangesAfterEdit()
   → result = `Set layer blend mode to ${blend_mode}`
→ common texture.updateChangesAfterEdit() again
→ Undo.finishEdit("Layer management: set_blend_mode")
→ updateInterfacePanels()
```

This duplicated the texture update and left the open Undo edit without rollback
if assignment, update, or finish failed.

Current Local behavior is now:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = set_blend_mode
   → try
      → require TextureLayer.selected
      → require validated blend_mode
      → TextureLayer.selected.blend_mode = blend_mode
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: set_blend_mode")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return blend-mode result
```

The file-local Blockbench-native blend-mode schema, selected-layer requirement,
direct assignment, result text, and interface refresh are unchanged. No shared
enum or generic transaction helper was modified.

During the full-file write, two unrelated gradient schema descriptions changed
accidentally; an immediate follow-up source commit restored them. The net source
diff from the slice starting head therefore contains only the intended
`set_blend_mode` transaction change.

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

Audit **`texture_layer_management(action="move_layer")` target-index contract,
Blockbench reorder parity, and Undo recoverability** in:

```text
mcp/server/tools/paint.ts
```

Current Local contract/path is:

```text
target_index
→ z.number().optional()
→ "Target position for moving layers."

outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = move_layer
   → require TextureLayer.selected
   → require target_index
   → layerToMove = TextureLayer.selected
   → texture.layers.remove(layerToMove)
   → texture.layers.splice(target_index, 0, layerToMove)
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: move_layer")
→ updateInterfacePanels()
```

The public schema currently permits fractional, negative, and arbitrarily large
numbers. JavaScript `splice()` can coerce/truncate or reinterpret those values,
so an invalid caller position may silently move the layer somewhere other than
the requested position instead of failing closed.

Current Blockbench layer-drag source provides the native reorder pattern:

```text
calculate a concrete array index
→ reject missing/same target before mutation
→ Undo.initEdit({ textures: [texture] })
→ texture.layers.remove(layer)
→ texture.layers.splice(index, 0, layer)
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Reorder layers")
```

The MCP operation can keep its explicit final-index API, but that index must be a
valid concrete array position before removal/splice and the already-open outer
edit must be recoverable.

Audit requirements:

1. keep this slice limited to `move_layer`; do not change rename, flatten, or the
   hardened create/delete/duplicate/merge/opacity/blend actions;
2. preserve `target_index` as the requested **0-based final layer index**, current
   selected-layer requirement, success result, selection identity, and interface
   refresh;
3. tighten the MCP boundary to a non-negative integer and validate the dynamic
   upper bound against the current layer list before array mutation; invalid
   positions must fail rather than relying on `splice()` coercion/clamping;
4. preserve the existing outer Undo capture if sufficient, perform the reorder
   with the existing remove/splice semantics, update once, and finish the outer
   edit without nested Undo;
5. if validation after Undo, removal/splice, update, or outer finish fails,
   cancel/revert the open edit, refresh required Canvas/interface state, and
   rethrow;
6. do not redesign drag/drop semantics, introduce aliases such as top/bottom, or
   add a generic reorder/transaction helper in this slice.

After `move_layer`, continue only to the next remaining Texture layer action if a
concrete source gap is proven. When the major layer actions are exhausted, run a
single closing Texture source audit before moving to Animation.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer ordering/selection, undo/redo,
texture rendering, UV/paint behavior, save/reopen persistence, and viewport
appearance remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
