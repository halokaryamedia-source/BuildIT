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
NO LOCAL RUN ACTIVE
LOCAL CODEX EFFICIENCY TEST DEFERRED BY USER
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`; do not duplicate it here.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement or actual Codex usage reduction without matching runtime proof. Visual fidelity, playback, persistence, and installed-client call/token efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface.

## User-Directed Pre-Local Efficiency Continuation

The user explicitly deferred Codex-local efficiency testing and requested only improvements that can be justified before local runtime evidence.

Integrated source work:

```text
cc8f814dfded0700372287e1fc0536a8ce7db282
refactor(authoring): compact active skill instructions

2167c3a691144ffff36bb6b563e0d08d8747db59
test(discovery): align static evaluator with 64-tool surface

2e2f5346a4f318249c491c2e44cc944011c69c13
refactor(mcp): compact locator schema guidance

9927f0d59d77ed27312f2d9dafde478367827ca9
fix(mcp): restore material discovery cleanup

0344b3cac1b6fc53be4ef20e4f7e7cc6062e25a7
refactor(mcp): compact shared identity schema guidance

226a09b9b7a723ebde1d8f898659e014d35ba0a5
merge(mcp): finalize shared schema compaction
```

Current pre-local efficiency scope:
- active authoring instruction owners are compacted without removing Bedrock capability or visual-quality gates;
- the static tool-discovery proxy expects the 64-tool source and includes `manage_animation_effects` cases;
- Locator/Null Object branch schema descriptions keep required create/update guidance while removing repeated prose;
- `get_face_material_instances` and `list_material_instances` use concise human summaries plus canonical `structuredContent`, while list usage detail remains opt-in and bounded;
- high-reuse shared identity schemas keep target type, UUID/name, and fallback semantics while dropping redundant `non-empty` prose already represented by `minLength` constraints;
- the shared identity compaction is guarded by a static efficiency contract that checks concise descriptions and rejection of empty-string IDs;
- no custom router, lean/profile mode, dynamic endpoint split, tool deletion, media-resolution reduction, or runtime telemetry was added;
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
- runtime registration keeps the additions inside the existing animation family;
- canonical docs-manifest source includes `animationEffectToolDocs`;
- static surface owner expects exactly 64 default tools.

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions.

## Verification Result So Far

Static/source integration is coherent, but canonical PASS for the current 64-tool state is **not claimed**.

Generated artifacts remain stale relative to the integrated animation source:
- `mcp/docs/api.json` still predates the animation-effect integration;
- `mcp/docs/index.html` still reflects the older Animation tool count;
- `mcp/prompts/manifest.json` still contains the older protected-gap wording.

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

The user's Windows workstation and Codex-local authoring test are not required for the current pre-local/static work. `docs/foundation/validation-report.md` remains the proof owner for completed canonical/live evidence.

## Next Step

1. Continue the exact 64-tool static surface audit only where current source demonstrates redundant schema/description/tool-result representation; do not broad-minify metadata.
2. Prefer high-reuse metadata owners and repeated schema text first because one safe compaction reduces multiple advertised tool schemas without changing behavior.
3. Preserve discovery-critical terms (`UUID`, target type, fallback semantics, branch requirements) and explicit correctness guidance; schema constraints may own facts that do not need to be repeated in prose.
4. Treat recovery-only or already-compact tools as `NO CHANGE REQUIRED` unless a concrete payload/default-detail problem is demonstrated.
5. Keep tool count, capability, routing semantics, visual-quality gates, and explicit large-detail opt-ins unchanged.
6. Do not start Codex-local testing, local acceptance, router/profile redesign, tool removal, or media-resolution experiments without a fresh user instruction.

The pending Animation generated-artifact/canonical gate remains real but is not the current user-selected next development objective.
