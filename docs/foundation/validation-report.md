# BlockIT Foundation Validation Report

**Updated:** 2026-08-12
**Scope:** current `Local` source, foundation/skill policy, static gates, and completed Codex + Blockbench local acceptance evidence.

This report answers **what level of evidence currently exists**. Active task status belongs in `docs/knowledge/next-action.md`; local test procedure belongs in `docs/knowledge/operations/local-acceptance-runbook.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the current target environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream source/docs support the capability/semantics, but current-project live integration may still be unproven.
- `LOCAL PROOF REQUIRED` — current source/contract exists, but live Codex/Blockbench proof is still required.
- `UNSUPPORTED` — available evidence shows the method should not be relied on.
- `UNKNOWN` — insufficient/conflicting evidence.

## Current Overall Status

```text
LOCAL_ACCEPTANCE_COMPLETE
```

The bounded local pass is complete. Live runtime, representative authoring, truthful visual routing, playback, and persistence were exercised in Blockbench 5.1.6 against the loopback MCP endpoint.

Final repository hygiene also removed standalone-upstream/editor residue, obsolete planning layers, and tracked transient workspace previews without changing the MCP callable surface.

Current pinned-SDK default MCP baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Default containment:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

## Product Policy Status

| Policy | Status |
|---|---|
| Minecraft Bedrock Entity is the retained default product | Active BlockIT policy |
| Approved reference/brief is visual authority | Active BlockIT policy |
| Whole form precedes secondary detail | Active BlockIT policy |
| Tool/validator/file success is not visual approval | Active BlockIT policy |
| Visual gates use `FAIL / UNVERIFIED / PASS` | Active BlockIT policy |
| `BLOCKED` is valid when continuation requires guessing/repeated failure | Active BlockIT policy |
| Production texture/animation must not hide unresolved material geometry | Active BlockIT policy |
| Explicit identities/scopes/filters fail closed where hardened | Active BlockIT policy |
| Generic Mesh/Hytale/risky-eval shortcuts do not expand Bedrock scope | Active BlockIT policy |

## Engineering Proof

Current repository gates have passed for the pre-local source state:

```text
frozen-lockfile install
strict TypeScript typecheck
160 Bun contract tests after the schema repair
production build
prompt manifest generation
generated MCP docs freshness
diff hygiene
pinned-SDK tools/list measurement
```

The later animation-selection repair additionally passed its 4 focused tests, strict typecheck, production build, and live `create_animation → set_time → play/pause` proof.

## Local Acceptance Evidence — 2026-08-12

| Area | Result | Evidence |
|---|---|---|
| Environment/runtime | `CURRENT-PROJECT VERIFIED` | Windows 11, Bun 1.3.11, Codex CLI 0.137.0, Blockbench 5.1.6, local `mcp/dist/mcp.js`, loopback stateless endpoint |
| Default MCP surface | `CURRENT-PROJECT VERIFIED` | live endpoint exposed 62 tools and retained dangerous/default-off containment |
| Codex task catalog refresh | `UNKNOWN` | this existing Codex task retained a stale 94-tool catalog after restart; direct live endpoint calls used the correct 62-tool runtime |
| Geometry/correction | `CURRENT-PROJECT VERIFIED` | Group + 3 Cubes, inspection/bounds/views, one causal resize, Undo/Redo |
| Reference-fidelity behavior | `CURRENT-PROJECT VERIFIED` | front-plausible/depth-wrong zebra fixture correctly remained `FAIL`; one diagnosed torso-depth correction did not become a false global PASS |
| Texture/Paint/PBR/material instance | `CURRENT-PROJECT VERIFIED` | 16×16 texture, visible Painter edit, native PBR TextureGroup/color+MER, face material instance |
| Animation | `CURRENT-PROJECT VERIFIED` | create/inspect/keyframes, automatic selection after repair, set-time and play/pause |
| Locator/Null Object | `CURRENT-PROJECT VERIFIED` | create/update/inspect/rename/remove/Undo and no-op rejection |
| Persistence/export | `CURRENT-PROJECT VERIFIED` | editable `.bbmodel` and Bedrock geometry JSON written; reopened file retained Cubes, texture, animation, Locator, and Null Object |

## Project / Lifecycle / Export

| Capability | Source status | Live status |
|---|---|---|
| `create_project` fixed Bedrock product format | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| compact lifecycle state from create/info/export | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| path-writing export uses native lifecycle owner/postconditions | Source/contract verified + native semantics audited | `CURRENT-PROJECT VERIFIED` |
| Bedrock geometry export + editable `.bbmodel` product codecs | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| existing Bedrock multi-model target is not silently clobbered through direct bypass | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `.bbmodel` save/reopen fidelity | not provable non-locally | `CURRENT-PROJECT VERIFIED` for the smoke fixture |

## Observation / Reference Fidelity

| Capability | Source status | Live status |
|---|---|---|
| `inspect_model_bounds` finite structural envelope evidence | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| `capture_model_views` bounded named model-view evidence | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| `capture_screenshot` current-editor-view only | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `inspect_element` focused authored state | Source/contract verified | `CURRENT-PROJECT VERIFIED` |
| difference-first `FAIL / UNVERIFIED / PASS` workflow | Prompt/skill/foundation contract verified | behavioral/visual `CURRENT-PROJECT VERIFIED` |
| repeated same-cause correction stops as `BLOCKED` | Prompt/skill contract verified | behavioral `LOCAL PROOF REQUIRED` |
| fresh returned state may avoid redundant `inspect_element` | Prompt/skill routing verified | efficiency `CURRENT-PROJECT VERIFIED` |

A front-view match cannot certify 3D depth. The local acceptance run must include a front-plausible / side-depth-wrong case.

## Cube / Group / Discovery Safety

Current source/contract verification includes:

- explicit finite Cube creation extents;
- intentional origin/pivot for non-zero initial Cube rotation;
- Bedrock-relevant Cube mutation state/effect reporting;
- exact no-op rejection for single/batch Cube correction;
- bounded multi-Cube mutation/preflight;
- `add_group` limited to Bedrock-authored create fields with finite origin/rotation;
- `duplicate_element` finite translation/overflow preflight;
- bounded `list_outline` breadth/depth;
- explicit `parent_group` values must be non-empty and scope descendants in that Group subtree;
- explicit `name_pattern` / `name_contains` values must be non-empty;
- discovery `min_size` / `max_size` components are finite and ordered per axis;
- optional explicit identities use omission—not empty strings—for documented current/selected fallback.

Status: **source/contract and representative live Blockbench integration are `CURRENT-PROJECT VERIFIED`.**

## Texture / Paint / PBR

Current default Bedrock semantics:

- `create_texture`, `activate_texture`, `list_textures`, and `get_texture` own normal texture lifecycle/evidence;
- Bedrock Entity is native `single_texture`; generic per-face `apply_texture` is not default-callable;
- `filter_by_material` is not default-callable because raw `face.texture` identity does not own effective Bedrock texture selection;
- Painter tools own pixel edits;
- TextureGroup/PBR tools own native Bedrock channel/config state;
- material-instance tools own native per-face `material_instance` metadata;
- texture identity/size/group/channel/render metadata returned by mutation should be reused before redundant rereads;
- RGBA tuple alpha is normalized correctly to TinyColor input semantics;
- filesystem image inputs use deterministic absolute-path rules.

Status: **source/contract and representative live texture/Paint/PBR/material-instance reachability are `CURRENT-PROJECT VERIFIED`.**

## Animation / Rig

Current source/contract verification includes:

- animation names normalize to one `animation.` prefix;
- explicit zero animation length is preserved;
- animation inspection is summary-first for effect keyframes;
- keyframe/timeline/batch/copy-paste requests reject several empty/no-op/invalid-time states;
- partial keyframe edits preserve omitted interpolation intent;
- bone hierarchy/cycle/delete recovery boundaries are hardened;
- animation specialist reuses known project/bone state before lifecycle/outline rereads.

Protected gaps still include direct animation controller ownership and unsupported sound/timeline-effect mappings.

Status: **source/contract and live create/inspect/keyframe/timeline/playback behavior are `CURRENT-PROJECT VERIFIED`.**

## Locator / Null Object

Direct source ownership exists in the Elements family for:

```text
list_locator_elements
manage_locator
manage_null_object
inspect_element
rename_element
remove_element
```

Source contracts include finite authored transforms, explicit parent/identity handling, and resulting state. Null Object remains distinct from normal Locator semantics.

Status: **source/contract plus live create/update/inspect/rename/remove/Undo and `.bbmodel` reopen are `CURRENT-PROJECT VERIFIED`.**

## MCP Client / Tool Exposure

Source audit confirms the default registered surface remains 62 tools and the current agent routing supplies high-signal stage intent. What is **not** yet known is how the installed Codex client actually handles that catalog:

- direct schema injection vs native deferred/tool search;
- representative domain reachability;
- actual prompt/skill co-loading;
- real context/token/latency cost;
- whether duplicated text + `structuredContent` is material to the client.

Status: live endpoint reachability is `CURRENT-PROJECT VERIFIED`; native catalog refresh behavior in this long-running Codex task remains `UNKNOWN` because its injected tool list stayed cached.

Do not add a BlockIT custom router/profile based solely on static catalog size.

## Stopped / Deferred Source Slices

These are not active source TODOs without new evidence:

- animation action/input contract cleanup;
- Paint cleanup;
- material-instance mutation/read cleanup;
- bounded `nodes://` serialization;
- generic Group identity consolidation;
- `manage_keyframes create` collision slice.

A live local failure may provide new evidence, but baseline acceptance should not reopen them by default.

## Protected Native Capability Gaps

Still protected requirements when a real workflow needs them:

```text
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animation controllers
animation sound/timeline effects
animated-texture authoring
bone-binding expressions
```

Do not emulate them with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, or another format.

## Explicitly Unsupported As Modelling Authority

- automatic image→Cuboid reconstruction as geometry truth;
- SF3D/mesh decomposition as Bedrock geometry authority;
- IoU/projection/similarity scores as automatic resemblance approval;
- successful Cube placement as visual approval;
- screenshot-per-mutation or per-Cube approval quotas;
- arbitrary fallback coordinates/pivots;
- editor selection or first duplicate-name match as silent mutation identity;
- silently broadening an explicit invalid/empty discovery filter;
- fixture-specific build rules promoted to generic product behavior.

## Remaining Evidence Limits

Procedure owner:

[`docs/knowledge/operations/local-acceptance-runbook.md`](../knowledge/operations/local-acceptance-runbook.md)

Only Codex client telemetry/catalog-refresh behavior remains `UNKNOWN`; the completed task did not expose enough evidence to distinguish injected-schema caching from native deferred search. This does not justify a BlockIT router/profile change.
