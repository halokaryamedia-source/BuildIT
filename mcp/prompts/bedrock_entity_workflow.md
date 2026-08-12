# Minecraft Bedrock Entity Workflow

Create/revise an editable Bedrock **Entity** in Blockbench. Use `bedrock`; Cubes are geometry, Groups are bones/organization. Reference is visual authority; tool/file success is not resemblance approval.

## Minimum necessary evidence

Use evidence only when it changes the decision. Do not inspect each newly placed Cube or capture after every mutation. Reuse fresh returned state. `create_project`/path `export_model` already return lifecycle state. Do not immediately call `get_project_info` unless required fields are missing or state may have changed externally. Use `inspect_model_bounds` only for envelope/scale/ground/displacement questions. Otherwise skip it. Re-capture only affected reference-corresponding views. `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless obtainable evidence can change the decision.

## Reference grounding before geometry

Reference-driven authoring requires the **actual approved reference image visible in active multimodal context**. A filename/path/manifest/text summary/prior observation/memory is not image evidence. If the actual image cannot be inspected, use `BLOCKED`; do not reconstruct it from prose or generic object knowledge.

Authority: user brief/approved target → identity/function; approved image → visible form; approved dimensions → numeric envelope. Keep a compact **Reference Evidence Map** only for material decisions:

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Claims may cover identity, mass/landmark, count/symmetry, topology/contact, orientation, negative space, or representation. No coordinates, pixel calibration, or hidden-feature invention belong here. Establish a **View Pair Map** from every used reference label to the matching canonical `capture_model_views` view; ambiguous front/back, left/right, or 3/4 pairing stays `UNVERIFIED`.

## Semantic form before geometry

Before exact `from/to/origin/rotation`, form a compact **Semantic Form Contract** linked to grounded `claim_id`s:

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

A semantic label alone never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split/relationship; **no orphan/filler Cube**. `PROVISIONAL` may support a coarse non-contradictory hypothesis but placement never verifies it.

For each primary mass classify:

```text
AXIS_ALIGNED | ROTATED | UNRESOLVED
```

`[0,0,0]` is valid only when image evidence supports/provisionally allows axis alignment and no **visible material slope** contradicts it. `ROTATED` requires explicit origin/pivot and role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` becomes `BLOCKED`, not silent axis alignment.

For every **required attachment**, identify **contact target/invariant** first. Rotating an attached mass preserves that connection; use an **attachment/joint pivot** when it owns the transform. Numeric overlap/hierarchy is not contact proof; intentional negative spaces stay open.

## Reference and primary form

**A front-view match cannot certify depth.** Never average material cross-view conflict into invented geometry; unresolved material conflict becomes `BLOCKED`.

The Semantic Form Contract says what exists/how parts relate; Primary Form Hypothesis says where/how large/how oriented. Keep relative size/placement, orientation state + supporting claim/view(s), contact invariant, uncertainty. Build the minimum coherent whole form with finite `from/to`; non-zero rotation needs intentional origin/pivot; explicit identities resolve deterministically.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only. `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once primary masses are judgeable, stop primary placement and gate before secondary detail. An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

## Difference-first visual gate

A material verdict requires the **actual approved reference image plus fresh current-revision model image(s) visible in the same comparison context**. Do not approve from a path, manifest, Reference Evidence Map, prose summary, memory, or stale model capture.

Compare claim-by-claim through the View Pair Map:

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first** for recognizability, masses/landmarks/counts, silhouette, proportions, placement, orientation/slope, topology/contact, and negative spaces.

- **FAIL** — critical/major mismatch; name claim + paired view.
- **UNVERIFIED** — actual image evidence or valid pairing is missing/ambiguous/conflicting/unavailable.
- **PASS** — fresh paired evidence shows no critical/major mismatch for the supported claim.

Front PASS is not full 3D PASS when side/depth evidence is missing or fails. Bounds, hierarchy, coordinates, validators, successful mutation, scalar similarity/IoU/projection scores, or fluent review text cannot justify PASS. A material visible slope left axis-aligned is `FAIL` unless the approved construction language intentionally requires a stepped form. After material mutation, affected model views are stale until re-captured; if the approved image is no longer actually visible, reattach/reload it or stay `UNVERIFIED/BLOCKED`.

## Local correction

For a bounded mismatch:

1. reuse fresh exact authored state already returned for that target when sufficient; otherwise call `inspect_element` once;
2. diagnose `TRANSLATE`, `RESIZE`, `ROTATE`, hierarchy REATTACH, `SPLIT`, `MERGE/REMOVE`, or genuinely missing `ADD MASS`;
3. state target UUID(s), intended change, invariant, expected structural effect;
4. use `modify_cube` or one coherent `modify_cubes_batch`;
5. verify returned `geometry_effect`;
6. re-capture only affected view(s).

TRANSLATE preserves size; RESIZE names fixed center/face/contact; ROTATE preserves `from/to/size`, uses declared pivot role, and preserves required attachment. Wrong/no structural effect is not progress. If the **same causal correction direction fails twice without new evidence**, stop speculative mutation and use `BLOCKED`.

`BLOCKED` means continuation requires guessing: approved image unavailable, invalid view pairing, unresolved semantic/reference/orientation/contact conflict, unavailable capability/evidence, or repeated failed work. Keep last valid state and name what is required.

## Downstream stages

Secondary geometry follows primary `PASS`. Production texture waits for dependent geometry to `PASS`; production animation waits for accepted baseline and suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset work may use current geometry as baseline without certifying reference accuracy.

## Locator / Null Object authored state

Locator/Null Object discovery uses `list_locator_elements`; focused state uses `inspect_element`; create/update uses `manage_locator` / `manage_null_object`.

## Protected Native Capability Gaps

Protected gaps: TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated textures, bone-binding expressions. State the gap instead of faking it with Mesh/UI automation/`risky_eval`/another format. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project as appropriate
known project state → grounded reference → semantic form + primary hypothesis → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream stage → active texture or animation specialist
requested deliverable → export_model
```

Use branch tools only when their data changes the decision; do not read overlapping evidence merely for confirmation.
