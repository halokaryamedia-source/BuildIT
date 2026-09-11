# Particle Reference Authoring Status

Particle Reference Authoring is an active ChatGPT-side Reference Preparation capability.

Canonical owners:

```text
docs/02-reference/particle/
.agents/skills/lazydesigner-particle-reference-authoring/
```

It is not an MCP subsystem. It produces Bedrock/Snowstorm particle reference assets and clean packages that may be reviewed directly or handed downstream to Codex/MCP.

## Knowledge maturity

The source/static knowledge foundation is mature enough to act as the canonical particle reference authority for authoring decisions.

Covered knowledge includes Bedrock components/defaults/evaluation, emitter/motion/collision/rotation, Molang/math/queries, curves/events, rendering/textures, entity attachment, Snowstorm/Wintersky compatibility, static performance reasoning, troubleshooting, QA, and delivery.

## Context efficiency

The knowledge tree is intentionally deep but is not intended to be loaded wholesale.

```text
authoring
→ authoring-spec + workflow
→ one primary knowledge owner
→ secondary owner only for a real cross-domain dependency
→ qa/delivery only near finalization

knowledge/diagnosis
→ knowledge-map
→ one primary owner
→ escalate one owner at a time
```

## Execution efficiency

The authoring path classifies each request before deep reading:

```text
DIRECT
COMPOSED
REACTIVE
AUDIT / REVISION
```

Then it selects the smallest physical starting family from `patterns.md`, chooses the lowest viable implementation tier, and resolves one output identity before files are authored.

Output identity now acts as the naming source for:

```text
namespace
root identifier
particle filenames
child role filenames
texture mapping
README references
optional REFERENCE.json paths
```

Pattern selection is semantic/physical routing, not a preset system. Exact numeric values remain request/reference/context dependent.

The path then chooses the lowest viable implementation tier:

```text
TIER 0 constants
TIER 1 simple particle-owned Molang
TIER 2 curves / atlas / flipbook / multi-layer
TIER 3 events / collision chains / external or entity reactivity
```

Non-blocking unknowns may use conservative reversible provisional choices so a simple prompt can reach a first production pass without unnecessary questioning. Architecture escalates only when requested behavior requires it.

QA is single-pass and conditional near finalization; targeted revisions rerun only the causal QA gate plus package integrity.

## Delivery maturity

Standalone delivery is deterministic from the approved effect identity/resource graph.

Canonical expectations:

```text
one Resource Pack manifest
clean semantic snake_case filenames
one explicit root particle identifier
exact child-effect references
exact texture reference ↔ PNG mapping
concise standalone README
no scratch/revision/debug/QA debris
no accidental double-wrapper ZIP root
REFERENCE.json only for explicit downstream handoff
```

Manifest UUIDs must be distinct per delivered pack and header/module UUIDs distinct from each other. Minimum engine/version constraints are not invented without a target/project requirement.

The downstream handoff remains the existing canonical `../package/particle-handoff.md`; Particle Reference Authoring does not create another package or manifest system.

## Closure state

```text
SOURCE / DOCUMENT KNOWLEDGE        MATURE
OFFICIAL SCHEMA COVERAGE           TRACKED
CONTEXT / TOKEN ROUTING            MATURE
AUTHORING EXECUTION ROUTING        MATURE
AUTOMATIC PHYSICAL PATTERN ROUTING MATURE
OUTPUT / PACKAGE CONTRACT          MATURE
SNOWSTORM VERSION KNOWLEDGE        VERSION-AWARE
STATIC AUTHORING QA                MATURE
REAL MULTI-FAMILY VISUAL CASES     DEFERRED BY USER
LIVE MINECRAFT PROOF               NOT CLAIMED
DEVICE / FPS PROOF                 NOT CLAIMED
```

Remaining uncertainty is intentionally limited to target-version/runtime facts such as future Bedrock fields, editor regressions, host-specific Molang query exposure, exact collision/runtime integration, GPU/device performance, and final visual acceptance.

These uncertainties should trigger targeted verification, not another parallel framework or full-corpus context load.

Historical experimental development has been retired from the working tree. Git history retains provenance.
