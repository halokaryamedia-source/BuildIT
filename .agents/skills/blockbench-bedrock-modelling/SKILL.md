---
name: blockbench-bedrock-modelling
description: Mandatory BlockIT Bedrock Geometry and UV Layout specialist.
---
# Blockbench Bedrock Modelling

## Minimum Necessary Evidence
- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable form, then gate it.
- Surface/contact question → `inspect_model_bounds` once. Otherwise skip the bounds call.
- `UNVERIFIED` is not a retry command; request only evidence that can change the decision.

## Reference Grounding
Reference-driven work requires the **actual approved reference image** visible in **active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. Unavailable → `BLOCKED`.

approved image = visual authority; dimensions = numeric authority; strategy = user-selected `DIRECT | 3D_ASSISTED`.
Evidence: `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`. Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence.

`DIRECT` uses Groups/Cubes. `3D_ASSISTED` = Shape Reconstruction → Shape GLB PASS → PrimitiveAnything PASS → Gateway `materialize_3d_assisted_scaffold(workspace_path)` → cleanup. Unavailable → `BLOCKED`; no fallback; scaffold never replaces approved image.

## Semantic Form / Construction / Transform Gate
Before exact coordinates determine:
```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
required continuous surfaces + intentional negative spaces
representation: geometry | texture | animation | omit
transform ownership + required attachment / contact target/invariant
material evidence state
```
A semantic label never authorizes coordinates. **No orphan/filler Cube**. `PROVISIONAL` is a coarse hypothesis; placement never verifies it.
Construction forms are **not presets**. Use texture for surface information when no silhouette/volume/contact/motion is required.

Decide **transform ownership** before rotation. Shared orientation/attachment/articulation → **Group/Bone-owned**; local rigid orientation may be Cube-owned. Primary mass state: `AXIS_ALIGNED | ROTATED | UNRESOLVED`. Visible slope → explicit origin/pivot + `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`. Pivot role is attachment/joint pivot when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof.

When `Animation Required = YES`, Geometry must leave **motion-ready structure**: identify each moving cohort, parent/pivot, clearance, and attachment/contact invariant. A known rig/contact defect does not wait for Animation.

## Primary Mass / Proportion / Depth
Coordinates follow one coherent 3D interpretation:
`frame/envelope → primary masses → shared boundaries → cross-view proportions → depth/layering → silhouette/proportion gate → primary blockout`.

Front/back constrain width+height; sides depth+height; top/bottom width+depth; 3/4 cross-checks. **Front agreement does not certify depth.** Adjacent primary cohorts sharing a boundary use one partition, not independent guesses.

Depth: `OBSERVED` direct; `INFERRED` consistent evidence; `UNRESOLVED` insufficient/conflicting. Minor drift uses one interpretation. **Do not average drift. Only unresolved material conflict becomes `BLOCKED`.**

## Surface Coverage / Negative Space
Every gap must be intentional. Enclosures need closed-shell reasoning; open forms preserve negative spaces. Build broad primary surfaces before trim.

Review the affected canonical views for holes, visible interior/backfaces, seams, penetration, contact, and layer offsets. Before completion, every **required surface class** that can hide a defect—outer, opening, back, underside, or interior when material—needs current evidence once; do not capture every class after every edit. Bounds/hierarchy/Cube success are not coverage proof. **No positive-volume overlap alone is not visual PASS.**

## Geometry Detail Budget
`GEOMETRY` → silhouette/volume/opening/contact/3D layering/motion.
`TEXTURE` → surface pattern/color/seam/panel line/marking.
`OMIT` → unsupported/immaterial.

Detail-only span/thickness `<= 4 Blockbench units` (`1/4 block`) defaults to `TEXTURE`/`OMIT` unless silhouette/volume/contact/negative-space/motion needs Geometry. Larger is not automatic permission. Secondary geometry waits for primary proportion + coverage `PASS`.

## Primary Build / Difference-First Reference Fidelity Verdict
**Stay in the geometry lane unless a current decision requires another branch.**
`user requirement → source evidence → best-supported approved views → simplest recognizable Blockbench-buildable interpretation → PRIMARY BLOCKOUT + required form-defining hierarchy/pivots → primary proportion + coverage PASS → identity-weighted secondary geometry`.

Material verdict requires approved reference + **fresh current-revision model** evidence. Mutation makes affected captures stale:
`claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS`.

`manage_cubes` is **Tool success** only. After primary `PASS`, add identity-weighted detail. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`.**

Internal Geometry `PASS` requires mass/proportion/depth, coverage, hierarchy/pivots, no major defect. Before `READY_FOR_USER_REVIEW`, **UV Readiness Preflight** checks state: thin/Box-UV collapse, aspect/representation, seam/unique-region blockers. Read-only: no production UV/`UV Layout PASS`. **User Geometry APPROVED is required** before production UV.

## Native UV Layout / Texel Integrity
Geometry-owned production UV:
`Geometry APPROVED → create_texture(type=template), explicit pixel_density, rearrange_uv=true, power_of_two=true → native UV/template → audit → UV Layout PASS → Texturing`.

No guessed/stretched islands. Rebuild with `texture_id=<UUID>` only when justified; revalidate evidence. Prefer per-face UV to thickening approved geometry.

Choose the minimum proven native power-of-two packing at approved density. Audit padding, aspect, orientation, overlap, semantic exact reuse, and unique asymmetric regions. Density `16x` = 1 texture pixel/model unit. Face aspect must match UV aspect (direct/90°); never squeeze an island. `uv_audit.production_gate=ready` is hygiene, not UV Layout PASS.

Requested atlas size and density are constraints. Do not silently enlarge the atlas: test native representation, per-face UV, and semantic reuse first; if it still cannot fit, surface the measured tradeoff.

## Local Correction / Convergence
`TRANSLATE placement | RESIZE extent | ROTATE orientation | REATTACH contact/parent | SPLIT distinct volume/orientation | MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume`.

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, expected effect; returned `geometry_effect` must match intent.

`REMOVE`/`REATTACH` must preserve the whole assembly boundary and intentional openings, not merely fix the local overlap. For `RESIZE` on mapped/textured Geometry, preflight UV/pixel impact and choose `PRESERVE_MAPPING | PRESERVE_DENSITY | RELAYOUT`; invalidate only affected texture assumptions. Never blind-scale Geometry and discover UV drift afterward.

Capture affected view(s) first; expand only for cross-view risk. Verdict: `IMPROVED | UNCHANGED | REGRESSED`; require `IMPROVED` without regression elsewhere. Same causal correction failing twice without new evidence → `BLOCKED`.

## Existing Assets / Shared Session
Existing geometry is a baseline, not fidelity proof. Geometry owns shape/rig/UV Layout; Texturing owns pixels/PBR. Shared AUTHORING permits bounded Geometry↔Texturing correction without phase switch. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation.
