# Proposal: Codex Local Workflow Rework

## Goal

Make local MCP Blockbench production precise, stage-gated, recoverable, and token-efficient without merging into `V1` or enabling CI early.

## Canonical Architecture

```text
mcp-blockbench/  complete MCP Blockbench package
engines/         shared and engine-specific orchestration
workspace/       local session state and outputs
docs/            authored documentation and generated API output
openspec/        approved scope and decisions
```

Inside `mcp-blockbench/`, source, scripts, prompts, tests, and generated plugin output have one package root. No parallel or versioned roots are allowed.

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
- shared workflow for Codex, Claude, and Ollama boundaries;
- singular MCP package root and legacy-context removal.

## Excluded Until Final Verification

- merge into `V1`;
- continuous CI or preview deployment;
- speculative new modelling tools;
- dynamic skill servers or MCP skill-selection tools;
- duplicate workflow documents, skills, or versioned folder names.
