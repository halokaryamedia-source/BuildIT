# BlockIT — Modelling Workflow Policy

**Status:** Active Policy  
**Version:** 1.0  
**Updated:** 2026-08-14

## Purpose

Own durable modelling-stage and evidence-economy rules. The single detailed current sequence lives in [Current Flow](../knowledge/flow.md); agent/tool routing lives in the active skills. This policy does not create a second operational checklist.

## Core Contract

```text
known current state + optional grounded reference when reference-driven
→ fast-path when non-reference: intent → simple envelope → manage_cubes (skip full Semantic/View maps)
→ when reference-driven: Semantic Form → construction / transform ownership / contact invariants → Primary Form Hypothesis
→ minimum coherent primary Cubes + required primary Groups/pivots
→ only evidence that can change the next decision
→ FAIL | UNVERIFIED→PROVISIONAL (continue with hypothesis) | PASS (final needs paired images)
→ causal local correction or global rebuild
→ identity-weighted downstream work only after prerequisites pass
```

## Minimum Necessary Evidence

- Reuse fresh exact identity/authored state returned by prior calls when sufficient — `manage_cubes` return values are sufficient for immediate correction without `inspect_elements(mode=detail)`.
- Use focused discovery only for unknown, stale, or ambiguous state.
- `inspect_elements(mode=detail)` is a fallback for missing/stale exact target state, not a mandatory pre-correction ritual.
- `inspect_model_bounds` is only for material envelope/scale/ground/displacement questions; otherwise skip it.
- Do not inspect every newly placed Cube or capture after every mutation.
- `UNVERIFIED` is an evidence state, not a command to create more calls — for non-reference tasks it becomes `PROVISIONAL` and work continues with a marked hypothesis.
- After a local correction, capture affected view(s) first; expand only when a material cross-view claim could regress.

## Primary / Downstream Boundary

Form/contact/articulation-defining hierarchy and pivots may belong in the primary blockout. Neutral organization and secondary geometry wait until primary form passes. Production texture/animation must not compensate for unresolved dependent geometry/hierarchy/pivot problems.

Existing-asset work may accept the current asset as the task baseline when upstream correction is outside scope, without certifying that baseline as reference-accurate.

## Correction / Convergence

Use one diagnosed causal class: `TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | ADD MASS`. Preserve declared invariants, verify returned structural effect, then classify the visual result `IMPROVED | UNCHANGED | REGRESSED`. A material cross-view regression rejects the correction. Stop the same failed causal direction after two attempts without new evidence.

## Persistence

Persistent asset state is saved at meaningful handoff/resume/park/completion boundaries. Mutation count alone is not a checkpoint trigger; do not turn transient tool activity into repository memory.

## Proof Boundary

Tool/source/CI success is structural/static evidence only. Live Blockbench behavior, persistence, and visual/model-quality claims remain `LOCAL PROOF REQUIRED` until directly tested when local acceptance is explicitly active.

## Related

- [Product Requirements](02-product-requirements.md)
- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Current Flow](../knowledge/flow.md)
