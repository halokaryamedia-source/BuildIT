# Next Action

Updated: 2026-08-11

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench** while preserving every capability that genuinely belongs to Bedrock Entity.

Product rule:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. A missing MCP mapping for a native Bedrock capability is a protected implementation gap, not deletion permission.

## Current Status

`MCP_TOOL_EXPOSURE_WIRE_AUDIT_COMPLETE_LOCAL_DEFERRED_LOADING_PROOF_REQUIRED`

Working branch: **`Local` only**.

Live Blockbench/MCP behavior still requires local proof. Source, CI, and official-source evidence must not be presented as live Blockbench proof.

## Completed Boundary

```text
P0.1–P0.5  stabilization and engineering gates                  COMPLETE
P1.1       default Bedrock Entity registration profile          COMPLETE
P1.2       explicit family gates                                COMPLETE
P1.3       core identity / mutation-result ownership            COMPLETE
P1.4       stateless transport source/non-local proof           COMPLETE; LOCAL PROOF REQUIRED

Pre-local plugin surface:
A  BlockIT product identity                                     COMPLETE
B  truthful exposed/catalog/available panel surface            COMPLETE
C  Tool Test disabled-definition containment                   COMPLETE
D  Bedrock capability surface matrix                           COMPLETE
E  generic semantics narrowing                                 COMPLETE
F  canonical Bedrock Entity MCP prompt                         COMPLETE
G  repository-owned BlockIT agent skill stack                  COMPLETE
H  BlockIT docs/install normalization                          COMPLETE

Native Bedrock capability coverage:
Locator authored state                                          SOURCE COMPLETE; LOCAL PROOF REQUIRED
Null Object base parent/position state                          SOURCE COMPLETE; LOCAL PROOF REQUIRED
Null Object IK metadata mutation                                DEFERRED — not Bedrock locator geometry

P1.5       local end-to-end core acceptance                    BLOCKED ON LOCAL ENVIRONMENT
```

## Product Surface

Visible plugin identity:

```text
BlockIT — Bedrock Entity MCP
```

The plugin panel should show only information that directly helps operation:

```text
name
version
active profile
endpoint
transport
truthful exposed/catalog/available counts
```

Do **not** add commit identifiers, build revisions, build channels, or build-fingerprint machinery to the plugin/runtime surface. Git history already owns source revision tracking.

Default profile:

```text
bedrock_entity
```

Dangerous tools remain quarantined:

```text
risky_eval      disabled
from_geo_json   disabled
```

Generic fallback families remain explicit opt-in only.

## Canonical Prompt and Skills

Normal enabled MCP workflow prompt:

```text
bedrock_entity_workflow
```

Maintainer-only prompt references remain disabled from the normal agent-facing MCP surface.

Repository-owned authoring skill routing:

```text
blockit-bedrock-entity-mcp
├── blockbench-bedrock-modelling
├── blockit-bedrock-texturing
└── blockit-bedrock-animation
```

Do not use upstream generic Mesh/Hytale/eval-oriented skills as the canonical BlockIT workflow.

## Model Creation Effectiveness Priority

The primary product goal is not MCP feature completeness. It is whether Codex can create a Bedrock Entity model that actually resembles the approved reference.

Current problem order:

```text
P0  false visual approval
P0  wrong primary geometry decomposition
P0  cross-view / depth hallucination
P1  patch churn / sunk-cost preservation
P1  correction accuracy
P1  tool-choice/context friction
P2  texture and animation sequencing
P3  specialized native capability gaps when a real workflow needs them
```

Problem/solution owner: `docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md`.

The false-approval solution is now a mandatory difference-first `FAIL / UNVERIFIED / PASS` verdict contract in the modelling skill, canonical MCP prompt, visual-validation policy, and Reference Fidelity decision. No new visual scoring or automatic similarity tool was added.

## Locator / Null Object Coverage

Direct Locator/Null Object authored-state ownership now remains inside the existing Elements family; no new registration family or generic element framework was introduced.

```text
list_locator_elements   discover Locator / Null Object identity + parent
inspect_element         inspect detailed authored state
manage_locator          create/update Locator parent, position, rotation, ignore_inherited_scale
manage_null_object      create/update Null Object parent + position
rename_element          rename existing element
remove_element          remove existing element
```

Mutation rules:

```text
Bedrock format only
explicit Group/bone parent
UUID-first target resolution
exact unique name fallback only
parent preflight before Undo
one bounded Undo edit
failure after open -> cancel/revert
structured resulting state
```

Null Object is not treated as identical to a normal Locator. Blockbench Bedrock geometry round-trips it through a `_null_` locator entry. `ik_target`, `ik_source`, and `lock_ik_target_rotation` are inspectable editor/animation state but are intentionally not mutation fields in this minimum slice.

Locator and Null Object creation now share deterministic exact-name behavior: both reject an existing same-type exact name before Undo, matching their UUID-first / unique-exact-name resolvers. No cross-type naming restriction was added.

Locator/Null Object authored transforms now require finite 3D coordinates at the MCP boundary. Their resulting/read state also refuses to serialize a pre-existing non-finite position/rotation, preventing `JSON.stringify` from silently turning poisoned numeric state into `null`. Parent, Undo, serialization, and family ownership are unchanged.

`inspect_element` now applies the same truthful numeric evidence rule across Cube, Group, Locator, and Null Object transforms. Pre-existing non-finite authored coordinates cause an explicit inspection error instead of being serialized as JSON `null`; identity resolution and inspection payload shape are otherwise unchanged.

## Protected Native Capability Gaps

The following remain Bedrock Entity product requirements even where direct MCP ownership is incomplete:

```text
TextureMesh authoring and inspection
native Bedrock visible bounding-box fields
animation controllers
animation sound effects
animation timeline effects
animated-texture authoring
bone-binding expressions
```

Do not emulate these with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, or another format. Audit official Blockbench Bedrock source before implementing a direct owner.

## Current Narrowed Semantics

Normal BlockIT project creation targets only:

```text
bedrock
```

Normal model export supports only:

```text
bedrock  → Minecraft Bedrock geometry JSON
project  → editable Blockbench .bbmodel
```

Generic full-app screenshot and arbitrary editor-camera mutation are not part of the normal default workflow.

`nodes://` remains temporarily available as broad observability because TextureMesh still lacks a direct authored-state owner. Locator/Null Object coverage alone is not a reason to delete it yet.

## Next Allowed Step

If continuing non-local work before local Blockbench acceptance becomes available, continue **model creation effectiveness**, not capability completeness.

The current source slice has hardened **P0 — wrong primary geometry decomposition** around execution-success bias and premature detail.

The current source slice has hardened **P0 — cross-view / depth hallucination** and introduced a non-looping `BLOCKED` workflow outcome for unresolved evidence/runtime/correction blockers.

The current source slice has hardened **P1 — correction accuracy** by linking diagnosis to exact authored state, a declared structural invariant, and deterministic before/after mutation effects.

A bounded GitHub-only correction contract hardening now rejects Cube from/to combinations whose finite endpoints produce a non-finite derived size, preflights partial single/batch updates against current authored endpoints before Undo, and derives Cube centers from validated spans so inspection/mutation evidence cannot silently serialize overflow as `null`.

The current source slice has hardened **P1 — tool-choice / context friction** with a stage-gated normal geometry lane. Native Bedrock families remain available; specialist/convenience tools branch only when the active stage/intent requires them.

The current source slice has hardened **P2 — texture and animation sequencing**. End-to-end downstream production waits for the geometry/rig state it actually depends on; existing-asset texture-only/animation-only tasks may use current geometry as a baseline without inventing a geometry `PASS`; affected downstream work is revalidated after material geometry/hierarchy/pivot changes.

A bounded GitHub-only PBR contract hardening now rejects one resolved Texture identity being assigned to multiple PBR channels in the same create/configure call before Undo and rejects identity-only `configure_material` calls that contain no authored change. Blockbench stores one `pbr_channel` per Texture, so sequential multi-channel assignment would otherwise leave only the last authored channel while the request could imply several succeeded. Existing channel replacement policy is unchanged.

TextureGroup/PBR creation also rejects an exact existing TextureGroup name before Undo. Native Blockbench `TextureGroup.add()` does not uniquify names, while BlockIT later material/group lookup accepts a name only when exact and unique; create tools therefore cannot introduce a name ambiguity that later calls cannot resolve. Case-only names remain distinct because the current resolver is case-sensitive.

`save_material_config` now verifies the native save postcondition before reporting success: Blockbench must mark the material config saved and the target texture_set.json must exist. This prevents the MCP wrapper from claiming success when native save returns early, for example when the target directory is missing; native save ownership itself is unchanged.

`import_texture_set` now preflights content with Blockbench-compatible JSON parsing (including comments) and requires an object-valued `minecraft:texture_set` root before native import. It also rejects the exact TextureGroup name native import would collide with and verifies exactly one new TextureGroup appears, then returns that material identity. Native Undo and channel/image loading remain owned by Blockbench.

A bounded GitHub-only animation contract correction now preserves an explicitly accepted `animation_length: 0` when constructing the Bedrock animation payload, rejects empty `manage_keyframes` requests, preserves existing interpolation on partial keyframe edits, requires every edit/delete/select time to resolve to exactly one existing keyframe before mutation/selection, requires an explicit `loop_mode` for the timeline loop mutation, rejects incomplete/effective no-op batch offset/scale requests, preflights batch offset/scale times against the native 0..10000 authored-time range and prevents selected-keyframe collapse during scale, prevents empty animation copy/paste clipboard operations, requires action-specific copy/paste source/target state, removes the implicit X-axis fallback from `mirror_paste`, and preflights pasted data against the native authored-time range plus same-channel internal snapped-time collapse before Undo. Existing-target overwrite semantics are unchanged. The structured create result remains compact; AnimationCodec behavior and playback semantics are unchanged, and normalizes `create_animation` names so short `walk` and canonical `animation.walk` both produce exactly one `animation.` prefix. Existing-target overwrite semantics, AnimationCodec behavior, and playback semantics remain unchanged.

A bounded GitHub-only rigging contract correction now rejects empty `set_ik` updates, prevents target-only IK edits from implicitly forcing `ik_enabled=false`, rejects parent operations whose self/descendant/existing parent chain would create or extend a hierarchy cycle before Undo, rejects bone-create child adoption when a requested child is the chosen parent/ancestor of that parent, snapshots all descendant Groups/elements plus animations targeting any deleted Group before recursive bone delete, and keeps create/rename/mirror bone identities unique under the case-insensitive matching used by Bedrock animation import. Mirror derives and validates its intended counterpart name before duplication; exact no-op renames are rejected while case-only self renames remain valid. Omitted `ik_enabled` preserves the existing authored state. IK target resolution and local runtime proof requirements are unchanged.

Generic `remove_element` now mirrors the same recovery boundary for explicit Group deletion: the full deleted subtree and any animation targeting a deleted node are captured before recursive removal, while direct element removal captures the explicit target. This changes recovery correctness only; registration and removal capability are unchanged.

The final pre-local cleanup has hardened **Minimum Necessary Evidence**: bounds are conditional, specialists load lazily, checkpoints are risk-based, newly placed Cubes do not require per-Cube inspection, captures happen at meaningful gates/affected views only, simple Primary Form reasoning stays compact, and `UNVERIFIED` is not an automatic retry/search instruction. No runtime mode/profile/framework was added.

The Blockbench plugin runtime has also been cleaned before local acceptance: definition factories no longer create/register an unused singleton MCP server, each POST remains request-owned, active TCP sockets have an explicit unload owner, UI CSS/dialog/settings handles are torn down deterministically, dead session/SSE/system-instructions settings were removed, prompt loading is bundled-Local plus user override only, and MCP/package identity now consistently reports BlockIT. No Bedrock capability family or stateless request architecture was removed.

The final pre-local **Context & Payload Cleanup** keeps the same capability surface while reducing duplicated agent-facing prose: the canonical workflow prompt is compact, measured metadata hotspots are shortened without removing input constraints, panel descriptions use real tool descriptions, Texture resources no longer return raw `source`, and validator status is summary-only with lazy detail resources. Tool annotations were audited and already provide a read-vs-mutation hint across the full generated catalog, so no annotation churn was added. `nodes://` remains unchanged pending direct TextureMesh ownership.

`inspect_animation` now follows the same summary-first rule for particle effects: normal inspection returns effect counts/animator summary without full effect keyframe payloads, while `include_effect_keyframes=true` explicitly opts into detailed particle timing/data. Focused bone transform-keyframe inspection is unchanged.

`list_outline` now bounds breadth as well as depth: normal reads return at most 500 Cube/Group nodes, callers may explicitly raise the budget up to 5000, and `returned_nodes` / `truncated_at_max_nodes` make truncation explicit. `find_elements_by_criteria` remains the targeted continuation path; no pagination/resource framework was added.

Texture mutation/read payload ownership is now clearer: `create_texture` returns compact resulting metadata instead of embedding the created image bytes, while `get_texture` remains the explicit image-evidence path. `list_materials` and `get_material_info` also use compact JSON text without changing their data. Paint/PBR behavior and texture capability are unchanged.

Generic `apply_texture` is now default-disabled from the Bedrock Entity MCP surface. Official Blockbench defines Bedrock Entity as `single_texture`, hides native per-face Texture.apply actions for that format, and resolves non-null face textures through `Texture.getDefault()`. `activate_texture` remains the explicit active/default texture owner. This removes one misleading generic tool and its nested-Undo path without removing Bedrock texture creation, painting, PBR, or material-instance capability.

Element discovery now avoids misleading or unbounded result payloads: `find_elements_by_criteria` sets `truncated=true` only after a real extra match exists, and `filter_by_material` returns at most 200 matching Cubes by default (explicitly raisable to 1000) with the same accurate truncation signal. No cursor/pagination framework was added.

Material-instance Cube targeting now uses the shared core identity contract instead of the legacy first-match helper: explicit UUID wins, exact names must be unique, and ambiguous Cube names fail before read/mutation. The change is limited to material-instance tools; the generic legacy helper was not broadened without auditing its other callers.

A repository-wide caller audit then proved the old `findGroupOrThrow` / `findElementOrThrow` / `findTextureOrThrow` exports had no active MCP callers, so those ambiguous first-match helpers were removed instead of preserved as dead alternatives. The stale maintainer prompt now points new work to `coreIdentity` and no longer recommends quarantined risky evaluation.

A create-identity schema audit found that project, texture, TextureGroup/PBR material, and animation creation still accepted the empty string even though those values become later lookup identities. Those five create contracts now require a non-empty name, matching the existing Group/Locator/Null Object boundary. No new uniqueness, normalization, or naming framework was added.

Required explicit reference schemas now reject the empty string for element, texture, bone/group, and Cube targets. Optional current/selected fallbacks remain unchanged; the hardening only removes requests that could never identify a target.

Filesystem path ownership is now consistent across model export and texture-set import: both require an absolute POSIX, Windows-drive, or UNC path before filesystem access. The shared check is a small pure helper reused by the two existing callers; no filesystem abstraction/framework was introduced.

`create_texture` now follows the same deterministic filesystem rule for image-file inputs: inline `data:image/...` remains valid, while file inputs must resolve to an absolute POSIX/Windows/UNC path (directly or through `file://`). Relative paths and remote HTTP URLs are rejected before Blockbench file access.

`create_texture` pixel dimensions now require integer values within the existing 16..4096 range. Fractional pixel sizes are rejected at the MCP boundary; `create_project` is unchanged because it does not expose texture-dimension inputs, and no power-of-two restriction was added.

Cube authoring inputs now keep identity and face writes deterministic: create/rename Cube names cannot be empty, simple face lists contain at most the six native faces without duplicates, and custom-UV face lists cannot write the same face twice in one request. Empty face lists remain allowed because they are not inherently invalid authored geometry; no arbitrary Cube-batch size cap was added.

`capture_screenshot` is now a truthful current-editor-view read: the project selector was removed from its public schema and the helper no longer selects another ModelProject before capture. Canonical multi-view capture remains owned by `capture_model_views`; screenshot capability is preserved without a hidden state mutation.

`select_all_of_type` now advertises `destructiveHint=false` because it only changes editor selection state and does not author model data. Selection behavior is unchanged; the metadata correction reduces unnecessary destructive-tool friction.

Material-instance payload/mutation contracts are also bounded: empty face arrays are rejected before mutation, and `list_material_instances` now returns names + usage counts by default. Explicit `include_usages=true` returns at most 100 locations per instance by default (raiseable to 1000) with `usages_truncated` indicating omitted locations. No pagination/state framework was added.

The actual stateless MCP `tools/list` wire surface has been re-measured after Bedrock semantic containment: **64 enabled tools / 74,267 response characters**, including **49,240 characters of input schemas** and **12,298 characters of tool descriptions**. The previous 65-tool / 72,817-character value remains historical evidence from before `apply_texture` was default-disabled. A geometry-only 15-tool lane is still **not** adopted as the default because it would remove retained texture/animation/Locator paths. The next large usage lever remains real Codex native lazy/deferred MCP tool loading proof before any BlockIT router/profile architecture.

A follow-up default-registration footprint ranking confirms that schema size is concentrated in real downstream capability rather than obvious metadata waste: Animation + Paint account for approximately **25,034 / 51,357 (~48.7%)** of the compact Zod-derived schema ranking. A later full-catalog description audit corrected the initial outlier inference: `inspect_element` was still 614 characters and has now been compacted because it is a high-frequency geometry-lane read; `bone_rigging` remains the next >400-character description after its earlier compaction. Mass schema trimming, default capability removal, and a BlockIT-side geometry profile remain rejected; local A/B exposure proof should use Codex client-side `enabled_tools` against the unchanged full surface.

No-loss wire cleanup also removes exact duplicate Cube correction aliases (`cube = after` and batch `cubes = effects[].after`) and keeps recovery JSON compact while preserving the authoritative `before` / `after` / `geometry_effect` data.

The final pre-local **Asset Authoring Usage Slimming** adds a dedicated asset-authoring fast path that skips repository-development boot context, `development-brief`, and unrelated specialists unless the active modelling decision needs them. The BlockIT orchestrator and modelling skill are compact operating contracts, coherent Cube/view batches are preferred where already justified, redundant post-mutation reads are avoided when a mutation already returns the required authored state, high-frequency JSON text is compact, and `export_model` defaults to metadata-only content return when writing to a filesystem path. No Bedrock capability/profile, visual gate, or local-proof requirement was removed.

A bounded GitHub-only **canonical framing numeric hardening** now rejects non-finite explicit target-envelope coordinates and finite endpoints whose subtraction would produce a non-finite span, derives explicit-envelope midpoints from validated spans, and applies the same finite-span/overflow-safe midpoint rule to rendered model bounds used by model framing. This closes the framing numeric boundary without changing canonical camera behavior, framing policy, or the local visual-proof requirement.

**Proof boundary:** modelling-effectiveness CI tests are source/contract regression proof. They are not behavioral proof that Codex follows the workflow, and they are not visual proof that a live model resembles its reference.

The next authoritative modelling-effectiveness step is:

```text
LOCAL — reference-fidelity acceptance scenarios
```

Use real Codex + Blockbench runs to test the product loop rather than adding another policy/tool abstraction:

1. difficult reference -> coarse primary geometry -> difference-first visual gate;
2. front plausible / side-depth wrong -> `FAIL` or `UNVERIFIED`, never false full PASS;
3. diagnosed local mismatch -> invariant-backed correction -> structural effect -> fresh visual proof;
4. unresolved evidence/capability/correction loop -> explicit `BLOCKED` report;
5. geometry `FAIL` -> no production texture/animation;
6. accepted geometry -> texture -> animation when required -> affected downstream revalidation after any later material geometry/rig change;
7. texture-only / animation-only existing-asset task -> bounded domain work without pretending the baseline geometry was reference-approved;
8. efficiency trace -> record tool calls by purpose and flag redundant bounds/discovery/per-Cube inspect/capture/checkpoint/specialist loads;
9. simple happy-path model -> demonstrate that strict validity can complete with one meaningful primary visual gate rather than screenshot-per-mutation ceremony.

If the local environment is unavailable, do **not** invent another modelling framework, readiness state machine, planner, scoring system, efficiency mode, or capability slice merely to keep work moving. Continue non-local work only for a concrete source defect, failing existing gate, or explicit product requirement with direct modelling value.

When the local Blockbench environment is available, local acceptance still needs to verify the stateless endpoint plus actual Locator/Null Object create/update/inspect/rename/remove behavior and Bedrock save/reopen/export round-trip before the Locator slice is considered runtime-proven.

P1.5 remains blocked until the required local acceptance boundary is available.
