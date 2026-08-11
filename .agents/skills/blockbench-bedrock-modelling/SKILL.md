---
name: blockbench-bedrock-modelling
description: Minecraft Bedrock Entity modelling judgement for Cube/Cuboid whole form, proportions, silhouette, hierarchy/pivots, visual correction, and completion. Use with the BlockIT orchestrator; do not load for MCP/plugin implementation defects.
---

# Blockbench Bedrock Modelling

Own **what the model should become** and whether reference-driven geometry is good enough to continue. MCP call mechanics stay in the orchestrator; texture and animation execution stay in their specialists.

Read foundation docs only when a current decision needs deeper policy detail.

## Minimum Necessary Evidence

Use the smallest evidence set that can change the next modelling decision.

- **No per-Cube inspection ceremony** for new geometry without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then run a meaningful gate.
- After a local correction, re-observe only the affected relationship/view unless the global hypothesis changed.
- Bounds are for numeric envelope, scale, ground, displacement, or gross placement questions. **Otherwise skip the bounds call.**
- `UNVERIFIED` does not automatically require more calls.

## Tool Lane Discipline

Normal lane: orient only when needed → coherent Cube/Group build → necessary canonical views → exact inspect/correct only for a diagnosed mismatch → secondary/downstream work after its gate → export on request.

Batch primary Cube placement only when several masses are already supported by one coherent hypothesis. Batch the few `capture_model_views` needed by the same gate. **If no current decision requires a branch, stay in the geometry lane** instead of searching for completeness work.

## Reference Evidence

Establish only material facts: approved reference, object orientation, X=width/Y=height/Z=length, supplied dimensions, ground/contact, and relevant existing state.

For material axis/placement/orientation/contact claims use:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- `SUPPORTED` — directly constrained by relevant evidence.
- `PROVISIONAL` — a working value is needed but evidence is incomplete.
- `CONFLICTING` — relevant views materially disagree.
- `UNAVAILABLE` — the claim cannot be observed.

Do not borrow confidence across axes. **A convincing front silhouette does not validate depth.** Never average a material cross-view conflict into invented geometry; if the brief/user intent cannot resolve it, **Enter the workflow `BLOCKED` state**.

## Primary Form Hypothesis

Before exact transforms, keep a short working hypothesis for each primary mass:

```text
role
relative size / center / placement
important slope or contact
supporting view(s)
material uncertainty
```

It is not a locked per-Cube blueprint. Exact transforms come from the whole-form hypothesis, not independent coordinate guesses.

## Coarse Primary Build

Create the minimum coherent whole form needed for recognizability. Establish major masses and contacts before detail; rotate only for evidence-backed orientation; do not use detail or rotation to disguise wrong size/placement.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only. `visual_verdict: not_evaluated` is not visual approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once primary masses are judgeable, stop primary placement and run the gate before secondary detail.

An under-constrained axis may use a **provisional working extent**; successful placement leaves it a working hypothesis, not verified reference evidence.

## Difference-First Reference Fidelity Verdict

Compare fresh corresponding model/reference views **difference-first**: silhouette, primary proportions, placement, orientation/slope, and visible contacts relevant to the claim.

Every material visual gate ends in one:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — a critical/major mismatch is visible; name it and its supporting view.
- **UNVERIFIED** — required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in applicable supported criteria.

Front PASS is not full 3D PASS when depth/side evidence is missing or fails. Tool success, coordinates, bounds, hierarchy, or validator success cannot justify PASS.

If several primary relationships fail together, revise the Primary Form Hypothesis instead of micro-patching. Correct locally only when the global form is sound and one bounded relationship is wrong.

## Local Correction Contract

Classify the cause before mutation:

```text
TRANSLATE      placement
RESIZE         extent/proportion
ROTATE         orientation/slope
REATTACH       hierarchy/contact ownership
SPLIT          one mass needs separate orientation/volume
MERGE/REMOVE   compensatory/unnecessary geometry
ADD MASS       genuinely missing visible volume
```

Reuse fresh exact authored state when sufficient; otherwise call `inspect_element` once. Before numeric correction state the target UUID(s), cause, current state, intended change, invariant, and expected structural effect.

Examples: TRANSLATE preserves size; RESIZE names the changed axis and fixed anchor/center/contact; ROTATE uses a justified pivot without rewriting size.

`modify_cube` / `modify_cubes_batch` return before/after plus `geometry_effect`. Reject an unintended center shift during a center-preserving resize, size change during TRANSLATE, extent change during ROTATE, or any no-effect mutation as progress.

Re-capture only affected views. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe.

## BLOCKED

`FAIL / UNVERIFIED / PASS` describe visual evidence. `BLOCKED` means valid continuation would require guessing or repeated failed work.

Use it for unresolved material reference conflict, required observation unavailable after one useful retry, repeated same-cause failure, unavailable required native capability, or any path that would present provisional geometry as verified. Keep the last valid state and name the exact evidence/decision/capability required to continue.

## Secondary / Downstream / Completion

Only after primary PASS add secondary geometry that materially improves silhouette, contact, required detail, or motion. Add Groups/pivots for real organization/articulation needs, not hypothetical future animation.

Before production texture or animation, review the geometry/hierarchy/pivots those stages depend on. Existing-asset texture-only/animation-only work may use the current asset as user-provided baseline without claiming reference approval.

A model is complete only for claims supported by fresh evidence. Report remaining `UNVERIFIED` honestly; live reference fidelity is a live Blockbench/Codex claim, never a source/CI claim.
