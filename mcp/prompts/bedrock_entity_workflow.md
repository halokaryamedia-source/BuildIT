# Minecraft Bedrock Entity Workflow

Create or revise a clean, editable Minecraft Bedrock **Entity** model in Blockbench.

## Product boundary

Use format `bedrock`. Cubes are the normal geometry primitive and Groups are bones/organization when needed. The approved brief/reference is the modelling authority; tool success, coordinates, connectivity, or validator success are not visual proof. Preserve native Bedrock capability and never fake unsupported native features with generic Mesh, UI automation, risky evaluation, or another format.

## Minimum necessary evidence

Keep validity strict and calls sparse. Use a tool, inspection, capture, resource, or specialist only when its result can change the next modelling decision or prove an in-scope completion claim.

- Do not inspect each newly placed Cube or capture after every mutation.
- Do not re-read project/outline/resource state already known unless it may have changed.
- Use `inspect_model_bounds` only for numeric envelope, scale, ground, displacement, or gross-placement questions. Otherwise skip it.
- Capture only reference-corresponding views needed for the current gate; after a local correction, re-capture only affected view(s).
- `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless the missing evidence can change the next decision and is plausibly obtainable.
- Load texture or animation specialist instructions only when that stage is reached.

## Reference and primary form

Orient before mutation. For an existing or uncertain project, use `get_project_info` and targeted discovery only as needed. Establish X=width, Y=height, Z=front/back length, `front_direction` when relevant, and ground relationship when it matters.

Treat the reference as one 3D object. Keep material 3D claims in the smallest useful state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

SUPPORTED is directly constrained; PROVISIONAL is a needed working value; CONFLICTING means relevant views disagree; UNAVAILABLE means the claim cannot be observed. Do not transfer confidence between axes. A front-view match cannot certify depth. Never average material conflicts into invented geometry; unresolved primary-form conflict becomes `BLOCKED`. Before exact transforms, keep a compact Primary Form Hypothesis covering primary masses, relative placement/orientation/contact, and material uncertainty only.

## Build and primary gate

Build the coarse whole form from that hypothesis. Each primary Cube must represent a required primary mass or necessary split. Use explicit finite `from`/`to`; rotated Cubes require an intentional pivot/origin. Explicit Group or Texture references must resolve deterministically before mutation.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call is **execution** evidence only. Mutation results use `visual_verdict: not_evaluated`; authored state being applied is not reference approval. Do not chain Cube placement based on previous tool success. Once primary masses are represented well enough to judge, **stop** primary placement and run the visual gate before secondary detail.

An under-constrained extent remains a working hypothesis, not verified reference evidence, even after successful placement.

Use rotation only when the form or required motion justifies it. Non-zero Cube rotation needs an intentional pivot; do not use rotation to hide wrong size/placement. Purely organizational Groups should keep neutral pivot/rotation unless a joint, attachment, or transform reason requires otherwise.

If numeric target dimensions exist or scale/ground/gross placement is in doubt, use `inspect_model_bounds`; otherwise skip it. Bounds are structural evidence only.

Use `capture_model_views` for the minimum corresponding canonical views needed to judge the current question. Use explicit framing only when an approved numeric target envelope exists. The capture tool observes; it does not compare, score, or approve.

## Difference-first visual verdict

At each material visual gate, compare reference ↔ model **difference-first**. Check applicable silhouette, primary proportions, mass placement, orientation/slope, and visible contacts before praising the result.

The verdict is exactly one of:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL**: a critical/major mismatch is visible. Name the mismatch and supporting view(s).
- **UNVERIFIED**: evidence required for the claim is missing, ambiguous, conflicting, or unavailable.
- **PASS**: fresh corresponding model/reference evidence shows no critical/major mismatch in the applicable criteria.

A convincing front view is not a full 3D PASS when side/depth evidence is missing or fails. Missing evidence never becomes PASS by plausibility.

If several primary relationships fail together or the object is not recognizable, revise/rebuild the primary hypothesis instead of micro-patching a bad scaffold.

## Local correction accuracy

For a local mismatch on an otherwise sound form:

1. Locate the exact target UUID only if needed.
2. `inspect_element` before numeric correction and use the authored state it returns.
3. Diagnose one causal class: `TRANSLATE`, `RESIZE`, `ROTATE`, hierarchy `REATTACH`, `SPLIT`, `MERGE/REMOVE`, or `ADD MASS` only when a required visible volume is genuinely missing.
4. Declare the invariant and expected structural effect before mutation.
5. Use `modify_cube` for one target or `modify_cubes_batch` for one coherent multi-Cube cause.
6. Check returned `geometry_effect` before visual re-observation.
7. Re-capture only affected view(s).

Common invariants:

- `TRANSLATE` → size stays fixed; center moves intentionally.
- `RESIZE` → name the changed axis and the anchor/center/contact that stays fixed.
- `ROTATE` → do not rewrite size just to change angle; use a justified pivot.
- hierarchy REATTACH → if no supported direct reparent owner exists, use `BLOCKED`; never fake hierarchy with coordinate movement.

A structurally wrong effect or no effective geometry/visibility change is not correction progress, even when the tool call succeeds.

If the same causal correction direction fails twice without new evidence, stop speculative mutation and use `BLOCKED` or revise the hypothesis when new evidence actually exists.

## BLOCKED is a workflow outcome

`FAIL / UNVERIFIED / PASS` describe visual evidence; `BLOCKED` means valid continuation would require guessing or repeated failed work. Use it for unresolved material view conflict, required observation still unavailable after one useful retry, repeated same-cause correction failure, unavailable required capability, or any attempt to present provisional geometry as verified. Report the concrete blocker/evidence, affected claim, bounded attempts, and exact evidence/decision/capability needed; do not keep changing coordinates to avoid the blocker.

## Secondary geometry, texture, and animation

Secondary geometry follows primary-form `PASS`. For end-to-end work, **production** texture waits for the geometry it depends on to `PASS`; **production** animation waits for an accepted geometry baseline and suitable participating hierarchy/pivots. `FAIL` returns upstream and a required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset texture/animation-only work may use current geometry as a user baseline without certifying it. After material geometry/hierarchy/pivot changes, revalidate only affected downstream work; sunk cost never preserves rejected geometry.

## Locator / Null Object authored state

Use `list_locator_elements` for discovery and `inspect_element` for focused state. `manage_locator` owns supported native Locator fields; `manage_null_object` owns the supported Null Object parent/position slice. Rename/delete through `rename_element` / `remove_element`; never substitute arbitrary Cubes or UI automation.

## Protected Native Capability Gaps

Protected gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. If no direct owner exists, preserve authored data, state the gap, and stay within supported operations; `nodes://` is observability, not authored native support. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Export boundary

Normal BlockIT model outputs are:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Bedrock animation/controller files belong to the separate Bedrock AnimationCodec surface; do not substitute arbitrary OBJ/glTF/model codecs.

## Tool and resource routing

The catalog is capability, not a checklist. Stay in the smallest active lane:

```text
get_project_info → place_cube/Group build → capture_model_views
→ inspect_element + modify_cube only on diagnosed mismatch
→ downstream specialist only after prerequisite gate
→ export_model only when requested
```

Use Resources for browsing/context when their URI data answers the question. Use focused read-only Tools such as `inspect_element`, `inspect_animation`, or `get_texture` when a modelling decision needs exact authored state or image data. Do not read a Resource and then call an overlapping inspection Tool merely for confirmation.

Selection is for real selection workflows, duplication only for supported repetition/symmetry, validators for structural diagnostics, and checkpoints only when rollback value is meaningful. Do not use `risky_eval`, generic UI automation, generic Mesh/Hytale tooling, or another format as shortcuts.
