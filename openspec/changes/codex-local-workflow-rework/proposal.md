# Proposal: Codex Local Workflow Rework

## Goal

Make local MCP Blockbench production precise, stage-gated, recoverable, and token-efficient without merging into `V1` or enabling CI early.

## Canonical Architecture

```text
src/        MCP Blockbench implementation
engines/    shared and engine-specific orchestration
workspace/  local session state and outputs
docs/       human/generated documentation
openspec/   approved scope and decisions
build/      build tooling
```

No parallel versioned roots are allowed.

## User-Visible Stages

1. Geometry review
2. Texture review
3. Animation review when required
4. Final Validation review

## Included

- deterministic Blockbench MCP connection;
- one runtime state authority;
- exact stage and repair tool profiles;
- persistent checkpoints and stable evidence;
- compact reference validation;
- direct texture evidence writes;
- atomic stage completion;
- shared workflow for Codex, Claude, and Ollama boundaries;
- root consolidation and legacy-context removal.

## Excluded Until Final Verification

- merge into `V1`;
- continuous CI or preview deployment;
- speculative new modelling tools;
- duplicate workflow documents or versioned folder names.
