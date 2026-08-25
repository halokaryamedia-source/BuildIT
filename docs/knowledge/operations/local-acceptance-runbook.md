# Local Acceptance Runbook

Updated: 2026-08-25  
Owner: local Codex/Opencode + desktop Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly points here.

This is the single procedure for BlockIT live acceptance.

## 1. Goal

Prove what source/CI cannot: exact installed plugin freshness, representative MCP/runtime behavior, real reference-driven model quality, and **Authoring Efficiency** on the exact artifact under test.

There are two acceptance lanes:

```text
TEST 1 — MCP / CORE MECHANICS
→ prove representative runtime behavior across deliberate authoring phases

TEST 2 — REFERENCE MODEL / AUTHORING EFFECTIVENESS
→ prove accepted model quality
→ then measure Cost to Accepted Result
```

Do not edit source before a reproducible failure or bounded benchmark identifies a concrete first wrong owner.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ this runbook
→ mcp/README.md + mcp/AGENTS.md only when MCP implementation matters
```

Read `CONTEXT.md` only when a stable project fact materially affects the decision. Do not load Git history or the full foundation set by default.

Before a quality/efficiency benchmark, preserve the Developing Execution Contract:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

## 3. Exact Local Build / Freshness Gate

Do not use package version as freshness proof. Record the exact `Local` HEAD and hash of the artifact prepared for Blockbench.

From repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Working tree must be clean. Then from `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin:

```text
mcp/dist/mcp.js
```

Record:

```text
Local HEAD
mcp/dist/mcp.js SHA-256
Blockbench version
Bun version
client/provider + version when visible
actual BlockIT file/path loaded by Blockbench
MCP endpoint
MCP Authoring Phase
Extended MCP Families setting
```

If exact artifact freshness cannot be established, classify `ENVIRONMENT / INSTALL` and stop before model-quality claims.

## 4. Load Current BlockIT / Reconnect MCP

Load the fresh repository build in desktop Blockbench. Fully restart/reload Blockbench, then reconnect/restart the MCP client so an old process or cached surface cannot count as proof.

Normal starting baseline:

```text
endpoint                = http://127.0.0.1:3000/bb-mcp
profile                 = bedrock_entity
active authoring phase  = geometry
Geometry tools/list     = 27 exposed tools
retained catalog        = 64 callable tools across phases
Extended MCP Families   = OFF
risky_eval              = disabled
from_geo_json           = disabled
artifact                = local BlockIT build only
```

Do **not** expect Geometry, Texturing, and Animation mutation tools to appear simultaneously. Runtime exposure is `MCP CORE + exactly one ACTIVE PHASE`.

With the plugin running:

```bash
bun run verify:stateless-local
```

The smoke script reads installed health identity, confirms the active profile/phase, and requires installed `tools/list` to exactly match the current source-owned phase surface. A mismatch means `ENVIRONMENT / INSTALL` or MCP surface regression; do not continue to visual claims.

Codex and Opencode are equivalent local execution surfaces for this procedure; provider identity is recorded, not treated as a different product contract.

## 5. Phase / Tool Exposure Sanity Check

For every phase used in the test, record:

```text
profile
active phase
exposed tool count
handoff source gate
handoff target
```

Foreign-phase tool absence is expected and is **not** a discovery failure. If the next required mutation belongs to another phase:

```text
HANDOFF_REQUIRED
→ record target_phase + reason + readiness + resume_from
→ set MCP Authoring Phase=<target>
→ reload BlockIT / reconnect MCP
→ continue only after tools/list reflects the target phase
```

Do not `tool_search` for a known foreign-phase mutation.

Observe retry/context/latency only when the client exposes it. Unknown telemetry stays `UNVERIFIED`. Do not convert tool-discovery scores, schema characters, prompt length, or catalog size into an Authoring Efficiency claim.

## 6. Test 1 — MCP / Core Mechanics

Purpose: prove representative plugin/MCP behavior independent of reference quality without defeating the phase boundary.

### Geometry pass

Start with `ACTIVE PHASE: GEOMETRY`.

Create a small Bedrock project with one or more Groups, a few Cubes, and one intentionally rotated Cube with an explicit justified origin.

Representative Geometry/Core path:

```text
create / focused inspect
→ coherent Cube/Group batching where appropriate
→ finite bounds + canonical model views
→ one causal correction
→ Undo / Redo
→ Locator / Null Object
→ .bbmodel / Bedrock geometry export when required
```

Confirm foreign Texturing/Animation mutations are absent rather than searched for.

### Geometry → Texturing handoff

When Geometry and UV Layout readiness are satisfied:

```text
geometry=PASS
uv_layout=PASS
final Box-UV lock complete where applicable
list_textures UV audit has no unresolved invalid/out-of-bounds/partial-overlap blocker
→ HANDOFF_REQUIRED(texturing)
```

Set `MCP Authoring Phase=texturing`, reload/reconnect, and rerun `bun run verify:stateless-local` if installed surface freshness is in doubt.

Representative Texturing path:

```text
Texture Atlas
→ Painter base/value/form/identity work
→ PBR / material instance when required
→ fresh get_texture + capture_model_views
→ Texture Verify
```

A Geometry/UV defect found here returns to Geometry through a handoff; Texturing must not borrow Cube/rig mutation.

### Texturing → Animation handoff

Only when the test requires animation and `texture_verify=PASS` with no unresolved structural blocker:

```text
HANDOFF_REQUIRED(animation)
→ set MCP Authoring Phase=animation
→ reload/reconnect
```

Representative Animation path:

```text
small animation with numeric or authored Molang value
→ representative animation effect mutation
→ one coherent AnimationController batch when required
→ inspect_animation only when mutation-returned state is insufficient
```

A structural bone/pivot/IK/parenting defect returns to Geometry. Animation must not borrow `bone_rigging`.

Do not try to exercise every tool. A bounded representative pass is sufficient unless the current task names a specific capability.

## 7. Persistence / Export

Verify only what the active claim requires:

```text
editable .bbmodel
Bedrock geometry export
```

Use explicit absolute paths. Reopen the `.bbmodel` only when persistence of the authored state under test matters.

## 8. Test 2 — Reference Model / Authoring Quality

Purpose: prove MCP can use **one currently approved reference** to make a recognizable, Minecraft-appropriate Geometry + Texture model.

The actual approved image must be visible to the local modelling context. A filename/path/README/memory is not image evidence. Keep nonvisual constraints such as target height or use separately in task context.

The validation reference is selected by the current user/task. Do **not** hard-code a fixture into product policy.

### Quality Gate

Geometry quality must be judged before efficiency:

```text
IDENTITY
PRIMARY FORM / PROPORTION
CROSS-VIEW COHERENCE
TOPOLOGY / ATTACHMENT
IMPORTANT NEGATIVE SPACE
MINECRAFT / BLOCKBENCH BUILDABILITY
```

When texture is required:

```text
PALETTE / MATERIAL IDENTITY
MAJOR MATERIAL REGIONS
PART SEPARATION / FORM READABILITY
IDENTITY-CRITICAL MARKINGS
CONTROLLED DETAIL DENSITY
```

A materially wrong major view, topology, attachment, or identity-critical form means **QUALITY FAIL**. Tool success, valid coordinates, export success, or low call count cannot override it.

When the approved reference uses the standard reference board, expected coverage is:

```text
SIDE | FRONT | BACK
TOP / FOOTPRINT | FRONT-SIDE 3/4
```

Reference discrepancy handling:

```text
MINOR
→ choose one canonical Minecraft interpretation
→ use best-supported visible evidence
→ continue with simplest recognizable buildable form

MATERIAL
→ CONFLICTING / BLOCKED
```

Test sequence:

```text
actual approved reference + handoff constraints
→ ACTIVE PHASE: GEOMETRY
→ Semantic Form / Primary Form
→ minimum coherent primary geometry
→ fresh judgeable model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
→ UV readiness
→ HANDOFF_REQUIRED(TEXTURING)
→ production texture only after geometry PASS
→ fresh Texture Verify evidence
```

Reject a correction that improves one view while materially regressing another. Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

## 9. Authoring Efficiency — Cost to Accepted Result

**Authoring Efficiency is evaluated only after the relevant quality gate passes.**

```text
QUALITY FAIL
→ efficiency claim is invalid

QUALITY PASS
→ compare justified work and unnecessary work
→ Cost to Accepted Result
```

Static Footprint — Skill/prompt characters, schema size, serialized catalog surface, or similar compactness ceilings — is a separate guardrail and cannot prove this runtime claim.

Record observable cost:

```text
Total meaningful MCP calls to Geometry PASS
Total meaningful MCP calls to Final PASS
Phase handoffs / reloads required by real workflow
Discovery calls
Redundant readbacks
tool_search calls / misses
place_cube calls / Cubes authored
add_group calls / Groups authored
capture_model_views calls / views requested
Correction attempts
Undo / recovery calls
Same-cause retries
Broad repository/state reads
```

A required phase handoff is not automatically waste. Classify it as avoidable only if an incorrect phase decision or stale installation caused the extra transition.

These are session observations, not a telemetry subsystem. Do not invent token or latency numbers when the client does not expose them.

### Call Classification

Classify meaningful calls when diagnosing waste:

```text
NECESSARY
AVOIDABLE
CONTRACT_CAUSED
REASONING_CAUSED
RECOVERY
```

Examples:

- immediate reinspection after a mutation that already returned sufficient state → `AVOIDABLE`;
- extra read required because the MCP result omitted decision-critical state → `CONTRACT_CAUSED`;
- wrong mutation from an incorrect visual hypothesis → `REASONING_CAUSED`.

### Correction Effectiveness

For every material correction:

```text
IMPROVED
UNCHANGED
REGRESSED
```

A useful convergence loop has high `IMPROVED` rate, zero blind same-cause retries, and affected-view verification rather than screenshot-per-mutation behavior.

Batch only when state is **known + coherent**. Uncertain geometry should use the minimum hypothesis needed to obtain new evidence.

## 10. Failure Classification / First Wrong Owner

Use the first category that explains the observed failure:

```text
AGENT_REASONING
SKILL_INSTRUCTION
MCP_PUBLIC_CONTRACT
MCP_RESULT_QUALITY
MCP_PHASE / HANDOFF
STATE_DISCOVERY
VISUAL_FEEDBACK
CORRECTION_CAPABILITY
BLOCKBENCH_RUNTIME
ENVIRONMENT / INSTALL
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: identify the exact owner, capture minimum evidence, make the smallest complete fix, rerun the failing scenario first, then run relevant repository gates.

Do not respond to a poor model by automatically adding modelling recipes, shortening Skills, changing schema budgets, or adding tools unless the classified owner and evidence require that exact change.

## 11. Comparison Rule

A change is an authoring improvement only when:

```text
accepted quality is preserved or improved
+
unnecessary work is reduced
```

Better accepted quality with the same justified work may also be an improvement. Fewer calls with worse quality is a regression, not efficiency.

## 12. Completion

Update only current owners:

- `docs/foundation/validation-report.md` when new proof materially changes the boundary;
- `docs/knowledge/next-action.md` when continuation materially changes;
- `docs/knowledge/implementation-map.md` only when ownership changes;
- foundation policy only when a durable product rule changes.

Historical rationale, discarded fixtures, and prior model iterations belong in Git history. When requested proof and criteria are satisfied, **STOP**.
