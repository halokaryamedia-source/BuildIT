# MCP Capability Backlog

Updated: 2026-09-01

Authority: **`Local` only**.

This file records capability gaps discovered from BlockIT audits against official Blockbench documentation, native Blockbench source, current Minecraft Bedrock schemas/guides, and public Blockbench MCP implementations. It is backlog/design state, not runtime proof.

## Goal

Improve **Cost to Accepted Result** while keeping one obvious owner for each normal workflow.

Preserve:

- Bedrock-specific ownership;
- UUID-first targeting;
- full preflight / fail-closed mutation;
- coherent Undo;
- Geometry → Texturing → Animation phase boundaries;
- generated-doc discipline;
- visual proof as final quality authority;
- conditional/lazy coverage for uncommon native features instead of bloating the hot tool surface.

## Current Gate

Public ToolSpec/schema or runtime prompt changes require `LOCAL_CODE` because canonical prompt/API output must be generated with Bun. Never hand-edit generated prompt/API files remotely.

```text
REMOTE-SAFE FOUNDATION
→ LOCAL PUBLIC-CONTRACT IMPLEMENTATION
→ bun run prompts:build
→ bun run docs:build
→ bun run docs:check
→ bun run verify:mcp
→ LIVE Geometry → Texturing → Animation E2E
→ measure Cost to Accepted Result
→ evidence-gated follow-up work
```

Remote-safe foundations currently prepared:

```text
mcp/lib/facePixelMapping.ts
mcp/tests/face-pixel-mapping.test.ts
mcp/lib/orientedBoxContact.ts
mcp/tests/oriented-box-contact.test.ts
mcp/lib/blockbenchCubeObb.ts
mcp/tests/blockbench-cube-obb.test.ts
mcp/lib/textureRevision.ts
mcp/tests/texture-revision.test.ts
mcp/lib/textureFrameMapping.ts
mcp/tests/texture-frame-mapping.test.ts
mcp/lib/pbrMaterialMembership.ts
mcp/tests/pbr-material-membership.test.ts
mcp/lib/animationPreviewState.ts
mcp/tests/animation-preview-state.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Geometry — Full Coverage Curation

Geometry was re-audited against official Blockbench modeling/reference docs, native Bedrock codec/outliner behavior, current `minecraft:geometry` capabilities, and public MCP implementations.

## Final normal Geometry surface target

Target normal surface: **about 26 tools**.

```text
CORE / SETUP / EVIDENCE
1  create_project
2  configure_project
3  get_project_info
4  inspect_model_bounds
5  undo
6  redo
7  get_undo_stack
8  list_outline
9  find_elements_by_criteria
10 get_selection
11 inspect_element
12 capture_model_views
13 export_model
14 list_textures

GEOMETRY AUTHORING / CORRECTION
15 place_cube
16 modify_cubes_batch
17 add_group
18 duplicate_element
19 remove_element
20 rename_element
21 modify_group
22 reparent_element
23 manage_locator
24 manage_geometry_reference
25 measure_geometry
26 manage_texture_mesh
```

Remove from the normal Geometry surface after local consolidation:

```text
modify_cube
select_all_of_type
list_locator_elements
manage_null_object
bone_rigging
```

Conditional / extended Geometry:

```text
manage_bounding_box
manage_item_display_transform
```

Remote-safe Geometry correctness work already on `Local` includes faithful native duplication, export-safe identity guards, complete structural preflight before Undo, exact Cube `inflate`/export inspection, world-space OBB extraction, and SAT contact classification. Geometry remains **LOCAL PROOF REQUIRED** until public consolidation, generated artifacts, local tests, and live E2E pass.

---

# Texturing — Full Coverage Curation

Texturing was re-audited against:

- official Blockbench Paint Mode, Texture, TextureLayer, TextureGroup, PBR/material, and animated-texture behavior;
- native `JannisX11/blockbench` texture/Painter/layer/flipbook/material source;
- Minecraft Bedrock texture-set / Vibrant Visuals PBR semantics including MER/MERS and normal-vs-height exclusivity;
- public Blockbench MCP implementations including SwagRee, sosadly, Jason Gardner, XiaoNetwork-Astral, adhi-jp and others.

The goal is **full relevant Bedrock Texturing coverage with a much smaller hot tool surface**. UI buttons are not MCP capability owners by default: the artifact/result semantic is the owner.

## Current Texturing surface problem

The current normal catalog exposes roughly:

```text
11 Texturing-specific texture tools
12 Painter/editor-state tools
5 material-instance tools
+ shared Core
```

That is too granular. Many tools expose Blockbench UI state rather than distinct accepted-result intents.

Examples of duplicated/over-granular normal routes:

```text
paint_fill_tool
draw_shape_tool
gradient_tool
paint_with_brush
eraser_tool
copy_brush_tool
color_picker_tool
paint_settings
create_brush_preset
load_brush_preset
texture_selection
texture_layer_management
```

Blockbench supports those editor actions, but BlockIT does not need one public MCP tool per button.

## Final normal Texturing surface target

Target normal Texturing-specific surface: **about 10 tools**, plus the shared Core surface.

```text
TEXTURE INVENTORY / LIFECYCLE
1  create_texture
2  configure_texture
3  remove_texture
4  get_texture
5  export_texture

BITMAP AUTHORING
6  paint_texture

PBR / MATERIAL
7  create_pbr_material
8  configure_material
9  list_materials
10 get_material_info
```

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before Texturing handoff.

After Geometry/Core consolidation this implies roughly:

```text
~14 shared Core/setup/evidence
+ 10 Texturing-specific
= ~24 normal Texturing-phase tools
```

instead of the current ~43.

## Remove / retire from the normal Texturing surface

The following normal names should disappear after local public-contract consolidation because their semantics are absorbed by the canonical owners below:

```text
paint_fill_tool
draw_shape_tool
gradient_tool
color_picker_tool
copy_brush_tool
eraser_tool
paint_settings
paint_with_brush
create_brush_preset
load_brush_preset
texture_selection
texture_layer_management
add_texture_group
activate_texture
assign_texture_channel
get_face_material_instances
set_face_material_instance
bulk_set_material_instances
clear_material_instances
import_texture_set
save_material_config
```

Do not delete source capability merely to reduce names until replacement contracts are implemented and generated outputs/tests pass.

---

## Texturing ownership decisions

### `create_texture` — one creation/import/clone owner

Correct the known omitted-dimension defect and keep creation deterministic.

Required dimension contract:

```text
width + height present → exact explicit bitmap
width only             → FAIL
height only            → FAIL
neither                → derive only for supported source/role
```

Resolution semantics:

```text
blank base-color atlas
  → derive Project.texture_width × Project.texture_height
  → dimension_source=project_logical_uv

blank explicit color variant
  → require established base atlas
  → match base bitmap
  → dimension_source=base_atlas

blank PBR support
  → require material + established base
  → match base bitmap
  → dimension_source=base_atlas

absolute image file
  → preserve native image dimensions when explicit resize was not requested
  → dimension_source=imported_file

data URL
  → explicit width+height until local native inference is proven
```

Important correction from the earlier provisional policy: **128×128 is the BlockIT default, not a universal Bedrock requirement**. Native Bedrock authored textures may be rectangular, including common 64×32 layouts. Imported content must preserve valid authored dimensions; blank production policy should not reject rectangular project logical UV merely because it is not square.

Creation also absorbs native clone/variant creation:

```text
source_texture?: UUID
```

A clone copies the bitmap internally; ChatGPT must not round-trip a full PNG just to create a color variant or support atlas.

`fill_color` should fill the base bitmap directly. Do not activate Texture layers merely so a caller can name a fill layer. Layers are an explicit conditional workflow.

Creation returns compact provenance:

```text
creation:
  dimension_source: project_logical_uv | base_atlas | explicit | imported_file | source_texture
  requested_dimensions: [w,h] | null
  resolved_dimensions: [w,h]
```

### `configure_texture` — one Texture lifecycle/property owner

Add one explicit owner for existing Texture metadata/bitmap lifecycle that is currently missing.

Normal bounded fields/actions may cover:

```text
name?
render_mode?
render_sides?
resize_bitmap?
  width
  height
  sampling: nearest
```

Bitmap resize changes physical pixels only. Changing project logical UV belongs to Geometry/Core `configure_project`; Texturing must hand off instead of silently rescaling Geometry UV layout.

Animated frame authoring is conditional and belongs to `manage_animated_texture`, not this normal owner, except read-only animation metadata may be returned here/list_textures.

### `remove_texture` — explicit destructive lifecycle owner

Texture deletion must be explicit and fail closed when removing a referenced/base/PBR texture would leave ambiguous production state. Report affected material/group usage and require caller intent where destructive dependencies exist.

Do not hide deletion inside `configure_texture`.

### `get_texture` — single exact bitmap/readback owner

Expand instead of creating separate read tools.

Conceptual scopes:

```text
scope: full | frame | face | rect | pixels
```

Return only what the requested scope needs:

```text
texture metadata
frame metadata when animated
mapped atlas rect for face/rect reads
preview image when useful
bounded exact RGBA for exact reads
revision
optional objective stats: unique colors / alpha counts / histogram
```

This absorbs the useful semantics of external-tool ideas such as:

```text
get_texture_region
get_face_grid
get_texture_revision
color picker
palette analysis
```

without adding separate hot tools.

`revision` uses `mcp/lib/textureRevision.ts`. Exact destructive calls may accept `expected_revision`; stale state must fail before Undo/bitmap mutation.

### `paint_texture` — the single normal bitmap mutation owner

This supersedes the earlier plan to add `paint_face_features` while keeping multiple Painter wrappers. Full coverage audit shows one discriminated bitmap owner is cleaner and cheaper.

Target is explicit:

```text
target:
  kind: atlas
  rect?: ...
  frame?: ...

or

target:
  kind: face
  cube: UUID/name
  face: north|south|east|west|up|down
  frame?: ...
```

No implicit selected Cube/face. Texture identity is explicit when more than one candidate exists.

Bounded exact operations should cover result semantics rather than UI tools:

```text
fill / flood
rect
ellipse
line
stroke
pixels
gradient
erase
replace_color
copy_region / copy_face
flip_x / flip_y
rotate_90 / rotate_180 / rotate_270
```

Per-op options may include only values that affect the resulting bitmap, such as:

```text
color / opacity
blend_mode
brush size / softness / shape
lock_alpha
```

Do not expose global Painter state, stylus settings, selection state, brush-preset state, or mirror-paint UI state as normal authoring requirements.

Face-local targets use `mcp/lib/facePixelMapping.ts` for exact UV/rotation/flip mapping. Animated targets additionally use `mcp/lib/textureFrameMapping.ts` to map caller-visible frame-local pixels to the stacked physical bitmap.

Mutation contract:

```text
one request
→ full target/op expansion and validation
→ optional expected_revision check
→ one bitmap Undo snapshot
→ apply exact writes
→ exact affected-pixel readback
→ mismatch: cancel/recover + throw
→ match: finish one Undo
```

Visual/artistic acceptance still requires fresh atlas + mapped-model evidence. Exact write verification is execution proof, not artistic `PASS`.

### UI-state Painter wrappers leave the normal hot surface

Semantics are covered without preserving one MCP tool per editor control:

```text
color_picker_tool      → get_texture(scope=pixels)
eraser_tool            → paint_texture(erase)
copy_brush_tool         → paint_texture(copy_region/copy_face)
mirror painting        → explicit mirrored/copy targets, not global UI state
paint_settings          → explicit per-call result options
brush presets           → no accepted-result ownership
texture_selection       → explicit target rect/face
painting grid           → UI-only visual aid
```

Keep source/UI fallback only if a direct user/editor interaction genuinely needs it; do not expose by default to ChatGPT.

---

## PBR / material ownership

### `create_pbr_material`

Keep one explicit material creation owner.

Creation must enforce native texture-set invariants:

```text
at most one color image
normal XOR height
MER/MERS one surface input
one texture UUID cannot occupy two semantic channels in one operation
```

### `configure_material` — sole PBR membership/config correction owner

Absorb `assign_texture_channel` rather than keeping a separate channel tool.

Current source has a correctness hole: replacing a channel can leave the old texture inside the TextureGroup, and `assign_texture_channel` may only relabel the old texture as `color`. Because native `TextureGroup.updateMaterial()` uses first-match channel lookup, duplicate channel membership is order-dependent.

Use `mcp/lib/pbrMaterialMembership.ts` as the pure planning foundation.

Required invariant after every material mutation:

```text
0..1 color
0..1 normal
0..1 height
0..1 MER/MERS image
normal and height never both active
```

Replacing a channel **detaches** the prior member from the material instead of silently converting it to another material channel. Moving a texture from another material refreshes both affected materials.

### MER vs MERS semantics must be explicit

Bedrock PBR semantics:

```text
MER image:  R=metalness, G=emissive, B=roughness
MERS image: R=metalness, G=emissive, B=roughness, A=subsurface
```

Do not imply that `mer_texture + subsurface_value` edits the image alpha. Native Blockbench may use the non-zero config value to select the MERS texture-set key, but actual per-pixel subsurface for an image comes from alpha.

Public local redesign should distinguish clearly between:

```text
uniform MER values
uniform MERS values
image MER
image MERS
```

and preserve native/Minecraft restrictions. Current Minecraft documentation should be rechecked during LOCAL_CODE implementation for any version-specific uniform-MERS limitation before claiming support.

### `list_materials` and `get_material_info`

Keep both deliberately:

```text
list_materials   → bounded material discovery/summary
get_material_info → one detailed material + compiled texture_set preview
```

Do not merge them into a giant always-detailed read.

---

# Conditional / extended Texturing coverage

Native/relevant capability remains available, but it must not inflate the normal hot surface.

## `manage_texture_layers`

Texture layers are real Blockbench state and must be covered for explicit layer workflows.

One conditional owner should cover the full useful native lifecycle:

```text
create
delete
duplicate
rename
opacity
blend_mode
visibility
offset
scale
move/reorder
merge_down
flip
rotate
center
flatten
```

When layers are enabled, normal `paint_texture` must fail closed if the intended layer is ambiguous; require an explicit layer UUID or explicit flattened-target semantic.

## `manage_texture_group`

Conditional generic TextureGroup lifecycle for explicit non-material color-variant groups:

```text
create
rename
resolve/remove
add/remove texture membership
```

PBR material groups continue to use the material owners; do not make callers choose between two PBR mutation paths.

## `manage_animated_texture`

Bedrock Entity format is `single_texture` **and** `animated_textures`. Animated texture therefore must be covered even though it is not normal for every asset.

Conditional owner should cover native result semantics such as:

```text
fps
frame order mode: loop | custom | backwards | back_and_forth
custom frame order
frame duplicate/delete/reorder
frame-stack structure / frame height when safely authored
```

Normal `get_texture` and `paint_texture` remain frame-aware; animated support is not isolated behind a tool that makes ordinary exact read/write impossible.

For Bedrock entity animation, Blockbench's native editor provides a render-controller `uv_anim` code reference and requires appropriate material support such as `USE_UV_ANIM`. Treat this as conditional resource-pack integration/reference output, not an automatic pack mutation in the hot Texturing workflow.

## `manage_texture_set`

Replace separate `import_texture_set` / `save_material_config` names with one conditional lifecycle owner:

```text
import
export
```

Use explicit absolute/safe path policy and explicit overwrite behavior. Import uses native Blockbench texture-set parsing/channel loading; export uses native material config compilation.

## Material-instance coverage

Per-face `material_instance` metadata is valid Bedrock geometry/render integration, but it is not ordinary atlas painting/PBR texture authoring. Keep it conditional.

Consolidate five existing tools into:

```text
list_material_instances
set_material_instances
```

`set_material_instances` accepts bounded explicit assignments and `material_name: string | null` for set/clear in one full-preflight, one-Undo call.

Do not preserve separate single/bulk/clear mutation names.

---

# Texture import/export and format coverage

## Import

Normal bitmap import does not need another tool: `create_texture` already accepts deterministic absolute image sources. Preserve native source dimensions and format behavior.

## Export

Add normal:

```text
export_texture
```

Explicit texture UUID/path, safe path policy, explicit overwrite. Cover at least:

```text
PNG
TGA
```

because Bedrock entity/material workflows can require or prioritize TGA. Do not promise JPEG write behavior without native/local proof.

Return compact identity, path, dimensions, format, and byte/write confirmation.

---

# Texturing acceptance matrix

Do not call Texturing complete until all of these are proven locally/live:

```text
SURFACE / OWNERSHIP
one normal bitmap mutation owner only
one normal texture lifecycle/config owner only
one PBR correction owner only
UI-state Painter wrappers absent from normal surface
material-instance/layers/animated/texture-set tools conditional only

CREATE / LIFECYCLE
create_texture omitted-dimension semantics
rectangular logical UV / imported texture fixtures
source_texture clone fixture
configure_texture nearest-neighbor physical resize fixture
remove_texture dependency/preflight fixture
PNG + TGA export fixtures

READ / WRITE
get_texture full/frame/face/rect/pixels
revision round-trip and stale-write failure before Undo
face rotation/flips 0/90/180/270
animated frame-local mapping exact read/write
one request = one Undo
exact affected RGBA postcondition

PBR
exclusive channel membership
normal XOR height
moving texture between materials refreshes both
MER image vs MERS alpha semantics
compiled texture_set exact preview/export

CONDITIONAL
full layer lifecycle
animated frame lifecycle
texture-group lifecycle
texture-set import/export
material-instance bounded set/clear

GATES
Texturing phase ownership only
prompts:build PASS
docs:build PASS
docs:check PASS
verify:mcp PASS
LIVE Texturing E2E PASS
```

---

# Animation — Current Tier-A Coverage Direction

Animation full curation remains after Texturing, but current known high-value gaps are retained:

```text
complete native metadata:
  override_previous_animation
  start_delay
  loop_delay

standalone animation/controller JSON delivery
read-only temporary-pose canonical views
multi-bone/multi-channel authored keyframe batch when E2E confirms call cost
```

Foundation: `mcp/lib/animationPreviewState.ts`.

---

# Explicit Non-Goals Across MCP

Do not adopt these merely because another MCP exposes them:

```text
arbitrary JavaScript / execute_script / risky_eval
automatic artistic quality scores
semantic compiler / Intent Program authority
automatic phase switching
generic UI-action bridges
persistent UUID registries
large generic routers/profiles/frameworks without evidence
procedural biped/limb generators as default authoring
```

External repositories are references only. BlockIT implementation must follow this repository's rules, Bedrock constraints, source ownership, and proof boundaries.
