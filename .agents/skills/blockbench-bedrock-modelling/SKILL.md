---
name: blockbench-bedrock-modelling
description: Minecraft Bedrock Entity modelling judgement for reference-driven Cube/Cuboid form, proportions, silhouette, hierarchy/pivots, visual correction, and completion. Use with the BlockIT orchestrator; do not load for plugin/runtime or MCP implementation defects.
---

# Blockbench Bedrock Modelling

Own **what the Bedrock model should become** and whether the visible result is good enough to continue. MCP mechanics belong to the BlockIT orchestrator; texture/PBR and animation execution stay in their specialists.

Read foundation docs only when the current decision needs their detail: `03-modelling-workflow`, `04-reference-guide`, `05-geometry-standard`, `06-texture-standard`, `07-visual-validation`.

## Minimum Necessary Evidence

Use the smallest evidence set that can change the next modelling decision. Strictness applies to claims, not call count.

- **No per-Cube inspection ceremony** for new geometry with no diagnosed problem.
- **No screenshot-per-mutation loop**. Build a judgeable coarse whole form, then run a meaningful gate.
- Re-observe only affected view/relationship after a local correction; reopen whole-form review only when a global hypothesis is implicated.
- Bounds are conditional on numeric envelope, scale, ground, displacement, or gross-placement questions. **Otherwise skip the bounds call**.
- `UNVERIFIED` does not automatically require more calls.
- Keep simple Primary Form reasoning as a short working note.

## Tool Lane Discipline

Normal lane: project/orient only when needed → coherent Cube/Group build → necessary canonical views → exact inspect/correct only for diagnosed mismatch → secondary/downstream work after its gate → export on request.

Batch primary Cube placement when several masses are already supported by one coherent Primary Form Hypothesis; do not split them into separate calls merely for ceremony. Batch `capture_model_views` for the few views needed by the same gate.

If no current decision requires a branch, stay in the geometry lane instead of searching for a tool that only makes the asset look more complete.

## Reference Frame And Evidence

Establish only material facts: object identity, `bedrock` target, approved reference, numeric dimensions if supplied, X=width/Y=height/Z=length, front/ground when relevant, texture scope, animation requirement, and existing model state when revising.

Treat the reference as one 3D brief, not pixel calibration. For material axis/placement/orientation/contact claims use the smallest useful state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- SUPPORTED: directly constrained by relevant view(s).
- PROVISIONAL: a working value is needed but evidence is incomplete.
- CONFLICTING: relevant views materially disagree.
- UNAVAILABLE: the claim cannot be observed.

Do not borrow confidence across axes. **A convincing front silhouette does not validate depth.** A 3/4 view is context, not authority over clearer orthographic evidence. Never average a material cross-view conflict into invented geometry; if the brief/user intent cannot resolve it, **Enter the workflow `BLOCKED` state**.

## Primary Form Hypothesis

Before exact transforms, keep a compact working hypothesis containing only:

```text
primary mass role
relative size / center / placement
important slope or contact
supporting view(s)
material uncertainty
```

No locked per-Cube blueprint, fixed Cube count, universal build order, anatomy template, or exact transform approval is required. Exact transforms come from the whole-form hypothesis, not independent coordinate guesses.

## Coarse Primary Build

Create the minimum coherent whole form needed for recognizability.

- represent each required primary mass or necessary orientation split;
- establish major masses before local polish;
- axis-align when correct; rotate only for evidence-backed slope/motion;
- do not use rotation or extra detail to hide wrong size/placement;
- preserve visible contacts/relationships;
- defer detail, UV polish, texture, and decoration.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; mutation result `visual_verdict: not_evaluated` is not visual approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once primary masses are judgeable, **stop** adding primary geometry and run the gate before secondary detail.

An under-constrained axis may need a **provisional working extent**, but successful placement does not make it reference-verified.

## Difference-First Reference Fidelity Verdict

At each material gate compare fresh model view(s) against the corresponding reference view(s) **difference-first**: silhouette, primary proportions, placement, orientation/slope, and visible contacts applicable to that claim.

Every material visual gate ends in exactly one:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — any critical/major mismatch is visible; name the mismatch and supporting view.
- **UNVERIFIED** — required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in applicable supported criteria.

Front PASS is not full 3D PASS when side/depth evidence is missing or fails. Tool success, valid coordinates, bounds, hierarchy, connectivity, or validator success cannot justify PASS.

If several primary relationships fail together, the object is not recognizable, or fixes require compensating detail, revise/rebuild the Primary Form Hypothesis instead of micro-patching. If global form is sound and one bounded relationship is wrong, correct locally.

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

Do not default to adding a Cube.

Before a numeric local correction, use `inspect_element` once to obtain exact authored state, then declare the smallest **invariant**:

```text
cause
exact UUID(s)
current state
what changes
what must stay fixed
expected structural effect
```

Examples: TRANSLATE preserves size; RESIZE names axis + fixed center/face/contact; ROTATE does not rewrite size and uses a justified pivot; hierarchy REATTACH uses a supported parent owner or becomes `BLOCKED`.

`modify_cube` / `modify_cubes_batch` return before/after plus `geometry_effect`. Check that structural effect before visual approval. **An unintended center shift** during a center-preserving resize, size change during TRANSLATE, or extent change during ROTATE means the correction is structurally wrong. No effective geometry/visibility change is not progress.

Re-capture only affected view(s). If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe instead of patching again.

## BLOCKED

`FAIL / UNVERIFIED / PASS` are visual verdicts. `BLOCKED` means valid continuation would require guessing or repeated failed work.

Use `BLOCKED` for unresolved material reference conflict, required observation still unavailable after one useful retry, the two-failure same-cause threshold, unavailable required supported capability, or any path that would present provisional geometry as verified.

When blocked: stop mutation, keep last valid state, state the blocker/evidence and affected claim, summarize bounded attempts, and name the exact evidence/user decision/capability needed. Never report PASS/fixed/resolved while the blocker remains.

## Secondary Geometry / Hierarchy / Pivots

Only after primary PASS:

- add secondary geometry that materially improves silhouette, contact, required detail, or motion;
- use semantic names and purposeful editable structure;
- add Groups/hierarchy for real organization/articulation needs;
- place pivots where actual joints/attachments/transform centers require them;
- do not invent bones/pivots merely because animation may exist later.

Run a complete geometry review before production downstream work. Confirm relevant silhouette/proportions/depth/contacts/orientation plus hierarchy/pivots needed by the requested surface/motion work. Technical validity is not visual PASS.

## Downstream Handoff

For end-to-end creation, production texture/UV/PBR/material work waits for geometry it depends on to PASS. Production animation waits for the required geometry baseline plus suitable participating hierarchy/pivots. Existing-asset texture-only/animation-only work may use current geometry as a user-provided baseline without claiming reference approval.

Placeholder texture or diagnostic pose may be provisional/disposable. If geometry/hierarchy/pivots change later, only affected downstream UV/material/keyframe/attachment assumptions become stale and need revalidation. Downstream sunk cost never justifies preserving rejected geometry.

## Completion

A model is complete only for claims actually proved by fresh evidence. Report remaining UNVERIFIED claims honestly. A valid result is more important than a success report. Live reference fidelity remains a live Blockbench/Codex proof, never a source/CI claim.
