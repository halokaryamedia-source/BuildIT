# Next Action

Updated: 2026-08-27 — Hunyuan Route 1 multiview evidence recorded

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
ROUTE1_HUNYUAN_EXPERIMENT_SOURCE_APPLIED
ROUTE1_HUNYUAN_GATE1_PASS
ROUTE1_HUNYUAN_MULTIVIEW_PREFERRED
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. Current source + relevant proof remain authority.

## Phase Contract v2

```text
MCP CORE + exactly one ACTIVE PHASE + current phase workflow + current specialist

GEOMETRY  = Cube/Group/rig/Locator/Null + structural mutation + UV Layout
TEXTURING = Texture Atlas + Painter + PBR + material instances + Texture Verify
ANIMATION = authored motion + keyframes + timeline + effects + controllers
```

Foreign-phase need:

```text
HANDOFF_REQUIRED
target_phase: <geometry|texturing|animation>
reason: <why>
readiness: <latest gates>
resume_from: <current target>
action: set MCP Authoring Phase=<target>; reload BlockIT MCP
STOP
```

`resume_from` stays compact; keep a UUID only when the immediate next mutation needs it. Missing phase defaults to Geometry; an explicit invalid phase fails closed.

### Readiness

```text
Geometry → Texturing
geometry=PASS; uv_layout=PASS; final Box-UV lock complete where applicable
list_textures has no unresolved invalid/out-of-bounds/partial-overlap blocker

Texturing → Animation
texture_verify=PASS; no unresolved Geometry/UV blocker; required material state current

Animation structural defect → Geometry
HANDOFF_REQUIRED; Animation does not borrow bone_rigging
```

## Runtime / First-Call Contract

`mcp/prompts/bedrock_entity_workflow.md` remains the canonical full pipeline; runtime renders only shared minimum evidence plus the active phase.

Shared initialize carries `16 Blockbench units = 1 Minecraft block`, `x=width`, `y=height`, `z=length`, `+Y=up`, phase ownership, and handoff semantics. Exact route names stay in the active specialist Skill because copying them into shared namespace instructions pollutes tool-search corpus entries.

Common Geometry routes are explicit:

```text
normal Group/bone creation     → add_group
rig parent/pivot/IK/mirror     → bone_rigging
structural delete/rename       → remove_element / rename_element
one known Cube correction      → modify_cube
coherent multi-Cube correction → modify_cubes_batch
global UV/atlas readiness      → list_textures
```

First-call invariants are explicit: rotated Cube requires `origin`; `add_group` takes `name` or `groups`; `modify_cube` needs an authored change; Locator/Null create/update use their required branch fields. If action/conditional details matter, load the exact active-phase spec once and repair validation on the same routed tool.

Texturing treats `list_textures.uv_audit.production_gate` as the global UV gate. The current `create_texture` omitted-size default is still provisional 16×16, so production Codex must pass project logical UV dimensions explicitly (128 default / 256 opt-in). Persistent workspace state may retain scale and canonical `front_direction` when resume-critical.

Primary owners:

```text
mcp/lib/authoringPhase.ts
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
.agents/skills/blockit-bedrock-texturing/SKILL.md
.agents/skills/blockit-bedrock-animation/SKILL.md
workspace/README.md
mcp/tests/authoring-phase-surface.test.ts
mcp/tests/codex-agent-legibility-contract.test.ts
.github/workflows/mcp-verify.yml
```

## Verification Boundary

**Success Metric:** active instructions, exposed tools, specialist routing, first-call invariants, readiness, and handoff behavior agree without foreign-phase search or unnecessary lookalike-tool guessing.

**Forbidden Proxy / Non-Goal:** lower tool count, prompt characters, exact-wording assertions, or raw call count alone cannot prove Codex understanding or Authoring Efficiency.

**Static Footprint** is only a guardrail. Current full MCP verification is green on `fc11428839ee21c1fe34251f6dafa2d1d7336877`: typecheck, contract tests, surface measurement, production build, and docs freshness passed. Routed exact-name loading retained `top_8_recall = 1` with no top-8 misses.

Source/CI cannot prove live Blockbench visual quality or future Authoring Efficiency.

## Route 1 Hunyuan Mesh Evidence — Experimental

Source foundation lives under `Experimental/route1-hunyuan-poc/`. Production MCP behavior and authoring-phase ownership are unchanged.

**Goal:** test whether one shape-only Hunyuan3D 2.0 reconstruction gives useful depth/volume evidence that improves the primary Blockbench form authored through the existing Geometry MCP.

**Success Metric:** the accepted primary form is materially closer to the actual approved reference in silhouette, depth, proportions, part placement, and attachment relationships, with a lower Cost to Accepted Result.

**Forbidden Proxy / Non-Goal:** GLB export success, polygon count, attractive mesh rendering, raw MCP-call count, static source checks, or Hunyuan execution alone do not prove improvement.

**First Evidence Required:** one actual pinned local Hunyuan run on the target RTX machine, producing a fresh FRONT / SIDE / TOP / ISOMETRIC contact sheet that is visually inspected together with the actual approved reference.

**Failure Classification / first wrong owner:** `UNKNOWN` until that local mesh evidence exists. If the mesh is materially wrong, classify input preparation vs Hunyuan reconstruction before any Blockbench authoring.

Current next step:

```text
Preferred evidence: separated FRONT/SIDE/BACK MultiView GLB; render with `front_direction=+z`
→ use the approved Minecraft reference as visual authority
→ handoff to existing Geometry MCP when MCP runtime is available
→ primary Groups/Cubes only
→ one capture_model_views verification
→ one causal local correction OR one primary rebuild
→ verify
```

Do not add a solver, IoU gate, semantic mesh segmentation, multiview Hunyuan, Fast/Turbo tuning, provider routing, new MCP tools, or autonomous correction before matching runtime evidence proves that specific need.

## Texture Atlas Public Contract — Separate

Candidate `2aa0a29a2f3d081a3f2765db41f2460524ff3fee` still requires rebase + canonical docs generation. Intended behavior: omitted blank base Atlas size follows project UV (fallback 128), PBR/variant support inherits base bitmap size, imports preserve authored dimensions, explicit sizes remain intentional, and public Texture/Painter semantics stay aligned.

Until that candidate lands, the agent contract requires explicit project-sized blank Atlas dimensions. It does **not** claim the runtime default changed.

## Deferred Until Evidence

Do not implement automatically: aggregate UV working map, Painter batching, Canvas refresh redesign, telemetry/session logger, mega-tools/dynamic phase switching, `get_phase`/`switch_phase` ritual tools, live authoring/model tests, Route 1 coordinate solver, Route 1 IoU/silhouette scorer, Hunyuan multiview/Fast/Turbo variants, provider routing, new Route 1 MCP tools, or autonomous Route 1 correction.

## STOP

Codex Bedrock first-call legibility hardening and CI routing remain complete with full static verification. Route 1 remains experimental; the separated-reference MultiView GLB is the preferred local depth evidence, while SingleView and the earlier board-crop MultiView runs are rejected. This does not establish final visual quality or production promotion. Geometry MCP handoff remains conditional on MCP runtime availability. The Texture Atlas runtime candidate remains separate.
