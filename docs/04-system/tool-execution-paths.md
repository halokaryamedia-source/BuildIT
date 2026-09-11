# LazyDesigner Tool Execution Paths

Updated: 2026-09-12

This document classifies how Runtime capabilities act on Blockbench. It exists to prevent normal authoring from drifting toward fragile mouse/dialog automation.

## Execution classes

```text
DIRECT_API
→ mutates/reads native Blockbench model objects or registries directly

NATIVE_SUBSYSTEM
→ uses a native Blockbench subsystem such as Painter, Timeline, Undo, Preview, ColorPanel, or codec lifecycle

EXACT_DATA
→ applies bounded deterministic bitmap/document/file operations without simulating UI interaction

UI_FALLBACK
→ triggers generic editor actions, fills dialogs, dispatches mouse events, or evaluates generic code
```

`BarItems.<tool>.select()` or `ColorPanel.set()` inside a purpose-built Painter capability is **NATIVE_SUBSYSTEM**, not UI emulation. It selects native tool state programmatically and does not move a pointer or discover controls visually.

`MouseEvent`, generic `Dialog.open` filling, generic `BarItems[action].trigger()`, or unrestricted eval-style control are **UI_FALLBACK** behavior.

## Normal authoring rule

Normal Geometry/Texturing/Animation authoring should prefer:

```text
DIRECT_API
→ NATIVE_SUBSYSTEM when the native subsystem owns semantics/Undo
→ EXACT_DATA when deterministic data mutation is the correct abstraction
```

`UI_FALLBACK` is maintenance/debug compatibility only. It must not become a required step in a normal authoring workflow when a semantic capability exists.

## Current representative map

| Area | Capability / owner | Class | Notes |
| --- | --- | --- | --- |
| Geometry | `manage_cubes` | DIRECT_API | Native Cube state + bounded batch mutation; no mouse/dialog path. |
| Geometry | Group/hierarchy tools | DIRECT_API | Native Group/Outliner relationships + Undo. |
| Geometry | `capture_model_views` | NATIVE_SUBSYSTEM | Deterministic offscreen Preview/camera capture; does not mutate the active editor camera. |
| History | `undo`, `redo`, checkpoints | NATIVE_SUBSYSTEM | Direct native Undo stack ownership. |
| Texture | `create_texture` / texture lifecycle | DIRECT_API | Native Texture/TextureGroup objects. |
| Texture | fill/shape/gradient/eraser/brush | NATIVE_SUBSYSTEM | Native Painter/ColorPanel/BarItem state; Painter owns stroke semantics/Undo. |
| Texture | `paint_texture_transaction` | EXACT_DATA | Revision-protected bounded bitmap transaction; one native Undo; optional verified PNG persistence. |
| Texture | exact-pixel branch of `paint_with_brush` | EXACT_DATA | Direct 1px bitmap edits under native Texture/Undo lifecycle. |
| Material | material/render-profile tools | DIRECT_API | Native texture/material/render state. |
| Animation | clip/keyframe/controller mutation | DIRECT_API / NATIVE_SUBSYSTEM | Native Animation/Animator state. |
| Animation | `manage_animation_timeline` | NATIVE_SUBSYSTEM | Direct Timeline state (`start`, `pause`, `setTime`, selection), not click automation. |
| Particle | inspect/manage particle | EXACT_DATA / NATIVE_SUBSYSTEM | Lossless Bedrock JSON mutation + optional native Animator preview. |
| Export | `export_model` | NATIVE_SUBSYSTEM / EXACT_DATA | Native codec compile/afterSave + verified filesystem write. |
| Maintenance | `trigger_action` | UI_FALLBACK | Generic BarItems action triggering. |
| Maintenance | `emulate_clicks` | UI_FALLBACK | Synthetic MouseEvent dispatch. |
| Maintenance | `fill_dialog` | UI_FALLBACK | Generic Dialog form mutation. |
| Maintenance | `risky_eval`, `from_geo_json` | UI_FALLBACK | Disabled/de-prioritized compatibility/debug path. |

## Texturing distinction

Painter tools intentionally use native Blockbench state:

```text
select native Painter tool
→ set native brush/fill/color state
→ invoke Painter stroke
→ Painter owns stroke lifecycle + Undo
```

This is preferable to mouse emulation.

Exact-pixel authoring intentionally uses a different path:

```text
validate exact-pixel eligibility
→ mutate bounded bitmap pixels directly
→ one native Undo
→ refresh canvas
```

Do not force exact pixels through simulated brush motion, and do not replace expressive Painter operations with raw bitmap writes when native Painter semantics are materially required.

## Efficiency rules

- Prefer one semantic mutation over sequences of generic editor actions.
- Prefer batch operations when the capability already supports them.
- Do not perform UI screenshots/readbacks after every deterministic mutation unless evidence is actually needed.
- Do not select or alter native tool state when an EXACT_DATA branch can complete without it.
- Keep UI fallbacks discoverable only for maintenance/debug compatibility.
- Do not remove native subsystem usage merely to reduce source lines; native Painter/Timeline/Undo semantics are capability, not overhead.

## Known optimization candidate

`paint_with_brush` currently configures native Brush state before deciding whether a request qualifies for its exact-pixel branch. The preferred implementation order is:

```text
resolve request + read required Painter guard state
→ determine exact-pixel eligibility
→ if exact: mutate exact pixels without selecting/changing Brush UI state
→ else: select/configure Brush and run native Painter stroke
```

This is a micro-optimization only. Apply it when local typecheck/targeted paint tests are available; do not risk a large remote rewrite of `paint.ts` solely for this change.

## Boundary

UI appearance changes do not improve Runtime execution unless they alter a real execution dependency. Improve the semantic/native adapter path, batching, evidence policy, or state setup—not the visual position of Blockbench controls.
