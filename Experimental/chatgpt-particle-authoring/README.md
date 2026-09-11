# ChatGPT Particle Authoring Experiment

Experimental research and working method for authoring Minecraft Bedrock particle effects directly through ChatGPT while preserving BuildIT's existing production ownership.

## Status

- Experimental ChatGPT workflow: **active**.
- Not production authority for BuildIT MCP particle tooling.
- No `LOCAL_CODE` step is required to author, validate, package, and deliver particles through this ChatGPT workflow.
- Production MCP ownership remains `mcp/server/tools/particle.ts`, `mcp/server/resources/particle.ts`, and the existing Bedrock particle libraries.
- The approved reference asset remains `examples/MIVUBI_Volcano_Eruption.zip`.
- No experimental code is registered into the MCP server or runtime.
- Promotion into production MCP is a separate deferred decision; see `PROMOTION_READINESS.md`.

## Goal

Provide a repeatable professional workflow that lets ChatGPT design, author, statically preflight, package, and refine Bedrock/Snowstorm particles without creating a parallel MCP system.

The experiment covers gaps that structural JSON validation alone cannot catch:

1. Snowstorm / Wintersky runtime compatibility.
2. Bounded motion estimation for scalar-speed dynamic particles.
3. Stable particle-class ownership across a particle lifetime.
4. Multi-effect bundle integrity.
5. Texture-atlas QA.
6. Explicit authoring intent as an acceptance contract.
7. Spatial keep-out / occlusion risk.
8. View-distance readability heuristics.
9. Conservative visible-particle performance budgeting.
10. Clean Snowstorm + Minecraft Bedrock delivery packaging.

## Workflow documents

```text
AUTHORING_SPEC.md      minimum request / intent contract
WORKFLOW.md            practical authoring lessons
QA_SEQUENCE.md         required static QA order
DELIVERY_CONTRACT.md   final package and naming rules
REFERENCE_PATTERNS.md  reusable physical authoring patterns
DESIGN.md              experimental technical architecture
PROMOTION_READINESS.md optional future MCP promotion audit
```

## Current implementation

```text
chatgpt-particle-authoring/
├── README.md
├── AUTHORING_SPEC.md
├── WORKFLOW.md
├── QA_SEQUENCE.md
├── DELIVERY_CONTRACT.md
├── REFERENCE_PATTERNS.md
├── DESIGN.md
├── PROMOTION_READINESS.md
├── src/
│   ├── index.ts
│   ├── particlePreflight.ts
│   ├── diagnostics.ts
│   ├── json.ts
│   ├── types.ts
│   ├── snowstormCompatibility.ts
│   ├── motionPreflight.ts
│   ├── bundleValidation.ts
│   ├── textureAtlasQa.ts
│   ├── intentContract.ts
│   ├── spatialPreflight.ts
│   ├── readabilityPreflight.ts
│   └── performancePreflight.ts
├── tests/
│   ├── helpers.ts
│   ├── fixtures/
│   │   └── volcanoGolden.ts
│   ├── snowstormCompatibility.test.ts
│   ├── motionPreflight.test.ts
│   ├── bundleValidation.test.ts
│   ├── textureAtlasQa.test.ts
│   ├── intentContract.test.ts
│   ├── spatialPreflight.test.ts
│   ├── readabilityPreflight.test.ts
│   ├── performancePreflight.test.ts
│   └── volcanoGolden.test.ts
└── examples/
    └── MIVUBI_Volcano_Eruption.zip
```

`particlePreflight.ts` remains only a compatibility barrel for the initial experimental import path. Logic ownership lives in the focused modules above.

## Implemented coverage

### P0 — runtime and motion preflight

- vector `minecraft:particle_initial_speed` compatibility risk in Snowstorm / Wintersky;
- `variable.emitter_age` controlling living-particle motion or appearance properties;
- bounded Wintersky-style numeric motion simulation for constant inputs;
- authored apex/range envelope misses;
- exact offending paths for unstable particle-owned expressions.

### P1 — asset, bundle and intent preflight

- duplicate particle bundle identifiers;
- document/bundle identifier mismatches;
- missing child particle-effect references;
- circular child-effect chains;
- root-relative orphan particle effects;
- missing referenced texture paths when an available texture set is supplied;
- dependency-free RGBA atlas QA for transparency, white-matte risk, grid validity, gutter, and duplicate cells;
- explicit intent-contract validation for runtime target, view distance, duration, and named motion envelopes.

### P2 — spatial, readability and performance preflight

- bounded cylindrical keep-out overlap checks over authored spatial samples;
- angular-size readability heuristic for intended viewing distance;
- conservative steady-state visible-particle estimation using spawn rate, average lifetime, and `max_particles` caps;
- approved volcano golden static contract covering representative intent, motion, keep-out, readability, and effective particle budget.

## ChatGPT execution path

The intended active path is:

```text
user request / reference
→ normalize with AUTHORING_SPEC.md
→ choose minimum physical decomposition
→ author Bedrock particle JSON + textures
→ run QA_SEQUENCE.md static checks
→ package using DELIVERY_CONTRACT.md
→ user reviews in Snowstorm / Minecraft
→ refine only the causal layer that failed
```

This path does not depend on BuildIT MCP execution or local repository tooling.

## Reference patterns

`REFERENCE_PATTERNS.md` currently records bounded starting patterns for:

- ballistic eruption/debris;
- rising smoke/plume;
- ambient dust;
- waterfall mist/spray;
- fire/sparks;
- magic/energy;
- machinery exhaust;
- impact bursts.

Patterns are not presets. They become proven only after a real effect is accepted by the user.

## Important limits

Texture QA accepts already-decoded RGBA pixels. This experiment intentionally does not add a PNG decoder or image dependency. Static texture checks do not prove visual quality.

Spatial preflight is not collision or visibility simulation. Readability is an angular-size heuristic, not a display/FOV/contrast model. Performance estimation is conservative and does not model staggered timelines or GPU fill-rate.

The intent contract is an acceptance target, not a planner. It never silently rewrites particle values.

## Production boundary

Do not wire this directory into active MCP routing, tool registration, generated API docs, Skills, or production prompts unless production promotion is explicitly authorized as a separate task.

If promotion is ever requested, it must extend the existing two-tool surface:

```text
inspect_particle
manage_particle
```

Do not introduce sibling tools such as `simulate_particle`, `snowstorm_particle`, or `texture_particle` unless future evidence proves the existing surface cannot own the capability.

## Proof model

For the **ChatGPT workflow**, static QA plus user visual review is the intended acceptance model.

```text
ChatGPT static/preflight checks
→ package delivery
→ user Snowstorm/Minecraft visual review
→ acceptance or targeted revision
```

`LOCAL_CODE` and MCP verification are relevant only if the experimental logic is later promoted into production BuildIT tooling. They are not blockers for using this ChatGPT authoring workflow now.
