# Next Action

Updated: 2026-08-25 — Phase Contract v2 prepared for Codex legibility; Texture Atlas candidate remains separate

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
SIMPLE_RIGID_FAST_PATH_HARDENED
CANONICAL_AUTHORING_STAGE_VOCABULARY_ALIGNED
USER_BASELINE_FAILURE_RECORDED
HISTORY_TRAVERSAL_INTERNAL_CLEANUP_APPLIED
MATERIAL_INSTANCE_FACE_MUTATION_INTERNAL_CLEANUP_APPLIED
MCP_CORE_PLUS_SINGLE_AUTHORING_PHASE_SOURCE_APPLIED
PHASE_CONTRACT_V2_AGENT_LEGIBILITY_SOURCE_APPLIED
DEFAULT_AUTHORING_PHASE_GEOMETRY
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_REBASE_REQUIRED_AFTER_PHASE_SURFACE
CANONICAL_BUN_GENERATION_REQUIRED_BEFORE_TEXTURE_CONTRACT_LANDING
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive. Current source plus relevant proof remains authority.

## Phase Contract v2 — Codex Legibility

The MCP catalog still retains normal Bedrock capability, but Codex receives only:

```text
MCP CORE
+
exactly one active phase
```

Runtime initialize instructions now state `ACTIVE PHASE`, describe its ownership, and explicitly explain that foreign-phase tools are intentionally unavailable. Missing foreign-phase tools are **not** discovery misses.

Canonical foreign-phase response:

```text
HANDOFF_REQUIRED
target_phase: <geometry|texturing|animation>
reason: <why current phase cannot own the next mutation>
resume_from: <fresh project/UUID/state>
action: set MCP Authoring Phase=<target>; reload BlockIT MCP
STOP
```

Agent rules:

- do not `tool_search`, emulate, rename, or substitute a known foreign-phase tool;
- Geometry owns Cube/Group/rig/Locator/Null mutation, structural delete/rename, and UV Layout mutation;
- `list_textures` is read-only MCP Core so Geometry can perform global UV/atlas audit before handoff and Texturing can reuse it;
- Texturing owns Texture Atlas/Painter/PBR/material instances and returns structural/UV defects to Geometry;
- Animation owns motion/keyframes/timeline/effects/controllers and returns structural rig/pivot/IK defects to Geometry;
- the runtime workflow prompt receives a phase header before the canonical full-pipeline body, so later-stage sections are handoff targets rather than callable routes.

Primary owners:

```text
mcp/lib/authoringPhase.ts
mcp/server/server.ts
mcp/server/prompts.ts
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
.agents/skills/blockit-bedrock-texturing/SKILL.md
.agents/skills/blockit-bedrock-animation/SKILL.md
mcp/tests/authoring-phase-surface.test.ts
```

Acceptance POV for this source pass is **agent contract consistency**, not live model speed: active instructions, exposed surface, specialist routing, and handoff behavior must agree. No live modelling test is required for this pass.

## Canonical Vocabulary — Do Not Collapse

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` creates a **Texture Atlas**. UV state (`uv_offset`, `autouv`, `mirror_uv`, per-face UV, `box_uv_region`) is **UV Layout**. Painter operations are **Texture Styling**. `get_texture` plus mapped model views provides **Texture Verify** evidence.

## Bounded Internal Cleanup Applied

### History

`mcp/server/tools/history.ts` shares Undo/Redo step-schema construction and common history traversal/validation/error handling instead of maintaining two copies.

### Material Instances

`mcp/server/tools/material-instances.ts` shares explicit/selected Cube scope resolution plus one face material-name mutation primitive across set, bulk-set, and clear.

These cleanups and phase contracts are source/static facts. They do **not** prove lower wall-clock runtime or better Authoring Efficiency by themselves.

## Texture Atlas Public-Contract Candidate

The last source/test candidate remains:

```text
2aa0a29a2f3d081a3f2765db41f2460524ff3fee
old parent: bc395113159b92c9b0b8cb4322fb09308756924f
```

Its intent remains current, but **do not land that old commit directly** after phase-contract changes. Recover/rebase its exact five-file intent onto the then-current `Local` before canonical generation.

Candidate intent:

- blank base Texture Atlas omitted width/height → supported project UV dimensions, fallback `128×128`;
- blank variant/PBR support Atlas omitted size → inherit established base Atlas bitmap size;
- explicit blank sizes remain intentional, including provisional 16-based sizes;
- imported image data keeps authored dimensions and rejects simultaneous `data + width/height`;
- `create_texture` reports its sizing source;
- public Texture/Painter descriptions preserve the UV Layout / Texture Atlas / Texture Styling / Texture Verify split;
- fill remains BASE PASS only; shape/brush own styling and gradient is only for supported continuous transitions.

## Required Texture Candidate Completion

A canonical Bun-capable environment is still required. Do not run a model-authoring benchmark or live visual acceptance during this completion.

1. Start from the then-current `Local`.
2. Recover/rebase the exact five-file intent from candidate `2aa0a29a2f3d081a3f2765db41f2460524ff3fee`; preserve phase-scoped/Phase Contract v2 behavior and never force-update.
3. From `mcp/` run:

```bash
bun install --frozen-lockfile
bun run prompts:build
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

4. Review generated changes. Expected generated owners are `mcp/prompts/manifest.json`, `mcp/docs/api.json`, and `mcp/docs/index.html`. Do not hand-edit generated entries.
5. Confirm source + tests + generated artifacts form one coherent public-contract change with no unrelated diff.
6. Re-fetch `Local` HEAD before landing; reconcile any movement and never force.
7. Land one coherent commit, observe available CI/status, then STOP. Do not infer live Blockbench/model quality from static completion.

## Deferred Until Evidence

Do not implement automatically:

- aggregate `list_textures` Box-UV working map beyond the current read-only audit surface;
- Painter operation batching;
- targeted Canvas refresh redesign;
- telemetry/session logger;
- mega-tools or dynamic live phase switching;
- `get_phase` / `switch_phase` ritual tools;
- live authoring/model test.

## Proof Boundary

Phase Contract v2 can be statically verified for instruction/surface/routing consistency. It does **not** prove that a future Codex authoring run uses fewer calls or produces better visual quality; that remains runtime evidence. The Texture Atlas public-contract candidate remains unlanded until canonical Bun generation/gates complete.

## STOP

After Phase Contract v2 source/CI review, do not broaden the phase system automatically. The next source-changing task remains the canonical Texture Atlas candidate completion when a Bun-capable environment is available. Live model retesting remains deferred by the user.
