# Next Action

Updated: 2026-08-25 — Codex Bedrock agent-legibility contract verified; current full MCP gate green

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
CODEX_BEDROCK_FIRST_CALL_CONTRACT_COMPLETE
MCP_ROUTER_CI_COVERAGE_COMPLETE
INVALID_EXPLICIT_PHASE_FAILS_CLOSED
LEGACY_CONTRACT_TEST_RECONCILIATION_COMPLETE
CURRENT_FULL_MCP_VERIFY_GREEN
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

Shared MCP initialize now carries the minimum Bedrock coordinate invariant (`16 Blockbench units = 1 Minecraft block`, `x=width`, `y=height`, `z=length`, `+Y=up`) plus phase ownership/handoff semantics. It intentionally does **not** enumerate exact tool routes because shared namespace instructions are copied into tool-search corpus entries; exact routing belongs in the active specialist Skill.

## Codex First-Call Legibility

The active asset router now resolves common lookalike routes before discovery:

```text
normal Group/bone creation   → add_group
rig parent/pivot/IK/mirror   → bone_rigging
structural delete/rename     → remove_element / rename_element
one known Cube correction    → modify_cube
coherent multi-Cube correction → modify_cubes_batch
global UV/atlas readiness    → list_textures
```

It also carries first-call conditional invariants so Codex does not learn them by failed mutation: rotated Cube requires `origin`; `add_group` takes `name` or `groups`; `modify_cube` requires an authored change; Locator/Null create/update variants use their required fields. When conditional/action details matter, load that exact active-phase spec once, then repair validation on the same routed tool rather than switching to a lookalike tool.

Texturing now treats `list_textures.uv_audit.production_gate` as the global UV gate, routes Painter by styling intent, and explicitly guards the current provisional `create_texture` 16×16 blank default: production Codex must pass the current project logical UV dimensions (128 default / 256 opt-in) instead of omitting blank Atlas size.

Persistent asset continuity may retain scale and canonical `front_direction` when they are resume-critical so a later Codex session does not re-guess orientation or block-to-unit conversion.

Primary owners:

```text
mcp/lib/authoringPhase.ts
mcp/server/prompts.ts
mcp/server/server.ts
mcp/index.ts
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
.agents/skills/blockit-bedrock-texturing/SKILL.md
.agents/skills/blockit-bedrock-animation/SKILL.md
workspace/README.md
mcp/tests/authoring-phase-surface.test.ts
mcp/tests/codex-agent-legibility-contract.test.ts
.github/workflows/mcp-verify.yml
```

## Verification Boundary

**Success Metric:** active instructions, current-phase prompt body, exposed tools, specialist routing, first-call invariants, readiness, and handoff behavior agree without foreign-phase search or unnecessary lookalike-tool guessing.

**Forbidden Proxy / Non-Goal:** do not treat lower tool count, shorter prompts, fewer characters, a green exact-wording assertion, or raw call count alone as proof that Codex understands context or that Authoring Efficiency improved.

**Static Footprint** remains only a guardrail; lower tool/prompt size does not itself prove Authoring Efficiency.

Current full MCP verification is green on commit `fc11428839ee21c1fe34251f6dafa2d1d7336877`: typecheck, contract tests, default MCP surface measurement, production build, and generated docs freshness all passed. Repository Verify also passed on the same source commit.

The routed exact-name discovery regression retains `top_8_recall = 1` with no routed top-8 misses. Raw semantic discovery remains a stress metric, not the intended first decision path.

Source/CI still cannot prove future Codex call efficiency or live Blockbench visual quality.

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

The current agent contract guards this gap by requiring explicit project-sized blank Atlas dimensions. It does **not** claim the underlying `create_texture` default has already changed.

Before landing the public-contract candidate, run canonical Bun generation and the normal MCP gate. Do not hand-edit generated docs.

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

Codex Bedrock first-call legibility hardening and its CI routing are complete with full static verification. STOP here. A live exact-current Codex/Blockbench authoring run is still required to prove reduced looping or improved accepted model quality. The context-aware Texture Atlas runtime candidate remains a separate bounded source task.
