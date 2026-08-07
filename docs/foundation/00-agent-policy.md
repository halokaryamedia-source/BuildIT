# BlockIT — Product Agent Policy

**Status:** Active  
**Version:** 1.1

## 1. Purpose

Define only the **BlockIT-specific** constraints that an agent must preserve.

Generic working behavior, session continuity, skill budget, independent
judgment, file-creation rules, and proof economy live in root `AGENTS.md` and
must not be duplicated here.

## 2. Product Boundary

BlockIT exists to help an agent create clean, editable Minecraft Bedrock models
in Blockbench through MCP from an approved Model Reference.

The product is object-agnostic. A test fixture, Golden Sample, animal, prop, or
single successful experiment is evidence, not a universal runtime rule.

## 3. Mandatory Product Rules

The agent must:

- treat the approved Model Reference as a visual modelling brief, not pixel
  calibration;
- use declared target dimensions as the numeric geometry envelope/target only
  where current policy/source actually defines them;
- reason about the **whole form** before polishing local geometry;
- keep MCP responsible for technical operations, not automatic anatomy or
  semantic cube-decomposition authority;
- preserve a clean/editable Bedrock project rather than optimizing only for a
  screenshot;
- distinguish structural/tool success from visual quality;
- require fresh visual evidence before claiming visual correctness;
- require live evidence before claiming Blockbench/MCP runtime behavior;
- mark unproven capabilities/behavior `Needs Validation` rather than converting
  them into permanent policy.

## 4. Hard No-Guess Rule

For modelling, reference, MCP, and reporting work:

- an inference or plausible interpretation is not a fact/requirement/result;
- do not invent cube transforms, pivots, dimensions, anatomy, or attachments
  that the available reference/evidence cannot support;
- valid schemas, successful tool calls, saved files, bounds, hierarchy, overlap,
  projections, or metrics do not prove resemblance;
- do not hide missing evidence with confidence scores, fallback values,
  compensating Cubes, or extra compatibility layers;
- if the needed evidence is unavailable, report the exact unverified boundary.

## 5. Whole-Form Rule

The modelling workflow is whole-form-first:

```text
approved reference
→ whole-form interpretation
→ primary geometry pass
→ global visual gate
→ secondary geometry / hierarchy / pivots
→ full geometry review
→ UV / texture
→ optional animation
→ final validation
```

Do not reintroduce universal support-first/section-first/per-cube approval rules.
Object-specific construction order comes from the active reference and actual
attachment/shape needs.

See `03-modelling-workflow.md` for the canonical sequence.

## 6. Visual Rule

A model is not visually accepted because it is structurally valid.

Visual approval requires fresh evidence from the current revision and concrete
criteria such as global silhouette, major proportions/masses, orientation,
required parts, and visible connections.

Do not require screenshots after every Cube or mutation. Capture only when a
view answers a concrete visual question or validates a defined gate.

See `07-visual-validation.md` for the canonical visual policy.

## 7. MCP Capability Rule

Before product behavior depends on an MCP/Blockbench capability, establish the
capability from current source and, where the claim is runtime-specific, live
proof.

Relevant questions include:

- does the tool/capability currently exist?
- what input/output contract does it actually expose?
- what failure/recovery behavior is implemented?
- does the change persist/save as expected?
- is undo/recovery available when the operation can mutate the project?

Historical experiment notes are not runtime guarantees.

## 8. Execution-Channel Boundary

- **ChatGPT → GitHub** may design, inspect, edit, and prepare repository changes
  but must not claim local Blockbench/MCP runtime proof.
- **Codex local** is the intended final proof environment for changes that
  require Blockbench, MCP, shell/build, or live visual behavior.

Do not add fake GitHub validation to compensate for local-only proof.

## 9. Anti-Slop Product Failures

Reject these product-level patterns:

- locally plausible Cubes forming a globally wrong model;
- adding detail before primary form is coherent;
- compensating geometry that hides a proportion/relationship error;
- fixture-specific anatomy/build order becoming generic policy;
- mesh/similarity/numeric diagnostics becoming modelling authority;
- repeated patch/version churn without a new hypothesis or visible improvement;
- technically successful output that is unusable for the downstream modeller.

## 10. Source Boundary

Claims about Blockbench, Minecraft Bedrock, or MCP must come from current
verified documentation/source/implementation or reproducible proof.

Use the dedicated foundation notes for domain policy:

- `01-project-overview.md` — product purpose;
- `02-product-requirements.md` — product scope/requirements;
- `03-modelling-workflow.md` — modelling sequence;
- `04-reference-guide.md` — Model Reference policy;
- `05-geometry-standard.md` — geometry standards;
- `06-texture-standard.md` — texture standards;
- `07-visual-validation.md` — visual evidence/acceptance;
- `08-source-selection.md` — source selection;
- `09-merge-map.md` — source/repository merge boundaries;
- `validation-report.md` — verified/unverified findings.

Open only the note relevant to the active task. Do not load the entire
foundation by default.
