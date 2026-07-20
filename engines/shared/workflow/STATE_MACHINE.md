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

Internal passes, corrections, routing, reconciliation, checkpoints, and evidence generation do not create extra user Review Gates.

## One Geometry profile

All Geometry work uses `BEDROCK_CUBOID_GEOMETRY`.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes, not profiles or user-facing states. `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers.

## Automatic project and writer readiness

Normal production never routes the caller through manual identity, profile, or lease coordination.

```text
no active Blockbench project
→ create_project prepares canonical model, metadata, profile, and current-session ownership

canonical project open with stale stored UUID
→ automatic identity reconciliation before the next mutation
→ same-session lease acquired or refreshed
→ continue current Stage

lease owned by another session
→ WRITE_LEASE conflict blocker
```

`rebind_active_project_identity` and `manage_project_write_lease` remain diagnostic recovery tools only. They are not normal state transitions.

Automatic recovery applies only when the current runtime project, canonical path, Asset identity, and caller session can be proven to belong together. It never bypasses another Writer.

## Geometry revision authority

A revision may be prepared from current deterministic evidence:

```text
geometry_visual_metrics.json
result = REVISION_REQUIRED
recommended_scope = LOCAL_REPAIR or MAJOR_FORM_REVISION
```

or current multimodal/user visual evidence:

```text
geometry_visual_report.json
result = REVISION_REQUIRED
scope = LOCAL_REPAIR or MAJOR_FORM_REVISION
```

The second route records Codex or user visual review through `record_geometry_visual_decision`. It permits an explicit visible revision even when deterministic metrics pass.

Both routes must match the current:

- project UUID;
- Geometry fingerprint and rendered world signature;
- Reference Visual SHA-256;
- state revision;
- freshness window.

## Revision preparation

Codex calls `prepare_geometry_visual_rebuild` for either revision scope. The compatibility name does not create a separate Stage or profile.

The operation:

- accepts `GEOMETRY_IN_PROGRESS` or `GEOMETRY_REVIEW`;
- prepares current-session ownership automatically;
- returns review-state Geometry to `GEOMETRY_IN_PROGRESS` before mutation;
- preserves checkpoints, project identity, and accepted primary masses;
- keeps structural detail by default;
- rejects broad detail removal for `LOCAL_REPAIR`;
- permits classified cleanup only for explicit `MAJOR_FORM_REVISION`;
- advances Runtime State and writer revision together;
- records revision scope and evidence source;
- returns `CONTINUE_GEOMETRY` without reconnecting.

After user revision feedback:

1. capture and inspect affected views;
2. run `analyze_geometry_views`;
3. use deterministic revision evidence when it fails;
4. when metrics pass but the user requests a visible change, record a current multimodal `REVISION_REQUIRED` decision;
5. prepare the revision;
6. mutate only after Runtime State returns to `GEOMETRY_IN_PROGRESS`.

## Evidence lifecycle

Every Geometry mutation makes dependent visual metrics, multimodal decisions, and review readiness stale.

Non-zero transforms use one of two guarded routes:

```text
accurate manifest attachment contract
→ rotate_cube_about_attachment

missing, ambiguous, or visibly inaccurate contract
→ apply_cube_transforms
```

Both routes must validate the rendered pivot/connection when Blockbench `matrixWorld` data is available and must invalidate affected evidence.

## Geometry review readiness

Review requires:

```text
runtime_phase = FINAL_REVIEW_READY
structural_status = PASS
visual_status = PASS
deterministic_visual_status = PASS
rotation_status = PASS or non-blocking WARNING
semantic_landmark_status = PASS or not declared
evidence_status = CURRENT
result = PASS
```

Evidence binds current project UUID, state revision, Geometry fingerprint, rendered world signature, Reference Visual hash, required views, approved fixed scale, and supported analyzer version.

A structural pass alone never authorizes review or approval.

## Automatic review submission

Codex calls `submit_geometry_for_review` when final evidence is current.

The operation performs:

```text
validate_geometry_contract
→ embedded review-readiness result must PASS
→ save next unused non-approved Geometry review checkpoint
→ increment state revision once
→ workflow.state = GEOMETRY_REVIEW
→ workflow.status = AWAITING_USER_REVIEW
→ workflow.next_action = AWAIT_GEOMETRY_REVIEW
→ release current writer ownership while waiting
```

Submission remains in `BEDROCK_CUBOID_GEOMETRY` and does not require user file edits, profile selection, or reconnecting.

## Stage transitions

Approval advances the Stage profile in the same Codex and MCP session. The next mutating call automatically prepares ownership for the new Stage.

Texture, Animation, and Final Validation submission tools own fresh validation, checkpointing, Runtime State transition, and writer release.

## Revision routing

A Geometry issue found during any later Stage routes back to `BEDROCK_CUBOID_GEOMETRY`. Codex classifies the internal scope with current analysis. Removed repair-profile names must never become effective routes.

## Authority conflicts

```text
REFERENCE_REOPEN
→ reopen approved Reference Design workflow

REFERENCE_CONFLICT
→ stop with conflicting artifacts

LEGACY_SKILL_CONFLICT
→ stop and identify stale instruction source

WRITE_LEASE conflict
→ stop; never bypass another Writer
```

## Workspace lifecycle

```text
workspace/active/<asset>
→ DONE + final user approval
→ automatic final promotion
→ workspace/completed/<asset>
```

A Completed Baseline remains immutable while a reopened revision is active. `mcp/state.json` is Runtime State authority; `workspace.json` is only the Selected Asset index.
