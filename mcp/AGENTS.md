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

- `REMOTE_GITHUB` is the default MCP development workbench for exact-source diagnosis, implementation, regression/static tests, CI routing, verified build artifacts, deterministic fixtures, and live-harness preparation when those claims are source/static/CI-verifiable.
- `LOCAL_CODE` owns canonical generator-authored committed output, dependency/lockfile mutation, and filesystem/toolchain work that cannot be authored through the current GitHub capability. A successful local build still does not prove installed Blockbench runtime.
- `LIVE_BLOCKBENCH` is required for installed `build_identity`, native `tools/list`/runtime behavior, Undo/playback/persistence, and model/visual proof. `verify:stateless-local` remains a diagnostic live command, not a mandatory extra step when a later live verifier already performs the shared freshness/runtime preflight.

A higher-context dependency does **not** transfer the whole MCP task. Complete all independent GitHub-verifiable source/test/harness/provenance work first, then hand off only the minimum generator/filesystem/native residue. Do not use CI to author generated files and do not hand-edit generated output.

Read-only CI may produce and upload an **exact-SHA verified build artifact** after the owning verifier passes. It must carry source SHA plus bundle hash/build identity/toolchain/verifier provenance, must not commit back, and is still source/build evidence rather than installed-live proof.

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
  YES → canonical source + generated output may be delivered together
  NO / REMOTE_GITHUB → partition first: finish independent diagnosis/tests/harness/CI prep;
                       STOP/defer only the canonical source edit that would require unavailable generated output
```

Before substantial editing of canonical runtime prompt source:

```text
LOCAL_CODE or LIVE_BLOCKBENCH can run prompts:build
+ carry prompts/manifest.json in the same logical delivery?
  YES → canonical prompt + manifest may be delivered together
  NO / REMOTE_GITHUB → partition first: finish independent regression/routing/preparation work;
                       STOP/defer only the prompt-source/generation residue
```

The same package version + canonical prompt content must produce the same manifest bytes; no wall-clock-only metadata. GitHub Actions may verify generated freshness and emit verified build artifacts, but is not the authoring path and must not create/commit generated output to `Local`.

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
- If a required **GENERATED** dependent cannot be produced in the current context, do not mutate the canonical source into an incomplete state. Finish independent GitHub-verifiable work, then transfer only the source+generation residue.

For LOCAL_CODE cross-surface work, `bun run verify:closure` is the compact closure gate: repository semantic contracts → authoring semantic contracts → generated freshness. It does **not** replace `verify:mcp` when executable or public MCP behavior changed.

### Change Closure Gate

Before the first mutation of any cross-surface MCP or authoring contract, build a **transient impact map**; do not create a persisted checklist/roadmap file:

```text
canonical owner
SHARED SOURCE dependents
GENERATED dependents
SEMANTIC MIRROR dependents
CI ROUTING
GitHub-verifiable partition
higher-context residue
state/proof owners if their state actually changes
```

Every material row must end as `UPDATED | VERIFIED_UNCHANGED | NOT_APPLICABLE | RESIDUE_HANDOFF` before completion; `RESIDUE_HANDOFF` is valid only when its required capability is intrinsically above `REMOTE_GITHUB`.

Minimum impact rules:

- authoring semantics / stage / handoff → `docs/03-authoring/workflow.md`, affected router/specialist Skills, runtime prompt/phase/handoff contract when exposed, Local Acceptance runbook, and semantic regressions;
- public Tool / Resource / Prompt → exact source owner, direct callers, docs/prompt generator owner + committed generated output, contract tests, and Gateway only when boundary/discovery semantics actually change;
- implementation-only change → implementation + direct regressions; do not churn Product Flow/Skills/docs when public semantics and proof state are unchanged;
- live/native acceptance gap → prepare deterministic verifier/fixture/evidence capture in GitHub when possible; only execution remains live;
- proof/continuation → update `docs/05-operations/current-validation.md` / `docs/05-operations/next-action.md` only after corresponding evidence or continuation state actually changes.

If a generated dependent cannot be produced here, only its coupled canonical edit remains higher-context residue; unrelated regression, routing, harness, provenance, or static acceptance work continues in GitHub. Use `verify:closure` as the compact cross-surface preflight; use `verify:full` once for a final delivery that also affects executable/public MCP behavior.

## Test Ownership / Anti-Stale

Tests are evidence, not prose snapshots.

- Prefer imported behavior, schema, structured result, deterministic ownership, and public-contract assertions over source-string inspection.
- Use source-string assertions only when the boundary cannot be imported safely; match stable identifiers or semantic invariants, not spacing, complete sentences, local variable names, or incidental implementation syntax.
- Keep one primary regression owner per recurring defect. Do not repeat the same invariant in runtime, authoring, and repository suites unless each layer proves a materially different boundary.
- If implementation/semantics are correct and an assertion is stale, fix, merge, or remove the **test owner**; do not rewrite product prose solely to satisfy an old string.
- A test with no current failure mode, no canonical owner, or strictly weaker duplicate coverage should be deleted or merged rather than retained as ceremony.
- During iteration run the smallest named test/file that can falsify the current change. Full verification is terminal evidence, not an edit loop.

Test layers:

```text
tests/*.test.ts              executable/runtime/import-safe contracts
tests/authoring/*.test.ts    authoring semantics and policy
tests/repository/*.test.ts   repository/docs/CI ownership and routing
```

Asset-specific static acceptance may live under `tests/authoring/` when it only validates versioned repository artifacts and never creates visual/native PASS. Keep production Runtime generic.

## Verification

Verification follows the changed claim; `package.json` owns verifier composition so CI, local work, and docs do not maintain separate command lists.

Canonical entrypoints from `mcp/`:

```text
runtime/import-safe test layer                    → bun run test:runtime
repository-policy / repository-static contract    → bun run verify:repository
authoring-policy / authoring-static contract      → bun run verify:authoring
cross-surface dependency closure                  → bun run verify:closure
executable/public MCP + authoring compatibility   → bun run verify:mcp
full repository + MCP final gate                  → bun run verify:full
main release boundary                              → bun run verify:release
```

`verify:mcp` intentionally does not rerun repository tests. `verify:full` composes repository verification with `verify:mcp`, so repository, authoring, and runtime layers each run once in the final full gate.

### During iteration

- `REMOTE_GITHUB`: use exact-SHA CI for source/build proof and prepare later local/live execution as scripts/fixtures rather than prose where practical.
- `LOCAL_CODE` / `LIVE_BLOCKBENCH`: run only checks that were not already accepted on the same clean source SHA or that specifically test the local/native residue.
- Regenerate affected docs/prompt output before final delivery when the current context can canonically do so.
- Do not rerun a canonical full verifier after each edit.

### Final MCP gate

For executable/public MCP changes whose repository-policy owners did not change:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

For cross-surface work or a release candidate, run the non-duplicating full gate once:

```bash
bun install --frozen-lockfile
bun run verify:full
```

A file under `mcp/tests/` alone never upgrades a static policy change into a full MCP gate. GitHub/static proof covers source contracts/buildability and exact-SHA verified build artifacts, not live Blockbench rendering, Undo, playback, persistence, or visual fidelity.

## Security / Capability Boundary

- Keep default server exposure loopback-only with present-Origin validation.
- `risky_eval` and `from_geo_json` remain disabled.
- Do not broaden network exposure without separately reviewed authentication design.
- Do not add routers/profiles/frameworks, generic importers, alternate transports, or replacement schema/server stacks without a proved requirement.
- Preserve retained Bedrock capability; lower tool count is not itself a product requirement.
- Keep dependencies lean and never commit secrets.
