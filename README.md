# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. The product goal is a clean editable `.bbmodel` that follows an approved visual reference through the shortest evidence-backed workflow.

`Local` is the current product/development branch. Historical/reference branches are not current execution authority.

## Start By Task

Root [`AGENTS.md`](AGENTS.md) owns routing. [`docs/knowledge/flow.md`](docs/knowledge/flow.md) is the single detailed current flow.

### Reference preparation

```text
source image / user intent
→ blockbench-reference-generator
→ assisted intake + internal brief
→ pre-generation readiness
→ READY? generate one Draft
→ visual gate / max one targeted correction
→ user approval
```

**Generation is output, not discovery.** If material identity/form/buildability is still unresolved, clarify within the bounded intake rule or stop at `NEEDS REVIEW`; do not generate a speculative Draft.

This route is image-only. It does not call BlockIT MCP, author geometry, or create ZIP/manifest/production packages.

### Asset authoring

After a reference is approved:

```text
current request + actual approved reference image
→ blockit-bedrock-entity-mcp
→ only the active modelling, texturing, or animation specialist
→ BlockIT MCP
```

Do not automatically load repository history, `CONTEXT.md`, `next-action.md`, or development skills for ordinary asset authoring.

### Repository / plugin continuation

```text
AGENTS.md
→ docs/knowledge/next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ named MCP-tool defect? implementation-map Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief
```

The Local Acceptance Runbook is completed procedure/history and is inactive unless explicitly reactivated.

## Product Flow

At product level, BlockIT has three clean stages:

```text
1. PREPARE REFERENCE
   understand target → readiness → Draft → user approval

2. AUTHOR BEDROCK MODEL
   actual approved image → grounded primary form → visual comparison → bounded correction

3. FINISH ASSET
   secondary geometry → texture/PBR if needed → animation if needed → validation → export
```

The detailed Reference Fidelity sequence, failure handling, and evidence boundary live in [`docs/knowledge/flow.md`](docs/knowledge/flow.md).

Tool success is execution evidence, not visual approval. A filename/path/manifest/prose summary is not visual evidence. `BLOCKED` / `NEEDS REVIEW` are valid when continuation would require guessing.

## Repository Map

| Path | Purpose |
|---|---|
| `.agents/skills/` | canonical repository-owned skills |
| `mcp/` | BlockIT MCP source/build/tests/generated API docs |
| `workspace/` | model/reference packages and fixtures |
| `docs/foundation/` | durable product/reference/modelling policy |
| `docs/knowledge/` | continuity, flow, ownership, decisions, reviews, operations |

## Skill Surface

```text
reference preparation:
  blockbench-reference-generator

asset authoring:
  blockit-bedrock-entity-mcp
  ├─ blockbench-bedrock-modelling
  ├─ blockit-bedrock-texturing
  └─ blockit-bedrock-animation

repository development:
  development-brief
  mcp-server-development
  blockbench-runtime-development
  typescript-type-safety
  bun-tooling
```

Select by the current boundary; never load all skills by ritual.

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Production output is `mcp/dist/mcp.js`. Do not use the upstream hosted Blockbench MCP plugin as proof of BlockIT; load the repository build when runtime validation is explicitly active.

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

See [`mcp/README.md`](mcp/README.md) for runtime/build details.

## Current Accepted State

The 2026-08-12 bounded local acceptance pass verified representative runtime transport, geometry/correction/Undo, reference-fidelity behavior, texture/Paint/PBR/material instances, animation playback, Locator/Null Object lifecycle, and `.bbmodel`/Bedrock export persistence.

Fresh GitHub/CI serialized surface:

```text
62 tools
75,926 tools/list response characters
52,842 input-schema characters
10,783 description characters
initialize instructions: 386 characters
```

`export_model` remains exposed; `list_export_formats`, `apply_texture`, and `filter_by_material` are absent from the default callable surface; `risky_eval` and `from_geo_json` remain disabled.

**P0–P7, assisted Reference Generator intake/readiness, and professional PRO-1–PRO-6 contracts are implemented on `Local` unless a specific accepted live baseline applies.** Installed Codex deferred-search parity, actual model-visible token/latency/image-context cost, generated-reference quality, and P5–P7 model-facing effectiveness remain direct/local evidence questions when explicitly activated.

Character counts are not token measurements.

## Hygiene

- generated MCP API docs are tracked and checked for freshness;
- transient build/editor/preview state is ignored;
- historical implementation belongs in Git/reviews, not duplicate active plans;
- `docs/knowledge/flow.md` owns the detailed current flow; entrypoints should not duplicate it;
- current-state docs must be synchronized when continuation changes;
- do not add routers/profiles/scorers/packaging without a concrete failure proving the minimal path insufficient.

## License / Upstream

GPL-3.0-only; see [`LICENSE`](LICENSE). BlockIT retains upstream attribution while its Bedrock-focused product surface and repository workflow remain project-owned.
