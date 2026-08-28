# Route 1 — Hunyuan3D Mesh Evidence POC

Status:

```text
EXPERIMENTAL SOURCE FOUNDATION APPLIED
ROUTE 1 GATE 1 PASS
PREFERRED MULTIVIEW EXECUTABLE TRACKED
GEOMETRY EVIDENCE BRIDGE STATIC SOURCE APPLIED
LIVE BLOCKBENCH BRIDGE PROOF PENDING
NOT PRODUCTION
```

This experiment tests one claim:

> Does a consistent Hunyuan3D shape reconstruction provide useful 3D evidence that improves the primary Blockbench geometry authored through BuildIT Geometry MCP?

The Hunyuan mesh is temporary supporting evidence. It is **not** a mesh-to-Blockbench converter, and the approved Minecraft reference plus requested dimensions remain visual/size authority.

## Current bounded path

```text
separated FRONT + SIDE + BACK crops
→ Hunyuan3D-2mv shape-only generation
→ temporary source-multiview-separated.glb
→ FRONT / SIDE / TOP / ISOMETRIC contact sheet
→ Gate 1 mesh usefulness PASS
→ BuildIT manage_geometry_reference
→ transient 3D reference + quantitative evidence
→ normal semantic Groups/Cubes
→ remove transient reference before production .bbmodel export
```

The bridge does not voxelize, segment, repair, decimate, score, or convert Hunyuan triangles into Bedrock geometry. No semantic mesh parser, cuboid solver, IoU gate, provider router, texture generator, or autonomous correction is part of Route 1.

## Pinned upstream

Source checkout:

```text
Tencent-Hunyuan/Hunyuan3D-2
commit f8db63096c8282cb27354314d896feba5ba6ff8a
```

SingleView baseline model:

```text
repo_id    tencent/Hunyuan3D-2
revision   9cd649ba6913f7a852e3286bad86bfa9a2d83dcf
subfolder  hunyuan3d-dit-v2-0
variant    fp16
```

Preferred MultiView model:

```text
repo_id    tencent/Hunyuan3D-2mv
revision   3a761b539b29fe4ff64714813aa9560fd66f5de0
subfolder  hunyuan3d-dit-v2-mv
variant    fp16
```

The upstream `from_pretrained` helper does not expose a Hugging Face `revision` parameter to its internal download path. Therefore Route 1 requires the pinned model snapshot to be downloaded locally first and `HY3DGEN_MODELS` to point at that local root. Both generation scripts fail before pipeline construction when the required local files are absent.

## Fixed settings

```text
variant            fp16
inference steps    50
octree resolution  256
num chunks         20000
seed               12345
texture            disabled
```

Do not tune Fast/Turbo, octree 380+, multiple seeds, extra views, cleanup passes, or texture generation without new runtime evidence identifying a specific bottleneck.

## Local setup

The GPU proof belongs on the local CUDA machine, not GitHub CI.

```bash
git clone https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git
cd Hunyuan3D-2
git checkout f8db63096c8282cb27354314d896feba5ba6ff8a

# Install the appropriate CUDA-enabled PyTorch build first.
pip install -r requirements.txt
pip install -e .
```

Download the pinned model subfolders into a local root. The examples below keep them under the Route 1 `.cache/models` directory.

```python
from pathlib import Path
from huggingface_hub import snapshot_download

models_root = Path(r"D:\Work\AI Stuff\BuildIT\Experimental\route1-hunyuan-poc\.cache\models")

snapshot_download(
    repo_id="tencent/Hunyuan3D-2",
    revision="9cd649ba6913f7a852e3286bad86bfa9a2d83dcf",
    allow_patterns=[
        "hunyuan3d-dit-v2-0/config.yaml",
        "hunyuan3d-dit-v2-0/model.fp16.safetensors",
    ],
    local_dir=models_root / "tencent" / "Hunyuan3D-2",
)

snapshot_download(
    repo_id="tencent/Hunyuan3D-2mv",
    revision="3a761b539b29fe4ff64714813aa9560fd66f5de0",
    allow_patterns=[
        "hunyuan3d-dit-v2-mv/config.yaml",
        "hunyuan3d-dit-v2-mv/model.fp16.safetensors",
    ],
    local_dir=models_root / "tencent" / "Hunyuan3D-2mv",
)
```

PowerShell example:

```powershell
$env:HY3DGEN_MODELS="D:\Work\AI Stuff\BuildIT\Experimental\route1-hunyuan-poc\.cache\models"
```

The local experiment environment may stay under `Experimental/route1-hunyuan-poc/.cache/venv`. Model weights, generated meshes, and contact sheets remain transient `.cache/` data.

## Generate the preferred MultiView mesh

Use the separated transparent-background views only. The approved SIDE crop is mapped to Hunyuan's `left` view, matching the upstream pinned MultiView API.

```text
input/separated-reference/front.png → front
input/separated-reference/side.png  → left
input/separated-reference/back.png   → back
```

Canonical command:

```bash
python Experimental/route1-hunyuan-poc/generate_multiview_shape.py \
  Experimental/route1-hunyuan-poc/input/separated-reference/front.png \
  Experimental/route1-hunyuan-poc/input/separated-reference/side.png \
  Experimental/route1-hunyuan-poc/input/separated-reference/back.png
```

Default output:

```text
Experimental/route1-hunyuan-poc/.cache/source-multiview-separated.glb
```

The executable is intentionally fixed to FRONT + LEFT + BACK. It does not silently add a right view or tune generation parameters. Its expected Blockbench/front convention is `+z`.

Render the contact sheet:

```bash
python Experimental/route1-hunyuan-poc/render_contact_sheet.py \
  Experimental/route1-hunyuan-poc/.cache/source-multiview-separated.glb \
  --front-direction=+z \
  --output Experimental/route1-hunyuan-poc/.cache/contact-sheet-multiview-separated.png
```

## SingleView baseline

The original one-image baseline remains executable for A/B research only:

```bash
python Experimental/route1-hunyuan-poc/generate_shape.py path/to/approved-3q.png
python Experimental/route1-hunyuan-poc/render_contact_sheet.py \
  Experimental/route1-hunyuan-poc/.cache/source.glb \
  --front-direction=-z
```

Do not replace the approved MultiView evidence with this baseline without a new reason.

## Gate 1 — Mesh usefulness (PASS)

Gate 1 uses the actual approved Minecraft reference and the fresh Hunyuan contact sheet together. The accepted separated MultiView reconstruction preserves:

1. identity and primary part count;
2. major volume/depth;
3. appendage placement;
4. attachment relationships;
5. plausible hidden-side interpretation without identity-changing hallucination.

A successful export, attractive render, or high polygon count is not enough. Any materially failing future generation must stop before Blockbench and classify input preparation versus Hunyuan reconstruction.

## Geometry Evidence Bridge

After Gate 1, the approved GLB can be loaded through the experimental Geometry-owned `manage_geometry_reference` tool.

BuildIT keeps the GLB as a locked, root-only, `export=false` Reference Model. It reports raw world-space AABB, dimensions in Blockbench units/blocks, and mesh/vertex/triangle diagnostics. These numbers are **evidence only**: raw Hunyuan bounds can include disconnected reconstruction fragments and never become requested target dimensions.

The existing `reference_models://...` resource exposes the same Route 1 evidence and recovered front alignment after a fresh MCP/Codex connection. `capture_model_views` can use explicit target framing before Cubes exist when a loaded Route 1 reference is visible.

Production geometry remains normal Groups/Cubes. Editable `.bbmodel` export is blocked while a tool-owned Route 1 reference remains active; remove the reference before production export.

## Remaining proof boundary

Static source/CI can prove schemas, source ownership, buildability, generated-doc freshness, evidence fields, and fail-closed contracts. It cannot prove the installed desktop plugin actually renders the approved GLB correctly or that the resulting Cube authoring is visually better.

The next eventual live proof is:

```text
fresh exact Local build
→ Geometry registry contains manage_geometry_reference
→ approved elephant GLB loads as 3D Reference Model
→ quantitative resource/tool evidence matches the loaded reference
→ explicit canonical GLB views work before Cube blockout
→ normal Groups/Cubes share the intended coordinate frame
→ transient reference is removed
→ production .bbmodel contains no reference_model
```

Only after that technical bridge passes should Route 1 be compared against image-only authoring on accepted visual quality, depth/attachment accuracy, corrections/rebuilds, and Cost to Accepted Result.

## License boundary

Hunyuan3D is governed by Tencent's Hunyuan license. This experiment does not vendor Hunyuan source or model weights into BuildIT. Any later distribution or product integration requires a separate license review.
