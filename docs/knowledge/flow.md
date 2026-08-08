# Flow

Updated: 2026-08-08

Use this note as the single **agent work-routing** map. Product modelling flow is
owned by `docs/foundation/03-modelling-workflow.md`.

## Agent Routing Flow

```mermaid
flowchart TD
    A[User request] --> B[Boot repository memory<br/>AGENTS → CONTEXT → next-action]
    B --> C{Work mode}

    C -->|Plan| P[Ponytail<br/>Discovery only if high-impact ambiguity remains]
    C -->|Developing| D[development-brief<br/>goal/method → authority → Build/Acceptance POV → scope/proof]
    C -->|Maintenance| M[Ponytail<br/>+ smallest useful diagnostic/specialist]

    D --> N{Development needed?}
    N -- No --> NC[Reuse / explain / no-change + minimum proof]
    N -- Yes --> I[Inspect current owner + affected boundary]
    P --> I
    M --> I

    I --> K{Cause/scope grounded?}
    K -- No --> X[UNKNOWN / LOCAL PROOF REQUIRED<br/>or user-facing Terhenti/Perlu pemeriksaan]
    K -- Yes --> S{One specialist adds real value?}
    S -- Yes --> SP[Load one semantic owner]
    S -- No --> CH[Smallest complete change]
    SP --> CH

    CH --> V[Minimum useful proof]
    NC --> G
    V --> G{Developing?}
    G -- Yes --> AP[Acceptance POV + original-scope gate]
    G -- No --> Q{Material uncertainty/critique needed?}
    AP --> Q

    Q -- Yes --> E[Conditional critique or AGENTS evidence-status escalation]
    Q -- No --> F{Evidence sufficient for claimed status?}
    E --> F
    F -- No --> PR[Perlu pemeriksaan / exact remaining proof]
    F -- Yes --> OK[Selesai]
    OK --> U[Update next-action / decision / owner only if state changed]
```

## Developing Owner Budget

```text
development-brief
+ at most one useful specialist
```

Select by semantic owner, not implementation language:

- MCP public/input/result contract → `mcp-server-development`;
- Blockbench runtime/API/mutation mechanics → `blockbench-runtime-development`;
- Bedrock model judgement/visual result → `blockbench-bedrock-modelling`;
- TypeScript type-system issue → `typescript-type-safety`;
- Bun build/tooling issue → `bun-tooling`.

## Conditional Escalations

Only when needed:

- GSD-style discovery — unresolved high-impact requirement after repo inspection;
- `grilling` — adversarial plan/decision challenge;
- `code-review` — independent implementation critique;
- CodeGraph — optional navigation accelerator, never proof;
- OpenSpec — genuine cross-cutting contract/migration/multi-phase work;
- root evidence labels — `CURRENT-PROJECT VERIFIED`, `OFFICIALLY VERIFIED`,
  `LOCAL PROOF REQUIRED`, `UNSUPPORTED`, `UNKNOWN`.

None are default ceremony.

## Product Modelling Shortcut

For the current Bedrock architecture, use:

- [Modelling Workflow](../foundation/03-modelling-workflow.md)
- [Reference Fidelity Decision](decisions/reference-fidelity-loop.md)
- [Implementation Map](implementation-map.md)

Do not duplicate the modelling flow into this routing note.

## Continuity

New session:

`AGENTS.md` → `CONTEXT.md` → `next-action.md`

Update only the canonical owner whose state actually changed. Chat history is not
the task tracker.

## Related

- [Development Flow](flows/development-flow.md)
- [Maintenance Flow](maintenance/maintenance-flow.md)
- [Skill Activation Matrix](skills/activation-matrix.md)
- [Knowledge Dashboard](index.md)
