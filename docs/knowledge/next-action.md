# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, texture, and
material decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_CLOSING_AUDIT_BLOCKED_PAINT_SETTINGS`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Texture Exit Strategy

User-approved direction remains:

```text
finish remaining high-value Texture gaps
→ closing Texture source audit
→ if no critical/major source gap remains, freeze Texture
→ move to Animation
```

The layer-management sequence is source-hardened through `flatten_layers`.
The closing audit has now found one remaining **major** source/runtime blocker,
so Texture is not frozen yet.

## Closing Audit Finding

### Major blocker — `paint_settings` shadows Blockbench global `settings`

Current Local `mcp/server/tools/paint.ts::paint_settings` begins with:

```text
const settings: string[] = []
```

That local result array shadows Blockbench's global `settings` registry. Later,
when any of these supplied inputs are handled:

```text
paint_side_restrict
brush_opacity_modifier
brush_size_modifier
paint_with_stylus_only
pick_color_opacity
pick_combined_color
```

Local executes expressions shaped like:

```text
settings.paint_side_restrict.value = ...
```

but `settings` is the local array, so those properties are undefined and the
operation can throw instead of updating the Blockbench setting.

This is materially worse than cosmetic debt: earlier options in the same call
(`mirror_painting`, `lock_alpha`, `pixel_perfect`, `color_erase_mode`) may already
have mutated runtime state before a later shadowed setting throws, leaving a
partially-applied `paint_settings` request.

Current Blockbench source registers all six names above in its real global
`settings` registry, so the intended runtime owner is established. The failure is
Local variable shadowing, not an unsupported Blockbench capability.

## Completed Texture Boundary Kept In Place

Do not reopen the already-hardened work unless new evidence directly invalidates
it:

- deterministic texture/material/group targeting on the proven mutation paths;
- rollback boundaries for core texture/PBR creation/configuration/assignment;
- `create_texture` group/render/fill-layer parity;
- texture render observability;
- layer create/delete/duplicate/merge/opacity/blend/move/rename/flatten source
  hardening;
- stale `Texture.flattenLayers()` replacement with Blockbench's native
  disable-layer lifecycle.

These remain **source implemented**, not live-proven.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until direct callers can be
  exhaustively audited.
- save/reopen proof: later local validation.
- new UV/paint features: only after a concrete workflow proves a gap.
- broad public-surface reduction: later.

## Next Step

Fix **only** the `paint_settings` global-settings shadowing / partial-application
blocker in:

```text
mcp/server/tools/paint.ts
```

Requirements:

1. keep the slice limited to `paint_settings`; do not reopen layer management,
   texture/PBR targeting, UV tools, or other paint tools;
2. rename/separate the local string accumulator so it cannot shadow Blockbench's
   global `settings` registry;
3. write the six proven Blockbench settings through the actual global setting
   entries while preserving their current public inputs and result text intent;
4. inspect whether the operation needs an explicit preflight or rollback strategy
   to avoid partial application when a requested runtime setting is unavailable;
   do not invent model Undo for preference/state settings;
5. preserve mirror/lock-alpha/pixel-perfect/color-erase behavior unless direct
   source proof shows a related blocker;
6. no generic settings abstraction or broad paint refactor.

After this blocker is fixed, resume the closing Texture decision. If no additional
critical/major source blocker is proven, freeze Texture and set the single next
step to the Animation source audit.

## Proof Boundary

ChatGPT→GitHub can prove source ownership/control flow/API compatibility and static
diff only. Actual Blockbench setting mutation, paint behavior, texture rendering,
Undo/Redo, UV behavior, and persistence remain `LOCAL PROOF REQUIRED` until local
runtime testing resumes.
