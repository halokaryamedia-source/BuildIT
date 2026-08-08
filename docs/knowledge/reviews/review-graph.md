# Review Index

Updated: 2026-08-08

Use this note to understand **how historical reviews relate to current Local**.
Review bodies are evidence captured at a point in time; do not rewrite their
original findings just because later implementation changed.

## Current Review Status

| Review | Current meaning |
|---|---|
| [MCP Reference Fidelity Root Cause](mcp-reference-fidelity-root-cause.md) | **Active evidence.** Root cause confirmed: missing reference→spatial-hypothesis→visual-feedback loop; confirmed placement/rotation/pivot failure patterns. |
| [Reference Fidelity Observation Contract](mcp-reference-fidelity-observation-contract.md) | **Design implemented in source.** `inspect_model_bounds` and `capture_model_views` now exist in Local; live Blockbench/image transport remains `LOCAL PROOF REQUIRED`. The review header reflects the earlier design-freeze moment. |
| [MCP Geometry AI-Slop Audit](mcp-geometry-ai-slop-audit.md) | **Historical evidence, still relevant.** Demonstrated that technical Cube/contact PASS can coexist with visibly bad global form; findings are absorbed into current fidelity policy. |
| [MCP Surface Curation](mcp-surface-curation.md) | **Historical architecture review, partially implemented/superseded.** Goal-oriented Bedrock prompt, observation tools, exact inspection, coherent batch correction, and targeting safety now exist. Final broad public-surface reduction remains later work. |
| [Anti-Slop Skill Candidates](anti-slop-skill-candidates.md) | **Historical research.** Final skill architecture is now frozen to six root skills; do not treat candidate stacks as current routing. |
| [Orca CLI MCP Audit](orca-cli-mcp-audit.md) | **Reference/history only.** Does not override current Local architecture. |
| [Review Template](review-template.md) | Current reusable template. |

## Current Architecture Result

The main review sequence converged on:

```text
not more mutation tools
↓
make whole-form reasoning explicit
↓
observe global envelope + stable model views
↓
separate GLOBAL vs LOCAL failure
↓
inspect exact authored local state
↓
apply causal bounded correction
↓
fail closed on ambiguous/default placement, rotation, and pivots
```

Current source ownership is summarized in
[Implementation Map](../implementation-map.md).

## Review Reading Order For Reference Fidelity

1. [Root Cause](mcp-reference-fidelity-root-cause.md)
2. [Observation Contract](mcp-reference-fidelity-observation-contract.md)
3. [Reference Fidelity Decision](../decisions/reference-fidelity-loop.md)
4. [Implementation Map](../implementation-map.md)
5. [Next Action](../next-action.md) for the next unclosed source gap.

Use the older Geometry AI-Slop and Surface Curation reviews only when their
historical evidence/reasoning is needed.

## Status Rule

A review may say `review ready`, `design frozen`, or similar because that was
true when the evidence was written. **Current status is owned by this index,
source, validation-report, and next-action — not by an old review header.**

## Review Labels

- `active evidence` — current architecture still relies on the finding;
- `implemented in source` — corresponding Local change now exists;
- `historical` — retained for reasoning/provenance, not current task state;
- `local proof required` — source exists but live behavior is not yet verified;
- `superseded` — later decision/source replaced the old method.

## Review Questions

When adding a new review, answer:

- what concrete failure/decision is being reviewed;
- what current source/policy owns it;
- what evidence can disprove the conclusion;
- what was implemented vs only proposed;
- what should become a durable decision rather than remain review prose.

## Parent

- [Knowledge Dashboard](../index.md)
- [Reference Fidelity Decision](../decisions/reference-fidelity-loop.md)
