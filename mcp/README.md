# BlockIT — Bedrock Entity MCP

BlockIT is a Minecraft **Bedrock Entity-focused** MCP server that runs inside the desktop version of Blockbench. The default product surface preserves native/relevant Bedrock Entity capabilities while generic Blockbench fallback families remain outside the normal profile.

## Current development source

Repository: `halokaryamedia-source/BuildIT`
Working branch for this stabilization line: `Local`

Do **not** use the upstream hosted `jasonjgardner.github.io/.../mcp.js` URL when validating BlockIT. That URL installs a different upstream product surface and cannot prove the behavior of this repository.

### Build and load the Local plugin

```bash
git checkout Local
cd mcp
bun install --frozen-lockfile
bun run build
```

Load the generated `mcp/dist/mcp.js` as a local Blockbench plugin. The BlockIT panel shows the product name, version, active registration profile, endpoint, transport, and truthful exposed surface counts.

## MCP endpoint

Default local endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

The server binds to loopback and uses request-owned stateless Streamable HTTP with JSON responses. Configure MCP clients to connect directly to that URL when they support Streamable HTTP.

Settings are under Blockbench **Settings → General**:

- MCP Server Port
- MCP Server Endpoint
- Extended MCP Families (off by default)

The Extended toggle exposes only source-preserved generic fallback families; individually quarantined tools such as `risky_eval` and `from_geo_json` remain disabled.

## Product boundary

Normal BlockIT work targets Minecraft Bedrock Entity projects (`bedrock`). The trusted path centers on Cube/Cuboid geometry, Group/bone hierarchy, deterministic inspection/canonical views, Bedrock texture/paint/PBR/material-instance capability, Bedrock animation/BoneAnimator capability, undo/history, and current-format export outcomes.

Native Bedrock capabilities must not be removed merely to reduce tool count. See the capability surface audit/matrix under `docs/knowledge/reviews/` before narrowing any family.

## Surface truth

The Blockbench panel distinguishes **exposed** tools/prompts from disabled catalog entries. Resources are reported as **available** for the current runtime. Disabled tool definitions are not executable through the panel test dialog.

## Verification

```bash
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Local stateless transport smoke harness (requires the current BlockIT plugin running in Blockbench):

```bash
bun run verify:stateless-local
```

## Agent skills

The upstream `jasonjgardner/blockbench-mcp-project` skills are useful historical/reference material, but they describe a broader generic Blockbench MCP including Mesh, Hytale, risky evaluation, and other paths that are not the normal BlockIT Bedrock Entity workflow. Do not install them as the canonical BlockIT orchestration layer without adaptation.

Repository-owned BlockIT skills now live under `.agents/skills/`: use `blockit-bedrock-entity-mcp` as the MCP orchestrator, the existing `blockbench-bedrock-modelling` specialist for whole-form geometry judgement, `blockit-bedrock-texturing` for texture/Paint/PBR/material-instance work, and `blockit-bedrock-animation` for Bedrock animation.

## Upstream attribution

BlockIT's MCP implementation is derived from the open-source Blockbench MCP work by Jason J. Gardner and contributors. Upstream attribution and the repository license remain preserved; BlockIT product identity distinguishes this Bedrock-focused fork from the upstream hosted plugin.
