# BlockIT — Bedrock Entity MCP

BlockIT is a Minecraft **Bedrock Entity-focused** MCP plugin/server running inside desktop Blockbench. Current product authority is repository `halokaryamedia-source/BuildIT`, branch `Local`.

Do **not** use the upstream hosted Blockbench MCP binary as proof of BlockIT; it is a different product surface.

## Current Local Acceptance Entry Point

For the active repository-continuation task, Codex should follow:

```text
AGENTS.md
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ docs/knowledge/operations/local-acceptance-runbook.md
→ this README + mcp/AGENTS.md
```

Do not replan from historical reviews before running the baseline acceptance procedure. The baseline collects evidence; source edits start only after a failure is reproduced and classified.

Ordinary asset-authoring tasks are different: root `AGENTS.md` routes them directly through the BlockIT asset orchestrator and the active modelling/texturing/animation specialist without booting repository history.

## Build Current Local Plugin

From repository root:

```bash
git checkout Local
cd mcp
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production plugin:

```text
mcp/dist/mcp.js
```

Load that file as a local Blockbench plugin.

## MCP Endpoint

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

The current default path is loopback request-owned stateless Streamable HTTP with JSON responses. Settings are under Blockbench **Settings → General**:

- MCP Server Port
- MCP Server Endpoint
- Extended MCP Families — **off for the baseline**

With BlockIT running, local transport smoke:

```bash
bun run verify:stateless-local
```

## Current Default Surface Baseline

Pinned-SDK non-local measurement for the current pre-local source state:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Expected default containment:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Do not change this surface during the baseline merely because the raw count appears large. Local acceptance first measures how the installed Codex client actually exposes/searches the catalog.

## Product Boundary

Normal BlockIT work targets Minecraft Bedrock Entity (`bedrock`). Retained product areas include:

- Cube/Cuboid geometry and Group/bone hierarchy;
- deterministic identity/discovery and authored-state inspection;
- named model-view observation and structural bounds;
- texture/Painter/PBR/material-instance capability;
- Bedrock animation/BoneAnimator/keyframe/timeline capability;
- Locator / Null Object authored-state operations;
- Undo/history/recovery and product export outcomes.

Generic Blockbench Mesh/Hytale/eval/UI-automation paths are not normal Bedrock capability. Native Bedrock `TextureMesh` is a distinct protected gap, not permission to re-enable generic Mesh modelling.

## Agent-Facing Authoring Route

Repository-owned skills live under root `.agents/skills/`:

```text
blockit-bedrock-entity-mcp        orchestrator
├─ blockbench-bedrock-modelling  form / hierarchy / visual judgement
├─ blockit-bedrock-texturing     texture / Paint / PBR / material_instance
└─ blockit-bedrock-animation     animation / keyframes / playback / effects
```

Canonical bundled MCP prompt:

```text
mcp/prompts/bedrock_entity_workflow.md
```

The catalog is capability, not a checklist. Reuse fresh returned state and keep reads/captures/specialist loads bounded to decisions that need them.

## Local Acceptance

Exact procedure:

`docs/knowledge/operations/local-acceptance-runbook.md`

It covers:

- environment/build/plugin load;
- stateless transport;
- native Codex deferred/tool-search behavior;
- deterministic Cube/Group smoke asset + correction/Undo;
- texture/Painter/PBR/material-instance reachability;
- animation reachability/playback;
- Locator/Null Object operations;
- `.bbmodel` save/reopen + Bedrock export;
- a real approved-reference difference-first scenario;
- efficiency/redundant-call trace;
- failure classification before any source fix.

## Source Engineering Rules

See [`AGENTS.md`](AGENTS.md) in this directory before changing `mcp/**`.

Expected source gates remain:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Generated `mcp/docs/api.json` and `mcp/docs/index.html` are secondary to source and must not be hand-edited to bypass freshness checks.

GitHub/source checks do not replace live Blockbench proof for rendering, image transport, Undo, playback, persistence, or visual fidelity.

## Upstream Attribution

BlockIT's MCP implementation derives from the open-source Blockbench MCP work by Jason J. Gardner and contributors. Upstream attribution/license remain preserved; BlockIT product identity and current `Local` source distinguish this Bedrock-focused fork from the upstream hosted plugin.
