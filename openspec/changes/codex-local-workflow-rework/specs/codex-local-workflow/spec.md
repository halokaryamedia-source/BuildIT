# Codex Local Workflow Specification

## Governance

OpenSpec SHALL preserve approved scope and authority. Ponytail SHALL select the smallest safe operation required by the active stage.

Normal recovery SHALL read only governance, the active OpenSpec/Ponytail summary, selected workspace index, current project/state files, the reference core, and the active-stage contract. It SHALL NOT scan unrelated assets, copied chat context, legacy prompt packs, or old session folders.

## Upstream reference intake

The approved package SHALL contain Production Context, one Reference Visual, Geometry, Texturing, Animation, Validation, schema-3.3 manifest, and Codex handoff. The Golden Sample SHALL be the mandatory layout/quality benchmark. Legacy numbered sheets and additional routine approval moments SHALL NOT be required.

Routine ChatGPT generation SHALL have exactly two approval moments. Technical package generation and audit SHALL be automatic.

## Authority order

1. Production Context for intent and decisions;
2. approved Reference Visual for visible design;
3. manifest for executable numeric contracts;
4. stage Markdown for concise human procedure;
5. Codex handoff for route and boundaries.

## Runtime state

`workspace/active/<asset>/mcp/state.json` SHALL be runtime authority. `workspace/workspace.json` SHALL only select the active asset. User-facing files SHALL remain under `blockbench/`; internal state/evidence/checkpoints/reports SHALL remain under `mcp/`.

## State sequence

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW / ANIMATION_APPROVED when required
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

Broad feedback SHALL reopen the earliest affected stage while preserving accepted areas.

## One-time preflight and context budget

`get_runtime_status` SHALL run once at startup and repeat only after a real runtime/connection/project replacement event. `get_stage_context` SHALL run at stage entry and after approval, revision, or upstream reopen. It SHALL NOT be polled after every MCP call.

Fresh identity, preflight, reference hash, analyzer, and evidence results SHALL be reused until their explicit freshness keys change.

## Geometry branch

After Reference Visual inspection:

- zero-start project: build primary masses from manifest before first capture/analyze;
- existing/revision project: capture affected views and diagnose before mutation.

The first analysis of a blank model is forbidden. Corrections SHALL use affected views and bounded cycles. Final review SHALL use all manifest-required views, including Right Side only for asymmetric assets.

### Smart attachment and rotation execution

A required angled cuboid SHALL NOT be represented by an axis-aligned stacked
substitute.

Normal attachment execution SHALL be:

```text
zero-rotation provisional cuboid
→ rotate_cube_about_attachment without angle_degrees
→ constraint-sized cuboid
→ inferred longitudinal axis
→ automatic legal one-axis angle
→ explicit connected end-face centerline pivot
→ snap pivot to target attachment
→ translate from/to/origin together
→ direction, gap, and affected-view validation
→ attachment_fit.json
```

An explicit angle SHALL be used only for one diagnosed repair. When a contract
range excludes zero, the final rotation SHALL be visibly non-zero.

`verify_primary_form_ready` SHALL reject:

- missing or default pivot;
- connection gap outside tolerance;
- direction mismatch;
- absent or stale attachment-fit evidence;
- current transforms that differ from evidence;
- axis-aligned substitutes for required rotated parts.

This requirement SHALL use the existing Geometry profile and tool. It SHALL NOT
add a profile, stage, user approval, or regenerate loop.

## Review submission

`submit_geometry_for_review` SHALL own fresh Geometry validation, review readiness, checkpoint, state transition, and lease release.

For Texture and Animation, normal flow SHALL be evidence → bound report → `submit_stage_for_review`. The submission tool SHALL own fresh validation. A separate validation call SHALL occur only after a failed submission when structured diagnostics are needed.

Final Validation SHALL run one `require_evidence=false` preflight before final evidence/export, then create final evidence, export, record the bound report, and submit. Submission SHALL run the final evidence-aware validation.

## Model routing

Normal implementation SHALL use the Terra Medium parent. `mcp_builder` SHALL be fallback sole writer only when necessary. Mini SHALL handle sizeable mechanical read-only work. Sol Medium SHALL be conditional on unresolved visual judgment; it SHALL NOT be called solely because a stage started. Sol High SHALL be used at most once for one coded critical decision.

## One-session execution

All stages, approvals, revisions, and upstream reopen SHALL remain in one Codex session and one MCP session. Transitions SHALL release the old lease, call stage context, and acquire a fresh lease without reconnect, reload, or restart.

## Efficiency and stop conditions

The agent SHALL use structured outputs, direct evidence writes, atomic checkpoints, bounded image transport, deterministic validation, and stage-specific guarded completion. It SHALL stop only for a real authority conflict, mandatory runtime failure, unsafe mutation, lease conflict, unrecoverable evidence failure, failed gate without a repair route, or user review. Unrelated work SHALL be `DEFERRED_NOT_REQUIRED`.
