---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own **what must exist, how form is represented, who owns transforms, and whether geometry is grounded enough to continue**.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding Gate

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable, **Enter the workflow `BLOCKED` state**; never reconstruct visible form from prose or generic object knowledge.

```text
user brief/target → identity/function
approved image → visible form
approved dimensions → numeric envelope
Reference Evidence Map → derived index only
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map**; ambiguous front/back, left/right, mirrored, or 3/4 pairing stays `UNVERIFIED`.

## Semantic Form / Construction / Transform Gate

Form the **Semantic Form Contract before choosing `from/to/origin/rotation`**; material items link to grounded `claim_id`s:

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

A semantic label never authorizes coordinates. Every primary Cube implements a declared mass/landmark or justified split/relationship. **No orphan Cube, filler Cube**. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Choose the **simplest construction that preserves the visible requirement**. Solid Cuboid, thin/plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, **not presets or required asset classes**. Use volume for silhouette; planes for sheet-like form; `inflate` for deliberate layer separation; linked segments for meaningful bends; use Locator—not a hidden Cube—for a required non-visible anchor.

Decide **transform ownership** before rotation. Shared semantic orientation/attachment/articulation should be Group/Bone-owned; local rigid slope may be Cube-owned. Form/contact/articulation-defining Groups/pivots belong in primary blockout; neutral organization may wait.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. `[0,0,0]` needs image support. A **visible material slope** requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, state its **contact target/invariant** before coordinates. Use an **attachment/joint pivot** when it owns the transform. **AABB overlap, hierarchy, or numeric touching is not contact proof**; paired views must show connection and negative spaces stay open.

## Tool Lane Discipline / Primary Build

Normal lane: grounded claims → Semantic Form → construction + transform ownership → Primary Form → coherent primary Cubes/required Groups → necessary views → diagnosed correction. **If no current decision requires a branch, stay in the geometry lane** instead of searching for completeness work.

Use `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE` per material relation. **A convincing front silhouette does not validate depth.** Never average material cross-view conflict into invented geometry; unresolved material conflict → **Enter the workflow `BLOCKED` state**.

Semantic Form says what exists/how parts relate; Primary Form says where/how large/how oriented. Keep placement/size, claims/views, transform owner, contact invariant, uncertainty. Exact transforms come from the whole-form hypothesis.

Create the minimum coherent form; establish masses, counts, contacts, negative spaces, and required primary transform hierarchy before detail. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; `visual_verdict: not_evaluated` is not approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once judgeable, stop before secondary detail. An under-constrained axis may use a **provisional working extent** only when no material invariant is violated; placement does not verify it.

After primary `PASS`, use **identity-weighted** secondary geometry only where silhouette, recognizability, contact/layering, or motion benefits. Do not distribute detail uniformly.

## Difference-First Reference Fidelity Verdict

Material verdict requires **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**. Path/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Search **difference-first** for recognizability, masses/counts, silhouette/proportion, orientation, contact, negative spaces. `FAIL` = critical/major mismatch; `UNVERIFIED` = missing/ambiguous/conflicting/unavailable evidence; `PASS` = fresh paired evidence shows no critical/major mismatch for supported claim.

Front PASS is not full 3D PASS when depth/side evidence is missing/fails. Tool success, coordinates, bounds, hierarchy, validators, similarity/IoU/projection scores, or fluent review text **cannot justify PASS**. Material mutation makes affected captures stale. Wrong decomposition → Semantic Form; wrong whole relation → Primary Form.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once. State target UUID(s), cause, intended change, invariant, expected structural + visible effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, declared pivot role, required attachment. `geometry_effect` must match intent. **An unintended center shift** during center-preserving RESIZE, size change during TRANSLATE, extent change during ROTATE, or broken contact invariant is structurally wrong.

After fresh affected views:

```text
IMPROVED | UNCHANGED | REGRESSED
```

A correction is progress only when the mismatch is `IMPROVED` and no previously supported material claim/view is `REGRESSED`. `UNCHANGED`/`REGRESSED` is not progress. A fix that helps one view while materially regressing another is rejected; re-diagnose or reopen Primary Form. This delta is qualitative, **never a similarity score**.

If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED / Completion

`BLOCKED` covers missing approved image, invalid View Pair Map, unresolved material conflict, unavailable capability, or repeated same-cause failure.

Primary-form-defining hierarchy/pivots may exist before primary `PASS`; **secondary** geometry and neutral organization wait. Production texture/animation waits for dependent geometry/hierarchy/pivots. Existing-asset work may use current geometry as baseline without claiming reference approval. Complete only claims supported by fresh paired evidence; report `UNVERIFIED` honestly.
