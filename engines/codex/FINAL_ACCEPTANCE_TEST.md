# Final User Acceptance Test

This is the one final end-to-end test. It is not a component-test checklist. Repository maintainers must finish and automate all internal verification before asking the user to perform it.

## Readiness Rule

Do not report `READY TO TEST` unless all of the following are true on the exact `Rework` head and generated `mcp-blockbench/dist/mcp.js`:

- synchronized skills pass;
- TypeScript passes;
- all automated tests pass;
- plugin build passes;
- stable tool-surface/session-continuity tests pass;
- write-lease ownership tests pass;
- identity synchronization tests pass;
- Golden Sample zero-start initialization test passes;
- the final bundle contains the matching release version;
- no production workspace payload was committed by verification.

## User Actions

The user performs only these setup actions once:

1. Pull the final `Rework` head.
2. Load the final `mcp-blockbench/dist/mcp.js` once in Blockbench.
3. Start one Codex session from the BuildIT repository root.
4. Send the production request below.

The user must not be asked to run build commands, test internal tools, inspect UUIDs/sessions/profiles, reconnect MCP, reload the plugin, or start another Codex session during this acceptance run.

## Production Request

```text
Create a new Black Rhinoceros model from zero using the tracked Golden Sample.

Use a fresh workspace. Do not continue or copy the previously debugged black_rhinoceros model, checkpoints, evidence, state, project identity, textures, or geometry.

Initialize from docs/reference/golden-samples/black_rhinoceros using the canonical workspace:sample flow. Create the Bedrock project through Blockbench MCP, then build Geometry from the approved Reference Visual.

Keep the same Codex session and MCP session for the entire run. Do not ask me to reconnect MCP, reload the plugin, edit files, choose agents, choose profiles, or perform technical smoke tests.

Stop only when the newly built Geometry has been submitted to GEOMETRY_REVIEW and is ready for my visual approval. Show me the final five-view result and a concise summary of the silhouette/proportion decisions.
```

## Acceptance Result

The run passes only when:

- a fresh asset workspace was created from the tracked Golden Sample;
- the initializer reports `prebuilt_model_copied: false` and `model_exists: false` before MCP project creation;
- the Rhino project and Geometry were created from zero;
- no data from `workspace/active/black_rhinoceros` was used as model output or revision baseline;
- one Codex session remained active;
- one plugin load was sufficient;
- no MCP reconnect occurred across profile/workflow operations;
- no user-facing internal component test was requested;
- Geometry reaches `GEOMETRY_REVIEW / AWAITING_USER_REVIEW`;
- write lease is `UNCLAIMED` while waiting for the user;
- the user can judge the five-view visual match against the approved Reference Visual.

The user may then answer only `APPROVED` or provide visual revision feedback.
