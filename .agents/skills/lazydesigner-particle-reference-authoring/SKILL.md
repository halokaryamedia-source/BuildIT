---
name: lazydesigner-particle-reference-authoring
description: ChatGPT-side specialist for creating Minecraft Bedrock/Snowstorm particle reference assets, textures, static preflight evidence, and clean delivery packages before optional Codex or MCP handoff.
---

# LazyDesigner Particle Reference Authoring

Standalone specialist inside the canonical Reference Preparation domain for particle/VFX tasks. It does not depend on the image/model reference branch and is not an MCP subsystem.

## Route

```text
USER PARTICLE REQUEST
→ authoring-spec.md
→ workflow.md
→ load only the minimum knowledge needed for the current decision
→ author JSON + textures
→ qa.md
→ delivery.md
→ USER REVIEW IN TARGET ENVIRONMENT
→ optional Codex / MCP handoff
```

For knowledge or diagnosis questions, start from `knowledge-map.md` instead of the authoring route.

## Context-budget rule

Do not preload the particle corpus.

Normal authoring budget:

```text
control docs: authoring-spec.md + workflow.md
+ 1 primary domain owner
+ at most 1–2 secondary owners only when the decision actually crosses domains
```

Normal knowledge/diagnostic budget:

```text
knowledge-map.md
+ 1 primary owner
+ 1 secondary owner only when required by evidence or a cross-domain dependency
```

Escalate one file at a time. If more than three knowledge owners appear necessary, split the problem into separate decisions instead of loading all owners at once.

Do not load:
- `official-schema-coverage.md` during normal authoring unless checking a new/unknown component or closure state;
- `official-defaults-evaluation.md` unless omission/default/evaluation timing matters;
- `snowstorm-compatibility-matrix.md` unless behavior is version-sensitive;
- `snowstorm-version-quirks.md` unless diagnosing a release-specific anomaly;
- `troubleshooting.md` when the causal subsystem is already known;
- `qa.md` or `delivery.md` before finalization unless the user explicitly asks about QA/package rules.

`README.md` owns the domain boundary. `knowledge-map.md` owns detailed knowledge routing. Do not duplicate their complete owner lists here.

## Minimal task bundles

Use these as default starting bundles, then add only the missing causal owner.

```text
simple text-only particle
→ authoring-spec + workflow + emitter OR motion
→ add texture-authoring only when texture must be authored/changed

texture-only task
→ texture-authoring
→ add exactly one specialist: resolution-sampling OR filtering-bleeding OR color-science
→ appearance-rendering only when material/tint/render behavior is part of the question

Molang ownership/class stability
→ molang

Molang syntax/math/function
→ molang-language-math

reusable formula
→ molang-formula-cookbook
→ add math-physics-reference only for actual vector/physics derivation

existing JSON field audit
→ component-field-reference
→ add official-defaults-evaluation only when default/omission/evaluation matters

emitter/spawn issue
→ emitter
→ add emitter-shape-math only for custom geometry/direction math

trajectory issue
→ motion
→ add math-physics-reference only when calculation/derivation is required

collision issue
→ collision-advanced
→ add events only when collision triggers an event graph

nested event issue
→ events + event-timing
→ add performance only when fan-out/load is relevant

entity-attached particle
→ entity-integration + lifecycle-space
→ add billboard-direction only when orientation/facing is the actual problem

Snowstorm generic compatibility
→ snowstorm

Snowstorm version question
→ snowstorm-compatibility-matrix

Snowstorm regression/anomaly
→ snowstorm-version-quirks
→ add snowstorm only if generic editor semantics are also uncertain

unknown symptom
→ troubleshooting
→ then load only the causal owner identified by that guide
```

## Evidence discipline

Preserve the evidence class of every durable rule:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Never present Snowstorm-specific behavior as generic Bedrock validity, editor acceptance as Minecraft runtime proof, or static heuristics as FPS/visual proof.

## Core authoring rules

Keep emitter timing emitter-owned. Keep persistent living-particle classes particle-owned using stable particle random/age/lifetime values.

For Snowstorm-facing authoring where launch magnitude must survive preview reliably, the preferred compatibility pattern is:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

This is Snowstorm/Wintersky-targeted guidance, not a generic Bedrock prohibition on vector initial-speed forms.

Texture is first-class production data. Do not use presentation sheets, baked checkerboards, or generated-background images as production particle textures.

Use built-in emitter shapes before custom math. Keep spawn position, launch direction, scalar speed, and post-spawn motion as separate responsibilities.

## Snowstorm round-trip rule

For advanced or externally authored JSON:

```text
preserve original JSON
→ import Snowstorm
→ edit
→ export
→ structural diff
→ target Bedrock schema review
```

Successful import does not prove every field is first-class editable or round-tripped perfectly. Pay special attention to meaningful `0`, `false`, omitted fields, advanced events, and newer Bedrock fields.

Published Snowstorm/Wintersky release notes outrank unreleased source-head metadata for stable capability claims.

## Quality and delivery

Run only relevant gates from `qa.md`; do not execute every possible check by default. Static QA does not replace user review in Snowstorm/Minecraft.

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, scratch/versioned working files, duplicate textures, or unrelated image-reference artifacts unless explicitly requested.

## Boundary

This Skill may produce `.particle.json`, textures/atlases, Resource Pack structure, static/preflight diagnostics, concise usage notes, and clean handoff packages.

It does not own image/model reference generation unless separately requested, MCP implementation, Blockbench runtime mutation, animation/controller integration, live Snowstorm/Minecraft visual truth, or device/FPS benchmarking.
