# ChatGPT Particle Authoring Experiment

Experimental research for improving Bedrock particle authoring quality with ChatGPT while preserving BuildIT's existing production ownership.

## Status

- Experimental only.
- Not production authority for BuildIT particle authoring.
- Production ownership remains `mcp/server/tools/particle.ts`, `mcp/server/resources/particle.ts`, and the existing Bedrock particle libraries.
- The approved reference asset remains `examples/MIVUBI_Volcano_Eruption.zip`.
- No experimental code is registered into the MCP server or runtime.

## Goal

Turn the lessons from the approved volcano particle workflow into a bounded, testable preflight model that can later strengthen the existing `inspect_particle` and `manage_particle` tools without creating parallel tools or a second particle framework.

The experiment focuses on gaps that structural JSON validation alone cannot catch:

1. Snowstorm / Wintersky runtime compatibility.
2. Bounded motion estimation for scalar-speed dynamic particles.
3. Stable particle-class ownership across a particle lifetime.
4. Multi-effect bundle reference integrity.
5. Texture-atlas QA requirements and promotion criteria.

## Current implementation

The P0 preflight core is intentionally import-safe and separated by responsibility:

```text
chatgpt-particle-authoring/
├── README.md
├── DESIGN.md
├── WORKFLOW.md
├── src/
│   ├── index.ts
│   ├── particlePreflight.ts
│   ├── diagnostics.ts
│   ├── json.ts
│   ├── types.ts
│   ├── snowstormCompatibility.ts
│   ├── motionPreflight.ts
│   └── bundleValidation.ts
├── tests/
│   ├── helpers.ts
│   ├── snowstormCompatibility.test.ts
│   ├── motionPreflight.test.ts
│   └── bundleValidation.test.ts
└── examples/
    └── MIVUBI_Volcano_Eruption.zip
```

`particlePreflight.ts` is only a compatibility barrel for the initial experimental import path. Logic ownership lives in the focused modules above.

## P0 coverage

Current deterministic checks cover the recurring failures reproduced during the volcano experiment:

- vector `minecraft:particle_initial_speed` losing intended magnitude in Snowstorm / Wintersky;
- `variable.emitter_age` controlling living-particle motion or appearance properties;
- bounded Wintersky-style numeric motion simulation for constant inputs;
- authored apex/range envelope misses;
- duplicate bundle identifiers;
- missing child particle-effect references.

Diagnostic codes are centralized and stable within the experiment so later promotion can preserve semantics without coupling production to this directory.

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

See `DESIGN.md` for the promotion contract and `WORKFLOW.md` for the authoring rules learned from the approved reference asset.
