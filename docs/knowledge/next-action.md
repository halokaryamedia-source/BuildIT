# Next Action

Updated: 2026-08-25 — canonical UV / Texture vocabulary alignment

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
TEXTURE_PRODUCTION_ROUTING_HARDENED
SIMPLE_RIGID_FAST_PATH_HARDENED
RUNTIME_MCP_PROMPT_FAST_PATH_ALIGNED
CANONICAL_AUTHORING_STAGE_VOCABULARY_ALIGNED
PROMPT_MANIFEST_ALIGNED_TO_SOURCE
USER_BASELINE_FAILURE_RECORDED
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive unless the user explicitly resumes it.

## Canonical Vocabulary — Do Not Collapse

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

Key ownership:

- `create_texture` creates a **Texture Atlas**.
- `uv_offset`, `autouv`, `mirror_uv`, per-face UV, and `box_uv_region` are **UV Layout** state.
- Painter operations are **Texture Styling**.
- `get_texture` + mapped model views are **Texture Verify** evidence.
- Atlas creation/fill is not Styling completion; UV mapping is not Texture Styling.

Stable definitions live in `CONTEXT.md`; durable UV/texture policy lives in `docs/foundation/06-texture-standard.md`; detailed authoring sequence lives in `docs/knowledge/flow.md`.

## Baseline Failure

The latest user test was a **QUALITY FAIL**:

1. production styling visually stopped at flat/fill-like color instead of material/value/form/identity detail;
2. geometry and styling were too slow for a simple rigid model and appeared to spend work on guessing/repetition.

No quantitative token/call baseline is claimed because a complete trace was not retained.

## Hardening Now Present

- `place_cube` auto-packs new Box-UV offsets and returns `box_uv_region`.
- Geometry correction keeps auto UV active; final production UV is locked after Geometry `PASS`.
- Modelling Skill + runtime prompt use a Simple Rigid Fast Path for clear rigid references.
- UV Layout, Texture Atlas, Texture Styling, and Texture Verify are now separate canonical stages across stable context, policy, flow, specialist Skill, and runtime prompt.
- Texture Styling treats flat fill as BASE PASS only and routes value/form/edge/identity work through existing Painter tools.
- Runtime prompt avoids Cube-by-Cube UV rediscovery when fresh UV state is already returned.
- `prompts/manifest.json` mirrors the canonical runtime prompt source.

## Deliberately Not Applied

Public MCP schema/tool-name changes are not part of this terminology pass.

The actual `create_texture` schema still has a provisional 16×16 default. Current production guidance requires explicit 128-based dimensions. Changing that public default requires the canonical Bun generated-doc path; do not hand-edit generated API docs.

An aggregate `list_textures` Box-UV working map is still evidence-dependent. Freshly created models already return `box_uv_region`; promote aggregate recovery only if resumed/existing-model work still proves Cube-by-Cube inspection is material waste.

## Current Continuation

There is **no automatic retest**. The user explicitly deferred testing until source hardening is complete.

When the user elects to retest:

```text
approved reference visible
→ exact current Local artifact
→ one bounded authoring attempt
→ Geometry quality gate
→ UV Layout
→ Texture Atlas
→ Texture Styling
→ Texture Verify
→ observe call/correction behavior when available
→ classify first wrong owner
→ compare Cost to Accepted Result
→ smallest follow-up only if evidence requires it
→ STOP
```

## Proof Boundary

All terminology and routing changes above are source/static facts. **No better visual quality or Authoring Efficiency is claimed until the exact hardened artifact is run and inspected.**

## STOP

No further repository, runtime, workspace, or experimental action is implied without a new user instruction or the required local/generated-doc capability.
