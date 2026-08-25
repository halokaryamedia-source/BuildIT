# Next Action

Updated: 2026-08-25 — phase-scoped MCP authoring surface applied; Texture Atlas candidate still awaits canonical Bun completion

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
DEFAULT_AUTHORING_PHASE_GEOMETRY
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_REBASE_REQUIRED_AFTER_PHASE_SURFACE
CANONICAL_BUN_GENERATION_REQUIRED_BEFORE_TEXTURE_CONTRACT_LANDING
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive. Current source plus relevant proof remains authority.

## Canonical Vocabulary — Do Not Collapse

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` creates a **Texture Atlas**. UV state (`uv_offset`, `autouv`, `mirror_uv`, per-face UV, `box_uv_region`) is **UV Layout**. Painter operations are **Texture Styling**. `get_texture` plus mapped model views provides **Texture Verify** evidence.

## Phase-Scoped MCP Surface

BlockIT retains the normal Bedrock callable catalog but plugin startup now exposes:

```text
MCP CORE
+
exactly one authoring phase
```

Authoring phases:

```text
geometry   = Geometry + rig + Locator/Null mutation + UV Layout mutation
texturing  = Texture Atlas + Painter + PBR + material instances
animation  = animation/keyframes/timeline/effects/controllers/inspection
```

Core stays available across all three phases for project lifecycle, recovery/history, focused discovery/inspection, selection, delete/rename, canonical capture, locator discovery, and export.

Default phase is **Geometry**. Current source classification expects the default Geometry exposure to contain **27 tools**. Phase is selected through the `MCP Authoring Phase` Blockbench setting; the setting requires plugin/MCP reload rather than relying on live client tool-list refresh.

Boundary rule:

- Geometry completes rig and UV Layout mutation before Texturing handoff.
- Texturing may inspect/audit UV state, but an upstream UV/geometry defect returns to Geometry rather than borrowing Cube mutation tools.
- Animation does not own `bone_rigging`; structural rig defects return to Geometry.
- Tool implementations, schemas, and names are unchanged; only MCP exposure is phase-scoped.

Primary owners:

```text
mcp/lib/authoringPhase.ts
mcp/server/tools.ts
mcp/index.ts
mcp/ui/settings.ts
mcp/tests/authoring-phase-surface.test.ts
```

Generated MCP API documentation remains catalog-based; this phase-scoping pass does not edit tool schemas/descriptions and therefore does not require hand-edited generated API entries.

## Bounded Internal Cleanup Applied

### History

`mcp/server/tools/history.ts` shares Undo/Redo step-schema construction and common history traversal/validation/error handling instead of maintaining two copies.

### Material Instances

`mcp/server/tools/material-instances.ts` shares explicit/selected Cube scope resolution plus one face material-name mutation primitive across set, bulk-set, and clear.

These cleanups and phase exposure are source/static facts. They do **not** prove lower wall-clock runtime or better Authoring Efficiency by themselves.

## Texture Atlas Public-Contract Candidate

The last rebased source/test candidate remains:

```text
2aa0a29a2f3d081a3f2765db41f2460524ff3fee
old parent: bc395113159b92c9b0b8cb4322fb09308756924f
```

Its intent remains current, but **do not land that old commit directly** after the phase-scoping changes. Rebase/recover its exact five-file intent onto the then-current `Local` before canonical generation.

Candidate intent:

- blank base Texture Atlas omitted width/height → supported project UV dimensions, fallback `128×128`;
- blank variant/PBR support Atlas omitted size → inherit established base Atlas bitmap size;
- explicit blank sizes remain intentional, including provisional 16-based sizes;
- imported image data keeps authored dimensions and rejects simultaneous `data + width/height`;
- `create_texture` reports its sizing source;
- public Texture/ Painter descriptions preserve the UV Layout / Texture Atlas / Texture Styling / Texture Verify split;
- fill remains BASE PASS only; shape/brush own styling and gradient is only for supported continuous transitions.

## Required Texture Candidate Completion

A canonical Bun-capable environment is still required. Do not run a model-authoring benchmark or live visual acceptance during this completion.

1. Start from the then-current `Local`.
2. Recover/rebase the exact five-file intent from candidate `2aa0a29a2f3d081a3f2765db41f2460524ff3fee`; preserve the phase-scoped surface changes and never force-update.
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

- aggregate `list_textures` Box-UV working map;
- Painter operation batching;
- targeted Canvas refresh redesign;
- telemetry/session logger;
- mega-tools or dynamic live phase switching;
- live authoring/model test.

## Proof Boundary

The phase-scoped authoring surface is source/static until the repository CI gate is observed and the installed plugin is later exercised. The Texture Atlas public-contract candidate remains unlanded until canonical Bun generation/gates complete. **No better visual quality, wall-clock runtime, or Authoring Efficiency is claimed without matching evidence.**

## STOP

After phase-surface CI is checked, do not broaden the phase system automatically. The next source-changing task remains the canonical Texture Atlas candidate completion when a Bun-capable environment is available. Live model retesting remains deferred.
