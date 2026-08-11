# BlockIT — Product Agent Policy

**Status:** Active Policy  
**Version:** 1.2  
**Updated:** 2026-08-11

## Purpose

Define BlockIT-specific constraints only. Generic working behavior, session
continuity, skill budget, independent judgment, proof economy, and evidence
labels live in root `AGENTS.md`.

## Product Boundary

BlockIT helps an agent create/revise clean editable Minecraft Bedrock Entity
models in Blockbench through MCP from an approved visual Modelling Brief.

The product is object-agnostic. Fixtures/Golden Samples/old experiments provide
evidence, not universal modelling rules.

## Mandatory Product Rules

The agent must:

- treat the approved Modelling Brief as visual guidance, not pixel calibration;
- use approved numeric dimensions as the target envelope when available;
- reason about whole form before local detail;
- establish coordinate frame + Primary Form Hypothesis before important primary
  exact transforms;
- author new Cubes with intentional explicit extents;
- use rotation only for visible form/slope or required motion;
- use meaningful pivots only for real transform/joint/attachment needs;
- keep MCP responsible for execution/observation, not automatic anatomy or visual
  approval;
- distinguish structural/tool success from visual correctness;
- use fresh visual evidence before claiming resemblance;
- require live proof before claiming Blockbench/MCP runtime behavior.

## Hard No-Guess Rule

Do not invent or silently default material modelling decisions merely so an
operation succeeds.

In particular:

- no default Cube extent may stand in for an unmade geometry decision;
- no non-zero new Cube rotation may silently inherit an unchosen pivot;
- no missing requested Group may silently fall back to root;
- no ambiguous name may silently target multiple elements;
- no arbitrary pivot/rotation may be accepted because the schema permits it;
- no compensating Cubes may hide an unresolved global-form error.

Missing evidence remains uncertainty. Use the root evidence labels (`UNKNOWN`,
`LOCAL PROOF REQUIRED`, etc.) instead of filling gaps with confidence/fallbacks.

## Reference Fidelity Rule

Canonical sequence:

```text
approved Modelling Brief
→ cross-view consistency
→ coordinate frame + target envelope
→ Primary Form Hypothesis
→ explicit coarse primary Cubes
→ structural bounds observation
→ canonical model views
→ reference ↔ model visual gate
→ GLOBAL rebuild or LOCAL inspect/correct
→ secondary geometry / hierarchy / pivots
→ texture / optional animation / final proof
```

Detailed procedure: [03-modelling-workflow.md](03-modelling-workflow.md).

## Global vs Local Failure

### Global

If the intended object is unrecognizable or several primary relationships fail
together, invalidate/revise the primary scaffold. Do not preserve it because many
Cubes already exist.

### Local

If whole form is sound and one bounded relationship is wrong, inspect the exact
authored target and apply a causal correction.

After two unsuccessful corrections in the same direction without new evidence,
stop patching and revise the hypothesis.

## Visual Rule

Visual `PASS` cannot be based on:

- all Cubes existing;
- attachment/overlap;
- valid coordinates/hierarchy/bounds;
- tool success;
- save success;
- similarity scores.

See [07-visual-validation.md](07-visual-validation.md).

## Runtime Capability Rule

Before depending on a Blockbench/MCP capability, inspect current Local source.
When the claim is live/runtime/visual, require the corresponding local proof.

Current source implementation does not automatically upgrade to
`CURRENT-PROJECT VERIFIED`.

## Execution Channel

### ChatGPT → GitHub

May inspect/edit source/docs and prove static contracts. Must not claim live
Blockbench/MCP/visual success.

### Codex Local

Use Blockbench + MCP for live runtime/visual proof when the task reaches that
boundary.

Do not create fake GitHub substitutes for local-only proof.

## Anti-Slop Product Failures

Reject:

- locally plausible Cubes forming a globally wrong object;
- Cube existence/attachment reported as progress/approval;
- exact transforms invented before a coherent spatial hypothesis;
- arbitrary multi-axis rotations;
- arbitrary/distant pivots;
- detail before coherent primary form;
- repeated patch churn without a new diagnosis;
- fixture-specific rules promoted to generic policy;
- SF3D/mesh/IoU/similarity authority;
- technically successful output unusable by a downstream modeller.

## Source Boundary

Use the matching current owner:

- [Project Overview](01-project-overview.md)
- [Product Requirements](02-product-requirements.md)
- [Modelling Workflow](03-modelling-workflow.md)
- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Texture Standard](06-texture-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Validation Report](validation-report.md)

Historical upstream source-selection/merge provenance is retained in Git history
and indexed review evidence. It is not current Foundation policy and must not
control current runtime decisions.
