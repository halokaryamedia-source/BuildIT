# BuildIT — MCP Blockbench

BuildIT is a local reference-to-production system for creating reviewed Minecraft Bedrock/Blockbench assets through ChatGPT Reference Studio, Codex, and an MCP-enabled Blockbench plugin.

## Product path

```text
ChatGPT Reference Studio
source subject
→ Production Context approval
→ one approved Reference Visual
→ executable Reference Package

Codex + MCP Blockbench
Reference Package
→ Geometry review
→ Texture review
→ optional Animation review
→ Final Validation review
→ completed Blockbench package
```

The product architecture above is fixed. Current foundation work improves the logic, interfaces, evidence, routing, testing, and developer maintainability around it.

## Repository map

| Path | Purpose |
| --- | --- |
| `CONTEXT-MAP.md` | Bounded contexts and canonical domain ownership. |
| `mcp-blockbench/` | MCP Blockbench application package, scripts, tests, and plugin output. |
| `engines/chatgpt/` | Reference Design context and ChatGPT Reference Studio. |
| `engines/codex/` | Agent Orchestration and Codex entry points. |
| `engines/shared/` | Workflow Governance, profiles, contracts, and canonical skills. |
| `workspace/` | Active and completed Asset workspaces. |
| `docs/architecture/` | System foundation, audits, and architecture guidance. |
| `docs/adr/` | Hard-to-reverse architectural decisions. |
| `openspec/changes/` | Bounded change contracts and decision maps. |
| `.agents/`, `.codex/`, `.github/`, `.vscode/` | Host adapters, CI, and discovery. |

## Start here

- Domain map: `CONTEXT-MAP.md`
- System foundation: `docs/architecture/SYSTEM_FOUNDATION.md`
- Foundation audit: `docs/architecture/FOUNDATION_AUDIT.md`
- Current foundation change: `openspec/changes/buildit-system-foundation/`
- Current production-flow history: `openspec/changes/codex-local-workflow-rework/`
- Codex asset production: `engines/codex/BOOTSTRAP.md`
- Codex repository development: `engines/codex/DEVELOPMENT_BOOTSTRAP.md`
- MCP application: `mcp-blockbench/README.md`
- Workspace lifecycle: `engines/shared/workspace/WORKSPACE_CONTRACT.md`

A real `workspace/workspace.json` is local and intentionally not committed.

## Development domains

BuildIT does not use one global skill hierarchy.

| Domain | Role |
| --- | --- |
| Requirements | explicit user instruction and active OpenSpec |
| Scope and efficiency | Ponytail |
| Engineering method | Engineering Discipline |
| Context intelligence | Code Review Graph confirmed by current source |
| Model execution | Capability Gate and Model Selector |
| Technical proof | source, tests, typecheck, build, runtime, and evidence |

Repository development may use `engineering-discipline` plus optional `code-review-graph`. Normal Blockbench production uses the production skill profile and the `blockbench` MCP server only.

## Model routing foundation

```text
Task
→ deterministic Capability Gate
→ eligible Candidate Pool
→ replaceable Model Selector
→ fixed permissions
→ execution
→ deterministic evidence
```

The current deterministic selector is the runtime baseline. RouteLLM is a candidate evaluation adapter and is not yet a live production router.

## Workspace separation

```text
workspace/active/<asset>/ or workspace/completed/<asset>/
├─ blockbench/   # canonical .bbmodel, textures, references, approved previews
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

The user may copy `blockbench/` alone. The retained `mcp/` directory supports recovery and targeted reopening.

## Readiness

Current source and CI represent a sophisticated internal alpha. They do not yet prove general repeatable production.

Required before broader readiness:

- real Windows-first Blockbench end-to-end acceptance;
- full save/close/reopen/export/finalization proof;
- filesystem fault and recovery tests;
- multi-archetype visual acceptance corpus;
- behavior tests for critical claims currently protected only by source markers;
- measured route, token, correction, time, and cost data;
- RouteLLM provider-seam and calibration evidence before runtime adoption.

See `docs/architecture/FOUNDATION_AUDIT.md` for the complete assessment.

## Naming rule

Use one canonical path and filename for every concern. Do not create `v2`, `new`, `latest`, `backup`, or parallel authority names. Git history, bounded OpenSpec changes, and approved checkpoints store revisions.
