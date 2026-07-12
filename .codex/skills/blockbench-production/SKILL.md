---
name: blockbench-production
description: "One-session production dispatcher with Golden Sample initialization, one selected Terra writer, bounded visual judgment, and guarded MCP stage continuity."
---

# Blockbench Production

Use for an approved single-Reference-Visual package.

## User-facing contract

The user supplies the production request and reviews stage results. Codex owns workspace initialization, project creation, identity synchronization, lease handling, routing, evidence, reports, checkpoints, transitions, and recovery.

Never ask the user to:

- test typecheck, unit tests, build, session count, profile exposure, or UUID synchronization;
- edit JSON;
- select a worker or repair profile;
- reconnect MCP;
- reload the plugin during production;
- start a new Codex session after a profile/stage change.

## Routing

```text
normal implementation  → Terra Medium parent directly
large read-only audit  → routine_auditor / Mini Low when available
fallback writer        → mcp_builder / Terra Medium when available
visual judgment        → visual_director / Sol Medium when available
critical decision      → critical_reviewer / Sol High once when mandatory
```

Select exactly one writer: Terra parent or `mcp_builder`, never both. When custom roles are missing, record `CODEX_PROJECT_CONFIG_NOT_LOADED` as a routing warning and continue through safe parent fallbacks in the current session.

## Stable session

The plugin registers one stable tool surface. Logical profiles still enforce `TOOL_PROFILE_BLOCKED`, cross-stage argument guards, and the one write lease.

Every stage transition follows:

```text
activate next logical profile
→ release previous lease
→ continue same MCP session
→ continue same Codex session
→ get_stage_context
→ acquire fresh current-stage lease
```

No normal stage, review, revision, approval, or recovery operation requires reconnect or plugin reload.

## Golden Sample zero-start

When the user requests a new Black Rhinoceros from the tracked sample:

1. Initialize a fresh asset with `workspace:sample` from `docs/reference/golden-samples/black_rhinoceros`.
2. Use a fresh asset ID.
3. Confirm the canonical model path is absent.
4. Confirm no `.bbmodel`, checkpoint, evidence, runtime identity, or prior state was copied.
5. Create the Bedrock project through MCP and save it to the canonical model path.
6. Continue normal Geometry production from zero.

The previously debugged `workspace/active/black_rhinoceros` model is not an acceptance baseline.

## Dispatch

1. Resolve or initialize the asset and canonical session root.
2. Load this skill plus exactly one active-stage skill.
3. Create the project through MCP when the canonical model does not exist.
4. Call `get_runtime_status`, then `get_stage_context`.
5. Rebind identity before lease acquisition when required.
6. Select one writer and acquire the lease before persistent writes.
7. Follow `next_safe_operation` until a stage review result is ready.
8. Submit through the canonical MCP review transition and stop only for user review.

A successful review submission releases the writer lease. After `APPROVED` or `REVISION`, Codex acquires a fresh current-stage lease automatically in the same session.

## Geometry

Geometry stays in `BEDROCK_CUBOID_GEOMETRY`:

```text
create project when absent
→ get_stage_context
→ rebind identity when required
→ selected writer acquires lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded diagnosed construction/correction
→ final five-view capture/analyze
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ user reviews one result
```

`analyze_geometry_views` persists metrics and diff, so it requires the Geometry lease. Ephemeral visual inspection does not persist evidence.

Current Geometry evidence must match project UUID, compatibility fingerprint, transformed world-space signature, Reference Visual hash, five views, analyzer, visual decision, and rotation audit. Hierarchy/group-transform changes require fresh capture/analyze.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes. Use `place_cubes_safe` and `modify_cubes` for unrotated work. Every non-zero rotation uses `rotate_cube_about_attachment`.

## Other stages

Texture, Animation, and Final Validation use:

```text
work and evidence
→ record_stage_review_report
→ validate_reference_contract
→ submit_stage_for_review
→ lease released
→ user review
```

User revision returns to the same stage profile through `prepare_stage_revision`. Upstream reopen preserves approved checkpoints, marks downstream revalidation, activates the target logical profile, releases the old lease, and continues in the current session.

## Visual boundary

Use `visual_director` only for initial Reference direction, ambiguous cross-view/root-cause decisions, subjective user feedback, and final visual acceptance. When unavailable, the parent performs the same bounded visual comparison without restarting the session.

## Stages

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation when required
FINAL_VALIDATION → blockbench-validation
```

Stop only for a real authority conflict, unavailable mandatory runtime, unsafe mutation, unrecoverable stale evidence, failed review gate, lease conflict, or user approval.
