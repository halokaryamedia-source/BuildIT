# BlockIT — Product Agent Policy

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-12

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

- require the **actual approved reference image** to be inspectable by the model for reference-driven geometry/visual approval; filename/path/manifest/prose/memory is not visual evidence;
- treat the approved Modelling Brief as visual guidance, not pixel calibration;
- use approved numeric dimensions as the target envelope when available;
- ground material image claims through a compact Reference Evidence Map + explicit reference↔model View Pair Map before exact transforms;
- reason about whole form before local detail;
- establish coordinate frame + Semantic Form Contract + Primary Form Hypothesis before important primary exact transforms;
- author new Cubes with intentional explicit extents;
- use rotation only for visible form/slope or required motion;
- use meaningful pivots only for real transform/joint/attachment needs;
- keep MCP responsible for execution/observation, not automatic anatomy or visual approval;
- distinguish structural/tool success from visual correctness;
- use fresh visual evidence before claiming resemblance;
- require actual approved reference + fresh current model image evidence for material visual `PASS`;
- require live proof before claiming Blockbench/MCP runtime behavior.

## Hard No-Guess Rule

Do not invent or silently default material modelling decisions merely so an
operation succeeds.

In particular:

- no path/manifest/text summary/prior observation/memory may substitute for inspecting the actual approved reference image;
- no semantic label may authorize exact Cube coordinates without grounded image claims;
- no default Cube extent may stand in for an unmade geometry decision;
- no material visible slope may silently become `[0,0,0]` rotation;
- no non-zero new Cube rotation may silently inherit an unchosen pivot;
- no missing requested Group may silently fall back to root;
- no ambiguous name may silently target multiple elements;
- no arbitrary pivot/rotation may be accepted because the schema permits it;
- no technical overlap/hierarchy may substitute for visible contact evidence;
- no compensating Cubes may hide an unresolved global-form error;
- no fluent review may substitute for an actual paired reference↔model comparison.

Missing evidence remains uncertainty. Use `UNVERIFIED`/`BLOCKED` rather than filling material image gaps with assumptions. Root evidence labels (`UNKNOWN`, `LOCAL PROOF REQUIRED`, etc.) still apply to engineering/runtime claims.

## Reference Fidelity Rule

Canonical sequence:

```text
actual approved Modelling Brief image available
→ cross-view consistency + View Pair Map
→ Reference Evidence Map (grounded claim_id(s))
→ Semantic Form Contract
→ coordinate frame + target envelope
→ Primary Form Hypothesis
→ explicit coarse primary Cubes
→ structural bounds observation when relevant
→ canonical model views
→ actual reference + fresh model claim-locked visual gate
→ GLOBAL semantic/spatial rebuild or LOCAL inspect/correct
→ secondary geometry / hierarchy / pivots
→ texture / optional animation / final proof
```

Detailed procedure: [03-modelling-workflow.md](03-modelling-workflow.md).

## Global vs Local Failure

### Global

If the intended object is unrecognizable or several primary relationships fail
together, invalidate/revise the responsible primary scaffold. If decomposition is wrong, return to Semantic Form; otherwise revise Primary Form Hypothesis. Do not preserve it because many Cubes already exist.

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
- similarity scores;
- reference filename/path/manifest/summary/memory.

Material PASS requires the actual approved reference image and fresh corresponding current-model image(s) with explicit claim/view pairing. See [07-visual-validation.md](07-visual-validation.md).

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

Do not create fake GitHub substitutes for local-only proof. If reference-driven modelling is active but the approved image is not actually available to the modelling model, stop rather than use memory.

## Anti-Slop Product Failures

Reject:

- locally plausible Cubes forming a globally wrong object;
- Cube existence/attachment reported as progress/approval;
- exact transforms invented before grounded semantic/spatial reasoning;
- hidden form invented from generic object knowledge;
- arbitrary multi-axis rotations or default zero rotation despite visible slope;
- arbitrary/distant pivots;
- mismatched/ambiguous reference↔model view comparison;
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
