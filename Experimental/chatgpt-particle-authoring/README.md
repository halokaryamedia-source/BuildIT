# ChatGPT Particle Authoring Experiment

Experimental research for improving Bedrock particle authoring quality with ChatGPT while preserving BuildIT's existing production ownership.

## Status

- Experimental only.
- Not production authority for BuildIT particle authoring.
- Production ownership remains `mcp/server/tools/particle.ts`, `mcp/server/resources/particle.ts`, and the existing Bedrock particle libraries.
- The approved reference asset remains `examples/MIVUBI_Volcano_Eruption.zip`.
- No experimental code is registered into the MCP server or runtime.
- Promotion readiness has been audited; see `PROMOTION_READINESS.md`.

## Goal

Turn the lessons from the approved volcano particle workflow into a bounded, testable preflight model that can later strengthen the existing `inspect_particle` and `manage_particle` tools without creating parallel tools or a second particle framework.

The experiment focuses on gaps that structural JSON validation alone cannot catch:

1. Snowstorm / Wintersky runtime compatibility.
2. Bounded motion estimation for scalar-speed dynamic particles.
3. Stable particle-class ownership across a particle lifetime.
4. Multi-effect bundle integrity.
5. Texture-atlas QA.
6. Explicit authoring intent as an acceptance contract.
7. Spatial keep-out / occlusion risk.
8. View-distance readability heuristics.
9. Conservative visible-particle performance budgeting.

## Current implementation

```text
chatgpt-particle-authoring/
├── README.md
├── DESIGN.md
├── WORKFLOW.md
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
- an approved volcano golden static contract covering representative intent, motion, keep-out, readability, and effective particle budget.

Diagnostic codes are centralized and stable within the experiment so later promotion can preserve semantics without coupling production to this directory.

## Promotion readiness

The architecture and failure-mode coverage are mature enough to define a bounded migration plan, but production promotion is intentionally blocked until focused Bun tests run in `LOCAL_CODE`.

The production audit concluded that promotion should:

- preserve exactly `inspect_particle` and `manage_particle`;
- move only import-safe deterministic preflight logic into `mcp/lib/`;
- keep Bedrock-generic validity separate from Snowstorm-specific compatibility warnings;
- integrate read-only inspection before mutation behavior;
- reuse an existing image/texture owner if raw texture decoding is ever required;
- regenerate generated API docs in the same logical production delivery;
- keep live visual/native proof separate from static source verification.

See `PROMOTION_READINESS.md` for the exact impact map, gates, stop conditions, and recommended production order.

## Important limits

Texture QA accepts already-decoded RGBA pixels. This experiment intentionally does not add a PNG decoder or image dependency. Static texture checks do not prove visual quality.

Spatial preflight is not collision or visibility simulation. Readability is an angular-size heuristic, not a display/FOV/contrast model. Performance estimation is conservative and does not model staggered timelines or GPU fill-rate.

The intent contract is an acceptance target, not a planner. It never silently rewrites particle values.

## Production boundary

Do not wire this directory into active MCP routing, tool registration, generated API docs, Skills, or production prompts.

Promotion must extend the existing two-tool surface:

```text
inspect_particle
manage_particle
```

Do not introduce sibling tools such as `simulate_particle`, `snowstorm_particle`, or `texture_particle` unless future evidence proves the existing surface cannot own the capability.

Any production promotion must follow `AGENTS.md`, `GITHUB_RULES.md`, and `mcp/AGENTS.md`, including generated-doc closure and the relevant verifier.

## Current proof ceiling

The committed prototype provides source/static evidence only. Focused Bun execution remains `LOCAL_CODE` proof, while Snowstorm parity, native Blockbench preview, and visual acceptance remain higher-context proof.

See `DESIGN.md` for the technical contract, `WORKFLOW.md` for the authoring rules learned from the approved reference asset, and `PROMOTION_READINESS.md` for the production migration audit.
