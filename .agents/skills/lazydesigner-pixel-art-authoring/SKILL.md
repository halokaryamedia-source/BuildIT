---
name: lazydesigner-pixel-art-authoring
description: ChatGPT-side specialist for deliberate grid-accurate pixel art authoring, reference conversion, Minecraft-native icons, object sprites, tile/pattern assets, and texture references with strict silhouette, cluster, palette, and handoff discipline.
---

# LazyDesigner Pixel Art Authoring

Canonical Reference Preparation specialist for standalone pixel-art tasks.

It owns pixel-art reasoning and artifact preparation. It does **not** own Blockbench texture mutation, UV/atlas state, model geometry, Bedrock particle runtime semantics, or bone animation.

Canonical domain index:

```text
docs/02-reference/pixel-art/README.md
```

## Hot Path

```text
USER REQUEST
→ normalize only material intent fields
→ classify artifact once
→ select target mode
→ choose lowest viable grid/detail budget
→ resolve silhouette/composition
→ author with deliberate clusters + palette/material language
→ run applicable QA once
→ deliver asset or compact downstream handoff
```

Artifact classes:

```text
ICON
OBJECT / PROP
SPRITE
TILE / PATTERN
TEXTURE_REFERENCE
AUDIT / REVISION
```

Target modes:

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
```

## True Pixel Rule

Pixel art is authored on an integer grid.

Never satisfy the request by:

```text
smooth illustration
→ blur/downscale/pixelation filter
→ nearest-neighbor upscale
→ call it finished
```

Required causal order:

```text
GRID
→ SILHOUETTE
→ MAJOR MASSES
→ PALETTE
→ PIXEL CLUSTERS
→ MATERIAL / SHADING CUES
→ IDENTITY ACCENTS
→ QA
```

Reject accidental anti-aliasing, mixed pixel scale, uncontrolled gradients, random orphan noise, pseudo-pixel artifacts, and detail that does not improve identity/function.

## Resolution Budget

Choose the smallest grid that preserves requested identity and use.

Planning tiers may include:

```text
MICRO      8×8 / 12×12
ICON       16×16
DETAILED   24×24 / 32×32
HD_PIXEL   48×48 / 64×64
SPECIAL    explicit target
```

These are planning aids, not universal defaults. Explicit target requirements override them.

## Style / Series Rule

For related assets, reuse one compact `style_lock_id` and only decision-relevant fields from:

```text
docs/02-reference/pixel-art/style-lock.md
```

Do not retransmit prior prompts, full asset history, or full Pixel Art docs for each new icon.

## Revision Rule

Bounded revision requires:

```text
CHANGE
PRESERVE
```

Preserve all still-valid accepted identity/style fields by default. Do not redesign unrelated regions during a correction.

Detailed normalization is owned by:

```text
docs/02-reference/pixel-art/prompt-contract.md
```

## Minimal Owner Loading

Do **not** preload the Pixel Art corpus.

Start with one primary owner selected from the domain README.

Typical bundles:

```text
simple icon
→ SKILL + iconography.md

object / prop
→ SKILL + object-prop.md

reference conversion
→ SKILL + reference-conversion.md

Minecraft target
→ SKILL + relevant artifact owner
→ minecraft-compatibility.md only when target-specific rules matter

sprite
→ SKILL + sprites.md
→ animation.md only when frame motion is requested

tile / repeat
→ SKILL + tiles-patterns.md

existing asset correction
→ SKILL + audit-revision.md
→ one causal technical owner
```

Add a second technical owner only when a real dependency changes the next decision.

Load `qa.md` near finalization, not after every pixel mutation. Load `delivery.md` only for packaging or downstream handoff.

## Core Visual Discipline

Keep these invariants without loading extra docs unless a material decision needs detail:

```text
silhouette before micro-detail
coherent clusters over isolated noise
smallest useful palette
material identity through value/cluster/highlight behavior, not hue alone
actual target-size readability over zoomed-in prettiness
transparent background/edges remain clean when required
reference identity outranks decorative invention
```

For series work, style consistency is judged against the shared Style Lock, not against literal identical colors/shapes.

## Minecraft Modes

`MINECRAFT_NATIVE`:

```text
compact palette
strong silhouette
large readable clusters
low/canonical detail budget
vanilla-compatible abstraction
```

`MIVUBI_HD_PIXEL`:

```text
strict grid retained
richer controlled material definition
refined clusters
strong normal-scale readability
no painterly gradients or micro-noise inflation
```

Detailed target guidance lives in `minecraft-compatibility.md`.

## Reference Conversion

Treat source imagery as evidence, not as a bitmap to pixelate.

Priority:

```text
silhouette
→ proportion
→ identity landmark
→ material distinction
→ color identity
→ secondary detail
```

Simplify unsupported detail rather than inventing complexity.

## QA

Near finalization, load `qa.md` and evaluate applicable gates once.

Minimum concerns:

```text
grid integrity
silhouette readability
cluster coherence
palette economy
pixel-scale consistency
material readability
identity fidelity
target compatibility
edge/alpha cleanup
style-lock consistency when applicable
frame consistency when animated
```

Verdict:

```text
PASS | REVISE | BLOCKED
```

On `REVISE`, apply the smallest causal correction, then rerun only affected gates.

## Handoff Boundary

Pixel Art is Reference Preparation, not a Control authoring stage.

```text
Pixel Art → Texturing
```

Pass approved visual constraints only. Texturing owns UV, atlas, Blockbench texture state, render/material state, and mapped verification.

```text
Pixel Art → Particle
```

Pass texture/frame visual facts only. Particle owns emitter, lifecycle, motion, Molang, collision, and events.

Exact compact handoff shape is owned by:

```text
docs/02-reference/pixel-art/delivery.md
```

Do not carry the entire Pixel Art corpus downstream.

## Evidence Classes

Preserve:

```text
USER_REQUIREMENT
REFERENCE_SUPPORTED
EXISTING_STYLE_SUPPORTED
PROVISIONAL
```

Never present provisional dimensions, palette, light direction, or style interpretation as user-approved truth.

## Stop Condition

Stop Pixel Art authoring when:
- the requested artifact is produced/revised;
- applicable QA reaches the available proof ceiling;
- unresolved blockers are explicit;
- requested delivery/handoff is complete;
- no downstream Texturing/Particle/Blockbench ownership is being duplicated.
