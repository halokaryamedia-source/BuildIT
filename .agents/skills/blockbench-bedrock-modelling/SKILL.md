---
name: blockbench-bedrock-modelling
description: Bedrock Entity modelling judgement for actual-reference grounding, Semantic Form, Cuboid whole form, pivots/contacts, correction, and visual completion. Not for MCP/plugin defects.
---

# Blockbench Bedrock Modelling

Own **what must exist, how primary masses relate, and whether reference-driven geometry is grounded enough to continue**. MCP mechanics stay in the orchestrator; texture/animation execution stay in their specialists.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Re-observe only affected relationships/views after local correction unless the global hypothesis changed.
- Bounds are for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding Gate

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/metadata/prose/prior observation/memory is context, not visual evidence. If the image cannot actually be inspected, **Enter the workflow `BLOCKED` state**; never reconstruct visible form from prose or generic object knowledge.

Authority:

```text
user brief/target → identity + requested function
approved image    → visible form
approved dimensions → numeric whole-model envelope
Reference Evidence Map → derived index only
```

Ground only material claims:

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Use run-local IDs such as `mass:torso`, `orientation:neck`, `contact:neck_torso`, `count:legs`. Claims describe visible evidence; no exact transforms, pixel calibration, hidden-feature invention, or generic object assumptions.

Create a **View Pair Map** from every used reference label to the matching canonical `capture_model_views` view. Ambiguous front/back, left/right, mirrored, or 3/4 pairing remains `UNVERIFIED`; unlike views cannot approve each other.

## Semantic Form / Orientation / Contact Gate

Form a compact **Semantic Form Contract before choosing `from/to/origin/rotation`**; material items link to grounded `claim_id`s:

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

A semantic label never authorizes coordinates. Every primary Cube implements a declared mass/landmark or justified split/relationship. **No orphan Cube, filler Cube, or Cube added only because a gap exists.** `PROVISIONAL` may support a coarse non-contradictory hypothesis; placement never upgrades it to truth.

Classify each primary mass:

```text
AXIS_ALIGNED | ROTATED | UNRESOLVED
```

`AXIS_ALIGNED` needs image evidence; `[0,0,0]` is not accepted because it is easiest. `ROTATED` means a **visible material slope/orientation** requires rotation plus explicit pivot/origin and role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` becomes `BLOCKED`, not silent axis alignment.

For every **required attachment**, state its **contact target/invariant** before coordinates. Rotating an attached mass preserves that connection; use an **attachment/joint pivot** when it owns the transform. **AABB overlap, hierarchy, or numeric touching is not contact proof**; paired views must show the connection and intentional negative spaces must stay open.

## Tool Lane Discipline / Primary Hypothesis

Normal lane: grounded claims → Semantic Form → Primary Form Hypothesis → coherent Cubes/Groups → necessary canonical views → exact inspect/correct only for diagnosed mismatch → downstream after its gate. **If no current decision requires a branch, stay in the geometry lane** instead of searching for completeness work.

For material axis/placement/orientation/contact claims use `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`. **A convincing front silhouette does not validate depth.** Never average material cross-view conflict into invented geometry; unresolved material conflict becomes `BLOCKED`.

Semantic Form says **what exists/how parts relate**. Primary Form says **where/how large/how oriented**. Keep relative size/placement, orientation + supporting claim/view(s), contact invariant, uncertainty. Exact transforms come from this whole-form hypothesis, not independent guesses.

## Coarse Primary Build

Create the minimum coherent recognizable form. Establish masses, counts, contacts, negative spaces before detail; rotate when `ROTATED`.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; `visual_verdict: not_evaluated` is not approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once primary masses are judgeable, stop and gate before secondary detail.

An under-constrained axis may use a **provisional working extent** only when it violates no material invariant; placement does not verify it.

## Difference-First Reference Fidelity Verdict

A material verdict requires the **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**. Reference Evidence Map, path, manifest, prose, memory, or stale model capture cannot approve anything.

Compare only relevant claims through View Pair Map:

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Search **difference-first** for recognizability, required masses/landmarks/counts, silhouette/proportion, placement, orientation/slope, topology/contact, negative spaces.

- `FAIL` — critical/major mismatch; name claim + paired view.
- `UNVERIFIED` — actual image evidence/pairing is missing, ambiguous, conflicting, or unavailable.
- `PASS` — fresh paired evidence shows no critical/major mismatch for the supported claim.

Front PASS is not full 3D PASS when depth/side evidence is missing/fails. Tool success, coordinates, bounds, hierarchy, validators, scalar similarity/IoU/projection scores, or fluent review text **cannot justify PASS**. A material visible slope left axis-aligned is `FAIL` unless intentionally stepped. After material mutation, affected model views are **stale** until re-captured. If the approved image is no longer visible, reload/reattach it or remain `UNVERIFIED/BLOCKED`.

If decomposition was wrong, revise Semantic Form; otherwise revise Primary Form Hypothesis instead of micro-patching.

## Local Correction Contract

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise call `inspect_element` once. State target UUID(s), cause, intended change, invariant, expected structural effect.

TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, uses declared pivot role, and preserves required attachment. `geometry_effect` must match intent. **An unintended center shift** during center-preserving resize, size change during TRANSLATE, extent change during ROTATE, broken contact invariant, or no-effect means structurally wrong correction.

Re-capture only affected views. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED / Completion

`BLOCKED` covers actual approved image unavailable, invalid View Pair Map, unresolved semantic/reference/orientation/contact conflict, unavailable evidence/capability, or repeated same-cause failure. Keep last valid state and name what is required.

Only after primary `PASS` add secondary geometry that materially improves silhouette/contact/detail/motion. Add Groups/pivots for real organization/articulation. Before production texture/animation, review dependent geometry/hierarchy/pivots. Existing-asset domain-only work may use current geometry as user baseline without claiming reference approval.

A model is complete only for claims supported by fresh paired evidence. Report remaining `UNVERIFIED` honestly; live reference fidelity is a live model/Blockbench claim, never source/CI proof.
