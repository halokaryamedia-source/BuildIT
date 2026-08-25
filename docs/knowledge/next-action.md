# Next Action

Updated: 2026-08-25 — bounded MCP internal cleanup + Texture Atlas candidate pending Bun generation

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
SIMPLE_RIGID_FAST_PATH_HARDENED
CANONICAL_AUTHORING_STAGE_VOCABULARY_ALIGNED
USER_BASELINE_FAILURE_RECORDED
HISTORY_TRAVERSAL_INTERNAL_CLEANUP_APPLIED
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_PREPARED_UNREFERENCED
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

`mcp/server/tools/history.ts` now shares the identical Undo/Redo step schema construction and the common history-traversal/validation/error path instead of maintaining two copies.

The public tool names, schema semantics/defaults, error messages, result fields, `structuredContent`, stack-read behavior, and existing refresh semantics remain unchanged. In particular, the previous successful-redo refresh remains; no new successful-undo refresh was introduced.

This is a source-structure cleanup. It does **not** prove lower wall-clock runtime or better Authoring Efficiency by itself.

A larger `cubes.ts` consolidation was explored but was **not landed** because the available GitHub blob transport did not preserve the large candidate reliably. Do not infer any Cube lifecycle refactor from abandoned/unreferenced candidate objects.

## Prepared Texture Atlas Public-Contract Candidate

Unreferenced candidate commit:

```text
50367a1f6c670856102467fe63111ed019077f0c
original parent: 49eb2b6a6a8bf9aa2cd65ebb969916928a0fcb57
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

Use a local Codex/Opencode environment with Bun. Do not run a model-authoring benchmark or live visual acceptance during this completion.

1. Start from the then-current `Local`.
2. Recover/rebase the exact intent of candidate `50367a1f6c670856102467fe63111ed019077f0c` onto current `Local`; do not force-update or blindly replace newer source.
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
6. Re-fetch `Local` HEAD before landing; if it moved materially, reconcile and never force.
7. Land one coherent commit, observe available CI/status, then STOP. Do not infer live Blockbench/model quality from static completion.

## Deferred Until Evidence

Do not implement automatically:

- aggregate `list_textures` Box-UV working map;
- Painter operation batching;
- targeted Canvas refresh redesign;
- telemetry/session logger;
- new MCP tools/router/profile;
- live authoring/model test.

## Proof Boundary

The History cleanup is source/static evidence of reduced duplicated implementation while preserving the existing public contract. The Texture Atlas public-contract candidate remains unlanded until canonical Bun generation/gates complete. **No better visual quality, wall-clock runtime, or Authoring Efficiency is claimed without matching runtime evidence.**

## STOP

Do not broaden this internal cleanup into additional tool families in the same pass. The next implementation step is the bounded Texture Atlas candidate completion when a canonical Bun environment is available. Live model retesting remains deferred by the user.
