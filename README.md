# MCP Blockbench Workspace

Local Codex production starts here:

- [Codex Bootstrap](Engine/codex/BOOTSTRAP.md)
- [Active Project Pointer](SavedData/ACTIVE_PROJECT.md)
- [Workflow Hub](SourceDocument/engine/WORKFLOW_HUB.md)
- [Source Document Index](SourceDocument/README.md)
- [Root Layout Constraints](SourceDocument/engine/root-layout-constraints.md)

## User-Visible Stages

```text
Geometry
→ Texture
→ Animation when required
→ Final Validation
```

Each stage ends with preview evidence and waits for user approval or targeted revisions.

Operational controls belong in `Engine/`. Runtime asset state, references, checkpoints, evidence, reports, and final outputs belong in `SavedData/sessions/<asset>/`.

Keep source/build/runtime paths required by the plugin and tooling in place.
