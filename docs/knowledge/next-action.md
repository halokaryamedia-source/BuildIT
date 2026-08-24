# Next Action

Updated: 2026-08-25 — Texture Atlas public-contract candidate awaiting canonical Bun generation

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
SIMPLE_RIGID_FAST_PATH_HARDENED
CANONICAL_AUTHORING_STAGE_VOCABULARY_ALIGNED
USER_BASELINE_FAILURE_RECORDED
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_PREPARED_UNREFERENCED
CANONICAL_BUN_GENERATION_REQUIRED_BEFORE_LANDING
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
```

Working branch: **`Local` only**. Current active public MCP contract remains the `Local` source until the candidate below is generated, verified, reviewed, and deliberately landed. `Experimental/**` remains inactive.

## Canonical Vocabulary — Do Not Collapse

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` creates a **Texture Atlas**. UV state (`uv_offset`, `autouv`, `mirror_uv`, per-face UV, `box_uv_region`) is **UV Layout**. Painter operations are **Texture Styling**. `get_texture` plus mapped model views provides **Texture Verify** evidence.

## Prepared Public-Contract Candidate

Unreferenced candidate commit:

```text
50367a1f6c670856102467fe63111ed019077f0c
parent: 49eb2b6a6a8bf9aa2cd65ebb969916928a0fcb57
```

The candidate is intentionally **not** on `Local` because this ChatGPT/GitHub-only channel has no Bun runtime and public schema/description changes require canonical generated artifacts.

Candidate source/test files:

```text
mcp/server/tools/texture.ts
mcp/server/tools/paint.ts
mcp/tests/texture-production-discipline.test.ts
.agents/skills/blockit-bedrock-texturing/SKILL.md
mcp/prompts/bedrock_entity_workflow.md
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

## Required Local Completion

Use local Codex/Opencode with Bun. Do not run a model-authoring benchmark or live visual acceptance during this completion.

1. Start from current `Local` and apply/recover the exact unreferenced candidate `50367a1f6c670856102467fe63111ed019077f0c` without creating a permanent parking branch.
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

3. Review the generated changes. Expected generated owners are:

```text
mcp/prompts/manifest.json
mcp/docs/api.json
mcp/docs/index.html
```

Do not hand-edit those generated files.
4. Confirm the source candidate plus generated artifacts form one coherent public-contract change and that no unrelated diff was introduced.
5. Re-fetch `Local` HEAD. If it moved materially, reconcile before landing; never force.
6. Land one coherent commit on `Local`, then observe available CI/status. Do not claim live Blockbench/model quality from this static completion.
7. Update this continuation owner to the new current state and **STOP**.

## Deferred Until Evidence

Do not implement these during local completion:

- aggregate `list_textures` Box-UV working map;
- Painter operation batching;
- telemetry/session logger;
- new MCP tools/router/profile;
- live authoring/model test.

Fresh models already return `box_uv_region`; promote aggregate recovery only if resumed/existing-model work later proves Cube-by-Cube inspection is material waste.

## Proof Boundary

The candidate is source/test preparation only until the canonical Bun generator and repository gates run. The active `Local` public MCP contract is **not yet changed** by this candidate. No better visual quality or Authoring Efficiency is claimed.

## STOP

The only next implementation step is the bounded local Bun completion above. Live model retesting remains explicitly deferred by the user.
