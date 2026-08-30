# Clockwork Sample

Status:

```text
SAMPLE / TEST FIXTURE
NOT ACTIVE PROJECT
NOT PRODUCTION CONTINUITY
NOT AUTHORING BENCHMARK
```

This package retains Clockwork reference images and sample Blockbench outputs used during earlier BlockIT development/testing. It is intentionally outside `workspace/active/` so agents and developers do not treat it as current production asset state.

## Rules

- Use these files only when a task explicitly asks for this sample/fixture or for historical reproduction.
- Do not infer current product quality, current project status, or authoring efficiency from these models.
- Do not use the existing `.bbmodel` or `.geo.json` files as a professional benchmark answer key.
- Real persistent asset work belongs in `workspace/active/<project>/` only when that work is genuinely active.
- Any future authoring benchmark must be defined from an explicitly selected real workload and current acceptance criteria, not from this sample package by default.

## Retained sample assets

The package keeps the existing Clockwork `.bbmodel`, `.geo.json`, and reference PNG files unchanged for manual testing and historical comparison. Git history owns the original development context.
