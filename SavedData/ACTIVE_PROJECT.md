# Active Project

This file is a human-readable pointer only.

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

## Current Asset

- Project: MCP-Blockbench Asset Studio
- Asset: `kangaroo`
- Target: Bedrock Entity
- Session folder: `SavedData/sessions/kangaroo/`
- State file: `SavedData/sessions/kangaroo/state.json`
- Workflow: `Engine/codex/BOOTSTRAP.md`
- Active OpenSpec change: `openspec/changes/codex-local-workflow-rework/`

## Migration Note

The existing kangaroo session was created under the legacy phase/reference flow.

Before the next MCP write:

1. create or update `SavedData/sessions/kangaroo/state.json` from `Engine/codex/state.template.json`;
2. validate or replace the legacy reference package with the approved package format;
3. run the one-time pre-modelling gate;
4. set the current user-visible stage to Geometry, Texture, optional Animation, or Final Validation based on verified artifacts;
5. preserve all existing manual model edits.

Do not infer active stage from this pointer when `state.json` exists.
