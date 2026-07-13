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

Technical Markdown, schema-3.3 manifest, Codex handoff, package audit, and candidate ZIP are generated automatically after visual approval.

The tracked Black Rhinoceros Golden Sample is mandatory for both:

- visual-board layout, camera, facing direction, scale, spacing, and technical hierarchy;
- Minecraft / Blockbench cuboid construction language and quality.

The source asset controls subject identity. It never creates a realistic or alternate-style rendering branch.

## Minecraft-only upstream invariant

Every Reference Visual SHALL depict an actual Minecraft Bedrock / Blockbench cuboid model, not a realistic subject with pixelated material treatment.

The construction SHALL use:

- planned primary and secondary rectangular masses;
- meaningful cuboid size variation;
- stepped transitions for taper and silhouette control;
- limited purposeful one-axis rotations for approved angled features;
- stable major masses and separable parts;
- crisp Minecraft pixel-art texture.

The flow SHALL reject realistic organic renders, smooth mesh-like anatomy, generic voxel filters, PBR/cinematic presentation, uniform cube stacking, micro-cube clutter, and arbitrary rotation noise before user review.

The user SHALL NOT be asked to select realistic versus Minecraft style, a stylization level, or whether cuboid modelling should be used. Those decisions are fixed by the specialized skill.

## Upstream review and correction contract

```text
source intake
→ fixed Minecraft interpretation
→ optional one-batch subject clarification
→ Production Context approval
→ one Minecraft cuboid Reference Visual
→ internal blocking QA
→ at most one targeted correction of the same visual
→ Reference Visual approval
→ automatic technical package and candidate ZIP
```

A failed visual draft SHALL NOT be presented as approval-ready. If the one allowed correction still fails, the flow SHALL stop with exact blocker codes rather than regenerate repeatedly or offer alternate styles.

## User-visible production stages

1. Geometry review;
2. Texture review;
3. Animation review only when required;
4. Final Validation review.

Internal passes, diagnosis scopes, routing, preflight, checkpoints, evidence generation, and Reference Visual QA are not additional user gates.

## Minimum-sufficient execution

- no visual-style clarification call;
- one batched subject clarification turn only when required;
- exactly one normal Reference Visual generation;
- at most one blocking correction of the same image;
- no failed draft shown to the user;
- no optional style exploration or visual polish loop;
- one runtime preflight at Codex startup;
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

- one Minecraft-only Reference Visual plus concise stage documents and executable manifest;
- Golden Sample construction, panel-position, camera, and presentation locks;
- fixed-scale transformed Geometry analysis;
- semantic view/region/part diagnosis;
- part, count, parent, symmetry/asymmetry, rotation, Texture, and Animation contracts;
- conditional Right Side evidence for asymmetric assets in Geometry and Final Validation;
- project identity synchronization before lease acquisition;
- one stable MCP tool surface and one Codex/MCP session;
- atomic reports, checkpoints, transitions, revision preparation, upstream reopen, and final promotion;
- active/completed workspace lifecycle with immutable completed baseline;
- automated typecheck, tests, build, bundle, Minecraft-style, and flow-efficiency regression coverage.

## P0 correction boundary

The failed giraffe simulation proved a reproducible upstream P0: the previous prompt could produce a realistic subject with pixel texture and incorrect Golden Sample positioning. Correcting this upstream contract is permitted under the pre-local freeze because it removes an observed invalid branch without changing Geometry/Codex/MCP architecture.

After this correction, no additional Reference Studio style mode, prompt variant, image sheet, approval gate, or regeneration path may be added before measured local acceptance evidence exists.

## Excluded until explicit approval

- merge into `V1`;
- release/deployment;
- learned routing or persistent routing telemetry;
- duplicate/versioned authorities or outputs;
- realistic, semi-realistic-render, cinematic, generic-voxel, or alternate visual style modes;
- unrelated modelling capabilities outside approved Bedrock cuboid production.

## Routing identity lock

Project parent default: `gpt-5.6-terra`, medium. The Terra Medium parent performs standard work directly without a controller hop. `mcp_builder` remains the fallback sole MCP writer when isolation is required.
