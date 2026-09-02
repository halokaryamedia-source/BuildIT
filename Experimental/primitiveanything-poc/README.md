# PrimitiveAnything → Cuboid → Blockbench POC

Status:

```text
EXPERIMENTAL
SOURCE PREPARED
LOCAL PROOF REQUIRED
NOT PRODUCTION
```

This POC tests one specific Route 1 question:

> Can the already-approved Route 1 GLB be decomposed by PrimitiveAnything and then deterministically substituted into pure oriented Cuboids that Blockbench opens as native editable Cubes?

It does **not** use an LLM to choose Cube coordinates. It does **not** modify `mcp/**` and it does not promote any result into production BlockIT.

## Bounded flow

```text
approved reference image
→ existing approved Hunyuan GLB
→ stock PrimitiveAnything @ pinned commit
→ mixed primitive assembly
→ deterministic primitive-AABB substitution
→ pure oriented Cuboids
→ cuboid preview GLB
→ Bedrock geo.json
→ Blockbench native Groups + Cubes
→ Save Project As .bbmodel only after visual PASS
```

The original GLB remains the comparison authority. The generated `geo.json` is only a POC scaffold until visually accepted.

## Why WSL2

Use **WSL2 Ubuntu + NVIDIA CUDA** for the first proof. PrimitiveAnything's official demo is CUDA-oriented and depends on PyTorch3D, Open3D, `mesh2sdf`, and other Linux-friendly packages. Do not spend the first experiment debugging a native-Windows build.

Required before setup:

- Windows with WSL2 Ubuntu
- NVIDIA driver with WSL CUDA support (`nvidia-smi` must work inside WSL for the actual run)
- `git`
- Miniconda or Miniforge installed inside WSL
- enough disk for the Python environment plus roughly 5 GB of model checkpoints and supporting data

No official minimum VRAM is claimed by this POC. If the stock model cannot run on the local GPU, classify that as `ENVIRONMENT / INSTALL`, not as a geometry failure.

## 1. Setup once

From the BuildIT `Local` checkout:

```bash
cd Experimental/primitiveanything-poc
chmod +x setup_wsl.sh run_poc.sh
./setup_wsl.sh
```

The setup script:

1. clones PrimitiveAnything into ignored `.cache/PrimitiveAnything`;
2. checks out exact source commit `50586e55702cc91a81f205c3e1ea78853ce318b1`;
3. creates Conda environment `blockit-pa-poc` with Python 3.9;
4. installs PyTorch `2.1.0`, torchvision `0.16.0`, and CUDA `11.8` through Conda;
5. installs PyTorch3D `0.7.8` from the official `pytorch3d` Conda channel (upstream tag `V0.7.8` points to `75ebeeaea0908c5527e7b1e305fbc7681382db47` and supports PyTorch 2.1–2.4);
6. downloads only the required PrimitiveAnything canonical primitive data;
7. downloads and SHA-256 verifies both required checkpoints.

Pinned external data:

```text
PrimitiveAnything source:
50586e55702cc91a81f205c3e1ea78853ce318b1

PrimitiveAnything dataset:
59606099595f9293fe5c8d05a4779ab95ac7bb69

PrimitiveAnything model repo revision:
7abafab148bd53d7c8e1f2710b66e2abf93c3ee0
mesh-transformer.ckpt.60.pt SHA-256:
140341166b40f2038ec20933512f2e00401299d581e7b2549c0068195b616c5a

Michelangelo revision:
1ef441fa3ad93b4606ab60eaa8826916b27247ff
shapevae-256.ckpt SHA-256:
0391b81c36240e8f766fedf4265df599884193a5ef65354525074b9a00887454
```

## 2. Run the approved elephant GLB

Pass the exact GLB that already passed Route 1 GLB-reference selection. A Windows file is accessible from WSL through `/mnt/<drive>/...`.

Example:

```bash
./run_poc.sh /mnt/c/Users/<you>/Desktop/elephant.glb elephant-test
```

The script first runs **stock PrimitiveAnything**. Only after its JSON exists does the deterministic Cuboid converter run.

`TARGET_LONGEST` controls POC display scale only and is **not** a production dimension:

```bash
TARGET_LONGEST=48 ./run_poc.sh /path/to/elephant.glb elephant-test
```

The default is `32` Blockbench units. Do not treat this default as a user-approved final size.

## 3. Gate 0 — inspect PrimitiveAnything before Cuboid conversion

Open:

```text
runs/<run>/pa/output_<input-name>.glb
```

This is the upstream mixed primitive assembly. It must already preserve the subject's major decomposition.

For the elephant, require at minimum:

- recognizable elephant silhouette;
- body and head separated sensibly;
- four leg volumes remain distinguishable;
- trunk is represented as a coherent form/segments;
- ears remain visible enough to preserve identity.

If Gate 0 fails materially, **STOP**. Do not tune the Cuboid converter to compensate for a bad learned decomposition.

## 4. Gate 1 — inspect the pure-Cuboid substitution

Open:

```text
runs/<run>/cuboid/<input-name>_pa_poc.cuboid-preview.glb
```

Every PrimitiveAnything `CubeBevel`, `SphereSharp`, and `CylinderSharp` has been replaced by the oriented bounding Cuboid of that primitive's **actual canonical PLY**, while keeping the predicted S/R/T placement.

The converter applies the same upstream axis conversion used by `demo.py`:

```text
x' =  x
y' =  z
z' = -y
```

There is no semantic guessing in this stage.

Gate 1 passes only when the all-Cuboid model is still recognizably the same elephant and does not collapse the key negative spaces or appendages.

If Gate 0 passes but Gate 1 fails, stop this substitution path. Only then is a separate cube-only decoding experiment justified.

## 5. Open native Cubes in Blockbench

Open:

```text
runs/<run>/cuboid/<input-name>_pa_poc.geo.json
```

Expected Blockbench state:

```text
Bedrock Entity project
root
├─ pa_000 [Group/bone]
│  └─ Cube
├─ pa_001 [Group/bone]
│  └─ Cube
└─ ...
```

There should be **no Mesh production elements**. One Group/bone per primitive is intentional for this POC because it preserves arbitrary PrimitiveAnything orientation without creating a custom `.bbmodel` serializer.

Compare the real Blockbench model from front, side, top, and isometric views against the approved GLB/reference. File existence is not a visual PASS.

If accepted:

```text
File → Save Project As → elephant-pa-poc.bbmodel
```

That `.bbmodel` is the first acceptable proof that the path reaches native editable Blockbench Cubes. Direct `.bbmodel` automation is deliberately deferred until the geometry itself passes; BuildIT already owns native project export and we do not need another production serializer just to test feasibility.

## Outputs

Each run stays under ignored `runs/`:

```text
runs/<run>/
├─ pa/
│  ├─ processed_<input>.glb
│  ├─ output_<input>.glb          # Gate 0
│  └─ output_<input>.json         # PrimitiveAnything S/R/T/type data
└─ cuboid/
   ├─ <id>.cuboids.json           # deterministic Cuboid parameters
   ├─ <id>.cuboid-preview.glb     # Gate 1
   ├─ <id>.geo.json               # native Blockbench/Bedrock Cube import
   └─ <id>.summary.json
```

Generated outputs and external weights are ignored and must not be committed to `Local`.

## Converter contract

Input authority:

```text
PrimitiveAnything output JSON
+ PrimitiveAnything canonical base primitive PLY files
```

For each predicted primitive:

```text
predicted translation
+ predicted rotation quaternion
+ predicted scale
+ canonical primitive local bounds
→ oriented Cuboid
```

The converter does not:

- identify body parts;
- merge or split primitives;
- optimize Cuboids against the source mesh;
- voxelize;
- fit new boxes;
- ask an LLM for coordinates;
- correct anatomy;
- modify BlockIT MCP.

Those exclusions are important: this experiment isolates whether **learned human-like primitive decomposition** provides the missing bridge.

## STOP conditions

```text
Gate 0 materially fails
→ STOP PrimitiveAnything path

Gate 0 passes, Gate 1 materially fails
→ STOP substitution path; cube-only decoding may be proposed separately

Gate 1 passes but Blockbench import is not native Cubes
→ converter/export mapping defect; fix only that mapping

Gate 1 + native Cube import pass
→ save .bbmodel and report LOCAL proof before any MCP integration
```

Do not expand this POC into texture, animation, semantic bone inference, Cube cleanup, MCP integration, or production Route 1 changes before the elephant geometry passes.
