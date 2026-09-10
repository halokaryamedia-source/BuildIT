# BlockIT Flow

Updated: 2026-09-10

This is the **single detailed current flow**. Root `AGENTS.md` owns deterministic task/Skill routing; `workspace/README.md` owns asset continuity; `next-action.md` owns implementation continuation.

## Explicit autonomous authorization

When the user explicitly authorizes end-to-end AI execution, intermediate user-approval waits below are replaced by current-revision technical and visual verification with saved checkpoints. Quality gates remain; internal PASS never means user approval. Animation handoff uses `autonomous_authorized=true`, `geometry_verified=true`, `texture_verified=true`, `uv_layout=PASS`, evidence, checkpoint and `no_blockers=true`. Otherwise retain the review workflow. This does not reopen a stopped test or invent missing asset requirements.

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

Persist current project state only at **meaningful handoff/resume/park/completion boundaries**. At those boundaries, reconcile the existing asset README/report with the current revision: operation evidence, technical checks, internal visual verdict and user acceptance are separate. A final user rejection overrides current acceptance without erasing historical approvals. Stopped production does not resume automatically for coverage.

## 3. Reference Preparation

Reference generation is optional when the actual original source image already provides sufficient visual evidence. A canonical five-view board remains the preferred normalized coverage path for complex/asymmetric assets.

```text
actual image supplied to Codex
├─ material evidence sufficient
│  → use original source image directly as Approved Reference
└─ material evidence missing/conflicting
   → request only the smallest decision-changing extra source image/detail
   → if still materially insufficient, recommend canonical board or BLOCKED
```

Do not force board generation as intake ceremony and do not auto-generate it in Codex. An actual image explicitly sent for modelling is approved unless the user marks it draft/not ready.

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
Animation Required: YES | NO
```

Missing fields are asked once as a batch. Before the gate passes: no `.bbmodel` or Cubes/Groups. Agreed dimensions remain numeric authority. A material conflict with reference proportions requires the user's decision; visual priority is not implicit permission to replace numeric requirements.

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

## 6. Geometry

BlockIT has one native Geometry authoring path using semantic Groups/Cubes, appropriate plane-like/cutout carriers, Locators/Nulls when needed, and native Blockbench hierarchy/pivot behavior.

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
→ READY_FOR_USER_REVIEW
→ user approval
→ checkpoint save
→ production UV Layout
```

Evidence rules:

- New whole-form blockout defaults to one `capture_model_views` call for `front + left + top`; bounded edits use affected views.
- Add `back` only for rear topology/asymmetry.
- Add `front_left_3q` for attachment/layering/orientation ambiguity or source-matched fidelity; compare only source-supported views.
- Do not recapture all five views routinely.
- A fresh capture already used to diagnose a defect is valid pre-correction evidence.
- Every mutation makes affected prior captures stale for the post-mutation verdict.
- Tool success, coordinates, bounds, hierarchy, validators, or correspondence metadata never create visual PASS.

## 7. Geometry / Surface / UV

Canonical vocabulary:

```text
UV Layout       = geometry-to-atlas mapping
Texture Atlas   = bitmap/PNG canvas
Texture Styling = authored pixels
Texture Verify  = atlas + mapped-model validation
```

Use `list_textures(diagnostics=false)` for identity discovery and `diagnostics=true` for UV/coverage/seam/PBR checkpoints. Inventory-only results are not readiness evidence. Seam diagnostics pair faces within one Cube; inspect cross-Cube contacts in mapped views.

Construction forms are **not presets**. Decide transform ownership before coordinates. Form/contact/articulation-defining required primary Groups/pivots may belong in the primary blockout; neutral organization stays downstream. After primary PASS, add only identity-weighted secondary geometry.

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

For material adjacency/layer/contact, call `inspect_model_bounds` once and read bounded geometry/surface diagnostics; do not poll it as a progress check. Diagnostic hints never create semantic or visual PASS by themselves.

### Geometry vs Texture

Geometry owns required 3D silhouette, volume, contact/opening boundary, layering, transform, or motion; Texture owns surface-only information. `PLANAR_CUTOUT_CARRIER` may use one plane or a crossed pair when alpha owns the internal silhouette.

Detail-only geometry with smallest material span/thickness `<=4 Blockbench units` is an anti-overcube guardrail, not a classifier.

### Geometry user gate

Geometry internal PASS + fresh current-revision evidence must also clear **UV READINESS PREFLIGHT** before `READY_FOR_USER_REVIEW`. This preflight is read-only: do not create/rebuild the production template, repack UV, paint, or claim UV Layout PASS. User approval locks the Geometry checkpoint before production UV rebuild.

### UV Layout

For fresh/materially rebuilt Cube-based production UV, default to native `create_texture(type=template)` with explicit `pixel_density` and `rearrange_uv=true`.

UV Layout PASS requires technical validity, face geometry↔UV aspect, consistent texel density, orientation, padding/seams, intentional reuse/mirroring, and unique regions for asymmetric identity detail. `uv_audit.production_gate=ready` is necessary hygiene, not UV Layout PASS. Persist `UV Layout: PASS` before Texturing.

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

Pixels are authored against final UV atlas/islands. No arbitrary procedural pattern/noise, stretched pixel art, reference-image transfer shortcut, or Texture used to hide Geometry. If Texturing reveals a Geometry/UV blocker, route judgement to Geometry in-session, correct it on shared AUTHORING, invalidate only materially affected downstream texture evidence, then resume Texturing.

## 9. Animation

If `Animation Required = NO`, skip after Texturing approval.

If YES, remain on shared AUTHORING until the handoff is ready. **ANIMATION READINESS PREFLIGHT** requires intended moving hierarchy, pivots, attachments/contact, clearance, and no known UV/texture blocker.

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

Review cyclic motion over at least three full loops and actions through landing/recovery when applicable. Static poses, key counts and math presence are not motion-quality proof.

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

Routine Geometry↔Texturing correction uses shared AUTHORING; no phase bounce.

## 11. Finalization

After all required approvals/gates, load `docs/foundation/09-finalization-standard.md` only for `FINALIZATION`.

```text
FINALIZATION
→ current-state authority
→ requested deliverable contract
→ format/dimensions/hierarchy/UV/textures/animation refs
→ native identifier/reference consistency
→ requested exports present for current revision
→ no temporary/debug elements
→ proof labels no stronger than evidence
→ workspace current summary consistent
```

Finalization cannot silently alter approved visual work or treat native-save/export/parse success as visual completion.

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

Start with the requested target plus only direct dependencies/evidence needed to classify owner and impact. Broaden inspection only when identity, dependency impact, or a requested visual criterion remains unresolved. Use one editable `.bbmodel`; Git history owns prior versions.

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

Do not create duplicate route/profile/provider/approval/workspace-state systems. For measured authoring, record actual calls/errors/retries and available active time; unknown counts/time/tokens are `UNKNOWN`. Optimize cost only against comparably accepted quality.
