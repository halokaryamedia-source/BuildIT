# Flow

Use this note as the single routing map for the agent and the user. Detailed
procedures remain in the linked foundation, development, maintenance, and
skill notes.

## Agent Routing Flow

```mermaid
flowchart TD
    A[User request] --> B[Boot context<br/>AGENTS → CONTEXT → next-action]
    B --> C{High-impact ambiguity remains?}
    C -- Yes --> D[GSD-style discovery<br/>inspect facts → ask only real decisions]
    C -- No --> E{Work mode}
    D --> E
    E -->|Plan| F[Scope, decisions,<br/>acceptance criteria, test strategy]
    E -->|Developing| G[Context Contract]
    E -->|Maintenance| H[Diagnose or review<br/>without feature creep]
    F --> G
    H --> G
    G --> I[Inspect source, callers,<br/>patterns, and proof path]
    I --> J{Cross-file discovery broad?}
    J -- Yes --> CG[Optional CodeGraph<br/>one focused exploration]
    J -- No --> K{Cause or scope proven?}
    CG --> K
    K -- No --> L[Terhenti / Perlu pemeriksaan]
    K -- Yes --> M[Ponytail + one narrow<br/>specialist skill]
    M --> N[Smallest correct change]
    N --> O[Risk-based validation]
    O --> P[Review]
    P --> Q{Evidence sufficient?}
    Q -- No --> R[Perlu pemeriksaan]
    Q -- Yes --> S[Selesai]
    S --> T[Update next-action or<br/>decision note when state changes]
```

## Conditional Stages

- **GSD-style discovery**: only before planning when the prompt leaves
  high-impact decisions unresolved. It does not create a second planning/state
  hierarchy in this repo.
- **Grilling**: when the user asks to stress-test a plan, decision, or idea.
  It challenges assumptions before commitment; it is not code review.
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
- **Developing**: source or documentation change, validation, review, and result summary.
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
