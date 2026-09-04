# 3D-Assisted — Hunyuan3D Shape Reconstruction

Status:

```text
SHAPE RECONSTRUCTION STAGE
EXPERIMENTAL SOURCE FOUNDATION APPLIED
PREFERRED MULTIVIEW EXECUTABLE TRACKED
PINNED HUNYUAN3D V1 IMPLEMENTATION
LOCAL ORCHESTRATOR PROOF REQUIRED
PRIMITIVEANYTHING HANDOFF REQUIRED
NOT END-TO-END PRODUCTION READY
```

This directory owns the **Shape Reconstruction** stage of `3D_ASSISTED`. It does not own the full authoring route and it does not directly author production Blockbench Cubes.

Canonical target:

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D-2mv shape-only generation
→ bounded Shape GLB Gate
→ workspace/active/<asset>/3d-assisted/shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ dedicated Runtime Cuboid Materialization
→ Semantic Geometry Cleanup
```

The approved image remains visual authority. Requested dimensions remain numeric authority. `shape.glb` is intermediate reconstructed shape only.

## Current Role

Hunyuan3D v1 is the single selected Shape Reconstruction implementation. Do **not** build a provider router/interface until a second real implementation is required.

This stage must not:

- author final Cube coordinates;
- replace PrimitiveAnything;
- become an image+GLB-direct-to-Cubes product route;
- infer the user's Geometry Strategy;
- stretch the result independently per axis;
- generate production textures;
- write a final `.bbmodel`.

`manage_geometry_reference` may later load the accepted `shape.glb` as **supporting comparison evidence** during Semantic Geometry Cleanup. It is not the conversion path and the reference must be removed before final Geometry review/export.

## Pinned Upstream

Source checkout:

```text
Tencent-Hunyuan/Hunyuan3D-2
commit f8db63096c8282cb27354314d896feba5ba6ff8a
```

Selected MultiView model:

```text
repo_id    tencent/Hunyuan3D-2mv
revision   3a761b539b29fe4ff64714813aa9560fd66f5de0
subfolder  hunyuan3d-dit-v2-mv
variant    fp16
```

Historical SingleView baseline:

```text
repo_id    tencent/Hunyuan3D-2
revision   9cd649ba6913f7a852e3286bad86bfa9a2d83dcf
subfolder  hunyuan3d-dit-v2-0
variant    fp16
```

Model weights stay local/transient and are never committed.

## Fixed Generation Settings

```text
variant            fp16
inference steps    50
guidance scale     5.0
octree resolution  256
num chunks         20000
seed               12345
texture            disabled
```

Do not tune Fast/Turbo, larger octree values, multiple seeds, extra views, cleanup passes, or texture generation without a reproducible failure identifying a specific bottleneck.

## Local Hunyuan Setup

The GPU proof belongs on the local CUDA machine, not GitHub CI.

```bash
git clone https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git
cd Hunyuan3D-2
git checkout f8db63096c8282cb27354314d896feba5ba6ff8a

# Install the appropriate CUDA-enabled PyTorch build first.
pip install -r requirements.txt
pip install -e .
```

The pinned model snapshot must already exist locally. Point `HY3DGEN_MODELS` at that root.

PowerShell example:

```powershell
$env:HY3DGEN_MODELS="D:\Work\AI Stuff\BuildIT\Experimental\three-d-assisted-hunyuan-poc\.cache\models"
```

## MultiView Input Contract

Normal production orchestration must extract the canonical approved board deterministically into:

```text
front.png → Hunyuan front
left.png  → Hunyuan left
back.png  → Hunyuan back
```

The tracked executable remains:

```bash
python Experimental/three-d-assisted-hunyuan-poc/generate_multiview_shape.py \
  path/to/front.png \
  path/to/left.png \
  path/to/back.png
```

Tracked default experimental output:

```text
Experimental/three-d-assisted-hunyuan-poc/.cache/source-multiview-separated.glb
```

The external orchestrator will copy/persist an accepted gate result as canonical:

```text
workspace/active/<asset>/3d-assisted/shape.glb
```

## Shape GLB Gate

A usable result must preserve the current approved subject's:

- identity;
- primary masses and required major part count;
- attachment relationships;
- major pose/orientation;
- useful depth/volume;
- important negative spaces where visible/required;
- no identity-changing hallucination.

This gate does **not** judge final Minecraft/blocky styling.

```text
PASS
→ persist shape.glb
→ hand off to PrimitiveAnything

FAIL with one diagnosed reconstruction issue
→ maximum one targeted regeneration

second material failure without new evidence
→ BLOCKED
```

Successful export, polygon count, attractive render, or raw Hunyuan bounds do not create PASS.

## Contact-Sheet Debug Helper

For local inspection only:

```bash
python Experimental/three-d-assisted-hunyuan-poc/render_contact_sheet.py \
  path/to/shape.glb \
  --front-direction=+z \
  --output path/to/contact-sheet.png
```

Contact sheets are transient evidence and belong in `.cache/`.

## Production Persistence

Accepted pipeline state belongs under:

```text
workspace/active/<asset>/3d-assisted/
├─ state.json
├─ shape.glb
└─ primitive-decomposition.json
```

This Hunyuan stage owns only the reconstruction portion of `state.json`: current approved-reference hash, pinned implementation identity, generation/gate state, `shape.glb` hash, and last valid external resume point.

It must not duplicate stage approvals, Blockbench UUIDs, screenshots, tool transcripts, or conversation history.

## Current Local Next Step

Do **not** run the historical direct GLB→semantic-Cubes bridge as the product route.

The next implementation/proof is:

```text
thin external orchestrator
→ deterministic view extraction
→ invoke pinned Hunyuan MultiView
→ Shape GLB Gate
→ persist shape.glb + state
→ invoke PrimitiveAnything stage
```

Only after PrimitiveAnything produces an acceptable decomposition should the dedicated BlockIT Geometry materializer be implemented/proven.

## Historical Evidence

Older image+GLB alignment/bridge experiments remain recoverable from Git history. They proved useful `manage_geometry_reference` behavior and alignment observations, but they are no longer the canonical 3D-Assisted product route.
