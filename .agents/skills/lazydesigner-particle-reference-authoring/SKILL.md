---
name: lazydesigner-particle-reference-authoring
description: ChatGPT-side specialist for creating Minecraft Bedrock/Snowstorm particle reference assets, textures, static preflight evidence, and clean delivery packages before optional Codex or MCP handoff.
---

# LazyDesigner Particle Reference Authoring

Standalone specialist inside the canonical Reference Preparation domain for particle/VFX tasks. It does not depend on the image/model reference branch.

## Route

```text
USER PARTICLE REQUEST
→ docs/02-reference/particle/authoring-spec.md
→ load only needed particle knowledge
→ docs/02-reference/particle/workflow.md
→ author JSON + textures
→ docs/02-reference/particle/qa.md
→ docs/02-reference/particle/delivery.md
→ USER VISUAL REVIEW
→ optional Codex / MCP handoff
```

If the user requests only particle/VFX work, do not generate image/model references merely as an intermediate step.

## Canonical owners

```text
entry/boundary
→ docs/02-reference/particle/README.md

knowledge navigation / evidence classes
→ docs/02-reference/particle/knowledge-map.md

Bedrock fundamentals
→ docs/02-reference/particle/fundamentals.md

complete Bedrock particle component catalog
→ docs/02-reference/particle/component-catalog.md

lifecycle/evaluation/local-space timing
→ docs/02-reference/particle/lifecycle-space.md

emitter lifecycle/rates/shapes
→ docs/02-reference/particle/emitter.md

motion/collision/parametric paths
→ docs/02-reference/particle/motion.md

advanced collision/contact/bounce/event behavior
→ docs/02-reference/particle/collision-advanced.md

appearance/rendering/material/billboard
→ docs/02-reference/particle/appearance-rendering.md

directional billboard edge cases
→ docs/02-reference/particle/billboard-direction.md

production PNG/RGBA/atlas/UV/flipbook textures
→ docs/02-reference/particle/texture-authoring.md

texture filtering/bleeding/matte/minification
→ docs/02-reference/particle/texture-filtering-bleeding.md

particle-specific Molang ownership
→ docs/02-reference/particle/molang.md

full Molang language/math/easing/formulas
→ docs/02-reference/particle/molang-language-math.md

Molang queries/context/external state
→ docs/02-reference/particle/molang-queries-context.md

curves
→ docs/02-reference/particle/curves.md

events/nested effects
→ docs/02-reference/particle/events.md

event timing and time ownership
→ docs/02-reference/particle/event-timing.md

Snowstorm/Wintersky compatibility
→ docs/02-reference/particle/snowstorm.md

Snowstorm release/version quirks
→ docs/02-reference/particle/snowstorm-version-quirks.md

performance reasoning
→ docs/02-reference/particle/performance.md

entity integration context
→ docs/02-reference/particle/entity-integration.md

troubleshooting
→ docs/02-reference/particle/troubleshooting.md

intent/workflow/QA/delivery/patterns
→ docs/02-reference/particle/authoring-spec.md
→ docs/02-reference/particle/workflow.md
→ docs/02-reference/particle/qa.md
→ docs/02-reference/particle/delivery.md
→ docs/02-reference/particle/patterns.md
```

Do not maintain parallel copies of these rules in this Skill.

## Knowledge loading rule

Do not preload the entire particle domain.

```text
unknown component or schema family
→ component-catalog.md

spawn/lifetime/shape
→ emitter.md

creation/update/render or local/world-space question
→ lifecycle-space.md

trajectory/physics
→ motion.md

contact/bounce/collision-event issue
→ collision-advanced.md

material/billboard/tint/rendering
→ appearance-rendering.md

velocity/direction-aligned sprite issue
→ billboard-direction.md

texture/alpha/atlas/UV/flipbook
→ texture-authoring.md

halo/bleeding/filtering/minification issue
→ texture-filtering-bleeding.md

particle variable ownership
→ molang.md

generic Molang syntax/math/easing/formula
→ molang-language-math.md

query/context/entity-state dependency
→ molang-queries-context.md

lifetime interpolation
→ curves.md

child/nested architecture
→ events.md

event sequencing/time ownership
→ event-timing.md

editor-preview compatibility
→ snowstorm.md

release-specific Snowstorm anomaly
→ snowstorm-version-quirks.md

count/overdraw/cost guidance
→ performance.md

locator/entity attachment
→ entity-integration.md

unclear symptom
→ troubleshooting.md
```

When a rule matters, preserve its evidence class:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Never present Snowstorm-specific behavior as Bedrock validity, or a heuristic as live/runtime proof.

## Boundary

This Skill owns ChatGPT-side particle reference generation. It may produce:
- Bedrock `.particle.json` files;
- particle textures/atlases;
- resource-pack structure;
- static/preflight diagnostics;
- concise usage notes;
- a clean package ready for user review or downstream handoff.

It does not own:
- image/model reference generation unless separately requested;
- MCP tool implementation;
- Blockbench runtime mutation;
- animation/controller binding;
- live Snowstorm/Minecraft visual truth;
- FPS/device benchmarking;
- generic runtime claims unsupported by target evidence.

## Input rule

Particle authoring may start from any sufficient combination of:

```text
text-only effect request
existing user image/reference
existing world/object context
previously approved particle behavior
existing Bedrock particle package
```

A newly generated reference image is optional evidence, not a prerequisite.

## Runtime compatibility rule

When Snowstorm/Wintersky preview fidelity matters and authored launch magnitude is important:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

Treat Bedrock validity, Snowstorm compatibility, and visual approval as separate concerns.

## Stable ownership rule

Keep emitter timing emitter-owned. Keep living-particle classes particle-owned using stable particle random/age/lifetime values. Do not use emitter-age thresholds to switch existing particles between motion, UV, size, or tint classes unless that instability is explicitly desired.

## Texture rule

Texture is a first-class authored asset. When texture work is required, load both texture owners as needed:

```text
texture-authoring.md
→ RGBA transparency
→ material/blend target
→ sprite bounds
→ atlas cell mapping
→ transparent gutter
→ UV/flipbook mapping
→ tint compatibility
→ pixel-art production

texture-filtering-bleeding.md
→ hidden RGB under transparent pixels
→ matte/halo risk
→ atlas bleed
→ frame-bound jitter
→ minification/filtering edge cases
```

Do not pass presentation sheets or generated-background images directly as production particle textures.

## Molang/math rule

When expressions are non-trivial, use the correct layer:

```text
particle ownership/stability decision
→ molang.md

language/operator/function/formula decision
→ molang-language-math.md

query/context/external-state decision
→ molang-queries-context.md
```

Do not use changing external queries or frame-random math where stable per-particle state is required.

## Collision and event timing rule

When contact or nested timing is material:

```text
trajectory/contact physics
→ motion.md + collision-advanced.md

event graph
→ events.md

event order / emitter-vs-particle time ownership
→ event-timing.md
```

Do not let collision-event fan-out or time-owner mistakes create accidental density explosions or synchronized class changes.

## Snowstorm version rule

Use `snowstorm.md` for generic editor compatibility and `snowstorm-version-quirks.md` for release-specific anomalies. A preview regression must not be promoted into a generic Bedrock restriction without runtime evidence.

## Quality rule

Never package immediately after authoring. Follow the canonical QA sequence first. Static heuristics may warn about motion, keep-out overlap, readability, atlas hygiene, or particle count, but they never substitute for user visual review.

Run only particle-relevant QA. Do not require image-reference QA when no image-reference artifact exists.

## Delivery rule

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, versioned scratch filenames, duplicate textures, image-reference packages, or internal QA debris unless explicitly requested.

## Downstream relationship

Codex or MCP may consume the completed package later, but this Skill does not require MCP or the image-reference branch to create or validate the asset. The particle package is the handoff boundary.
