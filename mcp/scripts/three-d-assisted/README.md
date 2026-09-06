# 3D-Assisted Production Pipeline

This directory documents the production external pipeline owned by `mcp/scripts/three-d-assisted-run.ts`.

## Prepare Before Testing

Preparation installs dependencies and weights; it does not run inference, deploy Blockbench, create an asset, or approve visual results.

From the repository root on Windows (Python 3.12, Bun, Git and WSL2 Ubuntu installed):

```powershell
python Experimental/three-d-assisted-hunyuan-poc/environment.py setup
wsl -d Ubuntu -- bash -l Experimental/primitiveanything-poc/setup_wsl.sh
cd mcp
bun run three-d-assisted:run -- preflight
```

Hunyuan defaults to `Experimental/three-d-assisted-hunyuan-poc/.cache/venv/Scripts/python.exe`, with source under `.cache/Hunyuan3D-2`, pinned models under `.cache/models`, and background-removal weights under `.cache/u2net`. `BLOCKIT_HUNYUAN_PYTHON` may select the prepared interpreter explicitly; `HY3DGEN_MODELS` and `U2NET_HOME` may select matching prepared caches. Preflight rejects missing/mismatched weights rather than downloading during inference.

PrimitiveAnything uses WSL **Ubuntu**, Conda environment `blockit-pa-poc`, source/data/checkpoints under `Experimental/primitiveanything-poc/.cache/PrimitiveAnything`, and download cache beside that checkout under `.cache/hf-download`. The login shell resolves Conda in noninteractive calls. The existing `PA_ROOT`/`PA_ENV` overrides belong to the WSL environment.

`preflight` needs no workspace, performs no asset-state writes, and checks both backends: pinned source, imports, CUDA visibility and weights/data. It does not load inference pipelines or prove peak VRAM sufficiency. `run` performs the same check before initializing or invalidating state. Hash validation and rejected gates remain mandatory.

Finish integration and generated/source checks before GPU or native Blockbench tests. The ready-to-test handoff requires an explicitly selected asset, approved reference, dimensions, user-selected strategy and Animation requirement. RTX 3070 8 GB execution capacity remains unproven until the later inference stage.

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

After Codex visual review at the internal Shape gate (not user Geometry approval):

```bash
bun run three-d-assisted:run -- accept-shape --workspace <absolute-workspace>
# or reject-shape
```

Resume `run`. PrimitiveAnything uses the user-requested dimensions converted with `1 block = 16 Blockbench units`, validates the strict data candidate + preview GLB, then stops:

```text
AWAITING_DECOMPOSITION_GATE
```

After internal decomposition review:

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

`mcp/server/threeDAssistedMaterializer.ts` owns the Blockbench engine. The Elements ToolSpec `materialize_3d_assisted_scaffold` accepts only absolute `workspace_path` and is Geometry-owned on shared AUTHORING. Use Gateway search/describe/invoke; there is no fifth Gateway tool. Its structured receipt contains primitive/group/cube counts, `undo_units: 1`, canonical source and `next_step: semantic_geometry_cleanup`.

Source checks prove registration, validation and controlled rollback. Later deploy the exact verified build and prove native atomic Undo/stale-state behavior before end-to-end acceptance. A source-ready binding does not approve any asset or establish installed runtime availability.
