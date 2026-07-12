---
name: blockbench-production
description: "Production dispatcher using one selected Terra writer, bounded Sol visual judgment, automatic MCP recovery, and current evidence guards."
---

# Blockbench Production

Use for an approved single-Reference-Visual package.

## Preflight

Read `AGENTS.md`, `engines/codex/MODEL_ROUTING.md`, the selected asset state, and its reference package. Confirm `routine_auditor`, `mcp_builder`, `visual_director`, and `critical_reviewer` are visible. When missing, stop once with `CODEX_PROJECT_CONFIG_NOT_LOADED`. Reject legacy four-sheet, numbered-image, or three-approval workflows with `LEGACY_SKILL_CONFLICT`.

## Routing

```text
normal implementation  → Terra Medium parent directly
large read-only audit  → routine_auditor / Mini Low
fallback writer        → mcp_builder / Terra Medium
visual judgment        → visual_director / Sol Medium
critical decision      → critical_reviewer / Sol High once
```

Select exactly one writer: Terra parent or `mcp_builder`, never both. Mini and critical review have Blockbench MCP disabled. Visual direction has inspection-only MCP tools. High is the ceiling. Do not call Sol for deterministic checks or a repair whose part, direction, and magnitude are already known.

## User experience

Codex owns identity synchronization, lease handling, routing, evidence, report creation, checkpoint naming, review transitions, and recovery. Do not ask the user to edit JSON, select repair profiles/workers, reconnect inside a stage, or repeatedly reopen Blockbench.

## Dispatch

1. Resolve asset, canonical model, and session root.
2. The canonical session root is `workspace/active/<asset>/mcp`. `get_stage_context` may receive the asset root and will normalize it automatically; reuse the returned `canonical_session_root` for later MCP calls.
3. Load this skill plus exactly one active-stage skill.
4. Call `get_runtime_status`, then `get_stage_context`.
5. Follow `next_safe_operation`.
6. Rebind identity before lease acquisition when required.
7. Select one writer and acquire the lease before persistent writes.
8. Submit the stage through its MCP review transition and stop for user review.

A successful review submission releases the writer lease. After the user gives `APPROVED` or `REVISION`, Codex acquires a fresh current-stage lease before calling completion or revision preparation. This is automatic and must not be delegated to the user.

## Geometry

Geometry stays in `BEDROCK_CUBOID_GEOMETRY`:

```text
get_stage_context
→ rebind identity when required
→ selected writer acquires lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded diagnosed edits
→ final five-view capture/analyze
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ user review
```

`analyze_geometry_views` persists metrics and diff, so it requires the Geometry lease. `visual_director` may capture ephemeral views without `output_dir`; it never persists evidence.

Current Geometry evidence must match project UUID, compatibility fingerprint, transformed world-space signature, Reference Visual hash, five views, analyzer, visual decision, and rotation audit. Hierarchy or group-transform changes require fresh capture/analyze.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes. `prepare_geometry_visual_rebuild` handles either in the same profile/session and preserves checkpoints/detail by default. Use `place_cubes_safe` and `modify_cubes` for unrotated work. Every non-zero rotation uses `rotate_cube_about_attachment`.

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

User revision returns to the same stage profile through `prepare_stage_revision`. A later-stage failure affecting an earlier approved stage uses `reopen_stage_for_revision`, preserves approved checkpoints, marks downstream revalidation, changes the canonical stage profile, releases the old lease, and requires only the canonical stage-transition reconnect.

## Sol boundary

Use `visual_director` only for initial Reference direction, ambiguous cross-view/root-cause decisions, subjective user feedback, and final visual acceptance. Return immediately to the selected Terra writer and deterministic validation.

## Stages

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation when required
FINAL_VALIDATION → blockbench-validation
```

Stop only for a real authority conflict, unavailable mandatory runtime/capability, unsafe mutation, unrecoverable stale evidence, failed review gate, lease conflict, or user approval.
