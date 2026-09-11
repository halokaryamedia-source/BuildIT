---
name: lazydesigner-particle-reference-authoring
description: ChatGPT-side specialist for creating Minecraft Bedrock/Snowstorm particle reference assets, textures, static preflight evidence, and clean delivery packages before optional Codex or MCP handoff.
---

# LazyDesigner Particle Reference Authoring

Standalone specialist inside the canonical Reference Preparation domain for particle/VFX tasks. It is not an MCP subsystem and does not depend on image/model reference generation.

## Route

```text
USER PARTICLE REQUEST
→ authoring-spec.md
→ workflow.md
→ classify execution + complexity once
→ load minimum knowledge bundle
→ author JSON + textures
→ relevant qa.md gates only
→ delivery.md
→ USER REVIEW IN TARGET ENVIRONMENT
→ optional Codex / MCP handoff
```

For knowledge/diagnosis questions, start from `knowledge-map.md` instead.

## Execution-first rule

Before deep reading, classify:

```text
DIRECT
COMPOSED
REACTIVE
AUDIT / REVISION
```

and choose the lowest viable complexity tier:

```text
0 constants
1 simple particle-owned Molang
2 curves / atlas / flipbook / multi-layer
3 events / collision chains / entity/external reactivity
```

Do not escalate architecture unless a required behavior cannot be represented cleanly at the current tier.

A request such as `buat particle api biru` should normally take the DIRECT fast path, not trigger multi-emitter/event architecture by default.

## Context-budget rule

Do not preload the corpus.

```text
normal authoring
= authoring-spec + workflow + 1 primary owner
+ at most 1–2 secondary owners when a real dependency appears

knowledge/diagnosis
= knowledge-map + 1 primary owner
+ secondary owner only when required
```

If more than three owners appear necessary, split the problem into causal decisions rather than reading everything.

Do not load closure/default/version/troubleshooting/QA/delivery owners unless the current decision requires them.

## Minimal task bundles

```text
simple text particle
→ authoring-spec + workflow + primary owner
→ texture-authoring only if texture creation/change is required

texture-only
→ texture-authoring
→ + exactly one specialist when needed: resolution-sampling OR filtering-bleeding OR color-science

spawn/lifetime
→ emitter

trajectory
→ motion
→ + math-physics only for real derivation

Molang ownership
→ molang

Molang language/function
→ molang-language-math

formula
→ molang-formula-cookbook

existing JSON audit
→ component-field-reference
→ + official-defaults-evaluation only when omission/default/evaluation matters

collision
→ collision-advanced
→ + events only when contact triggers an event graph

nested event
→ events + event-timing

entity attached
→ entity-integration + lifecycle-space

Snowstorm generic
→ snowstorm

Snowstorm release support/fix
→ snowstorm-compatibility-matrix

Snowstorm regression
→ snowstorm-version-quirks

unknown symptom
→ troubleshooting
→ then only the causal owner it identifies
```

## Provisional-default rule

When an unknown is not BLOCKING, prefer a conservative reversible first-pass choice rather than asking another question.

Mark that choice internally as `PROVISIONAL`. Never present it as a user requirement, exact runtime fact, or measured performance result.

Good provisional choices are local and easy to revise, such as modest lifetime, simple static texture, single emitter, conservative size, or simple particle-age fade.

Do not provisionally invent hidden geometry, required attachment names, exact viewing distance, device/FPS limits, or gameplay semantics.

## Simplicity ladder

Prefer:

```text
constant
→ simple stable Molang
→ curve / atlas / flipbook
→ multiple layers
→ event/reactive architecture
```

Use the first level that satisfies the requested visual behavior.

## Core authoring rules

Keep emitter timing emitter-owned. Keep persistent living-particle identity particle-owned using stable particle random/age/lifetime values.

Use built-in emitter shapes before custom math. Keep spawn position, launch direction, speed magnitude, and post-spawn motion as separate responsibilities.

Texture is first-class production data. Do not use presentation sheets, baked checkerboards, or generated-background images as production textures.

For Snowstorm-facing authoring where launch magnitude must survive preview predictably:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

This is Snowstorm/Wintersky-targeted compatibility guidance, not a generic Bedrock prohibition.

## Single-pass QA rule

Near finalization, run only applicable `qa.md` gates once.

After a targeted revision, rerun the causal QA gate plus package-integrity checks rather than the whole suite.

Static QA does not replace target-environment review.

## Snowstorm round-trip rule

For advanced/external JSON actually edited through Snowstorm:

```text
preserve original
→ import
→ edit
→ export
→ structural diff
→ target Bedrock schema review
```

Successful import is not proof of perfect field-level round trip.

## Evidence discipline

Preserve evidence class:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Never present editor behavior as generic Bedrock validity or static heuristics as runtime/FPS truth.

## Boundary

This Skill may produce `.particle.json`, textures/atlases, Resource Pack structure, static/preflight diagnostics, concise usage notes, and clean handoff packages.

It does not own MCP implementation, Blockbench runtime mutation, animation/controller integration, live Minecraft/Snowstorm truth, or device/FPS benchmarking.
