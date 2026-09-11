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

official schema closure audit
→ docs/02-reference/particle/official-schema-coverage.md

Bedrock fundamentals
→ docs/02-reference/particle/fundamentals.md

complete component catalog
→ docs/02-reference/particle/component-catalog.md

field-level component reference
→ docs/02-reference/particle/component-field-reference.md

lifecycle/evaluation/local-space timing
→ docs/02-reference/particle/lifecycle-space.md

emitter lifecycle/rates/shapes
→ docs/02-reference/particle/emitter.md

advanced emitter shape/direction math
→ docs/02-reference/particle/emitter-shape-math.md

general vector/physics/distribution math
→ docs/02-reference/particle/math-physics-reference.md

motion/parametric paths
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

texture resolution/resampling/downscale/frame stability
→ docs/02-reference/particle/texture-resolution-sampling.md

texture color/alpha/additive/blend reasoning
→ docs/02-reference/particle/texture-color-science.md

particle-specific Molang ownership
→ docs/02-reference/particle/molang.md

particle built-in variable inventory
→ docs/02-reference/particle/particle-variable-inventory.md

full Molang language/math/easing
→ docs/02-reference/particle/molang-language-math.md

reusable Molang formula cookbook
→ docs/02-reference/particle/molang-formula-cookbook.md

Molang queries/context/external state
→ docs/02-reference/particle/molang-queries-context.md

curves
→ docs/02-reference/particle/curves.md

events/nested effects
→ docs/02-reference/particle/events.md

event timing/time ownership
→ docs/02-reference/particle/event-timing.md

Snowstorm/Wintersky generic editor/preview compatibility
→ docs/02-reference/particle/snowstorm.md

Snowstorm/Wintersky release capability and fix matrix
→ docs/02-reference/particle/snowstorm-compatibility-matrix.md

Snowstorm release/version quirks and regressions
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
need to confirm whether official particle coverage is complete
→ official-schema-coverage.md

unknown component/schema family
→ component-catalog.md

specific property/default/failure mode
→ component-field-reference.md

spawn/lifetime/shape
→ emitter.md

custom shape/ring/cone/fan math
→ emitter-shape-math.md

general vector/physics/distribution/ballistic math
→ math-physics-reference.md

creation/update/render or local/world-space
→ lifecycle-space.md

trajectory/physics
→ motion.md

contact/bounce/collision-event
→ collision-advanced.md

material/billboard/tint/rendering
→ appearance-rendering.md

velocity/direction-aligned sprite
→ billboard-direction.md

texture/alpha/atlas/UV/flipbook
→ texture-authoring.md

resolution/resampling/downscale/frame-stability
→ texture-resolution-sampling.md

halo/bleeding/filtering/minification
→ texture-filtering-bleeding.md

alpha/value/additive/blend color design
→ texture-color-science.md

particle variable ownership
→ molang.md

which built-in particle/emitter variable exists
→ particle-variable-inventory.md

Molang language/math/easing
→ molang-language-math.md

need a reusable formula
→ molang-formula-cookbook.md

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

which Snowstorm/Wintersky release supports/fixes the behavior?
→ snowstorm-compatibility-matrix.md

release-specific Snowstorm anomaly/regression
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

This Skill owns ChatGPT-side particle reference generation. It may produce Bedrock `.particle.json`, textures/atlases, resource-pack structure, static/preflight diagnostics, concise usage notes, and a clean package ready for review/handoff.

It does not own image/model reference generation unless separately requested, MCP implementation, Blockbench runtime mutation, animation/controller binding, live Snowstorm/Minecraft visual truth, or device/FPS benchmarking.

## Input rule

Particle authoring may start from text-only intent, user images/references, world/object context, previously approved particle behavior, or an existing Bedrock particle package. A newly generated reference image is optional evidence, not a prerequisite.

## Runtime compatibility rule

When Snowstorm/Wintersky preview fidelity matters and authored launch magnitude is important:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

Treat Bedrock validity, Snowstorm compatibility, and visual approval as separate concerns.

## Stable ownership rule

Keep emitter timing emitter-owned. Keep persistent living-particle classes particle-owned using stable particle random/age/lifetime values. Do not use emitter-age thresholds to reclassify living particles unless that instability is explicitly desired.

## Texture rule

Texture is first-class authored data. Load the texture owners as needed:

```text
texture-authoring.md
→ RGBA, sprite bounds, atlas mapping, gutter, UV/flipbook, tint compatibility

texture-resolution-sampling.md
→ source resolution, resampling, downscaling, alpha coverage, frame stability

texture-filtering-bleeding.md
→ hidden RGB, matte/halo, atlas bleed, minification/filtering

texture-color-science.md
→ value/alpha/saturation decisions for opaque/alpha/blend/additive behavior
```

Do not pass presentation sheets or generated-background images directly as production textures.

## Molang/math rule

```text
ownership/stability
→ molang.md

built-in particle/emitter variables
→ particle-variable-inventory.md

language/operator/function semantics
→ molang-language-math.md

reusable expression pattern
→ molang-formula-cookbook.md

general vector/physics/distribution math
→ math-physics-reference.md

query/context/external-state dependency
→ molang-queries-context.md
```

Do not use changing external queries or frame-random math where stable per-particle state is required.

## Shape/math rule

Use built-in emitter shapes when sufficient. Use `emitter-shape-math.md` when custom spawn position/direction math is materially required. Use `math-physics-reference.md` when the problem is broader than one emitter component. Keep spawn position, launch direction, speed magnitude, and post-spawn motion as separate responsibilities.

## Schema closure rule

Use `official-schema-coverage.md` to verify that a requested component/field already has a canonical owner before creating new knowledge files. New Bedrock fields should extend the nearest existing owner; do not create another generic particle tree.

## Collision/event timing rule

Use `motion.md + collision-advanced.md` for contact physics, `events.md` for event graph, and `event-timing.md` for ownership/order. Prevent repeated-contact fan-out and emitter-time/particle-time confusion.

## Snowstorm version rule

Use:

```text
snowstorm.md
→ generic editor/import/export/preview boundary

snowstorm-compatibility-matrix.md
→ release-by-release capabilities, fixed regressions, source mapping and round-trip risks

snowstorm-version-quirks.md
→ anomaly diagnosis and version-specific regressions
```

Published release notes outrank unreleased source-head package metadata for stable-capability claims. Source code may explain implementation but must be labeled development state when it is ahead of published release tags.

Never turn a Snowstorm/Wintersky preview regression into a generic Bedrock restriction without stronger evidence.

## Snowstorm round-trip rule

For externally authored advanced JSON or high-value particle packages:

```text
preserve original JSON
→ import Snowstorm
→ edit
→ export
→ structural diff
→ target Bedrock schema review
```

Do not assume successful import means every field is first-class editable or perfectly round-tripped. Pay special attention to meaningful `0`, `false`, omitted fields, event structures, and newly introduced Bedrock fields.

## Quality rule

Never package immediately after authoring. Follow canonical QA first. Static heuristics may warn about motion, readability, atlas hygiene, or particle count, but never substitute for user visual review.

Run only particle-relevant QA. Do not require image-reference QA when no image-reference artifact exists.

## Delivery rule

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, versioned scratch filenames, duplicate textures, image-reference packages, or internal QA debris unless explicitly requested.

## Downstream relationship

Codex or MCP may consume the completed package later, but this Skill does not require MCP or the image-reference branch to create or validate the asset. The particle package is the handoff boundary.
