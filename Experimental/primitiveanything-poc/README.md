# PrimitiveAnything → Cuboid Decomposition POC

Status:

```text
3D_ASSISTED DECOMPOSITION STAGE
EXPERIMENTAL SOURCE FOUNDATION APPLIED
PINNED PRIMITIVEANYTHING IMPLEMENTATION
LOCAL DECOMPOSITION PROOF REQUIRED
PRODUCTION MATERIALIZER PENDING
NOT END-TO-END PRODUCTION READY
```

This directory owns one bounded question inside `3D_ASSISTED`:

> Can an accepted Hunyuan `shape.glb` be decomposed by PrimitiveAnything into a stable primitive description that can later be materialized atomically as native editable Blockbench Cubes?

It does **not** own Semantic Geometry Cleanup, Texturing, Animation, final `.bbmodel` export, or user strategy selection.

## Canonical Target Flow

```text
workspace/.../3d-assisted/shape.glb
→ stock PrimitiveAnything @ pinned commit
→ mixed primitive assembly inspection
→ deterministic Cuboid parameter conversion
→ Primitive Decomposition Gate
→ workspace/.../3d-assisted/primitive-decomposition.json
→ dedicated BlockIT Geometry Runtime materializer
→ temporary native Group/Bone + Cube scaffold
→ Semantic Geometry Cleanup
```

The production target does **not** import a generated Bedrock `geo.json` as the normal bridge. Existing POC `.geo.json` output is historical/debug evidence only. Do not revive generic `from_geo_json`.

## Pinned External Sources

```text
PrimitiveAnything source
50586e55702cc91a81f205c3e1ea78853ce318b1

PrimitiveAnything dataset
59606099595f9293fe5c8d05a4779ab95ac7bb69

PrimitiveAnything model repo revision
7abafab148bd53d7c8e1f2710b66e2abf93c3ee0
mesh-transformer.ckpt.60.pt SHA-256
140341166b40f2038ec20933512f2e00401299d581e7b2549c0068195b616c5a

Michelangelo revision
1ef441fa3ad93b4606ab60eaa8826916b27247ff
shapevae-256.ckpt SHA-256
0391b81c36240e8f766fedf4265df599884193a5ef65354525074b9a00887454
```

External weights/environments remain local/transient and are not committed.

## Local Environment

First proof remains **WSL2 Ubuntu + NVIDIA CUDA**. This is an environment choice for the pinned POC, not a product requirement exposed to users.

From the BuildIT `Local` checkout:

```bash
cd Experimental/primitiveanything-poc
chmod +x setup_wsl.sh run_poc.sh
./setup_wsl.sh
```

The setup script pins the upstream source/environment used by the POC. Do not change versions merely to modernize them unless the current pinned path cannot execute on the local proof machine.

## Run the Current Shape GLB

Pass the exact `shape.glb` that already passed the Shape GLB Gate.

```bash
./run_poc.sh /mnt/c/path/to/workspace/active/<asset>/3d-assisted/shape.glb <run-id>
```

`TARGET_LONGEST` remains a POC preview scale only. It is not requested production dimensions and must never become numeric authority.

## Gate A — PrimitiveAnything Assembly

Inspect the upstream mixed primitive assembly:

```text
runs/<run>/pa/output_<input-name>.glb
```

PASS requires useful primary-mass separation for the selected subject:

- recognizable overall identity;
- required major parts remain distinguishable;
- bends/orientations remain useful;
- material attachment relationships are not collapsed;
- important negative spaces are not destroyed;
- fragmentation is useful rather than arbitrary.

If this gate materially fails, **STOP**. Do not tune the downstream Cuboid converter or Runtime materializer to compensate for a bad learned decomposition.

## Gate B — Deterministic Cuboid Parameters

The converter maps predicted primitive translation/rotation/scale plus canonical primitive local bounds into oriented Cuboid parameters.

It does not:

- identify body parts;
- infer semantic hierarchy;
- optimize boxes against the source mesh;
- merge/split based on anatomy;
- voxelize;
- ask an LLM for coordinates;
- correct the subject;
- write production Blockbench state.

Existing POC outputs may include:

```text
runs/<run>/cuboid/<id>.cuboids.json
runs/<run>/cuboid/<id>.cuboid-preview.glb
runs/<run>/cuboid/<id>.geo.json
runs/<run>/cuboid/<id>.summary.json
```

For the production target, the thin external orchestrator must normalize the accepted deterministic Cuboid description into canonical:

```text
workspace/active/<asset>/3d-assisted/primitive-decomposition.json
```

The canonical file must carry enough deterministic information for the Runtime materializer to reproduce one native oriented Cube scaffold per accepted primitive, plus schema/version/hash provenance. It must not carry arbitrary Blockbench commands or executable payloads.

## Primitive Decomposition Gate

PASS only when the accepted decomposition remains useful after Cuboid substitution.

```text
PrimitiveAnything assembly materially bad
→ BLOCKED at PrimitiveAnything

assembly PASS but Cuboid substitution materially bad
→ BLOCKED at deterministic conversion

both PASS
→ persist primitive-decomposition.json + state hash
→ Runtime materializer becomes the next owner
```

Do not blind-rerun PrimitiveAnything to chase visual quality. A rerun requires a diagnosed technical incompleteness or new evidence.

## Production Materializer Boundary

The future production bridge is one dedicated **Geometry Runtime capability behind the existing four-tool Gateway**.

Target behavior:

```text
Active Workspace path only
→ validate 3D_ASSISTED strategy
→ validate state.json + primitive-decomposition.json + hashes/schema
→ full pre-validation before mutation
→ one atomic Undo transaction
→ one temporary pa_<id> Group/Bone + Cube per primitive
→ complete scaffold or no accepted scaffold state
```

The materializer must not accept arbitrary primitive arrays, generic path overrides outside the active workspace contract, generic UI import, or `from_geo_json`.

One Group/Bone per primitive is acceptable for the initial materialized scaffold because it preserves arbitrary primitive orientation. Semantic cleanup may merge/reparent/rename/remove/split/replace Cubes afterward based on the approved reference.

## What This POC Proves / Does Not Prove

Current scripts provide implementation evidence for:

- pinned PrimitiveAnything execution;
- mixed primitive output;
- deterministic primitive→Cuboid parameter conversion;
- preview/debug native-Cube feasibility.

They do **not** prove:

- production `primitive-decomposition.json` schema;
- Runtime atomic materialization;
- Undo/stale-hash behavior;
- final Minecraft/Blockbench quality;
- end-to-end `3D_ASSISTED` acceptance.

Those are the next local/Codex development gates in `docs/knowledge/next-action.md`.

## Non-Goals

Do not expand this stage into:

- provider selection;
- semantic bone inference;
- texture generation;
- animation;
- final cleanup automation;
- custom `.bbmodel` serializer;
- automatic fallback to `DIRECT`;
- benchmark/profile frameworks before one representative local end-to-end proof.
