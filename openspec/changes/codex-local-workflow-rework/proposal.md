# Proposal: Codex Local Workflow Rework

## Goal

Create one precise, visually grounded, recoverable, and token-efficient pipeline from ChatGPT Reference Studio through final Blockbench completion. Keep all work isolated on `Rework` until explicit integration approval.

The workflow must not ask the user to edit runtime files, choose worker models/profiles, run internal tests, reconnect MCP, reload the plugin, or restart Codex during normal production.

## Canonical architecture

```text
mcp-blockbench/  complete MCP Blockbench package
engines/         ChatGPT, Codex, and shared orchestration authority
workspace/       active and completed Blockbench projects
docs/            authored docs and generated API output
openspec/        approved scope, decisions, and flow constraints
```

Each active asset separates:

```text
blockbench/   canonical model, textures, references, approved previews
mcp/          state, contracts, checkpoints, evidence, reports, final staging
```

## Upstream ChatGPT contract

A new sample begins as `reference_candidate`. ChatGPT performs one batched high-impact clarification turn when necessary, then uses exactly two routine approvals:

1. Production Context;
2. one Golden-Sample-guided Reference Visual.

Technical Markdown, schema-3.3 manifest, Codex handoff, package audit, and candidate ZIP are generated automatically after visual approval. The tracked Black Rhinoceros Golden Sample is the mandatory design-system and technical-completeness benchmark, while its subject-specific anatomy and palette are never copied into another asset.

## User-visible production stages

1. Geometry review;
2. Texture review;
3. Animation review only when required;
4. Final Validation review.

Internal passes, diagnosis scopes, routing, preflight, checkpoints, and evidence generation are not additional user gates.

## Minimum-sufficient execution

- one runtime preflight at startup;
- compact stage context only at stage entry/transition/revision;
- one Reference Visual inspection per unchanged hash;
- zero-start Geometry builds primary form before first analysis;
- affected-view diagnosis during correction;
- one final manifest-required view pass;
- submission tools own fresh validation/checkpoint/state transition;
- no duplicate happy-path validation;
- Final Validation uses one evidence-free preflight before final evidence/export;
- deterministic checks replace model judgment whenever possible;
- Sol Medium is conditional, not mandatory;
- one selected Terra writer performs all active-asset mutations.

## Adaptive model routing

```text
parent default       Terra Medium, direct normal implementation
routine_auditor      5.4 Mini Low, read-only mechanical work
mcp_builder          Terra Medium, fallback sole writer
visual_director      Sol Medium, conditional read-only visual judgment
critical_reviewer    Sol High, one coded critical decision only
```

High is the maximum. Extra High, Max, Ultra, Fast, recursive delegation, broad fan-out, and parallel writers are excluded.

## Included quality and recovery

- one Reference Visual plus concise stage documents and executable manifest;
- fixed-scale transformed Geometry analysis;
- semantic view/region/part diagnosis;
- part, count, parent, symmetry/asymmetry, rotation, Texture, and Animation contracts;
- conditional Right Side evidence for asymmetric assets in Geometry and Final Validation;
- project identity synchronization before lease acquisition;
- one stable MCP tool surface and one Codex/MCP session;
- atomic reports, checkpoints, transitions, revision preparation, upstream reopen, and final promotion;
- active/completed workspace lifecycle with immutable completed baseline;
- automated typecheck, tests, build, bundle, and flow-efficiency regression coverage.

## Excluded until explicit approval

- merge into `V1`;
- release/deployment;
- learned routing or persistent routing telemetry;
- duplicate/versioned authorities or outputs;
- unrelated modelling capabilities outside approved Bedrock cuboid production.

## Routing identity lock

Project parent default: `gpt-5.6-terra`, medium. The parent default       Terra Medium route performs standard work directly without a controller hop. `mcp_builder` remains the fallback sole MCP writer when isolation is required.
