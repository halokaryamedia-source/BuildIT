# Documentation Audit

Updated: 2026-08-11

This is an **audit record**, not normal Codex boot context. Current routing is owned by root `AGENTS.md`; current repository continuation by `next-action.md`.

## Audit Goal

Ensure active documentation describes current `Local` and gives Codex one deterministic handoff before live Blockbench acceptance.

## Current Documentation Spine

```text
AGENTS.md                        task class / proof discipline
CONTEXT.md                       stable facts and terminology
README.md                        human repository entrypoint

docs/
├─ README.md                     docs entrypoint
├─ foundation/
│  ├─ README.md                  durable policy map
│  └─ validation-report.md       current evidence state
└─ knowledge/
   ├─ index.md                   human/Obsidian dashboard
   ├─ minimal-nav.md             shortest task-class-aware navigation
   ├─ next-action.md             one active repository-continuation state
   ├─ implementation-map.md      current source ownership/surface
   ├─ skills/                    current skill inventory/routing
   ├─ sources/                   authority bridge
   ├─ reviews/                   historical evidence + current review index
   └─ operations/
      ├─ local-acceptance-runbook.md  current local procedure
      ├─ task-board.md                future/non-active work
      └─ roadmap.md                   broad direction

.agents/skills/                  nine current repository-owned skill packages
mcp/                             active plugin/runtime source
workspace/                       model/project packages and fixtures
```

## Resolved 2026-08-11 Stale Current-State Claims

The final pre-local documentation pass removed or reclassified active-current claims that still described an earlier repository state:

- old “six-skill architecture” routing after the BlockIT authoring orchestrator/texturing/animation packages had become current owners;
- retired `mcp/prompts/bedrock.md` references instead of `mcp/prompts/bedrock_entity_workflow.md`;
- statements that local Blockbench testing was still deferred rather than the active next stage;
- discovery docs that treated explicit empty Group/name filters as omission after those boundaries were hardened to reject empty values;
- `apply_texture` and `filter_by_material` described as normal/default current tools after Bedrock semantics containment;
- stale “next source audit” / paused-source wording superseded by later implementation;
- the MCP reduction/stabilization plan presented as current execution order after its non-local work had been completed;
- historical reviews/plans presented without a current index explaining whether they are active evidence, implemented, historical, or superseded.

## Current Skill Architecture

Asset authoring:

```text
blockit-bedrock-entity-mcp
├─ blockbench-bedrock-modelling
├─ blockit-bedrock-texturing
└─ blockit-bedrock-animation
```

Repository/plugin development:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

The packages are task-class/stage routed and are not a “load all nine” stack.

## Current Local Handoff

Repository continuation now has one explicit path:

```text
AGENTS.md
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ docs/knowledge/operations/local-acceptance-runbook.md
→ mcp/README.md + mcp/AGENTS.md
```

Ordinary asset authoring does not use this repository-continuation boot path; it follows root Task Class First routing.

## Maintenance Rules

- One note, one job.
- `next-action.md` owns current status, not history.
- The local acceptance runbook owns procedure, not status.
- Reviews/plans retain historical evidence; current meaning belongs in indexes/status owners.
- Generated `mcp/docs/` remains secondary to source.
- Prefer removing stale routing to adding another state/planning layer.
- Verify active Markdown links and source/path names during structural documentation changes.

## Local Proof Boundary

This audit can establish documentation/source consistency only. It cannot establish live Codex/Blockbench behavior. The next runtime evidence is intentionally delegated to the Local Acceptance Runbook.
