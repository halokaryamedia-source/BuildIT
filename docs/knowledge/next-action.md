# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, texture, and
material decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_CLOSING_AUDIT_BLOCKED_SELECTION_MATRIX`

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
The closing audit first found and has now source-fixed the `paint_settings`
shadowing blocker, but the resumed audit found one additional **major** current
Texture-selection API blocker. Texture is therefore not frozen yet.

## Latest Completed Blocker — `paint_settings`

The previous Local implementation created:

```text
const settings: string[] = []
```

inside `paint_settings`, shadowing Blockbench's real global `settings` registry.
Six supplied preferences could therefore attempt property writes on the local
array and throw after earlier paint options had already mutated runtime state.

Current Local now:

- uses `appliedSettings: string[]` only as the result accumulator;
- preflights every requested Blockbench setting before any paint-setting mutation:
  `paint_side_restrict`, `brush_opacity_modifier`, `brush_size_modifier`,
  `paint_with_stylus_only`, `pick_color_opacity`, and `pick_combined_color`;
- fails before mutation if a requested setting entry is unavailable;
- writes those six preferences through Blockbench's real `Setting.set(...)`
  API, which is the typed setting setter that applies `onChange` and persistence;
- preserves the existing public inputs and result text intent for mirror painting,
  lock alpha, pixel perfect, color erase, and the six global settings.

Source commit:

```text
1a5c90a873daa036294ce7694147727d5b94368d
fix: use Blockbench paint settings registry
```

The source commit diff is limited to `paint_settings`. No model Undo was invented
for preference/state settings. Live preference behavior remains local proof.

## Closing Audit Finding — Texture Selection API

### Major blocker

Current Local `texture_selection` publicly exposes:

```text
invert_selection
expand_selection
contract_selection
feather_selection
```

and executes them as:

```text
selection.invert()
selection.expand(radius)
selection.contract(radius)
selection.feather(radius)
```

where `selection` is `texture.selection`, a Blockbench `IntMatrix`.

Current official `blockbench-types` for `IntMatrix` exposes operations such as:

```text
activate
get / allow / getDirect
getBoundingRect / hasSelection
set / clear / setOverride
changeSize / forEachPixel / translate
toBoxes / maskCanvas
```

but does **not** declare `invert`, `expand`, `contract`, or `feather`.
Current official Blockbench source searches for `selection.invert` and
`expand_selection` also produced no implementation proving those calls exist.
This means the four Local actions are currently stale/unsupported at the source
contract level and may throw instead of modifying a texture selection.

`select_rectangle`, `select_ellipse`, `select_all`, and `clear_selection` are not
reopened by this finding.

## Completed Texture Boundary Kept In Place

Do not reopen already-hardened work unless new evidence directly invalidates it:

- deterministic texture/material/group targeting on proven mutation paths;
- rollback boundaries for core texture/PBR creation/configuration/assignment;
- `create_texture` group/render/fill-layer parity;
- texture render observability;
- layer create/delete/duplicate/merge/opacity/blend/move/rename/flatten source
  hardening;
- stale `Texture.flattenLayers()` replacement with Blockbench's native
  disable-layer lifecycle;
- `paint_settings` global-settings shadowing fix and requested-setting preflight.

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

Audit and correct **only** the unsupported `texture_selection` IntMatrix actions
in:

```text
mcp/server/tools/paint.ts
```

Requirements:

1. keep the slice limited to `invert_selection`, `expand_selection`,
   `contract_selection`, and `feather_selection`; do not reopen layer management,
   `paint_settings`, texture/PBR targeting, or unrelated paint tools;
2. verify current Blockbench source for the real native selection behavior or
   establish that a given operation no longer exists before changing the public
   contract;
3. do not call methods absent from current `IntMatrix`; if equivalent behavior is
   still supported, implement it only through current Blockbench-owned selection
   primitives and preserve the existing action meaning;
4. if an advertised operation has no current Blockbench-equivalent behavior,
   remove/reject only that unsupported action rather than inventing a new image
   processing subsystem;
5. preserve the already-working rectangle/ellipse/select-all/clear paths unless
   direct source proof invalidates them;
6. keep Undo/update handling bounded to the actual supported selection mutation;
   no generic selection framework or broad UV redesign.

After this blocker is resolved, resume the closing Texture decision. If no
additional critical/major source blocker is proven, freeze Texture and set the
single next step to the Animation source audit.

## Proof Boundary

ChatGPT→GitHub can prove source ownership/control flow/API compatibility and static
diff only. Actual Blockbench preference mutation, selection behavior, texture
rendering, Undo/Redo, UV behavior, and persistence remain `LOCAL PROOF REQUIRED`
until local runtime testing resumes.
