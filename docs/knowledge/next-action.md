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

`REFERENCE_FIDELITY_CREATE_TEXTURE_FILL_LAYER_PARITY_HARDENED`

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
- `create_texture` now applies schema-provided `render_mode` and `render_sides`
  exactly once through the initial Texture constructor;
- `list_textures` remains read-only and now exposes `render_mode` and
  `render_sides` while preserving its existing identity/group fields;
- `create_texture(fill_color=..., layer_name=...)` now preserves the existing
  contract that `fill_color` requires `layer_name`, paints the existing texture
  bitmap as before, adds the Texture, then enables layers with
  `texture.activateLayers(false)` inside the already-open create transaction and
  names the generated base layer with the supplied `layer_name` before
  `Undo.finishEdit`.

These are **source implemented**, not live-proven.

## Latest Create-Texture Fill-Layer Finding

Before the latest change, the public contract was:

```text
fill_color?: color
layer_name?: string
fill_color → layer_name required
```

but execution only painted the Texture canvas; `layer_name` was destructured and
never used. The same mismatch existed in the upstream MCP source, so the field was
not merely a Local regression.

Blockbench-owned source establishes the intended layer lifecycle:

```text
Texture.activateLayers(false)
→ layers_enabled = true
→ if no layers:
   → create TextureLayer attached to this Texture
   → copy current texture canvas pixels into that layer
   → add/select the layer
```

`TextureLayer` has a direct `name` property, and Local's existing
`texture_layer_management` tool also treats `layer_name` as a real layer name.
`Texture.getUndoCopy()` serializes layer state when `layers_enabled`, so the
existing create-texture Undo owner remains sufficient for this newly-created
Texture; no separate nested Undo was added.

Current Local behavior is:

```text
create_texture(..., fill_color, layer_name)
→ existing validation/group preflight
→ Undo.initEdit({ textures: [], collections: [] })
→ try
   → construct Texture
   → existing fill/data/canvas setup
   → texture.add()
   → if fill_color + layer_name
      → texture.activateLayers(false)
      → texture.getActiveLayer().name = layer_name
   → Undo.finishEdit
→ catch rollback
→ success Canvas refresh/result
```

The data-file branch, blank-texture branch, render settings, PBR/group targeting,
result shape, and success refresh remain unchanged.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="create_layer")` lifecycle and Undo
parity when the target Texture does not yet have layers enabled** in:

```text
mcp/server/tools/paint.ts
```

Current observed path is:

```text
getAndActivateTexture(texture_id)
→ Undo.initEdit({
    textures: [texture],
    layers: texture.layers,
    bitmap: true
  })
→ action = create_layer
   → if !texture.layers_enabled
      → texture.activateLayers(true)
   → new TextureLayer({ name }, texture)
   → setSize(texture.width, texture.height)
   → addForEditing()
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: create_layer")
→ updateInterfacePanels()
```

Blockbench source shows `Texture.activateLayers(true)` opens and finishes its own
Undo edit. Calling it after this MCP tool has already opened an Undo edit creates
a nested transaction boundary. The tool also has no rollback boundary if layer
activation/construction/addition/update/finish fails.

Audit requirements:

1. keep this slice limited to the `create_layer` action; do not fix/delete/
   duplicate/merge/opacity/blend/move/rename/flatten actions yet;
2. preserve `getAndActivateTexture`, the existing `layer_name` default naming,
   layer size, `addForEditing()`, success result, `updateChangesAfterEdit()`, and
   `updateInterfacePanels()` behavior;
3. confirm the existing outer Undo scope is sufficient for enabling layers plus
   adding the new layer; if so, call `texture.activateLayers(false)` so enabling
   the base layer participates in the already-open MCP transaction rather than
   opening another one;
4. if any operation after the outer `Undo.initEdit` fails during this action,
   cancel/revert the open edit, refresh the required Blockbench state, and
   rethrow;
5. do not redesign the layer-management API, add a generic transaction helper,
   or broaden into layer observability/selection semantics in this slice.

Prefer the smallest source change that establishes one Undo transaction for the
entire create-layer operation. Keep any broader `texture_layer_management`
cleanup as later evidence-driven work.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/Undo/Blockbench-source structure
and static diff only. Actual layer creation, selection, undo/redo, texture
rendering, file loading, and viewport appearance remain `LOCAL PROOF REQUIRED`
until local Blockbench testing resumes.
