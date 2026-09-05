---
name: blockbench-bedrock-modelling
description: Mandatory BlockIT Bedrock Geometry and UV Layout specialist.
---
# Blockbench Bedrock Modelling

## Minimum Necessary Evidence
- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Surface/contact question → `inspect_model_bounds` once. Otherwise skip the bounds call.
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding
Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. Unavailable → `BLOCKED`.

approved image = visual authority; dimensions = numeric authority; strategy = user-selected `DIRECT | 3D_ASSISTED`. Evidence: `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`. Never auto-switch.

`DIRECT` uses semantic Groups/Cubes. `3D_ASSISTED`: Shape Reconstruction → Shape GLB PASS → PrimitiveAnything PASS → Cuboid Scaffold → semantic cleanup; unavailable → `BLOCKED`, never fallback. Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence; otherwise do not turn analysis ceremony into the work.

## Semantic Form / Construction / Transform Gate
Before exact coordinates determine material facts:
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
A semantic label never authorizes coordinates. **No orphan/filler Cube**; `PROVISIONAL` is a coarse hypothesis; placement never verifies it.

Construction forms are **not presets**. Choose the simplest recognizable Blockbench-buildable interpretation. **Use texture for surface information** needing no silhouette, real volume, contact, negative-space boundary, or separate motion.

Decide **transform ownership** before rotation. Shared orientation/attachment/articulation → **Group/Bone-owned**; local rigid orientation may be Cube-owned. Primary mass state: `AXIS_ALIGNED | ROTATED | UNRESOLVED`. Visible slope → explicit origin/pivot + `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`. Pivot role: attachment/joint pivot when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof.

## Primary Mass / Proportion / Depth
**Coordinates are the consequence of one coherent 3D interpretation, not the starting point.**
`frame/envelope → primary masses → shared boundaries → cross-view proportions → depth/layering → silhouette/proportion gate`.

front/back constrain width+height; sides depth+height; top/bottom width+depth; 3/4 cross-checks. Do not calibrate by raw reference pixels. **Front agreement does not certify depth.** Adjacent primary cohorts sharing a boundary use one shared partition, not independent guesses.

Depth: `OBSERVED` direct; `INFERRED` consistent evidence + simplest geometry; `UNRESOLVED` insufficient/conflicting. Do not invent hidden structure. Material unresolved depth/topology/orientation → `BLOCKED`. Minor drift uses one consistent interpretation; **Do not average drift. Only unresolved material conflict becomes `BLOCKED`.**

## Surface Coverage / Negative Space
For each continuous shell/body/wall/housing/casing/skin know covered region, intentional opening/recess, adjacent contact. Enclosures use closed-shell reasoning; open forms preserve intended negative space.

**Every gap must be intentional.** Bounds, hierarchy, Cube success, or positive-volume overlap do not prove coverage. Build broad primary surfaces before trim. Review front/back/left/right/top/bottom + useful 3/4 for holes, visible interior/backfaces, seams, penetration, contact, layer offsets. **No positive-volume overlap alone is not visual PASS.**

## Geometry Detail Budget
`GEOMETRY` → silhouette/volume/opening/contact/3D layering/motion.
`TEXTURE` → surface pattern/color/seam/panel line/marking.
`OMIT` → unsupported/immaterial.

Detail-only smallest span/thickness `<= 4 Blockbench units` (`1/4 block`) defaults to `TEXTURE`/`OMIT` unless silhouette-critical thin form, genuine volume/contact, negative-space boundary, or independent motion. Larger is not automatic permission. Secondary geometry only after primary proportion + coverage PASS.

## Primary Build / Difference-First Reference Fidelity Verdict
**Stay in the geometry lane unless a current decision requires another branch.**
`explicit user requirement → original source evidence → best-supported approved view(s) → simplest recognizable Blockbench-buildable interpretation → PRIMARY BLOCKOUT + required hierarchy/pivots → primary proportion + coverage PASS → identity-weighted secondary geometry`.

Material verdict requires actual approved reference + **fresh current-revision model** evidence. Mutation makes affected captures stale:
`claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS`.

Successful `manage_cubes` execution is **Tool success** and execution evidence only. After primary `PASS`, add identity-weighted secondary geometry only. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`. Similarity scores cannot justify `PASS`.**

`internal geometry=PASS` requires coherent mass/proportion/depth, coverage, purposeful detail, hierarchy/pivots, no major defect → `READY_FOR_USER_REVIEW`. **User Geometry APPROVED is required before fresh/rebuilt production UV Layout.**

## Native UV Layout / Texel Integrity
Geometry-owned fresh/rebuilt Cube UV:
`Geometry APPROVED → create_texture(type=template), explicit pixel_density, rearrange_uv=true, power_of_two=true → native UV/template → audit → UV Layout PASS → Texturing`.

No guessed rectangles, stretched reference images, or hand-scaled islands; preserve UV without rebuild reason.

Density `16x`=1 texture pixel/model unit; scale density uniformly. Face aspect must match UV aspect (direct/90°). **Never non-uniformly scale an island to squeeze it into the atlas.** Atlas pressure → justified global density, remove unnecessary geometry, intentional exact reuse/mirroring, or larger bitmap.

`uv_audit.production_gate=ready` is hygiene, not UV Layout PASS. Review face geometry ↔ UV aspect, texel density, orientation, padding/seams, overlap, semantic exact reuse, unique asymmetric regions. Invalid/out-of-bounds/materially stretched mapping → `FAIL`; correct before paint.

## Local Correction / Convergence
`TRANSLATE placement | RESIZE extent | ROTATE orientation | REATTACH contact/parent | SPLIT distinct volume/orientation | MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume`.

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, expected effect; returned `geometry_effect` must match intent.

Capture **affected view(s) first**; expand only for material cross-view risk. `IMPROVED | UNCHANGED | REGRESSED`; progress requires `IMPROVED`. A fix that helps one view while materially regressing another is rejected. If the same causal correction direction has failed twice without new evidence → `BLOCKED`.

## Existing Assets / Shared Session
Existing-asset work may use current geometry as baseline without certifying reference accuracy. Geometry owns shape/hierarchy/rig/pivots/UV Layout; Texturing owns atlas pixels/PBR. Both callable in shared AUTHORING; semantic ownership governs mutation. Texture-discovered Geometry/UV defect returns here without phase switch. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation.
