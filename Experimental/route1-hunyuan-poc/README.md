# Route 1 — Hunyuan3D 2.0 Mesh Evidence POC

Status:

```text
EXPERIMENTAL SOURCE FOUNDATION APPLIED
LOCAL HUNYUAN GPU PROOF REQUIRED
BUILDIT MCP UNCHANGED
NOT PRODUCTION
```

This experiment tests one claim only:

> Does a consistent Hunyuan3D 2.0 shape reconstruction provide useful 3D evidence that improves the primary Blockbench geometry authored through the existing BuildIT Geometry MCP?

It is not a mesh-to-Blockbench converter. The Hunyuan mesh is temporary evidence; the approved reference remains the visual authority.

## Boundary

```text
approved 3/4 reference crop
→ Hunyuan3D-DiT-v2-0, shape only
→ temporary source.glb
→ one FRONT / SIDE / TOP / ISOMETRIC contact sheet
→ mesh usefulness gate
→ existing BuildIT Geometry MCP only if the gate passes
```

No production MCP tool, authoring phase, geometry compiler, semantic mesh segmentation, IoU gate, provider router, texture generation, or autonomous correction is added by this POC.

## Pinned upstream

The first local proof uses:

```text
Hunyuan3D-2 source:
Tencent-Hunyuan/Hunyuan3D-2
commit f8db63096c8282cb27354314d896feba5ba6ff8a

Hugging Face model:
tencent/Hunyuan3D-2
revision 9cd649ba6913f7a852e3286bad86bfa9a2d83dcf
subfolder hunyuan3d-dit-v2-0
variant fp16
```

The source repository's `from_pretrained` helper does not expose a Hugging Face `revision` parameter to its internal snapshot download. For reproducibility, download the pinned model snapshot locally first and point `HY3DGEN_MODELS` at that local root.

## Baseline settings

Keep the first proof fixed:

```text
model              Hunyuan3D-DiT-v2-0
variant            fp16
inference steps    50
octree resolution  256
num chunks         20000
seed               12345
texture            disabled
multiview          disabled
```

Do not tune Fast/Turbo, octree 380+, multiple seeds, or multiview until runtime evidence identifies a specific bottleneck.

## Local setup

The GPU proof belongs on the local RTX machine, not GitHub CI.

Clone the exact Hunyuan source revision and install only the normal repository requirements plus the package. The texture rasterizer build steps are not required for this shape-only experiment.

```bash
git clone https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git
cd Hunyuan3D-2
git checkout f8db63096c8282cb27354314d896feba5ba6ff8a

# Install the appropriate CUDA-enabled PyTorch build for the local machine first.
pip install -r requirements.txt
pip install -e .
```

Download only the pinned shape subfolder into a local model root:

```python
from pathlib import Path
from huggingface_hub import snapshot_download

models_root = Path(r"C:\BuildITModels")
snapshot_download(
    repo_id="tencent/Hunyuan3D-2",
    revision="9cd649ba6913f7a852e3286bad86bfa9a2d83dcf",
    allow_patterns=[
        "hunyuan3d-dit-v2-0/config.yaml",
        "hunyuan3d-dit-v2-0/model.fp16.safetensors",
    ],
    local_dir=models_root / "tencent" / "Hunyuan3D-2",
)
```

On PowerShell:

```powershell
$env:HY3DGEN_MODELS="C:\BuildITModels"
```

`generate_shape.py` fails closed when this pinned local model is absent rather than silently downloading an unpinned revision.

## Run

Provide a clean approved single 3/4 crop, not the whole five-panel board.

```bash
python Experimental/route1-hunyuan-poc/generate_shape.py path/to/approved-3q.png
python Experimental/route1-hunyuan-poc/render_contact_sheet.py \
  Experimental/route1-hunyuan-poc/.cache/source.glb \
  --front-direction=-z
```

Transient outputs stay under `.cache/`:

```text
source.glb
contact-sheet.png
```

## Gate 1 — Mesh usefulness

Inspect the actual approved reference and the fresh contact sheet together.

Continue only when the mesh preserves the material evidence needed for modelling:

1. identity and primary part count;
2. major volume and depth;
3. appendage placement;
4. attachment relationships;
5. a plausible hidden-side interpretation without identity-changing hallucination.

A clean file export, high polygon count, or attractive mesh render is not a pass.

If the mesh fails materially, stop before Blockbench and classify the first wrong owner as input preparation or Hunyuan reconstruction.

## Handoff to existing BuildIT

Only after Gate 1 passes:

```text
actual approved reference
+ fresh Hunyuan contact sheet
+ approved dimensions / handoff constraints
→ existing Geometry phase
→ primary Groups/Cubes only
→ one capture_model_views verification
→ one causal local correction OR one primary rebuild
→ verify
```

The Hunyuan contact sheet is geometry/depth evidence. It never outranks the approved reference and does not create visual `PASS`.

## Promotion boundary

Do not promote this experiment after source/static proof. Required next evidence is a real local Hunyuan run and visual inspection of the resulting contact sheet. Production integration is considered only after representative asset authoring shows a lower Cost to Accepted Result.

## License boundary

Hunyuan3D 2.0 is governed by Tencent's Hunyuan community license. This experiment does not vendor Hunyuan source or model weights into BuildIT. Any later distribution or product integration requires a separate license review.
