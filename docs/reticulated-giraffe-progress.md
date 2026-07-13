# Reticulated Giraffe — Handoff Status

Updated: 2026-07-13  
Branch: `Rework`  
Stage: `GEOMETRY_IN_PROGRESS` (`MAJOR_FORM_REVISION`)

## What is in place

- The approved reference package was extracted and preflighted locally. Manifest schema is `3.3`; its Reference Visual and source-image SHA-256 locks match; the Geometry contract is a 80-unit/5-block, cuboid-only, bilateral Bedrock Entity with Y=0 ground and -Z front.
- The active project was created as Bedrock Entity and identity was rebound after the Blockbench runtime UUID changed.
- The current model has 35 required hierarchy groups and 39 cuboids: body masses, four neck sections, head/muzzle/jaw, ears, four ossicone parts, mane, four upper/lower/hoof leg chains, and a three-part tail.
- Current bounds are `X -7.6..7.6`, `Y 0..80`, `Z -32..23`; all cube rotations are zero and all hoof bottoms are at Y=0.
- Current Geometry evidence and a durable in-progress checkpoint are under the ignored active workspace. The checkpoint hash is `6446033f05bd6b2231099e04d3d1a08a34b51ec74c1595ed8eb3451649a7e61c`.

## Source fixes made for the zero-start workflow

- `BEDROCK_CUBOID_GEOMETRY` now exposes `create_project`, so a new Geometry project can be built without switching profile.
- `create_project` accepts a requested save path.
- `rebind_active_project_identity` accepts a null previous UUID for first binding and records the runtime project name.
- `prepare_geometry_visual_rebuild` accepts the narrow zero-start case where deterministic Geometry evidence exists while workflow state is still `REFERENCE_READY`; it atomically advances to `GEOMETRY_IN_PROGRESS`.

Validation completed for these source changes:

```text
bun run typecheck                         PASS
bun run build                             PASS
bun test tests/geometry-session-safety.test.ts  PASS (8/8)
```

## Current blockers / issues

1. **Geometry remains materially different from the approved Reference Visual.**
   Fixed-scale analysis reports `MAJOR_FORM_REVISION`; all five required views are `REVISION_REQUIRED`. The largest gaps are the side and 3/4 silhouette, compact body mass, continuous forward-rising neck, and leg/support read. Do not submit Geometry review yet.

2. **Canonical model persistence is not yet safe across a Blockbench restart.**
   The first project disappeared after a plugin reload because `create_project` setting `save_path` did not write a `.bbmodel`. `save_project_checkpoint` currently rejects the canonical `blockbench/` output path as outside its MCP-root guard, so the only durable copy is the internal checkpoint. Resolve the output-root contract before another restart or before handing the model to a user-facing path.

3. **Attachment-aware rotation is blocked for the neck.**
   `rotate_cube_about_attachment` returned `REFERENCE_FOREGROUND_NOT_FOUND` during a neck-base rotation attempt. Keep the current zero-rotation stepped neck until the tool's reference-foreground analysis is repaired; do not use generic cube rotation as a bypass.

4. **Runtime state marked animation as not required although the manifest requires it.**
   This does not affect the current Geometry-only work, but it must be reconciled from the manifest before Animation/Final Validation.

5. **The direct Codex MCP connector was unreliable in this session.**
   The canonical endpoint `http://localhost:3000/bb-mcp` worked via direct JSON-RPC HTTP with the active write lease. Do not introduce another endpoint or port as a workaround.

## Resume path

1. Repair canonical `.bbmodel` persistence/output-root handling.
2. Reopen the active checkpoint, rebind runtime identity, and acquire a fresh Geometry lease.
3. Use the existing fixed-scale report to make bounded changes only to the diagnosed silhouette regions.
4. Regenerate all five required Geometry views and fixed-scale analysis.
5. Submit only after the Geometry gate passes; then stop at `GEOMETRY_REVIEW` for user approval.
