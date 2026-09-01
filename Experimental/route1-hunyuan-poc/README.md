# Route 1 — Hunyuan3D Mesh Evidence POC

Status:

```text
EXPERIMENTAL SOURCE FOUNDATION APPLIED
ROUTE 1 GATE 1 PASS
PREFERRED MULTIVIEW EXECUTABLE TRACKED
GEOMETRY EVIDENCE BRIDGE STATIC SOURCE APPLIED
REFERENCE ALIGNMENT PURE FOUNDATION TRACKED
GENERIC FIXTURE PREPARATION TRACKED
LIVE BLOCKBENCH ALIGNMENT/BRIDGE PROOF PENDING
NOT PRODUCTION
```

This experiment tests one claim:

> Does a consistent Hunyuan3D shape reconstruction provide useful 3D evidence that improves the primary Blockbench geometry authored through BuildIT Geometry MCP?

The Hunyuan mesh is temporary supporting evidence. It is **not** a mesh-to-Blockbench converter, and the approved Minecraft reference plus requested dimensions remain visual/size authority. Any representative fixture is sample evidence only; it must never become an object-specific modelling rule.

## Current bounded path

```text
separated FRONT + SIDE + BACK crops
→ Hunyuan3D-2mv shape-only generation
→ temporary approved-shape GLB
→ FRONT / SIDE / TOP / ISOMETRIC contact sheet
→ Gate 1 mesh usefulness PASS
→ generic fixture preparation/package
→ BuildIT manage_geometry_reference canonical load
→ read raw reference bounds
→ uniform fit-envelope scale from requested Minecraft dimensions
→ read fresh scaled bounds
→ center X/Z + ground Y translation
→ canonical aligned reference captures
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

The upstream `from_pretrained` helper does not expose a Hugging Face `revision` parameter to its internal download path. Route 1 therefore requires the pinned model snapshot to be downloaded locally first and `HY3DGEN_MODELS` to point at that local root. Both generation scripts fail before pipeline construction when required local files are absent.

## Fixed settings

```text
variant            fp16
inference steps    50
guidance scale     5.0
octree resolution  256
num chunks         20000
seed               12345
texture            disabled
```

`guidance scale = 5.0` is explicit in both scripts so the accepted Route 1 path does not depend on an implicit upstream FlowMatching default.

Do not tune Fast/Turbo, octree 380+, multiple seeds, extra views, cleanup passes, or texture generation without new runtime evidence identifying a specific bottleneck.

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

Download the pinned model subfolders into a local root. Model weights stay local/transient and are not part of a Route 1 package.

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

The local experiment environment may stay under `Experimental/route1-hunyuan-poc/.cache/venv`.

## Generate the preferred MultiView mesh

Use the separated transparent-background views only. The approved SIDE crop maps to Hunyuan's `left` view, matching the pinned MultiView API.

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

`fixture.json` records only generic evidence/provenance fields:

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
bun run route1:prepare <fixture-directory>
bun run route1:package <fixture-directory>
```

`route1:prepare` is read-only. It verifies the strict fixture contract, portable in-root file paths, non-empty inputs, GLB 2.0 header/length, SHA-256 hashes, pinned Hunyuan provenance, and the canonical `mcp/dist/blockit_mcp.js` embedded build identity.

`route1:package` performs the same preflight and creates a portable preparation package. Default output:

```text
Experimental/route1-hunyuan-poc/.cache/test-ready/<fixture_id>/
```

The package contains the exact BlockIT artifact, `fixture.json`, approved reference, approved GLB, contact sheet, FRONT/LEFT/BACK Hunyuan inputs, `manifest.json`, and `RUN.md`. Existing outputs are never silently overwritten. The manifest records each file hash/size plus the BlockIT embedded build identity and full bundle SHA-256. `repository_head_at_prepare` is context only; artifact identity comes from the packaged bundle itself.

These commands are Bun preparation utilities, **not MCP callable tools**. They do not expand the callable catalog or Geometry surface.

## SingleView baseline

The original one-image baseline remains executable for A/B research only:

```bash
python Experimental/route1-hunyuan-poc/generate_shape.py path/to/approved-3q.png
python Experimental/route1-hunyuan-poc/render_contact_sheet.py \
  Experimental/route1-hunyuan-poc/.cache/source.glb \
  --front-direction=-z
```

Do not replace approved MultiView evidence with this baseline without a new reason.

## Gate 1 — Mesh usefulness (PASS)

Gate 1 uses the actual approved Minecraft reference and fresh Hunyuan contact sheet together. A useful reconstruction preserves identity/primary part count, major volume/depth, appendage placement, attachment relationships, and a plausible hidden-side interpretation without identity-changing hallucination.

A successful export, attractive render, or high polygon count is not enough. Any materially failing future generation must stop before Blockbench and classify input preparation versus Hunyuan reconstruction.

## Geometry Evidence Bridge

After Gate 1, the approved GLB can be loaded through the experimental Geometry-owned `manage_geometry_reference` tool.

BuildIT keeps the GLB as a locked, root-only, `export=false` Reference Model. It reports raw world-space AABB, dimensions in Blockbench units/blocks, and mesh/vertex/triangle diagnostics. These numbers are evidence only: **raw Hunyuan bounds** may include reconstruction fragments and never become **requested target dimensions**.

The existing `reference_models://...` resource exposes the same Route 1 evidence and recovered front alignment after a fresh MCP/Codex connection. `capture_model_views` can use explicit target framing before Cubes exist when a loaded invariant-valid Route 1 reference is visible.

Production geometry remains normal Groups/Cubes. Editable `.bbmodel` export is blocked while a tool-owned Route 1 reference remains active; remove the reference before production export.

## Reference alignment contract — pre-live foundation

The GLB is normalized reconstruction evidence, not a physical-size authority. Route 1 therefore aligns the displayed reference to the **requested Minecraft dimensions** without editing the GLB file and without non-uniform deformation.

The pure planning owner is:

```text
mcp/lib/route1ReferenceAlignment.ts
```

with targeted regression contract:

```text
mcp/tests/route1-reference-alignment.test.ts
```

The intended live sequence deliberately uses the existing `manage_geometry_reference` primitives and fresh evidence between transform stages:

```text
1. load canonical GLB reference
   origin=[0,0,0]
   uniform_scale=1
   source_front_direction from fixture

2. read current raw world bounds

3. plan one uniform FIT_ENVELOPE multiplier
   target units = requested_dimensions_blocks × Format.block_size
   multiplier = min(
     target_width_units  / observed_width_units,
     target_height_units / observed_height_units,
     target_length_units / observed_length_units
   )

4. update uniform_scale only

5. read fresh post-scale world bounds

6. plan translation only
   center X → requested target center X
   min Y    → requested ground Y
   center Z → requested target center Z

7. update origin only

8. read fresh aligned evidence + canonical captures

9. author normal semantic Groups/Cubes
```

Why scale and translation are separate:

- Reference Model scale/pivot behavior must be observed live rather than inferred from static source alone.
- A fresh post-scale measurement prevents a large one-shot transform formula from encoding an unproven pivot assumption.
- The second step is pure translation, which is easy to verify from observed world bounds.

The default live proof anchor is `center X=0`, `ground Y=0`, `center Z=0` unless the approved fixture explicitly requires another target anchor. That anchor is a test convention, not a universal modelling rule.

### Alignment invariants

```text
requested dimensions = numeric authority
approved image        = visual authority
GLB bounds            = observation only

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

Do not add multiple alignment modes, a one-call auto-align API, or new public ToolSpec fields before the live sequence above proves the Blockbench behavior and demonstrates repeated workflow value. If the same sequence is stable across representative fixtures, local implementation may later consolidate it behind the existing Geometry reference owner rather than adding another tool family.

## Remaining proof boundary

Static source/CI can prove schemas, preparation contracts, hashes, source ownership, buildability, generated-doc freshness, evidence fields, pure alignment math, and fail-closed contracts. It cannot prove the installed desktop plugin actually renders a representative approved GLB correctly, that Reference Model scale/origin behavior matches the intended live sequence, or that Cube authoring becomes visually better.

The next live proof is now explicitly reactivated:

```text
prepare/package an approved representative fixture
→ load packaged exact BlockIT artifact
→ Geometry registry contains manage_geometry_reference
→ approved representative GLB loads as 3D Reference Model
→ quantitative resource/tool evidence matches the loaded reference
→ apply planned uniform fit-envelope scale
→ read fresh scaled bounds
→ apply center X/Z + ground Y translation
→ aligned evidence matches requested envelope/anchor policy
→ explicit canonical GLB views work before Cube blockout
→ normal Groups/Cubes share the intended coordinate frame
→ transient reference is removed
→ production .bbmodel contains no reference_model
```

Only after that technical bridge passes should Route 1 be compared against image-only authoring on accepted visual quality, depth/attachment accuracy, corrections/rebuilds, and Cost to Accepted Result.

## License boundary

Hunyuan3D is governed by Tencent's Hunyuan license. This experiment does not vendor Hunyuan source or model weights into BuildIT. Any later distribution or product integration requires a separate license review.
