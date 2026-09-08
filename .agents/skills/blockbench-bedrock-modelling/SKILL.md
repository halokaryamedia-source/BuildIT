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
Reference-driven work requires the **actual approved reference image** in **active multimodal context**. Path/manifest/prose/memory is context, not visual evidence. Unavailable → `BLOCKED`.

Approved image owns visual authority; dimensions own numeric authority; strategy is user-selected `DIRECT | 3D_ASSISTED`.
Evidence: `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`. Use a View Pair Map only to resolve materially ambiguous front/back, depth, attachment, or 3/4 evidence.

`DIRECT` uses Groups/Cubes. `3D_ASSISTED` keeps its existing pipeline; no auto-switch; scaffold never replaces the approved image.

## DIRECT Hot Path
`semantic form → coherent primary batch → one evidence bundle → smallest causal correction`.

Nontrivial form: make a **transient Primary Mass Contract** before coordinates; reasoning-only, not persisted or an MCP field:
```text
mass / evidence views / must-exist reason
parent/contact + symmetry/asymmetry
transform owner/pivot + negative-space boundary + representation
```
No per-Cube plan.

First blockout: `capture_model_views` once with **Core View Triad** `front + left + top`: width×height, length×height, width×length. Add `back` only for rear topology/asymmetry; add `front_left_3q` only for attachment/layering/orientation ambiguity. Never recapture all five routinely.

Repeated/symmetric cohorts: derive absolute transforms once → one coherent `manage_cubes` batch; preserve supported asymmetry; no inspect→write loop per Cube.

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
A semantic label never authorizes coordinates. **No orphan/filler Cube**. `PROVISIONAL` is a coarse hypothesis; placement never verifies it. Construction forms are **not presets**. Use texture for surface information that needs no silhouette/volume/contact/motion.

Shared orientation/attachment/articulation → **Group/Bone-owned**; local rigid orientation may be Cube-owned. Primary mass state: `AXIS_ALIGNED | ROTATED | UNRESOLVED`. Visible slope → explicit origin/pivot + `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`. Pivot role is attachment/joint pivot when it owns transform. AABB overlap, hierarchy, or numeric touching is not contact proof.

When `Animation Required = YES`, Geometry leaves **motion-ready structure**: cohorts, pivots, clearance, and contact invariants. A known rig/contact defect does not wait for Animation.

## Primary Mass / Proportion / Depth
`frame/envelope → primary masses → shared boundaries → cross-view proportions → depth/layering → silhouette/proportion gate → primary blockout`.

Front/back constrain width+height; sides depth+height; top/bottom width+depth. **Front agreement does not certify depth.** Adjacent primary cohorts sharing a boundary use one partition.
Depth: `OBSERVED` direct; `INFERRED` consistent evidence; `UNRESOLVED` insufficient/conflicting. minor drift uses one interpretation. Do not average drift. Only unresolved material conflict becomes `BLOCKED`.

## Surface Coverage / Negative Space
Every gap is intentional; enclosures need closed-shell reasoning and open forms preserve negative spaces. Build primary surfaces before trim.

Review affected views for holes, seams, penetration, contact, and offsets. Each required surface class—outer, opening, back, underside, interior when material—needs current evidence once. No positive-volume overlap alone is not visual PASS.

## Geometry Detail Budget
`GEOMETRY` → silhouette/volume/opening/contact/3D layering/motion.
`TEXTURE` → surface pattern/color/seam/panel line/marking.
`OMIT` → unsupported/immaterial.

Detail-only span/thickness `<= 4 Blockbench units` defaults to `TEXTURE`/`OMIT` unless silhouette/volume/contact/negative-space/motion requires Geometry. Secondary geometry waits for primary proportion + coverage `PASS`.

## Primary Build / Difference-First Reference Fidelity Verdict
**Stay in the geometry lane unless a current decision requires another branch.**
`requirement → source evidence → simplest recognizable Blockbench-buildable interpretation → PRIMARY BLOCKOUT + required hierarchy/pivots → primary PASS → identity-weighted secondary geometry`.

Verdict requires approved reference + fresh current-revision model evidence. Mutation makes affected captures stale:
`claim | matching reference view | current view | observed difference | FAIL | UNVERIFIED | PASS`.

`capture_model_views` correspondence metadata only maps captures to canonical board slots; it is not a scorer and never creates visual PASS. Difference-first: find the first materially wrong view/relationship, correct that cause, then recapture only affected views unless cross-view risk requires expansion.

`manage_cubes` is **Tool success** only. Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`. Internal Geometry `PASS` requires mass/proportion/depth, coverage, hierarchy/pivots, no major defect.
After primary `PASS`, add identity-weighted detail.

**UV Readiness Preflight** checks thin/Box-UV collapse, aspect/representation, seam/unique-region blockers. Read-only: no production UV/`UV Layout PASS`. **User Geometry APPROVED is required** before production UV.

## Native UV Layout / Texel Integrity
`Geometry APPROVED → create_texture(type=template), explicit pixel_density, rearrange_uv=true, power_of_two=true → native UV/template → audit → UV Layout PASS → Texturing`.

No guessed/stretched islands. Rebuild with `texture_id=<UUID>` only when justified; prefer per-face UV to thickening approved geometry. Choose the minimum proven native power-of-two packing. Audit padding, aspect, orientation, overlap, reuse, and unique asymmetric regions. Density `16x` = 1 texture pixel/model unit. `uv_audit.production_gate=ready` is hygiene, not UV Layout PASS. Requested atlas size and density are constraints. Do not silently enlarge the atlas.

## Local Correction / Convergence
`TRANSLATE placement | RESIZE extent | ROTATE orientation | REATTACH contact/parent | SPLIT distinct volume/orientation | MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume`.

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, expected effect; returned `geometry_effect` must match intent.

`REMOVE`/`REATTACH` preserve the whole assembly boundary and intentional openings. For `RESIZE` on mapped/textured Geometry, preflight UV/pixel impact and choose `PRESERVE_MAPPING | PRESERVE_DENSITY | RELAYOUT`.

Capture affected view(s) first; expand only for cross-view risk. Verdict: `IMPROVED | UNCHANGED | REGRESSED`; require `IMPROVED` without regression elsewhere. Same causal correction failing twice without new evidence → `BLOCKED`.

## Existing Assets / Shared Session
Existing geometry is a baseline, not fidelity proof. Geometry owns shape/rig/UV Layout; Texturing owns pixels/PBR. Geometry↔Texturing correction stays on shared AUTHORING. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation.
