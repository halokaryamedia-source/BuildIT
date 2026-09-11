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

Then it selects the smallest physical starting family from `patterns.md` before choosing technical owners.

Examples:

```text
flame      → Flame
sparks     → Sparks
smoke      → Rising smoke/plume
dust       → Ambient or impact dust based on context
rain       → Rain
magic aura → Magic aura/energy field
impact     → Impact burst
explosion  → composed candidate family, only required roles retained
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

## Closure state

```text
SOURCE / DOCUMENT KNOWLEDGE       MATURE
OFFICIAL SCHEMA COVERAGE          TRACKED
CONTEXT / TOKEN ROUTING           MATURE
AUTHORING EXECUTION ROUTING       MATURE
AUTOMATIC PHYSICAL PATTERN ROUTING MATURE
SNOWSTORM VERSION KNOWLEDGE       VERSION-AWARE
STATIC AUTHORING QA               MATURE
REAL MULTI-FAMILY VISUAL CASES    DEFERRED BY USER
LIVE MINECRAFT PROOF              NOT CLAIMED
DEVICE / FPS PROOF                NOT CLAIMED
```

Remaining uncertainty is intentionally limited to target-version/runtime facts such as future Bedrock fields, editor regressions, host-specific Molang query exposure, exact collision/runtime integration, GPU/device performance, and final visual acceptance.

These uncertainties should trigger targeted verification, not another parallel framework or full-corpus context load.

Historical experimental development has been retired from the working tree. Git history retains provenance.
