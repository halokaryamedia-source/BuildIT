# Workflow Governance

## Purpose

Workflow Governance coordinates shared invariants across Reference Design, Asset Production, Agent Orchestration, Workspace, and Repository Development. It does not become a universal product or execution authority.

Canonical vocabulary is defined in `CONTEXT-MAP.md` and `engines/shared/CONTEXT.md`.

## Domain ownership

| Rule class | Canonical owner |
| --- | --- |
| Requested outcome, non-goals, acceptance criteria | explicit user decision + active bounded OpenSpec change |
| Minimum-sufficient execution slice and call/evidence budget | Ponytail |
| Reference identity and visible/technical constraints | approved Reference Package |
| Active Asset Runtime State | `workspace/active/<asset>/mcp/state.json` |
| Project identity and canonical paths | `workspace/active/<asset>/mcp/project.json` |
| Workspace lifecycle | `engines/shared/workspace/WORKSPACE_CONTRACT.md` |
| Stage and tool execution policy | stage/tool profiles |
| Skill loading policy | `engines/shared/skills/skill-profiles.json` |
| Repository engineering method | Engineering Discipline |
| Repository context and blast radius | Code Review Graph confirmed by current source |
| Capability and model eligibility | Agent Orchestration Capability Gate |
| Eligible route selection | configured Model Selector |
| Implementation correctness | current source, tests, typecheck, build, runtime, and Evidence |

A summary document may link to an owner but must not duplicate executable arrays, state transitions, or detailed policy that can drift.

## Shared invariants

1. One Asset has one canonical identity and model filename.
2. One active Asset has at most one Writer.
3. A Model Selector cannot grant capability, permission, stage access, or writer ownership.
4. A mutation invalidates dependent Evidence.
5. Every Review Gate binds current identity, state revision, contract, and Evidence.
6. Completed Baselines are immutable while a reopened revision is active.
7. User-facing model files stay in `blockbench/`; MCP runtime and recovery files stay in the sibling `mcp/` directory.
8. Runtime coordination is automatic on the normal single-user path; manual identity, lease, profile, or checkpoint coordination is diagnostic-only.
9. Every public operation returns one next safe operation or one stable blocker.
10. Deferred ideas are recorded, not silently implemented.
11. Production and repository-development skill profiles do not mix.
12. No bounded OpenSpec change becomes a permanent store for unrelated project history.

## Context discipline

- Read the selected project metadata, active Runtime State, active Stage contract, and required reference core.
- Do not scan all workspaces when the index and project metadata provide exact paths.
- Do not repeat preflight, Reference Visual inspection, or full validation while current evidence remains fresh.
- Code Review Graph may narrow repository reads; current source remains authoritative.
- Generated summaries should remain smaller than the contracts they summarize.

## Mutation discipline

- Initial construction may use bounded multi-part batches.
- Revision work targets one named issue or one tightly related pair.
- Preserve accepted areas and manual edits.
- Never bypass another Writer's lease.
- Finalization and reopening are transactional workspace operations.

## Review discipline

- Internal passes are not Review Gates.
- Stop only at user-visible review decisions, an unresolved contract conflict, an unsafe mutation, or a blocker with no valid recovery route.
- Standards and Spec review remain separate for repository changes.

## Change discipline

- Use `openspec/changes/buildit-system-foundation/` for current foundation decisions.
- Treat `codex-local-workflow-rework` as production-flow implementation history and compatibility context.
- Do not create versioned duplicate authorities. Git history, bounded changes, ADRs, and approved checkpoints store decisions and revisions.
