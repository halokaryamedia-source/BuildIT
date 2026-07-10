# Operations Artifacts (Runtime Notes)

Use this folder to store execution-only notes that change per session, machine, or time:

- MCP endpoint status
- Blockbench runtime tool availability
- Screenshot evidence summaries
- Session-specific blockers and resets
- Manual reset notes

Keep this folder lightweight. It is not the planning source.

Add-on references in this folder:

- `full-workflow-audit.md` for cross-session strategic risk audit.
- `phase-risk-simulation.md` for phase-by-phase risk simulation and prevention drill before each new build.
- `session-lock-protocol.md` for anti-spam session ownership and reuse rules.

Recommended file naming:

```text
runtime-log-YYYY-MM-DD.md
session-check-[asset]-YYYY-MM-DD.md
```

`phase-risk-simulation.md` is used as the default pre-flight "hard-part map" for the next model build.

## Acceptance Criteria

- Only execution-only notes are stored in this folder.
- Runtime notes include endpoint/tool/session status when a live session runs.
- Planning docs stay in `SourceDocument/modeling` and are not replaced by temporary logs.
- Naming uses date/asset format and is easy to search for post-run review.
