# Local Acceptance Runbook

Updated: 2026-09-01  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly reactivates local testing.

`LIVE_BLOCKBENCH` is an execution capability, not automatic procedure activation. Targeted live debugging or runtime reproduction may use that capability whenever the current task requires it; this does not activate the formal Local Acceptance procedure below.

This runbook proves only live/runtime claims that repository CI cannot establish. Do not start it from a historical TODO or deferred state.

## 1. Acceptance Contract

Keep the Development Contract bounded:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

Required live proof may include:

```text
installed artifact freshness
live MCP phase/tool surface
fresh client registry
representative mutation + Undo
required phase handoff
reference-driven visual quality
Authoring Efficiency only after quality PASS
```

Do not edit source until a reproducible failure identifies the first wrong owner.

For the current Route 1 batch, the product choice is already locked:

```text
selected workflow = approved image + approved GLB
```

Do **not** add an image-only comparison run. The purpose of local acceptance is to verify that the selected image+GLB workflow works correctly end to end.

## 2. Pin Local State

From repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

A clean working tree is required before reusing CI proof.

## 3. Source Proof + Local Build

### Fast path — reuse exact green MCP Verify

Use only when all are true:

```text
working tree clean
current Local HEAD known exactly
completed successful MCP Verify exists for that exact HEAD
no local source/package edits exist after that commit
current task is not investigating CI/build/toolchain disagreement
```

When exact current CI status matters, read the workflow run for that commit. `docs/knowledge/current-validation.md` is current proof interpretation, not a substitute for exact run status.

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run build
```

The exact green CI result already owns typecheck/test/surface/docs proof; the local build exists to produce the artifact that will actually be loaded.

### Full path — CI proof cannot be reused

If any fast-path condition is false:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`verify:mcp` is the package-owned full gate: typecheck → full tests → surface measurement → production build → generated-doc freshness.

For the current Route 1 alignment foundation, ensure the targeted pure regression is included/passing:

```text
mcp/tests/route1-reference-alignment.test.ts
```

Production artifact:

```text
mcp/dist/blockit_mcp.js
build_identity = sha256:<64 lowercase hex>
```

Record only material environment state: Local HEAD, `build_identity`, Blockbench/Bun/client versions when available, actual plugin path, endpoint, active authoring phase, and Extended MCP Families setting.

If the exact loaded artifact cannot be established, classify `ENVIRONMENT / INSTALL` and STOP.

## 4. Live Server / Registry Gate

Current Geometry baseline:

```text
endpoint               http://127.0.0.1:3000/bb-mcp
profile                bedrock_entity
active phase           geometry
Geometry exposure      28 tools
retained catalog       65 tools across phases
Extended MCP Families  OFF
risky_eval             disabled
from_geo_json          disabled
```

These are current-runtime values, not the future BASE/EXTENDED target surface. Use the exact current source/registry as authority if those counts have changed by the time local testing begins.

Load only the freshly built plugin, reconnect, then from `mcp/` run:

```bash
bun run verify:stateless-local
```

For another deliberate phase:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

The smoke gate must match the source-owned phase surface and local `build_identity`; direct Geometry mutation schemas remain free of retired `plan_id`. A fresh client connection must then expose the same tool names. Server PASS + stale client registry means `ENVIRONMENT / INSTALL` first.

## 5. Phase Handoff

Runtime exposure remains:

```text
MCP CORE + exactly one ACTIVE PHASE
```

Crossing a phase boundary requires:

```text
HANDOFF_REQUIRED
→ retain target_phase + reason + readiness + resume_from
→ switch MCP Authoring Phase
→ reload/reconnect
→ rerun phase smoke
→ continue
```

Foreign-phase absence is expected; do not treat it as a discovery miss or borrow another phase's mutation tools.

## 6. Representative Runtime Proof

Do not exercise every tool. Prove one bounded path relevant to the requested claim.

Geometry example:

```text
small Bedrock project
→ Groups + Cubes
→ one justified rotated Cube when useful
→ focused inspection only when state is unavailable/stale
→ capture_model_views
→ one causal correction
→ Undo / Redo
→ export when in scope
```

Texturing starts only after Geometry/UV readiness passes. Animation starts only when required and its upstream readiness passes. Structural defects return to Geometry through handoff.

## 7. Route 1 Selected Image + GLB Acceptance

This is the current Route 1 local test. It tests the selected workflow; it does not compare alternative reference strategies.

### Required fixture

Use one approved representative fixture containing:

```text
fixture.json
approved-reference.png
approved-shape.glb
contact-sheet.png
input/front.png
input/left.png
input/back.png
```

`fixture.json` must provide the approved requested dimensions and `source_front_direction`.

### Test sequence

```text
1. approved reference image visible in the same judgement context

2. open/create intended Bedrock project

3. manage_geometry_reference(load)
   path = approved-shape.glb
   source_front_direction = fixture value
   origin = [0,0,0]
   uniform_scale = 1

4. record returned RAW world bounds

5. plan FIT_ENVELOPE using:
   mcp/lib/route1ReferenceAlignment.ts
   target dimensions = requested_dimensions_blocks
   blockbench_units_per_block = live Format.block_size

6. manage_geometry_reference(update)
   uniform_scale = planned next_uniform_scale
   change scale only

7. obtain FRESH post-scale reference bounds
   do not infer them from the prior bounds

8. plan CENTER_XZ_GROUND_Y translation
   default target anchor:
     center_x = 0
     ground_y = 0
     center_z = 0
   unless fixture explicitly requires another anchor

9. manage_geometry_reference(update)
   origin = planned next_origin
   change origin only

10. obtain FRESH aligned evidence

11. capture canonical reference views:
    FRONT
    SIDE
    TOP
    ISOMETRIC

12. author one coherent semantic Group/Cube blockout
    use approved image for visual authority
    use GLB for supported depth/volume/attachment/hidden-side evidence
    use requested dimensions for numeric envelope

13. capture current model views and judge reference fidelity

14. remove transient Route 1 reference

15. export editable .bbmodel

16. verify production project/export contains no reference_model state
```

### Alignment acceptance

```text
front orientation correct
+Y remains up
uniform scale only
reference fits inside requested envelope
fresh post-scale measurement used before translation
X/Z center matches target anchor
minimum Y matches target ground
no raw GLB dimension promoted to target authority
no non-uniform stretch
no pre-scaled/rewritten approved GLB
normal Groups/Cubes share the intended coordinate frame
reference removed before .bbmodel export
```

Unused envelope space on one or two axes is valid. It is not a failure and must not trigger non-uniform stretching.

### Non-goals

Do not add during this acceptance run:

```text
image-only A/B comparison
new 3D file formats
OBJ/PLY/STL support
mesh repair or decimation
voxelizer
triangle-to-Cube conversion
semantic mesh parser
cuboid solver
new auto-align tool
multiple alignment modes
Reference Models fork
scalar GLB quality score
```

If the selected path fails, identify the first wrong owner from evidence. Fix only that owner, rerun the failing step first, then rerun this Route 1 sequence. Do not redesign the pipeline merely because the first live run exposes a local bug.

## 8. Visual / Authoring Quality Gate

The actual approved reference must be visible. Filename/path/README/memory is not image evidence.

Judge relevant dimensions such as:

```text
IDENTITY
PRIMARY FORM / PROPORTION
CROSS-VIEW COHERENCE
TOPOLOGY / ATTACHMENT
IMPORTANT NEGATIVE SPACE
MINECRAFT / BLOCKBENCH BUILDABILITY
```

When texture is in scope, also judge palette/material identity, part separation, identity-critical markings, and controlled detail density.

Tool success, valid coordinates, export success, or low call count cannot override **QUALITY FAIL**.

Use difference-first `FAIL | UNVERIFIED | PASS`. Apply a causal correction only after diagnosis. Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

For Route 1, the evidence hierarchy remains:

```text
approved image        → visual authority
requested dimensions  → numeric authority
aligned GLB           → supporting 3D evidence
```

## 9. Authoring Efficiency — Cost to Accepted Result

**Authoring Efficiency is evaluated only after the relevant quality gate passes.** Static Footprint is a separate regression guard and cannot prove runtime efficiency.

Record only observable cost that can change a decision, such as meaningful MCP calls, phase handoffs/reloads, discovery, redundant readbacks, tool-search misses, view captures, correction attempts, Undo/recovery, same-cause retries, and broad repository/state reads.

Classify material work when useful:

```text
NECESSARY
AVOIDABLE
CONTRACT_CAUSED
REASONING_CAUSED
RECOVERY
```

For material corrections record:

```text
IMPROVED
UNCHANGED
REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases; otherwise no efficiency improvement is claimed. Do not invent token or latency numbers; unknown values remain `UNVERIFIED`.

For Route 1, do not spend local time benchmarking image-only again. Measure only the selected image+GLB path and remove avoidable work inside that path.

## 10. Failure / Completion

Use the first wrong owner:

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
ROUTE1_ALIGNMENT
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: capture minimum evidence → fix the exact owner → rerun the failing scenario first → run only the relevant repository verifier → STOP.

Update only current owners when their state actually changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — ownership.

Historical rationale belongs in Git history. When requested proof and criteria are satisfied, **STOP**.