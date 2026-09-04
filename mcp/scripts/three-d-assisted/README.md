# 3D-Assisted Production Pipeline

This directory documents the production external pipeline owned by `mcp/scripts/three-d-assisted-run.ts`.

## Active Workspace Contract

Normal input is one absolute Active Workspace path. The workspace must contain:

```text
README.md
references/approved-reference.png
```

README must contain the explicit user decision and labelled dimensions:

```text
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: width=<n> height=<n> length=<n> blocks
```

No arbitrary GLB/decomposition path or primitive array is accepted as normal product input.

## Run / Resume

From `mcp/`:

```bash
bun run three-d-assisted:run -- status --workspace <absolute-workspace>
bun run three-d-assisted:run -- run --workspace <absolute-workspace>
```

First `run` deterministically extracts the board's upper slots, invokes pinned Hunyuan3D v1, validates GLB 2.0 structure, stores candidate identity, then stops:

```text
AWAITING_SHAPE_GATE
```

After human/Codex visual review:

```bash
bun run three-d-assisted:run -- accept-shape --workspace <absolute-workspace>
# or reject-shape
```

Resume `run`. PrimitiveAnything uses the user-requested dimensions converted with `1 block = 16 Blockbench units`, validates the strict data candidate + preview GLB, then stops:

```text
AWAITING_DECOMPOSITION_GATE
```

After review:

```bash
bun run three-d-assisted:run -- accept-decomposition --workspace <absolute-workspace>
# or reject-decomposition
```

Accepted output becomes:

```text
3d-assisted/state.json
3d-assisted/shape.glb
3d-assisted/primitive-decomposition.json
```

and the orchestrator reports `READY_FOR_BLOCKBENCH_MATERIALIZATION`.

## Resume / Invalidation

- Reference hash change keeps strategy but removes current derived canonical artifacts and resets the external pipeline.
- Shape/decomposition hash mismatch invalidates the affected current artifact instead of trusting file existence.
- Requested-dimension change preserves an accepted shape but invalidates dimension-dependent decomposition.
- Candidate artifacts remain under `.cache/`; only passed artifacts occupy canonical paths.
- Exit code never auto-approves Shape or decomposition quality.

## Implementation Boundary

Hunyuan and PrimitiveAnything remain pinned implementation backends under `Experimental/`; individual scripts are debug/development tools. The orchestrator is the normal entrypoint.

`mcp/server/threeDAssistedMaterializer.ts` owns the Blockbench materialization engine. Its public Geometry ToolSpec binding is intentionally deferred to LOCAL_CODE because MCP API docs are generator-owned. The local binding must accept only `workspace_path`, register behind the existing Gateway, then run `docs:build`, `docs:check`, and `verify:mcp` before live testing.
