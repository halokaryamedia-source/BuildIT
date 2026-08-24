# Next Action

Updated: 2026-08-25 — runtime prompt alignment after baseline failure

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
TEXTURE_PRODUCTION_ROUTING_HARDENED
SIMPLE_RIGID_FAST_PATH_HARDENED
RUNTIME_MCP_PROMPT_FAST_PATH_ALIGNED
PROMPT_MANIFEST_ALIGNED_TO_SOURCE
USER_BASELINE_FAILURE_RECORDED
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive unless the user explicitly resumes it.

## Baseline Failure

The latest user test was a **QUALITY FAIL**:

1. production texture visually stopped at flat/fill-like color instead of material/value/form/identity detail;
2. geometry and texturing were too slow for a simple rigid model and appeared to spend work on guessing/repetition.

No quantitative token/call baseline is claimed because a complete trace was not retained.

## Hardening Now Present

- `place_cube` auto-packs new Box-UV offsets and returns `box_uv_region` continuation state.
- Geometry correction keeps auto UV active; final production UV is locked only after geometry `PASS`.
- The modelling Skill has a **Simple Rigid Fast Path** with minimum meaningful hierarchy and coherent Cube batching.
- The texturing Skill treats flat fill as base-only and routes value/form/edge/identity work through existing Painter tools.
- The **runtime MCP prompt now matches those same rules** instead of forcing Reference Evidence Map / View Pair Map / Semantic Form ceremony for a clear simple rigid reference.
- Runtime prompt explicitly reuses fresh `box_uv_region`, performs one final `list_textures` UV audit, uses explicit 128-based production texture dimensions, and avoids Cube-by-Cube UV rediscovery.
- `prompts/manifest.json` is aligned to the canonical runtime prompt source; regression coverage now checks source ↔ manifest equality.

## Deliberately Not Applied In This Channel

Two previously discussed public-contract changes remain **not implemented** here:

- changing the actual `create_texture` schema/default away from provisional 16×16;
- changing public tool descriptions / generated API documentation.

Those changes require the canonical Bun docs generator so `docs/api.json` and `docs/index.html` stay generated from source. Do not hand-edit generated API docs or leave them stale. Current runtime guidance already requires explicit 128-based production dimensions, so this is not a reason to add a workaround layer.

An aggregate `list_textures` Box-UV working map is also not added yet. Freshly created models already receive `box_uv_region` from `place_cube`; only promote an aggregate working-map result if a resumed/existing-model workflow proves Cube-by-Cube inspection is still material waste.

## Do Not Reinterpret

- Authoring Quality = accepted-result gate.
- Authoring Efficiency = Cost to Accepted Result.
- Static footprint / Skill length / raw call count alone are not product success metrics.
- Do not add fixture-specific recipes, telemetry, routers/profiles, or more tools without evidence.

## Current Continuation

There is **no automatic retest**. The user explicitly deferred testing until source hardening is complete.

When the user elects to retest:

```text
approved reference visible
→ exact current Local artifact
→ one bounded authoring attempt
→ quality gate
→ observe call/correction behavior when available
→ identify first wrong owner
→ compare Cost to Accepted Result
→ smallest follow-up only if evidence requires it
→ STOP
```

## Proof Boundary

All changes above are source/static facts. **No better visual quality or Authoring Efficiency is claimed until the exact hardened artifact is run and inspected.**

## STOP

No further repository, runtime, workspace, or experimental action is implied without a new user instruction or the required local/generated-doc capability.
