# Validation Report

Updated: 2026-08-28 — Route 1 source/static coding complete through quantitative evidence, reconnect recovery, preferred MultiView reproducibility, and ownership hardening; desktop proof intentionally deferred

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 65 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (28 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + FULL MCP STATIC PROOF
ROUTE 1 GEOMETRY EVIDENCE BRIDGE:         SOURCE + FULL MCP STATIC PROOF
ROUTE 1 HUNYUAN MULTIVIEW EXECUTABLE:     SOURCE + STATIC REPRODUCIBILITY PROOF
ROUTE 1 QUANTITATIVE/RECONNECT EVIDENCE:  SOURCE + FULL MCP STATIC PROOF
ROUTE 1 OWNERSHIP INVARIANTS:             SOURCE + FULL MCP STATIC PROOF
LATEST FULL MCP VERIFY:                   GREEN @ 5bcaa8a7e9217dc84fb0d11d96c319ba1154e417
LAST OBSERVED FULL CANONICAL GREEN:       5bcaa8a7e9217dc84fb0d11d96c319ba1154e417
REPOSITORY VERIFY BEFORE FINAL DOC RECONCILIATION: GREEN @ 5d1f5ddb80488a6fb420eb6f47a5f06961e49419
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
CURRENT ROUTE 1 LIVE RETEST:              LOCAL PROOF REQUIRED — DEFERRED BY USER
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Static source/CI evidence proves only what it exercises. It can prove phase ownership, schemas, buildability, generated-doc freshness, surface shape, fixed Hunyuan script contracts, Python source parsing, evidence/result fields, export guards, and fail-closed invariants. It **cannot prove visual fidelity**, installed-plugin freshness, fresh Codex registry state, desktop GLB rendering, live Blockbench Undo behavior, or model-quality improvement.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

The exact current source gate passed on `Local` commit `5bcaa8a7e9217dc84fb0d11d96c319ba1154e417`:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 358 tests, 0 fail, 3461 expectations, 64 files
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Current regression coverage proves, among other things:

- missing authoring phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only (28 tools);
- retained callable catalog remains 65 tools across phases;
- `manage_geometry_reference` is Geometry-owned and absent from Texturing/Animation;
- Direct Geometry remains free of the retired `plan_id` contract;
- canonical active plugin path is `mcp/dist/blockit_mcp.js`;
- loopback/stateless transport and fail-closed startup retain regression coverage;
- local diagnostic preflight still classifies the first known wrong owner before downstream surface diagnosis.

## Route 1 Geometry Evidence Bridge Static Proof

The bridge retains one experimental Geometry-owned capability:

```text
manage_geometry_reference
```

Static contract now proves:

- input is one absolute local `.glb`, not URL/generic importer semantics;
- Blockbench's installed `reference_models` element type is reused; no second GLTF importer or editable Blockbench Mesh conversion was added;
- one tool-owned reference is root-only, locked, `export=false`, transient, and marked with runtime ownership plus a legacy name-prefix fallback;
- source front `+z/-z` registers deterministically to project front using Y yaw;
- updates remain bounded to origin, positive uniform scale, visibility, and wireframe;
- asynchronous load is bounded and failed loads clean up fail-closed;
- loaded evidence must contain finite positive 3D span and usable triangle-mesh data;
- `capture_model_views` keeps `framing=model` Cube-owned while `framing=explicit` can capture a visible loaded invariant-valid Route 1 reference before Cubes exist;
- editable `.bbmodel` export remains blocked while a tool-owned Route 1 reference exists; Bedrock geometry export remains independent;
- modelling guidance keeps approved image + requested dimensions authoritative and forbids triangle tracing/raw-GLB target sizing.

### Quantitative 3D evidence

`manage_geometry_reference` returns:

```text
bounds_basis = raw_reference_world_aabb
world_bounds = min / max / center / size_xyz
dimensions_blockbench_units = width / height / length
dimensions_blocks = width / height / length
scene_stats = mesh_count / vertex_count / triangle_count
```

Raw AABB deliberately includes every loaded mesh fragment. It is diagnostic evidence only and must never become target dimensions or an automatic scale-to-fit instruction.

### Reconnect/recovery evidence

The existing `reference_models://...` resource exposes the same Route 1 evidence after a fresh MCP/Codex connection and recovers source/project front alignment from the reference transform. No persistent Route 1 registry or second discovery tool was added.

### Ownership/invariant hardening

Runtime ownership survives generic rename. Route 1 evidence/capture fails closed if the reference becomes:

```text
non-root
unlocked
export-enabled
non-uniformly scaled
```

Dedicated Route 1 removal remains available so a tampered transient reference can be cleaned up without creating a recovery framework.

## Route 1 Hunyuan Reproducibility Proof

Preferred executable:

```text
Experimental/route1-hunyuan-poc/generate_multiview_shape.py
```

Pinned contract:

```text
upstream source commit  f8db63096c8282cb27354314d896feba5ba6ff8a
model repo              tencent/Hunyuan3D-2mv
model revision          3a761b539b29fe4ff64714813aa9560fd66f5de0
subfolder               hunyuan3d-dit-v2-mv
views                   FRONT + LEFT(SIDE) + BACK
variant                 fp16
steps                   50
guidance                5.0
octree                  256
chunks                  20000
seed                    12345
source front            +z
output                  shape-only trimesh/GLB
```

Both SingleView baseline and preferred MultiView scripts require the pinned local model files before pipeline construction. The accepted guidance value `5.0` is explicit instead of relying on a hidden upstream default. The current MCP test suite also compiles all tracked Route 1 Python entrypoints as source when Python is available; this ran and passed in canonical CI. It does not import Torch/Hunyuan or claim GPU inference proof.

No weights, generated GLBs, or transient contact sheets are committed as production assets.

## Fail-Fast Local Diagnostic Proof

The existing `bun run verify:stateless-local` separates environment/runtime failures from MCP public-contract failures.

Preflight order remains:

```text
server reachable
→ /health readable
→ product identity
→ local/live build identity match
→ process stability
→ requested profile / authoring phase
→ stateless transport contract
→ exposed tool count
→ initialize contract
→ exact tools/list surface
→ required Geometry capability
→ Direct Geometry plan_id guard
```

Environment/install and Blockbench-runtime failures STOP before downstream surface diagnosis. This remains static preparation; the user has intentionally deferred running it.

## Bundle Freshness Identity

The production build injects SHA-256 bundle identity. For exact source commit `5bcaa8a7...`, canonical MCP Verify built:

```text
sha256:6fab9790e4d912724fd0f23416ad5b164e402d2314b710e724c8b7e49c7210be
```

`product.version`, `build_identity`, `instance_id`, and `startup_time` retain separate ownership. The fingerprint is diagnosis only, not a cache-buster/session mechanism.

## Discovery / Static Footprint Proof

Current exact-source discovery evaluation:

```text
raw semantic stress:
top_1_accuracy  0.5472
top_3_recall    0.7736
top_8_recall    0.8868
MRR             0.6822

routed exact-name loading:
top_1_accuracy  0.8302
top_3_recall    0.9340
top_8_recall    1.0000
MRR             0.8913
top_8_misses    0
```

Evaluation corpus: 65 enabled tools, 53 expected tools, 106 intent cases.

Measured exact-source surface:

```text
retained Bedrock callable catalog  65 tools
default Geometry exposure           28 tools
initialize instructions             608 characters
catalog tools/list response         78,400 characters
catalog input schemas               58,352 characters
catalog descriptions                7,080 characters
max per-tool payload                3,062 characters
canonical workflow source           7,619 characters
```

Regression ceilings remain:

```text
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,500 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
canonical workflow source           < 9,000 characters
```

These are **Static Footprint** guardrails. Character counts are regression ceilings, not client token measurements and not Authoring Efficiency proof.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

An approved Route 1 GLB may supplement the approved image with 3D evidence; it never replaces image/dimension authority. Static CI cannot prove visual fidelity. Paths, filenames, manifests, prose, coordinates, bounds, triangle counts, tool success, or scalar similarity cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

Do not invent token/latency numbers. Unknown live values remain `UNVERIFIED`.

## Current Static / Source State

Current retained source includes:

- 65-tool normal Bedrock callable catalog and 28-tool default Geometry exposure;
- pinned preferred Hunyuan MultiView executable plus SingleView baseline;
- transient Route 1 GLB lifecycle through `manage_geometry_reference`;
- quantitative world bounds/dimensions/scene statistics;
- reconnect evidence through existing `reference_models` resource;
- explicit-envelope pre-Cube capture;
- rename-resistant runtime ownership and fail-closed lifecycle invariants;
- production `.bbmodel` cleanup guard;
- existing Cube/Group, UV, Texture, animation, Locator/Null, Undo/history, and export capabilities;
- loopback request-owned/stateless transport;
- `risky_eval` and `from_geo_json` disabled.

The Route 1 hardening did **not** add mesh-to-Cube conversion, voxelization, cuboid solving, segmentation, GLB cleanup/decimation, raycast/probe, similarity scoring, custom rendering, persistent registry, reconnect daemon, new routing/profile architecture, telemetry, alternate transport, or a Geometry compiler.

## Local Runtime History

### ACCEPTED LIVE BASELINE — 2026-08-12

Historical live coverage predates the current Route 1 bridge. It does not prove the exact-current installed BlockIT/Codex surface or current GLB behavior.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

All justified **source/static Route 1 coding is complete** on exact source commit `5bcaa8a7e9217dc84fb0d11d96c319ba1154e417`, and its full MCP gate is green. The user intentionally deferred the desktop/live test. No live Geometry-surface, fresh Codex-registry, GLB-rendering, visual-quality, or Authoring Efficiency PASS is claimed.

Further Route 1 source work requires new evidence from a later live run or a newly identified source defect; absence of live proof is not itself justification for another tool or framework.
