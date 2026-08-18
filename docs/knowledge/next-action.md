# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T4_CI_VERIFIED
TEXTURING_T5_IMPLEMENTED_CI_UNVERIFIED
TEXTURING_T6_PRODUCTION_DISCIPLINE_SOURCE_IMPLEMENTED
TEXTURING_T7_T17_DEEP_HARDENING_SOURCE_IMPLEMENTED
TEXTURING_T18_NO_CHANGE_REQUIRED
TEXTURING_FINAL_STATIC_AUDIT_COMPLETE
TEXTURING_CI_TERMINAL_PROOF_BLOCKED_BY_CURRENT_ENVIRONMENT
ANIMATION_SAMPLE_FORENSICS_COMPLETE
ANIMATION_A0_A10_NEXT_TO_DO_RECORDED
ANIMATION_MATH_PROCEDURAL_RESEARCH_COMPLETE
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5 + T0–T18 decisions + Animation A0–A10 forensic roadmap + Molang math research**.

Actual desktop Painter behavior, UV persistence, animation playback/quality, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.
**Do not claim live desktop Blockbench/model-quality or animation-quality improvement without actual matching runtime proof.**
**Experimental browser proof does not upgrade desktop MCP claims.**

## Active Boundary

```text
current user instruction
→ current source + relevant proof
→ AGENTS.md + GITHUB_RULES.md
→ this continuation owner
```

The user explicitly does **not** plan local testing in the near term. Do not route UV/texture or animation continuation to local acceptance, do not make it the next step, and do not repeatedly recommend it. `docs/knowledge/operations/local-acceptance-runbook.md` remains inactive until a fresh explicit user instruction reactivates it.

`Experimental/**` remains **PAUSED BY USER**.

## MCP Texturing State

T0–T4 retain their recorded CI-verified Painter, UV observation/mapping, bounded pixel authoring, and Texture Design Contract baseline. T5 difference-first visual convergence remains implemented; do not upgrade its CI/runtime status without exact matching proof.

### T6 — production discipline

```text
new AI Bedrock logical UV = 128×128
one base-color atlas PNG for the whole model
physical color bitmap = smallest sufficient square 128-based size
UV / Atlas Gate before production pixels
material-family palette ramps
face-aware form shading
identity before decorative microdetail
flat fill cannot pass supported form/material/detail requirements
```

### T7 — atlas lifecycle integrity

`create_texture` preflights production role before Undo:

```text
base color candidate
→ first atlas only
→ second normal base-color texture rejected

explicit color variant
→ explicit non-material TextureGroup
→ exactly one established base atlas
→ new blank variant matches base bitmap size

PBR support
→ normal / height / MER
→ material TextureGroup required
→ new blank support texture matches established base bitmap size
```

Imported existing data may preserve authored dimensions. Non-material groups remain explicit color variants.

### T8 — global atlas / UV observability

`list_textures` returns structured atlas inventory plus bounded global UV audit:

```text
texture role / group / PBR channel
default + selected identity
bitmap dimensions
logical UV dimensions
physical pixels per UV unit
atlas state: none | single | fragmented
invalid UV
out-of-bounds UV
fractional UV
unlocked Box-UV Cubes
exact reuse regions
partial-overlap candidates
production gate: ready | review_required
```

Exact reuse is evidence, not automatically an error. Partial overlap is a review candidate, not an auto-packer judgement. Packing percentage remains non-authoritative.

### T9–T10 — UV lock and grid discipline

```text
initial native auto UV as provisional mapping
→ audit/correct uv_offset / mirror_uv
→ autouv=0
→ production paint
```

Integer logical UV is the normal AI pixel-art target. Fractional UV, out-of-bounds state, invalid UV, unlocked Box UV, and unexplained partial overlap block the production UV gate until resolved or explicitly justified.

### T11 — texel-scale contract

Logical UV remains stable at 128×128. Physical bitmap determines detail density:

```text
128 bitmap → 1× physical pixels / UV unit
256 bitmap → 2×
384 bitmap → 3×
512 bitmap → 4×
...
```

Reasoning scales identity marks, material detail, and microdetail to reported `physical_pixels_per_uv_unit`; a larger bitmap is not itself a quality claim.

### T12–T17 — professional texture language

Active policy/skill/prompt require, when supported:

```text
material-specific value + hue ramps
face-aware form separation
contact / occlusion darkening where real geometry supports it
edge treatment appropriate to material
hard-pixel alpha discipline (normally 0 / 255)
identity-critical marks before material microdetail
material detail before optional wear/noise
```

Texture must reinforce actual geometry; shading must not invent major fake silhouette/volume.

### T18 — focused texture evidence

**No new public crop parameter/tool is justified.** Current source provides:

```text
get_texture → full-atlas image + exact texture/logical/physical density metadata
list_textures → global bounded UV atlas audit
inspect_element → exact affected face → physical texture rect
```

Do not add a crop API until a concrete limitation proves these retained surfaces insufficient.

## Texture Regression Owners

- `mcp/tests/texture-authoring-contract.test.ts`
- `mcp/tests/texture-design-reasoning.test.ts`
- `mcp/tests/texture-visual-convergence.test.ts`
- `mcp/tests/texture-production-discipline.test.ts`
- `mcp/tests/texture-atlas-integrity.test.ts`

## Texture Final Static Audit

Completed after T7–T18. It re-checked project UV ownership, atlas lifecycle/audit, Cube UV lock, explicit Painter targeting, PBR/variant ownership, guidance alignment, and convergence evidence. Routing and PBR-group gaps found by the audit were fixed. No further concrete texture source redesign is justified.

`mcp-verify.yml` watches the texturing skill and Texture Standard consumed by MCP tests.

## Texture CI Proof Retrieval Boundary

Terminal Actions proof was attempted on 2026-08-18 and could not be retrieved from the current execution environment:

```text
GitHub connector commit-run lookup → exposes PR-triggered runs only; Local work is direct push
combined commit status             → no legacy status contexts returned
GitHub CLI                         → unavailable (`gh: command not found`)
container GitHub REST fallback     → unavailable (DNS resolution failure)
```

Therefore **no CI PASS or FAIL is claimed**. This is an evidence-access blocker, not evidence that CI passed or failed.

Relevant snapshots:

```text
255f303ac2a1edb527900bdc1ec3fc9cfff214ae  last texture source/test change requiring MCP Verify
b58fbdb323227cf5d492dacd6d55bc3bb8c25794  final static-audit documentation head before blocker note
```

Do not change texture source merely to trigger CI, do not reopen T7–T18 without a concrete defect, and do not substitute local testing.

## Animation Professional Sample Forensics — 2026-08-18

Seven supplied professional `.bbmodel` samples were inspected. Direct animation evidence exists in four:

```text
Anky            8 animations / 6 controllers   → organic creature, gait, tail chain, attack, crossbow, Molang
Helicopter      3 animations / 1 controller    → mechanical start / loop / stop + sound
Ninja Master    3 animations / 2 controllers   → subtle idle + authored random idle variation
Weapon/Katana  89 animations / 12 controllers → shared player/weapon library, 1P/3P, combat, procedural layering
```

Dragon Helmet, Outdoor Table, and Skeleton Spinosaurus contain no animation tracks in the supplied files; do not infer motion recipes from them.

Retained forensic findings:

```text
3,516 inspected keyframes
→ almost entirely linear interpolation
→ Bezier/Catmull complexity is not the observed quality driver

all inspected samples obey their authored snapping grid
→ FPS/snapping varies by asset; do not impose one universal FPS

professional quality primarily comes from
→ pose hierarchy
→ timing discipline
→ phase offsets
→ weight/counter-motion
→ secondary-chain delay
→ explicit action recovery
→ Molang procedural layers
→ controller composition
→ causal sound/particle timing
```

Sample-specific evidence must remain evidence, not presets. Do not infer a universal animation length, keyframe count, amplitude, phase, FPS, or controller topology.

### Generalizable motion patterns retained

```text
organic secondary chain
→ driver → delayed followers
→ phase delay changes across chain
→ amplitude may change toward the tip

locomotion
→ left/right limbs use designed phase relationships
→ run is not merely walk played faster
→ stride/amplitude/body compensation may differ

idle
→ low-amplitude living baseline
→ occasional authored identity gesture
→ controller may choose among authored variants instead of randomizing bones

action
→ anticipation → action/impact → follow-through → recovery → neutral
→ identity-critical action favors explicit authored timing over ambient procedural motion

mechanical
→ sparse keys are acceptable when rate/state/effects are correct

perspective
→ first-person and third-person may share intent without sharing the same motion solution

effects
→ synchronize to causal/visible event phase, not automatically animation start
```

### Procedural / authored ownership learned from samples

```text
continuous living / cyclic secondary motion
→ Molang/procedural expression is often appropriate

identity-critical attack / smash / interaction
→ explicit authored key poses and timing

state/context selection + layered composition
→ AnimationController
```

Do not replace explicit authored action with generic sinusoidal motion, and do not keyframe every continuous cyclic detail when a clear procedural driver is more appropriate.

## Molang Math / Procedural Animation Research — 2026-08-18

Authoritative Bedrock/Blockbench documentation confirms that mathematical animation is authored through Molang expressions in animation transform values, animation properties, and AnimationController expressions. It is not a separate animation subsystem.

### Core timing / driver facts

```text
q.anim_time
→ current animation time in seconds

q.delta_time
→ elapsed time since previous rendered frame

anim_time_update default
→ q.anim_time + q.delta_time

q.modified_distance_moved
→ horizontal distance driver affected by relevant entity modifiers

q.modified_move_speed
→ current modified walking speed

q.state_time
→ time spent in current animation-controller state; modern format requirement applies
```

Use the driver that represents the intended cause. Time-driven motion is appropriate for breathing/vibration/mechanical cycles; distance-driven motion can keep locomotion or wheel phase tied to actual travel instead of wall-clock speed.

### Important math semantics

Molang trigonometric functions use **degrees**, not radians.

```text
math.sin(angle_degrees)
math.cos(angle_degrees)
math.clamp(value, min, max)
math.inverse_lerp(start, end, value)
math.lerp(start, end, t)
math.lerprotate(start, end, t)
math.hermite_blend(t)
math.min_angle(angle)
math.mod(value, denominator)
math.exp(value)
math.abs / min / max / sqrt / pow / sign
```

Current official Molang also exposes easing functions, but supplied professional samples do not justify replacing their timing/pose discipline with generic easing recipes.

### Mathematical building blocks to retain

These are reasoning forms, **not fixed presets**:

#### Periodic oscillation

```text
value = base + amplitude * sin(360 * frequency_hz * time + phase_deg)
```

Appropriate for breathing, idle sway, vibration, rotor-like cyclic response, antenna/cloth micro-motion, and similar continuous periodic behavior.

#### Left/right gait phase

```text
right = base + A * cos(theta)
left  = base + A * cos(theta + 180)
```

Real gait may need non-180 offsets, different amplitudes, body compensation, and authored contact phases. Mathematical phase is a starting relationship, not a complete gait generator.

#### Traveling wave / secondary chain

```text
bone_i = base_i + A_i * sin(theta + phase_i)
phase_i progresses along the chain
```

Use for tail/cloth/rope/antenna-like followers when a continuous driver is appropriate. Sample Anky supports this pattern. Identity-critical smash/attack motion should switch to authored poses when procedural motion would erase the action shape.

#### Normalized response / remap

```text
p = clamp(inverse_lerp(input_min, input_max, input), 0, 1)
value = lerp(output_min, output_max, p)
```

Useful for speed→amplitude, look-angle→pose response, charge→extension, or other bounded controls.

#### Smooth normalized transition

```text
p = clamp(inverse_lerp(t0, t1, time), 0, 1)
e = hermite_blend(p)
value = lerp(start, end, e)
```

Useful where a mathematically defined smooth transition is simpler than dense keys. Do not use it to bypass identity-critical authored poses.

#### Damped settling approximation

```text
value = base + A * exp(-damping * time) * sin(360 * frequency * time + phase)
```

Potential use: recoil settling, spring/antenna response, mechanical vibration after impact. Treat as an approximation and keep it bounded to an appropriate one-shot/state-time domain.

#### Angular shortest path

```text
lerprotate(start_angle, end_angle, t)
```

Useful for bounded orientation response where wrapping across ±180° would otherwise take the long path.

### Animation-level math controls

```text
anim_time_update
→ controls how timeline time advances; can scale or modulate playback rate

blend_weight
→ Molang expression can scale the amplitude/contribution of an animation

controller animation blend value
→ Molang can conditionally or continuously weight a layered animation

controller variables / remap
→ can normalize gameplay/query data into reusable animation weights
```

This supports a layered architecture such as:

```text
base authored locomotion
+ procedural look layer
+ procedural breathing / tail layer
+ conditional attack layer
+ controller/query-driven blend weights
```

### Math-animation guardrails

```text
DO use math when the motion is continuous, cyclic, reactive, or naturally parameterized.
DO use authored key poses for identity-critical action, impact, silhouette, contact, or deliberate acting.
DO bind effects to causal events rather than arbitrary equation extrema unless the extrema are the actual event.
DO preserve authored Molang strings exactly; BlockIT should not evaluate them as gameplay truth.
DO choose phase/frequency/amplitude from the asset and intent, not a global preset.

DO NOT use per-frame math.random directly for arbitrary transform jitter.
DO NOT turn every animation into sine waves.
DO NOT replace walk/run contact design with a generic mirrored cosine alone.
DO NOT increase Bezier/curve complexity just because math expressions exist.
```

For controlled randomness, prefer selecting an authored variant/state or initializing a variable once at the appropriate controller/event boundary instead of generating new random transform values every rendered frame.

## Animation A0–A10 — NEXT TO DO

Development must begin with source audit and regression-owner discovery; do not assume every item requires a new tool.

### A0 — creation / timeline parity audit — P1

Audit whether new-animation creation should directly accept the existing `once | loop | hold` loop-mode and snapping intent to avoid unnecessary follow-up calls. Current timeline already supports these modes; change only if source evidence proves a meaningful authoring gap.

### A1 — existing-animation effect mutation — P0

Add bounded mutation parity for existing authored Animation particle/sound effect events:

```text
add
update
remove
exact timestamp / effect / locator / bind/script ownership
one coherent Undo owner
```

Prefer extending an existing animation owner over adding a speculative tool family.

### A2 — controller-state particle/sound mutation — P0

Extend `manage_animation_controller` only after native source semantics are confirmed. State particle mutation has direct evidence in supplied samples. State sound remains a capability gap but has weaker supplied-sample evidence; implement only with authoritative source support.

### A3 — Professional Animation Design Contract — P0

Before keyframing define:

```text
motion archetype / intent
duration + snapping intent
primary driver bones
counter-motion / support bones
secondary followers / chains
phase relationships
contact / attachment constraints
procedural vs authored ownership
effect causal events
loop seam or neutral-return requirement
```

Suggested reasoning archetypes, not presets:

```text
PROCEDURAL_LAYER
LOOP_ORGANIC
LOCOMOTION
ACTION
MECHANICAL
HOLD_POSE
IDLE_VARIANT
FIRST_PERSON_ACTION
THIRD_PERSON_ACTION
```

### A4 — gait / phase + secondary-chain reasoning — P0

Make phase relationships first-class. Mirror/copy is not a gait generator. For chains, reason about driver, lag, amplitude hierarchy, propagation, and attachment before creating dense keyframes.

### A5 — Molang procedural vs authored-keyframe ownership — P0

Formalize the retained math research into active skill/prompt/policy guidance. Preserve authored Molang text; do not evaluate or invent gameplay state. Prefer math for continuous cyclic/response motion when it improves clarity and reduces unnecessary key density. Prefer authored keys for identity-critical poses/actions.

### A6 — action timing / weight contract — P0

Require explicit action phases when relevant:

```text
anticipation
→ acceleration/action
→ impact/contact
→ overshoot/follow-through
→ recovery
→ neutral / loop handoff
```

Whole-body counter-motion and stabilization should follow actual intent/rig; do not rotate only the attacking extremity when weight transfer is visually material.

### A7 — causal effect synchronization — P0

Particle/sound events must attach to a named causal motion event such as release, contact, ignition, landing, or state start/stop. Do not default effects to timestamp zero.

### A8 — idle variation architecture — P1

Retain subtle base idle plus optional authored identity variants. Randomness should normally select controlled authored states/clips rather than inject random transforms into arbitrary bones.

### A9 — perspective-aware motion planning — P1

When both first-person and third-person presentation are required, treat them as separate framing problems. Reuse only the parts whose motion remains visually valid from both perspectives.

### A10 — animation difference-first convergence + final static audit — P1

Create a bounded review order:

```text
pose/readability
→ timing/phase
→ weight/contact
→ attachment/clipping
→ secondary motion
→ effect synchronization
→ loop seam / neutral return
```

Use qualitative `IMPROVED | UNCHANGED | REGRESSED`; do not introduce an animation quality score.

## Animation Explicit Deferrals

Do **not** prioritize these from the supplied samples:

```text
blend-curve mutation
→ current samples do not use controller blend curves; keep protected until evidence requires it

bone-binding expressions
→ no sufficient supplied-sample evidence yet

more Bezier/graph-editor complexity
→ supplied professional animations are overwhelmingly linear
```

## Active Next Step — A1–A7 SOURCE AUDIT + IMPLEMENTATION PLAN

1. Audit exact source owners for existing-animation effects, controller-state effects, animation creation properties, Molang transform preservation, `anim_time_update`, `blend_weight`, timeline loop/snapping, and inspection output.
2. Confirm native Blockbench Undo and identity semantics before any mutation extension.
3. Identify regression owners and exact public-schema impact before changing code.
4. Implement **A1 existing-animation effect mutation** and **A2 controller-state effect mutation** where native evidence is complete.
5. Implement **A3–A7 reasoning contracts**, including retained math/procedural animation guidance, without adding preset generators or animation quality scores.
6. Reassess A0 only if the source audit shows meaningful extra calls or missing authoring parity.
7. Keep A8–A10 for the next bounded phase after A1–A7 source closure.

### Passive texture closure

When an environment can see push-triggered GitHub Actions runs, retrieve the retained texture CI proof and close it if green. This is passive evidence closure and must not displace the active Animation scope.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
