# BlockIT Flow

Updated: 2026-09-04

This is the **single detailed current flow**. Root `AGENTS.md` owns execution-context and task routing.

## 1. Route

```text
PIN CURRENT AUTHORITY
→ EXECUTION CONTEXT
   REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH
→ PROOF CEILING
→ TASK CLASS

REFERENCE PREPARATION → ChatGPT image generation / review
ASSET AUTHORING       → BlockIT Gateway → Geometry Strategy → ACTIVE PHASE → active specialist only
REPOSITORY WORK       → Bounded | Standard | Complex → exact owner + nearest AGENTS.md
LOCAL ACCEPTANCE      → formal procedure only when next-action.md explicitly reactivates it
```

Execution context describes available capability, not product/UI identity and not procedure activation. `LIVE_BLOCKBENCH` permits targeted live debugging when the task requires it; it does **not** activate the formal Local Acceptance runbook. Repository hardening never silently continues into image generation.

## 2. Reference Preparation

Reference-image generation belongs in **ChatGPT**, not normal Codex/BlockIT authoring. The repository keeps the reference-generation contract as specification/history, but Codex should consume the approved output rather than attempt to reproduce the image-generation stage.

```text
SOURCE IMAGE + USER INTENT
→ CHATGPT REFERENCE GENERATION
→ Minecraft-first geometry + texture target
→ FIVE-PREVIEW COVERAGE BOARD
→ USER REVIEW / CORRECTION
→ USER APPROVAL
→ ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
```

The approved image becomes visual authority for reference-driven authoring. Requested dimensions remain numeric authority. Reference preparation does **not** choose an MCP phase or create a separate client route.

## 3. Reference-Grounded Authoring

Normal authoring has one downstream pipeline but **two Geometry entry strategies**:

```text
APPROVED IMAGE + HANDOFF CONSTRAINTS
→ choose Geometry strategy from subject form

A. IMAGE-GUIDED GEOMETRY
   simple / mostly cuboid / mechanically readable subject
   → Geometry directly from approved image

B. ORGANIC-COMPLEX GEOMETRY
   organic humanoid/animal or similarly curved subject
   with many rotations, bends, curved volumes, or non-cuboid form relationships
   → approved image → shape GLB → PrimitiveAnything → Cuboid Scaffold
   → normal semantic Geometry cleanup/refinement

BOTH
→ GEOMETRY PASS
→ TEXTURING
→ ANIMATION when required
→ FINALIZE / EXPORT
```

### 3.0 Geometry strategy rule

`complex` in this authoring decision means **organic-form complexity**, not simply many parts or a high Cube count.

Typical **Organic-Complex** indicators:

- humanoid or animal body plan;
- many rotated masses or articulated segments;
- bends/curves that are difficult to approximate cleanly from flat image evidence alone;
- organic transitions between major volumes;
- irregular silhouette where a direct cuboid blockout would require substantial spatial guessing.

Typical **Image-Guided** indicators:

- architecture, furniture, machinery, props, lifts, boxes, panels, vehicles, or other mechanically readable forms;
- primarily cuboid/planar/stepped construction;
- many parts are allowed when their spatial relationships remain clear and directly buildable.

Do **not** classify an object as Organic-Complex merely because it has many parts. A complex-looking mechanical object can still use Image-Guided Geometry when its construction is explicit. Conversely, a relatively simple-looking animal/humanoid can use Organic-Complex Geometry when its pose/form depends on many rotations, bends, and organic volume relationships.

Current selection intent:

```text
mechanical / cuboid-readable
→ IMAGE-GUIDED

organic humanoid / animal
+ many rotations / bends / curved relationships
→ ORGANIC-COMPLEX
```

This decision selects the **Geometry starting strategy only**. It does not create another Gateway, profile, authoring phase, Texturing path, Animation path, or export path.

Authority remains fixed in either strategy:

```text
approved image       → visual authority
requested dimensions → numeric envelope authority
shape GLB            → intermediate 3D shape evidence for Organic-Complex Geometry
PrimitiveAnything    → intermediate primitive decomposition
Cuboid Scaffold      → editable starting geometry, not final production authority
```

For persistent work:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only required references/assets
→ actual approved reference visible when visual judgement is needed
```

### 3.1 Geometry

Geometry owns shape, hierarchy, rig, Locator/Null mutation, UV Layout, and Organic-Complex scaffold cleanup/refinement.

Construction representations are examples, **not presets**. Decide transform ownership before coordinates. Form/contact/articulation-defining Groups/Pivots may belong in the **PRIMARY BLOCKOUT**; neutral organization stays downstream.

#### Strategy A — Image-Guided Geometry

```text
approved image + requested envelope
→ identity + primary masses
→ construction + transform ownership
→ REQUIRED PRIMARY GROUPS/PIVOTS where form/contact/articulation needs them
→ coherent PRIMARY BLOCKOUT
→ complete primary + identity-weighted secondary geometry
→ canonical model views
→ difference-first approved-reference ↔ model comparison
→ PASS | FAIL | UNVERIFIED
→ smallest causal correction when needed
```

#### Strategy B — Organic-Complex Geometry

The intended high-level path is:

```text
approved image
→ generate/approve shape GLB
→ PrimitiveAnything decomposition
→ convert accepted primitive decomposition into Cuboid Scaffold
→ load/materialize scaffold as native editable Blockbench Groups/Cubes
→ keep approved image as visual authority
→ semantic cleanup / merge / remove / resize / rotate / reparent / rename as needed
→ build production hierarchy
→ reference comparison
→ GEOMETRY PASS
```

The GLB and PrimitiveAnything output are **intermediate geometry aids**. Neither replaces modelling judgement. The Cuboid Scaffold is not final geometry and may be materially simplified or corrected when the approved image demands it.

Until the PrimitiveAnything production bridge is promoted from Experimental, its exact generation/conversion procedure remains owned by `Experimental/primitiveanything-poc/README.md` and related experimental source.

Geometry efficiency rules:

```text
no per-Cube inspection ceremony
no screenshot-per-mutation loop
batch coherent known Cube work
bounds only for envelope/scale/ground/displacement
add secondary detail only when identity-weighted and useful to silhouette/contact/layering/motion
visual correction starts from the first observed wrong owner
```

Geometry `PASS` is the shared convergence point for both Geometry strategies.

### 3.2 UV Layout / Texturing

Canonical vocabulary stays distinct:

```text
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas
TEXTURE STYLING = color/material/shading/detail
TEXTURE VERIFY  = fresh atlas + mapped-model validation
```

After Geometry `PASS`:

```text
fresh authored UV state
→ final UV ownership/orientation
→ final Box-UV lock where applicable
→ list_textures global UV audit
→ UV LAYOUT PASS
→ one base-color Texture Atlas
→ Texture Styling
→ fresh atlas + affected model views
→ TEXTURE PASS | FAIL | UNVERIFIED
```

Primary normal texturing routes are `create_texture`, `activate_texture`, `get_texture`, `paint_fill_tool`, `draw_shape_tool`, `paint_with_brush`, `eraser_tool`, `manage_material`, and `manage_material_instances`. Advanced Painter state, presets, selections, layers, imported texture sets, and similar utilities are support capabilities, not default hot-path work.

If Geometry/UV correction is required:

```text
HANDOFF_REQUIRED(geometry)
→ preserve resume-critical state
→ invoke switch_authoring_phase through Gateway
→ Gateway refreshes Runtime catalog
→ load Geometry specialist
→ continue same task/chat
```

No MCP reconnect or new chat is part of a normal phase handoff.

### 3.3 Animation (optional)

Animation activates only when motion is required.

```text
TEXTURE PASS
→ motion intent
→ reuse Geometry hierarchy/pivots
→ create_animation / manage_animation_timeline
→ effects/controller only when requested or evidenced
→ visual motion check
→ ANIMATION PASS | FAIL | UNVERIFIED
```

If a structural rig/pivot defect is found, hand it back to Geometry through the Gateway; do not borrow Geometry mutation in Animation.

### 3.4 Phase handoff contract

The Runtime still exposes **MCP Core + exactly one active phase** because phase-scoped routing improves tool selection. Gateway keeps the client-facing tool list stable.

```text
foreign-phase need
→ HANDOFF_REQUIRED
→ target_phase + reason + readiness + resume_from
→ invoke switch_authoring_phase
→ Gateway invalidates backend catalog
→ next capability request refreshes current Runtime surface
→ continue same task with next specialist
```

`HANDOFF_REQUIRED` means **stop using the current phase's mutation routes**, not stop the whole task and not reconnect the client.

### 3.5 Finalization

After Texture PASS and optional Animation PASS:

```text
remove transient geometry evidence when applicable
→ validate Bedrock structure/references
→ save final .bbmodel
→ final visual gate
→ BLOCKBENCH_READY | FAIL | UNVERIFIED
```

Save only deliberate deliverables. Tool success, JSON validity, or successful save alone never creates visual PASS.

For persistent projects, save at **meaningful handoff/resume/park/completion boundaries**, not after every mutation or capture. Git history owns prior revisions.

## 4. Runtime capability model

Normal client boundary:

```text
AI client → 4-tool BlockIT Gateway → phase-filtered Runtime → Blockbench
```

Runtime retains **51 callable capabilities across phases**. Capability count is not itself an efficiency target. Gateway discovery prioritizes capabilities by internal tier:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  debug/legacy fallback; de-prioritized
```

There is no normal Standard/Extended authoring profile choice. Internal `extended` compatibility only enables Legacy UI Fallback families for debug/maintenance; `risky_eval` and `from_geo_json` remain disabled.

## 5. Repository Work

```text
PIN current Local
→ EXECUTION CONTEXT + PROOF CEILING
→ GITHUB_RULES.md Core Rules
→ classify Bounded | Standard | Complex
→ exact owner + nearest AGENTS.md
→ recover CONTEXT.md / next-action only when material
→ development-brief only when Complex
→ one smallest coherent patch
→ minimum useful proof within current ceiling
→ STOP AND REPORT
```

## 6. Evidence / Continuity

```text
REMOTE_GITHUB   = repository/source/docs/static/CI evidence
LOCAL_CODE      = REMOTE_GITHUB + local Bun/build/test/generator/filesystem evidence
LIVE_BLOCKBENCH = LOCAL_CODE + installed BlockIT + functioning Gateway/runtime/model evidence

repository continuation    → docs/knowledge/next-action.md
active asset continuity    → workspace/active/<project>/README.md
saved asset package        → workspace/saved/<project>/
asset workspace rules      → workspace/README.md
stable facts               → CONTEXT.md
current proof state        → docs/knowledge/current-validation.md
current source ownership   → docs/knowledge/implementation-map.md
formal local acceptance    → docs/knowledge/operations/local-acceptance-runbook.md only when reactivated
historical rationale       → Git history / GitHub issues and PRs
```

Do not create duplicate route systems, authoring profiles, roadmap/review indexes, decision logs, manifest layers, or parallel workspace-state systems.

## 7. Practical Usage Flow

This is the developer/user mental model for normal BlockIT authoring. The client should think about **intent, Geometry strategy, and phase**, not the native Runtime tool catalog.

### 7.1 Start an asset task

```text
USER REQUEST
→ approved reference exists?
   NO  → generate/approve it in ChatGPT
   YES → continue
→ classify Geometry strategy
   mechanical/cuboid-readable → Image-Guided
   organic humanoid/animal with many rotations/bends/curves → Organic-Complex
→ Geometry
→ Texturing
→ Animation if required
→ Finalization
```

Static asset:

```text
Geometry PASS
→ Texturing PASS
→ Finalization
```

Animated asset:

```text
Geometry PASS
→ Texturing PASS
→ Animation PASS
→ Finalization
```

### 7.2 Gateway tool usage

The AI client has only four stable Gateway tools:

| Gateway tool | Use it when |
|---|---|
| `status` | Runtime availability/build/phase is uncertain, especially around development reload/restart or debugging. |
| `search_capabilities` | The required Runtime capability is genuinely unknown or stale. Do not use it as the first step when the exact capability is already known. |
| `describe_capability` | The current input schema is needed before a call. Load it once, then act. |
| `invoke_capability` | Normal execution path for known Runtime capabilities. Most authoring work should end here. |

Normal hot path:

```text
known intent + known capability
→ invoke_capability
```

Deferred discovery path:

```text
known intent + unknown/stale capability
→ search_capabilities
→ describe_capability only if schema is needed
→ invoke_capability
```

Do not turn `search_capabilities` into a second router. Geometry strategy and phase/specialist ownership decide the route first; discovery only loads missing capability information afterward.

### 7.3 Phase changes during the same task

Example Geometry → Texturing:

```text
Geometry reaches readiness
→ HANDOFF_REQUIRED(texturing)
→ preserve target_phase + reason + readiness + resume_from
→ invoke `switch_authoring_phase` through Gateway
→ Gateway refreshes the Runtime catalog
→ load Texturing specialist
→ continue the same task/chat
```

The same rule applies Texturing → Animation and any return to Geometry.

Do **not** add instructions such as:

```text
restart Codex
open a new chat
reconnect MCP because the phase changed
```

Those are not normal authoring steps.

### 7.4 Runtime/plugin development reloads

The connection boundary remains:

```text
AI client → Gateway → Runtime/Blockbench
```

During development, Runtime/Blockbench may be rebuilt or restarted while Gateway remains the client boundary. A Runtime change does not automatically justify changing client configuration or creating a new task/chat.

When Runtime state is uncertain after a development reload:

```text
Gateway status
→ Runtime available?
   NO  → report backend unavailable; do not invent capability
   YES → continue
→ search/describe only if the required capability definition changed or is unknown
→ invoke current capability
```

Direct Runtime MCP remains an Inspector/conformance/debug surface, not the normal AI authoring connection.

## 8. How to Continue Developing Safely

The safest rule is:

> **Expand Runtime capability behind the existing Gateway/phase model before expanding architecture.**

A new tool, schema, provider, scaffold generator, or experiment should not automatically create a new Gateway, profile, or authoring phase. A materially different Geometry preparation method may become a Geometry strategy only when it still converges into the same Geometry ownership and downstream pipeline.

Use `docs/knowledge/implementation-map.md` for the exact current source owner of each boundary.

### 8.1 Adding a Runtime capability

Use this decision tree first:

```text
NEW CAPABILITY
→ What user intent does it satisfy?
→ Which existing owner is responsible?
   shared lifecycle/read/recovery → Core
   geometry/rig/UV/scaffold       → Geometry
   texture/PBR/Painter            → Texturing
   motion/keyframes/controllers   → Animation
→ Which routing tier?
   frequent canonical hot path    → PRIMARY
   conditional valid operation    → SUPPORT
   explicit research/evidence     → EXPERIMENTAL
   debug/legacy fallback          → MAINTENANCE
```

Then implement behind the existing Gateway. Do not add a fifth Gateway tool merely because Runtime gained one capability.

### 8.2 Adding or changing Geometry preparation

Ask first:

```text
Does this change how Geometry is initially inferred/built,
while still converging into normal native Groups/Cubes?

YES → it may be a Geometry strategy/experimental scaffold path
NO  → keep it as a normal Geometry capability or support tool
```

Current strategies:

```text
Image-Guided
Organic-Complex: approved image → GLB → PrimitiveAnything → Cuboid Scaffold
```

Do not create provider-specific authoring routes such as `Hunyuan Route` or `PrimitiveAnything Phase`. Providers and converters belong inside the Organic-Complex Geometry strategy.

### 8.3 Renaming/changing/removing a capability

Treat a rename/schema change as one contract migration across the Runtime registration, phase owner, Gateway tier when explicit, specialist skill, tests, and generated docs. Do not preserve two canonical names indefinitely without a real compatibility requirement.

When removing a capability, first decide whether its user intent still exists. If yes, provide the authored replacement before removal. Do not silently route normal work through generic UI/eval fallbacks.

### 8.4 Before introducing a new architecture concept

Ask:

```text
Can this requirement be represented by:
Gateway
+ existing Geometry strategy
+ Core / Geometry / Texturing / Animation
+ capability tier?
```

If yes, do not add a new route/profile/phase/client boundary. Architecture expansion requires a repeated evidenced requirement that cannot be expressed by the existing model.
