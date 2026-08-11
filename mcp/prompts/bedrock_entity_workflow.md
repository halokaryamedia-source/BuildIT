# Minecraft Bedrock Entity Workflow

Create or revise a clean editable Minecraft Bedrock **Entity** model in Blockbench. Use `bedrock`; Cubes are normal geometry and Groups are bones/organization. The approved reference is visual authority. Tool/file success is execution evidence, not resemblance approval.

## Minimum necessary evidence

Use evidence only when it can change the next decision or prove the current claim.

- Do not inspect each newly placed Cube or capture after every mutation.
- Reuse returned project/identity/mutation state while it is fresh.
- `create_project` and path-writing `export_model` return lifecycle state. Do not immediately call `get_project_info` unless required fields are missing or state may have changed externally.
- Use `inspect_model_bounds` only for numeric envelope, scale, ground, displacement, or gross placement. Otherwise skip it.
- Re-capture only the reference-corresponding views required by the current gate; after local correction, only affected views.
- `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless obtainable evidence can change the decision.
- Load/use texture or animation work only when that stage is active.

## Reference and primary form

Material axis/placement/orientation/contact claims use:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

SUPPORTED is directly constrained; PROVISIONAL is a required working value with incomplete evidence; CONFLICTING means relevant views disagree; UNAVAILABLE means it cannot be observed. **A front-view match cannot certify depth.** Never average a material cross-view conflict into invented geometry; unresolved material conflict becomes `BLOCKED`.

Before exact transforms, keep a compact Primary Form Hypothesis: primary masses, relative size/placement/orientation/contact, supporting views, and material uncertainty.

Build the minimum coherent coarse whole form. Use finite `from`/`to`; non-zero rotation needs an intentional pivot/origin; explicit identities must resolve deterministically.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only. `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once primary masses are judgeable, stop primary placement and run the visual gate before secondary detail.

An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

## Difference-first visual gate

Compare corresponding reference ↔ model evidence **difference-first** for applicable silhouette, primary proportions, placement, orientation/slope, and visible contacts.

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — a critical/major mismatch is visible; name it and its supporting view.
- **UNVERIFIED** — required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in applicable supported criteria.

Front PASS is not full 3D PASS when side/depth evidence is missing or fails. Bounds, hierarchy, coordinates, validators, or successful mutation cannot justify PASS.

## Local correction

For one bounded mismatch:

1. reuse exact returned authored state when sufficient; otherwise call `inspect_element` once;
2. diagnose one cause: `TRANSLATE`, `RESIZE`, `ROTATE`, `REATTACH`, `SPLIT`, `MERGE/REMOVE`, or genuinely missing `ADD MASS`;
3. state the target UUID(s), intended change, invariant, and expected structural effect;
4. use `modify_cube` or one coherent `modify_cubes_batch`;
5. verify returned `geometry_effect`;
6. re-capture only affected view(s).

TRANSLATE preserves size; RESIZE names its fixed center/face/contact; ROTATE uses a justified pivot without rewriting size. A wrong structural effect or no effective change is not progress. If the **same causal correction direction fails twice without new evidence**, stop speculative mutation and use `BLOCKED`.

`BLOCKED` means valid continuation requires guessing, unavailable required capability/evidence, unresolved material conflict, or repeated failed work. Keep the last valid state and name what is required to continue.

## Downstream stages

Secondary geometry follows primary-form `PASS`. Production texture waits for dependent geometry to `PASS`; production animation waits for an accepted baseline and suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; required unresolved `UNVERIFIED` becomes `BLOCKED`.

Existing-asset texture/animation-only work may use current geometry as the user baseline without certifying reference accuracy. Revalidate only downstream state affected by later upstream changes.

Locator/Null Object discovery uses `list_locator_elements`; focused state uses `inspect_element`; authored create/update uses `manage_locator` / `manage_null_object`.

## Protected Native Capability Gaps

Protected gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. Preserve authored data and state the gap instead of using generic Mesh, UI automation, `risky_eval`, Hytale, or another format. **Native Bedrock PBR and per-face `material_instance` are **not** gaps.**

## Stage/tool routing

The catalog is capability, not a checklist:

```text
project unknown/absent → get_project_info or create_project as appropriate
known project state → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream stage → active texture or animation specialist
requested deliverable → export_model
```

Use `inspect_animation`, `get_texture`, resources, selection, duplication, validators, checkpoints, or current-view screenshots only when their data changes the active decision. Do not read overlapping evidence merely for confirmation.
