# Particle Knowledge Map

This file is the navigation owner for durable particle knowledge used by ChatGPT-side Particle Reference Authoring.

## Evidence Classes

Every important rule should be understood as one of four evidence classes:

```text
OFFICIAL BEDROCK
  documented Minecraft Bedrock particle behavior or schema

SNOWSTORM / WINTERSKY
  editor or preview-runtime behavior specific to Snowstorm/Wintersky

EMPIRICALLY VERIFIED
  behavior reproduced during accepted particle authoring work

HEURISTIC
  bounded authoring guidance used for QA or design decisions; not runtime truth
```

Do not silently upgrade a Snowstorm-specific observation into Bedrock validity, or a heuristic into visual/runtime proof.

## Read Order

```text
need Bedrock structure / component ownership
→ fundamentals.md

need particle Molang behavior / variable ownership
→ molang.md

need Snowstorm editor / Wintersky preview compatibility
→ snowstorm.md

need request normalization
→ authoring-spec.md

need authoring sequence
→ workflow.md

need validation
→ qa.md

need final package
→ delivery.md

need reusable physical starting model
→ patterns.md
```

## Coverage Map

Current durable knowledge covers:

```text
DOCUMENT
├─ description / render parameters
├─ components
├─ curves
└─ events

EMITTER
├─ initialization
├─ rate: instant / steady / manual
├─ lifetime: looping / once / expression
├─ lifetime events / timelines
└─ shapes: point / sphere / box / disc

PARTICLE
├─ lifetime
├─ initial speed / spin
├─ motion dynamic
├─ motion parametric
├─ collision
├─ billboard / UV / flipbook
└─ tinting

MOLANG
├─ emitter-owned variables
├─ particle-owned variables
├─ random ownership
├─ curves
├─ per-frame expressions
└─ cost / stability guidance

EVENTS
├─ expression
├─ sequence
├─ randomize
├─ sound
└─ nested particle effect

SNOWSTORM / WINTERSKY
├─ live preview
├─ Quick Setup
├─ event preview
├─ texture editing
├─ vector initial-speed caveat
└─ editor/runtime parity limits
```

## Source Priority

Prefer sources in this order for durable factual claims:

1. Microsoft Minecraft Creator particle JSON documentation.
2. Microsoft Snowstorm overview/tutorial for editor positioning.
3. Snowstorm repository/release notes for current editor behavior.
4. Wintersky repository/source behavior when preview semantics matter.
5. Accepted project evidence for reproduced compatibility issues.
6. Heuristic authoring guidance only where authoritative/runtime proof is unavailable or unnecessary.

## Current Knowledge-Gap Queue

The following are intentionally not yet treated as fully closed knowledge areas:

```text
render material blending/sorting edge cases
all facing_camera_mode nuances
all entity-space/local-space transforms
collision edge cases and event timing
full event timeline semantics
all curve types and edge behavior
resource-pack/entity binding variants
performance behavior on target hardware
Snowstorm vs Minecraft parity edge cases
```

Expand these only from authoritative source evidence or a reproduced real case. Do not create speculative rules merely to make the knowledge tree look complete.

## Sources

Primary references:

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/particleeffects?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
- https://github.com/JannisX11/snowstorm
- https://github.com/JannisX11/wintersky
