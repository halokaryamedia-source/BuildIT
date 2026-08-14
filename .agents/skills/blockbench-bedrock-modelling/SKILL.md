---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own geometry/form judgement, transform ownership, and whether reference-grounded modelling can continue.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are only for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding Gate

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is **context, not visual evidence**. If unavailable, **Enter the workflow `BLOCKED` state**.

```text
user brief/target → identity/function
approved image → visible Minecraft form
approved dimensions → numeric envelope
Reference Evidence Map → derived index only
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map**; ambiguous front/back, left/right, mirrored, or 3/4 pairing stays `UNVERIFIED`.

Reference fidelity is **Minecraft-first**: preserve recognizability, primary masses/counts, topology/attachment, important negative spaces, and buildability rather than exact real-world anatomy/contour.

## Semantic Form / Construction / Transform Gate

Form the **Semantic Form Contract before choosing `from/to/origin/rotation`**:

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

**A semantic label never authorizes coordinates. No orphan Cube, filler Cube.** Every primary Cube implements a declared mass/landmark or justified split. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Choose the **simplest construction that preserves the visible requirement**. Solid Cuboid, plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, not presets. Use volume for silhouette, planes for sheet-like form, linked segments for meaningful bends, and Locator for a required non-visible anchor.

Decide **transform ownership** before rotation: shared semantic orientation/attachment/articulation is Group/Bone-owned; a local rigid slope may be Cube-owned. Form/contact/articulation-defining Groups/pivots may belong in primary blockout; neutral organization stays downstream.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. **`[0,0,0]` needs image support.** A visible material slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, state its **contact target/invariant** before coordinates. Use an **attachment/joint pivot** when it owns the transform. **AABB overlap, hierarchy, or numeric touching is not contact proof**; important negative spaces stay open.

## Tool Lane Discipline / Primary Build

**If no current decision requires a branch, stay in the geometry lane.** Normal lane: grounded claims → Semantic Form → construction + transform ownership → Primary Form → coherent primary Cubes/Groups → necessary views → diagnosed correction.

A **minor reference discrepancy** does not change identity, primary mass/required count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information. Resolve it with **one canonical interpretation**:

```text
explicit user requirement
→ original Source evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable form
```

**Do not average drift.** Minor reference discrepancy alone is not a blocker. **A convincing front silhouette does not validate depth.** Only unresolved **material** cross-view conflict → **Enter the workflow `BLOCKED` state**.

Semantic Form says what exists/how parts relate; Primary Form says where/how large/how oriented. Create the minimum coherent form: masses, counts, contacts, negative spaces, and required primary hierarchy before detail.

Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; `visual_verdict: not_evaluated` is not approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once judgeable, stop before secondary detail. An under-constrained axis may use a **provisional working extent** only when no material invariant is violated; placement does not verify it.

After primary `PASS`, use identity-weighted secondary geometry only where silhouette, recognizability, contact/layering, or motion benefits.

## Difference-First Reference Fidelity Verdict

Material verdict requires **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**. Path/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Search **difference-first** for recognizability, masses/counts, silhouette/proportion, orientation, contact, negative spaces. `FAIL` = critical/major mismatch; `UNVERIFIED` = missing/ambiguous/materially conflicting/unavailable evidence; `PASS` = no critical/major supported mismatch. Minor preview drift is not `FAIL` when the canonical Minecraft interpretation remains recognizable/buildable.

Front PASS is not full 3D PASS when depth evidence is missing/fails. Tool success, coordinates, bounds, hierarchy, validators, or **similarity/IoU/projection scores cannot justify PASS**. Material mutation makes affected captures stale.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once. State target UUID(s), cause, intended change, invariant, expected structural + visible effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, declared pivot role, required attachment. `geometry_effect` must match intent. **An unintended center shift** during center-preserving RESIZE, size change during TRANSLATE, extent change during ROTATE, or broken contact invariant is structurally wrong.

Capture affected view(s) first; expand only for material cross-view risk. Then classify `IMPROVED | UNCHANGED | REGRESSED`. Progress requires `IMPROVED` with no supported material regression; `UNCHANGED`/`REGRESSED` is not progress. **A fix that helps one view while materially regressing another is rejected.** Delta is qualitative, never a similarity score.

If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED / Completion

`BLOCKED` covers missing approved image, invalid View Pair Map, unresolved material conflict, unavailable capability, or repeated same-cause failure. Minor reference discrepancy alone is not a blocker.

Primary-form-defining hierarchy/pivots may exist before primary `PASS`; secondary geometry and neutral organization wait. Production texture/animation waits for dependent geometry/hierarchy/pivots. Existing-asset work may use current geometry as baseline without claiming reference approval. Complete only claims supported by fresh paired evidence; report `UNVERIFIED` honestly.
