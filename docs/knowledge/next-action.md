# Next Action

Updated: 2026-09-01 — full MCP coverage curated; capability loading vocabulary unified to AUTO_LOADED / INTENT_LOADED; same-phase retrieval/reuse and efficiency measurement clarified; public consolidation/build/live proof remains local

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; complete capability coverage belongs in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`FULL_MCP_COVERAGE_CURATED_AUTO_LOADED_INTENT_LOADED_LOCAL_IMPLEMENTATION_REQUIRED`

Geometry, Texturing, Animation, and Core/project lifecycle have been re-audited against official Blockbench documentation/native source, current Minecraft Bedrock behavior/schema, and surveyed public Blockbench MCP implementations.

The design goal is locked:

```text
full relevant Bedrock/Blockbench capability coverage
+
one obvious owner per ordinary intent
+
load only what the current phase + current intent needs
+
no tool-count parity for its own sake
```

Do **not** remove rare capability merely to reduce tool count. Keep it supported as `INTENT_LOADED` when it is not appropriate for the automatically loaded active-phase surface.

Do **not** restart broad external feature hunting before local implementation unless a concrete missing production capability appears.

## Capability Loading Model

There are exactly **two capability categories**. These names are canonical in design, implementation, generated guidance, tests, and user-facing diagnostics.

```text
AUTO_LOADED
→ automatically available when its owning phase is active
→ ordinary path for that phase
→ no discovery/load step before use when exact route is known

INTENT_LOADED
→ not present in the automatically loaded active-phase context
→ loaded only when explicit intent or observed authored state requires that capability
```

Do **not** use `PHASE_DEFAULT`, `ON_DEMAND`, `HOT`, `DEFERRED`, `LAZY`, `SPECIALIZED`, `NICHE`, `normal`, `conditional`, or `extended` as alternative capability-category names.

`AUTO_LOADED` and `INTENT_LOADED` classify capability exposure only. They are **not runtime modes**, do not create a second phase system, and do not change capability ownership.

### Routing invariant

```text
ACTIVE PHASE
+
AUTO_LOADED
+
only INTENT_LOADED capability definitions relevant to the current intent/evidence
```

No category-wide activation exists. No `INTENT_LOADED` pack activation exists.

### Same-phase transition contract

Category transitions must not create reload/reconnect/reset churn.

```text
AUTO_LOADED → AUTO_LOADED
→ call the exact next automatically loaded capability directly

AUTO_LOADED → INTENT_LOADED
→ explicit intent/evidence triggers one narrow lookup when the capability definition is not already available
→ choose the exact owner
→ execute
→ keep AUTO_LOADED surface available
→ no phase switch, reload, reconnect, or category reset

INTENT_LOADED → AUTO_LOADED
→ call the exact automatically loaded capability directly
→ no unload/reset ceremony

INTENT_LOADED → INTENT_LOADED
→ reuse already available matching capability definitions first
→ if the next intent needs an unavailable capability, perform one narrow lookup for that intent
→ never load every INTENT_LOADED capability in the phase
```

An `INTENT_LOADED` capability does not become a mandatory dependency merely because it was used once. Reuse its available definition while the current phase/session context remains valid; otherwise continue through `AUTO_LOADED` without an explicit unload action.

### INTENT_LOADED lookup and reuse contract

`INTENT_LOADED` is a context-loading mechanism, not a reason to add extra routing ceremony.

```text
exact route already available
→ call directly

route known but definition unavailable
→ one narrow lookup for the coherent current intent
→ backend may return a bounded set of closely relevant definitions
→ choose one exact owner for each action
→ keep returned definitions reusable in the current phase/session

same capability needed again
→ reuse; do not search again

lookup miss
→ reformulate once with exact capability/domain wording
→ second miss = BLOCKED or capability gap
```

A narrow lookup returning several closely related definitions does **not** create a pack, subgroup, or new category. It only avoids repeated lookup overhead inside one coherent workflow.

Never re-run lookup merely for confirmation after a successful mutation. Never send a known foreign-phase capability through same-phase `INTENT_LOADED` lookup.

### Category assignment rule

`AUTO_LOADED` membership must be evidence-driven. Do not classify a tool only because it feels common or rare.

Evaluate together:

```text
intent frequency
+
schema/context cost
+
workflow adjacency with other AUTO_LOADED operations
+
lookup overhead
+
selection-collision risk
+
Cost to Accepted Result
```

Consequences:

```text
small + frequently adjacent capability
→ may remain AUTO_LOADED even if not used in every asset

large + uncommon capability
→ strong INTENT_LOADED candidate

rare but tiny capability
→ benchmark before moving it out of AUTO_LOADED

frequent but very large/collision-prone capability
→ benchmark before keeping it AUTO_LOADED
```

There is no universal tool-count threshold. Final membership is decided from BlockIT measurements, not copied from another host/model/vendor.

### Cross-phase transition contract

Capability category never bypasses phase ownership.

```text
current intent belongs to ACTIVE PHASE
→ use AUTO_LOADED or INTENT_LOADED route

current intent belongs to FOREIGN PHASE
→ HANDOFF_REQUIRED
→ preserve only resume-critical state
→ switch owning phase
→ reload/reconnect only because phase ownership changed
→ new phase begins with AUTO_LOADED
→ if the immediate next intent needs INTENT_LOADED, load only relevant definitions after reconnect
```

A known foreign-phase tool must never enter same-phase `INTENT_LOADED` search. Phase absence is not a discovery miss.

If an automatically loaded capability detects authored state that needs an `INTENT_LOADED` capability, return an explicit continuation hint:

```text
CAPABILITY_REQUIRED
capability: <exact tool/capability owner when known>
reason: <observed authored state or explicit requirement>
```

Do not return a category name, pack name, or broad family when one exact capability owner is known.

### Phase-handoff optimization boundary

Current phase ownership and current reload/reconnect handoff remain authoritative until local/live evidence proves a better implementation.

During this consolidation:

```text
measure phase-handoff count
measure reload/reconnect overhead
measure context/tool-search cost around each handoff
compare against accepted-result quality and correction count
```

Do **not** combine tool-surface consolidation with an MCP transport/protocol redesign.

If measured phase reload/reconnect cost becomes a dominant contributor to Cost to Accepted Result after the new capability routing is live, treat phase-switch mechanics as a separate evidence-gated redesign. Phase ownership itself remains independent from how a phase switch is transported.

## Remote-safe foundations already on `Local`

```text
CORE / PROJECT
mcp/lib/bedrockProjectSemantics.ts

GEOMETRY
mcp/lib/orientedBoxContact.ts
mcp/lib/blockbenchCubeObb.ts

TEXTURING
mcp/lib/facePixelMapping.ts
mcp/lib/textureRevision.ts
mcp/lib/textureFrameMapping.ts
mcp/lib/pbrMaterialMembership.ts

ANIMATION
mcp/lib/animationPreviewState.ts
mcp/lib/bedrockAnimationSemantics.ts
```

Each has targeted regression contracts in `mcp/tests/`.

All are **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Locked target surfaces

Exact runtime counts must be measured after public consolidation. The lists below define target routing, not a claim that those schemas are already implemented.

## Shared Core / project lifecycle

### AUTO_LOADED

```text
create_project
open_project
configure_project
get_project_info
export_model
```

Core read/inspection tools remain available to phases according to their existing ownership and routing needs rather than being duplicated into phase-specific owners.

Required Core extensions:

```text
create_project
  → rectangular logical UV width/height; 128×128 remains default only

configure_project
  → model_identifier
  → logical UV resize policy: keep | rescale_uv
  → authored visible-bounds policy for animated/runtime envelope cases

get_project_info
  → scope=current|all for multi-project safety
```

### INTENT_LOADED

```text
undo
redo
get_undo_stack
get_selection
manage_project_session
  switch
  close
  reload
```

Recovery/selection state is loaded only when current evidence requires it. Session management is loaded only for explicit multi-project/session intent. Normal `.bbmodel` save remains `export_model(codec=project)`; do not add a duplicate `save_project` owner.

---

## Geometry

### AUTO_LOADED

```text
list_outline
find_elements_by_criteria
inspect_element
inspect_model_bounds
capture_model_views
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

Main consolidation:

```text
modify_cube              → modify_cubes_batch
list_locator_elements    → find_elements_by_criteria
manage_null_object       → manage_locator
bone_rigging             → canonical Geometry owners
select_all_of_type       → leave production surface
```

### INTENT_LOADED

```text
manage_locator
manage_texture_mesh
manage_geometry_reference
manage_bounding_box
manage_item_display_transform
manage_reference_image
```

Route exact intent only:

```text
locator/null/attachment/socket/effect-origin/IK-target → manage_locator
native Bedrock TextureMesh                              → manage_texture_mesh
3D Route-1 reference evidence                          → manage_geometry_reference
explicit bounding-box editor state                     → manage_bounding_box
item-display transform integration                     → manage_item_display_transform
2D reference-image workflow                            → manage_reference_image
```

None of these should occupy ordinary Cube/bone authoring context without matching intent/evidence.

---

## Texturing

### AUTO_LOADED

Default classic Minecraft/Bedrock texture authoring is intentionally small:

```text
create_texture
configure_texture
remove_texture
get_texture
paint_texture
export_texture
```

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before Texturing handoff.

The existing Painter/UI-state wrappers leave the production surface after replacement behavior is verified.

### INTENT_LOADED

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

Intent examples that require these routes include:

```text
PBR
RTX
Vibrant Visuals
normal map
height map
MER / MERS
metalness
roughness
emissive surface
subsurface
texture_set
texture layers/groups
animated texture
per-face material instances
```

PBR correctness remains mandatory whenever its capability is loaded:

```text
exclusive channel membership
normal XOR height
MER vs MERS semantics
one PBR correction owner
```

Normal `get_texture` / `paint_texture` remain frame-aware so animated textures do not create a second bitmap-authoring model.

---

## Animation

### AUTO_LOADED

```text
create_animation
configure_animation
remove_animation
manage_keyframes
inspect_animation
capture_animation_views
export_animation_file
```

Retire after replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

Additional efficiency requirements inside existing owners:

```text
create_animation
  → source_animation clone

capture_animation_views
  → frames | contact_sheet
```

### INTENT_LOADED

```text
manage_animation_effects
manage_animation_controller
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

Route exact intent only:

```text
particle/sound/timeline-instruction keyframes → manage_animation_effects
state-driven runtime composition              → manage_animation_controller
explicit editor playback                      → animation_playback
Bezier/editor curve work                      → manage_animation_curves
animation/controller file import              → import_animation_file
objective sampled motion QA                    → validate_animation_motion
```

`manage_animation_controller` still needs:

```text
delete_controller
duplicate_controller
duplicate_state
ordered transitions
ordered animation links
blend_transition_curve
explicit Bedrock short keys
```

`manage_animation_curves` retains the bake-before-Bedrock-delivery boundary. `validate_animation_motion` is objective sampled QA, not a subjective quality score.

`bone_rigging` remains Geometry-owned and is dismantled there.

---

# Critical correctness contracts to preserve during local implementation

## Core / project

```text
open_project uses native project/Bedrock codecs
no handwritten .bbmodel parser
replace-current requires explicit unsaved handling
new-tab load returns exact selected project identity
rectangular logical UV allowed
logical UV change requires keep|rescale_uv policy
rescale_uv preflights Box-UV/per-face exactness before Undo
static visible bounds remain native auto-calculated
explicit/expand visible bounds only extend runtime/animation coverage safely
multi-project reads identify selected project explicitly
```

## Geometry

```text
faithful subtree duplication
export-safe identity
per-face UV correction through one Cube owner
world/local reparent semantics
TextureMesh coverage
world-space measurement/contact
one full preflight before Undo
```

## Texturing

```text
no implicit 16×16 blank create
rectangular native texture layouts remain valid
one exact bitmap mutation owner
face-local + animated-frame-local mapping
revision stale-write guard before Undo
one Undo + exact affected RGBA postcondition
PNG/TGA standalone delivery

when PBR capability is loaded:
  exclusive PBR channel membership
  normal XOR height
  MER vs MERS semantics
```

## Animation

```text
full loop modes + native metadata:
  override_previous_animation
  anim_time_update
  blend_weight
  start_delay
  loop_delay

Animation identifiers:
  start with a letter
  letters/numbers/underscore/period only

keyframes:
  multi-bone/multi-channel explicit batch
  numeric + Molang
  pre/post
  linear/catmullrom direct Bedrock
  step via pre/post
  Bezier editor-only → bake before Bedrock delivery

controllers when controller capability is loaded:
  delete lifecycle
  duplicate controller/state
  ordered transitions
  ordered animation links
  blend_transition_curve
  explicit Bedrock short animation/controller keys
  nested/external controller-animation references

verification:
  temporary pose capture restores editor state
  bounded contact-sheet temporal evidence
  optional Molang preview context restored

file delivery:
  native AnimationCodec compile/export
  unbaked Bezier blocks direct Bedrock export
```

Minecraft controller state `variables/remap_curve` is an **INTENT_LOADED Bedrock extension gap** because current native Blockbench state objects do not ordinarily persist it. Do not claim support until local implementation proves import → project save/reopen → Undo → inspect → compile/export round trip. Fail explicitly rather than silently dropping it.

---

# LOCAL_CODE implementation sequence

When the PC/local batch begins:

```text
1. git checkout Local
2. git pull --ff-only
3. cd mcp
4. bun install --frozen-lockfile

5. run smallest prepared pure regressions first:
   Core / Project:
     bedrock-project-semantics
   Geometry:
     oriented-box-contact
     blockbench-cube-obb
   Texturing:
     face-pixel-mapping
     texture-revision
     texture-frame-mapping
     pbr-material-membership
   Animation:
     animation-preview-state
     bedrock-animation-semantics

6. Core/project lifecycle consolidation:
   open_project using native codecs
   create_project rectangular logical UV contract
   configure_project model_identifier + logical UV policy + visible bounds
   get_project_info current/all scope
   INTENT_LOADED manage_project_session

7. Geometry public consolidation:
   AUTO_LOADED owner consolidation
   modify_cubes_batch final owner + per-face UV
   universal finder/locator/null ownership
   reparent preserve local/world
   measure_geometry
   INTENT_LOADED TextureMesh/reference/bounding/item-display/reference-image owners
   retire duplicate Geometry routes

8. Texturing public consolidation:
   AUTO_LOADED classic texture surface only
   create_texture dimension/clone contract
   configure_texture + remove_texture
   get_texture scoped/revision/frame reads
   unified paint_texture
   export_texture PNG/TGA
   PBR/advanced texture/material-instance routes as INTENT_LOADED capabilities
   retire duplicate Painter/material-instance routes

9. Animation public consolidation:
   AUTO_LOADED clip/keyframe/inspect/capture/export surface
   create_animation full native metadata/value coverage + source_animation clone
   configure_animation + remove_animation
   unified multi-target manage_keyframes
   remove Timeline-selection/global-clipboard dependency
   effects/controllers/playback/curves/import/motion validation as INTENT_LOADED capabilities
   controller delete/order/blend-curve/key-link + duplicate state/controller corrections
   expand inspect_animation list/focused coverage
   capture_animation_views + contact sheet
   export_animation_file

10. implement capability exposure after owner schemas/behavior are ready:
    AUTO_LOADED = automatically available for active phase
    INTENT_LOADED = narrow intent/evidence lookup only when needed
    one lookup may return a bounded closely relevant definition set; actions still use one exact owner
    same-phase category transitions require no reload/reconnect/reset
    already available INTENT_LOADED definitions are reused instead of searched again
    do not infer runtime counts from this document

11. update specialist Skills / runtime prompt / phase routing from the measured final catalog using the same AUTO_LOADED / INTENT_LOADED vocabulary only

12. bun run prompts:build
13. bun run docs:build
14. bun run docs:check
15. bun run verify:mcp

16. review generated + source diff for stale/dead tool names or retired category terms
17. measure actual AUTO_LOADED and full available counts per phase
18. deploy/reload BlockIT

19. LIVE open/save/reopen project lifecycle fixture
20. LIVE Geometry AUTO_LOADED E2E
21. LIVE Geometry INTENT_LOADED fixture(s)
22. LIVE Texturing classic AUTO_LOADED E2E
23. LIVE Texturing PBR/advanced INTENT_LOADED fixture(s)
24. LIVE Animation AUTO_LOADED E2E
25. LIVE Animation INTENT_LOADED effects/controller fixture(s)
26. same-phase AUTO_LOADED ↔ INTENT_LOADED transition E2E with no reload/reconnect
27. INTENT_LOADED reuse E2E: same capability twice with no second lookup
28. cross-phase handoff E2E
29. measure Cost to Accepted Result and context/tool-search cost
30. compare three measured surfaces without creating new runtime categories:
    a. all retained active-phase capabilities exposed
    b. proposed AUTO_LOADED + INTENT_LOADED split
    c. a deliberately smaller AUTO_LOADED candidate
31. keep the surface with the lowest Cost to Accepted Result while preserving accepted quality and full capability reachability
```

Do not split this into a new roadmap. This file remains the single continuation owner.

---

# Cross-phase and category-transition live proof additions

The local/live batch must prove:

```text
.bbmodel export → open_project → exact project state survives
Bedrock geometry open path
new-tab vs replace-current unsaved behavior
multi-project scope=current|all identity
64×32 and other rectangular logical UV fixtures
logical UV keep policy
logical UV rescale policy with exact Box-UV/per-face preflight
native static visible-bounds auto behavior
explicit/expanded visible bounds for animation envelope
whole Animation clone
controller/state duplicate
contact-sheet capture + full editor-state restoration

CAPABILITY ROUTING
AUTO_LOADED intent calls direct route with zero capability lookup
first INTENT_LOADED intent requires at most one narrow lookup for the coherent intent
same INTENT_LOADED capability reused later requires zero new lookup while current definition remains available
AUTO_LOADED → INTENT_LOADED requires no phase switch/reload/reconnect
INTENT_LOADED → AUTO_LOADED requires no unload/reset/reconnect
INTENT_LOADED → INTENT_LOADED reuses available definitions first and performs a new lookup only for an unavailable needed capability
foreign-phase capability never enters INTENT_LOADED lookup
classic Texture session does not load PBR capability without matching intent/evidence
PBR intent loads only closely relevant definitions + existing AUTO_LOADED surface
basic Animation clip does not load controller/effects capabilities
controller intent does not load unrelated INTENT_LOADED capabilities
basic Geometry does not load TextureMesh/reference/item-display capabilities
full capability remains discoverable when exact intent requires it

EFFICIENCY MEASUREMENT
record initial tool/schema context cost
record INTENT_LOADED lookup count
record repeated lookup count
record wrong-route / wrong-phase attempts
record mutation/readback/correction count
record phase handoff + reload/reconnect count
record elapsed workflow cost when measurable
compare all metrics against accepted-result quality
```

---

# Final completion gate

No phase may be called complete from static source alone.

```text
SOURCE/DESIGN READY
≠
LOCAL PASS
≠
LIVE PASS
```

Final completion requires:

```text
public ownership matches curated coverage
only AUTO_LOADED and INTENT_LOADED exist as capability-category vocabulary
AUTO_LOADED surface contains only evidence-justified active-phase routes
INTENT_LOADED capability remains discoverable but absent from automatically loaded context
one narrow INTENT_LOADED lookup may return bounded closely relevant definitions without creating a pack/category
already available INTENT_LOADED definitions are reused without repeated lookup
same-phase category transitions never require reload/reconnect/reset
PBR absent from classic Texturing context unless requested/evidenced
all generated prompt/docs current
bun run verify:mcp PASS
project open/save/reopen fixture PASS
live AUTO_LOADED authoring fixtures PASS
representative INTENT_LOADED fixtures PASS
same-phase category-transition fixtures PASS
INTENT_LOADED reuse fixture PASS
live evidence/restore fixtures PASS
cross-phase handoffs PASS
AUTO_LOADED membership selected from measured Cost to Accepted Result rather than a copied tool-count threshold
phase reload/reconnect cost measured before any separate phase-switch redesign is considered
measured context/tool-search cost is lower than the worse tested alternatives without accepted-quality regression
no known P0/P1 correctness hole
```

Route-1 historical live validation and old experiments remain inactive unless concrete evidence makes them relevant to the current implementation batch.
