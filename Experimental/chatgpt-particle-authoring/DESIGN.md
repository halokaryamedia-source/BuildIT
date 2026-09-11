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
- malformed or ambiguous authoring acceptance targets;
- authored spatial samples entering declared keep-out volumes;
- particle scale that is unlikely to read at the intended viewing distance;
- conservative visible-particle estimates exceeding an authored budget.

### Forbidden proxy / non-goal

- No claim of visual quality from static checks.
- No claim of live Snowstorm or Blockbench execution.
- No new public MCP tools.
- No second particle parser, Molang runtime, registry, router, PNG stack, collision engine, renderer, or packaging framework.
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
7. Bounded geometric keep-out checks over caller-supplied spatial samples.
8. Angular-size view-distance readability heuristics.
9. Conservative steady-state visible-particle budgeting.
10. A static golden contract derived from the approved volcano example.

### Out of scope

- PNG decoding or image mutation.
- Visual scoring.
- Collision/world/occlusion rendering simulation.
- Full Molang evaluation.
- Minecraft gameplay binding.
- Client-entity or animation-controller mutation.
- Automatic authoring/planning from the intent contract.
- GPU fill-rate, transparency sorting, device benchmarking, or FPS prediction.

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
└── optional asset / intent / spatial budget diagnostics

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

### Layer 7 — spatial keep-out preflight

`evaluateKeepOutSamples` checks caller-supplied spatial samples against a bounded cylindrical keep-out volume. It reports overlap fraction and warns when the authored threshold is reached.

This deliberately does not simulate blocks, collisions, camera occlusion, or particle visibility. Its purpose is to catch obviously wasteful spawn/trajectory samples such as smoke or debris authored inside a known central block plume.

### Layer 8 — view-distance readability

`evaluateViewDistanceReadability` converts authored particle size and distance to angular size and compares it with an explicit threshold.

The heuristic does not model display resolution, FOV, opacity, contrast, motion blur, or scene salience. It only provides a deterministic static signal that a particle is too small for the intended viewing distance.

### Layer 9 — performance budget

`estimateParticlePerformanceBudget` estimates per-emitter steady-state visible load as:

```text
min(max_particles, spawn_rate * average_lifetime)
```

and sums the result against an authored visible-particle budget.

The estimate is conservative. It does not model staggered timelines, GPU fill-rate, transparency overdraw, device capability, or FPS.

### Layer 10 — approved golden contract

`tests/fixtures/volcanoGolden.ts` records representative acceptance facts from the approved volcano experiment:

- Snowstorm target runtime;
- approximately 100-block viewing distance;
- approximately 30-second total visual event;
- representative heavy-bomb apex/range target;
- central keep-out radius around the block plume;
- representative long-distance plume readability;
- representative effective visible-particle budget.

The golden fixture is static regression evidence only. It does not reclassify the historical asset as live runtime proof.

---

## Diagnostic ownership

Stable experimental diagnostic codes are centralized in `src/diagnostics.ts`. Callers and tests must assert codes/behavior, not prose wording.

The modules are deliberately small:

```text
snowstormCompatibility.ts → target-runtime semantics
motionPreflight.ts        → numeric motion approximation + envelope
bundleValidation.ts       → cross-effect/reference integrity
textureAtlasQa.ts         → decoded-pixel atlas checks
intentContract.ts         → acceptance-contract validation
spatialPreflight.ts       → keep-out sample overlap
readabilityPreflight.ts   → angular-size heuristic
performancePreflight.ts   → conservative visible-load estimate
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
  compatibility + motion + bundle + atlas + intent + bounded spatial/budget contracts
```

Texture decoding should reuse an existing suitable image/texture owner if production integration needs raw PNG input; do not embed a second image stack in particle tooling.

## Promotion gate

Promotion is allowed only when all of the following are true:

1. Experimental diagnostics still correspond to current reproduced failures.
2. Focused Bun tests pass in `LOCAL_CODE`.
3. The approved golden static contract passes under the same source SHA.
4. The implementation reuses `inspect_particle` / `manage_particle` rather than adding parallel tools.
5. Public-schema changes, if any, are completed together with generated API docs in a capable context.
6. The relevant MCP verifier succeeds for executable/public changes.
7. Live visual claims remain separate `LIVE_BLOCKBENCH` evidence.

Until then, this directory remains research evidence only.
