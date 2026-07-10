# SourceDocument

Human-facing source of truth for Blockbench modelling workflow, reference packages, samples, and project planning.

## Start Here

Use this order for asset work:

1. `modeling/README.md`
2. `modeling/mandatory-blockbench-mcp-procedure.md`
3. `modeling/bedrock-model-production-workflow.md`
4. `modeling/pre-modelling-gate.md`
5. Active asset folder in `SavedData/sessions/`

Do not start Blockbench edits until the reference gate and pre-modelling gate pass.

## Main Folders

| Folder | Purpose |
| --- | --- |
| `modeling/` | Active modelling workflow, gates, phase rules, quality rules, and MCP procedure. |
| `reference-templates/` | Reusable 8-sheet reference package templates. |
| `reference-samples/ninja-master-bedrock-entity/` | Approved 8-sheet Bedrock Entity calibration package. |
| `reference-samples/legacy/` | Old samples kept only for comparison. |
| `blockbench-samples/` | Raw `.bbmodel` sample files used as calibration inputs. |
| `engine/` | High-level workflow hub and operational controls. |
| `engine-connectors/` | External connector notes. |
| `mcp-and-skills/` | MCP and skill usage notes. |
| `planning/` | Project planning docs. |
| `project/` | Project contribution docs. |

## Reference Package Flow

Use this when preparing a model before Blockbench:

1. Brief asset.
2. Build the 8-sheet reference package from `reference-templates/`.
3. Validate with `modeling/reference-package-pass-fail-checklist.md`.
4. Write or update `CODEX_REFERENCE_HANDOFF.md`, `reference_manifest.json`, and sheet notes.
5. Pass `modeling/pre-modelling-gate.md`.
6. Start Main Geometry only after user approval.

## Active Sample

Use `reference-samples/ninja-master-bedrock-entity/` as the approved quality and structure calibration sample.

Use legacy kangaroo sheets only to compare layout ideas, not as the active template.

## Runtime State

Runtime/session state belongs outside this folder:

- `SavedData/sessions/`: active per-asset state.
- `SavedData/cache/`: cache and temporary work outputs.
- `SavedData/ACTIVE_PROJECT.md`: active project tracker.

## Root Rule

Keep `SourceDocument` readable and stable. Move runtime output to `SavedData`, and keep generated API docs in root `docs/`.
