---
name: blockbench-geometry
description: "Visual-grounded Bedrock Geometry using one selected Terra writer, inspection-only Sol judgment, and transformed-world evidence freshness."
---

# Blockbench Geometry

Use only for stage `GEOMETRY` with profile `BEDROCK_CUBOID_GEOMETRY`. `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles or user gates.

## Writer and advisors

Select exactly one writer:

- default Terra Medium parent writes directly; or
- `mcp_builder` becomes fallback writer when the parent differs or isolation is safer.

Never use both concurrently. `visual_director` is Sol Medium with inspection-only MCP tools. Mini and Sol High have no Blockbench MCP access. High is rare and is the maximum effort.

## Flow

```text
get_stage_context
→ rebind_active_project_identity when required
→ selected writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded edits of diagnosed parts
→ final five-view capture/analyze
→ visual_director final acceptance
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ GEOMETRY_REVIEW
```

Do not ask the user to edit JSON, choose checkpoints/workers/profiles, reopen the model, or reconnect inside Geometry.

## Visual authority and freshness

Use `inspect_reference_visual_preview`; never return the original multi-megabyte image. Geometry quality requires actual image inspection, fixed-scale analyzer output, and structural validation. Free-rescaling is forbidden.

`analyze_geometry_views` persists canonical metrics and diff; it requires the active Geometry lease. Ephemeral visual capture without `output_dir` may be used by `visual_director`.

Evidence is current only when all match:

- project UUID;
- compatibility cube-local fingerprint;
- transformed world-space signature, including group transforms/hierarchy and mesh structure;
- Reference Visual SHA-256;
- current views, analyzer, visual decision, and rotation audit.

After cube, hierarchy, group-transform, visibility, or mesh changes, rerun capture/analyze before decision, revision preparation, review, or approval.

## Diagnosis and revision

Analyzer output must identify failing view/region, parts, direction, magnitude when measurable, and revision scope. When a repair is concrete, Terra handles it directly. Use Sol only for conflicting views, unclear visual root cause, subjective user feedback, or final acceptance.

`prepare_geometry_visual_rebuild` prepares either internal revision scope in the same profile/session. It accepts current deterministic revision metrics or a current multimodal `REVISION_REQUIRED` decision. Both must match fingerprint, world signature, Reference Visual hash, and freshness checks.

For revision during `GEOMETRY_REVIEW`:

1. Codex acquires a fresh Geometry lease.
2. Capture affected views and run analyzer.
3. Record a multimodal revision only when user/visual judgment remains necessary.
4. Call `prepare_geometry_visual_rebuild`.
5. Mutate only after `GEOMETRY_IN_PROGRESS` returns.

The tool preserves checkpoints and primary masses, keeps detail by default, and permits classified detail removal only for an explicit major revision.

## Mutation

- `place_cubes_safe`: unrotated placement;
- `modify_cubes`: unrotated edits;
- `rotate_cube_about_attachment`: every non-zero rotation.

Modify only diagnosed parts. `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are progress markers only.

## Review and approval

After current final evidence and Sol acceptance, the selected writer records the decision and calls `submit_geometry_for_review`.

Submission revalidates, creates the next unused non-approved checkpoint, enters `GEOMETRY_REVIEW`, then releases the writer lease without reconnecting. Wait for the user.

- `APPROVED`: Codex acquires a fresh Geometry lease and calls `complete_geometry_stage`.
- `REVISION`: Codex acquires a fresh Geometry lease and follows the revision flow above.

Final Geometry requires five current views, fixed-scale PASS, structural PASS, matching fingerprint/world signature/reference hash, safe rotations, and current visual acceptance.
