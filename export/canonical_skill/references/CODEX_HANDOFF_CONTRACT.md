# Codex Handoff Contract

## Required package

```text
<asset_id>_blockbench_reference/
├─ source/original_reference.<ext>
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

No numbered or additional technical image is part of the package.

## Authority

Production Context → approved Reference Visual → executable manifest → concise stage documents → handoff.

## Import

- technical files → `workspace/active/<asset>/mcp/references/`
- visual/source evidence → `workspace/active/<asset>/blockbench/references/`

## Preflight

Codex verifies package root, asset ID, required files, schema/hash, approval state, format, scale, UV/atlas, symmetry, Animation decision, and authority consistency once. Failure is `ASSET_REFERENCE_PACKAGE_INVALID` or `REFERENCE_CONFLICT`.

## Runtime

Codex creates the model from the approved package. It does not regenerate the visual, redesign the asset, infer skipped Animation, duplicate validation, reconnect MCP, or cross user-review gates automatically.
