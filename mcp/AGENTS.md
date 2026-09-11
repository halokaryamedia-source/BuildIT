# MCP Package Rules

Applies to `mcp/**`. Root `../AGENTS.md` owns repository routing, proof economy, evidence labels, communication and general work discipline. This file keeps only MCP-package rules that change implementation decisions.

## Source Ownership

```text
index.ts                 Blockbench plugin orchestration only
plugin/                  Runtime host, Blockbench integration, dev reload ownership
server/net.ts            Runtime HTTP/MCP transport + request serialization
server/runtime/          registration/surface/consolidation/phase/bootstrap ownership
server/tools/            authored Geometry/Texture/Animation/Particle/etc implementations
server/resources/        Runtime Resource implementations
server/prompts.ts        Runtime Prompt registration
lib/                     shared schemas/metadata/readiness/factories/runtime helpers
ui/                      Blockbench UI implementation details used by plugin integration
prompts/                 canonical prompt source + generated manifest
build/                   build/docs/prompt generation + watch policy
scripts/                 verification/measurement/deploy utilities
tests/                   contract/integration regressions
docs/                    generated API docs; never hand-edit generated entries
```

Use the affected owner + direct callers first. Do not scan every Tool family for a bounded change.

`server/tools.ts` is a thin compatibility facade. Do not move Runtime state ownership back into it.

## Execution Context / Proof Ceiling

Use execution-context names by capability:

```text
REMOTE_GITHUB   = repository edits + source/static/available CI proof
LOCAL_CODE      = local checkout + Bun/tests/typecheck/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed current Runtime + functioning persistent Gateway/Runtime connection
```

Rules:

- `REMOTE_GITHUB` is the default workbench for exact-source diagnosis, implementation, regression intent, CI routing, deterministic fixtures and live-harness preparation.
- `LOCAL_CODE` owns dependency/lockfile work, canonical generators and local verification that cannot be established through GitHub source inspection.
- `LIVE_BLOCKBENCH` is required for installed `build_identity`, native runtime behavior, Undo/playback/persistence/export, Blockbench lifecycle and visual proof.
- Runtime/plugin/Blockbench recovery is expected to occur **beneath the persistent Gateway**. Do not require a new Codex task/chat or client reconnect merely because the Runtime/plugin was reloaded or rebuilt. Client reconnect is required only when the Gateway process itself is replaced or dies.
- A higher-context residue does not transfer the entire task. Complete independent source work first and hand off only what intrinsically requires local/live execution.
- Static/source proof never becomes native/visual proof by wording.

## Public Boundary

Normal AI clients connect to the stable Gateway, not directly to Runtime.

Gateway public tools remain exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Do not add client-visible Gateway tools without an explicit product requirement.

Runtime remains a Bedrock-focused capability execution surface. Gateway remains the stable client/recovery boundary. Control remains routing/context projection. None may absorb another layer's workflow or implementation ownership.

## Tool Contract / Zero Capability Loss

Tool modules must remain import-safe outside Blockbench because Bun/Node loads schemas for docs/tests.

At module scope:
- export exact Zod schemas / Tool specs;
- do not read Blockbench globals.

At registration/execution:
- register through existing factories/family ownership;
- validate through the canonical runtime schema before execution;
- preserve annotations, deterministic identity and structured result semantics;
- use Blockbench globals only inside runtime-owned execution.

Optimization rule:

> **Capability/intelligence loss is forbidden as an efficiency technique.**

Do not reduce:
- operations/branches;
- validation/refinements/defaults;
- native handling;
- recovery safety;
- Geometry/Texture/Animation/Particle intelligence;
- legitimate authored fields.

Consolidation is routing-only:

```text
public consolidated capability
→ declarative route
→ retained original executor
→ original implementation
```

Unknown branches fail explicitly; never silently fall back to a weaker/different executor.

## Identity / Mutation Safety

- Prefer UUID, then documented unique exact-name/ID fallback.
- Ambiguous explicit targets fail closed.
- Never silently choose selection or first match for a destructive request.
- Reject provable destructive no-ops before Undo.
- Keep mutations serialized where Runtime safety requires it.
- Interrupted mutation with uncertain outcome is **not auto-retried**. Inspect current authored state first.

## Result / Context Efficiency

`structuredContent` is canonical machine-readable state when available.

- Do not mirror identical full JSON in `content.text`; return a compact useful summary.
- Discovery/list surfaces stay summary-first; focused reads own detail.
- Reuse mutation-returned authored state instead of immediate confirmation rereads.
- Keep diagnostics optional/bounded where the implementation already provides that distinction.
- Do not remove legitimate capability or fields merely to reduce payload size.
- Optimize **Cost to Accepted Result**, not static character count or tool count.

## Capability Metadata / Effects

Canonical capability tier/search/effects owner:

```text
lib/capabilityMetadata.ts
```

Gateway/Runtime transport must not grow capability-name special cases when declarative metadata can own the behavior.

Canonical authoring phase classification owner:

```text
lib/authoringPhase.ts
```

Do not create a second Geometry/Texturing/Animation capability table in Control/Gateway/Plugin.

## Runtime Ownership

Canonical Runtime structure:

```text
server/net.ts
→ transport + serialized operation boundary + affinity/generation safety

server/runtime/registration.ts
→ catalog/surface/profile state

server/runtime/consolidatedRoutes.ts
→ family/discriminator/executor route metadata

server/runtime/consolidatedTools.ts
→ routing-only consolidated wrappers

server/runtime/phaseControl.ts
→ AUTHORING↔Animation capability

server/runtime/bootstrap.ts
→ exactly-once intelligence wiring

server/tools/**
→ domain implementations
```

Request-owned MCP server reconstruction may remain stateless/lightweight. Do not replace it with a shared mutable MCP server merely for micro-optimization.

Surface/phase changes must invalidate only caches whose semantics actually changed.

## Plugin Ownership

```text
index.ts
→ lifecycle orchestration only

plugin/runtimeHost.ts
→ native network permission + listener lifecycle

plugin/blockbenchIntegration.ts
→ settings/UI/prompts/resources setup/teardown

plugin/devSync.ts
→ development watcher/reload only
```

Setup/teardown should be idempotent/defensive. Do not let native listener, watcher, settings or UI ownership grow back into `index.ts`.

## Validation / QA / Handoff

Technical validation and approval are distinct.

Canonical Animation handoff readiness:

```text
lib/authoringReadiness.ts
→ USER_APPROVED | AUTONOMOUS_VERIFIED
```

Canonical Validator projection:

```text
lib/validationVerdict.ts
→ BLOCKED | REVIEW_REQUIRED | VALIDATOR_CLEAR
```

`VALIDATOR_CLEAR`, internal quality PASS, tool success, export success, bounds, hierarchy or similarity metrics **never equal user approval or visual PASS**.

Control lifecycle readiness is orientation/state projection; it does not authorize AUTHORING↔Animation by itself.

## Context / Skills Boundary

Canonical context policy:

```text
../docs/04-system/ai-context-loading.md
../docs/04-system/authoring-stage-context.md
../docs/04-system/control/context-projection.md
```

Load one active specialist per authoring semantic owner. Geometry may add exactly one selected primary modelling profile. Do not load all profiles/stages as reassurance.

Shared Stage Context is a semantic contract, not another Skill/router/manager/workflow engine.

## Generated Documentation / Prompts

Generated outputs are not second owners.

API docs:

```text
build/docs-manifest.ts → build/docs.ts → docs/api.json + docs/index.html
```

Runtime prompt:

```text
prompts/bedrock_entity_workflow.md → prompts/manifest.json via canonical generator
```

Before changing canonical source that requires generated committed output, confirm the current execution context can run the required generator. If not, finish independent source/test/harness work and leave only the generator-coupled residue for `LOCAL_CODE`.

Never hand-edit generated API/prompt output to simulate generator freshness.

GitHub Actions may verify freshness or emit exact-SHA build artifacts, but must not become the canonical generator authoring path.

## Dependency Closure

For cross-surface changes, classify materially affected dependents:

```text
SHARED SOURCE
GENERATED
SEMANTIC MIRROR
CI ROUTING
```

Prefer shared source over duplicated metadata. Generated files are outputs, not authority. Human-owned docs/Skills remain human-owned semantic mirrors when needed.

Update `docs/05-operations/current-validation.md` / `next-action.md` only when proof or continuation state actually changes.

## Test Ownership / Anti-Stale

Tests are evidence, not prose snapshots.

- Prefer imported behavior/schema/result/ownership assertions.
- Use source-string assertions only where import-safe proof is unavailable; match stable semantic invariants, not formatting.
- Keep one primary regression owner per recurring defect unless separate layers prove different boundaries.
- If product behavior is correct and a test encodes retired architecture, fix/remove the stale test; do not reintroduce old architecture to satisfy it.
- A weaker duplicate test with no distinct failure mode should be merged or removed.

Test layers:

```text
tests/*.test.ts            executable/import-safe runtime contracts
tests/authoring/*.test.ts  authoring semantics/policy
tests/repository/*.test.ts repository/docs/CI ownership
```

Tests added remotely are regression intent until they actually run.

## Verification

Canonical local entrypoints from `mcp/` remain package-script owned. During iteration run the smallest test that can falsify the current change. Run broad/full verification once as terminal evidence, not after every edit.

Typical final source gate:

```bash
bun install --frozen-lockfile
bun run verify:full
```

Use narrower canonical scripts when the claim is narrower. Generated freshness must be produced/checked by its owning generator path.

## Security / Capability Boundary

- Keep Runtime/Gateway exposure loopback-only with existing local Host/Origin protections.
- `risky_eval` and `from_geo_json` remain disabled.
- Do not broaden network exposure without separately reviewed authentication design.
- Do not add alternate transports, schema/server stacks, generic importers, routers/profiles/frameworks or parallel authored-state systems without a proved requirement.
- Keep dependencies lean and never commit secrets.
- Compatibility-bound BlockIT package/plugin/protocol/environment identifiers remain unchanged until separately dependency-mapped; do not bulk-rename them.

## Completion Rule

A remote change is complete when its source owner, direct dependents and regression intent are aligned and all unavailable local/live proof is stated accurately. Stop rather than inventing another cleanup layer.