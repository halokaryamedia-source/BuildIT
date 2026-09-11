# Particle Troubleshooting Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## Principle: diagnose by causal layer

Do not regenerate the whole effect because one symptom looks wrong.

Map symptom → likely owner first:

```text
not spawning          → identifier / pack / emitter lifetime / trigger
wrong origin          → emitter shape / offset / locator
wrong direction       → shape direction / attachment orientation
wrong range           → initial speed / acceleration / drag / lifetime
wrong density         → rate / lifetime / max_particles / fan-out
wrong sprite          → texture / UV / flipbook
wrong transparency    → material / alpha / atlas edge
flicker/class switch  → unstable ownership expression
missing child effect  → event / identifier / parent lifetime
performance issue     → count / overdraw / collision / events / Molang
```

## Effect does not appear

Check:
1. effect identifier is exact and lowercase namespace:path;
2. resource-pack file exists and JSON parses;
3. `description.basic_render_parameters` has valid material/texture;
4. emitter activation/lifetime actually allows emission;
5. emitter rate produces particles;
6. texture path resolves;
7. trigger/binding exists if entity/animation driven;
8. Snowstorm preview issue is not being confused with content failure.

**OFFICIAL BEDROCK NOTE**

Particle effects are client-side. Server-side `/particle` invocation may not report a useful error for a missing effect, so absence of an error message does not prove the effect exists.

## Effect appears but is stationary

Check:
- emitter shape direction;
- initial speed;
- dynamic or parametric motion component;
- expressions evaluating to zero;
- attachment/local-space behavior;
- whether a direction-facing sprite merely looks stationary because of orientation.

## Effect moves too slowly in Snowstorm

**EMPIRICALLY VERIFIED**

If vector initial speed is used and Snowstorm/Wintersky shows unexpectedly weak magnitude:

```text
move heading to emitter shape direction
use scalar particle_initial_speed
```

Do not classify this as invalid Bedrock syntax; treat it as Snowstorm-target compatibility.

## Effect changes behavior mid-life

If existing particles suddenly change trajectory, UV class, size, or tint together:
- search living-particle properties for `variable.emitter_age`;
- replace class selection with stable particle random values where appropriate;
- use particle age/lifetime for per-particle evolution.

This was a major empirically reproduced failure class in the accepted eruption workflow.

## Wrong trajectory

Debug strictly in this order:

```text
spawn position
→ direction
→ initial speed
→ acceleration
→ drag
→ lifetime
→ collision/environment conditions
```

Do not adjust spawn rate or texture to fix trajectory.

## Debris does not reach target distance

Likely causes:
- speed too low;
- launch angle too vertical;
- drag too high;
- lifetime too short;
- gravity too strong.

Change the smallest causal parameter first.

## Smoke shoots like debris

Likely causes:
- initial speed too high;
- drag too low;
- narrow/high-energy direction;
- ballistic settings reused for plume layer.

Split into a separate plume physics role if needed.

## Smoke looks like a solid wall

Likely causes:
- too many overlapping blended sprites;
- alpha too high;
- sprites too large;
- spawn region too compact;
- particles hidden/stacked inside geometry.

Fix opacity, spawn distribution, and density before adding more texture detail.

## Texture has white edges

Check:
- source PNG has true alpha;
- no white matte around visible pixels;
- filtering exposes neighboring atlas content;
- gutter exists around visible sprite;
- transparent pixels do not contain unintended bright fringe.

## Flipbook jumps or samples wrong frames

Check:
- texture_width/height;
- base UV;
- frame size;
- step UV;
- max frame;
- FPS;
- atlas row/column ordering.

## Directional billboard looks unstable

Check:
- motion direction is non-zero;
- velocity does not collapse to nearly zero;
- correct direction_x/direction_y mode is used;
- attachment rotation matches intended orientation.

## Child event never fires

Check:
1. child effect works independently;
2. identifier is exact;
3. event trigger is actually reached;
4. parent remains alive long enough;
5. event type is correct;
6. pre-effect expression does not invalidate setup;
7. Snowstorm version does not have a preview regression.

## Collision effect never fires

Check:
- collision enabled;
- collision radius reasonable;
- particle actually reaches geometry;
- min_speed threshold not too high;
- event name exists;
- particle does not expire before contact.

## Too many particles

Check population equation:

```text
spawn_rate × lifetime
subject to max_particles
```

Then inspect event fan-out. Reducing spawn rate alone may not fix accumulation if child effects dominate.

## Snowstorm vs Minecraft mismatch

Classify the difference:

```text
Bedrock JSON semantic issue?
Snowstorm compatibility issue?
Snowstorm version regression?
Minecraft runtime-only context?
entity attachment/orientation issue?
```

Do not rewrite valid Bedrock content solely to satisfy one editor preview unless the user specifically targets that preview behavior.

## Triage severity

### BLOCKING
- invalid JSON;
- missing identifiers/textures;
- no emission;
- runaway event recursion;
- package paths broken.

### MATERIAL
- wrong motion class;
- major visual mismatch;
- unstable class switching;
- unreadable target-distance scale;
- severe overdraw/density.

### ADVISORY
- conservative budget warning;
- minor gutter risk;
- small color/readability concerns requiring visual review.

## Minimal correction rule

After diagnosis:

```text
change one causal layer
→ rerun only affected QA + dependencies
→ preserve approved unaffected layers
```

Examples:
- texture correction should not rewrite motion;
- trajectory correction should not regenerate atlas;
- event timing correction should not replace all child effects.
