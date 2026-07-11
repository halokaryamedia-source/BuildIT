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

## Geometry internal runtime

Inside `GEOMETRY_IN_PROGRESS`, MCP enforces:

```text
PRIMARY_FORM
→ STRUCTURAL_DETAIL
→ FINAL_REVIEW_READY
```

Alternative terminal/internal routes:

```text
PRIMARY_FORM or STRUCTURAL_DETAIL
→ two non-improving diagnosis cycles
→ VISUAL_CONVERGENCE_FAILED

multiple primary masses or views fail
→ GEOMETRY_VISUAL_REBUILD
→ PRIMARY_FORM

one part or related pair fails after review
→ GEOMETRY_LOCAL_REPAIR
→ STRUCTURAL_DETAIL
```

`PRIMARY_FORM` allows body masses, neck/head/muzzle, provisional legs, and ground relationship only. Horns, ears, final feet, tail, and detail remain locked until Left, Front, and Top multimodal inspection plus fixed-scale diagnosis pass.

Every Geometry mutation invalidates earlier fixed-scale metrics, multimodal report, and review readiness. Every non-zero cube rotation must use its machine-readable attachment contract and affected-view before/after score.

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

## Geometry revision routing

```text
LOCAL_REPAIR
→ GEOMETRY_LOCAL_REPAIR

MAJOR_FORM_REVISION
→ GEOMETRY_VISUAL_REBUILD

REFERENCE_REOPEN
→ return to approved reference workflow

REFERENCE_CONFLICT
→ stop

LEGACY_SKILL_CONFLICT
→ stop
```

Use `MAJOR_FORM_REVISION` when multiple primary masses or standard views fail, or a local repair does not converge. Previous checkpoints remain immutable.

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

Every write checks project UUID, active profile, workflow state, state revision, owner session, and MCP session root. `mcp/state.json` overrides Markdown summaries. `workspace.json` is only an index.
