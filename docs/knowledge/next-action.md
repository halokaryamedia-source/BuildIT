# Next Action

Updated: 2026-08-13

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; accepted proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
NON_LOCAL_ASSISTED_REFERENCE_INTAKE_IMPLEMENTED
```

Working branch: **`Local` only**.

Current user scope is **non-local**. Do not run Codex local, Blockbench, MCP runtime acceptance, or other local proof unless the user explicitly reactivates it.

## Accepted Baseline

Retained Bedrock capability uses compact structured results, bounded summary-first reads, separated reference/asset/repository routing, one runtime prompt (`bedrock_entity_workflow`), and regression-checked ownership.

Default MCP surface remains:

```text
62 enabled tools
risky_eval     disabled
from_geo_json  disabled
```

Fresh serialized surface measurement:

```text
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters
```

These are serialized measurements, not client token/context measurements.

## Implemented Hardening

```text
P0  DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE

P1  raw static proxy
    Top-1 .5096 / Top-3 .7981 / Top-8 .9231 / MRR .6652

P2  exact-name loading
    Top-1 .8173 / Top-3 .9808 / Top-8 1.0000 / MRR .8990

P3  validation/identity/stale/no-effect/capability failures
    → bounded recovery

P4  named hot-path defect
    → mapped source + primary regression first

P5  semantic form / explicit orientation / pivot-role / contact invariants
    → semantics before exact coordinates

P6  actual approved reference required for material visual claims
    → Reference Evidence Map + View Pair Map + fresh paired evidence

P7  local correction convergence
    → pre-correction evidence
    → causal correction
    → fresh affected evidence
    → IMPROVED | UNCHANGED | REGRESSED
```

No custom MCP router, recovery engine, extra registration profile, server split, vision scorer, image→Cube planner, or capability pruning was added.

## Minimal Reference Generator

Active owner:

```text
/.agents/skills/blockbench-reference-generator/SKILL.md
```

Boundary:

```text
actual source image / user intent
→ AI-assisted intake resolution when needed
→ one buildable Minecraft / Blockbench multi-view Modelling Brief Draft
→ maximum one targeted correction
→ user review / approval
→ actual approved image handed to modelling
```

The generator is image-only. It does not call BlockIT MCP, generate geometry, create ZIP/manifest/production packages, or use numeric fidelity scoring.

## Assisted Intake Resolution

The non-local contract now makes AI assistance explicit without adding a questionnaire or intake framework:

```text
explicit user fact      → preserve as constraint
clear visible fact      → AI may resolve from the source image
optional unknown        → leave unset
material ambiguity      → one compact clarification round
still materially unclear→ NEEDS REVIEW
```

Rules:

- zero clarification is the default;
- when the user says they do not know, AI first tries to resolve from the actual image/request instead of repeating the question;
- numeric dimensions, hidden features, unseen asymmetry, and unseen attachments are never invented to complete intake;
- clarification is limited to one round with at most three material items, written in plain language with one recommended interpretation;
- the user may simply accept the recommendation;
- AI recommendations remain working interpretations until the user accepts them.

`docs/foundation/04-reference-guide.md` remains the durable policy owner. `mcp/tests/reference-generator-buildability.test.ts` protects the assisted-intake boundary together with the existing buildability, cross-view, approval, and bounded-output contracts.

No form schema, intake state machine, new MCP tool, manifest, package, or additional planning document was added.

## Evidence Boundary

GitHub/static proof can establish:

- current routing/ownership;
- P0–P7 instruction/contracts;
- Reference Generator scope/buildability/approval contract;
- assisted-intake/no-guessing/clarification contract;
- regression/static integrity;
- default serialized MCP surface.

It cannot establish:

- generated reference-image quality;
- whether a specific generated board actually preserves the source;
- whether real users find a clarification understandable;
- actual image handoff into a local modelling candidate;
- model image-understanding accuracy;
- installed Codex deferred-search parity;
- model-visible token/latency/image-context cost;
- live Blockbench convergence after P5–P7.

## Continuation Boot

```text
AGENTS.md
→ this file
→ CONTEXT.md only if stable facts matter
→ named MCP-tool defect? Implementation Map Hot-Path Defect Index
→ affected owner + nearest AGENTS.md
→ development-brief for repository create/change
→ at most one relevant specialist
```

## Next Step

```text
NON-LOCAL NEXT — REAL IMAGE ACCEPTANCE

Provide one usable real source image on an image-capable surface.
Run blockbench-reference-generator once.

Acceptance should exercise both paths naturally:
- normal clear image → ideally zero clarification;
- if the user genuinely does not know an optional/material fact → verify the AI resolves, leaves unset, or asks one useful bounded clarification instead of guessing.

Inspect the actual produced board against the existing Reference Guide:
1. source identity / recognizable silhouette preserved;
2. buildable Cuboid construction, not smooth/voxel-filter slop;
3. all views represent one compatible model;
4. view orientation/scale/grounding are coherent;
5. visible attachments, asymmetry, contacts, and negative spaces are preserved;
6. hidden features / photographic artifacts are not invented as geometry;
7. no unresolved material cross-view conflict remains.

If one concrete visual defect exists, allow maximum one targeted correction.
Then stop for user approval.

Do not start Blockbench/Codex local modelling in this scope.
Do not add P8/new architecture unless real-image acceptance exposes a concrete failure that the current minimal route cannot resolve.
```
