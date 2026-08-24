# Next Action

Updated: 2026-08-25 — baseline-driven UV / authoring-convergence hardening

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
TEXTURE_PRODUCTION_ROUTING_HARDENED
SIMPLE_RIGID_FAST_PATH_HARDENED
USER_BASELINE_FAILURE_RECORDED
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive unless the user explicitly resumes it. GitHub execution/history discipline is owned by `GITHUB_RULES.md`.

## Baseline Failure That Drove This Patch

The user supplied the latest failed authoring result and reported two material problems:

1. UV/texturing was poor and effectively stopped at flat fills without readable value/form/detail work.
2. A simple rigid model took too long to model and texture, with behavior consistent with excessive guessing/repetition.

Historical pre-cleanup model data additionally showed manually authored Box-UV offsets and unnecessary nested rigid-part hierarchy. That history is supporting evidence only; it is not a fixture-specific product rule.

## Source Hardening Applied

- New Box-UV Cubes placed by `place_cube` receive deterministic non-overlapping `uv_offset` packing against the logical canvas and existing Box-UV occupancy.
- `place_cube` returns each Cube's `box_uv_region` so downstream texturing can reuse mutation state instead of rediscovering broad UV ownership.
- Auto UV stays active during geometry correction; after geometry `PASS`, texturing guidance uses one `modify_cubes_batch` to lock final Box-UV Cubes with `autouv=0` before production paint.
- Texture guidance now routes base/material regions, stepped form/value work, optional continuous gradients, and identity/detail pixels to the existing Painter tools instead of allowing flat fill to masquerade as completion.
- Production texture creation explicitly supplies 128-based bitmap dimensions rather than relying on the provisional 16×16 default.
- Simple clear rigid props use a bounded modelling fast path: minimum meaningful hierarchy, coherent Cube batching, then judgeable views. Nested Groups are not created merely to carry small local rigid bends.

## Do Not Reinterpret

For MCP quality/usage work:

- **Authoring Quality** remains the accepted-result gate.
- **Authoring Efficiency** remains Cost to Accepted Result.
- Static footprint, Skill length, schema size, tool count, or raw call count alone are not success metrics.
- Do not add fixture-specific recipes, telemetry, routers/profiles, or new tools merely because this baseline failed.

## Current Continuation

There is **no automatic implementation or test step**. The user explicitly deferred retesting until after this source hardening.

When the user chooses to retest, use the exact current artifact and the existing local acceptance procedure:

```text
approved reference visible
→ exact Local artifact + hash
→ one bounded authoring attempt
→ quality gate
→ call/correction trace when available
→ classify first wrong owner
→ compare Cost to Accepted Result
→ smallest follow-up patch only if evidence requires it
→ STOP
```

## Proof Boundary

The UV packing, returned-state, and Skill/routing changes are source/static facts. **No live model-quality or authoring-efficiency improvement is claimed until the exact hardened artifact is run and visually inspected.**

Current proof history lives in `docs/foundation/validation-report.md`; discarded experiments and fixture iterations remain Git history.

## STOP

No further repository, local-runtime, workspace, or experimental action is implied without a new user instruction.
