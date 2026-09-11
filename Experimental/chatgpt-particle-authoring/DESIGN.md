# Experimental Particle Preflight Design

This document is the technical owner for the ChatGPT particle-authoring experiment under `Experimental/`. It does not define production capability.

## Development contract

### Goal

Capture the smallest reusable validation logic learned from the approved ChatGPT-authored volcano particle so BuildIT can later strengthen its existing particle tools without adding a parallel authoring system.

### Success metric

The experiment must deterministically detect the recurring defect classes reproduced during the volcano authoring session:

- Snowstorm / Wintersky vector-speed magnitude loss;
- emitter-age switching of living-particle motion or appearance;
- obviously wrong ballistic/rising motion against an explicit target envelope;
- incoherent multi-effect bundles;
- objectively broken texture atlases;
- malformed or ambiguous authoring acceptance targets.

### Forbidden proxy / non-goal

- No claim of visual quality from static checks.
- No claim of live Snowstorm or Blockbench execution.
- No new public MCP tools.
- No second particle parser, Molang runtime, registry, router, PNG stack, or packaging framework.
- No generated API-doc edits from this experiment.
- No automatic promotion into `mcp/**`.

### First wrong owner

The production gap is not basic particle JSON mutation. `inspect_particle` / `manage_particle` already own Bedrock particle documents. This experiment owns only bounded preflight evidence that structural validation cannot provide.

### In scope

1. Import-safe Snowstorm compatibility diagnostics.
2. Bounded numeric Wintersky dynamic-motion approximation for constant inputs.
3. Intent-envelope checks for apex and horizontal travel.
4. Multi-effect bundle integrity checks.
5. Dependency-free QA over already-decoded RGBA atlas pixels.
6. A small explicit authoring intent contract used only as acceptance input.

### Out of scope

- PNG decoding or image mutation.
- Visual scoring.
- Collision/world simulation.
- Full Molang evaluation.
- Minecraft gameplay binding.
- Client-entity or animation-controller mutation.
- Automatic authoring/planning from the intent contract.

### Proof required

Current `REMOTE_GITHUB` work can establish source/static review only. Focused Bun execution is `LOCAL_CODE` proof. Promotion to production additionally requires the owning MCP verifier, generated-doc closure when public contracts change, and separate live proof for native/visual claims.

### STOP condition

Stop experimental expansion when the currently reproduced defect classes are represented by bounded deterministic diagnostics/tests. New framework layers require new evidence.

---

## Architecture

The eventual production design must preserve the existing two-tool public surface.

```text
inspect_particle
├── existing Bedrock structural/semantic inspection
├── target-runtime compatibility diagnostics
├── optional bounded motion preflight
├── optional bundle integrity summary
└── optional asset/intention diagnostics

manage_particle
├── existing create / patch / validate / write / preview
└── consumes the same shared diagnostics before write/preview
```

No new public particle tool is required by current evidence.

## Validation layers

### Layer 1 — Bedrock document validity

Existing production owner:

```text
mcp/lib/bedrockParticleDocument*.ts
mcp/lib/bedrockParticleSemantics.ts
```

The experiment must not redefine valid Bedrock syntax as invalid merely because Snowstorm previews it differently.

### Layer 2 — Snowstorm / Wintersky compatibility

Target-specific warning rules currently include:

```text
vector particle_initial_speed
→ snowstorm_initial_speed_vector_normalized

emitter_age inside per-frame particle motion / billboard / tint
→ unstable_emitter_age_particle_property
```

Recommended Snowstorm-compatible launch pattern when authored magnitude matters:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar
```

Emitter age remains appropriate for emitter-owned timing such as spawn-rate or event scheduling. Stable particle classes should prefer particle random/age/lifetime values.

### Layer 3 — bounded motion preflight

Supported numeric inputs:

```text
direction: vec3
initial scalar speed
constant acceleration: vec3
constant linear drag
lifetime
tick rate
```

The update equation mirrors the relevant Wintersky dynamic-motion behavior:

```text
effective_acceleration = acceleration - velocity * drag
velocity += effective_acceleration * dt
position += velocity * dt
```

The simulator is bounded and reports:

```text
initial_velocity
final_velocity
final_position
apex_y
time_to_apex
maximum_horizontal_distance
simulated_duration
```

It is diagnostic evidence, not a replacement runtime.

### Layer 4 — intent contract

`ParticleIntentContract` records only acceptance facts that materially change validation:

```text
effect_name
target_runtime
view_distance_blocks (optional)
total_duration_seconds (optional)
named motion target envelopes (optional)
```

The intent contract never generates or rewrites particle values. Motion results can be checked against a named target through the existing envelope evaluator.

### Layer 5 — bundle integrity

`validateParticleBundle` checks:

- duplicate bundle identifiers;
- document identifier mismatch;
- missing child-effect references;
- circular child-effect chains;
- orphan effects relative to an explicitly declared root;
- missing texture references when the caller supplies the available texture set.

The compatibility wrapper `validateParticleBundleReferences(entries)` is retained so the initial experimental import path remains valid.

### Layer 6 — texture atlas QA

`analyzeTextureAtlas` is intentionally dependency-free. It accepts decoded RGBA pixels plus an explicit grid contract; image decoding remains outside the experiment.

Static checks include:

```text
RGBA buffer length vs dimensions
grid divisibility
presence of transparency
near-neutral visible-white matte risk
minimum visible-pixel gutter per cell
exact duplicate cells when uniqueness is required
```

The result returns both a compact atlas summary and diagnostics. White-pixel detection is a warning because legitimate white sprites can exist. Static atlas QA never proves visual quality.

---

## Diagnostic ownership

Stable experimental diagnostic codes are centralized in `src/diagnostics.ts`. Callers and tests must assert codes/behavior, not prose wording.

The current modules are deliberately small:

```text
snowstormCompatibility.ts → target-runtime semantics
motionPreflight.ts        → numeric motion approximation + envelope
bundleValidation.ts       → cross-effect/reference integrity
textureAtlasQa.ts         → decoded-pixel atlas checks
intentContract.ts         → acceptance-contract validation
```

`particlePreflight.ts` remains a compatibility barrel only.

## Proposed production ownership if promoted

Keep ownership compact:

```text
mcp/lib/bedrockParticleSemantics.ts
  Bedrock-generic semantics only

shared import-safe helper under mcp/lib/
  target compatibility + bounded preflight logic

mcp/server/tools/particle.ts
  expose through existing inspect/manage options only

mcp/server/resources/particle.ts
  lazily document workflow/runtime compatibility guidance

focused runtime/import-safe tests
  compatibility + motion + bundle + atlas/intent contracts
```

Texture decoding should reuse an existing suitable image/texture owner if production integration needs raw PNG input; do not embed a second image stack in particle tooling.

## Promotion gate

Promotion is allowed only when all of the following are true:

1. Experimental diagnostics still correspond to current reproduced failures.
2. Focused Bun tests pass in `LOCAL_CODE`.
3. The implementation reuses `inspect_particle` / `manage_particle` rather than adding parallel tools.
4. Public-schema changes, if any, are completed together with generated API docs in a capable context.
5. The relevant MCP verifier succeeds for executable/public changes.
6. Live visual claims remain separate `LIVE_BLOCKBENCH` evidence.

Until then, this directory remains research evidence only.
