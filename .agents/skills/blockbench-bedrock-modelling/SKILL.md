---
name: blockbench-bedrock-modelling
description: Minecraft Bedrock Entity modelling judgement for semantic form, Cube/Cuboid whole form, proportions, silhouette, hierarchy/pivots, visual correction, and completion. Use with the BlockIT orchestrator; do not load for MCP/plugin implementation defects.
---

# Blockbench Bedrock Modelling

Own **what must exist, how primary masses relate, and whether reference-driven geometry is good enough to continue**. MCP mechanics stay in the orchestrator; texture/animation execution stay in their specialists.

## Minimum Necessary Evidence

Use only evidence that can change the next modelling decision.

- **No per-Cube inspection ceremony** for new geometry without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- After local correction, re-observe only affected relationships/views unless the global hypothesis changed.
- Bounds are for envelope/scale/ground/displacement questions. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Semantic Form Gate — Before Exact Coordinates

For a non-trivial reference, form a compact **Semantic Form Contract before choosing `from/to/origin/rotation`**. It contains no exact transforms or Cube count:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
important negative spaces / separations
representation: geometry | texture | animation | omit
material evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

A semantic label such as `head`, `body`, `handle`, or `tail` never authorizes coordinates by itself. Every primary Cube must implement one declared mass/landmark or justified split and serve a declared relationship. **No orphan Cube, filler Cube, or Cube added only because a gap exists.** Material unresolved identity/count/topology/negative-space claims become `BLOCKED` when continuation would require guessing.

## Orientation / Pivot / Contact Gate

Before authoring each primary mass classify:

```text
AXIS_ALIGNED | ROTATED | UNRESOLVED
```

`AXIS_ALIGNED` means relevant evidence supports it; `[0,0,0]` is not accepted merely as the easiest/default value. `ROTATED` means a visible material slope/orientation requires rotation and therefore an explicit pivot/origin plus pivot role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` orientation becomes `BLOCKED`, not silent axis alignment.

For every required attachment, state its contact target/invariant before coordinates. Rotating an attached mass must preserve the connection; use an attachment/joint pivot when that is the transform relationship, not an arbitrary geometric center. AABB overlap, hierarchy, or numeric touching is not contact proof; paired views must show the required connection and intentional negative spaces must remain open.

A visible material slope represented as axis-aligned geometry is `FAIL` unless the approved construction language intentionally requires a stepped form.

## Tool Lane Discipline

Normal lane: semantic form → primary hypothesis → coherent Cubes/Groups → necessary canonical views → exact inspect/correct only for diagnosed mismatch → downstream work after its gate. **If no current decision requires a branch, stay in the geometry lane** instead of searching for completeness work.

## Reference Evidence / Primary Hypothesis

For material axis/placement/orientation/contact claims use:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Do not borrow confidence across axes. **A convincing front silhouette does not validate depth.** Never average material cross-view conflict into invented geometry; if unresolved, **Enter the workflow `BLOCKED` state**.

The Semantic Form Contract says **what must exist and how parts relate**. The Primary Form Hypothesis says **where, how large, and how oriented** those declared masses are. For each primary mass keep only relative size/placement, orientation state + supporting view(s), contact invariant, and material uncertainty. Exact transforms come from that whole-form hypothesis, not independent coordinate guesses.

## Coarse Primary Build

Create the minimum coherent whole form needed for recognizability. Establish major masses, counts, contacts, and negative spaces before detail. Rotate when the orientation gate says `ROTATED`.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only. `visual_verdict: not_evaluated` is not visual approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once primary masses are judgeable, stop and run the gate before secondary detail.

An under-constrained axis may use a **provisional working extent** only when it does not violate a material semantic/orientation/contact invariant; placement does not verify it.

## Difference-First Reference Fidelity Verdict

Compare fresh paired model/reference views **difference-first** for recognizability, required masses/landmarks/counts, silhouette, proportions, placement, orientation/slope, topology/contact, and important negative spaces.

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — critical/major mismatch visible; name it and its supporting view.
- **UNVERIFIED** — required evidence missing/ambiguous/conflicting/unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in supported criteria.

Front PASS is not full 3D PASS when depth/side evidence is missing or fails. Tool success, coordinates, bounds, hierarchy, or validator success cannot justify PASS. If several primary relationships fail, revise the Semantic Form Contract only when decomposition was wrong; otherwise revise the Primary Form Hypothesis instead of micro-patching.

## Local Correction Contract

Classify before mutation:

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing declared volume
```

Reuse fresh exact authored state already returned for that target when sufficient; otherwise call `inspect_element` once. State target UUID(s), cause, intended change, invariant, and expected structural effect.

TRANSLATE preserves size; RESIZE names changed axis and fixed anchor/center/contact; ROTATE preserves `from/to/size`, uses the declared pivot role, and must not break a required attachment. `geometry_effect` must match the intent. **An unintended center shift** during center-preserving resize, size change during TRANSLATE, extent change during ROTATE, broken attachment invariant, or no-effect mutation means the correction is structurally wrong.

Re-capture only affected views. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED / Completion

`BLOCKED` means valid continuation would require guessing or repeated failed work: unresolved material semantic/reference/orientation/contact conflict, unavailable required evidence/capability, or repeated same-cause failure. Keep the last valid state and name what is required.

Only after primary PASS add secondary geometry that materially improves silhouette, contact, required detail, or motion. Add Groups/pivots for real organization/articulation needs. Before production texture/animation, review dependent geometry/hierarchy/pivots. Existing-asset domain-only work may use current geometry as user baseline without claiming reference approval.

A model is complete only for claims supported by fresh evidence. Report remaining `UNVERIFIED` honestly; live reference fidelity is a live Blockbench/Codex claim, never a source/CI claim.
