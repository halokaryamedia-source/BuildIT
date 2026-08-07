# Zebra Project

This is the active Zebra Blockbench project.

- `zebra.bbmodel`: native Blockbench project file.
- `export-data/`: reserved for Minecraft Bedrock development output.
- `mcp-data/`: Codex/MCP cache and project metadata.
- `mcp-data/references/`: reference images and comparison packages.
- `mcp-data/cache/`: preview screenshots and temporary MCP cache.

## Reference Generator Fixture

The active reference package is:

```text
mcp-data/references/zebra_reference_package/
```

It uses the current five-view Model Reference baseline:

- Left Side;
- Front;
- Back;
- Top / Footprint;
- Front 3/4 Preview.

The package is a Zebra-only test fixture for MCP visual inspection. Its Model
Reference remains a five-view source package, but the active geometry workflow
uses only `SIDE` (mapped to `LEFT SIDE`) plus the section-declared `FRONT` or
`BACK` crop. It is not a blueprint and does not provide automatic geometry
approval.
The original Source Image is provenance only. The Golden Sample is owned by
`mcp/workflow/reference-generator/assets/golden_sample.webp` and defines only
presentation and modelling density.

Current target:

```text
Height: 2.0 blocks
Width: 0.9 blocks
Length: 2.6 blocks
Texture Style: 32x32
Pose: Neutral standing pose
Animation: No
```

No separate underside reference or Texture Reference is required for this
fixture. The Blockbench project has been reset to an empty saved state. All
previous geometry plans, unsaved cube drafts, visual `PASS` decisions, and
construction notes are obsolete. The reference package is preserved as the
only Zebra test input. A new modelling contract must be designed before
geometry construction restarts.
