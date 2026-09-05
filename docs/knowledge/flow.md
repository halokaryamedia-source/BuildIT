# BlockIT Flow

Updated: 2026-09-05

This is the **single detailed current flow**. Root `AGENTS.md` owns deterministic task/Skill routing; `workspace/README.md` owns asset continuity; `next-action.md` owns implementation continuation.

## 1. Route / Proof Ceiling

```text
PIN CURRENT AUTHORITY
→ EXECUTION CONTEXT
   REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH
→ PROOF CEILING
→ TASK CLASS
```

`REMOTE_GITHUB` = source/docs/static/CI evidence. `LOCAL_CODE` adds local build/test/generator/filesystem evidence. `LIVE_BLOCKBENCH` adds deployed/reloaded BlockIT + live Gateway/runtime/model evidence.

Asset authoring that mutates or visually judges Blockbench belongs to `LIVE_BLOCKBENCH`; this does not activate formal Local Acceptance unless explicitly requested.

## 2. Product / Authoring Boot Boundary

```text
REFERENCE CREATION → ChatGPT
ASSET AUTHORING    → Codex → BlockIT Gateway → Runtime → Blockbench
PERSISTENCE        → workspace/active/<asset>/
USER STAGE REVIEW  → live Blockbench
```

Gateway remains exactly `status`, `search_capabilities`, `describe_capability`, `invoke_capability`.

Before **any authoring mutation**, current-worktree routing is mandatory:

```text
root AGENTS.md
→ blockit-bedrock-entity-mcp
→ active semantic specialist

Geometry / rig / pivots / UV Layout → blockbench-bedrock-modelling
Texture Atlas / Styling / PBR       → blockit-bedrock-texturing
Animation / motion                   → blockit-bedrock-animation
```

No mutation until router + matching specialist are loaded and its prerequisite gate is satisfied. When Geometry↔Texturing ownership changes, load the new specialist before its first mutation; both remain on the shared AUTHORING Runtime surface. **No Geometry↔Texturing `switch_authoring_phase` is required.** AUTHORING↔Animation alone uses `switch_authoring_phase`, and the same task/chat continues.

Persist current project state only at **meaningful handoff/resume/park/completion boundaries**.

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

Handoff is the actual image + normal user message. No sidecar/manifest/ZIP. An image explicitly sent for modelling is approved unless marked draft/not ready.

## 4. New Model Intake

```text
Approved Reference arrives
→ create Active Workspace
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

Only the user selects Geometry Strategy. Missing fields are asked once as a batch. Before the gate passes: no `.bbmodel`, Cubes/Groups, Shape Reconstruction, or PrimitiveAnything execution.

After it passes:

```text
create Blockbench project
→ shared AUTHORING with Geometry owner
```

## 5. Non-Skippable Authoring Sequence

Geometry and Texturing share Runtime capabilities, but semantic gates are ordered:

```text
GEOMETRY IN_PROGRESS
→ internal Geometry verify
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → GEOMETRY IN_PROGRESS
   └─ explicit approve → Geometry APPROVED
→ checkpoint save

Geometry APPROVED
→ Geometry-owned UV Layout
→ UV Layout PASS
→ checkpoint/update continuity

Geometry APPROVED + UV Layout PASS
→ Texturing specialist
→ Texture Atlas + Styling
→ Texture Verify
→ READY_FOR_USER_REVIEW
→ user approve → Texturing APPROVED
→ checkpoint save

Texturing APPROVED
→ Animation when required
→ otherwise Finalization
```

**Geometry user approval is required before fresh/rebuilt production UV Layout. Texture/PBR mutation is forbidden before `Geometry APPROVED + UV Layout PASS`.**

Codex uses current Blockbench state + `capture_model_views` for internal evidence; internal captures are not user approval. Do not send materially broken work to review. Same material causal correction failing twice without new evidence → `BLOCKED`.

## 6. Geometry Strategies

### DIRECT

```text
Approved Reference + Dimensions + Requirements
→ semantic Geometry
→ internal verify
→ READY_FOR_USER_REVIEW
→ user Geometry APPROVED
→ UV Layout
```

`DIRECT` is a user-selected method, not an object classifier.

### 3D_ASSISTED

One indivisible package:

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ remove live Shape GLB
→ final Geometry internal verify
→ READY_FOR_USER_REVIEW
→ user Geometry APPROVED
→ UV Layout
```

No GLB-only, PrimitiveAnything-only, user-supplied-GLB v1, provider selection, or automatic fallback path.

Internal Shape/Primitive/Cuboid gates have no user approval. Shape checks identity/masses/parts/attachments/depth without judging blocky style; decomposition checks useful mass separation/negative spaces without primitive-count authority; materialization checks faithful native editable conversion, not final visual quality.

Retry remains bounded: one targeted Shape regeneration maximum; no blind PrimitiveAnything rerun; known technical retry once; repeated same failure → `BLOCKED`.

Canonical persistent external state stays under `workspace/active/<asset>/3d-assisted/`: `state.json`, `shape.glb`, `primitive-decomposition.json`. Failed/temp output stays `.cache/`.

Semantic cleanup may rename/reparent/merge/delete/split/resize/translate/rotate/replace/add Cubes and repair hierarchy/pivots. Approved Reference = visual authority; requested dimensions = numeric authority.

## 7. Geometry / Surface / UV

Canonical vocabulary:

```text
UV Layout       = geometry-to-atlas mapping
Texture Atlas   = bitmap/PNG canvas
Texture Styling = authored pixels
Texture Verify  = atlas + mapped-model validation
```

Construction forms are **not presets**. Decide **transform ownership** before coordinates. Form/contact/articulation-defining **REQUIRED PRIMARY GROUPS/PIVOTS** may belong in the **PRIMARY BLOCKOUT**; neutral organization stays downstream. After primary PASS, add only **identity-weighted** secondary geometry.

All Geometry stays future-animation-friendly: semantic hierarchy, naturally movable parts transformable, sensible pivots, no speculative full rig. If Animation is required, participating hierarchy/pivots/attachments must be ready before Geometry approval.

### Surface quality

A clean positive-volume overlap audit is not surface PASS. Inspect current whole-form views for accidental coplanar surfaces, penetration, gaps/holes, contact seams, and intended layer offsets. Required continuous cohorts must be covered; every unsupported gap is a Geometry defect.

### Geometry vs Texture

Surface-only detail defaults to texture. Detail-only geometry with smallest material span/thickness `<=4 Blockbench units` defaults to Texture/omit unless it materially changes silhouette, volume/contact, intentional negative-space boundary, or independent motion.

### Geometry user gate

Geometry internal PASS + fresh current-revision evidence → `READY_FOR_USER_REVIEW`. User approval locks the Geometry checkpoint before production UV rebuild.

### UV Layout

For fresh/materially rebuilt Cube-based production UV, default to native `create_texture(type=template)` with explicit `pixel_density` and `rearrange_uv=true`. Geometry owns the judgement even though the capability is callable on shared AUTHORING.

UV Layout PASS requires:

```text
technical validity / bounds / overlap
face geometry ↔ UV aspect
consistent texel density / square texels
orientation / directional material flow
padding + seams
intentional exact reuse/mirroring
unique regions for asymmetric identity detail
```

Do not guess rectangles, stretch islands/source images, or distort aspect to fit an atlas. `uv_audit.production_gate=ready` is necessary hygiene, not UV Layout PASS. Persist `UV Layout: PASS` before Texturing.

## 8. Texturing

Entry:

```text
Geometry APPROVED
+ UV Layout PASS
+ current-worktree blockit-bedrock-texturing loaded
```

Then:

```text
Texture Atlas
→ BASE
→ VALUE / FORM
→ IDENTITY
→ controlled SECONDARY DETAIL
→ Texture Verify
→ READY_FOR_USER_REVIEW
→ user Texture APPROVED
```

Pixels are authored against the final UV atlas/islands. No arbitrary procedural patterns/noise, stretched pixel art, reference-image transfer shortcut, or Texture used to hide Geometry. Reference + material/form intent own styling.

If Texturing reveals a Geometry/UV blocker, route judgement to Geometry in-session, correct it on shared AUTHORING, invalidate only materially affected downstream texture evidence, then resume Texturing.

## 9. Animation

If `Animation Required = NO`, skip after Texturing approval.

If YES:

```text
Texturing APPROVED
→ HANDOFF_REQUIRED(target_phase=animation)
→ switch_authoring_phase through Gateway
→ load Animation specialist
→ Animation
→ internal playback/technical/visual verify
→ READY_FOR_USER_REVIEW
→ user approve
→ checkpoint save
```

Animation owns motion, not upstream structural mutation. Material rig/UV/texture blockers return through Gateway to AUTHORING.

## 10. Downstream Invalidation

Invalidate minimum dependency:

```text
Geometry material change affecting mapped surfaces
→ UV Layout INVALIDATED
→ affected Texture INVALIDATED

UV Layout material change
→ affected Texture INVALIDATED

unaffected downstream state
→ keep accepted
```

Routine Geometry↔Texturing correction uses the shared AUTHORING surface; no phase bounce.

## 11. Finalization

After all required approvals/gates:

```text
FINALIZATION
→ technical validation only
→ format/dimensions/hierarchy/references/UV/textures/animation refs
→ no live Shape GLB/reference_model
→ no temporary/debug elements
→ workspace consistent
```

Finalization cannot silently alter approved visual work. Material defect → reopen exact owner → repair → required re-approval → Finalization again. PASS with no material change → final save + `COMPLETE`.

## 12. Existing Model / Improvement

```text
user supplies/identifies .bbmodel + change
→ recover/create Active Workspace
→ persist untracked supplied baseline before mutation
→ inspect current model
→ determine affected owner/gate
→ load current router + matching specialist
→ update smallest owning stage/gate
→ internal verify
→ required user approval/PASS
→ Finalization
```

Use one editable `.bbmodel`; Git history owns prior versions. Reference is required only for visual/fidelity criteria. Only user changes strategy.

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
