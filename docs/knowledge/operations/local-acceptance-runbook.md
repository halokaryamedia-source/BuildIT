# Local Acceptance Runbook

Updated: 2026-08-27  
Owner: local Codex/Opencode + desktop Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly reactivates the local gate.

This is the single live-acceptance procedure for BlockIT. The current repository state may defer this run; do not start it unless the user explicitly reactivates local testing.

## 1. Goal

Prove what source/CI cannot:

```text
exact installed artifact freshness
+ exact live MCP phase/tool surface
+ fresh Codex registry
+ representative Blockbench mutation/Undo
+ required phase handoffs/reloads
+ reference-driven model quality
+ Authoring Efficiency only after quality PASS
```

Do not edit source before a reproducible failure identifies the first wrong owner.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ this runbook
→ mcp/README.md + mcp/AGENTS.md only when MCP implementation matters
```

Keep the Developing Execution Contract bounded:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

## 3. Exact Local Build / Freshness Gate

From repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Working tree must be clean.

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Canonical production plugin:

```text
mcp/dist/blockit_mcp.js
```

`bun run build` prints and embeds:

```text
build_identity = sha256:<64 lowercase hex>
```

This identity is deliberately separate from package version `0.1.0`. Do not use version bumps as freshness proof.

Record only the useful environment state:

```text
Local HEAD
printed build_identity
Blockbench version
Bun version
client/provider + version when visible
actual BlockIT file/path loaded by Blockbench
MCP endpoint
MCP Authoring Phase
Extended MCP Families setting
```

If the exact artifact cannot be established, classify `ENVIRONMENT / INSTALL` and STOP.

## 4. Load Current BlockIT / Server Smoke Gate

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
artifact                = mcp/dist/blockit_mcp.js
```

Fully unload/close any stale BlockIT/Codex connection as required by the current client, load only the freshly built `blockit_mcp.js`, and reconnect.

With Geometry active, from `mcp/` run:

```bash
bun run verify:stateless-local
```

The smoke gate now checks in one pass:

```text
/health is stateless JSON
live profile = bedrock_entity
live phase = geometry
/health.build_identity = embedded identity in local dist/blockit_mcp.js
/health.exposed_tool_count = expected source surface count
initialize reports the expected active phase
tools/list exactly matches getMcpSurfaceToolNames("bedrock_entity", "geometry")
required Geometry acceptance tools are present
Direct Geometry schemas do not expose or require plan_id
risky_eval / from_geo_json are absent
```

Required Geometry acceptance capability:

```text
create_project
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
capture_model_views
bone_rigging
export_model
```

These Direct Geometry schemas must remain free of retired `plan_id`:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

For another deliberate phase, pass the phase name:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

If the MCP URL differs from the default:

```bash
bun run verify:stateless-local -- http://127.0.0.1:3000/bb-mcp geometry
```

A smoke failure means `ENVIRONMENT / INSTALL` or `MCP_PUBLIC_CONTRACT`; do not continue to visual claims.

## 5. Fresh Codex Registry Gate

The direct server smoke does **not** prove Codex itself refreshed its tool registry.

Create a fresh Codex connection/task and capture the live tool names. For Geometry, compare them with the same source-owned 27-tool surface. Do not search for a known foreign-phase tool.

If Codex names differ while the direct server smoke passes:

```text
direct MCP server surface = PASS
Codex registry = mismatch
→ ENVIRONMENT / INSTALL first
```

Only classify `MCP_PUBLIC_CONTRACT` after proving the installed server is fresh and Codex is reading that exact instance.

## 6. Phase / Handoff Rule

Runtime exposure is:

```text
MCP CORE + exactly one ACTIVE PHASE
```

A phase transition is deliberate:

```text
HANDOFF_REQUIRED
→ record target_phase + reason + readiness + resume_from
→ set MCP Authoring Phase=<target>
→ reload/restart BlockIT MCP as required
→ reconnect MCP client
→ rerun the smoke gate for the target phase
→ continue
```

Foreign-phase absence is expected and is **not** a discovery failure.

## 7. Test 1 — MCP / Core Mechanics

Do not exercise every tool. Use one bounded representative path.

### Geometry

```text
create small Bedrock project
→ Groups + Cubes
→ one intentionally rotated Cube with justified origin
→ focused inspect only when needed
→ capture_model_views
→ one causal correction
→ Undo / Redo
→ Locator / Null Object when required
→ .bbmodel / Bedrock export when required
```

Confirm Texturing/Animation mutations are absent rather than searched for.

### Geometry → Texturing

Only after:

```text
geometry=PASS
uv_layout=PASS
final Box-UV lock complete where applicable
list_textures UV audit has no unresolved blocker
```

Then:

```text
HANDOFF_REQUIRED(texturing)
→ switch phase
→ reload/reconnect
→ bun run verify:stateless-local -- texturing
```

Representative Texturing path:

```text
Texture Atlas
→ Painter base/value/form/identity work
→ PBR/material instance only when required
→ fresh get_texture + capture_model_views
→ Texture Verify
```

A Geometry/UV defect returns to Geometry through a handoff.

### Texturing → Animation

Only when animation is actually required and texture verification passed:

```text
HANDOFF_REQUIRED(animation)
→ switch phase
→ reload/reconnect
→ bun run verify:stateless-local -- animation
```

Representative Animation path:

```text
small animation
→ representative keyframe/effect mutation
→ controller mutation only when required
→ focused inspect_animation only when returned state is insufficient
```

Structural bone/pivot/IK/parenting defects return to Geometry.

## 8. Test 2 — Reference Model / Authoring Quality

The actual approved reference must be visible to the local modelling context. A filename/path/README/memory is not image evidence.

Geometry quality gate:

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

Use:

```text
actual approved reference
→ Geometry
→ minimum coherent primary form
→ fresh model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
→ UV readiness
→ HANDOFF_REQUIRED(texturing)
→ texture only after Geometry PASS
→ fresh Texture Verify evidence
```

Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

## 9. Authoring Efficiency — Cost to Accepted Result

**Authoring Efficiency is evaluated only after the relevant quality gate passes.**

```text
QUALITY FAIL
→ efficiency claim is invalid

QUALITY PASS
→ compare justified work and unnecessary work
→ Cost to Accepted Result
```

Static Footprint — prompt/Skill characters, schema size, serialized tool surface — is a separate regression guard and cannot prove runtime efficiency.

Record only observable session cost:

```text
Meaningful MCP calls to Geometry PASS
Meaningful MCP calls to Final PASS
Phase handoffs / reloads
Discovery calls
Redundant readbacks
tool_search calls / misses
place_cube calls / Cubes authored
add_group calls / Groups authored
capture_model_views calls
Correction attempts
Undo / recovery calls
Same-cause retries
Broad repository/state reads
```

Classify material work as:

```text
NECESSARY
AVOIDABLE
CONTRACT_CAUSED
REASONING_CAUSED
RECOVERY
```

For each material correction, record its observed effect:

```text
IMPROVED
UNCHANGED
REGRESSED
```

A healthy convergence loop favors `IMPROVED`, avoids blind Same-cause retries, and verifies affected views rather than capturing after every mutation.

Do not invent token or latency numbers; unknown values stay `UNVERIFIED`.

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

For a reproducible failure:

```text
identify exact owner
→ capture minimum evidence
→ make smallest complete fix
→ rerun failing scenario first
→ run relevant repository gates
→ STOP
```

Do not respond to a poor model by automatically adding tools, profiles, reconnect frameworks, modelling recipes, or schema-budget changes unless the classified owner requires that exact change.

## 11. Completion

Update only current owners:

- `docs/foundation/validation-report.md` when proof materially changes;
- `docs/knowledge/next-action.md` when continuation changes;
- `docs/knowledge/implementation-map.md` only when ownership changes.

Historical rationale belongs in Git history. When the requested proof and criteria are satisfied, **STOP**.
