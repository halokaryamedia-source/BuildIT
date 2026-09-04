---
name: blockbench-bedrock-modelling
description: Bedrock Entity Geometry judgement for reference grounding, construction, transforms, correction, readiness, and future editability.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, internal readiness, and whether modelling can continue.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are only for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference / Strategy Grounding

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable when fidelity judgement is required, `BLOCKED`.

```text
user brief/target     → identity/function
approved image        → visual authority
approved dimensions   → numeric envelope authority
Geometry Strategy     → DIRECT | 3D_ASSISTED; user-selected only
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Never infer or auto-switch Geometry Strategy.

### DIRECT

Use normal reference-guided semantic Groups/Cubes.

### 3D_ASSISTED

One indivisible preparation package:

```text
Approved Reference
→ Shape Reconstruction
→ Shape GLB PASS
→ PrimitiveAnything decomposition PASS
→ deterministic temporary Cuboid Scaffold
→ Semantic Geometry Cleanup
```

The GLB/decomposition/scaffold are intermediate evidence/hypotheses, never final authority. During cleanup, a passed Shape GLB may remain as a locked non-export reference through `manage_geometry_reference`; remove the live GLB before final Geometry verification/user review.

The temporary scaffold may be substantially renamed, reparented, merged, deleted, split, resized, translated, rotated, replaced, or supplemented when the Approved Reference/Dimensions require it.

If the selected 3D-Assisted production orchestrator/materializer is unavailable, `BLOCKED`; do not emulate it with arbitrary JSON import, UI actions, or manually invented PrimitiveAnything data.

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. Do not silently compare the closest-looking view. When evidence is already clear, **do not turn analysis ceremony into the work**.

## Semantic Form / Construction / Transform Gate

Before exact coordinates determine only material facts:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
important negative spaces / separations
representation: geometry | texture | animation | omit
material evidence state
```

A semantic label never authorizes coordinates. **No orphan/filler Cube**: each primary Cube implements a declared mass/landmark or justified split. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Choose the simplest Blockbench-buildable construction preserving the visible requirement. Use volume for silhouette, plane-like Cubes for sheet form, linked segments for meaningful bends, and Locator for required non-visible anchors.

Decide transform ownership before rotation: shared semantic orientation/attachment/articulation is **Group/Bone-owned**; a local rigid slope may be Cube-owned. Do not create hierarchy solely to increase depth, node count, or apparent sophistication.

Classify material primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment state its contact target/invariant before coordinates. Use an attachment/joint pivot when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof; important negative spaces stay open.

## Future Editability / Animation Readiness

All Geometry should remain future-animation-friendly:

- semantic hierarchy instead of arbitrary grouping;
- structurally distinct naturally movable parts separated with sensible transform/pivot ownership;
- no destructive structure that would need full rebuild merely to animate later;
- no speculative full rig for static-only scope.

If `Animation Required = YES`, participating hierarchy/Bones/pivots/attachments/transform ownership must be animation-ready **before Geometry is offered for user approval**.

## Primary Build / Difference-First Fidelity

**Stay in the geometry lane unless a current decision requires another branch.** Create the minimum coherent complete form before detail. Resolve minor discrepancy consistently:

```text
explicit user requirement
→ original source evidence
→ best-supported approved view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Do not average drift. Only unresolved material conflict becomes `BLOCKED`. Front agreement does not certify depth.

Successful `manage_cubes` execution is tool/execution evidence only. Tool success never authorizes visual `PASS`. Once judgeable, capture only necessary current model views. After primary `PASS`, add identity-weighted secondary geometry only where silhouette, recognizability, contact/layering, editability, or motion benefits.

Material internal verdict requires approved reference + **fresh current-revision model** image(s):

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Mutation makes affected captures stale. Tool success, coordinates, bounds, hierarchy, validators, or **similarity scores cannot justify `PASS`**.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, and expected visible/structural effect. Returned `geometry_effect` must match the intended structural change.

Capture affected view(s) first; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. Progress requires `IMPROVED` with no supported material claim regressed. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and set `BLOCKED`.

## Geometry Completion / User Approval

Internal Geometry readiness requires:

```text
shape/proportions/dimensions coherent
required parts/count/attachments/orientations coherent
semantic hierarchy + transform ownership coherent
future editability satisfied
animation-ready foundation when Animation Required = YES
UV Layout readiness satisfied
no live temporary Shape GLB/reference_model before final verify
```

Then:

```text
internal Geometry PASS
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → continue Geometry
   └─ explicit approve → Geometry APPROVED → checkpoint save
```

Internal captures are for Codex judgement; they do not need to be shown to the user. Do not send materially broken Geometry to user review.

Only after explicit user approval may normal forward handoff proceed:

```text
geometry approved + uv_layout ready
→ HANDOFF_REQUIRED(texturing)
→ switch_authoring_phase through Gateway
→ continue same task with Texturing specialist
```

## Existing Assets / Reopening

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose only the requested/current defect unless broader evidence proves the baseline itself materially wrong.

A previously approved Geometry stage reopens only for a material Geometry-owned blocker. After correction, internally verify and obtain user approval again. Invalidate only materially dependent Texturing/Animation approvals.
