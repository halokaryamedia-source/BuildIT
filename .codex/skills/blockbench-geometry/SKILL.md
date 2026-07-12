---
name: blockbench-geometry
description: "Visual-grounded Bedrock cuboid Geometry in one MCP profile and session, routed through a single Terra writer with Sol used only for necessary visual judgment."
---

# Blockbench Geometry

Use only for stage `GEOMETRY` with profile `BEDROCK_CUBOID_GEOMETRY`.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles or user-facing stages.

## Agent roles

- `mcp_builder` / Terra Medium is the only Geometry writer and lease owner.
- `visual_director` / Sol Medium is read-only and is used for initial Reference interpretation, ambiguous cross-view decisions, subjective feedback, and final visual acceptance.
- `routine_auditor` / 5.4 Mini Low handles deterministic evidence, hash, profile, test, and checkpoint checks.
- `critical_reviewer` / Sol High is read-only, rare, and requires a valid critical reason code.

Do not use Sol for a repair already expressed as a concrete part, direction, and magnitude. Never run parallel Geometry writers or effort above High.

## Normal flow

```text
get_stage_context
→ rebind_active_project_identity when required
→ mcp_builder acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ mcp_builder edits diagnosed parts
→ final five-view capture and diagnosis
→ visual_director performs final visual acceptance
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

Follow `next_safe_operation`. Do not ask the user to edit workspace JSON, choose checkpoint names, switch Geometry profiles, close the model, reconnect between Geometry revisions, or choose a worker model.

## Identity

When runtime UUID differs from stored metadata, call `rebind_active_project_identity` before acquiring the lease. Use the current UUID, state revision, Geometry fingerprint, and Reference Visual SHA-256. The tool updates metadata only and stays in the same session.

## Visual authority

Use `inspect_reference_visual_preview`; never request the original multi-megabyte image in normal production.

Geometry quality requires:

1. visual inspection of actual image payloads;
2. fixed-scale `analyze_geometry_views` diagnosis;
3. `validate_geometry_contract` structural validation.

Free-rescaling is forbidden. A structural pass alone is not a visual pass.

## Revision flow

`prepare_geometry_visual_rebuild` is the compatibility name for preparing either `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` in the current Geometry profile.

It accepts current revision authority from either:

- fixed-scale metrics with `REVISION_REQUIRED`; or
- `record_geometry_visual_decision` with `REVISION_REQUIRED`, including explicit user feedback.

Both must match the current project UUID, Geometry fingerprint, Reference Visual SHA-256, and freshness checks.

For feedback received during `GEOMETRY_REVIEW`:

1. capture and inspect affected views;
2. run `analyze_geometry_views`;
3. when metrics fail and the repair is concrete, route directly to `mcp_builder`;
4. when metrics pass but the user still requests a change, use `visual_director` to produce a current multimodal `REVISION_REQUIRED` packet with issue, views, and scope;
5. call `prepare_geometry_visual_rebuild`;
6. edit only after it returns `GEOMETRY_IN_PROGRESS`.

The preparation tool preserves checkpoints and primary masses, keeps detail by default, and permits broad detail removal only for an explicit major revision. No profile switch or reconnect is required.

Generic validation, including Geometry issues found during Final Validation, must route to `BEDROCK_CUBOID_GEOMETRY`; use the analyzer to classify the internal scope.

## Mutation

Use:

- `place_cubes_safe` for unrotated placement;
- `modify_cubes` for unrotated edits;
- `rotate_cube_about_attachment` for every non-zero rotation.

Rotation must validate pivot, axis, direction, connection, and affected-view score. Modify only diagnosed parts.

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are progress markers, not user gates.

## Submit for review

After current five-view evidence and multimodal decision are ready, call `submit_geometry_for_review`.

The tool runs fresh Geometry validation with its embedded readiness gate, creates the next unused non-approved review checkpoint, advances state and lease revision together, and changes workflow state to `GEOMETRY_REVIEW` without reconnecting.

Final Geometry requires current five-view evidence, matching fingerprint and Reference Visual hash, fixed-scale PASS, structural PASS, safe rotations, and read-only visual acceptance.
