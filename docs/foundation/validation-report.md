# BlockIT Foundation Validation Report

**Updated:** 2026-08-11  
**Scope:** current `Local` source, current foundation/skill policy, non-local CI/static proof, official-source-backed semantics, and remaining local acceptance gaps.

This report answers **what level of evidence currently exists**. Active task status belongs in `docs/knowledge/next-action.md`; local test procedure belongs in `docs/knowledge/operations/local-acceptance-runbook.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the current target environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream source/docs support the capability/semantics, but current-project live integration may still be unproven.
- `LOCAL PROOF REQUIRED` — current source/contract exists, but live Codex/Blockbench proof is still required.
- `UNSUPPORTED` — available evidence shows the method should not be relied on.
- `UNKNOWN` — insufficient/conflicting evidence.

## Current Overall Status

```text
NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED
```

Non-local source/contract/CI/documentation cleanup is complete. Live runtime, client exposure, visual behavior, and persistence remain the authoritative next evidence boundary.

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

## Non-local Engineering Proof

Current repository gates have passed for the pre-local source state:

```text
frozen-lockfile install
strict TypeScript typecheck
156 Bun contract tests
production build
prompt manifest generation
generated MCP docs freshness
diff hygiene
pinned-SDK tools/list measurement
```

This is **source/contract/build proof**, not live Blockbench or Codex behavior proof.

## Project / Lifecycle / Export

| Capability | Source status | Live status |
|---|---|---|
| `create_project` fixed Bedrock product format | Source/contract verified | `LOCAL PROOF REQUIRED` |
| compact lifecycle state from create/info/export | Source/contract verified | `LOCAL PROOF REQUIRED` |
| path-writing export uses native lifecycle owner/postconditions | Source/contract verified + native semantics audited | `LOCAL PROOF REQUIRED` |
| Bedrock geometry export + editable `.bbmodel` product codecs | Source/contract verified | `LOCAL PROOF REQUIRED` |
| existing Bedrock multi-model target is not silently clobbered through direct bypass | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `.bbmodel` save/reopen fidelity | not provable non-locally | `LOCAL PROOF REQUIRED` |

## Observation / Reference Fidelity

| Capability | Source status | Live status |
|---|---|---|
| `inspect_model_bounds` finite structural envelope evidence | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `capture_model_views` bounded named model-view evidence | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `capture_screenshot` current-editor-view only | Source/contract verified | `LOCAL PROOF REQUIRED` |
| `inspect_element` focused authored state | Source/contract verified | `LOCAL PROOF REQUIRED` |
| difference-first `FAIL / UNVERIFIED / PASS` workflow | Prompt/skill/foundation contract verified | behavioral/visual `LOCAL PROOF REQUIRED` |
| repeated same-cause correction stops as `BLOCKED` | Prompt/skill contract verified | behavioral `LOCAL PROOF REQUIRED` |
| fresh returned state may avoid redundant `inspect_element` | Prompt/skill routing verified | efficiency `LOCAL PROOF REQUIRED` |

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

Status: **source/contract verified; live Blockbench integration remains `LOCAL PROOF REQUIRED`.**

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

Status: **source/contract verified; representative live texture/Paint/PBR/material-instance reachability remains `LOCAL PROOF REQUIRED`.**

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

Status: **source/contract verified; live create/inspect/keyframe/playback behavior remains `LOCAL PROOF REQUIRED`.**

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

Status: **source/contract complete; live create/update/inspect/rename/remove and save/reopen/export round-trip remain `LOCAL PROOF REQUIRED`.**

## MCP Client / Tool Exposure

Source audit confirms the default registered surface remains 62 tools and the current agent routing supplies high-signal stage intent. What is **not** yet known is how the installed Codex client actually handles that catalog:

- direct schema injection vs native deferred/tool search;
- representative domain reachability;
- actual prompt/skill co-loading;
- real context/token/latency cost;
- whether duplicated text + `structuredContent` is material to the client.

Status: `LOCAL PROOF REQUIRED`.

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

## Local Acceptance Required Now

Procedure owner:

[`docs/knowledge/operations/local-acceptance-runbook.md`](../knowledge/operations/local-acceptance-runbook.md)

The local pass must cover:

1. plugin build/load + stateless endpoint;
2. native Codex exposure/search and representative domain reachability;
3. Cube/Group observation/correction/Undo;
4. difference-first reference-fidelity behavior;
5. texture/Paint/PBR/material-instance reachability;
6. animation reachability/playback;
7. Locator/Null Object operations;
8. `.bbmodel` save/reopen + Bedrock export persistence;
9. observed efficiency/redundant-call trace.

After the run, update this report with actual `CURRENT-PROJECT VERIFIED`, remaining `LOCAL PROOF REQUIRED`, `UNSUPPORTED`, or `UNKNOWN` states. Do not rewrite old reviews as if their historical evidence changed.
