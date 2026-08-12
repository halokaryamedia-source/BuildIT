# BlockIT Foundation Validation Report

**Updated:** 2026-08-12  
**Scope:** current `Local` source, accepted Codex + Blockbench functional evidence, completed post-acceptance static efficiency hardening, P0–P4 routing/recovery/navigation hardening, and GitHub-only verification.

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

The requested post-acceptance static efficiency cleanup and follow-up GitHub-only hardening are complete at source/contract/CI level. Those later changes remain static proof until a future local run is explicitly requested.

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
initialize instructions: 386 characters
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

Relative to the historical static measurement, description characters decreased while input-schema and total serialized characters increased. This is **not evidence of overall token/context savings**. Actual model-visible context and token use still require client evidence.

The largest current serialized tool payloads are led by `place_cube`, `create_animation`, `manage_keyframes`, and `manage_locator`. This list is diagnostic only; size alone is not permission to remove capability or mass-trim legitimate schemas.

### Advertised Locator branch schema

The isolated `tools/list` audit confirms both `manage_locator` and `manage_null_object` currently advertise one flattened object shape where:

- `action` is top-level-required;
- create/update fields are present;
- the `name` description says it is required when `action=create`;
- the `id` description says it is required when `action=update`;
- runtime calls still validate against the original discriminated-union Zod schema.

This is a known representation boundary, not a demonstrated runtime defect. Do not split tools or redesign registration without future evidence that clients materially miscall it.

## Native Deferred MCP Discovery Compatibility

Current upstream Codex source provides authoritative architectural evidence for deferred MCP discovery when tool search is available:

```text
MCP initialize + tools/list
→ client-side MCP catalog
→ MCP tools exposed as Deferred
→ tool_search indexes/ranks deferred tools
→ matching tool specs are loaded when needed
```

Evidence status for that architecture: `OFFICIALLY VERIFIED` from current upstream Codex source. Evidence status for the user's already-accepted local Codex CLI 0.137.0 session following that exact current path: `LOCAL PROOF REQUIRED`.

Codex still runs `tools/list` to create/cache the local MCP catalog. Therefore the 74,996 serialized characters are not evidence that all 62 schemas enter every inference request.

Current upstream Codex also maps regular MCP server `instructions` to its namespace description and includes namespace description, tool names/titles/descriptions, and top-level schema property names in MCP tool-search text. BuildIT now supplies one **386-character** capability-oriented initialization description from `mcp/server/server.ts` instead of leaving that namespace context empty or duplicating the full workflow prompt.

The initialization description names the retained domains—project lifecycle, Cube/Group geometry, inspection/bounds/views, texture/Painter/PBR/material instances, animation/rigging/keyframes, Locator/Null Object, history/Undo/Redo, and Bedrock/.bbmodel export—so deferred search has compact routing context while all 62 capabilities remain available.

No custom BuildIT router, extra registration profile, or multi-endpoint split was introduced.

## Current P0–P4 Static Efficiency Proof

P0–P4 address decision/search/recovery/debugging loops without changing the retained 62-tool runtime surface:

```text
P0 stage lock
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE

P1 raw static retrieval proxy
Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652

P2 exact-name routed loading proxy
Top-1 0.8173 / Top-3 0.9808 / Top-8 1.0000 / MRR 0.8990

P3 bounded recovery
validation / ambiguity / not-found / stale-known-reference / no-effect / capability mismatch
→ repair only missing decision state; usually keep the selected tool

P4 repository defect navigation
named hot-path tool → mapped source owner + primary regression owner → broaden only if needed
```

P1/P2 use the same 104 human-style cases over 52 expected tools against all 62 default competitors. The routed correctness gate is Top-8 presence because the semantic route already knows the exact tool and upstream search returns up to 8 matches. These are static retrieval proxies, **not installed Codex/model behavioral proof**.

P3 consumes existing source failure signals rather than adding a global error enum, result-level `next_action`, recovery engine, or another MCP layer. P4 is repository-only navigation and never participates in normal asset authoring.

The hot-path index now includes project lifecycle, `inspect_model_bounds`, Cube correction, hierarchy/discovery, camera views, Locator/Null Object, texture/PBR, animation, bounded history inspection via `get_undo_stack`, and export first-stop mappings. Generic `undo`/`redo` are deliberately left out until a real defect justifies a sufficiently specific primary regression owner.

## Engineering Proof

The accepted baseline passed frozen-lockfile install, strict TypeScript, Bun contract tests, production build, prompt generation, generated-doc freshness, and source hygiene. The animation-selection repair additionally passed focused tests and live `create_animation → set_time → play/pause` proof.

Current GitHub-only verification additionally proves:

- Bun 1.3.14 is read from `.bun-version` by CI;
- the isolated default MCP measurement gate succeeds through the actual stateless HTTP path;
- initialization returns the compact 386-character MCP server instructions;
- serialized-surface ceilings pass while retaining exactly 62 default tools;
- Locator create/update guidance survives into actual `tools/list` output;
- active routing references resolve to existing canonical repository-owned skill packages;
- deterministic authoring routing, exact-name deferred loading, and bounded recovery remain instruction-layer only;
- the hot-path defect index maps existing source/test owners and does not become runtime routing;
- typecheck, contract tests, production build, generated-doc freshness, and aggregate enforcement remain green.

Static gates prove contracts/build output only; they do not create new Blockbench visual/runtime proof or actual local model token measurements.

## Completed Post-Acceptance Static Hardening

Current `Local` source includes source-provable efficiency reductions:

- exact single-text JSON mirrors of `structuredContent` are compacted centrally while canonical structured data, meaningful text, and images remain;
- `get_project_info` returns a bounded top-level Group summary;
- `list_outline`, element discovery, and undo-history normal defaults are smaller while larger explicit bounds remain available;
- `list_locator_elements` returns identity/type/parent discovery only; detailed Locator/Null Object authored state remains in `inspect_element` and mutation results;
- asset routing, orchestration, modelling, texturing, animation, and stable workspace context have clearer non-overlapping ownership;
- repository-development context is split across root routing, conditional `development-brief`, `mcp/AGENTS.md`, and at most one specialist; stale references to non-existent escalation skills were removed;
- active skill routing has an integrity regression gate;
- runtime prompt bundling contains only the callable `bedrock_entity_workflow`; maintainer reference Markdown remains source-only;
- Locator/Null Object create/update branch intent is explicit and checked on the serialized MCP surface;
- compact MCP server initialization instructions now support native deferred-tool discovery without capability deletion;
- P0 stage locking prevents known fresh state from falling back into discovery by ritual;
- P1/P2 measure semantic collisions and use exact-name deferred spec loading instead of mass-editing descriptions or adding a custom router;
- P3 maps common hot-path failures to bounded recovery without adding runtime recovery architecture;
- P4 maps named tool defects to first source/test owners without broad repository search;
- generated MCP docs/runtime manifest remain synchronized through their build owners;
- static efficiency budgets lock instruction size, exact 62-tool capability count, compact default reads, and bounded serialized surface growth.

Status: **source/contract/CI hardening complete** for the requested pre-test cleanup and P0–P4 follow-up. Do not infer exact runtime token savings from architecture or character measurements alone.

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

## MCP Client / Efficiency Evidence Boundary

Current upstream architecture plus current static routing/retrieval evidence answers the former direct-vs-deferred design question: native Codex tool search is the intended deferred owner when available, and BuildIT's semantic route should use it to load an already-selected exact tool rather than creating another runtime router.

Still `UNKNOWN` / `LOCAL PROOF REQUIRED` for the user's installed client until a future explicitly requested local efficiency trace:

- whether the installed Codex CLI/model combination uses the same current deferred path;
- actual prompt/skill co-loading;
- real model-visible token/context/latency cost;
- actual retry frequency under exact-name loading and bounded recovery;
- image/context cost during realistic authoring.

For an older or non-tool-search client, a client-side `enabled_tools` allow-list may be a compatibility fallback, but it should not become the default because it hides capability rather than discovering it lazily.

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

Functional local acceptance is complete. Requested static efficiency cleanup, GitHub-only pretest hardening, native deferred-search compatibility work, P0–P4 decision/search/recovery/debug-navigation hardening, and current-state documentation synchronization are complete. **No new local run is active or required by this document.** The cleaned baseline is held until the user explicitly requests local testing or a new product requirement.
