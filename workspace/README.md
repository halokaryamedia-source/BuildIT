# Project Workspace

`workspace/` contains intentional Blockbench model/reference packages. It is not a general cache directory.

- `active/` — models/fixtures still being worked on or used for bounded acceptance.
- `saved/` — completed/validated packages.

A project may contain its `.bbmodel`, tracked reference/source assets, and export data that is intentionally part of the project.

Transient MCP screenshots/previews under:

```text
workspace/**/mcp-data/cache/
```

are ignored and must not be committed as project memory. Git history/reviews own old experiments; current project README/reference package owns current intent.

The existing Zebra package is an **optional local reference-fidelity acceptance fixture**, not a generic product template or mandatory active model.
