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

REFERENCE PREPARATION → blockbench-reference-generator
ASSET AUTHORING       → BlockIT Gateway → Reference Grounding → ACTIVE PHASE → active specialist only
REPOSITORY WORK       → Bounded | Standard | Complex → exact owner + nearest AGENTS.md
LOCAL ACCEPTANCE      → formal procedure only when next-action.md explicitly reactivates it
```

Execution context describes available capability, not product/UI identity and not procedure activation. `LIVE_BLOCKBENCH` permits targeted live debugging when the task requires it; it does **not** activate the formal Local Acceptance runbook. Repository hardening never silently continues into image generation.

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
→ INTERNAL GENERATION BRIEF
→ Minecraft-first geometry + texture target
→ source-nearest orthographic anchor
→ stable/readable pose
→ FIVE-PREVIEW COVERAGE BOARD
   UPPER: SIDE | FRONT | BACK
   LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
→ readiness
→ EXECUTION CONSENT GATE — fresh instruction required
→ one Draft
→ visual gate
→ at most one material correction
→ USER APPROVAL
→ ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
```

The generator returns one image only. The approved image becomes visual authority for reference-driven authoring. Requested dimensions remain numeric authority. Reference preparation does **not** choose between separate authoring routes.

## 3. Reference-Grounded Authoring

Normal authoring has one flow:

```text
APPROVED IMAGE + HANDOFF CONSTRAINTS
+ OPTIONAL 3D EVIDENCE WHEN ALREADY AVAILABLE/USEFUL
→ GEOMETRY
→ TEXTURING
→ ANIMATION when required
→ FINALIZE / EXPORT
```

Authority is fixed:

```text
approved image       → visual authority
requested dimensions → numeric envelope authority
optional 3D Evidence → supporting depth/volume/attachment/hidden-side evidence
raw GLB bounds       → observation only
```

Optional 3D Evidence is **not a second route**, is Geometry-only, and never becomes production geometry. Hunyuan, PrimitiveAnything, manual GLB preparation, or another future provider belongs to the evidence-production/research layer, not the normal authoring mental model.

For persistent work:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only required references/assets
→ actual approved reference visible when visual judgement is needed
```

### 3.1 Geometry

Geometry owns shape, hierarchy, rig, Locator/Null mutation, UV Layout, and optional 3D Evidence lifecycle.

Construction representations are examples, **not presets**. Decide transform ownership before coordinates. Form/contact/articulation-defining Groups/Pivots may belong in the **PRIMARY BLOCKOUT**; neutral organization stays downstream.

Normal image-grounded path:

```text
identity + requested envelope + primary masses
→ construction + transform ownership
→ REQUIRED PRIMARY GROUPS/PIVOTS only where form/contact/articulation needs them
→ coherent PRIMARY BLOCKOUT
→ complete primary + identity-weighted secondary geometry
→ canonical model views
→ difference-first approved-reference ↔ model comparison
→ PASS | FAIL | UNVERIFIED
→ smallest causal correction when needed
```

Minor drift uses one consistent Minecraft interpretation; unresolved **material conflict** blocks rather than being averaged into invented geometry.

Optional 3D Evidence path is only an evidence branch inside the same Geometry phase:

```text
approved image + approved clean GLB
→ manage_geometry_reference(load)
→ align evidence to requested envelope using uniform scale only
→ fresh aligned evidence
→ use only supported 3D relationships
→ normal semantic Groups/Cubes
→ remove transient reference before production export
```

Exact GLB generation, fixture preparation, provenance, and alignment procedure live in `Experimental/three-d-assisted-hunyuan-poc/README.md`; normal flow does not duplicate them.

Geometry efficiency rules:

```text
no per-Cube inspection ceremony
no screenshot-per-mutation loop
batch coherent known Cube work
bounds only for envelope/scale/ground/displacement
add secondary detail only when identity-weighted and useful to silhouette/contact/layering/motion
visual correction starts from the first observed wrong owner
```

Geometry `PASS` is the shared convergence point whether optional 3D Evidence was used or not.

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
remove transient optional 3D Evidence
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

This is the developer/user mental model for normal BlockIT authoring. The client should think about **intent and phase**, not the native Runtime tool catalog.

### 7.1 Start an asset task

If an approved reference already exists:

```text
USER REQUEST + APPROVED IMAGE + DIMENSIONS/CONSTRAINTS
→ AI client stays connected to BlockIT Gateway
→ Geometry is the default authoring phase
→ use the active specialist
→ execute the smallest exact capability needed
→ verify the phase result
→ hand off only when the next phase is ready
```

If the reference does not exist yet:

```text
USER REQUEST
→ Reference Preparation
→ USER APPROVAL
→ approved image becomes visual authority
→ start normal authoring at Geometry
```

If optional 3D Evidence does not already exist or is not materially useful, skip it entirely. Do not generate 3D merely because the feature exists.

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

Do not turn `search_capabilities` into a second router. Phase/specialist ownership decides the route first; discovery only loads missing capability information afterward.

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

A new tool, schema, provider, or experiment should not automatically create a new route, profile, phase, or client-facing Gateway tool.

Use `docs/knowledge/implementation-map.md` for the exact current source owner of each boundary.

### 8.1 Adding a Runtime capability

Use this decision tree first:

```text
NEW CAPABILITY
→ What user intent does it satisfy?
→ Which existing owner is responsible?
   shared lifecycle/read/recovery → Core
   geometry/rig/UV/evidence       → Geometry
   texture/PBR/Painter            → Texturing
   motion/keyframes/controllers   → Animation
→ Which routing tier?
   frequent canonical hot path    → PRIMARY
   conditional valid operation    → SUPPORT
   explicit research/evidence     → EXPERIMENTAL
   debug/legacy fallback          → MAINTENANCE
→ implement in the existing Runtime owner
→ classify it in the existing phase model
→ expose it through Gateway discovery/invocation
→ update only the specialist guidance that needs to know it
→ add/update regression coverage
```

Important rules:

1. **Do not add a fifth Gateway tool** just because a new Runtime capability exists. The Gateway remains `status`, `search_capabilities`, `describe_capability`, `invoke_capability`.
2. **Do not create a new authoring profile** for a normal capability. The internal `extended` identifier is compatibility/debug only.
3. **Do not create a new phase** when the capability clearly belongs to Geometry, Texturing, Animation, or Core.
4. New capabilities default conceptually to **Support** unless there is a clear reason they belong on the normal hot path.
5. Promote to **Primary** only when the capability is a normal canonical operation that should rank highly during routine authoring.
6. Use **Experimental** for opt-in evidence/research behavior, not merely because a tool is new.
7. Use **Maintenance** for generic UI/debug/legacy fallback behavior; maintenance must never outrank authored BlockIT operations.

Current implementation boundaries:

```text
phase ownership/classification → mcp/lib/authoringPhase.ts
Gateway tier/ranking           → mcp/gateway/contract.ts
exact Runtime operation        → existing owner under mcp/server/tools/ or mcp/server/tools.ts
specialist decision guidance   → .agents/skills/<active specialist>/SKILL.md
source/regression lookup       → docs/knowledge/implementation-map.md
```

### 8.2 Changing a capability schema

If the user-facing semantic operation is still the same, keep the same capability name.

```text
same semantic capability
→ evolve input/output schema
→ update description when needed
→ update executor + tests
→ let describe_capability expose the current schema
```

Do **not** create `tool_v2`, a second profile, or another authoring route only because the schema changed.

A new capability name is justified when the semantic operation/ownership is materially different, not merely because parameters changed.

### 8.3 Renaming a capability

Treat rename as a contract migration, not a text-only cleanup.

```text
rename Runtime capability
→ update registration/executor owner
→ update phase classification
→ update Gateway tier classification when explicitly tiered
→ update specialist routing references
→ update regression tests
→ update generated/reference docs through the normal build path
→ remove stale canonical name
```

Keep a compatibility alias only when there is a proven compatibility requirement. Do not permanently keep two names for the same normal operation because it makes discovery and agent choice worse.

### 8.4 Removing a capability

Before deletion, answer:

```text
Does a supported user intent still depend on this capability?
```

If **no**:

```text
remove implementation
→ remove registration/phase exposure
→ remove specialist routing references
→ remove/update tests and generated docs
```

If **yes**, replace the missing semantic operation with an authored capability before removing the old one.

Never silently replace a removed real capability with `trigger_action`, `emulate_clicks`, `fill_dialog`, or `risky_eval` in normal authoring.

### 8.5 Moving a capability between phases

Move a capability only when its semantic owner changes.

Examples:

```text
Cube/Group/rig/UV mutation     → Geometry
Texture Atlas/Painter/PBR      → Texturing
keyframe/timeline/controller   → Animation
shared read/recovery/lifecycle → Core when genuinely cross-phase
```

Do not make a mutation Core merely to avoid a phase handoff. Phase boundaries exist to keep the authoring surface legible.

If a capability changes owner, update `mcp/lib/authoringPhase.ts`, specialist guidance, readiness/handoff behavior, and regression coverage together.

### 8.6 Adding another 3D/reference provider

A provider is not an authoring phase.

Correct model:

```text
Hunyuan / PrimitiveAnything / future provider / manual GLB
→ evidence-production or research layer
→ optional clean evidence artifact
→ Geometry consumes it through manage_geometry_reference when useful
→ normal Geometry production remains semantic Groups/Cubes
```

Do not create:

```text
Hunyuan Profile
PrimitiveAnything Profile
3D-Assisted Authoring Phase
Provider-specific Gateway tools
```

unless a future, repeatedly proven product requirement demonstrates that the existing evidence boundary cannot represent the need.

### 8.7 When architecture expansion is justified

Before introducing a new phase, route, profile, Gateway tool, persistent state system, or abstraction layer, require a concrete capability gap that cannot fit the current model.

Valid reason:

```text
repeated real user intent
+ cannot be represented safely in Core/Geometry/Texturing/Animation
+ existing Gateway invocation cannot express the operation
+ capability loss or reliability problem is demonstrated
```

Invalid reasons:

```text
tool count feels large
one experiment has a different provider
one schema became more complex
one capability was renamed
a direct Runtime tools/list changed
an implementation file is large
```

## 9. Development Guardrails Checklist

Before finishing a capability change, check these questions:

```text
[ ] Does normal authoring still read as one flow:
    approved image + optional 3D Evidence → Geometry → Texturing → optional Animation?

[ ] Is the AI client boundary still the four-tool Gateway?

[ ] Does the changed capability have one clear owner:
    Core, Geometry, Texturing, or Animation?

[ ] Is its tier intentional:
    Primary, Support, Experimental, or Maintenance?

[ ] Can a known capability still be invoked directly without mandatory search?

[ ] Does foreign-phase work use HANDOFF_REQUIRED + switch_authoring_phase
    instead of borrowing mutation tools?

[ ] Did schema-only evolution keep the same semantic capability name?

[ ] Did rename/remove work delete stale canonical references rather than
    leaving duplicate normal tools indefinitely?

[ ] Did no provider/research feature leak into a new normal authoring route/profile?

[ ] Did no normal instruction reintroduce MCP reconnect/new-chat as a phase step?

[ ] Are generic UI/eval fallbacks still debug/maintenance only?

[ ] Are capability counts being treated as observations, not optimization targets?

[ ] Did the exact source owner + regression owner get updated together?
```

If the answer to one of the architectural questions is **no**, stop before adding another abstraction. First determine whether the problem is actually a missing Runtime capability, a phase-ownership mistake, a Gateway ranking issue, or only stale documentation.
