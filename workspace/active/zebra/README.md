# Zebra — Optional Local Acceptance Fixture

This package is retained only as a **reference-fidelity acceptance fixture** for BlockIT. It is not a product template and must not create Zebra-specific runtime rules.

## Files

- `zebra.bbmodel` — reset/editable Blockbench fixture project.
- `mcp-data/references/zebra_reference_package/` — approved visual reference package and source provenance.

Transient MCP preview screenshots are intentionally not tracked; `mcp-data/cache/` is ignored.

## Reference authority

Use:

```text
mcp-data/references/zebra_reference_package/zebra_model_reference.webp
```

as the approved visual reference when this fixture is explicitly selected for Local Acceptance Fixture B.

The original source image is provenance only. The reference constrains visual form; it does **not** prescribe exact Cube transforms, pivots, rotation values, or a fixed decomposition.

Current target metadata:

```text
Height: 2.0 blocks / 32.0 Blockbench units
Width:  0.9 blocks / 14.4 Blockbench units
Length: 2.6 blocks / 41.6 Blockbench units
Texture style: 32x32
Pose: neutral standing
Required animation: none
```

Historical H1–H12 geometry experiments, screenshots, and correction attempts are not current fixture authority. They remain recoverable through Git history if their provenance is ever needed.

## Use rule

Use this fixture only when the user/local acceptance run explicitly chooses it. The normal BlockIT workflow remains object-agnostic and governed by the approved reference, current Foundation policy, and modelling specialist.
