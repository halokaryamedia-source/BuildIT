# MCP Pre-Local Generic Semantics Audit

Updated: 2026-08-10

## Scope

This review narrows clearly generic semantics that remained inside otherwise-retained Bedrock Entity families. It is **not** a second capability deletion pass.

Official source basis: `JannisX11/blockbench` master as audited at commit `47e633e4a1338f957ee7baa0acbcf54da11e77df`.

## Official source findings

### Native Bedrock Entity format

`js/formats/bedrock/bedrock.js` defines the entity `ModelFormat` with:

```text
id: bedrock
codec: bedrock
animation_codec: bedrock AnimationCodec
```

The same format explicitly enables native Bedrock features including Cube rotation/UV, bone rig, animated textures, animation files/controllers, bone binding expressions, locators, texture meshes, bounding boxes, and PBR.

### Model codecs

The Bedrock geometry codec is `Codec('bedrock')` and compiles Minecraft `minecraft:geometry` JSON. The editable Blockbench project codec is independently `Codec('project')` with `.bbmodel` extension in `js/formats/bbmodel.js`.

### Animation output ownership

`js/formats/bedrock/bedrock_animation.js` defines `AnimationCodec('bedrock')`. Bedrock animation/controller file behavior therefore must not be inferred from, or removed by narrowing, the generic `Codecs` model-export registry.

## E decisions

### `create_project`

**NARROW** to the native Bedrock Entity format only.

Reason: arbitrary `Formats[format]` project creation is generic Blockbench behavior, while BlockIT's product boundary is Bedrock Entity. Existing/open Bedrock projects remain supported.

### model export

**NARROW** generic `Codecs` enumeration/execution to:

```text
bedrock  -> native Minecraft Bedrock geometry JSON
project  -> editable Blockbench .bbmodel
```

Do not interpret this as animation reduction; Bedrock animations/controllers are owned by the separate native AnimationCodec and remain protected capability targets.

### camera helpers

Keep exposed:

```text
capture_screenshot
capture_model_views
```

Default-disable but source-preserve:

```text
capture_app_screenshot
set_camera_angle
```

Reason: full application capture and arbitrary active-camera mutation are generic UI/editor conveniences. Canonical Bedrock model observation already has a deterministic non-mutating owner.

### `apply_texture`

**DEFAULT-DISABLE** the inherited generic per-face `Texture.apply()` wrapper.

Official Blockbench Bedrock Entity source defines `id: bedrock` with `single_texture: true`. The native Texture menu exposes face/blank/element apply actions only when `!Format.single_texture`, and `Face.getTexture()` resolves `Texture.getDefault()` for non-null faces when `Format.single_texture` is active. BlockIT already exposes `activate_texture`, which explicitly selects the intended Texture and therefore owns the active/default working texture without per-face apply or nested Undo.

Keeping `apply_texture` enabled would add one generic tool to Codex, duplicate active-texture intent, retain ambient face-selection semantics for one mode, and invoke native `Texture.apply()` inside an outer BlockIT Undo edit. None of those are required Bedrock Entity capability. Source/catalog evidence remains for maintainers, but the tool is not callable from the enabled Bedrock MCP surface.
### `filter_by_material`

**DEFAULT-DISABLE** raw per-face texture discovery for Bedrock Entity.

The retained implementation resolves one Texture but matches Cubes by raw `face.texture === texture.uuid/id`. Official Blockbench Bedrock Entity is `single_texture`, and native `Face.getTexture()` uses `Texture.getDefault()` for non-null faces in that format. Raw per-face texture identity therefore does not own effective Bedrock texture selection and can preserve stale/generic metadata after `apply_texture` is removed from the default surface.

Normal Bedrock texture discovery remains `list_textures` + active/default texture state, while native per-face authored differentiation remains `material_instance`. Keeping `filter_by_material` callable would expose a misleading generic concept rather than a Bedrock capability.
### `place_cube` texture / UV boundary

**NARROW** inherited generic texture-routing semantics while preserving native Bedrock UV authoring.

Official Bedrock Entity is `single_texture`. Native `CubeFace.texture` defaults non-null, `Cube.init()` binds non-null faces to `Texture.getDefault()` when available, and Bedrock per-face export uses only `face.texture !== null` to decide whether a UV face entry exists; it does not export a per-Cube texture UUID. `Cube.applyTexture()` with `faces === undefined` also consults ambient `UVEditor.face`.

Therefore `place_cube` no longer accepts an explicit per-Cube texture selector, `faces:false`, or a face-name-only texture list. Default `true` keeps the project-inherited UV mode and native per-face auto mapping where applicable. Explicit custom `{face, uv}` entries are retained, require finite UV values, and create that Cube as `box_uv=false` so the requested per-face UV data is actually exportable. No separate UV mode framework or face-disable capability was added.
### `modify_cube` authored-state boundary

**NARROW + HARDEN** single-Cube correction to state that is useful to Bedrock modelling.

Bedrock geometry compilation serializes Cube `inflate`, box-UV `uv_offset`, and conditional UV mirror, while native Cube `shade` is Java-shading-feature state and editor palette `color` is not part of Bedrock geometry output. `modify_cube` therefore rejects generic `shade`/`color` inputs, requires finite `inflate`/`uv_offset`, and keeps UV authoring controls that can affect Bedrock UV state.

The mutation result now owns the same state it can change: name, transform, inflate, box-UV context, UV offset, mirror, autouv, and visibility. Exact same-value requests fail before Undo instead of creating false progress. Batch correction scope is unchanged.
### validator references

Keep validator resources, but mark regex-derived `elementRefs` as:

```text
elementRefsSource: message_heuristic | none
elementRefsAuthoritative: false
```

A parser guess from localized/human-readable validator text is useful navigation context but not authored identity evidence.

### `nodes://{id}`

**DEFER — retain for now.**

The resource is broad/generic, but direct BlockIT mappings for native Locator and TextureMesh authored state are still protected gaps. Removing the broad node observation route before those gaps are closed would reduce observability while pretending the product became cleaner. Audit and replace it only together with explicit Locator/TextureMesh inspection ownership.

## Guardrail

No change in this slice authorizes removal of Locator, TextureMesh, native bounding boxes, animated textures, animation controllers, sound/timeline effects, or bone binding expressions. Those remain protected by the capability matrix until their direct MCP mapping is audited.
