# Particle Promotion Readiness Audit

This document records the promotion-readiness audit for `Experimental/chatgpt-particle-authoring/`. It is planning and source/static evidence only. It does not promote any experimental code into `mcp/**`.

## Audit result

The experiment is mature enough to define a bounded production migration plan, but it is **not yet ready to be promoted** because focused Bun execution has not been performed in `LOCAL_CODE` and public MCP schema changes would require generated-doc closure.

Current recommendation:

```text
KEEP EXPERIMENTAL IMPLEMENTATION IN PLACE
→ run focused local proof
→ promote only shared preflight logic
→ expose through existing inspect_particle / manage_particle
→ regenerate generated API docs
→ run verify:mcp
→ perform live/native visual acceptance separately
```

## Production owners inspected

Current production ownership already has the correct high-level shape:

```text
mcp/server/tools/particle.ts
  inspect_particle
  manage_particle

mcp/lib/bedrockParticleDocument*.ts
mcp/lib/bedrockParticleSemantics.ts
  Bedrock structural/semantic validity

mcp/server/resources/particle.ts
  lazy particle knowledge/workflow

mcp/tests/particle-tool-contract.test.ts
  two-tool public contract
```

The production tool surface already performs parsing, structural/semantic validation, targeted lossless mutation, transactional writes, and native Blockbench preview. The experimental work should therefore extend diagnostics and preflight evidence rather than introduce another particle authoring surface.

## Promotion classification

### Promote as shared import-safe logic

These experimental capabilities are suitable candidates for a new bounded shared helper under `mcp/lib/` after local proof:

1. Snowstorm / Wintersky compatibility diagnostics.
2. Constant-input bounded motion preflight.
3. Motion-envelope evaluation.
4. Bundle/reference integrity checks.
5. Intent-contract validation.
6. Keep-out sample overlap checks.
7. View-distance readability heuristic.
8. Conservative visible-particle budget estimation.

These functions are deterministic, import-safe, and do not require Blockbench globals.

### Promote conditionally

Texture-atlas QA should only be promoted if production can provide decoded RGBA data through an existing image/texture owner.

Do **not** add a PNG decoder or a second image stack inside particle tooling solely for this capability.

### Do not promote as runtime truth

The following must remain outside static/source proof:

- visual quality scoring;
- Snowstorm visual parity claims;
- Minecraft appearance approval;
- Blockbench native rendering approval;
- FPS/device performance claims;
- collision/world occlusion simulation;
- full Molang evaluation.

## Public API recommendation

Keep exactly two public tools.

### `inspect_particle`

Recommended bounded extension:

```text
mode:
  summary
  components
  compatibility
  motion
  full
```

Optional inputs should be explicit and only required for the corresponding preflight:

```text
target_runtime?: bedrock | snowstorm
motion_input?: constant numeric preflight input
motion_envelope?: authored target envelope
intent?: bounded particle intent contract
```

Bundle- and texture-level analysis should not be forced into single-document inspection unless the caller supplies the required neighboring evidence.

### `manage_particle`

Keep existing create/patch/write/preview ownership.

Recommended behavior:

```text
create or load
→ apply targeted operations
→ existing Bedrock validation
→ optional target-runtime preflight
→ optional bounded intent/motion diagnostics
→ write/preview only after normal validation rules
```

Compatibility warnings must not turn valid Bedrock JSON into Bedrock syntax errors.

## Bundle strategy

Do not make the normal single-particle mutation path depend on a bundle abstraction.

When a caller explicitly provides a bundle, validate:

- duplicate identifiers;
- document/bundle identifier mismatch;
- missing child particle references;
- circular child chains;
- orphan entries relative to an explicit root;
- missing texture references when the available texture set is known.

This should be a shared validation input/output shape, not a new public tool or persistent registry.

## Diagnostic ownership

Experimental diagnostic codes are useful and should preserve semantic meaning during promotion.

Production should separate:

```text
Bedrock validity diagnostics
  syntax/component/Molang validity

target-runtime compatibility diagnostics
  Snowstorm/Wintersky behavior risks

intent/preflight diagnostics
  target miss, keep-out overlap, readability, budget
```

Do not merge target-specific Snowstorm warnings into Bedrock-generic validity.

## Weaknesses found before promotion

### 1. Local execution proof is still missing

The experimental tests are source/static reviewed but have not been executed in the required `LOCAL_CODE` environment.

Required first proof:

```bash
bun test Experimental/chatgpt-particle-authoring/tests
```

If repository test discovery does not support the path directly, run the smallest Bun test invocation that executes only this experimental suite.

### 2. Production API shape is not yet finalized

`inspect_particle` currently supports only:

```text
summary | components | full
```

Any additional modes or inputs change the public schema and therefore require generated API docs to be regenerated through the canonical generator.

### 3. Texture QA has an input-boundary dependency

The experimental atlas checker accepts decoded RGBA bytes. Promotion requires an existing production owner capable of supplying those bytes without duplicating image infrastructure.

Until that owner is confirmed, texture QA remains a conditional promotion candidate.

### 4. Motion preflight intentionally covers constant numeric inputs only

This is a strength, not a defect, as long as the public contract states the limit clearly.

Do not broaden promotion into a Molang evaluator. When inputs are dynamic/Molang-driven, return `unsupported for numeric preflight` rather than guessing.

### 5. Performance/readability are heuristics

They should remain advisory warnings and must never be presented as FPS or visual-quality proof.

## Transient production impact map

If promotion is authorized after local proof:

| Surface | Classification | Expected action |
|---|---|---|
| `mcp/lib/bedrockParticleSemantics.ts` | VERIFIED_UNCHANGED for Snowstorm-specific rules | keep Bedrock-generic validity only |
| new bounded helper under `mcp/lib/` | SHARED SOURCE | move/adapt compatibility + preflight logic |
| `mcp/server/tools/particle.ts` | PUBLIC MCP OWNER | expose optional modes/inputs through existing tools |
| `mcp/server/resources/particle.ts` | SEMANTIC MIRROR | add concise runtime/preflight workflow guidance |
| `mcp/tests/particle-tool-contract.test.ts` | PUBLIC CONTRACT TEST | preserve exactly two public particle tools and test schema additions |
| focused runtime/import-safe test | EXECUTABLE REGRESSION | port experimental failure cases |
| `mcp/docs/api.json` / `mcp/docs/index.html` | GENERATED | regenerate, never hand-edit |
| CI verifier routing | CI ROUTING | verify existing MCP workflow covers touched paths |
| live Blockbench/Snowstorm proof | RESIDUE_HANDOFF | required only for native/visual claims |

## Recommended promotion order

### Gate A — Experimental local proof

Run all P0–P2 tests, including the volcano golden contract.

Acceptance:

```text
all focused tests PASS
no change required to experimental semantics
```

### Gate B — Production helper extraction

Create one import-safe production helper under `mcp/lib/` containing only the approved deterministic logic.

Acceptance:

```text
no Blockbench globals
no new parser
no Molang runtime
no image dependency
no tool registration
```

### Gate C — Tool integration

Integrate the helper into `inspect_particle` first.

Reason: read-only diagnostics are lower risk and allow the public result shape to stabilize before mutation behavior consumes the same diagnostics.

Then integrate the same helper into `manage_particle` without duplicating validation logic.

### Gate D — Resource guidance and contract tests

Update the lazy particle workflow reference with only the rules required to author correctly:

- scalar speed + shape direction for Snowstorm-targeted launches;
- emitter-owned vs particle-owned lifetime variables;
- preflight is advisory and bounded;
- visual/native approval remains separate.

Preserve the two-tool contract test.

### Gate E — Generated docs and MCP verification

In `LOCAL_CODE`:

```bash
bun install --frozen-lockfile
bun run docs:build
bun run docs:check
bun run verify:mcp
```

Use the repository's current canonical commands if they differ at execution time.

### Gate F — Live proof

Only after source verification:

```text
LIVE_BLOCKBENCH
→ deploy/reload matching build
→ inspect representative particle
→ preview representative Snowstorm-compatible motion
→ verify no regression to native preview/write flow
→ perform visual approval separately
```

## Promotion stop conditions

Stop and keep the implementation experimental if any of these occur:

- focused P0–P2 tests fail;
- promotion requires a second public particle tool;
- promotion requires a second particle parser or Molang runtime;
- atlas QA requires a new image stack solely for particles;
- production schema cannot be regenerated in the same logical delivery;
- static diagnostics are being used as visual/runtime proof.

## Final readiness verdict

```text
ARCHITECTURE            READY
BOUNDARIES              READY
FAILURE-MODE COVERAGE   READY IN SOURCE
GOLDEN STATIC CONTRACT  READY IN SOURCE
LOCAL TEST PROOF        REQUIRED
PUBLIC API INTEGRATION  NOT STARTED
GENERATED DOC CLOSURE   REQUIRED AT PROMOTION
LIVE VISUAL PROOF       REQUIRED AFTER SOURCE PROMOTION
```

Therefore the next correct action is **LOCAL_CODE proof of the experimental suite**, not additional experimental framework expansion and not immediate production mutation.
