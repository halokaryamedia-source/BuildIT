---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own geometry/form judgement, transform ownership, and whether reference-grounded modelling can continue.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are only for envelope/scale/ground/displacement. Otherwise skip the bounds call.
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding Gate

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable, enter `BLOCKED`.

```text
user brief/target → identity/function
approved image → visible Minecraft form
approved dimensions → numeric envelope
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. Reference fidelity is Minecraft-first: recognizability, primary masses/counts, topology/attachment, important negative spaces, and buildability over exact real-world contour.

When an approved Route 1 GLB is explicitly available and `manage_geometry_reference` is exposed, it may be loaded as transient 3D evidence for depth, volume, attachment, placement, and hidden-side interpretation. Approved image + dimensions remain authority. Use explicit-envelope `capture_model_views`; never trace triangles or infer target size from raw GLB bounds. Remove the reference before production `.bbmodel` export.

## Simple Rigid Fast Path

When the approved reference is clear, the object is predominantly rigid, topology is simple, and no material cross-view conflict exists, **do not turn analysis ceremony into the work**.

```text
identity + envelope + primary masses
→ simplest transform ownership
→ minimum meaningful hierarchy
→ coherent primary Cube batch
→ judgeable views
→ diagnose only observed mismatch
```

Keep one root Group plus only Groups/Bones that own a real shared transform, attachment, or articulation. Sequential rigid sections do **not** need a nested Group chain merely to create small local bends; use Cube-local rotation when the slope is local. Do not split a coherent known build into many placement calls just to check each part. One primary batch, or a second batch only after new evidence changes the decision, is preferred.

This fast path changes ceremony, not quality: material ambiguity, attachment, depth, or cross-view conflict still requires the relevant evidence gate.

## Semantic Form / Construction / Transform Gate

Before exact `from/to/origin/rotation`, determine only the material facts:

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

A semantic label never authorizes coordinates. No orphan/filler Cube: each primary Cube implements a declared mass/landmark or justified split. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Choose the simplest construction that preserves the visible requirement. Solid Cuboid, plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, not presets. Use volume for silhouette, planes for sheet-like form, linked segments for meaningful bends, and Locator for a required non-visible anchor.

Decide transform ownership before rotation: shared semantic orientation/attachment/articulation is Group/Bone-owned; a local rigid slope may be Cube-owned. Form/contact/articulation-defining Groups/pivots may belong in primary blockout; neutral organization stays downstream. **Do not create hierarchy solely to increase depth, node count, or apparent sophistication.**

Classify material primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment, state its contact target/invariant before coordinates. Use an attachment/joint pivot when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof; important negative spaces stay open.

## Primary Build / Difference-First Reference Fidelity Verdict

Stay in the geometry lane unless a current decision requires another branch. Create the minimum coherent form: masses, counts, contacts, negative spaces, and required hierarchy before detail.

A minor reference discrepancy does not change identity, required counts, topology/attachment, important negative space, buildability, or identity-critical material information. Resolve it consistently:

```text
explicit user requirement
→ original source evidence
→ best-supported approved view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Do not average drift. Only unresolved material conflict becomes `BLOCKED`.

Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only. Once the form is judgeable, capture the necessary views before secondary detail. Front agreement does not certify depth. After primary `PASS`, add identity-weighted secondary geometry only where silhouette, recognizability, contact/layering, or motion benefits.

Material verdict requires the approved reference and fresh current-revision model image(s) in the same comparison context:

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Search difference-first for identity, masses/counts, silhouette/proportion, orientation, contact, and negative spaces. Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`. Mutation makes affected captures stale.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

Reuse fresh exact authored state already returned for the target; otherwise `inspect_element` once. State target UUID(s), cause, intended change, invariant, and expected visible/structural effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, pivot role, and required attachment. `geometry_effect` must match the intended structural change.

Capture affected view(s) first; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. Progress requires `IMPROVED` with no supported material claim regressed. A fix that helps one view while materially regressing another is rejected. If the same causal correction direction has failed twice without new evidence, stop speculative mutation and reframe.

## BLOCKED / Completion

`BLOCKED` covers missing approved image, unresolved material conflict, unavailable capability, or repeated same-cause failure. Minor drift alone is not a blocker.

Primary-form hierarchy/pivots may precede `PASS`; secondary geometry and neutral organization wait. Production texture/animation waits for dependent geometry/hierarchy/pivots. Existing-asset work may use current geometry as baseline without claiming reference approval. Complete only claims supported by fresh evidence; report `UNVERIFIED` honestly.
