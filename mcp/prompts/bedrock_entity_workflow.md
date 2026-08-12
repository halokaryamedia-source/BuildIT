# Minecraft Bedrock Entity Workflow

Create/revise an editable Bedrock **Entity** in Blockbench. Use `bedrock`; Cubes are geometry, Groups are bones/organization. Reference is visual authority; tool/file success is not resemblance approval.

## Minimum necessary evidence

Use evidence only when it changes the next decision or proves the claim. Do not inspect each newly placed Cube or capture after every mutation. Reuse fresh returned state. `create_project`/path `export_model` already return lifecycle state. Do not immediately call `get_project_info` unless required fields are missing or state may have changed externally. Use `inspect_model_bounds` only for envelope/scale/ground/displacement questions. Otherwise skip it. Re-capture only reference-corresponding affected views. `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless obtainable evidence can change the decision.

## Semantic form before geometry

Before choosing exact `from/to/origin/rotation` for a non-trivial reference, form a compact **Semantic Form Contract**:

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

No coordinates/Cube counts belong here. A semantic label alone never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split and relationship; **no orphan/filler Cube**.

For each primary mass classify orientation:

```text
AXIS_ALIGNED | ROTATED | UNRESOLVED
```

`[0,0,0]` is valid only when axis alignment is actually supported/provisional and not contradicted by a material visible slope. `ROTATED` requires an origin/pivot and pivot role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` becomes `BLOCKED`, not silent axis alignment.

For each required attachment, identify contact target/invariant first. Rotating an attached mass preserves that connection; use an attachment/joint pivot when that is the transform relation. Numeric overlap/hierarchy is not contact proof, and intentional negative spaces must remain open.

## Reference and primary form

**A front-view match cannot certify depth.** Never average material cross-view conflict into invented geometry; unresolved conflict becomes `BLOCKED`.

After the Semantic Form Contract, keep a compact Primary Form Hypothesis for the declared masses: relative size/placement, orientation state, contact invariant, supporting views, and material uncertainty. This says where/how large/how oriented; it is not a locked Cube blueprint.

Build the minimum coherent whole form. Use finite `from`/`to`; non-zero rotation needs an intentional pivot/origin; explicit identities must resolve deterministically.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only. `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once primary masses are judgeable, stop primary placement and run the visual gate before secondary detail.

An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

## Difference-first visual gate

Compare corresponding reference ↔ model evidence **difference-first** for recognizability, required primary masses/landmarks/counts, silhouette, primary proportions, placement, orientation/slope, topology/contact, and important negative spaces.

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — a critical/major mismatch is visible; name it and its supporting view.
- **UNVERIFIED** — required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in applicable supported criteria.

Front PASS is not full 3D PASS when side/depth evidence is missing or fails. Bounds, hierarchy, coordinates, validators, or successful mutation cannot justify PASS. A material visible slope left axis-aligned is `FAIL` unless the approved construction language intentionally requires that stepped form.

## Local correction

For a bounded mismatch:

1. Reuse fresh exact authored state already returned for that target when sufficient; otherwise call `inspect_element` once;
2. diagnose one cause: `TRANSLATE`, `RESIZE`, `ROTATE`, hierarchy REATTACH, `SPLIT`, `MERGE/REMOVE`, or genuinely missing `ADD MASS`;
3. state the target UUID(s), intended change, invariant, and expected structural effect;
4. use `modify_cube` or one coherent `modify_cubes_batch`;
5. verify returned `geometry_effect`;
6. re-capture only affected view(s).

TRANSLATE preserves size; RESIZE names its fixed center/face/contact; ROTATE preserves `from/to/size`, uses the declared pivot role, and must not break a required attachment. Wrong/no structural effect is not progress. If the **same causal correction direction fails twice without new evidence**, stop speculative mutation and use `BLOCKED`.

`BLOCKED` means valid continuation requires guessing, unavailable required capability/evidence, unresolved material semantic/reference/orientation/contact conflict, or repeated failed work. Keep the last valid state and name what is required to continue.

## Downstream stages

Secondary geometry follows primary `PASS`. Production texture waits for dependent geometry to `PASS`; production animation waits for an accepted baseline and suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset work may use current geometry as baseline without certifying reference accuracy.

## Locator / Null Object authored state

Locator/Null Object discovery uses `list_locator_elements`; focused state uses `inspect_element`; create/update uses `manage_locator` / `manage_null_object`.

## Protected Native Capability Gaps

Protected gaps: TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated textures, and bone-binding expressions. State the gap instead of faking it with Mesh/UI automation/`risky_eval`/another format. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

The catalog is capability, not a checklist:

```text
project unknown/absent → get_project_info or create_project as appropriate
known project state → semantic form + primary hypothesis → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream stage → active texture or animation specialist
requested deliverable → export_model
```

Use branch tools only when their data changes the decision; do not read overlapping evidence merely for confirmation.