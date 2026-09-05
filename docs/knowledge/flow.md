# BlockIT Flow

Updated: 2026-09-05

This is the **single detailed current flow**. Root `AGENTS.md` owns task routing; `workspace/README.md` owns asset continuity; `next-action.md` owns implementation continuation.

## 1. Route / Proof Ceiling

```text
PIN CURRENT AUTHORITY
→ EXECUTION CONTEXT
   REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH
→ PROOF CEILING
→ TASK CLASS
```

```text
REMOTE_GITHUB   = repository/source/docs/static/CI evidence
LOCAL_CODE      = REMOTE_GITHUB + local build/generator/filesystem evidence
LIVE_BLOCKBENCH = LOCAL_CODE + installed BlockIT + functioning Gateway/runtime/model evidence
```

Asset authoring that needs live Blockbench belongs to `LIVE_BLOCKBENCH`; this does not activate formal Local Acceptance unless explicitly requested.

## 2. Product Boundary

```text
REFERENCE CREATION → ChatGPT
ASSET AUTHORING    → Codex → BlockIT Gateway → Runtime → Blockbench
PERSISTENCE        → workspace/active/<asset>/
USER STAGE REVIEW  → live Blockbench
```

Gateway client surface stays fixed:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Geometry and Texturing use one shared **AUTHORING Runtime surface**. Their semantic owners remain separate, but routine Geometry↔Texturing correction does not change the Runtime tool catalog. Animation remains a separate surface and is the only normal authoring boundary that uses `switch_authoring_phase`. The same task continues across the AUTHORING↔Animation Gateway handoff.

## 3. Reference Preparation

ChatGPT generates one canonical five-preview board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

Use fixed normalized regions, crop-safe spacing, uniform background, no panel labels/borders/technical metadata. Minor cross-view drift is acceptable unless it changes identity, primary mass/count, topology/attachment, important negative space, articulation, or buildability.

```text
source image + user intent
→ ChatGPT draft/correction
→ user approves
→ actual approved image handed to Codex
```

Handoff is only the actual image + normal user message. No sidecar/manifest/ZIP is required. An image explicitly sent for modelling is approved unless the user marks it draft/not ready.

## 4. New Model Intake

```text
Approved Reference arrives
→ create Active Workspace
→ no .bbmodel yet
→ REQUIREMENT GATE
```

Mandatory:

```text
Asset
Approved Reference
Dimensions: width × height × length in Minecraft blocks
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

Geometry Strategy is decided by the user. Codex must not infer/default/auto-switch it from object type, complexity, failed modelling, or available tools.

Missing fields → ask all missing values in one batch. Ask again only unresolved/material items. Complete + non-conflicting intake proceeds automatically; no redundant final confirmation.

Only after the gate passes:

```text
create Blockbench project
→ enter shared AUTHORING surface with Geometry focus
```

Before that: no `.bbmodel`, Cubes/Groups, Shape Reconstruction, or PrimitiveAnything execution.

## 5. Stage Lifecycle

Semantic stages remain useful for judgement and approval, but Geometry and Texturing are not hard Runtime ACLs.

```text
IN_PROGRESS
→ INTERNAL VERIFY
→ correct clear material defects
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → IN_PROGRESS
   └─ explicit “approve” → APPROVED
→ checkpoint save when meaningful
→ next required stage/focus
```

Codex uses current Blockbench state and internal `capture_model_views` when visual evidence is needed. Internal captures are not the user approval surface.

Do not send materially broken work to user review. Same material causal correction failing twice without new evidence → `BLOCKED`; request user direction.

Persist project state at meaningful handoff/resume/park/completion boundaries; stage approval is the normal checkpoint trigger.

A user-reported defect **reopens the exact affected gate**, even when earlier technical checks were clean. Technical validator success is evidence, not an acceptance lock.

## 6. Geometry Strategies

### DIRECT

```text
Approved Reference + Dimensions + Requirements
→ normal semantic Geometry
→ internal verify
→ READY_FOR_USER_REVIEW
```

`DIRECT` describes the user-selected method, not an object-category classifier.

### 3D_ASSISTED

One indivisible package:

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction + validation
→ Shape Reconstruction
→ Shape GLB Gate
→ persist shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ persist primitive-decomposition.json
→ atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ remove live Shape GLB
→ final Geometry internal verify
→ READY_FOR_USER_REVIEW
```

No GLB-only, PrimitiveAnything-only, user-supplied-GLB v1, skip-PrimitiveAnything, provider selection, or automatic fallback path.

Architecture term = `Shape Reconstruction`; Hunyuan3D is the single v1 implementation. Do not build a provider framework until another real implementation is required.

### 3D-Assisted external ownership

External local tooling controlled by Codex owns fixed view extraction, Shape Reconstruction, GLB Gate, PrimitiveAnything, and Decomposition Gate. Normal use should have one thin resumable orchestrator; individual backend scripts stay debug/development helpers.

Persistent canonical state:

```text
workspace/active/<asset>/3d-assisted/
├─ state.json
├─ shape.glb
└─ primitive-decomposition.json
```

`state.json` owns reference/artifact hashes and last valid external gate only. Passed artifacts persist immediately after their gate. Failed/temp crops, meshes, renders, contact sheets, logs stay in `.cache/`.

Reference replacement keeps the user-selected strategy but removes current derived GLB/decomposition; Git history owns old versions.

### Internal gates

**Shape GLB Gate**: identity, primary masses, required part count, attachments, major pose/orientation, useful depth/volume, no material hallucination. It does not judge Minecraft/blocky styling.

**Primitive Decomposition Gate**: useful primary-mass separation, identity-critical parts, bends/orientation, attachments, negative spaces, useful fragmentation. Primitive count alone is not authority.

**Cuboid Materialization Gate**: faithful conversion only—complete primitives, no missing/duplicates, preserved translation/rotation/scale/spatial relationships, correct orientation, native editable Group/Bone + Cube, no production Mesh. It does not judge final Minecraft quality.

No user approval occurs at internal 3D-Assisted gates.

### Retry

```text
Shape quality fail → maximum one targeted regeneration → still fail = BLOCKED
PrimitiveAnything quality fail → no blind rerun → BLOCKED
known-incomplete technical failure → maximum one safe retry
same failure again → BLOCKED
```

### Target materializer

Target production contract: one dedicated Geometry Runtime capability behind the existing Gateway.

```text
Active Workspace path
→ validate state.json + primitive-decomposition.json + hashes
→ full pre-validation
→ one atomic Undo transaction
→ one temporary pa_<id> Group/Bone + Cube per primitive
→ complete scaffold or no accepted scaffold state
```

Do not accept arbitrary primitive arrays/path overrides and do not revive generic `from_geo_json`.

**Current status:** external orchestrator/state contract + internal atomic materializer engine are source-ready; the public Runtime ToolSpec binding still requires LOCAL_CODE generation/verification.

### Semantic Geometry Cleanup

Materialized scaffold is a starting hypothesis. Codex may rename/reparent/merge/delete/split/resize/translate/rotate/replace/add Cubes, construct semantic hierarchy, and repair pivots.

Approved Reference = visual authority; requested dimensions = numeric authority. Shape GLB may remain locked/non-export during cleanup as supporting depth evidence, then must be removed from live Blockbench before final Geometry verify/user review.

Cleanup must leave coherent silhouette, dimensions, parts, attachments, orientation, semantic hierarchy, future editability, and UV readiness.

## 7. Geometry / Surface / UV Readiness

Canonical downstream vocabulary remains distinct:

```text
UV Layout       = geometry-to-atlas mapping
Texture Atlas   = bitmap/PNG canvas
Texture Styling = authored color/material/detail
Texture Verify  = atlas + mapped-model validation
```

Construction forms are examples, not presets. Decide transform ownership before coordinates. Form/contact/articulation-defining **REQUIRED PRIMARY GROUPS/PIVOTS** may belong in the **PRIMARY BLOCKOUT**; neutral organization stays downstream. After primary PASS, add identity-weighted secondary geometry only where it materially improves silhouette, contact, layering, editability, or motion.

All Geometry should be future-animation-friendly: meaningful semantic hierarchy; naturally movable structurally distinct parts remain separately transformable; sensible pivots/transform ownership; no destructive structure requiring full rebuild later; no speculative full rig for static scope.

If `Animation Required = YES`, participating hierarchy/Bones/pivots/attachments must be animation-ready before Geometry approval.

### Surface quality

A clean positive-volume overlap audit is **not** a surface-quality PASS. Before Geometry readiness, inspect affected views for accidental coplanar rendered surfaces, visible penetration, gaps, contact seams, and deliberate layer offsets. User-reported flicker/z-fighting/gap appearance reopens this gate.

### Semantic cohort

When several Cubes form one assembly, a shared translation/orientation should normally be owned by the semantic Group/Bone when one shared transform explains the change. Otherwise correct the complete affected sibling cohort in one coherent batch. Do not treat independent successful Cube mutations as proof that the assembly relationship stayed intact.

### UV quality

Technical UV validity remains necessary but is insufficient. Important visible faces also require review of:

```text
face geometry ↔ UV aspect
texel density / pixels per UV unit
orientation / directional material flow
padding and seam relationships
semantic exact-reuse intent
unique identity/detail surfaces
```

Exact UV reuse is allowed only when the surfaces intentionally should read the same pixels. A valid in-bounds rectangle does not by itself prove a good unwrap.

Geometry internal PASS + UV readiness → user review when a meaningful Geometry checkpoint is due. Explicit approve → checkpoint → continue Texturing focus **inside the same AUTHORING Runtime surface**. No Geometry↔Texturing `switch_authoring_phase` is required.

## 8. Texturing

```text
Geometry/UV sufficiently coherent
→ Texturing focus in shared AUTHORING surface
→ Texture Atlas + Styling
→ internal technical + visual verify
→ READY_FOR_USER_REVIEW
→ user approve
→ checkpoint save
```

If Texturing reveals a material Geometry/UV blocker, route judgement to the Geometry owner and correct it directly using the already-callable AUTHORING capabilities. Revalidate only materially affected texture evidence. Do not bounce the Runtime surface Geometry↔Texturing.

## 9. Animation

If `Animation Required = NO`, skip after Texturing approval.

If YES:

```text
Texturing APPROVED
→ HANDOFF_REQUIRED(target_phase=animation)
→ switch_authoring_phase through Gateway
→ Animation
→ internal playback/technical/visual verify
→ READY_FOR_USER_REVIEW
→ user approve
→ checkpoint save
```

Animation owns motion. A material rig/pivot/hierarchy/UV/texture blocker returns through Gateway to the shared AUTHORING surface; Animation does not borrow upstream mutation while its surface is active.

## 10. Downstream Invalidation

Approved upstream stage reopens only for a material blocker owned by it.

```text
downstream unaffected → keep APPROVED
downstream affected   → INVALIDATED → repair → user approval again
```

Invalidate minimum dependent scope. Within shared AUTHORING, fix the owning Geometry/UV defect directly rather than using a phase bounce.

## 11. Finalization

After all required stages are approved:

```text
FINALIZATION
→ technical validation only
→ format/dimensions/hierarchy/references/UV/textures/animation refs
→ no live Shape GLB/reference_model
→ no unintended temporary/debug elements
→ workspace consistent
```

Finalization cannot silently alter approved visual work. Material defect → reopen exact owner → fix → internal verify → user re-approve → Finalization again.

PASS with no material change → Final Save → `COMPLETE`. No extra final approval. Project remains under `workspace/active/` until user explicitly moves it to `saved/`.

## 12. Existing Model / Improvement Flow

```text
user supplies/identifies .bbmodel + change
→ recover/create Active Workspace
→ if untracked: persist supplied .bbmodel as baseline before mutation
→ inspect current model
→ determine affected semantic stage(s)
→ ask only material missing information
→ update smallest owning stage(s)
→ internal verify
→ user approve affected stage(s)
→ Finalization
```

Use one current editable `.bbmodel`; Git history owns prior versions.

Reference is required only for visual/fidelity success criteria. Deterministic numeric/color/timing changes may proceed from current model + explicit instruction.

Tracked asset reuses stored Geometry Strategy. External untracked model needs strategy only if Geometry authoring is required.

Only user changes strategy. Before Geometry approval, a strategy change discards unapproved Geometry, removes 3D-Assisted canonical state when leaving it, recreates a clean Blockbench project from the same intake/workspace, then starts the new strategy. After Geometry approval, keep approved production Geometry and use the new strategy for future Geometry work.

## 13. Evidence / Continuity

```text
repository continuation    → docs/knowledge/next-action.md
active asset continuity    → workspace/active/<asset>/README.md
asset workspace rules      → workspace/README.md
stable facts               → CONTEXT.md
current proof state        → docs/knowledge/current-validation.md
current source ownership   → docs/knowledge/implementation-map.md
formal local acceptance    → docs/knowledge/operations/local-acceptance-runbook.md only when reactivated
historical rationale       → Git history
```

Do not create duplicate route/profile/provider/approval/workspace-state systems.
