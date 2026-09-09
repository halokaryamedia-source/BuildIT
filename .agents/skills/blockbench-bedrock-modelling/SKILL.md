---
name: blockbench-bedrock-modelling
description: Mandatory BlockIT Bedrock Geometry and UV Layout specialist.
---
# Blockbench Bedrock Modelling

## Minimum Necessary Evidence
- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable form, then gate it.
- Surface/contact question → `inspect_model_bounds` once. Otherwise skip the bounds call.
- `UNVERIFIED` is not a retry command; request only decision-changing evidence.

## Reference Grounding
Reference-driven work requires the **actual approved reference image** in **active multimodal context**. Path/manifest/prose/memory is context, not visual evidence. Unavailable → `BLOCKED`.

Approved image owns visuals; dimensions own numeric scale; strategy is user-selected `DIRECT | 3D_ASSISTED`.
Evidence: `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`. Use a View Pair Map only for material front/back, depth, attachment, or 3/4 ambiguity.
`DIRECT` uses Groups/Cubes; `3D_ASSISTED` keeps its pipeline; no auto-switch.

## DIRECT Hot Path
`semantic form → representation choice → primary batch → Core View Triad → conditional surface integrity → causal correction → Geometry PASS → UV preflight → user review`.

Nontrivial form: **transient Primary Mass Contract**:
```text
mass / evidence views / must-exist reason
parent/contact + symmetry/asymmetry
transform owner/pivot + negative-space boundary + representation
```
No per-Cube plan. First blockout uses one Core View Triad `front + left + top`. Add `back` only for rear topology/asymmetry; add `front_left_3q` only for attachment/layering/orientation ambiguity. Never recapture all five routinely.
Repeated/symmetric cohorts: derive transforms once → one coherent `manage_cubes` batch; no inspect→write per Cube.

## Semantic Form / Construction / Transform Gate
Before exact coordinates determine:
```text
primary masses + must-exist reason
required count / symmetry or deliberate asymmetry
topology: what attaches to what
required continuous surfaces + intentional negative spaces
representation: geometry | texture | animation | omit
transform ownership + required attachment / contact target/invariant
evidence state
```

Reasoning vocabulary, not a preset:
`SOLID_CUBOID | PLANE_LIKE | PLANAR_CUTOUT_CARRIER | LAYERED_SURFACE | SEGMENTED_FORM | TEXTURE | OMIT`.

A semantic label never authorizes coordinates. **No orphan/filler Cube**. `PROVISIONAL` is a hypothesis; placement never verifies it. Construction forms are **not presets**. Use Texture when no 3D silhouette/volume/contact/negative-space boundary/layering/motion is required.

Shared orientation/attachment/articulation → **Group/Bone-owned**; local rigid orientation may be Cube-owned. Primary mass: `AXIS_ALIGNED | ROTATED | UNRESOLVED`. Visible slope → explicit pivot role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`; attachment/joint pivot owns shared transform when required. Material `UNRESOLVED` → `BLOCKED`. AABB overlap, hierarchy, or numeric touching is not contact proof.
If `Animation Required = YES`, keep cohorts/pivots/clearance/contact motion-ready.

## Primary Mass / Proportion / Depth
`frame/envelope → primary masses → shared boundaries → cross-view proportions → depth/layering → silhouette/proportion gate → primary blockout`.
Front/back constrain width+height; sides depth+height; top/bottom width+depth. **Front agreement does not certify depth.** Depth: `OBSERVED | INFERRED | UNRESOLVED`. Do not average drift. Only unresolved material conflict becomes `BLOCKED`.

## Surface Coverage / Negative Space
Every surface relationship is intentional; **do not force universal watertight geometry**. Enclosures need closed-shell reasoning while designed openings remain open.
Relations: `CLOSED_BOUNDARY | INTENTIONAL_OPENING | LAYERED_OFFSET | INTENTIONAL_INTERSECTION | CUTOUT_CARRIER`.
When adjacency/layer/contact matters, use fresh views + one bounded `inspect_model_bounds`. `z_fighting | micro_gap | coplanar_edge_gap | shallow_penetration` are review hints. Geometry PASS requires material risks resolved or visibly justified; overlap alone never proves correctness.

## Geometry Detail Budget
Decide representation **before** counting Cubes.
`GEOMETRY` → 3D silhouette/volume/opening/contact/negative-space boundary/layering/motion.
`TEXTURE` → surface pattern/color/seam/panel line/marking.
`OMIT` → unsupported/immaterial.

Detail-only span/thickness `<= 4 Blockbench units` is an **anti-overcube guardrail, not a classifier**: challenge whether Geometry adds required 3D behavior. Carrier thickness ≠ detail size. `PLANAR_CUTOUT_CARRIER`: 1 plane or 2 crossed planes (~90°) in one batch carries alpha silhouette instead of micro-Cubes. One zero-span axis can be intentional plane-like Geometry; 2+ collapsed axes are unusable.

## Primary Build / Difference-First Reference Fidelity Verdict
`requirement → source evidence → simplest recognizable Blockbench-buildable interpretation → PRIMARY BLOCKOUT + required hierarchy/pivots → primary PASS → identity-weighted secondary geometry`.

For `3D_ASSISTED`, PrimitiveAnything is scaffold, not final Cube authority. Cleanup merges/removes/replaces primitives/Groups that no longer own silhouette, volume, contact, negative space, layering, or transform/motion.

Verdict requires approved reference + fresh current-revision model evidence:
`claim | matching reference view | current view | observed difference | FAIL | UNVERIFIED | PASS`.
Mutation stales affected captures. Correct the first material cause, then recapture affected views; expand only for cross-view risk. `capture_model_views` correspondence metadata only maps captures to canonical board slots; it is not a scorer and never creates visual PASS.
Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`. Internal Geometry `PASS` requires form/depth, surface integrity, hierarchy/pivots, and no major defect.

**UV Readiness Preflight** checks thin/Box-UV collapse, aspect/representation, seam/unique-region blockers; it is read-only. **User Geometry APPROVED is required** before production UV.

## Native UV Layout / Texel Integrity
`Geometry APPROVED → create_texture(type=template), explicit pixel_density, rearrange_uv=true, power_of_two=true → native UV/template → audit → UV Layout PASS → Texturing`.

No guessed/stretched islands. Prefer per-face UV; choose minimum proven native power-of-two packing. Audit padding, aspect, orientation, overlap/reuse, asymmetric regions. `uv_audit.production_gate=ready` is hygiene, not UV Layout PASS. Do not silently enlarge atlas.

## Local Correction / Convergence
`TRANSLATE placement | RESIZE extent | ROTATE orientation | REATTACH contact/parent | LAYER OFFSET surface separation/inset | SPLIT distinct volume/orientation | MERGE/REMOVE compensatory geometry | ADD MASS missing volume`.

`LAYER OFFSET` is intent: use translate/resize or justified inflate/deflate; never a universal epsilon. Hidden intersection may be intentional; exposed coplanar overlap/hairline gaps are not.
Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, expected effect; returned `geometry_effect` must match intent.
`REMOVE`/`REATTACH` preserve openings. Mapped `RESIZE`: `PRESERVE_MAPPING | PRESERVE_DENSITY | RELAYOUT`.
After mutation recapture affected view(s); expand only for cross-view risk. `IMPROVED | UNCHANGED | REGRESSED`; require `IMPROVED` without regression. Same causal correction failing twice without new evidence → `BLOCKED`.

## Existing Assets / Shared Session
Existing geometry is a baseline, not fidelity proof. Geometry owns shape/rig/UV Layout; Texturing owns pixels/PBR. Geometry↔Texturing correction stays shared AUTHORING. `HANDOFF_REQUIRED` + `switch_authoring_phase` only for AUTHORING↔Animation.
