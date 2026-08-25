# Next Action

Updated: 2026-08-25 — Phase Contract v2 context hardening; Texture Atlas candidate remains separate

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
MCP_BOX_UV_AUTO_LAYOUT_SOURCE_APPLIED
SIMPLE_RIGID_FAST_PATH_HARDENED
CANONICAL_AUTHORING_STAGE_VOCABULARY_ALIGNED
MCP_CORE_PLUS_SINGLE_AUTHORING_PHASE_SOURCE_APPLIED
PHASE_CONTRACT_V2_AGENT_LEGIBILITY_SOURCE_APPLIED
PHASE_SPECIFIC_RUNTIME_PROMPT_SOURCE_APPLIED
COMPACT_PHASE_HANDOFF_STATE_SOURCE_APPLIED
ACTIVE_SPECIALIST_ONLY_ROUTING_SOURCE_APPLIED
INVALID_EXPLICIT_PHASE_FAILS_CLOSED
TEXTURE_ATLAS_PUBLIC_CONTRACT_CANDIDATE_REBASE_REQUIRED
LIVE_RETEST_DEFERRED_BY_USER
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. Current source + relevant proof remain authority.

## Phase Contract v2

Codex receives:

```text
MCP CORE
+
exactly one ACTIVE PHASE
+
only the current phase workflow
+
only the current phase specialist
```

Ownership:

```text
GEOMETRY  = Cube/Group/rig/Locator/Null + structural mutation + UV Layout
TEXTURING = Texture Atlas + Painter + PBR + material instances + Texture Verify
ANIMATION = authored motion + keyframes + timeline + effects + controllers
```

Foreign-phase need:

```text
HANDOFF_REQUIRED
target_phase: <geometry|texturing|animation>
reason: <why current phase cannot own the next mutation>
readiness: <latest verified gates relevant to handoff>
resume_from: <current model/project + immediate target identifiers>
action: set MCP Authoring Phase=<target>; reload BlockIT MCP
STOP
```

`resume_from` is compact. Preserve an exact UUID only when the immediate next mutation needs it. Do not build a UUID registry or tool-call transcript.

### Readiness

```text
Geometry → Texturing
geometry=PASS
uv_layout=PASS
final Box-UV lock complete where applicable
list_textures audit has no unresolved invalid/out-of-bounds/partial-overlap blocker

Texturing → Animation
texture_verify=PASS
no unresolved Geometry/UV blocker
required texture/material state current

Animation structural defect → Geometry
HANDOFF_REQUIRED; Animation does not borrow bone_rigging
```

An absent phase setting defaults to Geometry. An explicit invalid setting is a configuration error and stops MCP startup instead of silently pretending Geometry is active.

## Runtime Prompt Rule

`mcp/prompts/bedrock_entity_workflow.md` remains the full canonical pipeline source. Runtime prompt generation selects only shared Minimum Necessary Evidence plus current-phase sections. Animation receives a compact Animation workflow owned by runtime prompt registration. Later phases are handoff targets, not callable routes.

Primary owners:

```text
mcp/lib/authoringPhase.ts
mcp/server/prompts.ts
mcp/server/server.ts
mcp/index.ts
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
.agents/skills/blockit-bedrock-texturing/SKILL.md
.agents/skills/blockit-bedrock-animation/SKILL.md
AGENTS.md
workspace/README.md
mcp/tests/authoring-phase-surface.test.ts
```

## Verification Boundary

**Success Metric:** active instructions, current-phase prompt body, exposed tools, specialist routing, readiness, and handoff behavior agree without foreign-phase tool search.

**Static Footprint** remains only a guardrail; lower tool/prompt size does not itself prove Authoring Efficiency.

Current full MCP suite contains legacy exact-wording/retired-ceremony assertions. Do not restore `Reference Evidence Map`, old routing ceremony, or other retired prose merely to make those assertions green. Reconcile legacy tests separately by classifying each failure as current invariant, stale exact-string assertion, or legitimate regression.

Targeted phase-contract tests are the immediate static proof owner for this pass. Source/CI cannot prove future Codex call efficiency or live Blockbench visual quality.

## Texture Atlas Public Contract — Still Separate

The old candidate intent remains useful but must be rebased onto current `Local` before landing:

```text
2aa0a29a2f3d081a3f2765db41f2460524ff3fee
```

Intent:

- blank base Texture Atlas omitted size → project UV dimensions, fallback 128×128;
- variant/PBR support atlas omitted size → inherit base atlas bitmap size;
- imported image keeps authored dimensions;
- explicit blank sizes remain intentional;
- semantic Texture/Painter public descriptions stay aligned with UV Layout / Texture Atlas / Texture Styling / Texture Verify.

Before landing, run canonical Bun generation and normal MCP gate. Do not hand-edit generated docs.

## Deferred Until Evidence

Do not implement automatically:

- aggregate UV working map beyond current `list_textures` audit;
- Painter batching;
- targeted Canvas refresh redesign;
- telemetry/session logger;
- mega-tools or dynamic live phase switching;
- `get_phase` / `switch_phase` ritual tools;
- live authoring/model test.

## STOP

After phase-context source + targeted CI review, STOP. Legacy-suite reconciliation and Texture Atlas candidate completion are separate bounded tasks. Live model retesting remains deferred.
