# Minecraft Bedrock Entity Modelling Workflow

Create or revise a Minecraft Bedrock **entity** model as a clean, editable Blockbench `.bbmodel`.

- Use Blockbench project format ID `bedrock`.
- This is Bedrock Entity geometry, not `bedrock_block`; do not apply Bedrock Block size limits.
- Use Cubes as the normal geometry primitive and groups as bones/organization when the asset actually needs them.
- Treat the user brief and approved visual reference as the modelling authority. Tool success, valid coordinates, connected Cubes, or a validator pass are not proof of visual resemblance.

## Normal modelling route

1. **Orient before mutating.** Use `get_project_info`, then targeted outline/search only as needed. Establish a consistent model frame: X=width, Y=height, Z=length/front-back, plus explicit `front_direction` (`+z` or `-z`) and ground relationship when relevant.
2. **Check the reference as one 3D object.** Do not average materially conflicting views. Know which view(s) support width, height, length, primary placement, and important slopes.
### Cross-view axis evidence contract

Before turning primary masses into exact 3D extents, distinguish reference-backed facts from working guesses. For each material width/height/depth, primary placement, orientation/slope, or visible contact claim, keep a small working status:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- **SUPPORTED** — relevant view(s) directly constrain the claim.
- **PROVISIONAL** — a temporary value is necessary to build, but evidence is incomplete.
- **CONFLICTING** — relevant views materially disagree.
- **UNAVAILABLE** — the package cannot show the claim well enough to judge it.

Do not transfer confidence between axes. A front-view match cannot certify depth; a 3/4 impression cannot override clearer orthographic evidence. Provisional values remain hypotheses after successful Cube placement. Conflicting primary-form evidence must not be averaged into a compromise; if the active brief/user intent cannot resolve it, stop as `BLOCKED` rather than hallucinating a solution.

3. **Create a temporary Primary Form Hypothesis before exact Cube transforms.** For each primary mass, reason about its relative size, relative center/placement, important orientation, major contact, and supporting reference view(s). This is not a locked Cube plan and is not pixel calibration.
4. **Build a coarse whole-form blockout.** Every primary Cube must implement a known mass role or necessary split. Before calling `place_cube`, choose explicit finite `from` and `to` extents from the spatial hypothesis; the tool does not supply a default Cube when geometry was not decided. Never place a Cube merely because it can touch/overlap/attach to another Cube. Derive exact `from/to/origin/rotation` from the spatial hypothesis and reference evidence rather than guessing each Cube independently. If a Cube is intentionally placed under a specific Group/bone, first locate the exact Group UUID and pass that target explicitly; omit `group` (or use `root`) only when root placement is actually intended. Do not guess a group name and rely on fallback placement.
### Placement result boundary

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call means only that Blockbench applied the authored mutation. Cube mutation results report `visual_verdict: not_evaluated`; never reinterpret that execution success as reference fidelity, geometric correctness, or progress toward PASS.

Do not chain Cube placement based on previous tool success. Each next primary Cube must represent a still-required primary mass/necessary split from the current Primary Form Hypothesis. Once those primary masses are represented well enough to judge the whole form, stop placing geometry and run the primary visual gate before adding secondary/detail Cubes.

A provisional extent chosen for an under-constrained axis is a working hypothesis, not verified reference evidence. If the available reference cannot validate that axis, keep the claim UNVERIFIED even when the Cube was placed successfully.

5. **Use rotation only with evidence and an intentional pivot.** Prefer axis-aligned Cuboids when they explain the form. An unrotated Cube does not need pivot ceremony and may use the neutral origin default. If a newly placed Cube has any non-zero rotation, `place_cube` requires an explicit `origin`; choose that pivot from a visible slope/attachment/rotation-center reason rather than allowing an omitted pivot to become `[0,0,0]`. When an existing Cube is currently unrotated and a correction activates its non-zero rotation, inspect that Cube and send the intended `origin` explicitly in the same `modify_cube` / `modify_cubes_batch` update. Once a Cube is already rotated, later angle adjustments may reuse its inspected existing pivot without restating `origin`. Do not use arbitrary multi-axis rotation, copied pivots, or rotation to compensate for wrong size/placement.
6. **Measure the primary envelope before visual approval.** After the coarse primary blockout, call `inspect_model_bounds`. Compare its raw width/height/length, center, footprint, and ground/min-Y facts with the approved target envelope when one exists. Matching bounds are structural evidence only and never prove resemblance.
7. **Run the primary visual gate with canonical views.** Use `capture_model_views` with the established `front_direction` and only the reference-corresponding views needed for the question. When approved numeric target bounds exist, use `framing: { mode: "explicit", min, max }` so an oversized/misplaced model cannot be hidden by auto-framing. When no numeric envelope exists, use `framing: { mode: "model" }` and make no numeric scale claim. Principal views are orthographic evidence; 3/4 views are volume/readability context.
8. **Compare reference ↔ model directly.** Judge recognizability, silhouette, major proportions, mass placement, orientation, and visible contacts from the labeled images. `capture_model_views` is an observation tool only; its successful return is not a visual `PASS`.
9. **Reject bad primary scaffolds.** If the intended object is not recognizable or several primary relationships fail together, revise/rebuild the Primary Form Hypothesis and coarse blockout. Do not preserve a bad model merely because many Cubes are already placed.
10. **Inspect before a local numeric correction.** When the whole form is sound but a specific Cube/group relationship is wrong, locate the exact target UUID with `list_outline` or `find_elements_by_criteria` if needed, then call `inspect_element`. Use its authored `from/to/size/origin/rotation/parent` facts as the current state. Do not guess the target's existing transforms from memory or from the screenshot.
11. **Correct causes, not symptoms.** Classify the issue before editing: TRANSLATE, RESIZE, ROTATE, REATTACH, SPLIT, MERGE/REMOVE, or ADD MASS only when a visible volume is genuinely missing. Derive the correction from the diagnosed visual mismatch plus the inspected authored state; do not default to adding another Cube.
12. **Keep one causal correction coherent.** If one diagnosed correction changes only one Cube, use `modify_cube` with the exact UUID confirmed by `inspect_element`; do not rely on selection or a possibly duplicated name. If the same primary relationship requires different updates to several known Cube UUIDs, use `modify_cubes_batch` so the heterogeneous changes happen as one recoverable Undo unit. Do not put unrelated cleanup or speculative edits into the same batch. `modify_cubes_batch` is an execution tool, not permission to invent extra corrections.
### Correction accuracy contract

When a local mismatch is diagnosed, `inspect_element` first and derive the mutation from exact authored state. Before editing, identify the causal class, target UUID(s), the invariant that must stay unchanged, and the expected structural effect.

Common invariants:

- TRANSLATE -> preserve size; move center intentionally.
- RESIZE -> name the changed axis and the evidence-backed anchor/center/contact that stays fixed.
- ROTATE -> do not rewrite from/to/size merely to change angle; use an inspected/justified pivot.
- hierarchy REATTACH -> if no direct supported reparent owner is exposed, `BLOCKED`; never fake parent correction with coordinate movement.

`modify_cube` / `modify_cubes_batch` return before/after authored state plus `geometry_effect`. Validate `changed_fields`, center/size/origin/rotation deltas, and visibility effect against the correction invariant before visual re-observation. A structurally wrong effect is a failed correction even if the tool call succeeded. A requested geometry correction with no effective geometry/visibility change is not progress.

13. **Re-observe after correction.** After a material single- or multi-Cube correction, capture only the affected canonical views needed to test the diagnosis. If the same correction direction fails twice without new evidence, stop patching and revise the hypothesis instead.
14. **Add secondary structure only after the primary form passes.** Add hierarchy, smaller geometry, and pivots only when they improve silhouette, organization, attachment, texture support, or required motion. For a purely organizational/non-articulated Group, use `add_group` with neutral origin/rotation defaults rather than inventing pivot/angle values. When a specific parent is required, locate and pass its exact Group UUID; root must be intentional.
15. **Treat pivots as functional decisions.** A meaningful pivot must correspond to an intended rotation center, joint, attachment, or parent-transform relationship. For a Cube whose geometry is already correct and only the pivot is wrong, inspect the exact Cube and change `origin` **without** `from`, `to`, or `rotation`; `modify_cube` / `modify_cubes_batch` then use Blockbench `Cube.transferOrigin` semantics so the visual Cube position is preserved. If the correction intentionally changes Cube geometry/rotation and pivot together, send `origin` together with the actual `from`/`to`/`rotation` changes so it is treated as one authored transform rewrite. Do not use pivot-only correction to move geometry. Before changing an existing Group pivot, inspect that exact Group state and identify the transform reason. Then use `bone_rigging(action="set_pivot")` with the exact Group UUID and an explicit evidence-backed `origin`; do not call set_pivot without a known joint/attachment purpose. The runtime uses Blockbench pivot-transfer behavior so moving a Group pivot does not intentionally drag the Group's visual contents. Do not choose arbitrary/distant pivots or copy pivot values from unrelated parts. Initial Group rotation should remain neutral unless a visible/form/motion reason justifies it.
### Downstream readiness gate

For an end-to-end reference-driven asset, do not start **production** texture/UV/PBR/material work until complete geometry review is `PASS` for the surfaces it depends on, and do not start **production** animation until the required geometry baseline is accepted and participating hierarchy/pivots are inspected and suitable. A material `FAIL` returns to modelling; a required `UNVERIFIED` claim must be resolved or become `BLOCKED`, not hidden by surface detail or motion.

For a texture-only or animation-only task on an existing asset, current geometry may be treated as the user-provided baseline when remodelling is outside scope. This does not certify geometry fidelity. A placeholder texture or small diagnostic pose/playback is allowed only as a provisional observation/rig aid and is not downstream completion progress.

After material geometry/hierarchy/pivot changes, revalidate affected downstream work before completion: texture/UV/material assumptions on changed surfaces, and animation/keyframe/attachment/motion assumptions on changed bones/pivots. Downstream sunk cost never authorizes keeping geometry that the geometry gate rejects.

16. **Texture after geometry.** Use texture/UV tools only after the geometry is coherent. Texture must not compensate for incorrect primary form.
17. **Animate only when requested.** Verify pivots, attachment, clipping, transform arcs, and intended motion visually. Bone/parent/child targets should use confirmed UUIDs; do not rely on ambiguous names or implicit mirror/parent defaults.
18. **Finish with structural and visual proof.** `PASS` cannot be justified by statements such as "all Cubes are present", "everything is attached", "the tool succeeded", "rotation values are valid", or "the validator has no error". Visual approval requires fresh comparison against the reference.

## Visual review questions

At a primary gate, answer concrete questions rather than writing generic praise:

- Does the whole silhouette read as the intended object?
- Which primary mass is too large/small/long/short/wide/narrow?
- Which primary mass is misplaced relative to another?
- Which important slope/orientation is wrong?
- Which visible contact/attachment is wrong?
- Which reference/model view(s) prove the mismatch?

If the whole object is unrecognizable or multiple primary relationships are wrong together, rebuild/revise the primary hypothesis rather than micro-patching.

## Reference Fidelity Verdict

At every material visual gate, perform a **difference-first** reference ↔ model review before approval. Do not start from "does it look good?"; first search for concrete mismatch.

The verdict must be exactly one of:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — a critical or major mismatch is visible. State the mismatch, severity, and supporting reference/model view(s).
- **UNVERIFIED** — evidence needed for the claim is missing, ambiguous, conflicting, or unavailable. Missing evidence is not permission to guess.
- **PASS** — only when fresh corresponding model views were directly compared with the available reference views, applicable silhouette/proportion/placement/orientation/contact criteria were checked, and no critical or major mismatch was found.

For each relevant paired view, report material differences before the verdict. When the reference provides multiple views, use the views that constrain the claimed 3D axes. A model matching only the front view is not a full 3D PASS if depth/side evidence is missing or fails.

## Blocker / Non-Looping Completion Contract

`FAIL / UNVERIFIED / PASS` describe visual evidence. `BLOCKED` is separate: it describes a workflow that cannot validly continue with the current evidence/capability.

Use `BLOCKED` and stop speculative mutation when:

- material cross-view conflict cannot be resolved from the active brief/user intent;
- required observation evidence remains unavailable after one controlled retry when useful;
- the same causal correction direction fails twice without new evidence;
- a required supported MCP/runtime capability is unavailable;
- continuing would require presenting a provisional/unsupported geometry claim as verified.

A blocker report must state: blocker category, concrete evidence, affected claim/result, bounded attempts already made, and the exact new evidence/user decision/capability needed to continue. Do not keep changing coordinates merely to avoid reporting a blocker, and do not label unresolved work as fixed or successful.

## Locator / Null Object authored state

Use `list_locator_elements` to discover Locator and Null Object identities, then `inspect_element` for focused authored state.

- `manage_locator` creates/updates native Bedrock Locator parent, position, rotation, and `ignore_inherited_scale` under an explicit Group/bone.
- `manage_null_object` creates/updates the Null Object base parent/position state used by the Bedrock workflow.
- Use `rename_element` / `remove_element` for rename/delete rather than duplicating those operations in Locator tools.
- Null Object `ik_target`, `ik_source`, and `lock_ik_target_rotation` are inspectable but not mutation inputs in the minimum Locator slice. They are Blockbench editor/animation state, while Bedrock geometry round-trips the Null Object through a `_null_` locator entry.
- Do not use generic Mesh, arbitrary Cubes, or UI automation as a replacement for Locator/Null Object authored state.

## Protected Native Capability Gaps

BlockIT preserves the Minecraft Bedrock Entity product boundary even when a native capability does not yet have a direct MCP authoring/inspection owner. Current protected examples include TextureMesh authoring, native visible bounding-box fields, animation controllers, sound/timeline animation effects, animated-texture authoring, and bone-binding expressions.

When the user asks for one of these native capabilities and the current exposed MCP surface has no direct owner:

- **do not emulate it with generic Mesh, arbitrary Cubes, UI clicks, code evaluation, or a different format;**
- do not claim that a broad runtime resource such as `nodes://` is equivalent to authored native support;
- preserve existing authored data when opening/re-exporting a project unless a proven tool intentionally edits it;
- state the capability gap explicitly and keep the task bounded to supported operations;
- treat the gap as implementation work to audit against official Blockbench Bedrock source, not as permission to remove the capability from BlockIT.

Native Bedrock PBR and per-face `material_instance` are **not** gaps: use the dedicated texture/material and material-instance tools when the task requires them.

## Export Boundary

For normal BlockIT model deliverables, `export_model` intentionally supports only:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Bedrock animation/controller files belong to Blockbench's separate Bedrock AnimationCodec surface. Do not substitute arbitrary OBJ/glTF/model codecs for a Bedrock Entity deliverable.

## Stage-Gated Tool Routing

The exposed MCP catalog is capability, not a checklist. For normal reference-driven geometry, prefer this lane and do not branch without a concrete stage/intent:

```text
get_project_info / create_project
list_outline / find_elements_by_criteria
place_cube / add_group
inspect_model_bounds / capture_model_views
inspect_element -> modify_cube / modify_cubes_batch
remove_element only for a diagnosed MERGE/REMOVE
undo / save_checkpoint only when recovery value is real
export_model only for a requested deliverable/artifact
```

Branch rules:

- texture/UV/Paint/PBR/material-instance tools only when geometry has reached the appropriate gate and the surface task is active;
- animation tools only when requested and required hierarchy/pivots are coherent;
- Locator/Null Object tools only for a concrete native attachment/effect-point need;
- selection tools only when current editor selection is genuinely required by the active workflow, never as geometry identity;
- `duplicate_element` only after repetition/symmetry is already supported, never to invent primary form;
- `capture_screenshot` only when the current editor view itself answers a question canonical `capture_model_views` cannot;
- validator output is structural diagnostics and never resemblance approval;
- export is not a validation step.

Do **not** use `risky_eval`, `trigger_action`, `fill_dialog`, `emulate_clicks`, `capture_app_screenshot`, `from_geo_json`, generic mesh/armature tooling, or Hytale tooling as shortcuts. Native Bedrock PBR/material-instance workflows remain valid when the asset actually requires them.

Prefer `inspect_model_bounds` + `capture_model_views` for whole-form evidence, `inspect_element` for a diagnosed local target, exact UUIDs for normal mutation/hierarchy targets, and `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs. If primary geometry is still FAIL/UNVERIFIED, do not switch domains merely to make the asset look more complete.
