# BlockIT — Bedrock Entity MCP

BlockIT is a Minecraft **Bedrock Entity-focused** MCP server/plugin running inside desktop Blockbench. `Local` is the development authority.

Do **not** use the upstream hosted Jason J. Gardner plugin when validating BlockIT; it is a different generic product surface.

## Build / verify

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production plugin: `dist/mcp.js`.

Runtime-only stateless smoke, when explicitly active:

```bash
bun run verify:stateless-local
```

## Endpoint / containment

Default endpoint: `http://127.0.0.1:3000/bb-mcp`.

The server is loopback-only and request-owned/stateless. Extended MCP Families are off by default; generic fallback families require explicit opt-in. `risky_eval` and `from_geo_json` remain individually disabled.

## Product boundary

Normal `bedrock` capability includes:

- Cube/Cuboid geometry and Group/bone pivots;
- bounded project/element/model-view observation;
- texture/Painter/PBR/material instances;
- Bedrock animation/BoneAnimator workflows;
- Locator / Null Object authored state;
- Undo/history;
- editable `.bbmodel` and Bedrock geometry export.

Generic Mesh/Hytale paths, risky evaluation, and screen-coordinate UI automation are not normal Bedrock Entity authoring capability.

## Accepted default surface

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

These are static baseline measurements, not model-visible token measurements. Current cleanup/testing state belongs in `docs/knowledge/next-action.md`.

## Result / context efficiency

- Exact single-text JSON mirrors of `structuredContent` are compacted at the request-owned registration boundary.
- Meaningful text summaries and images remain intact.
- Filesystem export is metadata-first when a verified path write already delivers the artifact.
- Normal discovery/project/history reads use compact defaults with explicit larger bounds where supported.
- Runtime prompt manifest contains only the callable `bedrock_entity_workflow`; maintainer reference Markdown remains source-only.

## Agent route

Normal asset authoring:

```text
blockit-bedrock-entity-mcp
→ active modelling/texturing/animation specialist only
```

Repository/plugin continuation follows root `AGENTS.md` + `docs/knowledge/next-action.md` + affected source. The first local acceptance pass is complete; its runbook is not default continuation context.

## Source layout

```text
index.ts      plugin entry/lifecycle
server/       MCP server, transport, tools, resources, runtime prompt registration
lib/          shared schemas/factories/runtime helpers
ui/           Blockbench panel/settings
prompts/      canonical runtime prompt + source-only maintainer references + generated runtime manifest
build/        Bun build/docs/manifest tooling
scripts/      deliberate verification helpers
tests/        contract/integration regressions
docs/         generated MCP API documentation
```

`docs/api.json`, `docs/index.html`, and `prompts/manifest.json` are generated through their build owners; do not hand-edit them to bypass freshness or runtime-manifest contracts.

## MCP engineering rules

Follow package `AGENTS.md`: strict TypeScript, complete Zod boundary validation, no Blockbench globals in build-time schemas, existing `createTool`/factory ownership, compact result contracts, smallest complete changes, generated-output freshness, loopback containment, and local proof only for claims that actually require runtime evidence.

Do not add compatibility shims, duplicate project tools, new router/profile layers, or generic import/eval capability without a proved need.

## License / upstream

GPL-3.0-only; see `../LICENSE`. Upstream attribution is retained while BlockIT's Bedrock-focused product surface and workflow remain project-owned.
