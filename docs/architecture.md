# Architecture

BuildIT connects a chat-like desktop UI with a local engine, Ollama, and Blockbench MCP.

## Components

- Desktop UI receives prompt and image input.
- Job Manager tracks generation progress.
- Auto Model Engine plans and executes the workflow.
- Ollama Provider talks to local models.
- Blockbench MCP Client sends tool calls to Blockbench.
- Sync Manager monitors Blockbench connection state.

## Flow

1. User submits a prompt.
2. App creates a job.
3. Engine creates a model plan.
4. Engine maps the plan into Blockbench MCP actions.
5. Blockbench receives project, group, cube, screenshot, and export actions.
6. App reports progress and notifies the user when the model is ready.

## Repository rule

Keep the repository clean. Do not add duplicate implementation folders, legacy folders, or stacked version folders.
