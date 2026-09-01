# MCP Capability Backlog

Updated: 2026-09-01

Authority: **`Local` only**.

This file records capability gaps discovered from BlockIT audits against official Blockbench documentation, native Blockbench source, current Minecraft Bedrock schemas/guides, and public Blockbench MCP implementations. It is backlog/design state, not runtime proof.

## Goal

Improve **Cost to Accepted Result** while keeping one obvious owner for each ordinary workflow.

Preserve:

- Bedrock-specific ownership;
- UUID-first targeting;
- full preflight / fail-closed mutation;
- coherent Undo;
- Geometry → Texturing → Animation phase boundaries;
- generated-doc discipline;
- visual proof as final quality authority;
- full relevant capability coverage without bloating the BASE active-phase context.

## Canonical capability categories

There are exactly two routing categories across BlockIT:

```text
BASE
→ automatically available when its owning phase is active
→ ordinary path for that phase

EXTENDED
→ absent from the BASE active-phase context
→ loaded only when explicit intent or observed authored state requires that exact capability
```

These names are canonical across design, implementation, generated docs/prompts, specialist guidance, tests, and diagnostics.

Do **not** use `PHASE_DEFAULT`, `ON_DEMAND`, `AUTO_LOADED`, `INTENT_LOADED`, `HOT`, `DEFERRED`, `LAZY`, `SPECIALIZED`, `NICHE`, `normal`, or `conditional` as alternative capability-category labels. Domain terms keep their domain meaning; for example **normal map** is a texture type, not a routing category.

Category is a static exposure classification, not a runtime mode. Same-phase movement between `BASE` and `EXTENDED` never requires phase switch, reload, reconnect, category reset, or pack activation.

```text
BASE → BASE
  direct route

BASE → EXTENDED
  exact intent/evidence → load exact capability → execute

EXTENDED → BASE
  direct route; no unload ceremony

EXTENDED → EXTENDED
  load only the next exact capability when required

FOREIGN PHASE
  HANDOFF_REQUIRED → phase switch/reload/reconnect
  new phase begins with BASE
```

No `EXTENDED` pack exists. A known foreign-phase capability must not enter same-phase capability search.

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
→ LIVE BASE ↔ EXTENDED transition E2E
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
mcp/lib/bedrockAnimationSemantics.ts
mcp/tests/bedrock-animation-semantics.test.ts
mcp/lib/bedrockProjectSemantics.ts
mcp/tests/bedrock-project-semantics.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Core / Cross-Phase — Final Gap Audit

After the Geometry, Texturing, and Animation audits were complete, BlockIT was compared again against native Blockbench project/session/file behavior and public MCP lifecycle coverage. No new large authoring family was found, but several cross-phase gaps remain important.

## BASE Core addition: `open_project`

BlockIT can create projects and export editable `.bbmodel`, but the production surface still lacks a deterministic owner for resuming an existing asset.

Add:

```text
open_project
```

Target contract:

```text
path: absolute local path
kind: auto | bbmodel | bedrock_geometry
mode: new_tab | replace_current
discard_unsaved?: boolean
```

Use native Blockbench codecs as authority:

```text
.bbmodel / project file → project codec
.geo.json / Bedrock geometry → bedrock codec
```

No handwritten `.bbmodel` parser. The tool must preflight path/type/current-unsaved state before replacing any current project and must return exact selected-project identity after load.

This is the only new `BASE` Core tool from the post-phase audit.

## `configure_project` additions

### Rectangular logical UV resolution

`create_project` and `configure_project` must not encode 128×128 or square texture dimensions as Minecraft validity rules. Keep 128×128 as the BlockIT default, but accept positive explicit logical width/height supported by the native Bedrock project.

Project resolution change requires an explicit policy:

```text
logical_uv:
  width
  height
  adjust: keep | rescale_uv
```

`keep` changes the logical UV canvas without moving authored UV coordinates.

`rescale_uv` scales authored UV coordinates by the X/Y resolution ratio. Full preflight must verify every affected Cube/per-face UV and Box-UV offset before Undo; if an exact Box-UV grid would require rounding, fail instead of silently flooring. Use `mcp/lib/bedrockProjectSemantics.ts` as the pure planning foundation.

Do not make logical-UV resize silently scale model geometry. Geometry scaling remains an explicit Geometry correction intent.

### Bedrock visible bounds

Native Blockbench already auto-calculates static Bedrock visible bounds from exported Cube geometry, so ordinary static models do **not** need another tool or mandatory manual bounds configuration.

`configure_project` should nevertheless expose authored visible-bounds policy for cases where runtime motion extends beyond static geometry or an existing asset carries intentionally larger bounds:

```text
visible_bounds:
  mode: auto_static | explicit | expand
  width?
  height?
  offset_y?
```

Semantics:

```text
auto_static
→ clear authored minimum/override state and let native Bedrock export calculate current static Cube bounds

explicit
→ author a requested minimum width/height/offset; native export may still expand to include static geometry

expand
→ expand current authored bounds to include a supplied/recommended envelope; never shrink existing coverage
```

`validate_animation_motion` may later return a recommended animation envelope, which can be passed to `configure_project`; do not couple animated-envelope calculation into a separate visible-bounds tool.

`mcp/lib/bedrockProjectSemantics.ts` mirrors the native centered X/Z width and Y height/offset basis for deterministic planning. Runtime/live proof remains required.

## Multi-project tab safety

Native Blockbench supports multiple `ModelProject` tabs. Read safety should not require another list tool.

Extend:

```text
get_project_info
  scope: current | all
```

`scope=all` returns bounded project identity/lifecycle only:

```text
uuid
name
format
selected
saved
save_path
export_path
```

`EXTENDED` project-session owner:

```text
manage_project_session
  switch
  close
  reload
```

`close`/`reload` must refuse unsaved state unless explicit discard consent is supplied. Keep this `EXTENDED` because ordinary authoring should remain pinned to one intended project.

## Existing-owner efficiency additions

### Whole Animation clone

Extend `BASE` `create_animation`:

```text
source_animation?: UUID/name
```

When present, native duplicate/clone semantics should copy complete authored Animation state—bones/keyframes/Molang/effects/native metadata—before assigning the requested new name. This is more efficient and less lossy than reconstructing a whole clip through `manage_keyframes`.

### AnimationController / state duplication

Keep inside `manage_animation_controller`:

```text
duplicate_controller
duplicate_state
```

Require explicit new names and full collision/dependency preflight. Do not create separate public duplicate tools.

### Animation visual sequence

Extend `capture_animation_views` rather than adding a video/screenshot-sequence tool:

```text
output: frames | contact_sheet
```

A bounded contact sheet across explicit timestamps is the preferred temporal evidence because it exposes timing progression without video/GIF overhead. Animated GIF/video export remains evidence-gated rather than part of `BASE`.

## EXTENDED 2D reference-image coverage

Blockbench native project state supports 2D reference images separately from BlockIT's 3D Route-1 GLB reference.

Add only when needed:

```text
manage_reference_image
  load
  update
  remove
```

Bounded fields may include absolute image source, name, mode/view, position, size/scale, opacity, visibility and lock state. This covers front/side blueprints and concept-art references without contaminating ordinary Geometry authoring.

## Molang validation policy

Do not add a `BASE` `validate_molang` tool merely for parity. Every Molang-bearing mutation owner should validate authored text using the strongest safe native/static parser available before Undo when possible.

A future `EXTENDED` `validate_molang` remains evidence-gated for debugging only if real workflows repeatedly need standalone expression diagnosis.

## Post-phase BASE counts

With `open_project` added to shared Core, approximate BASE phase surfaces become:

```text
Geometry   ≈ 27 total before further BASE reduction
Texturing  ≈ 25 total before EXTENDED separation
Animation  ≈ 24 total before EXTENDED separation
```

These historical estimates are input to the local consolidation, not final target counts. Final counts must be measured after the `BASE` / `EXTENDED` split.

Additional `EXTENDED` Core/cross-phase coverage includes:

```text
manage_project_session
manage_reference_image
```

No other new Core family is currently justified.

---

# Geometry — Full Coverage Curation

Geometry was re-audited against official Blockbench modeling/reference docs, native Bedrock codec/outliner behavior, current `minecraft:geometry` capabilities, and public MCP implementations.

## BASE Geometry target

```text
CORE / SETUP / EVIDENCE
create_project
open_project
configure_project
get_project_info
list_outline
find_elements_by_criteria
inspect_element
inspect_model_bounds
capture_model_views
export_model
list_textures

GEOMETRY AUTHORING / CORRECTION
place_cube
modify_cubes_batch
add_group
duplicate_element
remove_element
rename_element
modify_group
reparent_element
measure_geometry
```

Shared recovery/selection capabilities are `EXTENDED`, not automatically exposed merely because Geometry is active:

```text
undo
redo
get_undo_stack
get_selection
```

Retire from the production surface after local consolidation:

```text
modify_cube
select_all_of_type
list_locator_elements
manage_null_object
bone_rigging
```

## EXTENDED Geometry

```text
manage_locator
manage_texture_mesh
manage_geometry_reference
manage_bounding_box
manage_item_display_transform
manage_reference_image
```

Intent ownership:

```text
locator/null/attachment/socket/effect-origin/IK-target → manage_locator
native Bedrock TextureMesh                              → manage_texture_mesh
3D Route-1 reference evidence                          → manage_geometry_reference
explicit bounding-box editor state                     → manage_bounding_box
item-display transform integration                     → manage_item_display_transform
2D reference-image workflow                            → manage_reference_image
```

Remote-safe Geometry correctness work already on `Local` includes faithful native duplication, export-safe identity guards, complete structural preflight before Undo, exact Cube `inflate`/export inspection, world-space OBB extraction, SAT contact classification, and project-resolution/visible-bounds planning. Geometry remains **LOCAL PROOF REQUIRED** until public consolidation, generated artifacts, local tests, and live E2E pass.

---

# Texturing — Full Coverage Curation

Texturing was re-audited against official Blockbench Paint Mode/Texture/Layer/PBR/animated-texture behavior, native source, Minecraft Bedrock texture-set/Vibrant Visuals PBR semantics, and public Blockbench MCPs.

## BASE Texturing target

Default classic Minecraft/Bedrock texturing stays intentionally small:

```text
create_texture
configure_texture
remove_texture
get_texture
paint_texture
export_texture
```

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before Texturing handoff.

The current Texturing surface is much larger because Painter/UI-state/PBR/material-instance routes are exposed together. Local consolidation must replace accepted-result behavior before retiring duplicates.

Retire from the production surface after replacement contracts exist:

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

## EXTENDED Texturing

```text
create_pbr_material
configure_material
list_materials
get_material_info
manage_texture_set
manage_texture_layers
manage_texture_group
manage_animated_texture
list_material_instances
set_material_instances
```

These remain fully supported capability, but exact intent/evidence must load the exact owner. There is no PBR pack, advanced-texture pack, or material-instance pack activation step.

Intent examples:

```text
PBR / RTX / Vibrant Visuals
normal map / height map
MER / MERS
metalness / roughness / emissive / subsurface
texture_set
texture layers/groups
animated texture
per-face material instances
```

## Texturing ownership summary

### `create_texture`

Remove provisional 16×16 defaults. Require width+height as a pair when explicit; otherwise derive only from project logical UV, established base atlas, imported file dimensions, or explicit `source_texture` clone semantics. Preserve valid rectangular Bedrock layouts; BlockIT's 128×128 default is a product default, not a universal Bedrock rule.

### `configure_texture` / `remove_texture`

One existing-Texture property/bitmap owner plus one explicit destructive lifecycle owner. Physical bitmap resizing must not silently mutate Geometry UV layout.

### `get_texture`

One readback owner with bounded scopes such as `full | frame | face | rect | pixels`, exact RGBA when requested, revision, mapped rect, frame metadata, and optional objective stats. This absorbs region/grid/revision/color-picker/palette read tools.

### `paint_texture`

One bitmap mutation owner for atlas or face-local targets. Result-oriented operations may include fill/flood/rect/ellipse/line/stroke/pixels/gradient/erase/replace/copy/flip/quarter-turn. Global Painter selection/preset/stylus/mirror state is not agent-owned artifact state. Use shared face mapping, frame mapping, expected revision, one Undo, and exact affected-pixel postcondition.

### PBR

`configure_material` becomes the sole PBR membership correction owner. Enforce 0..1 color, 0..1 normal, 0..1 height, 0..1 MER/MERS image and normal XOR height. Replacing a channel detaches the prior member instead of relabeling it. MER and MERS image semantics must distinguish alpha-channel subsurface from uniform config values.

### Delivery

`export_texture` supports deterministic standalone texture output, at least PNG and TGA after local proof.

Texturing remains **LOCAL PROOF REQUIRED** until public consolidation, generators/tests, and live Texturing E2E pass.

---

# Animation — Full Coverage Curation

Animation was re-audited against:

- official Blockbench Animate Mode, animation expressions, effects, controller and file-codec behavior;
- native `JannisX11/blockbench` Animation, Keyframe, BoneAnimator, EffectAnimator, AnimationController and Bedrock codecs;
- current Minecraft Bedrock animation and animation-controller documentation/schema;
- public Blockbench MCPs including SwagRee, sosadly, adhi-jp, XiaoNetwork-Astral and other surveyed implementations.

The goal is **full relevant Bedrock Animation coverage with one direct owner for each authored result**, while editor-only aids stay out of `BASE`.

## Current Animation surface problem

The active Animation phase currently exposes approximately nine Animation-specific tools:

```text
create_animation
manage_keyframes
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
manage_animation_effects
manage_animation_controller
inspect_animation
```

`bone_rigging` lives in the animation source family but phase routing correctly assigns it to Geometry; it is not a final Animation owner.

The main duplication is behavioral:

```text
manage_keyframes
animation_graph_editor
batch_keyframe_operations
animation_copy_paste
```

all mutate transform keyframe cohorts, while `animation_timeline` mixes temporary editor playback/selection state with persistent authored Animation properties.

## BASE Animation target

```text
create_animation
configure_animation
remove_animation
manage_keyframes
inspect_animation
capture_animation_views
export_animation_file
```

The capability is broader than the current surface while BASE ownership becomes simpler.

Retire after replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

`bone_rigging` is dismantled through the Geometry consolidation and must never return as an Animation route.

Do not remove source behavior until replacement contracts, generated artifacts and regression/live proof exist.

## EXTENDED Animation

```text
manage_animation_effects
manage_animation_controller
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

Controller `variables/remap_curve` is a separate **EXTENDED Bedrock-extension gap** discussed below; it remains inside the controller owner rather than becoming another tool.

---

## Animation ownership decisions

### `create_animation` — complete one-call authored Animation creation

Current creation is too narrow: it accepts boolean loop mode and numeric bone transforms, while native Bedrock supports additional persistent fields and Molang values.

Local public redesign should support:

```text
name
source_animation?: UUID/name
loop: once | loop | hold
length?
override_previous_animation?
anim_time_update?
blend_weight?
start_delay?
loop_delay?

bone_settings?:
  - bone
    rotation_space?: parent | entity

bones/keyframes:
  numeric or authored Molang values
  optional pre/post values
  export-safe interpolation semantics

effects:
  particle
  sound
  timeline/instruction
```

`source_animation` uses native whole-animation duplicate/clone semantics and then applies the explicitly requested new identity/config changes. It must preserve complete authored keyframes, Molang, effects, interpolation/editor metadata, and native Animation properties without a lossy JSON reconstruction.

`rotation_space=entity` maps to native Bedrock `relative_to.rotation=entity` / Blockbench `BoneAnimator.rotation_global`.

Creation should no longer require a second tool call merely to add native metadata or instruction effects when the caller already knows them.

Identifiers must use the Bedrock naming grammar: begin with a letter and contain only letters, numbers, underscores and periods. Use `mcp/lib/bedrockAnimationSemantics.ts` as the pure naming/interpolation foundation.

Do not add destructive whole-animation `upsert(replace=true)` as the ordinary editing model. Incremental explicit mutation remains safer for live Blockbench work.

### `configure_animation` — sole persistent Animation metadata owner

Move persistent authored state out of `animation_timeline`.

Fields:

```text
name?
loop?
length?
snapping?
override_previous_animation?
anim_time_update?: Molang | null
blend_weight?: Molang | null
start_delay?: Molang | null
loop_delay?: Molang | null
bone_settings?: [{bone, rotation_space}]
```

`snapping` is Blockbench authoring metadata rather than Bedrock runtime JSON, but keeping it in the same owner avoids a separate editor-FPS tool.

No-op updates fail before Undo. Rename must preserve deterministic controller references where BlockIT has loaded link identity; external entity-file aliases remain outside the project and must be reported as an external dependency boundary.

### `remove_animation` — explicit destructive Animation lifecycle

BlockIT currently creates animations but lacks a delete owner.

Before Undo:

```text
resolve exact Animation
inspect loaded controller-state links
report dependent controller entries
reject dependency-breaking removal by default
optional explicit detach policy may update loaded controller links + remove in one Undo
```

External client-entity references cannot be inferred from the open Blockbench project; the receipt must state that limitation.

Controller deletion remains an operation of `manage_animation_controller`, not a second generic delete tool.

### `manage_keyframes` — single transform-keyframe mutation owner

Absorb accepted-result semantics of:

```text
manage_keyframes
batch_keyframe_operations
animation_copy_paste
export-safe graph/interpolation edits
```

The contract should be explicit and multi-target rather than selected-state driven:

```text
animation: explicit UUID/name
operations:
  - add/update/remove
  - transform
  - copy
  - bake
  - set_export_safe_curve
```

One request may address multiple bones/channels. Full-preflight every target first, then one coherent Animation Undo.

Preferred identity:

```text
existing keyframe UUID when available
otherwise exact bone + channel + unique time selector
```

Do not require Timeline selection for batch work and do not use a persistent global animation clipboard. Direct copy carries source + target in the same call.

Required keyframe data coverage:

```text
number or Molang per axis/uniform value
pre value
post value
linear
catmullrom
step convenience
```

Native transform channels support up to two data points. `step` is export-safe because Blockbench compiles the discontinuity to Bedrock `pre/post` values.

Batch result semantics to preserve:

```text
time/value offset
retime/scale around explicit pivot
reverse
axis-aware mirror
catmullrom smoothing
bake/sample
explicit source→target copy with optional time offset/mirror
```

All selected/range/pattern convenience must resolve to explicit live keyframes before Undo; `selection=selected` is not a canonical production contract.

### Bezier / Graph Editor boundary

This is a correctness requirement, not just ergonomics.

Blockbench supports editor Bezier curves and its current codec can serialize the interpolation label, but the Bedrock animation schema's transform `lerp_mode` supports `linear` and `catmullrom`; discontinuous steps are represented through `pre/post`.

Therefore:

```text
linear      → direct Bedrock
catmullrom  → direct Bedrock
step        → Blockbench compiles to Bedrock pre/post
bezier      → Blockbench/editor preview only; bake before direct Bedrock delivery
```

`BASE` `manage_keyframes` must not silently author direct-export Bezier as though it were Minecraft-safe. Keep explicit Bezier handle editing under `EXTENDED` `manage_animation_curves`, or preserve existing editor curves, but `export_animation_file` must fail closed while unbaked Bezier remains.

Molang expressions also require caution with smooth/Bezier editor interpolation; preserve source text and do not claim preview equivalence without live evidence.

### `manage_animation_effects`

This `EXTENDED` owner covers native Bedrock effect channels:

```text
particle
sound
timeline/instruction Molang
```

Retain bounded add/update/remove operations, full preflight and one Undo. Effect playback files/preview media are editor support state; exported short effect identifiers/scripts remain the authored result.

### `manage_animation_controller`

This `EXTENDED` owner keeps all controller lifecycle/composition behavior together.

Already covered well:

```text
create/rename controller
add/update/remove state
initial state
on_entry/on_exit
blend_transition
blend_via_shortest_path
ordered transitions add/update/remove
animation links add/update/remove
sound effects
particle effects
```

Required additions:

```text
delete_controller
duplicate_controller
duplicate_state
blend_transition_curve set/clear
explicit transition target_index / reorder semantics
explicit animation-link target_index / reorder semantics
```

Duplicate operations require explicit new names and preserve full native state/controller payload through native copy semantics rather than reconstructing only currently exposed fields.

Transition order is semantically significant in Minecraft because conditions are evaluated in array order.

#### Controller animation links must use explicit Bedrock keys

Current BlockIT resolution is too restrictive when it requires a loaded authored `Animation` target. Minecraft controller state animation entries are **short keys supplied by the entity definition**, and those keys may resolve to normal animations, other animation controllers, or vanilla/external definitions.

Final link contract should make the exported key explicit:

```text
animation_key: string
loaded_item?: optional Animation/AnimationController UUID for validation/preview
blend_value?: Molang
```

The explicit key is authoritative for export. A loaded item is optional supporting identity, not a requirement. This covers nested-controller hierarchies and valid external/vanilla animation aliases without inventing project objects.

#### Controller variables / remap_curve

Current Minecraft controller docs support per-state variables with Molang values and optional `remap_curve`. Current native Blockbench `AnimationControllerState` source does not expose/persist this field in its ordinary state model.

Treat this as **EXTENDED Bedrock extension work**, not a `BASE` field that may silently disappear.

Before claiming support, `LOCAL_CODE` must prove a persistent plugin-owned round trip across:

```text
JSON import
Blockbench project save/reopen
Undo/redo
controller inspection
compile/export
```

If a robust native/plugin persistence owner cannot be proven, BlockIT must fail explicitly rather than claim support and drop the data.

### `inspect_animation` — list + focused item inspection

Expand one read owner rather than adding `list_animations`.

Conceptual modes:

```text
list
item
bone
controller_state
```

Animation summary should include:

```text
uuid / name
loop / length / snapping
override_previous_animation
anim_time_update
blend_weight
start_delay
loop_delay
path/saved state when relevant
```

Focused bone inspection should include:

```text
rotation_space / rotation_global
keyframe UUID/time/channel
all pre/post data points
interpolation
Bezier editor metadata when present
```

Controller inspection retains state scripts/effects/transitions/links and `blend_transition_curve`, and later includes state variables only after the EXTENDED persistence contract is proven.

### `capture_animation_views` — canonical motion evidence owner

Use the prepared `mcp/lib/animationPreviewState.ts` transaction.

Inputs should support explicit Animation + time(s) + canonical view(s), with bounded batching to avoid repeated state churn.

Outputs:

```text
frames
contact_sheet
```

A contact sheet is the preferred temporal sequence evidence for several timestamps because it exposes timing progression while avoiding video/GIF overhead.

Required restoration boundary:

```text
selected animation
all playing flags
Timeline time/playback state
effect mute/suspension state
camera/view state owned by capture path
```

Optional temporary **Molang preview context / variable placeholders** should be supported only through Molang/value inputs and restored after capture. Never use arbitrary JavaScript to fake runtime state.

A future `EXTENDED` extension may capture one explicit controller state, but it must snapshot/restore controller selection and all dependent animation preview state just as strictly.

### `export_animation_file` — delivery owner

Standalone animation/controller JSON delivery is a production requirement; generic `export_model` intentionally does not own it.

Use native AnimationCodec compilation as source of truth:

```text
kind: animation | controller
items: explicit IDs/names
path?: explicit safe path
overwrite?: explicit
```

Without a path, a bounded compiled JSON preview may be returned when useful. With a path, write deterministically without UI file pickers.

Before delivery:

```text
validate item identity
validate Bedrock identifier grammar
reject unbaked editor-only Bezier transforms
compile through current native codec
verify file/write postcondition when path supplied
```

Do not silently bake or mutate the authored animation during export.

---

# EXTENDED Animation behavior details

## `animation_playback`

Temporary editor playback only:

```text
play
pause
stop
set_time
playback_speed
```

This replaces the ephemeral portion of current `animation_timeline`. Verification uses `capture_animation_views`, not playback UI state.

Timeline keyframe selection, marker colors, onion-skin toggles and similar UI state are not accepted-result owners.

## `manage_animation_curves`

Blockbench graph-editor workflow for Bezier handles/easing or other editor-only curve work. It must clearly state that Bezier requires baking before direct Bedrock animation JSON delivery.

Bedrock-safe linear/catmullrom/step edits remain inside `manage_keyframes`.

## `import_animation_file`

Absolute-path import for `*.animation.json` and `*.animation_controllers.json` using native Bedrock AnimationCodec parsing/loading with explicit filters, collision preflight and one Undo.

Do not route import through generic risky file execution.

## `validate_animation_motion`

Read-only motion sweep built only after the Geometry measurement owner and temporary preview path are proven locally/live.

Bounded checks may sample:

```text
rest pose
explicit requested times
authored keyframe times
loop boundary
```

and report objective evidence such as:

```text
attachment/contact failures
hierarchy/bounds issues
motion envelope
first failing sample
recommended visible bounds envelope when current static bounds are insufficient
```

Always restore editor state. Do not produce a subjective animation quality score.

---

# Animation editor features intentionally outside BASE

Blockbench exposes additional editor conveniences including timeline selection, markers, onion skin, keyframe colors, animation presets, graph-view toggles and panel filtering. These help a human use the UI but do not define the Bedrock animation artifact.

Coverage policy:

```text
selection / panel filters / graph toggle → no production tool; explicit targets replace them
markers / keyframe colors               → editor annotation only; add only if a real workflow proves value
onion skin                              → visual editor aid; capture_animation_views owns agent verification
animation presets                       → direct create/copy/manage_keyframes produces the same authored result
```

Do not add UI-action parity merely to claim Blockbench parity.

---

# Animation acceptance matrix

Do not call Animation complete until all of these are proven locally/live:

```text
SURFACE / OWNERSHIP
one BASE persistent Animation configuration owner
one BASE transform-keyframe mutation owner
no global clipboard / Timeline-selection dependency
playback/curve/import/motion-QA capabilities EXTENDED only
bone_rigging absent from Animation surface

ANIMATION LIFECYCLE
create full loop modes and native metadata
whole-animation clone
rename/configure/delete
identifier validation
rotation_space entity/parent

KEYFRAMES
multi-bone/multi-channel authored batch
numeric + Molang
pre/post round trip
linear/catmullrom direct export
step → pre/post export
Bezier direct-export rejection + explicit bake path
copy/mirror/retime/reverse/smooth/bake one-Undo fixtures

EFFECTS
particle/sound/instruction round trip through EXTENDED effects owner

CONTROLLERS
EXTENDED controller owner loads only for controller intent/evidence
controller delete/duplicate
state duplicate
ordered transitions
ordered animation links
blend_transition_curve
external/vanilla/nested-controller short-key links
state variable/remap_curve EXTENDED persistence decision

READ / VERIFY
inspect list + focused animation/controller/bone data
capture_animation_views exact temporary pose + restoration
contact-sheet sequence output
Molang preview context restoration
objective motion sweep only after primitive proof

DELIVERY
native codec animation JSON compile/export
native codec controller JSON compile/export
unbaked Bezier blocks delivery
EXTENDED import round trip

ROUTING
BASE → EXTENDED no reload/reconnect
EXTENDED → BASE no unload/reset
EXTENDED → EXTENDED exact next capability only
foreign-phase capability never enters EXTENDED search

GATES
Animation-only phase ownership
prompts:build PASS
docs:build PASS
docs:check PASS
verify:mcp PASS
LIVE Animation BASE E2E PASS
LIVE Animation EXTENDED E2E PASS
```

Animation remains **LOCAL PROOF REQUIRED** until public consolidation, generated artifacts, tests and live Blockbench verification all pass.

---

# Explicit Non-Goals Across MCP

Do not adopt these merely because another MCP exposes them:

```text
arbitrary JavaScript / execute_script / risky_eval
automatic artistic/animation quality scores
semantic compiler / Intent Program authority
automatic phase switching
generic UI-action bridges
persistent UUID registries
large generic routers/profiles/frameworks without evidence
procedural biped/limb generators as default authoring
destructive whole-animation replacement as the ordinary editing model
BASE video/GIF generation when bounded frames/contact sheets provide sufficient evidence
category-specific reload/reconnect/reset behavior
EXTENDED pack loaders or pack registries
parallel capability-category vocabulary
```

External repositories are references only. BlockIT implementation must follow this repository's rules, Bedrock constraints, source ownership, and proof boundaries.
