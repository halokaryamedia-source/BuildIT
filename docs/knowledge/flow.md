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
