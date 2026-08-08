# Minecraft Bedrock Entity Modelling Workflow

Create or revise a Minecraft Bedrock **entity** model as a clean, editable Blockbench `.bbmodel`.

- Use Blockbench project format ID `bedrock`.
- This is Bedrock Entity geometry, not `bedrock_block`; do not apply Bedrock Block size limits.
- Use Cubes as the normal geometry primitive and groups as bones/organization when the asset actually needs them.
- Treat the user brief and approved visual reference as the modelling authority. Tool success, valid coordinates, connected Cubes, or a validator pass are not proof of visual resemblance.

## Normal modelling route

1. **Orient before mutating.** Use `get_project_info`, then targeted outline/search only as needed. Establish a consistent model frame: X=width, Y=height, Z=length/front-back, plus explicit `front_direction` (`+z` or `-z`) and ground relationship when relevant.
2. **Check the reference as one 3D object.** Do not average materially conflicting views. Know which view(s) support width, height, length, primary placement, and important slopes.
3. **Create a temporary Primary Form Hypothesis before exact Cube transforms.** For each primary mass, reason about its relative size, relative center/placement, important orientation, major contact, and supporting reference view(s). This is not a locked Cube plan and is not pixel calibration.
4. **Build a coarse whole-form blockout.** Every primary Cube must implement a known mass role or necessary split. Never place a Cube merely because it can touch/overlap/attach to another Cube. Derive exact `from/to/origin/rotation` from the spatial hypothesis and reference evidence rather than guessing each Cube independently.
5. **Use rotation only with evidence.** Prefer axis-aligned Cuboids when they explain the form. Rotate only when a supporting view shows a meaningful slope/orientation or required motion needs it. Do not use arbitrary multi-axis rotation to make a part look more complex or to compensate for wrong size/placement.
6. **Measure the primary envelope before visual approval.** After the coarse primary blockout, call `inspect_model_bounds`. Compare its raw width/height/length, center, footprint, and ground/min-Y facts with the approved target envelope when one exists. Matching bounds are structural evidence only and never prove resemblance.
7. **Run the primary visual gate with canonical views.** Use `capture_model_views` with the established `front_direction` and only the reference-corresponding views needed for the question. When approved numeric target bounds exist, use `framing: { mode: "explicit", min, max }` so an oversized/misplaced model cannot be hidden by auto-framing. When no numeric envelope exists, use `framing: { mode: "model" }` and make no numeric scale claim. Principal views are orthographic evidence; 3/4 views are volume/readability context.
8. **Compare reference ↔ model directly.** Judge recognizability, silhouette, major proportions, mass placement, orientation, and visible contacts from the labeled images. `capture_model_views` is an observation tool only; its successful return is not a visual `PASS`.
9. **Reject bad primary scaffolds.** If the intended object is not recognizable or several primary relationships fail together, revise/rebuild the Primary Form Hypothesis and coarse blockout. Do not preserve a bad model merely because many Cubes are already placed.
10. **Correct causes, not symptoms.** Classify the issue before editing: TRANSLATE, RESIZE, ROTATE, REATTACH, SPLIT, MERGE/REMOVE, or ADD MASS only when a visible volume is genuinely missing. Do not default to adding another Cube.
11. **Add secondary structure only after the primary form passes.** Add hierarchy, smaller geometry, and pivots only when they improve silhouette, organization, attachment, texture support, or required motion.
12. **Treat pivots as functional decisions.** A meaningful pivot must correspond to an intended rotation center, joint, attachment, or parent-transform relationship. Do not choose arbitrary/distant pivots or copy pivot values from unrelated parts. An unrotated/non-articulated Cube does not need an invented pivot rationale merely because `origin` exists in the schema.
13. **Texture after geometry.** Use texture/UV tools only after the geometry is coherent. Texture must not compensate for incorrect primary form.
14. **Animate only when requested.** Verify pivots, attachment, clipping, transform arcs, and intended motion visually.
15. **Finish with structural and visual proof.** `PASS` cannot be justified by statements such as "all Cubes are present", "everything is attached", "the tool succeeded", "rotation values are valid", or "the validator has no error". Visual approval requires fresh comparison against the reference.

## Visual review questions

At a primary gate, answer concrete questions rather than writing generic praise:

- Does the whole silhouette read as the intended object?
- Which primary mass is too large/small/long/short/wide/narrow?
- Which primary mass is misplaced relative to another?
- Which important slope/orientation is wrong?
- Which visible contact/attachment is wrong?
- Which reference/model view(s) prove the mismatch?

If the whole object is unrecognizable or multiple primary relationships are wrong together, rebuild/revise the primary hypothesis rather than micro-patching.

## Default boundaries

For normal Bedrock Entity modelling, do **not** use `risky_eval`, `trigger_action`, `fill_dialog`, `emulate_clicks`, `capture_app_screenshot`, `from_geo_json`, generic mesh/armature/PBR tooling, or Hytale tooling as shortcuts. Use those only for an explicit specialized request or a demonstrated blocker that the normal MCP surface cannot solve.

Prefer `inspect_model_bounds` + `capture_model_views` for whole-form evidence instead of arbitrary current-view screenshots. Prefer targeted reads over state dumps, coarse whole-form reasoning over per-Cube improvisation, bounded edits over patch churn, and meaningful reference/model comparisons over screenshot quotas.
