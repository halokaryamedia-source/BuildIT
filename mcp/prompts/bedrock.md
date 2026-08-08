# Minecraft Bedrock Entity Modelling Workflow

Create or revise a Minecraft Bedrock **entity** model as a clean, editable Blockbench `.bbmodel`.

- Use Blockbench project format ID `bedrock`.
- This is Bedrock Entity geometry, not `bedrock_block`; do not apply Bedrock Block size limits.
- Use Cubes as the normal geometry primitive and groups as bones/organization when the asset actually needs them.
- Treat the user brief and approved visual reference as the modelling authority. Tool success, valid coordinates, or a validator pass are not proof of visual resemblance.

## Normal modelling route

1. **Orient before mutating.** Use `get_project_info`, then `list_outline` or `find_elements_by_criteria` only as needed. Use `create_project` only when a new Bedrock Entity project is actually required.
2. **Interpret the whole form.** Identify the primary masses, silhouette, major proportions, orientation, and important contacts before polishing individual Cubes.
3. **Build the primary form.** Use `place_cube` in bounded useful batches and `modify_cube` for targeted corrections. Create only the minimum grouping needed for safe construction; do not build a complete hierarchy first unless the asset or required animation makes it necessary.
4. **Run a meaningful visual gate.** Use `capture_screenshot` at whole-form checkpoints, not after every Cube. Inspect the few views needed to judge silhouette, major proportions, orientation, mass placement, and visible contacts.
5. **Correct causes, not symptoms.** If the global form is wrong, modify the responsible primary masses. Do not hide a proportion/contact error by adding decorative Cubes. Use `undo` when a correction direction is wrong.
6. **Add secondary structure only after the primary form reads correctly.** Add hierarchy, pivots, and smaller geometry only when they improve silhouette, organization, attachment, texture support, or required motion.
7. **Texture after geometry.** Use texture/UV tools only after the geometry is coherent. Texture must not compensate for incorrect primary form.
8. **Animate only when requested.** Use the core animation tools only for required motion, then verify pivots, attachment, clipping, and the intended pose/motion visually.
9. **Finish with structural and visual proof.** Use Blockbench validator information for structural diagnostics when useful, fresh screenshots for visual claims, and the current verified save workflow for the final `.bbmodel`.

## Default boundaries

For normal Bedrock Entity modelling, do **not** use `risky_eval`, `trigger_action`, `fill_dialog`, `emulate_clicks`, `capture_app_screenshot`, `from_geo_json`, generic mesh/armature/PBR tooling, or Hytale tooling as shortcuts. Use those only for an explicit specialized request or a demonstrated blocker that the normal MCP surface cannot solve.

Prefer targeted reads over state dumps, bounded edits over per-Cube ceremony, and meaningful visual checkpoints over screenshot quotas.