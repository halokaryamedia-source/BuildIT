# Proposal: Codex Local Workflow Rework

## Goal

Make local MCP Blockbench production precise, visually grounded, recoverable, easy to hand off, and token-efficient without merging into `V1` before explicit approval.

The workflow must remain practical: Codex performs normal identity synchronization, model routing, diagnosis, revision, and validation through MCP. The user is not asked to edit state files, select Geometry repair profiles or worker models, or repeatedly close and reopen Blockbench.

Token efficiency must not reduce production quality. Codex uses deterministic routing, the cheapest eligible locked role, deterministic validation, and evidence-based escalation. Sol is reserved for visual or critical judgment rather than mechanical work.

## Canonical architecture

```text
mcp-blockbench/  complete MCP Blockbench package
engines/         shared and engine-specific orchestration
workspace/       active and completed Blockbench projects
docs/            authored documentation and generated API output
openspec/        approved scope and decisions
```

Inside `mcp-blockbench/`, source, scripts, prompts, tests, and generated output have one package root. No parallel or versioned roots are allowed.

Each workspace project separates:

```text
blockbench/   canonical model, textures, reference images, approved previews
mcp/          state, contracts, checkpoints, evidence, reports
```

## User-visible stages

1. Geometry review
2. Texture review
3. Animation review when required
4. Final Validation review

Internal Geometry correction and model routing are not separate stages or approval moments.

## Approved Geometry quality scope

Included now:

- one approved Reference Visual verified at source integrity and delivered through bounded preview transport;
- transformed world-space bounds;
- fixed approved-scale cuboid projection with no current-model free-rescaling;
- semantic per-view regions with actionable part-level diagnosis;
- blocking edge, ground, and critical-region failures;
- one `BEDROCK_CUBOID_GEOMETRY` profile and MCP session;
- safe metadata-only project identity synchronization before lease acquisition;
- `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` as internal diagnosis scopes;
- advisory Geometry progress markers rather than user-facing sub-gates;
- machine-readable part constraints;
- contract-driven cube rotation with pivot, direction, connection, before/after visual scoring, and rollback;
- unified five-view review readiness gate;
- strict Geometry report with structural, multimodal, deterministic, rotation, evidence, and final statuses;
- automatic guarded review checkpoint and transition to `GEOMETRY_REVIEW`;
- guarded Geometry completion without generic-stage bypass;
- negative visual regression fixtures based on the failed Black Rhinoceros build.

The system must tell Codex which view, region, direction, magnitude, and parts are wrong. Broad visual guessing is not acceptable.

## Approved adaptive model routing

```text
parent default       Terra Medium, direct normal implementation
routine_auditor      5.4 Mini Low, read-only
mcp_builder          Terra Medium, fallback sole MCP writer
visual_director      Sol Medium, read-only visual judgment
critical_reviewer    Sol High, rare read-only critical review
```

- High is the maximum configured reasoning effort.
- xhigh, Extra High, Max, Ultra, Fast mode, recursive delegation, and parallel MCP writers are excluded.
- The parent uses deterministic task classification; no model call is spent only to select another model.
- The Terra parent handles normal implementation directly, avoiding a duplicate controller-to-builder context hop.
- Explicit user model selection affects only the parent thread. When the parent is not Terra or isolation is materially safer, `mcp_builder` becomes the only writer.
- Deterministic gates replace expensive review when they can answer the question.
- Heavy judgment de-escalates immediately to the selected Terra writer and Mini audit.
- Missing optional roles use the documented current-session fallback. The user is not asked to select worker models or restart Codex merely to load them.

## Included workflow infrastructure

- deterministic `blockbench` MCP connection;
- one runtime state authority;
- one Geometry tool profile, plus stage profiles for Texture, Animation, and Final Validation;
- maximum two loaded production skills;
- project Codex defaults with maximum two agent threads and depth one;
- four narrow custom agents with locked models, efforts, and sandbox roles;
- one selected active Blockbench writer;
- persistent checkpoints and stable evidence;
- direct texture evidence writes;
- atomic stage completion;
- project write lease and stale-call protection;
- active/completed workspace lifecycle;
- immutable completed baseline while revision is active;
- one selected-project index;
- single Reference Visual package and legacy-context rejection;
- synchronized canonical, `.agents`, and `.codex` skills.

## Excluded until explicit integration approval

- merge into `V1`;
- production release or deployment;
- persistent live MCP sessions;
- persistent model-routing telemetry or a learned routing service;
- duplicate workflow authorities, models, or versioned folders;
- unrelated modelling capabilities outside the approved Bedrock cuboid workflow.