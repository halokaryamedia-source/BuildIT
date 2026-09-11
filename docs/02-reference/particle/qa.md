# Particle QA Sequence

Run checks in this order so later conclusions do not hide an earlier structural or semantic defect.

## Gate 1 — Bedrock document structure

Check:
- every `.particle.json` parses;
- identifiers are valid and unique where required;
- referenced textures/effects exist when evidence is available;
- component/vector/scalar shapes are valid;
- unknown authored fields are preserved rather than rewritten away.

## Gate 2 — Snowstorm / Wintersky compatibility

Check:
- no vector `minecraft:particle_initial_speed` when authored magnitude must survive Snowstorm preview;
- launch direction lives on emitter shape when using scalar speed;
- no emitter-age class switching inside living-particle motion, billboard size/UV, or tint when stability is required.

## Gate 3 — Motion sanity

For constant numeric inputs, estimate:
- initial velocity;
- apex;
- time to apex when relevant;
- horizontal travel;
- final displacement.

Compare against explicit authored targets when present. A miss is diagnostic evidence, not permission to silently rewrite intent.

## Gate 4 — Bundle integrity

Check:
- duplicate identifiers;
- document identifier mismatch;
- missing child-effect references;
- circular child chains;
- orphan entries relative to an explicit root;
- texture reference resolution when the available set is known.

## Gate 5 — Texture / atlas QA

Check when pixel data or direct visual inspection is available:
- real transparency;
- no baked checkerboard;
- no unintended white matte/halo;
- grid dimensions and UV bounds;
- safe visible-pixel gutter;
- duplicate cells when uniqueness is expected;
- class-to-cell mapping is intentional.

## Gate 6 — Spatial / keep-out sanity

When environment geometry is known, check representative spawn/travel samples against explicit keep-out regions. This is not collision or renderer simulation.

## Gate 7 — View-distance readability

Use particle size versus viewing distance as a deterministic heuristic. Treat this only as a warning signal; FOV, display resolution, contrast, opacity, motion and scene salience remain visual-review concerns.

## Gate 8 — Performance budget

Estimate conservative visible load with available spawn-rate/lifetime/max-particle information. Do not claim FPS or device performance from this estimate.

## Gate 9 — Package integrity

Before delivery verify:
- normal Resource Pack structure;
- all JSON texture paths resolve;
- no temp/scratch/obsolete QA files;
- no duplicate unused textures;
- no versioned working filenames unless the user explicitly requires them;
- README usage notes match the actual package.

## Final acceptance

```text
STATIC QA PASS / WARNINGS UNDERSTOOD
→ USER VISUAL REVIEW IN SNOWSTORM / MINECRAFT
→ APPROVE OR TARGETED REVISION
```

Static QA never replaces visual approval.
