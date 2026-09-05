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
build/          build/docs/prompt generation + developer watch policy
scripts/        verification/measurement/preparation/local-deploy utilities
tests/          contract/integration regressions
docs/           generated API docs; never hand-edit generated entries
```

Use the affected owner + direct callers first. Do not scan every tool family for a bounded change.

TypeScript and Bun are implementation mechanics, not root Skill routes; keep compiler/build issues with the exact affected source/build owner and route only exposed MCP/runtime semantics to the matching specialist.

## Execution Context / Proof Ceiling

Use the root execution-context names by capability, not product/UI label:

```text
REMOTE_GITHUB   = repository edits + GitHub Actions/source/CI proof
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed/reloaded BlockIT + reconnected live MCP client
```

- `REMOTE_GITHUB` may implement MCP changes when acceptance is fully source/static/CI-verifiable. It cannot claim local command execution, canonical generated output it cannot produce, installed-plugin freshness, or live Blockbench behavior.
- `LOCAL_CODE` owns local generators, typecheck/tests/build, filesystem behavior, and exact generated-artifact synchronization. A successful local build still does not prove the installed Blockbench runtime.
- `LIVE_BLOCKBENCH` is required for `verify:stateless-local`, installed `build_identity`, live `tools/list`, Undo/playback/persistence, and model/visual/runtime proof.

If complete delivery needs generated output or runtime proof above the current ceiling, transfer **before substantial edits accumulate**. Do not use CI to author generated files and do not hand-edit generated output.

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
LOCAL_CODE or LIVE_BLOCKBENCH can run docs:build + docs:check?
  YES → continue
  NO / REMOTE_GITHUB → transfer or STOP/defer before source edits accumulate
```

Before substantial editing of canonical runtime prompt source:

```text
LOCAL_CODE or LIVE_BLOCKBENCH can run prompts:build
+ carry prompts/manifest.json in the same logical delivery?
  YES → continue
  NO / REMOTE_GITHUB → transfer or STOP/defer before prompt edits accumulate
```

The same package version + canonical prompt content must produce the same manifest bytes; no wall-clock-only metadata. GitHub Actions may verify generated freshness, but is not the authoring path and must not create/commit generated output to `Local`.

Public schema/description/spec change: edit source → update manifest ownership only when needed → `bun run docs:build` → `bun run docs:check`.

Canonical runtime prompt change: edit source → `bun run prompts:build` → include `prompts/manifest.json` in the same logical delivery.

Runtime bundles only prompts intentionally exposed by `server/prompts.ts`; maintainer Markdown stays source-only unless explicitly exposed.

## Dependency Closure

Before a cross-surface MCP change is considered complete, classify every materially affected dependent as one of:

```text
SHARED SOURCE     same import-safe spec/constant can own runtime + generated-description metadata
GENERATED         canonical source must regenerate committed output
SEMANTIC MIRROR   distinct human-owned surface must preserve the same invariant through regression tests
CI ROUTING        the verifier that owns the invariant must actually run for the changed path
```

Closure rules:

- Prefer **SHARED SOURCE** over copying the same public metadata into runtime/docs/UI when the code can stay import-safe.
- **GENERATED** output is never a second owner; regenerate it from canonical source and fail freshness checks when stale.
- Use **SEMANTIC MIRROR** only where separate human-facing owners are intentional; protect the invariant, forbidden stale concepts, and workflow ordering rather than cosmetic prose.
- Treat missing **CI ROUTING** as a routing defect: update the workflow/path owner instead of weakening tests or changing unrelated source.
- Do not auto-rewrite `CONTEXT.md`, proof state, continuation state, Skills, or human-owned docs from source code. Their semantics remain manually owned and test-protected.
- If any required GENERATED dependent cannot be produced in the current execution context, transfer before mutating its canonical source.

For LOCAL_CODE cross-surface work, `bun run verify:closure` is the compact closure gate: repository semantic contracts → authoring semantic contracts → generated freshness. It does **not** replace `verify:mcp` when executable or public MCP behavior changed.

### Change Closure Gate

Before the first mutation of any cross-surface MCP or authoring contract, build a **transient impact map**; do not create a persisted checklist/roadmap file:

```text
canonical owner
SHARED SOURCE dependents
GENERATED dependents
SEMANTIC MIRROR dependents
CI ROUTING
state/proof owners if their state actually changes
```

Every material row must end as `UPDATED | VERIFIED_UNCHANGED | NOT_APPLICABLE` before completion.

Minimum impact rules:

- authoring semantics / stage / handoff → `docs/knowledge/flow.md`, affected router/specialist Skills, runtime prompt/phase/handoff contract when exposed, Local Acceptance runbook, and semantic regressions;
- public Tool / Resource / Prompt → exact source owner, direct callers, docs/prompt generator owner + committed generated output, contract tests, and Gateway only when boundary/discovery semantics actually change;
- implementation-only change → implementation + direct regressions; do not churn Flow/Skills/docs when public semantics and proof state are unchanged;
- proof/continuation → update `current-validation.md` / `next-action.md` only after corresponding evidence or continuation state actually changes.

If any required generated dependent cannot be produced in the current execution context, transfer before editing its canonical source. Completion requires no unclassified material dependent, then `verify:closure`; add `verify:mcp` whenever executable or public MCP behavior changed.

## Verification

Verification follows the changed claim; `package.json` owns verifier composition so CI, local work, and docs do not maintain separate command lists.

Canonical entrypoints from `mcp/`:

```text
repository-policy / repository-static contract → bun run verify:repository
authoring-policy / authoring-static contract   → bun run verify:authoring
cross-surface dependency closure               → bun run verify:closure
executable or public MCP behavior              → bun run verify:mcp
main release boundary                           → bun run verify:release
```

### During iteration

- `LOCAL_CODE` / `LIVE_BLOCKBENCH`: run the smallest local regression that can falsify the change; run `typecheck` when useful.
- `REMOTE_GITHUB`: inspect the smallest relevant GitHub Actions proof; do not treat CI as local execution.
- Regenerate affected docs/prompt output before final delivery when the current context can canonically do so.
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
