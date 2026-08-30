# MCP Package Rules

Applies to `mcp/**`. Root `../AGENTS.md` owns repository routing, proof economy, evidence labels, communication, and general work discipline. This file keeps only MCP-package rules that change implementation decisions.

## Source Ownership

```text
index.ts        plugin lifecycle
server/         MCP transport/tools/resources/prompts
server/tools/   authored model/texture/animation operations
lib/            shared schemas/factories/identity/runtime helpers
ui/             Blockbench panel/settings
prompts/        canonical prompt sources + generated manifest
build/          build/docs/prompt generation
scripts/        deliberate verification helpers
tests/          contract/integration regressions
docs/           generated API docs; never hand-edit generated entries
```

Use the affected owner + direct callers first. Do not scan every tool family for a bounded change.

TypeScript and Bun are implementation mechanics, not root Skill routes; keep compiler/build issues with the exact affected source/build owner and route only exposed MCP/runtime semantics to the matching specialist.

## MCP Public Contract Pattern

Tool modules stay import-safe outside Blockbench because Bun/Node loads schemas for docs/tests.

At module scope:
- export the exact Zod parameter schema and domain `ToolSpec[]`;
- do not read Blockbench runtime globals.

At registration/execution:
- register through existing `createTool`/family ownership;
- keep full runtime validation on the original schema;
- preserve annotations and deterministic identities;
- use Blockbench globals only where runtime execution owns them.

If a broad `ToolSpec` spread weakens inference, restate the same concrete `parameters` schema in `createTool`; do not weaken or duplicate the contract.

## Input / Identity Rules

- Validate MCP input at the boundary and match optional/default/nullability/refinement to execution.
- Reuse shared schemas/identity resolvers; prefer UUID, then documented unique exact-name/ID fallback.
- Ambiguous explicit targets fail closed; never silently choose editor selection or the first match.
- Schema construction stays free of Blockbench globals; live-format checks belong in execution.
- Reject provable destructive no-ops before Undo.

## Result / Context Efficiency

`structuredContent` is canonical machine-readable state when available.

- Do not mirror identical full JSON in `content.text`; use a short useful summary.
- Keep discovery/list tools summary-first; focused reads own detail.
- Reuse mutation-returned authored state instead of immediate confirmation reads.
- Filesystem export is metadata-first after a verified write; return compiled content only when requested.
- Do not remove legitimate authored fields or impose global limits merely to reduce size.

## Generated Documentation / Prompts

`build/docs-manifest.ts` owns generated API surface; `build/docs.ts` writes `docs/api.json` and `docs/index.html`.

Before substantial implementation that can change a public schema/description/spec:

```text
will generated API change?
→ active channel can run bun run docs:build + bun run docs:check?
  YES → continue
  NO  → switch to fitting local/Codex workspace or STOP/defer before source edits accumulate
```

Before substantial editing of canonical runtime prompt source:

```text
active channel can run bun run prompts:build
+ carry prompts/manifest.json in the same logical delivery?
  YES → continue
  NO  → switch or STOP/defer before prompt edits accumulate
```

The same package version + canonical prompt content must produce the same manifest bytes; no wall-clock-only metadata. GitHub Actions may verify generated freshness, but is not the authoring path and must not create/commit generated output to `Local`.

Public schema/description/spec change: edit source → update manifest ownership only when needed → `bun run docs:build` → `bun run docs:check`.

Canonical runtime prompt change: edit source → `bun run prompts:build` → include `prompts/manifest.json` in the same logical delivery.

Runtime bundles only prompts intentionally exposed by `server/prompts.ts`; maintainer Markdown stays source-only unless explicitly exposed.

## Verification

Verification follows the changed claim; `package.json` owns verifier composition so CI, local work, and docs do not maintain separate command lists.

Canonical entrypoints from `mcp/`:

```text
repository-policy / repository-static contract → bun run verify:repository
authoring-policy / authoring-static contract   → bun run verify:authoring
executable or public MCP behavior               → bun run verify:mcp
main release boundary                           → bun run verify:release
```

### During iteration

- Run the smallest regression that can falsify the change.
- Run `bun run typecheck` when TypeScript/source shape makes it useful.
- Regenerate affected docs/prompt output before final delivery.
- Do not rerun a canonical full verifier after each edit.

### Final MCP gate

For one final logical change affecting executable source, public MCP contracts, build output, or generated ownership:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

A file under `mcp/tests/` alone never upgrades a static policy change into a full MCP gate. GitHub/static proof covers source contracts/buildability, not live Blockbench rendering, Undo, playback, persistence, or visual fidelity.

## Security / Capability Boundary

- Keep default server exposure loopback-only with present-Origin validation.
- `risky_eval` and `from_geo_json` remain disabled.
- Do not broaden network exposure without separately reviewed authentication design.
- Do not add routers/profiles/frameworks, generic importers, alternate transports, or replacement schema/server stacks without a proved requirement.
- Preserve retained Bedrock capability; lower tool count is not itself a product requirement.
- Keep dependencies lean and never commit secrets.
