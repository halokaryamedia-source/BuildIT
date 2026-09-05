---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, correction, and reference-grounded readiness.

## Minimum Necessary Evidence

- No per-Cube inspection ceremony without a diagnosed problem.
- No screenshot-per-mutation loop; build a judgeable form, then gate it.
- Bounds are only for envelope/scale/ground/displacement.
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding

Reference work requires the **actual approved image** in active visual context; path/prose/memory is not visual evidence. If unavailable, `BLOCKED`.

```text
user brief → identity/function
approved image → visual authority
approved dimensions → numeric envelope authority
Geometry Strategy → DIRECT | 3D_ASSISTED; user-selected only
claim | observable requirement | view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Never auto-switch strategy.

```text
DIRECT      → semantic Groups/Cubes
3D_ASSISTED → Shape Reconstruction → Shape GLB PASS
             → PrimitiveAnything PASS → Cuboid Scaffold → semantic cleanup
```

3D-Assisted intermediates are hypotheses, not authority. Remove live GLB before final Geometry review. Unavailable production path → `BLOCKED`; never emulate/fallback.

Use a View Pair Map only for material front/back, side, mirror, depth, or 3/4 ambiguity. Do not turn evidence ceremony into the work.

## Simple Rigid Fast Path

```text
identity + envelope + primary masses
→ simplest transform ownership
→ minimum meaningful hierarchy
→ coherent PRIMARY BLOCKOUT
→ judgeable views
→ diagnose observed mismatch only
```

Keep Groups/Bones only when they own a real shared transform, attachment, articulation, or useful organization. Local rigid slopes may be Cube-owned. Primary form/contact hierarchy belongs in blockout when required.

## Semantic Form / Construction / Transform Gate

Before coordinates know material facts: identity, primary masses/landmarks, required count/asymmetry, topology/attachments, important negative spaces, representation (`geometry | texture | animation | omit`), and evidence state.

A label never authorizes coordinates. No orphan/filler Cube. Choose the simplest buildable construction preserving the visible requirement. Sheet form may use plane-like Cubes; bends use meaningful segments; surface-only marks stay texture.

Shared semantic orientation/attachment/articulation is **Group/Bone-owned**; local rigid orientation may be Cube-owned. Material rotated masses need explicit pivot/origin + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. `UNRESOLVED` material form → `BLOCKED`.

Required attachments state their contact invariant before coordinates. AABB overlap, hierarchy, or numeric touching is not contact proof.

## Surface / Cohort Quality Gate

**No positive-volume overlap alone is not visual PASS.** Judge affected views for visible penetration, accidental coplanar rendered surfaces, gaps, contact seams, and deliberate layer offsets. User-reported surface defects reopen this gate even after a clean structural validator.

For an assembly translation/orientation, prefer its Group/Bone when one shared transform explains intent. Otherwise update the complete affected sibling cohort coherently. A single-child move inside a multi-part assembly needs an explicit local-part reason and fresh proof sibling relationships remain correct.

## Future Editability / Animation Readiness

Keep semantic hierarchy, sensible transform ownership, and naturally movable distinct parts separate. Do not build speculative full rigs. If Animation is required, participating pivots/attachments must be ready before Geometry approval.

## Primary Build / Difference-First Reference Fidelity Verdict

**Stay in the geometry lane unless a current decision requires another branch.** Build the minimum coherent complete form before detail.

```text
explicit user requirement
→ original source evidence
→ best-supported approved views
→ simplest recognizable Blockbench-buildable interpretation
```

Do not average drift. Front agreement does not certify depth. `manage_cubes` success proves execution only.

Material verdict requires approved reference + **fresh current-revision model** views:

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Mutation stales affected captures. Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`.

After primary `PASS`, add only identity-weighted secondary geometry where silhouette, recognizability, contact/layering, editability, or motion benefits.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensation | ADD MASS genuinely missing volume
```

Reuse fresh exact state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, and expected effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/contact; ROTATE preserves from/to/size and uses justified pivot. Returned `geometry_effect` must match intent.

Capture **affected view(s) first**; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. Progress requires `IMPROVED`. A fix that helps one view while materially regressing another is rejected. If the same causal direction fails twice without new evidence, stop and reframe as `BLOCKED`.

## Existing Assets

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose the requested/current defect unless broader evidence proves the baseline materially wrong. Visual updates require approved reference; deterministic explicit changes may not.

## Shared Authoring Session / User Approval

Geometry owns shape/hierarchy/rig/pivots/UV Layout; Texturing owns atlas pixels/PBR. Both capability families remain callable in the same AUTHORING Runtime surface, while semantic ownership governs each mutation.

`internal geometry=PASS + uv_layout=PASS → READY_FOR_USER_REVIEW` at a meaningful checkpoint. User revision continues Geometry; explicit approval saves checkpoint and continues Texturing focus in the same AUTHORING surface.

A texture-discovered Geometry/UV defect is corrected directly with this owner; no Geometry↔Texturing phase handoff. Revalidate only affected downstream evidence. `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is reserved for AUTHORING↔Animation.
