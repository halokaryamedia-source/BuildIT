# BuildIT

Blockbench Auto Model Studio.

BuildIT is a local-first desktop application for generating Minecraft-style voxel models in Blockbench using Ollama, a local agent engine, and Blockbench MCP.

## Goals

- Chat-like interface for image and prompt input.
- Local job manager with progress tracking.
- Ollama integration for planning and image understanding.
- Blockbench MCP integration for creating, previewing, and exporting models.
- Clean architecture with no legacy folders and no stacked version folders.

## Applications

- `apps/desktop` - Tauri and React desktop interface.
- `apps/engine` - TypeScript local agent engine.

## Core workflow

1. User uploads an image or writes a prompt.
2. The app creates a model generation job.
3. The engine analyzes input using Ollama.
4. The engine controls Blockbench through MCP.
5. The app shows progress and preview status.
6. The user is notified when the model is ready in Blockbench.
