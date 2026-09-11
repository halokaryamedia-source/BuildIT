---
name: lazydesigner-particle-reference-authoring
description: ChatGPT-side specialist for creating Minecraft Bedrock/Snowstorm particle reference assets, textures, static preflight evidence, and clean delivery packages before optional Codex or MCP handoff.
---

# LazyDesigner Particle Reference Authoring

Specialist used inside the canonical Reference Preparation domain for particle/VFX tasks.

## Route

```text
USER PARTICLE REQUEST
→ docs/02-reference/particle/authoring-spec.md
→ docs/02-reference/particle/workflow.md
→ author JSON + textures
→ docs/02-reference/particle/qa.md
→ docs/02-reference/particle/delivery.md
→ USER VISUAL REVIEW
→ optional Codex / MCP handoff
```

## Canonical Owners

```text
Particle entry/boundary
→ docs/02-reference/particle/README.md

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

Parent reference flow
→ docs/02-reference/flow.md
```

Do not maintain parallel copies of these rules in this Skill.

## Boundary

This Skill owns ChatGPT-side particle reference generation. It may produce:
- Bedrock `.particle.json` files;
- particle textures/atlases;
- resource-pack structure;
- static/preflight diagnostics;
- concise usage notes;
- a clean package ready for user review or downstream handoff.

It does not own:
- MCP tool implementation;
- Blockbench runtime mutation;
- animation/controller binding;
- live Snowstorm/Minecraft visual truth;
- FPS/device benchmarking;
- full Molang runtime execution.

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

## Delivery Rule

Deliver ordinary Bedrock Resource Pack files/folders or ZIP according to `delivery.md`. Do not create `.mcpack`, versioned scratch filenames, duplicate textures, or internal QA debris unless explicitly requested.

## Downstream Relationship

Codex or MCP may consume the completed package later, but this Skill does not require MCP to create or validate the asset. The particle package is the handoff boundary.
