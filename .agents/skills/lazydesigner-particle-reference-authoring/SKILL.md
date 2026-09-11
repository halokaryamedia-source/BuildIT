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

appearance/rendering/material/billboard
→ docs/02-reference/particle/appearance-rendering.md

production PNG/RGBA/atlas/UV/flipbook textures
→ docs/02-reference/particle/texture-authoring.md

particle-specific Molang ownership
→ docs/02-reference/particle/molang.md

full Molang language/math/easing/formulas
→ docs/02-reference/particle/molang-language-math.md

curves
→ docs/02-reference/particle/curves.md

events/nested effects
→ docs/02-reference/particle/events.md

Snowstorm/Wintersky compatibility
→ docs/02-reference/particle/snowstorm.md

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

trajectory/physics/collision
→ motion.md

material/billboard/tint/rendering
→ appearance-rendering.md

texture/alpha/atlas/UV/flipbook
→ texture-authoring.md

particle variable ownership
→ molang.md

generic Molang syntax/math/easing/formula
→ molang-language-math.md

lifetime interpolation
→ curves.md

child/nested architecture
→ events.md

editor-preview compatibility
→ snowstorm.md

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

Texture is a first-class authored asset. When texture work is required, load `texture-authoring.md` and explicitly own:

```text
RGBA transparency
material/blend target
sprite bounds
atlas cell mapping
transparent gutter
UV/flipbook mapping
tint compatibility
pixel-art filtering/style
matte/halo cleanup
```

Do not pass presentation sheets or generated-background images directly as production particle textures.

## Molang/math rule

When expressions are non-trivial, use both layers correctly:

```text
particle ownership/stability decision
→ molang.md

language/operator/function/formula decision
→ molang-language-math.md
```

Do not use random/frame math where stable per-particle state is required.

## Quality rule

Never package immediately after authoring. Follow the canonical QA sequence first. Static heuristics may warn about motion, keep-out overlap, readability, atlas hygiene, or particle count, but they never substitute for user visual review.

Run only particle-relevant QA. Do not require image-reference QA when no image-reference artifact exists.

## Delivery rule

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, versioned scratch filenames, duplicate textures, image-reference packages, or internal QA debris unless explicitly requested.

## Downstream relationship

Codex or MCP may consume the completed package later, but this Skill does not require MCP or the image-reference branch to create or validate the asset. The particle package is the handoff boundary.
