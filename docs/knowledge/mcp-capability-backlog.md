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
- conditional/lazy coverage for uncommon native/editor features instead of bloating the hot tool surface.

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
mcp/lib/bedrockAnimationSemantics.ts
mcp/tests/bedrock-animation-semantics.test.ts
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

Texturing was re-audited against official Blockbench Paint Mode/Texture/Layer/PBR/animated-texture behavior, native source, Minecraft Bedrock texture-set/Vibrant Visuals PBR semantics, and public Blockbench MCPs.

## Final normal Texturing-specific surface target

Target: **about 10 Texturing-specific tools**, plus shared Core.

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

After Core consolidation this implies roughly:

```text
~14 shared Core/setup/evidence
+ 10 Texturing-specific
= ~24 normal Texturing-phase tools
```

instead of the current ~43.

Retire from the normal Texturing surface after replacements exist:

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

Conditional/lazy Texturing:

```text
manage_texture_layers
manage_texture_group
manage_animated_texture
manage_texture_set
list_material_instances
set_material_instances
```

## Texturing ownership summary

### `create_texture`

Remove provisional 16×16 defaults. Require width+height as a pair when explicit; otherwise derive only from project logical UV, established base atlas, imported file dimensions, or explicit `source_texture` clone semantics. Preserve valid rectangular Bedrock layouts; BlockIT's 128×128 default is a product default, not a universal Bedrock rule.

### `configure_texture` / `remove_texture`

One normal existing-Texture property/bitmap owner plus one explicit destructive lifecycle owner. Physical bitmap resizing must not silently mutate Geometry UV layout.

### `get_texture`

One readback owner with bounded scopes such as `full | frame | face | rect | pixels`, exact RGBA when requested, revision, mapped rect, frame metadata, and optional objective stats. This absorbs region/grid/revision/color-picker/palette read tools.

### `paint_texture`

One normal bitmap mutation owner for atlas or face-local targets. Result-oriented operations may include fill/flood/rect/ellipse/line/stroke/pixels/gradient/erase/replace/copy/flip/quarter-turn. Global Painter selection/preset/stylus/mirror state is not normal agent ownership. Use shared face mapping, frame mapping, expected revision, one Undo, and exact affected-pixel postcondition.

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

The goal is **full relevant Bedrock Animation coverage with one direct owner for each authored result**, while keeping Blockbench-only editor aids conditional.

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

## Final normal Animation-specific surface target

Target: **about 9 Animation-specific tools**, plus shared Core.

```text
ANIMATION LIFECYCLE / AUTHORING
1  create_animation
2  configure_animation
3  remove_animation
4  manage_keyframes
5  manage_animation_effects
6  manage_animation_controller

INSPECTION / VERIFICATION / DELIVERY
7  inspect_animation
8  capture_animation_views
9  export_animation_file
```

After Core consolidation this implies roughly:

```text
~14 shared Core/setup/evidence
+ 9 Animation-specific
= ~23 normal Animation-phase tools
```

The capability is broader than the current surface while normal tool ownership becomes simpler.

## Retire / remove from the normal Animation surface

After local replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

`bone_rigging` is dismantled through the Geometry consolidation and must never return as an Animation route.

Do not remove source behavior until replacement contracts, generated artifacts and regression/live proof exist.

## Conditional / lazy Animation coverage

```text
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

Controller `variables/remap_curve` is a separate **conditional Bedrock-extension gap** discussed below; it should remain inside the controller owner rather than becoming another tool.

---

## Animation ownership decisions

### `create_animation` — complete one-call authored Animation creation

Current creation is too narrow: it accepts boolean loop mode and numeric bone transforms, while native Bedrock supports additional persistent fields and Molang values.

Local public redesign should support:

```text
name
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

`rotation_space=entity` maps to native Bedrock `relative_to.rotation=entity` / Blockbench `BoneAnimator.rotation_global`.

Creation should no longer require a second tool call merely to add native metadata or instruction effects when the caller already knows them.

Identifiers must use the Bedrock naming grammar: begin with a letter and contain only letters, numbers, underscores and periods. Use `mcp/lib/bedrockAnimationSemantics.ts` as the pure naming/interpolation foundation.

Do not add destructive whole-animation `upsert(replace=true)` as the normal editing model. Incremental explicit mutation remains safer for live Blockbench work.

### `configure_animation` — sole persistent Animation metadata owner

Move persistent authored state out of `animation_timeline`.

Normal fields:

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

BlockIT currently creates animations but lacks a normal delete owner.

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

Absorb the accepted-result semantics of:

```text
manage_keyframes
batch_keyframe_operations
animation_copy_paste
normal export-safe graph/interpolation edits
```

The new contract should be explicit and multi-target rather than selected-state driven:

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

Do not require Timeline selection for normal batch work and do not use a persistent global animation clipboard. Direct copy carries source + target in the same call.

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

All selected/range/pattern convenience must resolve to explicit live keyframes before Undo; `selection=selected` is not a canonical normal contract.

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

Normal `manage_keyframes` must not silently author direct-export Bezier as though it were Minecraft-safe. Keep explicit Bezier handle editing under conditional `manage_animation_curves`, or preserve existing editor curves, but `export_animation_file` must fail closed while unbaked Bezier remains.

Molang expressions also require caution with smooth/Bezier editor interpolation; preserve source text and do not claim preview equivalence without live evidence.

### `manage_animation_effects`

Keep this focused owner. It already covers the native Bedrock effect channels:

```text
particle
sound
timeline/instruction Molang
```

Retain bounded add/update/remove operations, full preflight and one Undo. Effect playback files/preview media are editor support state; exported short effect identifiers/scripts remain the authored result.

### `manage_animation_controller`

Keep one controller owner, but close several real coverage gaps.

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
blend_transition_curve set/clear
explicit transition target_index / reorder semantics
explicit animation-link target_index / reorder semantics
```

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

Treat this as **conditional Bedrock extension work**, not a normal hot-surface field that may silently disappear.

Before claiming support, LOCAL_CODE must prove a persistent plugin-owned round trip across:

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

Controller inspection retains state scripts/effects/transitions/links and `blend_transition_curve`, and later includes state variables only after the conditional persistence contract is proven.

### `capture_animation_views` — canonical motion evidence owner

Use the prepared `mcp/lib/animationPreviewState.ts` transaction.

Normal inputs should support explicit Animation + time(s) + canonical view(s), with bounded batching to avoid repeated state churn.

Required restoration boundary:

```text
selected animation
all playing flags
Timeline time/playback state
effect mute/suspension state
camera/view state owned by capture path
```

Optional temporary **Molang preview context / variable placeholders** should be supported only through Molang/value inputs and restored after capture. Never use arbitrary JavaScript to fake runtime state.

A later conditional extension may capture one explicit controller state, but it must snapshot/restore controller selection and all dependent animation preview state just as strictly.

### `export_animation_file` — normal delivery owner

Standalone animation/controller JSON delivery is a normal production requirement; generic `export_model` intentionally does not own it.

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

# Conditional / extended Animation coverage

## `animation_playback`

Temporary editor playback only:

```text
play
pause
stop
set_time
playback_speed
```

This replaces the ephemeral portion of current `animation_timeline`. Normal verification uses `capture_animation_views`, not playback UI state.

Timeline keyframe selection, marker colors, onion-skin toggles and similar UI state are not normal accepted-result owners.

## `manage_animation_curves`

Conditional Blockbench graph-editor workflow for Bezier handles/easing or other editor-only curve work. It must clearly state that Bezier requires baking before direct Bedrock animation JSON delivery.

Normal Bedrock-safe linear/catmullrom/step edits remain inside `manage_keyframes`.

## `import_animation_file`

Conditional absolute-path import for `*.animation.json` and `*.animation_controllers.json` using native Bedrock AnimationCodec parsing/loading with explicit filters, collision preflight and one Undo.

Do not route import through generic risky file execution.

## `validate_animation_motion`

Conditional read-only motion sweep built only after the Geometry measurement owner and temporary preview path are proven locally/live.

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
```

Always restore editor state. Do not produce a subjective animation quality score.

---

# Animation editor features intentionally not normal MCP owners

Blockbench exposes additional editor conveniences including timeline selection, markers, onion skin, keyframe colors, animation presets, graph-view toggles and panel filtering. These help a human use the UI but do not define the Bedrock animation artifact.

Coverage policy:

```text
selection / panel filters / graph toggle → no normal tool; explicit targets replace them
markers / keyframe colors               → editor annotation only; conditional only if a real workflow proves value
onion skin                              → visual editor aid; capture_animation_views owns agent verification
animation presets                       → direct create/copy/manage_keyframes produces the same authored result
```

Do not add UI-action parity merely to claim Blockbench parity.

---

# Animation acceptance matrix

Do not call Animation complete until all of these are proven locally/live:

```text
SURFACE / OWNERSHIP
one normal persistent Animation configuration owner
one normal transform-keyframe mutation owner
no normal global clipboard / Timeline-selection dependency
graph/playback editor tools conditional only
bone_rigging absent from Animation surface

ANIMATION LIFECYCLE
create full loop modes and native metadata
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
particle/sound/instruction round trip

CONTROLLERS
controller delete
ordered transitions
ordered animation links
blend_transition_curve
external/vanilla/nested-controller short-key links
state variable/remap_curve conditional persistence decision

READ / VERIFY
inspect list + focused animation/controller/bone data
capture_animation_views exact temporary pose + restoration
Molang preview context restoration
optional objective motion sweep only after primitive proof

DELIVERY
native codec animation JSON compile/export
native codec controller JSON compile/export
unbaked Bezier blocks delivery
conditional import round trip

GATES
Animation-only phase surface
prompts:build PASS
docs:build PASS
docs:check PASS
verify:mcp PASS
LIVE Animation E2E PASS
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
destructive whole-animation replacement as the normal editing model
```

External repositories are references only. BlockIT implementation must follow this repository's rules, Bedrock constraints, source ownership, and proof boundaries.
