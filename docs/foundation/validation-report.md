# BlockIT Foundation Validation Report

**Updated:** 2026-08-13  
**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, completed non-local efficiency hardening, P0–P7 modelling/evaluation contracts, minimal Reference Generator route, and current-state synchronization.

This page owns **proof state**, not active execution order. Current work belongs in `docs/knowledge/next-action.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the target environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports semantics, but current-project live integration may remain unproven.
- `LOCAL PROOF REQUIRED` — source/contract exists but a live/model-facing claim still needs local/direct evidence.
- `UNSUPPORTED` — evidence shows the method should not be relied on.
- `UNKNOWN` — evidence is insufficient or conflicting.

## Functional Status

```text
LOCAL_ACCEPTANCE_COMPLETE
NON_LOCAL_P0_P7_AND_REFERENCE_ROUTE_IMPLEMENTED
NO_LOCAL_RUN_ACTIVE
```

The bounded functional pass completed on 2026-08-12 in Blockbench 5.1.6 against the loopback BlockIT endpoint. It is historical evidence for the accepted baseline; it is **not an instruction to run another local pass now**.

Later P0–P7 and Reference Generator changes are repository/source/contract/static proof unless a claim below explicitly reuses accepted live evidence. Static proof does not retroactively prove improved model reasoning, image understanding, or generated-image quality.

## Accepted Live Baseline — 2026-08-12

| Area | Result | Evidence |
|---|---|---|
| Environment/runtime | `CURRENT-PROJECT VERIFIED` | Windows 11, Bun 1.3.11, Codex CLI 0.137.0, Blockbench 5.1.6, local `mcp/dist/mcp.js`, loopback stateless endpoint |
| Default MCP surface | `CURRENT-PROJECT VERIFIED` | live endpoint exposed **62 enabled tools** with dangerous/default-off containment retained |
| Codex task catalog refresh | `UNKNOWN` | one long-running task retained stale 94-tool catalog while direct endpoint returned 62 |
| Geometry/correction | `CURRENT-PROJECT VERIFIED` | Group + Cubes, focused inspection/bounds/views, causal resize, Undo/Redo |
| Reference fidelity baseline | `CURRENT-PROJECT VERIFIED` | front-plausible/depth-wrong fixture remained `FAIL`; one correction did not become false global PASS |
| Texture/Paint/PBR/material instance | `CURRENT-PROJECT VERIFIED` | texture, Painter edit, native PBR color+MER path, face material instance |
| Animation | `CURRENT-PROJECT VERIFIED` | create/inspect/keyframes, selected animation, timeline time + play/pause |
| Locator / Null Object | `CURRENT-PROJECT VERIFIED` | create/update/inspect/rename/remove/Undo plus reopened persistence |
| Persistence/export | `CURRENT-PROJECT VERIFIED` | editable `.bbmodel` + Bedrock geometry JSON written; reopened smoke fixture retained state |

Accepted default containment:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

## Fresh GitHub-Only Serialized Surface Proof

Current verification pins Bun **1.3.14** and measures the isolated `initialize → tools/list` surface through the real stateless HTTP owner.

```text
initialize instructions: 386 characters
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

These are serialized character measurements, **not** model-visible token/context measurements. Real prompt loading, latency, retry frequency, and image-context cost require client/model evidence.

The advertised `manage_locator` / `manage_null_object` schema flattening remains a known representation boundary, not a proved runtime defect.

## Native Deferred MCP Discovery Compatibility

Current upstream Codex architecture provides `OFFICIALLY VERIFIED` evidence for deferred MCP discovery when tool search is available:

```text
MCP initialize + tools/list
→ client-side catalog
→ deferred tool_search
→ matching tool specs loaded when needed
```

BuildIT retains all 62 Bedrock capabilities and a compact namespace description. Installed local Codex/model parity remains `LOCAL PROOF REQUIRED`.

No custom BuildIT router, extra registration profile, or multi-endpoint split was introduced.

## P0–P4 Static Efficiency / Decision Proof

```text
P0 stage lock
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE

P1 raw static retrieval proxy
Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652

P2 exact-name routed loading proxy
Top-1 0.8173 / Top-3 0.9808 / Top-8 1.0000 / MRR 0.8990

P3 bounded recovery
validation / ambiguity / not-found / stale-known-reference / no-effect / capability mismatch
→ repair only missing decision state; usually keep selected tool

P4 repository defect navigation
named hot-path tool
→ mapped source owner + primary regression owner
→ broaden only if needed
```

P1/P2 are static retrieval proxies over 104 human-style cases / 52 expected tools / all 62 competitors. They are not installed-model behavioral proof.

## P5 — Semantic Form / Rotation / Contact

Current modelling contract requires semantic form before exact transforms:

```text
material mass/landmark
→ orientation: AXIS_ALIGNED | ROTATED | UNRESOLVED
→ explicit pivot/transform role when rotated
→ declared attachment/contact invariant when material
→ exact coordinates only after that decision exists
```

`[0,0,0]` is not a default modelling answer when visible evidence requires a slope. AABB overlap/hierarchy/touching is structural state, not visual contact proof.

**Proof status:** repository/source/CI contract exists. Whether the model correctly identifies masses, orientation, pivots, and contacts from an image remains `LOCAL PROOF REQUIRED` / model-facing evidence.

## P6 — Actual Reference Grounding / Claim-Locked Comparison

Reference-driven authoring requires the **actual approved reference image** in the active multimodal comparison context.

```text
actual approved image
→ Reference Evidence Map
→ View Pair Map
→ Semantic Form linked to grounded claim IDs
→ authoring
→ fresh current model views
→ claim-locked reference ↔ model verdict
```

Material rules:

- user brief/approved target owns identity/function;
- actual approved image owns visible form;
- approved dimensions own numeric whole-model envelope;
- filename/path/manifest/metadata/prose/memory is not visual evidence;
- ambiguous/mirrored view pairing stays `UNVERIFIED`;
- missing actual image blocks material reference-driven approval;
- `PASS` requires actual approved reference + fresh current-revision model evidence;
- successful tools/bounds/hierarchy/similarity scores cannot justify visual `PASS`.

**Proof status:** repository/static contract exists. Actual image-understanding accuracy and end-to-end image handoff remain direct/model-facing evidence.

## P7 — Fidelity Convergence / Evaluation Integrity

P7 closes correction wandering without adding a scorer/planner/runtime profile.

```text
pre-correction paired evidence
→ causal correction
→ fresh affected paired evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

A correction counts as progress only when the target mismatch is `IMPROVED` and no previously supported material claim/view is `REGRESSED`. `UNCHANGED` or `REGRESSED` is not progress; cross-view regression changes the diagnosis or reopens the Primary Form Hypothesis.

Model-facing evaluation is limited to:

1. decomposition / coverage;
2. cross-view consistency;
3. spatial hypothesis quality;
4. correction direction / convergence.

The candidate must receive the actual approved reference image but not the expected answer. Independent expectations must pre-exist candidate output.

**Proof status:** repository/source/tests prove the P7 contract and fixture separation. They cannot prove real candidate image understanding or convergence quality.

## Minimal Reference Generator

Active owner:

```text
/.agents/skills/blockbench-reference-generator/SKILL.md
```

Current contract:

```text
source image / user intent
→ one Minecraft / Blockbench multi-view Modelling Brief Draft
→ maximum one targeted correction
→ user approval
→ actual approved image handed to modelling
```

Static contract requires:

- buildable Cuboid construction;
- one consistent model across all views;
- no lazy voxelization or smooth fake primitives;
- no invented hidden/asymmetric features;
- orthographic scale/center/baseline consistency;
- correct side/front/back/top/3Q semantics;
- no numeric fidelity scoring;
- image-only output, no ZIP/manifest/geometry package.

**Proof status:** repository/source/test contract is implemented. Generated image quality is **not** statically verifiable and remains direct image-capable evidence.

## Product / Lifecycle / Export

| Capability | Proof status |
|---|---|
| fixed Bedrock `create_project` format | source + accepted `CURRENT-PROJECT VERIFIED` baseline |
| lifecycle state from create/path export | source + accepted live baseline |
| Bedrock geometry + editable `.bbmodel` codecs | source + accepted live baseline |
| smoke `.bbmodel` save/reopen fidelity | accepted `CURRENT-PROJECT VERIFIED` |
| existing Bedrock multi-model overwrite/merge | source protected; exact scenario `LOCAL PROOF REQUIRED` |

## Observation / Reference Fidelity

| Capability | Proof status |
|---|---|
| `inspect_model_bounds` | source + representative accepted live use |
| `capture_model_views` | source + representative accepted live use |
| `inspect_element` | source + representative accepted live use |
| difference-first `FAIL / UNVERIFIED / PASS` | workflow + accepted adversarial live case |
| P5 semantic-form/orientation/contact | source/CI; behavioral effectiveness `LOCAL PROOF REQUIRED` |
| P6 actual-image/claim/view grounding | source/CI; image-understanding/handoff `LOCAL PROOF REQUIRED` |
| P7 qualitative convergence/evaluation integrity | source/CI; model-facing effectiveness `LOCAL PROOF REQUIRED` |
| Reference Generator buildability/cross-view contract | source/CI; visual output quality requires image-capable evidence |
| repeated same-cause correction → `BLOCKED` | contract; exact behavioral threshold `LOCAL PROOF REQUIRED` |

Required cross-view rule remains:

```text
front PASS + side FAIL        → whole-form FAIL
front PASS + side unavailable → whole-form UNVERIFIED for depth/side claims
front PASS + conflicting side/top reference → BLOCKED
```

## Texture / Paint / PBR

Native Bedrock texture lifecycle, Painter, TextureGroup/PBR, and per-face `material_instance` remain available. Generic `apply_texture` and raw `filter_by_material` remain outside the default Bedrock callable surface. Representative live reachability comes from the accepted baseline.

## Animation / Rig

Current contracts retain animation identity, summary/focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. Representative create/inspect/keyframe/timeline/playback is accepted live baseline.

Controllers and unsupported sound/timeline-effect mappings remain protected gaps.

## Locator / Null Object

Direct ownership remains:

```text
list_locator_elements
manage_locator
manage_null_object
inspect_element
rename_element
remove_element
```

Representative lifecycle + `.bbmodel` reopen is accepted `CURRENT-PROJECT VERIFIED`.

## Protected Native Capability Gaps

```text
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animation controllers
animation sound/timeline effects
animated-texture authoring
bone-binding expressions
```

Do not emulate them with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, Hytale, or another format.

## Explicitly Unsupported As Modelling Authority

- automatic image→Cuboid reconstruction as geometry truth;
- SF3D/mesh decomposition as Bedrock geometry authority;
- IoU/projection/similarity/fidelity score as automatic resemblance approval;
- filename/path/manifest/prose/memory as substitute for actual image evidence;
- successful Cube placement as visual approval;
- screenshot-per-mutation or per-Cube approval quotas;
- arbitrary fallback coordinates/pivots;
- fixture-specific rules promoted to generic behavior.

## Current Evidence Boundary

Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route**.

No local run is active. Remaining direct/model-facing questions are intentionally unresolved until explicitly activated:

```text
Reference Generator visual quality
actual approved-image handoff to modelling candidate
installed Codex deferred-search parity
real model-visible token/latency/image-context cost
P5–P7 image-understanding and convergence effectiveness
new runtime/persistence defects, if reproduced
```

Do not add a router/profile/scorer/package layer or remove retained native capability without evidence that the current bounded path is insufficient.
