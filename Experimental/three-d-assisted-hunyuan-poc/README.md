# 3D-Assisted — Hunyuan3D Mesh Evidence

Status:

```text
IMAGE + GLB SELECTED WORKFLOW LOCKED
EXPERIMENTAL SOURCE FOUNDATION APPLIED
3D-ASSISTED GATE 1 PASS
PREFERRED MULTIVIEW EXECUTABLE TRACKED
GEOMETRY EVIDENCE BRIDGE STATIC SOURCE APPLIED
REFERENCE ALIGNMENT PURE FOUNDATION TRACKED
GENERIC FIXTURE PREPARATION TRACKED
LOCAL BLOCKBENCH ALIGNMENT/BRIDGE TEST REQUIRED
NOT YET LIVE-PROVEN
```

3D-Assisted now has a selected product path:

> **Approved image + requested dimensions + approved shape-only GLB** are used together for reference-driven Blockbench geometry authoring.

Image-only versus image+GLB is **not** a current A/B gate. The image remains visual authority, requested dimensions remain numeric authority, and the GLB supplies supporting depth/volume/attachment/hidden-side evidence.

The Hunyuan mesh is temporary supporting evidence. It is **not** a mesh-to-Blockbench converter. Any representative fixture is sample evidence only; it must never become an object-specific modelling rule.

## Selected bounded path

```text
approved Minecraft reference
→ separated FRONT + SIDE + BACK crops
→ Hunyuan3D-2mv shape-only generation
→ approved-shape.glb
→ FRONT / SIDE / TOP / ISOMETRIC contact sheet
→ Gate 1 mesh usefulness
→ generic fixture preparation/package
→ BuildIT manage_geometry_reference canonical load
→ read raw reference bounds
→ uniform FIT_ENVELOPE scale from requested Minecraft dimensions
→ read fresh post-scale bounds
→ center X/Z + ground Y translation
→ read fresh aligned evidence
→ canonical aligned reference captures
→ normal semantic Groups/Cubes
→ remove transient reference
→ production .bbmodel export
```

The bridge does not voxelize, segment, repair, decimate, score, or convert Hunyuan triangles into Bedrock geometry. No semantic mesh parser, cuboid solver, IoU gate, provider router, texture generator, or autonomous correction is part of 3D-Assisted.

---

## Pinned upstream

Source checkout:

```text
Tencent-Hunyuan/Hunyuan3D-2
commit f8db63096c8282cb27354314d896feba5ba6ff8a
```

SingleView historical baseline model:

```text
repo_id    tencent/Hunyuan3D-2
revision   9cd649ba6913f7a852e3286bad86bfa9a2d83dcf
subfolder  hunyuan3d-dit-v2-0
variant    fp16
```

Selected MultiView model:

```text
repo_id    tencent/Hunyuan3D-2mv
revision   3a761b539b29fe4ff64714813aa9560fd66f5de0
subfolder  hunyuan3d-dit-v2-mv
variant    fp16
```

The upstream `from_pretrained` helper does not expose a Hugging Face `revision` parameter to its internal download path. 3D-Assisted therefore requires the pinned model snapshot to be downloaded locally first and `HY3DGEN_MODELS` to point at that local root. Both generation scripts fail before pipeline construction when required local files are absent.

## Fixed generation settings

```text
variant            fp16
inference steps    50
guidance scale     5.0
octree resolution  256
num chunks         20000
seed               12345
texture            disabled
```

`guidance scale = 5.0` is explicit in both scripts so the accepted 3D-Assisted path does not depend on an implicit upstream FlowMatching default.

Do not tune Fast/Turbo, octree 380+, multiple seeds, extra views, cleanup passes, or texture generation without a new runtime failure identifying a specific bottleneck.

---

## Local Hunyuan setup

The GPU proof belongs on the local CUDA machine, not GitHub CI.

```bash
git clone https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git
cd Hunyuan3D-2
git checkout f8db63096c8282cb27354314d896feba5ba6ff8a

# Install the appropriate CUDA-enabled PyTorch build first.
pip install -r requirements.txt
pip install -e .
```

Download the pinned model subfolders into a local root. Model weights stay local/transient and are not part of a 3D-Assisted package.

```python
from pathlib import Path
from huggingface_hub import snapshot_download

models_root = Path(r"D:\Work\AI Stuff\BuildIT\Experimental\three-d-assisted-hunyuan-poc\.cache\models")

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
$env:HY3DGEN_MODELS="D:\Work\AI Stuff\BuildIT\Experimental\three-d-assisted-hunyuan-poc\.cache\models"
```

The local experiment environment may stay under `Experimental/three-d-assisted-hunyuan-poc/.cache/venv`.

---

## Generate the selected MultiView GLB

Use the separated transparent-background views only. The approved SIDE crop maps to Hunyuan's `left` view, matching the pinned MultiView API.

```text
input/separated-reference/front.png → front
input/separated-reference/side.png  → left
input/separated-reference/back.png   → back
```

Canonical command:

```bash
python Experimental/three-d-assisted-hunyuan-poc/generate_multiview_shape.py \
  Experimental/three-d-assisted-hunyuan-poc/input/separated-reference/front.png \
  Experimental/three-d-assisted-hunyuan-poc/input/separated-reference/side.png \
  Experimental/three-d-assisted-hunyuan-poc/input/separated-reference/back.png
```

Default output:

```text
Experimental/three-d-assisted-hunyuan-poc/.cache/source-multiview-separated.glb
```

The executable is intentionally fixed to FRONT + LEFT + BACK. It does not silently add a right view or tune generation parameters. Its expected Blockbench/front convention is `+z`.

Render the contact sheet:

```bash
python Experimental/three-d-assisted-hunyuan-poc/render_contact_sheet.py \
  Experimental/three-d-assisted-hunyuan-poc/.cache/source-multiview-separated.glb \
  --front-direction=+z \
  --output Experimental/three-d-assisted-hunyuan-poc/.cache/contact-sheet-multiview-separated.png
```

---

## Generic fixture preparation

The preparation contract is object-agnostic. A fixture identifies one approved representative asset; its ID, dimensions, or shape do not become reusable modelling heuristics.

Minimum portable fixture layout:

```text
<fixture>/
├── fixture.json
├── approved-reference.png
├── approved-shape.glb
├── contact-sheet.png
└── input/
    ├── front.png
    ├── left.png
    └── back.png
```

`fixture.json` records generic evidence/provenance fields:

```json
{
  "schema_version": 1,
  "fixture_id": "representative-asset",
  "approved_reference": "approved-reference.png",
  "approved_glb": "approved-shape.glb",
  "contact_sheet": "contact-sheet.png",
  "hunyuan_inputs": {
    "front": "input/front.png",
    "left": "input/left.png",
    "back": "input/back.png"
  },
  "source_front_direction": "+z",
  "requested_dimensions_blocks": {
    "width": 1,
    "height": 1,
    "length": 1
  },
  "hunyuan": {
    "pipeline": "hunyuan3d-2mv",
    "upstream_source_commit": "f8db63096c8282cb27354314d896feba5ba6ff8a",
    "model_id": "tencent/Hunyuan3D-2mv",
    "model_revision": "3a761b539b29fe4ff64714813aa9560fd66f5de0",
    "model_subfolder": "hunyuan3d-dit-v2-mv",
    "variant": "fp16",
    "views": ["front", "left", "back"],
    "inference_steps": 50,
    "guidance_scale": 5,
    "octree_resolution": 256,
    "num_chunks": 20000,
    "seed": 12345,
    "texture": false
  }
}
```

Use actual approved requested dimensions for each fixture; the `1 × 1 × 1` values above are schema examples only.

From `mcp/`:

```bash
bun run build
bun run three-d-assisted:prepare <fixture-directory>
bun run three-d-assisted:package <fixture-directory>
```

`three-d-assisted:prepare` is read-only. It verifies the strict fixture contract, portable in-root file paths, non-empty inputs, GLB 2.0 header/length, SHA-256 hashes, pinned Hunyuan provenance, and the canonical `mcp/dist/blockit_mcp.js` embedded build identity.

`three-d-assisted:package` performs the same preflight and creates a portable preparation package. Default output:

```text
Experimental/three-d-assisted-hunyuan-poc/.cache/test-ready/<fixture_id>/
```

The package contains the exact BlockIT artifact, `fixture.json`, approved reference, approved GLB, contact sheet, FRONT/LEFT/BACK Hunyuan inputs, `manifest.json`, and `RUN.md`. Existing outputs are never silently overwritten. The manifest records each file hash/size plus the BlockIT embedded build identity and full bundle SHA-256. `repository_head_at_prepare` is context only; artifact identity comes from the packaged bundle itself.

These commands are Bun preparation utilities, **not MCP callable tools**. They do not expand the callable catalog or Geometry surface.

---

## Historical SingleView baseline

The original one-image generator remains in the repository only for reproducibility/history:

```bash
python Experimental/three-d-assisted-hunyuan-poc/generate_shape.py path/to/approved-3q.png
```

It is **not** part of current 3D-Assisted acceptance and does not need to be rerun to justify the selected image+GLB workflow.

---

## Gate 1 — Mesh usefulness

Gate 1 uses the actual approved Minecraft reference and fresh Hunyuan contact sheet together. A usable reconstruction preserves identity/primary part count, major volume/depth, appendage placement, attachment relationships, and a plausible hidden-side interpretation without identity-changing hallucination.

A successful export, attractive render, or high polygon count is not enough. Any materially failing future generation must stop before Blockbench and classify input preparation versus Hunyuan reconstruction.

Gate 1 for the retained representative path is already recorded as PASS; local acceptance now focuses on the Blockbench bridge/alignment and final authoring workflow.

---

## Geometry Evidence Bridge

After Gate 1, the approved GLB is loaded through the Geometry-owned `manage_geometry_reference` tool.

BuildIT keeps the GLB as a locked, root-only, `export=false` Reference Model. It reports raw world-space AABB, dimensions in Blockbench units/blocks, and mesh/vertex/triangle diagnostics. These numbers are evidence only: **raw Hunyuan bounds** may include reconstruction fragments and never become **requested target dimensions**.

The existing `reference_models://...` resource exposes the same 3D-Assisted evidence and recovered front alignment after a fresh MCP/client connection. `capture_model_views` can use explicit target framing before Cubes exist when a loaded invariant-valid 3D-Assisted reference is visible.

Production geometry remains normal Groups/Cubes. Editable `.bbmodel` export is blocked while a tool-owned 3D-Assisted reference remains active; remove the reference before production export.

---

## Reference alignment contract

The GLB is normalized reconstruction evidence, not a physical-size authority. 3D-Assisted aligns the displayed reference to the **requested Minecraft dimensions** without editing the GLB file and without non-uniform deformation.

Pure planning owner:

```text
mcp/lib/threeDAssistedReferenceAlignment.ts
```

Targeted regression contract:

```text
mcp/tests/threeDAssisted-reference-alignment.test.ts
```

Canonical sequence:

```text
1. manage_geometry_reference(load)
   path = approved-shape.glb
   source_front_direction = fixture value
   origin = [0,0,0]
   uniform_scale = 1

2. read current raw world bounds

3. plan one uniform FIT_ENVELOPE multiplier
   target units = requested_dimensions_blocks × Format.block_size
   multiplier = min(
     target_width_units  / observed_width_units,
     target_height_units / observed_height_units,
     target_length_units / observed_length_units
   )

4. manage_geometry_reference(update)
   uniform_scale = planned next_uniform_scale
   scale only

5. read FRESH post-scale world bounds

6. plan translation only
   center X → target center X
   min Y    → target ground Y
   center Z → target center Z

7. manage_geometry_reference(update)
   origin = planned next_origin
   origin only

8. read FRESH aligned evidence

9. capture FRONT / SIDE / TOP / ISOMETRIC

10. author normal semantic Groups/Cubes

11. remove transient reference

12. export production .bbmodel
```

Why scale and translation are separate:

- Reference Model scale/pivot behavior is verified from live observed bounds rather than assumed.
- Fresh post-scale measurement prevents a one-shot transform formula from encoding an incorrect pivot assumption.
- Translation is then an objective center/ground correction.

Default local-test anchor:

```text
center X = 0
ground Y = 0
center Z = 0
```

unless the approved fixture explicitly requires another target anchor.

### Alignment invariants

```text
requested dimensions = numeric authority
approved image        = visual authority
approved GLB          = supporting 3D evidence
raw GLB bounds        = observation only

uniform scale only
no X/Y/Z independent stretching
no pre-scaling or rewriting approved-shape.glb
no mesh repair/decimation added for alignment
no triangle → Cube conversion
no quality score as authority
```

A fit-envelope plan may leave unused space on one or two axes. That is expected. Axis coverage is evidence, not an instruction to stretch the GLB until every requested dimension matches.

The alignment planner returns objective values only:

```text
observed dimensions
requested dimensions
scale multiplier
next uniform scale
aligned dimensions
per-axis coverage ratio
limiting axis/axes
translation delta
next origin
expected translated bounds
```

Do not add multiple alignment modes, a one-call auto-align API, or new public ToolSpec fields merely to reduce call count. First test the selected sequence using the existing Geometry reference owner. A reproducible local failure may justify a targeted runtime correction; absent such failure, no further 3D-Assisted development is required.

---

## Local acceptance — test only

The design decision is complete. Local work is now:

```text
build/verify current Local
→ prepare/package one approved fixture
→ load exact BlockIT artifact
→ load approved GLB
→ verify raw evidence
→ apply planned uniform fit-envelope scale
→ read fresh scaled evidence
→ apply center X/Z + ground Y translation
→ read fresh aligned evidence
→ capture canonical GLB views
→ author semantic Group/Cube blockout with approved image visible
→ verify reference fidelity
→ remove GLB
→ export .bbmodel
→ verify no reference_model remains
```

Do **not** add an image-only A/B run after this. Do **not** redesign 3D-Assisted unless the selected path produces a reproducible failure with a clear wrong owner.

---

## Explicit non-goals

Do not add these without a new evidenced requirement:

```text
OBJ / PLY / STL 3D-Assisted inputs
non-uniform reference scaling
GLB pre-scaling/rewrite step
mesh repair / decimation pipeline
voxelizer
triangle-to-Cube conversion
semantic mesh parser
cuboid solver
IoU/scalar similarity gate
provider router
automatic texture generation
Reference Models fork
multiple alignment modes
new standalone alignment tool
image-only comparison gate
```

---

## License boundary

Hunyuan3D is governed by Tencent's Hunyuan license. This experiment does not vendor Hunyuan source or model weights into BuildIT. Any later distribution or product integration requires a separate license review.
