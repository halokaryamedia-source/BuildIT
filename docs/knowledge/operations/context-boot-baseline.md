# Context Boot Baseline

Manual baseline protocol for checking context efficiency. This note records
expected routes; unrun scenarios are not verified.

## Targets

- Read no more than 3–5 initial files for a normal task.
- Identify the affected area before opening detailed policy or module notes.
- Use one primary technical skill.
- Never read the task board during normal boot.
- Leave validation evidence appropriate to task risk.

## Scenarios

| Scenario | Expected initial route | Primary skill | Status |
|---|---|---|---|
| MCP task kecil | `AGENTS.md` → `CONTEXT.md` → `next-action.md` → `mcp/AGENTS.md` → target area | `mcp-builder` | Not run |
| Bug | boot context → target module → diagnosis | `diagnosing-bugs` + area skill | Not run |
| Refactor besar | boot context → module map → design → review graph if cross-module | `codebase-design` | Not run |
| Prompt ambigu | boot context → Plan → `Needs Validation` | planning skill | Not run |

## Measurement Fields

For each real test, record only:

- files read before editing;
- approximate words read;
- skills activated;
- correct area found: yes/no;
- unnecessary broad scan: yes/no;
- validation outcome clear: yes/no.

Update this note only after an actual scenario is tested. Do not add telemetry,
scripts, or runtime instrumentation for this baseline.
