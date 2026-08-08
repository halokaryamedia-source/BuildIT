# Context Boot Baseline

Updated routing: 2026-08-08

Manual baseline protocol for checking context efficiency. This note records
**expected routes**; unrun scenarios are not verified.

## Targets

- start from `AGENTS.md` → `CONTEXT.md` → `next-action.md`;
- identify the affected boundary before opening detailed docs/source;
- Developing always uses `development-brief`;
- add at most one useful specialist;
- never read the task board during normal boot;
- use proof appropriate to the active channel/risk;
- avoid broad vault/source scans when the owner is already known.

## Scenarios

| Scenario | Expected initial route | Expected owner/skill | Status |
|---|---|---|---|
| Small MCP public-contract task | boot → target MCP source → relevant contract/factory | `development-brief` + `mcp-server-development` when useful | Not run |
| Blockbench runtime/API defect | boot → affected runtime source → targeted upstream/current API evidence | `development-brief` + `blockbench-runtime-development` | Not run |
| Bedrock visual/model issue | boot → active reference + modelling policy + current model evidence | `development-brief` + `blockbench-bedrock-modelling` | Not run |
| Type-system-only failure | boot → affected TS boundary | `development-brief` + `typescript-type-safety` | Not run |
| Bun build/tooling failure | boot → affected Bun/build source | `development-brief` + `bun-tooling` | Not run |
| Ambiguous high-impact request | boot → repository evidence → ask only unresolved decision | `development-brief`; discovery escalation only if necessary | Not run |
| Maintenance/bug diagnosis | boot → reproduction/owner → smallest diagnostic | Maintenance route from `AGENTS.md` | Not run |

## Measurement Fields

For a real scenario, record only:

- files read before owner was identified;
- approximate context size if useful;
- skills activated;
- correct owner found: yes/no;
- unnecessary broad scan: yes/no;
- proof boundary clear: yes/no;
- unnecessary user clarification: yes/no.

Update this note only after an actual scenario is tested. Do not add telemetry,
scripts, or runtime instrumentation solely for this baseline.

## Parent

- [Operations](README.md)
- [Minimal Navigation](../minimal-nav.md)
