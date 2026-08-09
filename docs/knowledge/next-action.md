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

`REFERENCE_FIDELITY_TEXTURE_LAYER_OPACITY_PARITY_HARDENED`

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
- `texture_layer_management(action="set_opacity")` now preserves the public and
  Blockbench-native 0..100 percentage contract. The validated MCP value is
  assigned directly to `TextureLayer.opacity` instead of being divided by 100.
  The action performs one texture update, finishes the existing outer MCP edit,
  and rolls back assignment/update/finish failures with Canvas/interface refresh.
  Remaining layer-management actions retain their previous path.

These are **source implemented**, not live-proven.

## Latest Layer-Opacity Parity Finding

Before the latest change, the MCP contract and execution disagreed:

```text
opacity schema
→ number 0..100
→ "Layer opacity percentage"

set_opacity
→ TextureLayer.selected.opacity = opacity / 100
```

Blockbench's native layer-opacity control proves `TextureLayer.opacity` itself is
percentage-based:

```text
slider range: 0..100
get(): layer.opacity
change(): layer.opacity = clamp(value, 0, 100)
```

Therefore an MCP request of `50` should store `50`, not `0.5`.

Current Local behavior is:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = set_opacity
   → try
      → require TextureLayer.selected
      → require opacity
      → TextureLayer.selected.opacity = opacity
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: set_opacity")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return `Set layer opacity to ${opacity}%`
```

This also removes the previous duplicate `updateChangesAfterEdit()` call for this
action while preserving the schema range, selected-layer check, result text, and
interface refresh.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="set_blend_mode")` input-contract parity**
in:

```text
mcp/lib/zodObjects.ts
mcp/server/tools/paint.ts
```

Current Local public schema uses the shared `layerBlendModeEnum`:

```text
normal
multiply
screen
overlay
soft_light
hard_light
color_dodge
color_burn
darken
lighten
difference
exclusion
```

Current Blockbench `TextureLayer.blend_mode` values are:

```text
default
set_opacity
color
multiply
add
darken
lighten
screen
overlay
difference
alpha_mask
```

The current MCP enum therefore accepts several values Blockbench does not own and
rejects several values Blockbench does own. Execution then assigns the supplied
value directly to `TextureLayer.selected.blend_mode`.

Audit requirements:

1. audit every direct caller of shared `layerBlendModeEnum` before changing that
   shared owner; GitHub code search has already shown incomplete indexing in this
   repository, so do not treat a zero-result search as exhaustive proof;
2. for `texture_layer_management(action="set_blend_mode")`, accept only the
   current Blockbench-owned blend-mode values; do not invent aliases or translate
   unsupported names silently;
3. preserve the selected-layer requirement, result text, existing outer Undo
   scope, and direct assignment semantics once the value is valid;
4. keep this slice focused on input/value parity. Do **not** fold the remaining
   `set_blend_mode` rollback/double-update cleanup into the same change unless the
   audit proves it inseparable;
5. do not redesign paint-tool blend modes, layer UI behavior, or introduce a
   generic enum/resolver framework.

Primary semantic owner for this slice is the MCP public/input contract. Use
`mcp-server-development` after the mandatory `development-brief`; switch back to
`blockbench-runtime-development` only for a later runtime/Undo-only slice.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer opacity/blend rendering, layer
selection, undo/redo, texture rendering, and viewport appearance remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
