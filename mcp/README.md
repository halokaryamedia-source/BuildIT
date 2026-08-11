# BlockIT — Bedrock Entity MCP

BlockIT is a Minecraft **Bedrock Entity-focused** MCP server/plugin that runs inside desktop Blockbench. `Local` is the current development authority.

Do **not** use the upstream hosted Jason J. Gardner plugin when validating BlockIT. That artifact is a different generic product surface.

## Build / verify

From this directory:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production output:

```text
dist/mcp.js
```

Load that file as a local Blockbench plugin.

Local stateless smoke, after the plugin is running:

```bash
bun run verify:stateless-local
```

## Endpoint

Default:

```text
http://127.0.0.1:3000/bb-mcp
```

The server binds to loopback and uses request-owned stateless Streamable HTTP with JSON responses.

Blockbench settings under **Settings → General**:

- MCP Server Port
- MCP Server Endpoint
- Extended MCP Families — off by default

Extended families expose only retained generic fallback families; individually quarantined tools such as `risky_eval` and `from_geo_json` remain disabled.

## Product boundary

Normal BlockIT work targets Blockbench `bedrock` projects and preserves Bedrock-relevant capability:

- Cube/Cuboid geometry;
- Group/bone hierarchy and pivots;
- deterministic project/element observation;
- bounded visual model-view capture;
- texture/Painter/PBR/material-instance workflows;
- Bedrock animation/BoneAnimator workflows;
- Locator / Null Object authored state;
- Undo/history;
- editable `.bbmodel` and Bedrock geometry export.

Generic Mesh/Hytale paths, risky evaluation, and screen-coordinate UI automation are not normal Bedrock Entity authoring capability.

## Current default surface

Pinned-SDK baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Bedrock Entity is native `single_texture`; active/default texture lifecycle remains available while generic raw per-face texture identity tools are not exposed by default.

## Agent / local acceptance route

Repository-owned skills live at root `.agents/skills/`, not under this package.

For normal asset authoring:

```text
blockit-bedrock-entity-mcp
→ active modelling/texturing/animation specialist only
```

For current repository continuation, use root `docs/knowledge/next-action.md`. The current local procedure is `docs/knowledge/operations/local-acceptance-runbook.md`.

Do not use deleted nested `.github` prompts/instructions or standalone upstream guidance; root `AGENTS.md` and this package's `AGENTS.md` own current development rules.

## Source layout

```text
index.ts             plugin entry/lifecycle
server/              MCP server, transport, tools, resources, prompts
lib/                 shared schemas/factories/runtime helpers
ui/                  Blockbench panel/settings
prompts/             bundled prompt sources
build/               Bun build/docs tooling
scripts/             deliberate local verification helpers
tests/               contract/integration regressions
docs/                generated API documentation
```

`docs/api.json` and `docs/index.html` are generated outputs intentionally kept under version control and verified with `bun run docs:check`; do not hand-edit generated entries.

## Adding/changing MCP behavior

Follow `AGENTS.md` in this directory:

- strict TypeScript;
- full Zod input validation;
- no Blockbench globals during schema construction;
- `createTool` / existing factory patterns;
- smallest complete owner-specific change;
- generated docs freshness;
- local Blockbench proof for runtime/visual claims.

Do not introduce compatibility shims, duplicated project tools, new routers/profiles, or generic import/eval capability without a proved current need.

## License / Upstream attribution

The repository is licensed under GPL-3.0-only; see root `../LICENSE`.

BlockIT's MCP implementation is derived from the open-source Blockbench MCP work by Jason J. Gardner and contributors. Contributor attribution is also retained in `package.json`. BlockIT's product identity and Bedrock-focused defaults distinguish this fork from the upstream hosted plugin.
