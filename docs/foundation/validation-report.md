# BlockIT Foundation Validation Report

**Updated:** 2026-08-12  
**Scope:** current `Local` source, accepted Codex + Blockbench functional evidence, completed post-acceptance static efficiency hardening, and GitHub-only pretest verification.

This page owns **proof state**, not active execution order. Current work belongs in `docs/knowledge/next-action.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the target environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports semantics, but current-project live integration may remain unproven.
- `LOCAL PROOF REQUIRED` — source/contract exists but a live claim still needs local evidence.
- `UNSUPPORTED` — available evidence shows the method should not be relied on.
- `UNKNOWN` — evidence is insufficient or conflicting.

## Functional Status

```text
LOCAL_ACCEPTANCE_COMPLETE
```

The bounded functional pass completed on 2026-08-12 in Blockbench 5.1.6 against the loopback BlockIT endpoint. It is historical evidence for the accepted baseline; it is **not an instruction to run another local pass now**.

The requested post-acceptance static efficiency cleanup and follow-up GitHub-only pretest hardening are complete at source/contract/CI level. Those later changes remain static proof until a future local run is explicitly requested.

## Accepted Live Baseline — 2026-08-12

| Area | Result | Evidence |
|---|---|---|
| Environment/runtime | `CURRENT-PROJECT VERIFIED` | Windows 11, Bun 1.3.11, Codex CLI 0.137.0, Blockbench 5.1.6, local `mcp/dist/mcp.js`, loopback stateless endpoint |
| Default MCP surface | `CURRENT-PROJECT VERIFIED` | live endpoint exposed **62 enabled tools** with dangerous/default-off containment retained |
| Codex task catalog refresh | `UNKNOWN` | the long-running task retained a stale 94-tool catalog while direct live endpoint calls returned 62 |
| Geometry/correction | `CURRENT-PROJECT VERIFIED` | Group + Cubes, focused inspection/bounds/views, causal resize, Undo/Redo |
| Reference fidelity | `CURRENT-PROJECT VERIFIED` | front-plausible/depth-wrong fixture correctly remained `FAIL`; one local correction did not become false global PASS |
| Texture/Paint/PBR/material instance | `CURRENT-PROJECT VERIFIED` | 16×16 texture, visible Painter edit, native PBR color+MER path, face material instance |
| Animation | `CURRENT-PROJECT VERIFIED` | create/inspect/keyframes, selected created animation, timeline time and play/pause |
| Locator / Null Object | `CURRENT-PROJECT VERIFIED` | create/update/inspect/rename/remove/Undo plus persistence in reopened project |
| Persistence/export | `CURRENT-PROJECT VERIFIED` | editable `.bbmodel` and Bedrock geometry JSON written; reopened smoke fixture retained required state |

Historical pinned-SDK measurement captured at that accepted baseline:

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

The current verification workflow pins Bun **1.3.14** through root `.bun-version` and runs `mcp/scripts/measure-default-surface.ts` in a fresh process. The script starts the real stateless HTTP owner on an ephemeral loopback port, performs `initialize → tools/list`, measures the serialized client-visible surface, then enforces bounded regression ceilings.

Current fresh result:

```text
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

Relative to the historical static measurement, description characters decreased while input-schema and total serialized characters increased. This is **not evidence of overall token/context savings**. Real client context, token use, latency, tool search, and co-loading remain `UNKNOWN` until a future user-requested local trace.

The largest current serialized tool payloads are led by `place_cube`, `create_animation`, `manage_keyframes`, and `manage_locator`. This list is diagnostic only; size alone is not permission to remove capability or mass-trim legitimate schemas.

### Advertised Locator branch schema

The isolated `tools/list` audit confirms both `manage_locator` and `manage_null_object` currently advertise one flattened object shape where:

- `action` is top-level-required;
- create/update fields are present;
- the `name` description says it is required when `action=create`;
- the `id` description says it is required when `action=update`;
- runtime calls still validate against the original discriminated-union Zod schema.

This is a known representation boundary, not a demonstrated runtime defect. Do not split tools or redesign registration without future evidence that clients materially miscall it.

## Engineering Proof

The accepted baseline passed frozen-lockfile install, strict TypeScript, Bun contract tests, production build, prompt generation, generated-doc freshness, and source hygiene. The animation-selection repair additionally passed focused tests and live `create_animation → set_time → play/pause` proof.

Current GitHub-only verification additionally proves:

- Bun 1.3.14 is read from `.bun-version` by CI;
- the isolated default MCP measurement gate succeeds through the actual stateless HTTP path;
- serialized-surface ceilings pass;
- Locator create/update guidance survives into actual `tools/list` output;
- active routing references resolve to existing canonical repository-owned skill packages;
- typecheck, contract tests, production build, generated-doc freshness, and aggregate enforcement remain green.

Static gates prove contracts/build output only; they do not create new Blockbench visual/runtime proof.

## Completed Post-Acceptance Static Hardening

Current `Local` source includes source-provable efficiency reductions:

- exact single-text JSON mirrors of `structuredContent` are compacted centrally while canonical structured data, meaningful text, and images remain;
- `get_project_info` returns a bounded top-level Group summary;
- `list_outline`, element discovery, and undo-history normal defaults are smaller while larger explicit bounds remain available;
- `list_locator_elements` returns identity/type/parent discovery only; detailed Locator/Null Object authored state remains in `inspect_element` and mutation results;
- asset routing, orchestration, modelling, texturing, animation, and stable workspace context have clearer non-overlapping ownership;
- repository-development context is split across root routing, conditional `development-brief`, `mcp/AGENTS.md`, and at most one specialist; stale references to non-existent escalation skills were removed;
- active skill routing now has an integrity regression gate;
- runtime prompt bundling contains only the callable `bedrock_entity_workflow`; maintainer reference Markdown remains source-only;
- Locator/Null Object create/update branch intent is explicit and checked on the serialized MCP surface;
- generated MCP docs/runtime manifest remain synchronized through their build owners;
- static efficiency budgets lock instruction size, exact 62-tool capability count, compact default reads, and bounded serialized surface growth.

Status: **source/contract/CI hardening complete** for the requested pre-test cleanup. Do not infer runtime token savings or client behavior from character measurements alone.

## Product / Lifecycle / Export

| Capability | Proof status |
|---|---|
| fixed Bedrock `create_project` product format | source + `CURRENT-PROJECT VERIFIED` live baseline |
| lifecycle state from create/path export | source + `CURRENT-PROJECT VERIFIED` live baseline |
| Bedrock geometry + editable `.bbmodel` codecs | source + `CURRENT-PROJECT VERIFIED` live baseline |
| smoke `.bbmodel` save/reopen fidelity | `CURRENT-PROJECT VERIFIED` |
| existing Bedrock multi-model overwrite/merge path | source protected; `LOCAL PROOF REQUIRED` for that exact live scenario |

## Observation / Reference Fidelity

| Capability | Proof status |
|---|---|
| `inspect_model_bounds` | source + `CURRENT-PROJECT VERIFIED` representative live use |
| `capture_model_views` | source + `CURRENT-PROJECT VERIFIED` representative live use |
| `inspect_element` | source + `CURRENT-PROJECT VERIFIED` representative live use |
| difference-first `FAIL / UNVERIFIED / PASS` | workflow + `CURRENT-PROJECT VERIFIED` adversarial live case |
| reuse of fresh returned state | workflow/source + representative acceptance evidence |
| `capture_screenshot` current-view branch | source verified; exact live branch remains `LOCAL PROOF REQUIRED` |
| repeated same-cause correction → `BLOCKED` | contract/prompt verified; exact behavioral threshold remains `LOCAL PROOF REQUIRED` |

A convincing front view cannot certify 3D depth.

## Geometry / Discovery Safety

Current contracts retain finite Cube extents, intentional rotation pivots, no-op rejection, bounded batch correction, deterministic identity resolution, bounded outline/discovery, finite ordered size filters, and explicit non-empty scopes/filters.

Post-acceptance compact defaults do **not** remove the larger explicit discovery bounds. Locator/Null Object list discovery is summary-only; focused authored transforms/IK/visibility remain available through the existing detailed owner rather than being duplicated in the list path.

## Texture / Paint / PBR

Current Bedrock semantics retain native single-texture lifecycle, Painter pixel ownership, TextureGroup/PBR channels, and per-face `material_instance`. Generic `apply_texture` and raw `filter_by_material` remain outside the default Bedrock callable surface.

Representative live reachability is `CURRENT-PROJECT VERIFIED` from the accepted pass; later instruction/result slimming is static-only proof.

## Animation / Rig

Current contracts retain normalized animation identity, zero-length handling, summary-first inspection, bounded keyframe/batch/copy operations, hierarchy/cycle safety, and selected-animation timeline continuity.

Representative create/inspect/keyframe/timeline/playback is `CURRENT-PROJECT VERIFIED`. Controllers and unsupported sound/timeline-effect mappings remain protected gaps.

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

`list_locator_elements` owns only compact identity/type/parent discovery. `inspect_element` owns focused detailed authored state; `manage_locator` / `manage_null_object` return their resulting detailed mutation state so an immediate confirmation read is not required.

Representative lifecycle plus `.bbmodel` reopen is `CURRENT-PROJECT VERIFIED`. Null Object remains distinct editor/animation state and round-trips through the Bedrock geometry `_null_` locator representation where supported.

## MCP Client / Efficiency Evidence Still Unknown

Static/GitHub proof still does **not** establish how a future fresh Codex task handles:

- direct schema injection vs native deferred/tool search;
- actual prompt/skill co-loading;
- real token/context/latency cost;
- retry frequency caused by advertised schema interpretation;
- image/context cost during realistic authoring.

These remain `UNKNOWN` until a future local efficiency run is explicitly requested. Do not add a BlockIT custom router/profile solely from static tool count or serialized character counts.

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
- successful Cube placement as visual approval;
- screenshot-per-mutation or per-Cube approval quotas;
- arbitrary fallback coordinates/pivots;
- selection or first duplicate-name match as silent destructive identity;
- silently broadening invalid/empty discovery filters;
- fixture-specific build rules promoted to generic product behavior.

## Current Evidence Boundary

Functional local acceptance is complete. Requested static efficiency cleanup and GitHub-only pretest hardening are complete. **No new local run is active or required by this document.** The cleaned baseline is held until the user explicitly requests local testing or a new product requirement.
