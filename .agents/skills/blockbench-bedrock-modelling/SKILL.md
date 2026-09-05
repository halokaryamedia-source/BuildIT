---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, correction, and reference readiness.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Surface/contact question → `inspect_model_bounds` once for bounded risk hints. Otherwise skip the bounds call.
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable, `BLOCKED`.

```text
user brief/target   → identity/function
approved image      → visual authority
approved dimensions → numeric envelope authority
Geometry Strategy   → DIRECT | 3D_ASSISTED; user-selected only
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Never infer/default/auto-switch Geometry Strategy.

```text
DIRECT      → semantic Groups/Cubes
3D_ASSISTED → Shape Reconstruction → Shape GLB PASS
             → PrimitiveAnything decomposition PASS → Cuboid Scaffold → semantic cleanup
```

3D-Assisted intermediates are hypotheses. Remove live GLB before final Geometry review. Unavailable path → `BLOCKED`; never emulate/fallback.

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. When evidence is clear, **do not turn analysis ceremony into the work**.

## Simple Rigid Fast Path

When evidence is clear, topology simple, and the object predominantly rigid:

```text
identity + envelope + primary masses
→ simplest transform ownership
→ minimum meaningful hierarchy
→ coherent PRIMARY BLOCKOUT
→ judgeable views
→ diagnose only observed mismatch
```

Construction forms are **not presets**. Keep Groups/Bones only for real shared transform, attachment, articulation, or form-defining hierarchy. Local rigid slopes may be Cube-owned; neutral organization stays downstream.

## Semantic Form / Construction / Transform Gate

Before exact coordinates determine material facts:

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

Choose the simplest buildable construction preserving the visible requirement: volume for silhouette, plane-like Cubes for sheet form, linked segments for bends, Locator for non-visible anchors. **Use texture for surface information** that needs no silhouette, volume, contact, or separate motion.

Decide transform ownership before rotation: shared semantic orientation/attachment/articulation is **Group/Bone-owned**; local rigid orientation may be Cube-owned. Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment state its **contact target/invariant** before coordinates. Use an **attachment/joint pivot** when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof; important negative spaces stay open.

## Surface / Cohort Quality Gate

**No positive-volume overlap alone is not visual PASS.** Judge affected views for penetration, accidental coplanar surfaces, gaps, contact seams, and layer offsets. User-reported surface defects reopen this gate even after a clean structural validator.

For a semantic assembly translation/orientation, prefer its Group/Bone when one shared transform explains intent. Otherwise update the complete affected sibling cohort coherently. A single-child move inside a multi-part assembly needs an explicit local-part reason and fresh view proof that sibling relationships remain correct.

## Future Editability / Animation Readiness

Keep semantic hierarchy and movable distinct parts separate; do not build speculative full rigs. If Animation is required, participating hierarchy/pivots/attachments must be ready before Geometry approval.

## Primary Build / Difference-First Reference Fidelity Verdict

**Stay in the geometry lane unless a current decision requires another branch.** Build the minimum coherent complete form before detail.

```text
explicit user requirement
→ original source evidence
→ best-supported approved view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Minor supported drift uses one consistent interpretation. Do not average drift. **Only unresolved material conflict becomes `BLOCKED`.** Front agreement does not certify depth.

Successful `manage_cubes` execution is **Tool success** and **execution evidence** only. Tool success never authorizes visual `PASS`. After primary `PASS`, add identity-weighted secondary geometry only where silhouette, recognizability, contact/layering, editability, or motion benefits.

Material verdict requires the actual approved reference image + **fresh current-revision model** image(s):

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Mutation makes affected captures stale. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`**. Similarity scores cannot justify `PASS`.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume
```

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, and expected visible/structural effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size` and uses a justified pivot. Returned `geometry_effect` must match intent.

Capture **affected view(s) first**; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. **Progress requires `IMPROVED`**. A fix that helps one view while materially regressing another is rejected. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and reframe as `BLOCKED`.

## Existing Assets

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose only the requested/current defect unless evidence proves the baseline materially wrong. Visual/fidelity updates require the approved reference; deterministic explicit changes may not.

## Shared Authoring Session / User Approval

Geometry owns shape/hierarchy/rig/pivots/UV Layout; Texturing owns atlas pixels/PBR. Both remain callable in the same AUTHORING Runtime surface; semantic ownership governs mutation.

`internal geometry=PASS + uv_layout=PASS → READY_FOR_USER_REVIEW` at a meaningful checkpoint. User revision continues Geometry; explicit approval saves the checkpoint and continues Texturing focus in the same AUTHORING surface.

A texture-discovered Geometry/UV defect is corrected directly with the Geometry owner; no Geometry↔Texturing phase handoff. Revalidate only affected texture evidence. `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is reserved for AUTHORING↔Animation.
