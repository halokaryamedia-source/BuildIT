# ChatGPT Particle QA Sequence

This document defines the required static QA order before a ChatGPT-authored particle package is delivered.

## Required sequence

```text
1. Bedrock structure
2. target-runtime compatibility
3. motion preflight
4. particle ownership stability
5. bundle integrity
6. texture / atlas QA
7. spatial keep-out preflight
8. view-distance readability
9. performance budget
10. package integrity
11. user visual review
```

A later step must not be treated as a substitute for an earlier failed gate.

## 1. Bedrock structure

Check:

- every `.particle.json` parses;
- identifiers use the intended namespace/path;
- required component shapes are valid;
- texture/material references are syntactically coherent;
- events/curves/Molang remain structurally valid.

Bedrock validity is independent from Snowstorm compatibility.

## 2. Target-runtime compatibility

For Snowstorm/Wintersky-targeted work, check at minimum:

- no vector `minecraft:particle_initial_speed` when authored speed magnitude matters;
- launch direction belongs in emitter-shape direction and speed magnitude remains scalar;
- target-specific warnings do not become Bedrock syntax errors.

## 3. Motion preflight

For constant numeric motion classes, evaluate:

- normalized launch direction;
- initial velocity;
- acceleration / gravity;
- drag;
- lifetime;
- apex;
- time to apex;
- horizontal travel;
- final displacement.

Compare against explicit authored envelopes when supplied.

Dynamic/Molang-heavy motion that cannot be represented by the bounded simulator must remain marked unsupported for numeric preflight rather than guessed.

## 4. Particle ownership stability

Reject or warn on living-particle class changes driven by emitter timing where they can cause popping/flicker.

Particle-owned behavior should prefer:

```text
variable.particle_random_1..4
variable.particle_age
variable.particle_lifetime
```

Emitter-owned timing may use:

```text
variable.emitter_age
variable.emitter_lifetime
```

## 5. Bundle integrity

For multi-effect packages, check:

- unique particle identifiers;
- bundle identifier matches document identifier;
- child effect references resolve;
- no circular child-effect chain;
- no unintended orphan effect relative to declared root;
- referenced textures exist when texture inventory is known.

## 6. Texture / atlas QA

Check decoded RGBA data when available:

- expected dimensions;
- valid atlas grid;
- actual transparency;
- no accidental neutral-white matte/halo;
- safe cell gutter;
- no unwanted duplicate cells;
- class-to-cell mapping matches intended particle classes.

Static texture QA does not prove artistic quality.

## 7. Spatial keep-out preflight

When surrounding geometry is declared, sample the intended spawn/trajectory region against the declared keep-out volume.

This detects obvious wasted or hidden placement. It is not collision or camera-visibility simulation.

## 8. View-distance readability

Compare authored sprite size with intended distance using the bounded angular-size heuristic.

Warnings are advisory because actual readability also depends on opacity, contrast, FOV, motion, display resolution, and scene composition.

## 9. Performance budget

Estimate conservative visible load from:

```text
spawn_rate
average_lifetime
max_particles
```

Compare the sum to an explicit authored budget when supplied.

This is not an FPS predictor.

## 10. Package integrity

Before delivery verify:

- no revision suffixes in production filenames;
- no scratch QA files;
- no obsolete textures;
- no duplicate production assets;
- manifest/resource-pack structure is valid when Minecraft-ready delivery is requested;
- package remains a normal folder/ZIP unless `.mcpack` is explicitly requested.

## 11. User visual review

The final acceptance owner for this ChatGPT workflow is the user reviewing the effect in Snowstorm and/or Minecraft.

Static PASS means the package is structurally and heuristically ready for review. It does not mean visual approval has been proven.
