# Proposal: Codex Local Workflow Rework

## Goal

Make local MCP Blockbench production precise, visually grounded, stage-gated, recoverable, easy to hand off, and token-efficient without merging into `V1` before explicit approval.

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

## Approved Geometry quality scope

The user explicitly reopened and approved Geometry-quality implementation before the next local test. Included now:

- single approved Reference Visual ingestion as an actual MCP image payload;
- transformed world-space bounds;
- fixed approved-scale cuboid projection for deterministic comparison;
- no free-rescaling of current Geometry to fit the reference;
- semantic per-view regions with actionable part-level diagnosis;
- primary-form and structural-detail runtime phases;
- automatic convergence limits;
- major-form versus local-repair routing;
- machine-readable part constraints;
- contract-driven cube rotation with pivot, direction, connection, before/after visual scoring, and rollback;
- unified five-view review readiness gate;
- strict Geometry report with structural, multimodal, deterministic, rotation, evidence, and final statuses;
- guarded Geometry completion without generic-stage bypass;
- negative visual regression fixtures based on the failed Black Rhinoceros build.

The system must tell Codex which view, region, direction, magnitude, and parts are wrong. Broad visual guessing is not acceptable.

## Included workflow infrastructure

- deterministic `blockbench` MCP connection;
- one runtime state authority;
- exact stage and repair tool profiles;
- maximum two loaded production skills;
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
- duplicate workflow authorities, models, or versioned folders;
- unrelated modelling capabilities outside the approved Bedrock cuboid workflow.
