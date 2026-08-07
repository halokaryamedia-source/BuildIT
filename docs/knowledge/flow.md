# Flow

Use this note as the single routing map for the agent and the user. Detailed
procedures remain in the linked foundation, development, maintenance, and
skill notes.

## Agent Routing Flow

```mermaid
flowchart TD
    A[User request] --> B[Boot context<br/>AGENTS → CONTEXT → next-action → area index]
    B --> C{Need clear?}
    C -- No --> D[Plan<br/>Needs Validation / up to 3 questions]
    C -- Yes --> E{Work mode}
    D --> E
    E -->|Plan| F[Scope, decisions,<br/>acceptance criteria, test strategy]
    E -->|Developing| G[Context Contract]
    E -->|Maintenance| H[Diagnose or review<br/>without feature creep]
    F --> G
    H --> G
    G --> I[Inspect source, callers,<br/>patterns, and proof path]
    I --> J{Cause or scope proven?}
    J -- No --> K[Terhenti / Perlu pemeriksaan]
    J -- Yes --> L[Select one narrow<br/>technical skill]
    L --> M[Smallest correct change]
    M --> N[Risk-based validation]
    N --> O[Review]
    O --> P{Evidence sufficient?}
    P -- No --> Q[Perlu pemeriksaan]
    P -- Yes --> R[Selesai]
    R --> S[Update next-action or<br/>decision note when state changes]
```

## Mode Outputs

- **Plan**: scope, decision, acceptance criteria, test strategy, and next action.
- **Developing**: source or documentation change, validation, review, and result summary.
- **Maintenance**: diagnosis, minimal correction, regression proof, and limitations.

## Rule

- If the flow changes, update this note first.
- Keep it short enough to read in one pass.
- This is the only agent-routing diagram; do not create one per skill or folder.
- The diagram does not replace `AGENTS.md`, `CONTEXT.md`, foundation policy, or
  the activation matrix.

## Related Notes

- [Development Flow](flows/development-flow.md)
- [Maintenance Flow](maintenance/maintenance-flow.md)
- [Knowledge Dashboard](index.md)
