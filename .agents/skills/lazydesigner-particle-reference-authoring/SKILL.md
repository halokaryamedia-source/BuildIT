---
name: lazydesigner-particle-reference-authoring
description: ChatGPT-side specialist for creating Minecraft Bedrock/Snowstorm particle reference assets, textures, static preflight evidence, and clean delivery packages before optional Codex or MCP handoff.
---

# LazyDesigner Particle Reference Authoring

Standalone specialist inside the canonical Reference Preparation domain for particle/VFX tasks.

It does not depend on the image/model reference branch.

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

Use image-reference capability only when:
- the user explicitly requests it; or
- a missing visual fact materially blocks the particle design and cannot be resolved from current prompt/reference evidence.

## Canonical Owners

```text
Particle entry/boundary
→ docs/02-reference/particle/README.md

Knowledge navigation / evidence classes
→ docs/02-reference/particle/knowledge-map.md

Bedrock fundamentals
→ docs/02-reference/particle/fundamentals.md

Emitter lifecycle / rates / shapes
→ docs/02-reference/particle/emitter.md

Motion / collision / parametric paths
→ docs/02-reference/particle/motion.md

Appearance / rendering / atlas
→ docs/02-reference/particle/appearance-rendering.md

Particle Molang
→ docs/02-reference/particle/molang.md

Curves
→ docs/02-reference/particle/curves.md

Events / nested effects
→ docs/02-reference/particle/events.md

Snowstorm / Wintersky compatibility
→ docs/02-reference/particle/snowstorm.md

Performance reasoning
→ docs/02-reference/particle/performance.md

Entity integration context
→ docs/02-reference/particle/entity-integration.md

Troubleshooting
→ docs/02-reference/particle/troubleshooting.md

Intent normalization
→ docs/02-reference/particle/authoring-spec.md

Authoring sequence
→ docs/02-reference/particle/workflow.md

Static/preflight QA
→ docs/02-reference/particle/qa.md

Package contract
→ docs/02-reference/particle/delivery.md

Reusable physical patterns
→ docs/02-reference/particle/patterns.md

Parent reference routing
→ docs/02-reference/flow.md
```

Do not maintain parallel copies of these rules in this Skill.

## Knowledge Loading Rule

Do not preload the entire particle domain.

```text
need component/document ownership
→ fundamentals.md

need spawn rate/lifetime/shape
→ emitter.md

need trajectory/physics/collision
→ motion.md

need material/billboard/UV/tint/atlas
→ appearance-rendering.md

need expression/variable ownership
→ molang.md

need lifetime interpolation
→ curves.md

need child/nested effect architecture
→ events.md

need editor-preview compatibility
→ snowstorm.md

need count/overdraw/cost guidance
→ performance.md

need locator/entity attachment assumptions
→ entity-integration.md

unclear symptom / causal owner
→ troubleshooting.md

need physical design pattern
→ patterns.md
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
- full Molang runtime execution.

## Input Rule

Particle authoring may start from any sufficient combination of:

```text
text-only effect request
existing user image/reference
existing world/object context
previously approved particle behavior
existing Bedrock particle package
```

A newly generated reference image is optional evidence, not a prerequisite.

## Runtime Compatibility Rule

When Snowstorm/Wintersky preview fidelity matters and authored launch magnitude is important:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

Treat Bedrock validity, Snowstorm compatibility, and visual approval as separate concerns.

## Stable Ownership Rule

Keep emitter timing emitter-owned. Keep living-particle classes particle-owned using stable particle random/age/lifetime values. Do not use emitter-age thresholds to switch existing particles between motion, UV, size, or tint classes unless that instability is explicitly desired.

## Quality Rule

Never package immediately after authoring. Follow the canonical QA sequence first. Static heuristics may warn about motion, keep-out overlap, readability, atlas hygiene, or particle count, but they never substitute for user visual review.

Run only particle-relevant QA. Do not require image-reference QA when no image-reference artifact exists.

## Delivery Rule

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, versioned scratch filenames, duplicate textures, image-reference packages, or internal QA debris unless explicitly requested.

## Downstream Relationship

Codex or MCP may consume the completed package later, but this Skill does not require MCP or the image-reference branch to create or validate the asset. The particle package is the handoff boundary.
