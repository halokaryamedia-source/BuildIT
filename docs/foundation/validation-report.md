# BlockIT Foundation Validation Report

**Updated:** 2026-08-12  
**Scope:** current `Local` source, accepted Codex + Blockbench functional evidence, completed post-acceptance static efficiency hardening, P0–P6 decision/search/recovery/reference-grounding hardening, and GitHub-only verification.

This page owns **proof state**, not active execution order. Current work belongs in `docs/knowledge/next-action.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the target environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports semantics, but current-project live integration may remain unproven.
- `LOCAL PROOF REQUIRED` — source/contract exists but a live/model-facing claim still needs local evidence.
- `UNSUPPORTED` — evidence shows the method should not be relied on.
- `UNKNOWN` — evidence is insufficient or conflicting.

## Functional Status

```text
LOCAL_ACCEPTANCE_COMPLETE
```

The bounded functional pass completed on 2026-08-12 in Blockbench 5.1.6 against the loopback BlockIT endpoint. It is historical evidence for the accepted baseline; it is **not an instruction to run another local pass now**.

Later P0–P6 changes are source/contract/CI proof only unless a claim below explicitly reuses accepted live evidence. They do not retroactively prove improved model reasoning or image understanding.

## Accepted Live Baseline — 2026-08-12

| Area | Result | Evidence |
|---|---|---|
| Environment/runtime | `CURRENT-PROJECT VERIFIED` | Windows 11, Bun 1.3.11, Codex CLI 0.137.0, Blockbench 5.1.6, local `mcp/dist/mcp.js`, loopback stateless endpoint |
| Default MCP surface | `CURRENT-PROJECT VERIFIED` | live endpoint exposed **62 enabled tools** with dangerous/default-off containment retained |
| Codex task catalog refresh | `UNKNOWN` | long-running task retained stale 94-tool catalog while direct endpoint returned 62 |
| Geometry/correction | `CURRENT-PROJECT VERIFIED` | Group + Cubes, focused inspection/bounds/views, causal resize, Undo/Redo |
| Reference fidelity | `CURRENT-PROJECT VERIFIED` | front-plausible/depth-wrong fixture remained `FAIL`; one local correction did not become false global PASS |
| Texture/Paint/PBR/material instance | `CURRENT-PROJECT VERIFIED` | texture, Painter edit, native PBR color+MER path, face material instance |
| Animation | `CURRENT-PROJECT VERIFIED` | create/inspect/keyframes, selected created animation, timeline time + play/pause |
| Locator / Null Object | `CURRENT-PROJECT VERIFIED` | create/update/inspect/rename/remove/Undo plus reopened persistence |
| Persistence/export | `CURRENT-PROJECT VERIFIED` | editable `.bbmodel` + Bedrock geometry JSON written; reopened smoke fixture retained state |

Historical pinned-SDK measurement:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

These historical character counts are not client token cost.

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

Current verification pins Bun **1.3.14** and runs the isolated `initialize → tools/list` measurement through the real stateless HTTP owner.

```text
initialize instructions: 386 characters
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

Description characters decreased relative to the historical measurement while input-schema and total serialized characters increased. This is **not evidence of overall token/context savings**. Model-visible context, latency, and actual client loading behavior require client evidence.

### Advertised Locator branch schema

The isolated surface audit confirms `manage_locator` and `manage_null_object` advertise a flattened object where:

- `action` is top-level-required;
- create/update fields are visible;
- `name` describes create requirement;
- `id` describes update requirement;
- runtime still validates the original discriminated-union Zod schema.

This is a known representation boundary, not a proved runtime defect.

## Native Deferred MCP Discovery Compatibility

Current upstream Codex architecture provides `OFFICIALLY VERIFIED` evidence for deferred MCP discovery when tool search is available:

```text
MCP initialize + tools/list
→ client-side catalog
→ deferred tool_search
→ matching tool specs loaded when needed
```

BuildIT supplies one compact 386-character namespace description and retains all 62 Bedrock capabilities. Installed local Codex/model parity with current upstream remains `LOCAL PROOF REQUIRED`; serialized catalog size is not equivalent to model context size.

No custom BuildIT router, extra registration profile, or multi-endpoint split was introduced.

## Current P0–P4 Static Efficiency Proof

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
named hot-path tool → mapped source owner + primary regression owner → broaden only if needed
```

P1/P2 are static retrieval proxies over 104 human-style cases / 52 expected tools / all 62 competitors. They are not installed-model behavioral proof. P3 consumes existing failure signals instead of a recovery engine. P4 is repository-only navigation.

## P5 Semantic Form / Rotation / Contact — Static Contract Proof

Historical Zebra failures G-01/G-09/G-11 are explicit design inputs. Current modelling contract requires:

```text
semantic object structure before exact coordinates
primary Cube → declared mass/landmark or justified split
orientation → AXIS_ALIGNED | ROTATED | UNRESOLVED
ROTATED → explicit pivot/origin + transform role
required attachment → contact target/invariant
```

`[0,0,0]` is not accepted as a modelling default when visible evidence requires a slope. AABB overlap/hierarchy/touching is structural state, not visual contact proof. The server retains the independently verifiable non-zero-rotation→explicit-pivot schema guard.

Evidence status: source/contract/CI only. Whether a model correctly identifies masses, orientation, pivots, and contacts from an image remains model-facing `LOCAL PROOF REQUIRED` unless separately evaluated.

## P6 Actual Reference Grounding / Claim-Locked Comparison — Static Contract Proof

Historical false-review failures G-06/G-17/G-21/G-22/G-23 drive P6. The contract is fail-closed:

```text
actual approved reference image visible to reviewing model
→ Reference Evidence Map
   claim_id + observable claim + supporting reference view(s) + evidence state
→ View Pair Map
   reference label → matching canonical model view
→ Semantic Form links material items to grounded claim_id(s)
→ authoring
→ fresh current model views
→ claim-locked reference ↔ model difference-first verdict
```

Material rules:

- user brief/approved target owns identity/function;
- actual approved image owns visible form;
- approved dimensions own numeric envelope;
- Reference Evidence Map is a derived working index, never authority over the image;
- filename/path/manifest/metadata/prose summary/prior observation/memory is **not** visual evidence;
- if the actual approved image cannot be inspected, reference-driven authoring/approval is `BLOCKED`, not reconstructed from generic object knowledge;
- ambiguous/mirrored reference↔model view pairing remains `UNVERIFIED`;
- `PASS` requires actual approved reference image + fresh current-revision model image(s) in the active comparison context;
- after material mutation, affected prior model-view evidence is stale until re-captured;
- fluent review text, successful tools, bounds, hierarchy, similarity/IoU/projection scores cannot justify visual `PASS`.

P6 deliberately adds **no** vision score, image→Cube planner, self-reported semantic MCP field, registration profile, or runtime evaluator framework.

Evidence status: repository/CI can prove this contract exists and remains consistent. It **cannot prove image understanding**. The product guarantee at static level is therefore “no material claim should be silently upgraded without actual image evidence,” not “the model always interprets every image correctly.”

## Engineering Proof

Current GitHub-only verification proves:

- Bun 1.3.14 pin and isolated stateless measurement;
- exact 62-tool default surface and serialized ceilings;
- 386-character initialization instructions;
- active routing references resolve to existing canonical repository-owned skills;
- exact-name deferred loading + bounded recovery remain decision-layer only;
- hot-path defect index paths exist and own named tools;
- P5/P6 grounding/geometry policies are regression-checked without new runtime framework/tool profile;
- typecheck, contract tests, production build, generated-doc freshness, and aggregate enforcement remain green when the current head passes CI.

Static gates prove contracts/build output only; they do not create new Blockbench visual/runtime proof.

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
| P5 semantic-form/orientation/contact contract | source/CI; behavioral effectiveness `LOCAL PROOF REQUIRED` |
| P6 actual-image/claim/view grounding contract | source/CI; model image-understanding accuracy `LOCAL PROOF REQUIRED` |
| repeated same-cause correction → `BLOCKED` | contract; exact behavioral threshold `LOCAL PROOF REQUIRED` |

A convincing front view cannot certify 3D depth.

Required cross-view rule retained:

```text
front PASS + side FAIL        -> whole-form FAIL
front PASS + side unavailable -> whole-form UNVERIFIED for depth/side claims
front PASS + conflicting side/top reference -> BLOCKED
```

## Geometry / Discovery Safety

Current contracts retain finite Cube extents, intentional rotation pivots, no-op rejection, bounded batch correction, deterministic identity, compact discovery defaults with larger explicit bounds, and summary-first Locator/Null Object discovery.

P5/P6 do not move semantic truth into `place_cube`. Structural schema validation proves only what the server can actually determine; visual/object meaning stays evidence-gated by the actual reference.

## Texture / Paint / PBR

Native Bedrock single-texture lifecycle, Painter, TextureGroup/PBR, and per-face `material_instance` remain available. Generic `apply_texture` and raw `filter_by_material` remain outside default Bedrock callable surface. Representative live reachability comes from accepted baseline; later instruction/result changes are static-only proof.

## Animation / Rig

Current contracts retain animation identity, zero-length handling, summary-first inspection, bounded keyframe/batch/copy operations, hierarchy/cycle safety, and selected-animation timeline continuity. Representative create/inspect/keyframe/timeline/playback is accepted live baseline; controllers and unsupported sound/timeline-effect mappings remain protected gaps.

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

Representative lifecycle + `.bbmodel` reopen is accepted `CURRENT-PROJECT VERIFIED`. `list_locator_elements` is identity/type/parent discovery; detailed authored state belongs to `inspect_element` and mutation returns.

## MCP Client / Efficiency Evidence Boundary

Current upstream architecture plus static routing/retrieval evidence supports native deferred MCP tool search as the default design. Still `UNKNOWN` / `LOCAL PROOF REQUIRED` for installed-client exact parity, actual prompt/skill co-loading, model-visible token/latency cost, real retry frequency, and image-context cost.

Do not add a custom router/profile or remove retained native capability without evidence that the current bounded path is insufficient.

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
- IoU/projection/similarity score as automatic resemblance approval;
- filename/path/manifest/prose/memory as substitute for actual image evidence;
- successful Cube placement as visual approval;
- screenshot-per-mutation or per-Cube approval quotas;
- arbitrary fallback coordinates/pivots;
- selection or first duplicate-name match as destructive identity;
- fixture-specific rules promoted to generic behavior.

## Current Evidence Boundary

Functional local acceptance is complete. Static efficiency, deferred-search compatibility, P0–P4 decision/recovery/navigation, P5 semantic-form/rotation/contact, P6 actual-reference grounding, and current-state synchronization are implemented at repository/CI contract level. **No new local run is active or required by this document.** Future local/model-facing proof is required only when the user explicitly requests it or a new task needs that evidence.
