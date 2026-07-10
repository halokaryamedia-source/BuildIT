# SourceDocument

Human-facing source documents for the Blockbench MCP plugin and local production workflow.

## Start Here

For normal Codex asset production:

1. `../Engine/codex/BOOTSTRAP.md`
2. `../SavedData/sessions/<asset>/state.json`
3. approved reference package in `../SavedData/sessions/<asset>/references/`
4. active-stage document only

Use `modeling/` for detailed rules or failure recovery, not as a mandatory full read on every cycle.

## Approved Reference Package Format

```text
<asset>_blockbench_reference/
├─ source/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

This format replaces the legacy numbered multi-sheet requirement for new sessions.

## User-Visible Production Stages

1. Geometry
2. Texture
3. Animation, only when required
4. Final Validation

Internal technical passes remain available but do not create extra routine approval gates.

## Main Folders

| Folder | Purpose |
| --- | --- |
| `modeling/` | Detailed stage contracts, quality rules, and failure playbooks. |
| `engine/` | Human-readable workflow hub and repository controls. |
| `reference-samples/` | Calibration and legacy comparison samples only. |
| `blockbench-samples/` | Raw `.bbmodel` calibration inputs. |
| `planning/` | Project planning documents. |
| `project/` | Contribution and repository documentation. |

## Runtime State

Runtime output belongs outside `SourceDocument`:

```text
SavedData/sessions/<asset>/
├─ state.json
├─ references/
├─ checkpoints/
├─ evidence/
├─ reports/
└─ final/
```

`state.json` is the runtime authority. Markdown reports are summaries, not competing state sources.

## Reference Authority

- `PRODUCTION_CONTEXT.md`: intent, function, assumptions, and decision logic.
- `<asset>_reference_visual.png`: visible identity, silhouette, proportions, pose, color, and attachments.
- `GEOMETRY.md`: build translation.
- `TEXTURING.md`: UV and material translation.
- `ANIMATION.md`: hierarchy, pivots, and required motion.
- `VALIDATION.md`: post-build test contract.

## Root Rule

Keep build/runtime paths required by tooling in place. Operational logic may be consolidated under `Engine/`, and runtime state under `SavedData/`.
