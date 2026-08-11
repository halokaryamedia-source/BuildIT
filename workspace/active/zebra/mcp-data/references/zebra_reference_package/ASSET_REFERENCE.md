# Zebra Reference Contract

Status: approved visual fixture metadata  
Purpose: optional BlockIT Local Acceptance Fixture B

## Authority

- `source/zebra_source_image.webp` — source provenance only.
- `zebra_model_reference.webp` — approved visual modelling reference.
- `reference_manifest.json` — compact machine-readable fixture metadata.

The approved reference is visual authority for silhouette, visible proportions, placement, orientation, contacts, and style. It is **not** a geometry blueprint and does not provide exact `from`, `to`, `origin`, rotation, Group hierarchy, or Cube decomposition.

## Target dimensions

| Meaning | Blocks | Blockbench units |
|---|---:|---:|
| Height | 2.0 | 32.0 |
| Width | 0.9 | 14.4 |
| Length | 2.6 | 41.6 |

`1 block = 16 Blockbench units`.

## Reference views

The approved reference provides:

- LEFT SIDE
- FRONT
- BACK
- TOP / FOOTPRINT
- FRONT 3/4 PREVIEW

Use only the views that constrain the current visual claim. A front match cannot certify depth/side fidelity.

## Style / pose

```text
Texture style: 32x32
Shape language: practical Bedrock Cuboids
Pose: neutral standing
Required animation: none
```

Small surface markings such as stripes, eyes, nostrils, and mouth should normally be solved by texture rather than unnecessary geometry once the form is accepted.

## Acceptance boundary

This fixture is useful for testing:

- whole-form reasoning from multiple views;
- a front-plausible but side/depth-wrong failure case;
- difference-first `FAIL / UNVERIFIED / PASS` judgement;
- causal local correction without speculative patch loops;
- downstream texture sequencing after geometry acceptance.

It does not prove BlockIT behavior merely by existing in the repository. Live use remains part of the Local Acceptance Runbook.

## Historical experiments

Earlier H1–H12 geometry hypotheses, numeric candidates, screenshots, and correction histories are intentionally **not current fixture authority**. They were development evidence and remain recoverable from Git history. Do not reload or copy them into a new modelling attempt unless a specific investigation needs that historical evidence.
