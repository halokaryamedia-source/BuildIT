# BlockIT Flow

Updated: 2026-09-09

This is the **single detailed current flow**. Root `AGENTS.md` owns deterministic task/Skill routing; `workspace/README.md` owns asset continuity; `next-action.md` owns implementation continuation.


## Explicit autonomous authorization

When the user explicitly authorizes end-to-end AI execution, intermediate user-approval waits below are replaced by current-revision technical and visual verification with saved checkpoints. Quality gates remain; internal PASS never means user approval. Animation handoff uses autonomous_authorized=true, geometry_verified=true, texture_verified=true, uv_layout=PASS, evidence, checkpoint and no_blockers=true. Otherwise retain the review workflow. This does not reopen a stopped test or invent missing asset requirements.

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

### Normal asset authoring at a glance

```text
Approved Reference
→ Requirement Gate
→ Geometry
→ internal Geometry verify
→ UV Readiness Preflight
→ user Geometry review/approval
→ production UV Layout
→ Texturing
→ user Texture review/approval
→ Animation Readiness Preflight when required
→ Animation when required
→ Finalization
→ COMPLETE
```

This summary does not remove any gate below. Strategy only changes how Geometry is produced; the downstream approval/UV/Texturing sequence remains the same.

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
At those boundaries, reconcile the existing asset README/report with the current revision: operation evidence, technical checks, internal visual verdict and user acceptance are separate. A final user rejection overrides current acceptance without erasing historical approvals. Stopped production does not resume automatically for coverage.

## 3. Reference Preparation

Reference generation is **optional for DIRECT when the actual original source image already provides sufficient visual evidence**. It remains the preferred normalized coverage path for complex/asymmetric assets and is required for `3D_ASSISTED`.

```text
actual image supplied to Codex
→ user selects DIRECT
   ├─ material evidence sufficient
   │  → use original source image directly as Approved Reference
   └─ material evidence missing/conflicting
      → request only the smallest decision-changing extra source image/detail
      → if still materially insufficient, recommend canonical board or BLOCKED

actual image supplied to Codex
→ user selects 3D_ASSISTED
   ├─ canonical five-view board present + crop-safe
   │  → continue
   └─ otherwise
      → prepare/approve board in ChatGPT first
```

Do not force board generation for DIRECT as intake ceremony, do not auto-generate it in Codex, and do not add a third reference/Geometry strategy. An actual image explicitly sent for modelling is approved unless the user marks it draft/not ready.

When a canonical board is requested, ChatGPT generates one fixed five-preview board:

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

Handoff is always the actual image + normal user message. No sidecar/manifest/ZIP.

A fresh explicit user-directed board correction starts a new user-led review cycle; automatic draft/correction retries remain bounded and never continue without user instruction.

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

For `DIRECT`, Approved Reference may be the original source image itself. For `3D_ASSISTED`, Approved Reference must be the canonical five-view board.

Only the user selects Geometry Strategy. Missing fields are asked once as a batch. Before the gate passes: no `.bbmodel`, Cubes/Groups, Shape Reconstruction, or PrimitiveAnything execution.
Agreed dimensions remain numeric authority. A material conflict with reference proportions requires the user's decision; visual priority is not implicit permission to replace numeric requirements.

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
→ UV READINESS PREFLIGHT
   ├─ blocker → GEOMETRY IN_PROGRESS
   └─ ready → READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → GEOMETRY IN_PROGRESS
   └─ explicit approve → Geometry APPROVED
→ checkpoint save

Geometry APPROVED
→ Geometry-owned production UV Layout
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
→ when Animation Required=YES: ANIMATION READINESS PREFLIGHT
   ├─ blocker → correct exact owner on shared AUTHORING
   └─ ready → Animation handoff
→ otherwise Finalization
```

**Geometry user approval is required before fresh/rebuilt production UV Layout. Texture/PBR mutation is forbidden before `Geometry APPROVED + UV Layout PASS`.** Readiness preflights are bounded internal checks, not new user approvals or persisted stages; they do not create UV Layout PASS or Animation PASS.

Codex uses current Blockbench state + `capture_model_views` for internal evidence; internal captures are not user approval. Do not send materially broken work to review. Same material causal correction failing twice without new evidence → `BLOCKED`.
Review evidence names the largest remaining differences against the actual reference at comparable angle/scale. Identify required shape/identity landmarks, continuous contacts and surface-only details before construction. For moving assemblies, verify representative extremes as well as neutral contact before production keys. A clean warning count cannot certify these visual claims.

## 6. Geometry Strategies

### DIRECT — canonical hot path

`DIRECT` is a user-selected method, not an object classifier. It uses normal semantic Groups/Cubes and does not invoke Shape Reconstruction or PrimitiveAnything.

The visual reference may be an original source image or canonical board. Use only the views/evidence actually supported by the supplied image; do not fabricate canonical view correspondence when no board exists.

```text
Approved Reference + Dimensions + Requirements
→ semantic form
→ representation choice
→ transient Primary Mass Contract only when form is nontrivial
→ coherent primary Cube/Group batch
→ one Core View Triad evidence bundle
   front + left + top
→ difference-first verdict
   ├─ material defect
   │  → reuse fresh affected pre-correction evidence when available
   │  → smallest causal correction
   │  → recapture affected view(s)
   │  → expand only for cross-view regression risk
   │  → IMPROVED: continue
   │  → UNCHANGED/REGRESSED: re-diagnose
   │  → same causal correction fails twice without new evidence: BLOCKED
   └─ primary PASS
      → identity-weighted secondary Geometry only when needed
→ conditional Surface Integrity review when adjacency/layer/contact is material
→ internal Geometry PASS
→ UV READINESS PREFLIGHT
   ├─ blocker → correct exact Geometry owner
   └─ ready → READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → return to smallest owning Geometry cause
   └─ explicit approve → Geometry APPROVED
→ checkpoint save
→ production UV Layout
```

DIRECT evidence rules:

- New whole-form blockout defaults to one `capture_model_views` call for `front + left + top`; bounded edits use affected views.
- Add `back` only for rear topology/asymmetry.
- Add `front_left_3q` for attachment/layering/orientation ambiguity or source-matched fidelity; compare only source-supported views.
- Do not recapture all five views routinely.
- A fresh capture already used to diagnose a defect is valid pre-correction evidence; do not capture it again before mutation merely for ceremony.
- Every mutation makes affected prior captures stale for the post-mutation verdict, so recapture affected view(s) after the correction.
- Tool success, coordinates, bounds, hierarchy, validators, or correspondence metadata never create visual PASS.

### 3D_ASSISTED

`3D_ASSISTED` requires the canonical five-view Approved Reference Board because extraction is deterministic by fixed normalized regions.

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
→ UV READINESS PREFLIGHT
→ READY_FOR_USER_REVIEW
→ user Geometry APPROVED
→ production UV Layout
```

No GLB-only, PrimitiveAnything-only, user-supplied-GLB v1, provider selection, or automatic fallback path.

Prepare the complete setup and public integration before GPU/live testing. `three-d-assisted:run -- preflight` checks environment readiness without an asset or inference. After accepted external gates, `materialize_3d_assisted_scaffold(workspace_path)` is the Geometry-owned capability behind the existing Gateway; its receipt is not visual approval.

Internal Shape/Primitive/Cuboid gates have no user approval. Shape checks identity/masses/parts/attachments/depth without judging blocky style; decomposition checks useful mass separation/negative spaces without primitive-count authority; materialization checks faithful native editable conversion, not final visual quality.

Retry remains bounded: one targeted Shape regeneration maximum; no blind PrimitiveAnything rerun; known technical retry once; repeated same failure → `BLOCKED`.

Canonical persistent external state stays under `workspace/active/<asset>/3d-assisted/`: `state.json`, `shape.glb`, `primitive-decomposition.json`. Failed/temp output stays `.cache/`.

Semantic cleanup may rename/reparent/merge/delete/split/resize/translate/rotate/replace/add Cubes and repair hierarchy/pivots. **Primitive count is not final Cube authority**: remove/merge/replace primitive Cubes and technical Groups unless they still own silhouette, volume, contact, negative space, layering, or transform/motion. Approved Reference = visual authority; requested dimensions = numeric authority.

## 7. Geometry / Surface / UV

Canonical vocabulary:

```text
UV Layout       = geometry-to-atlas mapping
Texture Atlas   = bitmap/PNG canvas
Texture Styling = authored pixels
Texture Verify  = atlas + mapped-model validation
```

Use `list_textures(diagnostics=false)` for identity discovery and `diagnostics=true` for UV/coverage/seam/PBR checkpoints (the default remains true). Inventory-only results are not readiness evidence. Seam diagnostics pair faces within one Cube; inspect cross-Cube contacts in mapped views. `inspect_animation` runs optional technical diagnostics only with `diagnostics=true`; neither diagnostic proves visual quality.

Construction forms are **not presets**. Decide **transform ownership** before coordinates. Form/contact/articulation-defining **REQUIRED PRIMARY GROUPS/PIVOTS** may belong in the **PRIMARY BLOCKOUT**; neutral organization stays downstream. After primary PASS, add only **identity-weighted** secondary geometry.

All Geometry stays future-animation-friendly: semantic hierarchy, naturally movable parts transformable, sensible pivots, no speculative full rig. If Animation is required, participating hierarchy/pivots/attachments must be ready before Geometry approval.

### Surface quality

Surface integrity means every material relationship is intentional, not universal watertight closure:

```text
CLOSED_BOUNDARY
INTENTIONAL_OPENING
LAYERED_OFFSET
INTENTIONAL_INTERSECTION
CUTOUT_CARRIER
```

Large semantic openings are judged from reference/current views. For material adjacency/layer/contact, call `inspect_model_bounds` once and read bounded `geometry_hygiene` + `surface_quality_summary`; do not poll it as a progress check. `z_fighting`, `micro_gap`, `coplanar_edge_gap`, and `shallow_penetration` are review hints, not semantic or visual PASS/FAIL by themselves. Required `CLOSED_BOUNDARY` cohorts must be covered, intentional openings/intersections preserved, and no material surface risk may remain unresolved before Geometry PASS. Positive-volume overlap never proves contact, and a clean diagnostic never creates visual PASS.

### Geometry vs Texture

Representation is decided before Cube count. Geometry owns required 3D silhouette, volume, contact/opening boundary, layering, transform, or motion; Texture owns surface-only information. `PLANAR_CUTOUT_CARRIER` may use one plane or a crossed pair when alpha owns the internal silhouette.

Detail-only geometry with smallest material span/thickness `<=4 Blockbench units` is an **anti-overcube guardrail, not a classifier**. Challenge whether the feature actually needs 3D behavior; if not, Texture/omit. One zero-span axis can be intentional plane-like Geometry; 2+ collapsed axes are not usable visible surface construction.

### Geometry user gate

Geometry internal PASS + fresh current-revision evidence must also clear **UV READINESS PREFLIGHT** before `READY_FOR_USER_REVIEW`. Reuse fresh authored state and inspect only when needed to catch known thin/sub-unit or Box-UV collapse risk, face-aspect/representation blockers, seam/continuity risk, and surfaces that require unique asymmetric regions. This preflight is read-only: do not create/rebuild the production template, repack UV, paint, or claim UV Layout PASS. User approval locks the Geometry checkpoint before production UV rebuild.

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
Use the actual atlas plus mapped adjoining surfaces to judge editable semantic grouping and allocation to identity-critical detail. Fractional logical coordinates are not themselves defective when their physical pixel mapping is integral. Preserve the requested atlas and Geometry while diagnosing density mismatches.

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

Strict visual reference agreement is the gate: compare proportions, counts, material boundaries, palette, shading and identity at comparable views/scale. User acceptance does not certify an unresolved reference difference. Better/HD requests do not change the approved resolution, density or style.

Complete one representative adjoining surface pair before propagating a material design. Judge atlas palette separately from viewport lighting. Coordinate continuity follows the surface across Cubes; Cube/UV edges do not invent seams. Replace a wrong cohort design from its base rather than layering patches; retain bounded causal correction for local defects.
Also finish the identity-critical patch (face when present); compare landmarks, clustered shading and pattern rhythm with the reference before cohort-wide painting. These are internal checks within the existing Texture gate.

Preflight sub-unit Box UV surfaces before templates; use per-face UV when necessary without thickening approved geometry merely to silence warnings. Choose the smallest proven feasible native power-of-two atlas at approved density with safe island padding. Occupancy/bounds are diagnostics, not quality or packing-feasibility proof. Repacking painted pixels requires correspondence and Undo checks.

If Texturing reveals a Geometry/UV blocker, route judgement to Geometry in-session, correct it on shared AUTHORING, invalidate only materially affected downstream texture evidence, then resume Texturing.

## 9. Animation

If `Animation Required = NO`, skip after Texturing approval.

If YES, remain on shared AUTHORING until the handoff is actually ready. Reuse the current approved/checkpoint state; inspect only participating motion cohorts when needed. **ANIMATION READINESS PREFLIGHT** requires the intended moving hierarchy, pivots, attachments/contact, and clearance to be resolved, plus no known UV/texture blocker. A blocker returns to its exact AUTHORING owner before handoff.

```text
Texturing APPROVED + current .bbmodel checkpoint
→ ANIMATION READINESS PREFLIGHT
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
Before keys, specify support/flight/impact events, weight path, plant/release times, driver/followers and authored-key versus Molang ownership. Validate one judgeable cohort before propagation. Dense baking needs an interpolation/export reason. Review cyclic motion over at least three full loops and actions through landing/recovery, with playable revision-linked evidence; static poses, key counts and math presence are not motion-quality proof.

## 10. Downstream Invalidation

Artist decisions precede batch coordinates: shared volume boundaries and landmark proportions for Geometry; observed stepped shading, contact shadows, highlights and surface continuity for Texture; contact/weight/timing for Animation. Batch known intent and reuse returned state. Texture scan budgets count unique physical regions per invocation while retaining every face; this reduces read work, not the visual evidence required.

Diagnostic readiness is not acceptance: Texture `states.varied` means pixel variation only, and Animation numeric seam counts exclude unevaluated expressions/insufficient keys. Known major visual defects stay FAIL even after earlier approval. Corrective painting preserves unaffected shading/identity; side/bottom evidence is required when other views conceal material contacts. Do not resume or replace a user-stopped test without later explicit authorization. A newly authorized model is a separate intake; preserve the rejected asset unchanged.

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

After all required approvals/gates, load `docs/foundation/09-finalization-standard.md` and apply it only for `FINALIZATION`:

```text
FINALIZATION
→ current-state authority
→ requested deliverable contract
→ format/dimensions/hierarchy/references/UV/textures/animation refs
→ native identifier/reference consistency
→ requested exports present for the current revision
→ no live Shape GLB/reference_model or temporary/debug elements
→ proof labels no stronger than evidence
→ workspace current summary consistent
```

Finalization cannot silently alter approved visual work or treat native-save/export/parse success as visual or whole-asset completion. Material defect → reopen exact owner → repair → required re-approval → Finalization again. Missing requested output, identifier/reference mismatch, stale authority, contradictory current summary, or overclaimed proof → `FINALIZATION BLOCKED`. PASS with no material change → final save + `COMPLETE`.

## 12. Existing Model / Improvement

```text
user supplies/identifies .bbmodel + change
→ recover/create Active Workspace
→ persist untracked supplied baseline before mutation
→ minimum targeted baseline inspection
→ determine affected owner/gate
→ load current router + matching specialist
→ update smallest owning stage/gate
→ internal verify
→ required user approval/PASS
→ Finalization
```

Start with the requested target plus only direct dependencies/evidence needed to classify owner and impact. Broaden inspection only when identity, dependency impact, or a requested visual criterion remains unresolved; do not default to a whole-model hierarchy/bounds/UV/texture/animation scan. Use one editable `.bbmodel`; Git history owns prior versions. Reference is required only for visual/fidelity criteria. Only user changes strategy.

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
For measured authoring, use the existing report to separate production, correction, discovery/schema, additional tests and review waiting. Record actual calls/errors/retries and available active time; unknown counts/time/tokens are `UNKNOWN`. Pass images as native image content or file artifacts, never stringify image/base64 payloads into text. Optimize cost only against comparably accepted quality.
