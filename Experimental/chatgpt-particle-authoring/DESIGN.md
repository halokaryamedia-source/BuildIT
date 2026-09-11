# Experimental Particle Preflight Design

This document is the technical owner for the ChatGPT particle-authoring experiment under `Experimental/`. It does not define production capability.

## Development contract

### Goal

Capture the smallest reusable validation logic learned from the approved ChatGPT-authored volcano particle so BuildIT can later strengthen its existing particle tools without adding a parallel authoring system.

### Success metric

The experiment must deterministically detect the recurring defects that caused repeated Snowstorm failures during the volcano authoring session:

- vector `minecraft:particle_initial_speed` losing intended magnitude in Snowstorm / Wintersky preview;
- `variable.emitter_age` switching living-particle motion or appearance classes mid-life;
- ballistic settings that obviously miss an authored apex/range target;
- master effects referencing missing child particle identifiers.

### Forbidden proxy / non-goal

- No claim of visual quality from static checks.
- No claim of live Snowstorm or Blockbench execution.
- No new public MCP tools.
- No second particle document parser, Molang runtime, registry, router, or packaging framework.
- No generated API-doc edits from this experiment.
- No automatic promotion into `mcp/**`.

### First wrong owner

The current production gap is not the JSON mutation surface. `inspect_particle` / `manage_particle` already own particle documents and preserve unknown fields. The missing owner is bounded preflight semantics around runtime compatibility and intended motion.

### In scope

1. Import-safe Snowstorm compatibility diagnostics.
2. A bounded numeric simulator that mirrors the relevant Wintersky dynamic-motion update equation for constant numeric inputs.
3. Optional motion-envelope checks for apex and horizontal travel.
4. Bundle reference checks for child particle effects.
5. Professional promotion boundaries for texture/atlas QA.

### Out of scope

- PNG decoding or image mutation in the prototype.
- Visual scoring.
- Collision/world simulation.
- Full Molang evaluation.
- Minecraft gameplay binding.
- Client-entity or animation-controller mutation.

### Proof required

Experimental source/static review plus a focused Bun test when `LOCAL_CODE` is available. Promotion to production additionally requires the owning MCP verifier and generated-doc closure required by `mcp/AGENTS.md`.

### STOP condition

Stop experimental expansion once the recurring defect classes above are represented by deterministic diagnostics/tests. Additional framework layers require new evidence.

---

## Architecture

The eventual production design should preserve the existing two-tool public surface.

```text
inspect_particle
├── existing Bedrock structural/semantic inspection
├── runtime compatibility diagnostics
├── optional bounded motion preflight
└── optional bundle/reference summary

manage_particle
├── existing create / patch / validate / write / preview
└── consumes the same shared diagnostics before write/preview
```

No new public tool is required by the current evidence.

## Validation layers

### Layer 1 — Bedrock document validity

Existing owner:

```text
mcp/lib/bedrockParticleDocument*.ts
mcp/lib/bedrockParticleSemantics.ts
```

This remains authoritative for Bedrock component shape, schema coverage, Molang lint, events, curves, and general particle semantics.

### Layer 2 — Snowstorm / Wintersky compatibility

The experimental preflight adds target-specific warnings without redefining Bedrock validity.

#### Rule: vector initial speed

A vector `minecraft:particle_initial_speed` is valid Bedrock JSON, but Snowstorm / Wintersky interprets it as a direction vector and normalizes it while using linear speed `1`.

Diagnostic intent:

```text
code: snowstorm_initial_speed_vector_normalized
severity: warning
```

Recommended authoring pattern when Snowstorm preview fidelity matters:

```text
shape.direction = [x, y, z]
particle_initial_speed = scalar
```

This is compatibility guidance, not a Bedrock syntax error.

#### Rule: unstable emitter-age class switching

`variable.emitter_age` is appropriate for emitter-level timing. It is risky when used in properties evaluated repeatedly for a living particle if it changes the particle's motion or visual class.

Detect emitter-age use inside at least:

```text
minecraft:particle_motion_dynamic
minecraft:particle_appearance_billboard
minecraft:particle_appearance_tinting
```

Diagnostic intent:

```text
code: unstable_emitter_age_particle_property
severity: warning
```

Stable particle class should prefer:

```text
variable.particle_random_1..4
variable.particle_age
variable.particle_lifetime
```

### Layer 3 — bounded motion preflight

The prototype simulator intentionally supports only constant numeric inputs:

```text
direction: vec3
initial scalar speed
constant acceleration: vec3
constant linear drag
lifetime
tick rate
```

Update equation mirrors the relevant Wintersky dynamic-motion behavior:

```text
acceleration_effective = acceleration - velocity * drag
velocity += acceleration_effective * dt
position += velocity * dt
```

Output:

```text
final_position
apex_y
maximum_horizontal_distance
```

It is a diagnostic approximation, not a replacement runtime and not a Molang evaluator.

### Layer 4 — intent envelope

When an authoring task provides explicit targets, the preflight may compare the numeric simulation with a bounded envelope.

Example:

```text
apex_y: 15..23 blocks
horizontal_distance: 28..40 blocks
```

A miss should be reported as a diagnostic, not silently rewritten.

### Layer 5 — bundle reference integrity

Complex effects may be split by materially different physics while remaining one user-facing effect.

The experimental validator checks child-effect identifiers referenced by particle events against the provided bundle.

It does not own animation/controller binding.

---

## Texture / atlas QA contract

Texture QA is required by the workflow but intentionally remains a documented promotion requirement in this prototype because adding PNG parsing or image dependencies would broaden the experiment without current repository evidence.

A production implementation should validate texture assets through an existing suitable image owner or a separately approved minimal helper, not by embedding an ad-hoc image stack in the particle tool.

Minimum atlas checks learned from the approved volcano asset:

```text
true RGBA transparency
no baked checkerboard
no neutral-white matte contamination
UV bounds match authored texture dimensions
safe gutter between visible sprite pixels and atlas cell boundary
class-specific atlas row/cell mapping
no obvious accidental duplicate cells when uniqueness is required
```

Static atlas QA never proves visual quality.

---

## Proposed production ownership if promoted

Keep ownership compact:

```text
mcp/lib/bedrockParticleSemantics.ts
  Bedrock-generic semantics only

new shared import-safe helper under mcp/lib/
  target-specific compatibility + bounded motion preflight

mcp/server/tools/particle.ts
  exposes existing inspect/manage options only

mcp/server/resources/particle.ts
  lazily documents workflow/runtime compatibility guidance

mcp/tests/particle-tool-contract.test.ts
  public two-tool contract

focused runtime/import-safe regression test
  compatibility + simulator behavior
```

Do not put Snowstorm-specific compatibility rules into Bedrock-generic validity in a way that turns valid Bedrock documents into syntax errors.

## Promotion gate

Promotion is allowed only when all of the following are true:

1. The experimental diagnostic rules still correspond to reproduced current failures.
2. The implementation reuses `inspect_particle` / `manage_particle` rather than adding parallel tools.
3. Public-schema changes, if any, are completed in a context that can regenerate and verify committed API docs.
4. Focused runtime tests cover vector-speed compatibility, emitter-age instability, motion simulation, and bundle references.
5. `bun run verify:mcp` succeeds for executable/public MCP changes.
6. Live visual claims remain `LIVE_BLOCKBENCH` proof, not static-test claims.

Until then, this directory remains research evidence only.
