# Next Action

Updated: 2026-08-25 — Texture Atlas candidate rebased; canonical Bun generation still required

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
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_REBASED_UNREFERENCED
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

## Bounded Internal Cleanup Applied

### History

`mcp/server/tools/history.ts` shares Undo/Redo step-schema construction and common history traversal/validation/error handling instead of maintaining two copies.

Public tool names, schema semantics/defaults, error messages, result fields, `structuredContent`, stack-read behavior, and previous refresh semantics remain unchanged.

### Material Instances

`mcp/server/tools/material-instances.ts` now shares:

- explicit-Cube vs selected-Cube scope resolution for set/clear operations;
- one face material-name mutation primitive used by set, bulk-set, and clear.

Tool schemas/descriptions, selected/all-cubes behavior, Undo scope/labels, Canvas refresh, face counts, and return text remain unchanged.

### Audited Without Change

`mcp/server/tools/project.ts`, `mcp/server/tools/export.ts`, and `mcp/server/tools/ui.ts` were inspected for the same cleanup class. No change was applied because the visible repetition was too small or runtime-sensitive to justify another abstraction.

A larger `cubes.ts` consolidation and `locators.ts` cleanup were explored but not landed. Runtime-sensitive Undo/preview ordering was intentionally preserved rather than guessed.

These are source-structure cleanups. They do **not** prove lower wall-clock runtime or better Authoring Efficiency by themselves.

## Rebased Texture Atlas Public-Contract Candidate

Unreferenced source/test candidate:

```text
2aa0a29a2f3d081a3f2765db41f2460524ff3fee
parent: bc395113159b92c9b0b8cb4322fb09308756924f
```

The candidate was rebuilt from the previously approved source blobs onto the current MCP/internal-cleanup source state. Its diff is limited to:

```text
.agents/skills/blockit-bedrock-texturing/SKILL.md
mcp/prompts/bedrock_entity_workflow.md
mcp/server/tools/paint.ts
mcp/server/tools/texture.ts
mcp/tests/texture-production-discipline.test.ts
```

Candidate semantics:

- blank base Texture Atlas with omitted `width`/`height` uses supported current project UV dimensions, otherwise Bedrock fallback `128×128`;
- blank variant/PBR support Atlas with omitted size inherits the established base Atlas bitmap dimensions;
- explicit blank Atlas dimensions remain intentional, including provisional 16-based sizes;
- imported image data keeps authored image dimensions and rejects simultaneous `data + width/height` rather than pretending to resample;
- `create_texture` returns the sizing source (`explicit | project_uv | bedrock_default | base_atlas | imported_authored`);
- public Texture lifecycle descriptions distinguish UV Layout, Texture Atlas, Texture Styling, and Texture Verify;
- Painter descriptions state that fill is BASE PASS only, shape/brush own styling work, and gradient is for supported continuous transitions rather than default Minecraft shading;
- terminology/regression coverage protects the above behavior.

The candidate does **not** add new tools, UV working-map aggregation, Painter batching, telemetry, or fixture-specific behavior.

## Required Texture Candidate Completion

A canonical Bun-capable environment is still required. Do not run a model-authoring benchmark or live visual acceptance during this completion.

1. Start from the then-current `Local` and recover the exact source/test intent from candidate `2aa0a29a2f3d081a3f2765db41f2460524ff3fee`. If `Local` moved beyond continuation-only changes, reconcile before applying; never force.
2. From `mcp/` run:

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

3. Review generated changes. Expected generated owners are `mcp/prompts/manifest.json`, `mcp/docs/api.json`, and `mcp/docs/index.html`. Do not hand-edit generated entries.
4. Confirm source + tests + generated artifacts form one coherent public-contract change with no unrelated diff.
5. Re-fetch `Local` HEAD before landing; if it moved materially, reconcile and never force.
6. Land one coherent commit, observe available CI/status, then STOP. Do not infer live Blockbench/model quality from static completion.

## Environment Note

This ChatGPT sandbox has Node/Git but no Bun and no outbound package-resolution network. The official MCP Verify workflow has Bun, but its docs freshness step regenerates files only inside the runner and restores the checked-in originals; it does not publish generated docs as an artifact. Therefore the public contract must remain unlanded rather than hand-editing generated files or temporarily breaking `Local`.

## Deferred Until Evidence

Do not implement automatically:

- aggregate `list_textures` Box-UV working map;
- Painter operation batching;
- targeted Canvas refresh redesign;
- telemetry/session logger;
- new MCP tools/router/profile;
- live authoring/model test.

## Proof Boundary

The History and Material Instance cleanups are source/static evidence of reduced duplicated implementation while preserving their existing public contracts. The rebased Texture Atlas candidate is source/test preparation only until canonical Bun generation/gates complete. **No better visual quality, wall-clock runtime, or Authoring Efficiency is claimed without matching runtime evidence.**

## STOP

The source/test reconciliation step is complete. Do not land the Texture Atlas public contract until canonical Bun-generated artifacts and gates are available. Live model retesting remains deferred by the user.