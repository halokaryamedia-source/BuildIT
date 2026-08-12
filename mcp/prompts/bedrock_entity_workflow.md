# Minecraft Bedrock Entity Workflow

Create/revise an editable Bedrock **Entity**. Cubes are geometry; Groups are bones/organization. Tool/file success is execution evidence, not resemblance approval.

## Minimum necessary evidence

**Do not inspect each newly placed Cube or capture after every mutation.** Reuse fresh returned state. `create_project`/path `export_model` return lifecycle state; **Do not immediately call `get_project_info`** unless required fields are missing/external state changed. Use `inspect_model_bounds` only for envelope/scale/ground/displacement; **Otherwise skip it**. Re-capture only affected paired views. **Do not spend additional calls trying to remove UNVERIFIED** unless obtainable evidence changes the decision.

## Actual reference grounding

Reference-driven authoring requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/text summary/prior observation/memory **is not image evidence**. If unavailable, `BLOCKED`; never reconstruct form from prose/generic object knowledge.

```text
user brief/target → identity/function
approved image → visible form
approved dimensions → numeric envelope
Reference Evidence Map → derived index only
```

Ground material claims only:

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

No coordinates, pixel calibration, hidden-feature invention. Build a **View Pair Map** from reference labels to matching canonical `capture_model_views` views. Ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`; unlike views cannot approve each other.

## Semantic form before coordinates

Before exact `from/to/origin/rotation`, form a **Semantic Form Contract** linked to grounded `claim_id`s:

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

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split/relationship; **no orphan/filler Cube**. `PROVISIONAL` may support a coarse non-contradictory hypothesis; placement never verifies it.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. `[0,0,0]` needs image support. A **visible material slope** requires `ROTATED` plus explicit origin/pivot and role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, identify **contact target/invariant** first. Rotation preserves it; use an **attachment/joint pivot** when that owns the transform. Numeric overlap/hierarchy is not contact proof; negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Never average material cross-view conflict into invented geometry; unresolved material conflict → `BLOCKED`.

Semantic Form says what exists/how parts relate. Primary Form Hypothesis says where/how large/how oriented; keep relative size/placement, orientation + supporting claim/view(s), contact invariant, uncertainty.

Build minimum coherent form with finite `from/to`; non-zero rotation needs intentional pivot/origin; identities resolve deterministically. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only; `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once judgeable, stop before secondary detail. An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

## Difference-first visual gate

Material verdict requires **actual approved reference image plus fresh current-revision model image(s) visible in the same comparison context**. Path/manifest/map/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**: recognizability, masses/landmarks/counts, silhouette/proportion, placement, orientation/slope, topology/contact, negative spaces.

`FAIL` = critical/major mismatch; name claim + paired view. `UNVERIFIED` = image evidence/pairing missing, ambiguous, conflicting, unavailable. `PASS` = fresh paired evidence shows no critical/major mismatch for supported claim.

Front PASS is not full 3D PASS when side/depth evidence is missing/fails. Bounds, hierarchy, coordinates, validators, tool success, similarity/IoU/projection scores, or fluent review text cannot justify PASS. Visible material slope left axis-aligned is `FAIL` unless intentionally stepped. After material mutation, affected model views are **stale** until re-captured; if approved image is no longer visible, reload it or stay `UNVERIFIED/BLOCKED`.

## Local correction

1. **Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once.
2. Diagnose `TRANSLATE`, `RESIZE`, `ROTATE`, **hierarchy REATTACH**, `SPLIT`, `MERGE/REMOVE`, or grounded `ADD MASS`.
3. State target UUID(s), intended change, invariant, expected structural effect.
4. `modify_cube` or coherent `modify_cubes_batch`; verify `geometry_effect`.
5. Re-capture affected paired view(s).

TRANSLATE preserves size; RESIZE names fixed center/face/contact; ROTATE preserves `from/to/size`, declared pivot role, required attachment. Wrong/no structural effect is not progress. If the **same causal correction direction fails twice without new evidence**, stop speculative mutation and use `BLOCKED`.

Wrong decomposition → Semantic Form; wrong whole spatial relation → Primary Form Hypothesis. `BLOCKED` means reference/pairing/evidence/capability is missing/conflicting or correction stopped converging.

## Downstream stages

Secondary geometry follows primary `PASS`. Production texture waits for dependent **geometry** to `PASS`; production animation waits for accepted baseline and suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset work may use current geometry as baseline without certifying reference accuracy.

## Locator / Null Object authored state

Locator/Null Object discovery uses `list_locator_elements`; focused state uses `inspect_element`; create/update uses `manage_locator` / `manage_null_object`.

## Protected Native Capability Gaps

TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated textures, bone-binding expressions remain gaps. Do not fake them with Mesh/UI automation/`risky_eval`/another format. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project as appropriate
known project → grounded reference → Semantic Form + Primary Form → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream stage → active texture or animation specialist
requested deliverable → export_model
```

Use branch tools only when their data changes the decision; do not read overlapping evidence for confirmation.
