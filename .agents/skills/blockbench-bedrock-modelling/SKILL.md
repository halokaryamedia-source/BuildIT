---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, and whether reference-grounded modelling can continue.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are only for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable, `BLOCKED`.

```text
user brief/target    → identity/function
approved image       → visual authority
approved dimensions  → numeric envelope authority
Geometry Strategy    → DIRECT | 3D_ASSISTED; user-selected only
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Never infer/default/auto-switch Geometry Strategy.

```text
DIRECT      → normal semantic Groups/Cubes
3D_ASSISTED → Shape Reconstruction → Shape GLB PASS
             → PrimitiveAnything decomposition PASS
             → deterministic Cuboid Scaffold → semantic cleanup
```

3D-Assisted is one package. GLB/decomposition/scaffold are intermediate evidence/hypotheses, not authority. A passed GLB may stay locked/non-export during cleanup; remove it before final Geometry verification/user review. If the production path is unavailable, `BLOCKED`; never emulate/fallback.

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. Do not silently compare the closest-looking view. When evidence is already clear, **do not turn analysis ceremony into the work**.

## Simple Rigid Fast Path

When reference evidence is clear, topology is simple, and the object is predominantly rigid:

```text
identity + envelope + primary masses
→ simplest transform ownership
→ minimum meaningful hierarchy
→ coherent PRIMARY BLOCKOUT
→ judgeable views
→ diagnose only observed mismatch
```

Construction forms are examples, **not presets**. Keep one root Group plus only Groups/Bones that own a real shared transform, attachment, or articulation. Local rigid slopes may be Cube-owned. Form/contact/articulation-defining hierarchy may belong in the primary blockout; neutral organization stays downstream. Do not split coherent known work into many calls just to inspect each part.

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

For every required attachment state its **contact target/invariant** before coordinates. Use an **attachment/joint pivot** when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof; important negative spaces stay open.

## Future Editability / Animation Readiness

All Geometry stays future-animation-friendly: semantic hierarchy, sensible transform ownership, and naturally movable structurally distinct parts separated. Do not build a speculative full rig for static scope. If `Animation Required = YES`, required hierarchy/Bones/pivots/attachments must be animation-ready before Geometry user approval.

## Primary Build / Difference-First Reference Fidelity Verdict

**Stay in the geometry lane unless a current decision requires another branch.** Create the minimum coherent complete form before detail. Resolve minor discrepancy consistently:

```text
explicit user requirement
→ original source evidence
→ best-supported approved view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Do not average drift. **Only unresolved material conflict becomes `BLOCKED`.** Front agreement does not certify depth.

Successful `manage_cubes` execution is **Tool success** and **execution evidence** only. Tool success never authorizes visual `PASS`. Once judgeable, capture necessary views. **After primary `PASS`, add identity-weighted secondary geometry only** where silhouette, recognizability, contact/layering, or motion benefits.

Material verdict requires approved reference + **fresh current-revision model** image(s):

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Mutation makes affected captures stale. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`. Similarity scores cannot justify `PASS`.**

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, and expected visible/structural effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, pivot role, and required attachment. Returned `geometry_effect` must match the intended structural change.

Capture **affected view(s) first**; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. **Progress requires `IMPROVED`** with no supported material claim regressed. A fix that helps one view while materially regressing another is rejected. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and reframe as `BLOCKED`.

## Existing Assets

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose only the requested/current defect unless broader evidence proves the baseline itself is materially wrong. Visual/fidelity updates require the actual approved reference; deterministic explicit changes may not.

## Phase Handoff / User Approval

Geometry owns shape, hierarchy, rig foundation, UV Layout, and production cleanup. Texturing/Animation do not borrow structural mutation.

```text
internal geometry=PASS + uv_layout=PASS
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revision → continue Geometry
   └─ explicit approve → checkpoint save
→ HANDOFF_REQUIRED(texturing)
→ switch_authoring_phase through Gateway
→ continue same task with Texturing specialist
```

If later phases expose a material Geometry blocker, return through Gateway, repair the exact owner, obtain user approval again, and invalidate only materially dependent downstream approval.
