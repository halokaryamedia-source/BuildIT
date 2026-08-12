---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for actual-reference grounding, Semantic Form, Cuboid form, pivots/contacts, correction, and visual completion. Not for MCP/plugin defects.
---

# Blockbench Bedrock Modelling

Own **what must exist, how primary masses relate, and whether geometry is grounded enough to continue**. MCP mechanics stay in the orchestrator.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Bounds are for envelope/scale/ground/displacement. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding Gate

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/metadata/prose/prior observation/memory is context, not visual evidence. If unavailable, **Enter the workflow `BLOCKED` state**; never reconstruct visible form from prose or generic object knowledge.

```text
user brief/target → identity/function
approved image → visible form
approved dimensions → numeric envelope
Reference Evidence Map → derived index only
```

Ground only material claims:

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map** from each used reference label to matching canonical `capture_model_views` view. Ambiguous front/back, left/right, mirrored, or 3/4 pairing stays `UNVERIFIED`; unlike views cannot approve each other.

## Semantic Form / Orientation / Contact Gate

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

A semantic label never authorizes coordinates. Every primary Cube implements a declared mass/landmark or justified split/relationship. **No orphan Cube, filler Cube**, or gap-filling Cube. `PROVISIONAL` may support a non-contradictory coarse hypothesis; placement never verifies it.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. `[0,0,0]` needs image support, not convenience. `ROTATED` means a **visible material slope/orientation** requires rotation plus explicit pivot/origin and role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, state its **contact target/invariant** before coordinates. Rotation preserves it; use an **attachment/joint pivot** when it owns the transform. **AABB overlap, hierarchy, or numeric touching is not contact proof**; paired views must show connection and intentional negative spaces stay open.

## Tool Lane Discipline / Primary Build

Normal lane: grounded claims → Semantic Form → Primary Form Hypothesis → coherent Cubes/Groups → necessary views → exact inspect/correct for diagnosed mismatch. **If no current decision requires a branch, stay in the geometry lane** instead of searching for completeness work.

Use `SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE` per material axis/placement/orientation/contact. **A convincing front silhouette does not validate depth.** Never average cross-view conflict into invented geometry; unresolved material conflict → **Enter the workflow `BLOCKED` state**.

Semantic Form says **what exists/how parts relate**; Primary Form says **where/how large/how oriented**. Keep relative size/placement, orientation + supporting claim/view(s), contact invariant, uncertainty. Exact transforms come from the whole-form hypothesis, not independent guesses.

Create the minimum coherent recognizable form; establish masses, counts, contacts, negative spaces before detail. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; `visual_verdict: not_evaluated` is not approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once judgeable, gate before detail. An under-constrained axis may use a **provisional working extent** only when no material invariant is violated; placement does not verify it.

## Difference-First Reference Fidelity Verdict

Material verdict requires **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**. Map/path/manifest/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Search **difference-first** for recognizability, required masses/landmarks/counts, silhouette/proportion, placement, orientation/slope, topology/contact, negative spaces.

`FAIL` = critical/major mismatch; name claim + paired view. `UNVERIFIED` = image evidence/pairing missing, ambiguous, conflicting, unavailable. `PASS` = fresh paired evidence shows no critical/major mismatch for supported claim.

Front PASS is not full 3D PASS when depth/side evidence is missing/fails. Tool success, coordinates, bounds, hierarchy, validators, scalar similarity/IoU/projection scores, or fluent review text **cannot justify PASS**. Visible material slope left axis-aligned is `FAIL` unless intentionally stepped. After material mutation, affected model views are **stale** until re-captured. If approved image disappears, reload it or stay `UNVERIFIED/BLOCKED`. Wrong decomposition → Semantic Form; otherwise revise Primary Form instead of micro-patching.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once. State target UUID(s), cause, intended change, invariant, expected structural + visible effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size`, declared pivot role, required attachment. `geometry_effect` must match intent. **An unintended center shift** during center-preserving RESIZE, a size change during TRANSLATE, extent change during ROTATE, or broken contact invariant is structurally wrong.

After fresh affected views, compare pre/post evidence for every materially affected claim/view:

```text
IMPROVED | UNCHANGED | REGRESSED
```

A correction is progress only when the target mismatch is `IMPROVED` and no previously supported material claim/view is `REGRESSED`. `UNCHANGED`/`REGRESSED` is not progress. A fix that helps one view while materially regressing another is rejected; change causal diagnosis or reopen Primary Form rather than patch around it. This delta is qualitative, never a similarity score.

If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED / Completion

`BLOCKED` covers missing approved image, invalid View Pair Map, unresolved semantic/reference/orientation/contact conflict, unavailable evidence/capability, or repeated same-cause failure. Keep last valid state and name what is required.

Only after primary `PASS` add secondary geometry for silhouette/contact/detail/motion; Groups/pivots need real organization/articulation. Production texture/animation waits for dependent geometry/hierarchy/pivots. Existing-asset domain-only work may use current geometry as baseline without claiming reference approval. Complete only claims supported by fresh paired evidence; report `UNVERIFIED` honestly.
