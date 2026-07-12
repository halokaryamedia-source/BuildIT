# Runtime State Machine

## User-facing workflow

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

Internal Geometry corrections do not create extra user approval gates.

## One Geometry profile

All Geometry work uses `BEDROCK_CUBOID_GEOMETRY`.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles or workflow states. `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are progress markers, not user gates.

## Identity readiness

```text
runtime UUID differs from stored UUID
→ rebind_active_project_identity
→ metadata aligned
→ manage_project_write_lease acquire
```

Identity synchronization is metadata-only, lease-exempt, and does not require profile switching or reconnecting.

## Geometry revision authority

A revision may be prepared from either current authority:

```text
geometry_visual_metrics.json
result = REVISION_REQUIRED
recommended_scope = LOCAL_REPAIR or MAJOR_FORM_REVISION
```

or:

```text
geometry_visual_report.json
result = REVISION_REQUIRED
scope = LOCAL_REPAIR or MAJOR_FORM_REVISION
```

The second route records Codex/user visual review through `record_geometry_visual_decision`. It allows explicit user feedback to request a change even when deterministic metrics pass.

Both routes must match the current:

- project UUID;
- Geometry fingerprint;
- Reference Visual SHA-256;
- freshness window.

## Revision preparation

Codex calls `prepare_geometry_visual_rebuild` for either revision scope. The name is retained for compatibility and does not create a separate stage or profile.

The tool:

- accepts `GEOMETRY_IN_PROGRESS` or `GEOMETRY_REVIEW`;
- requires the current Geometry write lease;
- returns review-state Geometry to `GEOMETRY_IN_PROGRESS` before mutation;
- preserves checkpoints, project identity, and primary masses;
- keeps structural detail by default;
- rejects broad detail removal for `LOCAL_REPAIR`;
- allows classified detail cleanup only for an explicit `MAJOR_FORM_REVISION`;
- advances state and lease revision together;
- records the revision scope and evidence source;
- returns `CONTINUE_GEOMETRY` without profile switching or reconnecting.

After user revision feedback:

1. capture and inspect affected views;
2. run `analyze_geometry_views`;
3. use deterministic revision evidence when it fails;
4. when metrics pass but the user still requests a visible change, record a current multimodal `REVISION_REQUIRED` decision;
5. prepare the revision;
6. mutate only after state returns to `GEOMETRY_IN_PROGRESS`.

## Evidence lifecycle

Every Geometry mutation makes earlier visual metrics, multimodal decisions, and review readiness stale.

Every non-zero rotation must use `rotate_cube_about_attachment` with current before/after visual checks.

## Geometry review readiness

Review requires:

```text
runtime_phase = FINAL_REVIEW_READY
structural_status = PASS
visual_status = PASS
deterministic_visual_status = PASS
rotation_status = PASS or non-blocking WARNING
evidence_status = CURRENT
result = PASS
```

Evidence must bind the current project UUID, Geometry fingerprint, Reference Visual hash, five views, approved fixed scale, and supported analyzer.

A structural pass alone never authorizes review or approval.

## Automatic review submission

Codex calls `submit_geometry_for_review` when final evidence is current.

The tool performs:

```text
validate_geometry_contract
→ embedded review-readiness result must PASS
→ save next unused non-approved Geometry review checkpoint
→ increment state revision once
→ workflow.state = GEOMETRY_REVIEW
→ workflow.status = AWAITING_USER_REVIEW
→ workflow.next_action = AWAIT_GEOMETRY_REVIEW
```

Submission remains in `BEDROCK_CUBOID_GEOMETRY`, advances the current lease to the new revision, and does not require reconnecting or user file edits.

## Revision routing

Any Geometry issue, including one found during Final Validation, routes to:

```text
BEDROCK_CUBOID_GEOMETRY
```

Codex classifies the internal scope with `analyze_geometry_views`. Removed repair-profile names must never be activated or returned as the effective route.

## Authority conflicts

```text
REFERENCE_REOPEN → approved reference workflow
REFERENCE_CONFLICT → stop
LEGACY_SKILL_CONFLICT → stop
```

## Workspace lifecycle

```text
workspace/active/<asset>
→ DONE + final user approval
→ workspace/completed/<asset>
```

A completed baseline remains immutable while a reopened revision is active. `mcp/state.json` is runtime authority; `workspace.json` is only the selected-project index.
