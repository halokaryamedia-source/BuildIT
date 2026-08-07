# Flow

Use this note as the single routing map for the agent and the user. Detailed
procedures remain in the linked foundation, development, maintenance, and
skill notes.

## Agent Routing Flow

```mermaid
flowchart TD
    A[User request] --> B[Boot context<br/>AGENTS → CONTEXT → next-action]
    B --> C{Work mode}

    C -->|Plan| P[Plan with Ponytail<br/>GSD discovery only if high-impact ambiguity remains]
    C -->|Developing| D[development-brief<br/>goal → authority → Dual POV → input/output → acceptance]
    C -->|Maintenance| M[Diagnose/review with Ponytail<br/>+ smallest diagnostic/specialist]

    D --> N{Development actually needed?}
    N -- No --> NR[Reuse / explain / verify]
    N -- Yes --> I[Inspect owner, callers,<br/>patterns, and proof path]

    P --> I
    M --> I

    I --> J{Cross-file discovery broad?}
    J -- Yes --> CG[Optional CodeGraph<br/>one focused exploration]
    J -- No --> K{Cause or scope proven?}
    CG --> K

    K -- No --> L[Terhenti / Perlu pemeriksaan]
    K -- Yes --> S[Select one narrow specialist<br/>for the owning boundary]
    S --> CH[Smallest correct change]
    CH --> V[Engineering proof]
    V --> ACG{Developing?}
    ACG -- Yes --> AP[Acceptance POV check<br/>+ original brief scope gate]
    ACG -- No --> R[Review]
    AP --> R
    NR --> R
    R --> E{Evidence sufficient?}
    E -- No --> PR[Perlu pemeriksaan]
    E -- Yes --> OK[Selesai]
    OK --> U[Update next-action or<br/>decision owner when state changes]
```

## Conditional Stages

- **GSD-style discovery**: only when high-impact decisions remain unresolved
  after repository inspection. It does not create a second planning/state
  hierarchy in this repo.
- **Grilling**: when the user asks to stress-test a plan, decision, or idea. It
  challenges assumptions before commitment; it is not code review.
- **CodeGraph**: optional source-navigation accelerator for genuinely broad
  cross-file ownership, call-chain, dependency, or blast-radius questions.
  Start with one focused exploration, then verify against authoritative source.
  It is not a specialist skill and is not used for visual/model judgement.
- **Code review**: after an implementation or existing diff needs critique.
- **Evidence gate**: when proof is missing, disputed, rejected, or a direction
  has failed repeatedly.
- **OpenSpec**: full lifecycle only when the change crosses the threshold in
  `decisions/open-spec-guide.md`.

These stages are conditional. Do not stack them into every task.

## Mode Outputs

- **Plan**: scope, decisions, acceptance criteria, test strategy, and next action.
- **Developing**: normalized development brief, one owning specialist, bounded
  change or verified no-change result, engineering proof, downstream acceptance
  check, and result summary.
- **Maintenance**: diagnosis, minimal correction, regression proof, and limitations.

## Rule

- If the routing flow changes, update this note and the activation matrix in the
  same bounded documentation task.
- Keep it short enough to read in one pass.
- This is the only agent-routing diagram; do not create one per skill or folder.
- The diagram does not replace `AGENTS.md`, `CONTEXT.md`, foundation policy, or
  the activation matrix.

## Related Notes

- [Development Flow](flows/development-flow.md)
- [Maintenance Flow](maintenance/maintenance-flow.md)
- [Knowledge Dashboard](index.md)
