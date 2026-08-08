# Change Log

Short record of meaningful BlockIT knowledge/documentation changes.

## 2026-08-08 — Reference Fidelity Architecture

- consolidated repository-wide skills under root `.agents/skills/` and froze the
  six-skill architecture;
- retired old nested/stale skill ownership paths from current routing;
- simplified reference generation to an approved five-view visual Modelling
  Brief, without pixel calibration or heavy package machinery;
- documented the Reference Fidelity root cause: technically valid Cube placement
  can still produce a globally wrong model;
- adopted the Reference Fidelity Loop: coordinate frame + Primary Form
  Hypothesis + structural/visual observation + global/local correction;
- documented the hard rebuild threshold for unrecognizable/multi-primary failure;
- separated structural evidence from visual approval.

## 2026-08-08 — Fidelity Source Hardening

Current Local source added/hardened:

- `inspect_model_bounds`;
- `capture_model_views`;
- `inspect_element`;
- `modify_cubes_batch`;
- strict `modify_cube`/`place_cube` targeting;
- no silent requested-group → root fallback;
- Group/bone preflight and pivot-transfer behavior;
- Cube pivot-only vs authored geometry rewrite semantics;
- explicit pivot requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for all newly placed Cubes.

Live Blockbench proof remains intentionally deferred and is tracked as
`LOCAL PROOF REQUIRED`.

## 2026-08-08 — Root Docs / Obsidian Refresh

- refreshed `docs/README.md` as the human entrypoint;
- refreshed foundation index, product overview, requirements, modelling workflow,
  reference guide, geometry standard, texture standard, visual validation, and
  validation report;
- reclassified source-selection/merge-map notes as historical adoption records;
- refreshed Obsidian dashboard, implementation map, module/skill/MCP ownership,
  workspace/source maps, glossary, review index, roadmap, and task board;
- added the durable `decisions/reference-fidelity-loop.md` record;
- removed current routing claims that pointed at nonexistent `mcp/workflow/` or
  retired skill roots.

## 2026-07-23 — Vault Creation

- created the repo-local Obsidian vault in `docs/knowledge/`;
- added dashboard/home notes, glossary, templates, module maps, and operations
  layer;
- connected Obsidian start page to `index.md`;
- added early ownership and roadmap/task-board notes.

Historical entries above retain their original context. Current ownership/status
is always determined by the dashboard, implementation map, validation report,
source, and next-action.
