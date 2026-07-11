# Proposal: Codex Local Workflow Rework

## Goal

Make local MCP Blockbench production precise, stage-gated, recoverable, easy to hand off, and token-efficient without merging into `V1` or enabling CI early.

## Canonical Architecture

```text
mcp-blockbench/  complete MCP Blockbench package
engines/         shared and engine-specific orchestration
workspace/       active and completed Blockbench projects
docs/            authored documentation and generated API output
openspec/        approved scope and decisions
```

Inside `mcp-blockbench/`, source, scripts, prompts, tests, and generated plugin output have one package root. No parallel or versioned roots are allowed.

Every workspace project separates:

```text
blockbench/   user-facing .bbmodel, textures, references, previews
mcp/          state, contracts, checkpoints, evidence, reports
```

Completed projects retain both folders so ordinary users can take only `blockbench/`, while Codex/MCP can reopen later from saved metadata without rediscovery.

## User-Visible Stages

1. Geometry review
2. Texture review
3. Animation review when required
4. Final Validation review

## Included

- deterministic Blockbench MCP connection;
- one runtime state authority;
- exact stage and repair tool profiles;
- exact stage skill profiles with at most two loaded production skills;
- one canonical production-skill source plus synchronized host adapters;
- persistent checkpoints and stable evidence;
- compact reference validation;
- direct texture evidence writes;
- atomic stage completion;
- project write lease and stale-call protection;
- active/completed workspace lifecycle;
- one selected-project index and compact lifecycle command;
- immutable completed baseline while a revision is active;
- shared workflow for Codex, Claude, and Ollama boundaries;
- singular MCP package root and legacy-context removal.

## Excluded Until Final Verification

- merge into `V1`;
- continuous CI or preview deployment;
- speculative new modelling tools;
- persistent live MCP sessions or write leases;
- dynamic skill servers or MCP skill-selection tools;
- duplicate workflow documents, skills, models, or versioned folder names.
