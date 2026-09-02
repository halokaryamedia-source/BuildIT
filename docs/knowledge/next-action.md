# Next Action

Updated: 2026-09-03 — generic image-reference main path established; PrimitiveAnything remains optional

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; complete capability contracts → `docs/knowledge/mcp-capability-backlog.md`; proof → `docs/knowledge/current-validation.md`; source ownership → `docs/knowledge/implementation-map.md`; local procedure → `docs/knowledge/operations/local-acceptance-runbook.md`.

## Current Status

```text
MAIN: IMAGE_REFERENCE_SELECTED → GENERIC_REFERENCE_READY → LOCAL_IMPLEMENTATION_REQUIRED
OPTIONAL ROUTE 1: IMAGE_GLB_SELECTED → GLB_REFERENCE_LOADED → PRIMITIVEANYTHING_POC_PREPARED → LOCAL_POC_REQUIRED
MCP: BASE_EXTENDED_DESIGN_LOCKED → LOCAL_IMPLEMENTATION_REQUIRED
```

The Main Image-Reference Path is the default, object-agnostic route and does not require GLB, Hunyuan, PrimitiveAnything, Ubuntu, or CUDA. The Optional Route 1 POC remains isolated and must not block main-path implementation. Do not restart broad feature research while its current gate is unresolved.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. establish a clean verifier baseline
4. resolve the legacy registration-profile name collision with capability EXTENDED
5. prove how same-phase EXTENDED definitions are made reachable with the current client/transport before broad routing implementation
   → do not combine this with an SDK/transport migration unless current mechanics cannot satisfy the contract
6. Core/project lifecycle consolidation
7. Route 1 sample GLB load into Blockbench — completed
   → bounded PrimitiveAnything POC is prepared under Experimental/primitiveanything-poc
   → run local Gate 0 / Gate 1 proof before any Route 1 production Cube integration
8. Texturing consolidation
9. Animation consolidation
10. implement final BASE / EXTENDED exposure/reuse from the consolidated owners
11. regenerate prompts/docs, run `bun run verify:mcp`, measure final surfaces
12. deploy/reconnect and run representative BASE, EXTENDED, reuse, and cross-phase handoff fixtures
```

Route 1 exact alignment/test flow lives in `Experimental/route1-hunyuan-poc/README.md` and the local runbook. The new bounded external-solver experiment lives in `Experimental/primitiveanything-poc/README.md`. Alignment math is already prepared in `mcp/lib/route1ReferenceAlignment.ts` with `mcp/tests/route1-reference-alignment.test.ts`.

## Local Handoff — PrimitiveAnything Cuboid POC

```text
FROM_CONTEXT: REMOTE_GITHUB
TO_CONTEXT: LOCAL_CODE
repository: halokaryamedia-source/BuildIT
branch/ref: Local
POC source commit: abfe4a63af35c6de00d502094084527538ef9428
status: SOURCE PREPARED / LOCAL PROOF REQUIRED
```

### Goal

Prove or reject one specific Route 1 bridge:

```text
approved elephant GLB
→ stock PrimitiveAnything learned primitive decomposition
→ deterministic all-Cuboid substitution
→ native Blockbench Cubes
→ .bbmodel only after visual PASS
```

The target is **not** to make the final production elephant yet. The target is to answer whether this method produces a materially better, recognizable Cube scaffold from the already-approved GLB without LLM coordinate guessing.

### Success metric

The experiment passes only when all of the following are true:

1. PrimitiveAnything stock output still clearly reads as the same elephant.
2. The all-Cuboid substitution still preserves the elephant identity and major negative spaces.
3. Four leg volumes remain distinguishable.
4. Head, ears, trunk, and body remain readable enough to guide Minecraft modelling.
5. The generated Bedrock geometry opens in Blockbench as **native editable Cubes/Groups**, not Mesh production geometry.
6. Front, side, top, and isometric visual inspection is acceptable against the approved GLB/reference.
7. Only after that visual PASS is a `.bbmodel` saved as proof.

A clean script exit, valid JSON, valid GLB, or successful Blockbench import alone is **not** a visual PASS.

### Forbidden proxy / non-goal

Do not treat any of these as success:

```text
file exists
script returns 0
geo.json parses
Blockbench opens the project
cuboid count is small
bounds approximately match
```

Do not expand into:

```text
MCP integration
texture
animation
semantic bone inference
manual Cube cleanup
new voxel/visual-hull experiments
CoACD/OBB retry
LLM semantic coordinate guessing
new Route 1 formats
```

until Gate 0 and Gate 1 pass.

### Exact local procedure

Use **WSL2 Ubuntu + NVIDIA CUDA** for the first proof. Do not spend the first attempt debugging a native-Windows PrimitiveAnything installation.

From the BuildIT checkout:

```bash
git switch Local
git pull --ff-only
cd Experimental/primitiveanything-poc
chmod +x setup_wsl.sh run_poc.sh
./setup_wsl.sh
```

Before running inference, confirm inside WSL:

```bash
nvidia-smi
```

Then run the **same approved elephant GLB that already passed Route 1 GLB selection**:

```bash
./run_poc.sh /mnt/c/path/to/approved-elephant.glb elephant-test
```

Optional POC display envelope only:

```bash
TARGET_LONGEST=48 ./run_poc.sh /mnt/c/path/to/approved-elephant.glb elephant-test
```

`TARGET_LONGEST` is not a production dimension and must not replace user-approved target dimensions.

### Gate 0 — stock PrimitiveAnything

Open:

```text
Experimental/primitiveanything-poc/
runs/elephant-test/pa/output_<input-name>.glb
```

Inspect whether the learned primitive decomposition itself preserves:

```text
body
head
four distinct leg volumes
ears
trunk / trunk segments
overall elephant silhouette
```

Decision:

```text
Gate 0 materially fails
→ STOP PrimitiveAnything path
→ do not tune the Cuboid converter to compensate
```

### Gate 1 — deterministic all-Cuboid substitution

If Gate 0 passes, open:

```text
Experimental/primitiveanything-poc/
runs/elephant-test/cuboid/<input-name>_pa_poc.cuboid-preview.glb
```

Every PrimitiveAnything primitive is replaced by the oriented bounding Cuboid of its actual canonical primitive PLY while preserving predicted position, scale, and orientation. This stage must not identify body parts, fit new geometry, voxelize, or ask an LLM for coordinates.

Decision:

```text
Gate 0 passes + Gate 1 materially fails
→ STOP all-Cuboid substitution path
→ only then may cube-only constrained decoding be proposed as a separate experiment
```

### Native Blockbench proof

If Gate 1 passes, open:

```text
Experimental/primitiveanything-poc/
runs/elephant-test/cuboid/<input-name>_pa_poc.geo.json
```

Expected structure:

```text
root
├─ pa_000 [Group/bone]
│  └─ Cube
├─ pa_001 [Group/bone]
│  └─ Cube
└─ ...
```

There should be no production Mesh elements.

Inspect real Blockbench views:

```text
Front
Side
Top
Isometric
```

If visually accepted:

```text
File → Save Project As → elephant-pa-poc.bbmodel
```

That `.bbmodel` is the first acceptable proof that this bridge reaches native editable Blockbench Cubes.

### Expected local outputs

```text
Experimental/primitiveanything-poc/runs/<run>/
├─ pa/
│  ├─ processed_<input>.glb
│  ├─ output_<input>.glb
│  └─ output_<input>.json
└─ cuboid/
   ├─ <id>.cuboids.json
   ├─ <id>.cuboid-preview.glb
   ├─ <id>.geo.json
   └─ <id>.summary.json
```

`runs/`, external weights, Conda/Python caches, and generated proof artifacts remain local/ignored and are not committed to `Local`.

### What the local session should report back

Return only evidence needed to make the next decision:

```text
1. setup/inference success or exact environment/install error
2. Gate 0 screenshot(s) or clear visual result
3. Gate 1 screenshot(s) or clear visual result
4. Blockbench native Cube/Group proof if Gate 1 passes
5. front / side / top / isometric screenshots if available
6. saved .bbmodel existence only after visual PASS
```

Classify failures precisely:

```text
setup/CUDA/dependency failure → ENVIRONMENT / INSTALL
Gate 0 bad decomposition      → PrimitiveAnything method FAIL
Gate 1 bad substitution       → Cuboid substitution FAIL
Gate 1 good, import wrong     → converter/export mapping defect
Gate 1 + native Cube PASS     → LOCAL geometry proof achieved
```

Do not blur one failure into another.

### First local action

```text
Read Experimental/primitiveanything-poc/README.md
→ run setup_wsl.sh
→ run the approved elephant GLB
→ inspect Gate 0 before touching anything else
```

Do **not** repeat the external-method research that led to this POC unless Gate 0/1 evidence disproves the current method.

## Locked Boundaries

```text
BASE / EXTENDED are the only capability-category names.
Same-phase BASE ↔ EXTENDED must not require reload/reconnect/reset.
Foreign phase still uses HANDOFF_REQUIRED.
Do not add packs, a second router, extra Route 1 formats, non-uniform GLB scaling, or a new alignment tool without reproduced need.
Do not add production MCP mesh→Cube conversion before the PrimitiveAnything local POC passes.
The currently authorized mesh→Cuboid work is isolated to Experimental/primitiveanything-poc only.
Public ToolSpec/schema/runtime-prompt changes require LOCAL_CODE + Bun generators.
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.

## Route 1 external-method boundary

The previous user-deferred Cube boundary is now satisfied by a new explicitly approved method: **PrimitiveAnything learned primitive decomposition followed by deterministic all-Cuboid substitution**.

The only reactivated path is:

```text
approved elephant GLB
→ stock PrimitiveAnything
→ inspect mixed primitive assembly (Gate 0)
→ deterministic canonical-primitive AABB substitution to oriented Cuboids
→ inspect pure-Cuboid preview (Gate 1)
→ open generated Bedrock geo.json in Blockbench as native Groups + Cubes
→ save .bbmodel only after visual PASS
```

The POC must remain isolated under `Experimental/primitiveanything-poc/` until local proof exists. Do not reopen the discarded direct-GLB-to-Cube, voxel, visual-hull, greedy cuboid-fit, CoACD/OBB, or semantic-guess routes as continuation steps. Do not integrate this path into `mcp/**`, texture it, animate it, or perform production Cube cleanup before Gate 0 and Gate 1 pass on the approved elephant GLB.
