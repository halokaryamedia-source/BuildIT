# Next Action

Updated: 2026-08-19

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
ANIMATION_D1_EFFECT_MUTATION_SOURCE_IN_LOCAL
ANIMATION_D2_CONTROLLER_EFFECT_SOURCE_IN_LOCAL
ANIMATION_D3_MATH_PROPERTY_SOURCE_IN_LOCAL
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_CREATE_INSPECT_MODIFY_SYMMETRY_STATIC_AUDIT_COMPLETE
ANIMATION_FINAL_STATIC_ARCHITECTURE_AUDIT_COMPLETE
ANIMATION_LOCAL_SOURCE_INTEGRATION_STATIC_VERIFIED
ANIMATION_GENERATED_ARTIFACTS_STALE
ANIMATION_CANONICAL_CI_EXECUTION_NOT_OBSERVED
PRELOCAL_STATIC_EFFICIENCY_ACTIVE
AUTHORING_SKILL_STACK_COMPACTED_STATIC
TOOL_DISCOVERY_EVALUATOR_64_SYNC_IN_LOCAL
LOCATOR_SCHEMA_GUIDANCE_COMPACTED_STATIC
MATERIAL_DISCOVERY_RESULTS_COMPACTED_STATIC
SHARED_IDENTITY_SCHEMA_GUIDANCE_COMPACTED_STATIC
PROJECT_INFO_METADATA_ALIGNED_STATIC
RUNTIME_WORKFLOW_PROMPT_COMPACTED_STATIC
TEXTURE_OPTIONAL_IDENTITY_GUIDANCE_COMPACTED_STATIC
PAINT_FILL_UNSUPPORTED_TOLERANCE_REMOVED_STATIC
TEXTURE_LAYER_ACTION_SCHEMA_AUDIT_NO_CHANGE
PBR_MATERIAL_READ_RESULTS_COMPACTED_STATIC
PBR_MUTATION_RETURN_STATE_REUSED_STATIC
NO LOCAL RUN ACTIVE
LOCAL CODEX EFFICIENCY TEST DEFERRED BY USER
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface.

## User-Directed Pre-Local Efficiency Continuation

The user deferred Codex-local efficiency testing and requested only improvements justified before local runtime evidence.

Integrated source work:
- `cc8f814dfded0700372287e1fc0536a8ce7db282` — compact active authoring skill instructions.
- `2167c3a691144ffff36bb6b563e0d08d8747db59` — align static discovery evaluator to 64 tools.
- `2e2f5346a4f318249c491c2e44cc944011c69c13` — compact Locator/Null Object schema guidance.
- `9927f0d59d77ed27312f2d9dafde478367827ca9` — compact material discovery result representation.
- `0344b3cac1b6fc53be4ef20e4f7e7cc6062e25a7` — compact shared identity schema guidance.
- `d4a8eab1f9db99afc080cc4d8fe41545719d7082` — align `get_project_info` metadata to its actual result.
- `7630fdb1b230cd1f2fda193b92cbf1662ff71d88` — compact runtime workflow guidance while retaining hard quality gates.
- `5dc1ae48abfb97ca65ec86f442edf051e9a3690a` — compact shared optional Texture identity guidance.
- `a927b64a0e0c53620da3b7aa7c0dc620daebcb2d` — remove unsupported `paint_fill_tool.tolerance` from the advertised/runtime surface.
- `11af2e5f7ecf2e50913089a8400453470ebc7d50` — move `list_materials` / `get_material_info` PBR state from serialized JSON text to concise summaries plus canonical `structuredContent`.

Current scope:
- authoring instructions are shorter without removing Bedrock capability or visual-quality gates;
- the static tool-discovery proxy expects 64 enabled tools and includes `manage_animation_effects`;
- Locator/Null Object and high-reuse identity schemas retain target/UUID/fallback/branch semantics while removing repeated prose;
- optional Texture identity guidance is shortened at the shared schema owner and fans out across normal Paint tools plus `get_texture`; its fallback to selected/default remains explicit and empty identifiers remain rejected;
- `paint_fill_tool` no longer advertises synthetic `tolerance` that native fill rejects, removing a known invalid-call/retry path without changing native fill behavior;
- `texture_layer_management` action-specific fields were audited: `opacity`, `blend_mode`, `target_index`, and rename `layer_name` are conditionally required by runtime, but the current MCP registration owner flattens discriminated-union branches into one top-level field map and only marks fields required when required in every branch. A nine-branch union therefore would not expose conditional requirements to the client and would duplicate common branch schemas; a top-level `superRefine` would only move the same failed call earlier. **NO CHANGE REQUIRED** for this efficiency objective until the registration/client evidence changes;
- `list_materials` now returns a short material-count summary with complete material/channel/config data in `structuredContent`; `get_material_info` returns a short identity/texture/preview summary while preserving texture metadata, config/file state, and compiled `texture_set_json` in `structuredContent`;
- PBR mutations now reuse their already-authored post-state: `create_pbr_material`, `configure_material`, and `assign_texture_channel` return concise summaries plus material identity/channel/config state in `structuredContent`; they do not compile `texture_set_json` or call the focused read tool merely to enrich the mutation result;
- PBR action-specific Texture/Material descriptions were reviewed but are not broad-minified because several own source-switch, `none`, uniqueness, or mutation-preflight semantics; treat those as `NO CHANGE REQUIRED` until a concrete serialized-surface offender is measured;
- material-instance discovery uses concise text plus canonical `structuredContent`, with usage detail still opt-in and bounded;
- `get_project_info` advertises lifecycle/format/logical-UV/counts only; hierarchy remains owned by `list_outline`;
- the runtime workflow prompt is compacted with hard reference/semantic-form/difference-first/texture gates retained, and the canonical PBR/`material_instance` non-gap wording restored;
- element/animation exact JSON mirrors with `structuredContent` remain owned by the central mirror compactor; no second global compactor was added;
- `U7  No change required` remains the rule for router/profile redesign without installed-client evidence;
- no custom router, lean/profile mode, endpoint split, tool deletion, media-resolution reduction, or runtime telemetry was added;
- no actual Codex token/call saving is claimed before a future user-authorized local comparison.

## Animation Source In Local

Integrated commit:

```text
33784de067525e8fcdd2510d6195c7b2ac85187e
feat(animation): integrate effect and Molang closure
```

Integrated scope:
- D1 `manage_animation_effects`: particle/sound/timeline add-update-remove with exact identity, bounded preflight, one Undo, and continuation state;
- D2 extends `manage_animation_controller` with controller-state sound/particle lifecycle;
- D3 extends `animation_timeline` with `set_anim_time_update` / `set_blend_weight`;
- runtime registration stays inside the existing animation family;
- canonical docs-manifest source includes `animationEffectToolDocs`;
- static surface owner expects exactly 64 default tools.

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions.

## Verification Result So Far

Static/source ownership is coherent, but canonical PASS for the current 64-tool state is **not claimed**.

Generated artifacts remain stale relative to Animation integration and later public metadata/prompt changes:
- `mcp/docs/api.json` predates the effect integration;
- `mcp/docs/index.html` reflects the older Animation tool count;
- `mcp/prompts/manifest.json` is stale relative to the runtime prompt source.

Canonical MCP gate remains:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

The Windows workstation and Codex-local authoring test are not required for current pre-local/static work. The current execution environment does not have repository-pinned Bun 1.3.14, so no canonical Bun PASS is inferred. `docs/foundation/validation-report.md` remains the proof owner for completed canonical/live evidence.

## Next Step

1. Perform one final bounded pre-local pass over normal-authoring mutation results for source-provable confirmation-read pressure or misleading success; prioritize owners that already hold exact post-state at the mutation boundary.
2. Do not enrich mutation responses by compiling artifacts, capturing images, or performing broad extra reads; exact local authored state only.
3. If no concrete high-value offender remains, record **NO CHANGE REQUIRED** and stop static micro-optimization until installed-client/local efficiency evidence is explicitly reactivated.
4. Keep `texture_layer_management` and similar action-dependent schemas as `NO CHANGE REQUIRED` unless a client-visible conditional-schema mechanism or installed-client evidence changes the decision.
5. Keep tool count, capability, routing semantics, visual-quality gates, and explicit large-detail opt-ins unchanged.
6. Do not start Codex-local testing, local acceptance, router/profile redesign, tool removal, or media-resolution experiments without fresh user instruction.

The pending generated-artifact/canonical Bun gate remains real but is not a Codex-local test.
