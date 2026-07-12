# Runtime State Machine

## Production workflow

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when required
→ ANIMATION_APPROVED when required
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

These are the user-facing workflow states. Internal Geometry corrections do not create extra user approval gates.

## Geometry profile and session

All Geometry work uses:

```text
BEDROCK_CUBOID_GEOMETRY
```

The profile covers project identity synchronization, diagnosis, local or major revision preparation, editing, validation, automatic review submission, and approval.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal revision scopes. They are not profiles or workflow states and do not require reconnecting.

## Geometry identity readiness

Before model mutation:

```text
runtime UUID differs from stored UUID
→ rebind_active_project_identity
→ UUID metadata aligned
→ manage_project_write_lease acquire
```

Identity synchronization is metadata-only, strictly verified, lease-exempt, and available in the current Geometry profile. It does not modify the `.bbmodel` and does not require a profile switch or reconnect.

## Geometry internal progress

Inside `GEOMETRY_IN_PROGRESS`, the runtime may report:

```text
PRIMARY_FORM
STRUCTURAL_DETAIL
FINAL_REVIEW_READY
```

These are advisory progress markers, not user-facing gates.

Recommended order:

1. primary body, head, leg, footprint, and ground relationships;
2. silhouette-critical detail, hierarchy, connections, and safe rotations;
3. final five-view evidence.

Codex may repair diagnosed related parts in the same profile. Two non-improving checks set `attention_required`; they do not permanently lock the model.

Any model mutation after `FINAL_REVIEW_READY` invalidates old review readiness and returns Geometry to working state.

## Geometry revision preparation

When a fresh fixed-scale diagnosis returns:

```text
result = REVISION_REQUIRED
recommended_scope = LOCAL_REPAIR or MAJOR_FORM_REVISION
```

Codex calls `prepare_geometry_visual_rebuild` in the current Geometry profile. The compatibility name does not represent a separate stage or profile.

The operation:

- accepts workflow state `GEOMETRY_IN_PROGRESS` or `GEOMETRY_REVIEW`;
- requires the current Geometry write lease;
- requires current project UUID, state revision, Geometry fingerprint, Reference Visual hash, and diagnosis;
- preserves all checkpoints and primary masses;
- keeps structural detail by default;
- permits structural-detail removal only for an explicit `MAJOR_FORM_REVISION`;
- rejects broad detail removal for `LOCAL_REPAIR`;
- records the diagnosed revision scope;
- advances state and lease revision together;
- keeps the active profile unchanged;
- returns workflow state to `GEOMETRY_IN_PROGRESS` with next action `CONTINUE_GEOMETRY`.

This is also the guarded route after the user responds with revision feedback during `GEOMETRY_REVIEW`. Codex captures and diagnoses the affected views before calling the preparation tool; it does not mutate while the main workflow remains in review state.

## Geometry evidence lifecycle

Every Geometry mutation makes earlier visual metrics, multimodal decisions, and review readiness stale.

Every non-zero cube rotation must use `rotate_cube_about_attachment` with its machine-readable contract and affected-view before/after score.

## Geometry review requirements

```text
runtime_phase = FINAL_REVIEW_READY
structural_status = PASS
visual_status = PASS
deterministic_visual_status = PASS
rotation_status = PASS or non-blocking WARNING
evidence_status = CURRENT
result = PASS
```

Review evidence must be bound to the current:

- project UUID;
- Geometry fingerprint;
- Reference Visual SHA-256;
- five standard views;
- `geometry_projection_region_v2` analyzer;
- fixed approved scale with free-rescale disabled.

A structural PASS alone must never transition to `GEOMETRY_REVIEW` or `GEOMETRY_APPROVED`.

## Automatic Geometry review submission

When Geometry is `FINAL_REVIEW_READY`, Codex calls:

```text
submit_geometry_for_review
```

The tool performs one guarded transition:

```text
validate_geometry_contract
→ embedded verify_geometry_review_ready result must PASS
→ save next unused non-approved Geometry review checkpoint
→ update state_revision once
→ workflow.state = GEOMETRY_REVIEW
→ workflow.status = AWAITING_USER_REVIEW
→ workflow.next_action = AWAIT_GEOMETRY_REVIEW
```

The submission remains in `BEDROCK_CUBOID_GEOMETRY`, keeps the current lease aligned to the new revision, and does not require reconnecting. The user does not edit `state.json`, choose a checkpoint name, or manually change workflow state.

After submission, `get_stage_context` returns:

```text
AWAIT_GEOMETRY_REVIEW
```

The user responds only with approval or targeted revision feedback.

## Geometry revision routing

Any Geometry revision issue—including one discovered during Final Validation—routes to:

```text
BEDROCK_CUBOID_GEOMETRY
```

Codex then uses `analyze_geometry_views` to classify:

```text
LOCAL_REPAIR
or
MAJOR_FORM_REVISION
```

Removed repair-profile names must never be activated or returned as the effective next profile.

## Authority conflicts

```text
REFERENCE_REOPEN
→ return to approved reference workflow

REFERENCE_CONFLICT
→ stop

LEGACY_SKILL_CONFLICT
→ stop
```

Use `REFERENCE_CONFLICT` only when approved authorities cannot be reconciled, not for ordinary Geometry revision.

## Workspace lifecycle

```text
workspace/active/<asset>
→ workflow DONE + final user approval
→ workspace completion promotion
→ workspace/completed/<asset>

workspace/completed/<asset>
→ read-only inspect
or
→ reopen earliest affected stage
→ workspace/active/<asset> revision copy
→ downstream revalidation
→ final user approval
→ atomically replace completed baseline
```

The completed baseline remains immutable while a reopened revision is active.

Every model write checks project UUID, active profile, workflow state, state revision, owner session, and MCP session root. `mcp/state.json` overrides Markdown summaries. `workspace.json` is only an index.
