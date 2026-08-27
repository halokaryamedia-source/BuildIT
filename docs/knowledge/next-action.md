# Next Action

Updated: 2026-08-27 — MCP stability handoff consolidated for Codex

Working branch: **`Local` only**.

Current `Local` HEAD before this documentation-only update:

```text
0db4fed5ece8cd6cc69e9dd2ba7a2d9a67f8d404
fix(mcp): make plugin connection state fail closed
```

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REGRESSION_OPEN
MCP_VERIFY_CURRENTLY_RED_FROM_PREEXISTING_SOURCE_ERRORS
MCP_VERSION_POLICY_RESET_PENDING
MCP_LIVE_CODEX_SURFACE_PROOF_PENDING
ROUTE1_HUNYUAN_GATE1_PASS
ROUTE1_HUNYUAN_MULTIVIEW_PREFERRED
ROUTE1_APPROVED_RESULT_PRESERVED_BY_USER
ROUTE1_BLOCKBENCH_TEST_BLOCKED_BY_MCP
EXPERIMENTAL_FOLDER_CLEANUP_PENDING
TEXTURE_ATLAS_CANDIDATE_SEPARATE_AND_DEFERRED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
```

Current source + relevant proof remain authority. Do not infer completion from stale status text elsewhere.

---

## 1. What Is Already Applied on `Local`

Commit `0db4fed5ece8cd6cc69e9dd2ba7a2d9a67f8d404` intentionally applies the first MCP connection-stability repair.

Preserve these changes:

```text
mcp/index.ts
- Blockbench plugin install ID: `mcp` → `blockit_mcp`
- plugin is not considered ready until the TCP server actually binds/listens
- bind failure such as EADDRINUSE fails closed
- a new UI must not appear healthy while an older MCP instance still owns the port

mcp/server/tools.ts
- `switch_authoring_phase` no longer mutates the live tool surface in-process
- phase handoff requires Blockbench phase setting change + reload + MCP client reconnect
- `reload_required: true`
- current connection surface remains immutable during a handoff

mcp/lib/authoringPhase.ts
- handoff wording requires reload/reconnect
- `bone_rigging` belongs to Geometry

mcp/tests/plugin-runtime-cleanup.test.ts
- regression checks for unique plugin ID
- regression checks for fail-closed TCP bind readiness
```

Do **not** revert these changes while repairing Geometry.

`mcp/package.json` also received `contributors: ["Jason J. Gardner"]` in the same commit. Audit whether this metadata is intentional before preserving it permanently; it is unrelated to the MCP stability repair.

---

## 2. Confirmed Incident and First Wrong Owner

Observed live Codex incident before the current repair:

```text
visible:
- reparent_element

missing examples:
- add_group
- place_cube
- duplicate_element
- modify_cube
- capture_model_views
```

This incident exposed two independent problems:

1. **connection/plugin freshness problem** — an older MCP instance can remain attached while source/plugin version changes;
2. **Direct Geometry regression** — current source still binds normal Geometry tools to the retired Geometry Plan/Compiler path.

The current `MCP Verify` failure is **not caused by commit `0db4fed`**. The previous `Local` commit already failed typecheck with the same source errors.

The regression that introduced `geometryPlan.ts`, `geometryCompiler.ts`, mandatory `plan_id`, and related bindings entered in:

```text
27870dac67c88be5b6a826cd7c18bd7845755715
chore(sync): synchronize local workspace with Local
```

Useful references:

```text
226d9a638bb0d8cc50963411005a2fbb7ae00d96
- pre-regression source point for the affected Direct Geometry owners

fc11428839ee21c1fe34251f6dafa2d1d7336877
- known full-MCP-verify-green reference
- direct Geometry schemas did not require `plan_id`
```

Use history only to recover intended semantics. Do not wholesale rollback unrelated current improvements.

---

# Codex Execution Contract

## Goal

Restore a stable Direct Geometry MCP and make repository/static verification fully green before the approved Route 1 MultiView GLB is tested in Blockbench.

## Success Metric

Before Route 1 authoring:

```text
source contract consistent
+ typecheck green
+ contract tests green
+ MCP surface measurement green
+ production build green
+ generated docs fresh
+ development plugin version policy stabilized at 0.1.0
+ fresh local Blockbench/Codex connection proves the expected live Geometry tools
```

## Forbidden Proxy / Non-Goal

Do not treat any of the following as success by itself:

```text
bundle contains tool-name strings
version number changed
plugin UI appears loaded
port exists
CI artifact exists
tool count alone
GLB exists
```

Do not add:

```text
new MCP tools
provider/router framework
compatibility layer
Geometry compiler v2
fallback planner
automatic reconnect daemon
alternate transport
telemetry/session framework
IoU/solver/auto-correction Route 1 system
```

## First Evidence Required

Static work first: Direct Geometry source must become internally consistent and pass the canonical MCP verification.

Live work later: a fresh Blockbench + Codex connection must prove the actual `tools/list` surface.

## STOP Condition

If the static gate is not green, do not test the Route 1 GLB.

If the fresh live Geometry surface is missing required tools or still exposes stale schemas, stop and classify the exact install/connection owner before authoring any model.

---

# P0 — Repair Direct Geometry

This is the first Codex task.

## `mcp/server/tools/cubes.ts`

Remove the retired Geometry Plan dependency from normal Direct Geometry authoring:

```text
remove mandatory `plan_id` from:
- place_cube
- modify_cube
- modify_cubes_batch

remove Geometry Plan calls/imports such as:
- requirePlanForOpenProject
- requireGeometryRoleAvailable
- requireBoundGeometryTarget
- requireRotationIntent
- bindGeometryRole
```

Preserve current useful behavior:

```text
coherent place_cube batching
finite geometry validation
rotated-Cube origin requirement
current correction/no-op validation
current Box UV handling and auto-pack behavior
structured mutation results
Undo behavior
```

Do not replace these with a new planning abstraction.

## `mcp/server/tools/element.ts`

Remove mandatory `plan_id` and Geometry Plan bindings from current Geometry element tools, including where present:

```text
add_group
duplicate_element
modify_group
reparent_element
```

Preserve current useful capability:

```text
add_group batching
modify_group
reparent_element
duplicate_element
explicit hierarchy validation
self/circular-parent rejection
normal UUID/exact-name targeting
Undo behavior
```

Do not regress `modify_group` or `reparent_element` merely because they were introduced near the bad plan coupling.

## `mcp/server/tools/project.ts`

Retire the old production Geometry Plan/Compiler registrations:

```text
remove normal registration of:
- prepare_geometry_plan
- compile_geometry_spec
- correct_geometry_from_report
```

Preserve:

```text
create_project
get_project_info
inspect_model_bounds
```

`create_project` must no longer need to clear or initialize a retired Geometry Plan.

## Retired implementation

Delete from production source when no remaining legitimate caller exists:

```text
mcp/lib/geometryPlan.ts
mcp/lib/geometryCompiler.ts
```

Do not preserve them through a compatibility/fallback layer unless a current production caller proves a real requirement.

## `mcp/lib/factories.ts`

Fix the existing TypeScript error minimally. Do not roll back current request-owned runtime cache invalidation or result compaction.

Current known typecheck evidence includes the unnecessary ToolResult object cast around the structured-result/content handling. Fix the actual type narrowing rather than weakening types globally.

## Type errors caused by the bad plan coupling

After removing the coupling, re-run typecheck before manually patching secondary errors. Several current implicit-any/schema mismatch errors in `cubes.ts` and `element.ts` are downstream symptoms of the plan-bound schemas and may disappear once the correct concrete schemas are restored.

Fix only errors that remain reproducible after the first wrong owner is removed.

---

# P1 — Canonical MCP Verification

From `mcp/` run the repository-owned gate:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

If source/tests/build pass and generated docs are stale:

```bash
bun run docs:build
bun run docs:check
```

Generated MCP API docs are generator-owned. Never hand-edit generated tool entries.

Do not declare this phase complete until the full relevant MCP verification is green.

---

# P2 — Stabilize Plugin Versioning

Only after the Direct Geometry source contract is green, reset the development plugin version to:

```text
0.1.0
```

Then regenerate all version-dependent artifacts normally.

Version policy going forward:

```text
normal rebuild / reconnect / cache troubleshooting
→ version stays 0.1.0

real patch/release milestone
→ deliberate semantic version bump
```

Never bump the plugin version merely to force Blockbench or Codex to notice a new build.

Version is release metadata, not freshness proof.

---

# P3 — Minimal Runtime Freshness Identity

Audit the existing `/health` response after the source gate is green.

It already reports basic product/version/phase information. Add only the **minimum missing identity** needed to distinguish a stale running instance from the current build.

Preferred minimal evidence, only where not already available:

```text
product
version
build_id or equivalent build identity
started_at or instance_id
active phase
tool/surface count
```

Purpose:

```text
expected current build
!= /health running build
→ stale MCP instance is immediately proven
```

Do not turn this into telemetry, persistent session logging, or a monitoring framework.

If existing `/health` already proves instance/build freshness adequately, make no change.

---

# P4 — Remove Temporary MCP Maintenance Noise

After MCP verification is green, audit `.github/workflows/mcp-verify.yml`.

The step named approximately:

```text
Upload MCP cleanup snapshot
```

was explicitly temporary maintenance infrastructure. Remove it if it no longer serves an active recovery requirement.

Do not add a replacement artifact/archive system.

---

# P5 — Clean Route 1 Experimental Structure

Do this only after the MCP source gate is green. It is repository cleanup, not a new Route 1 experiment.

Current decision:

```text
Route 1 Gate 1: PASS
Preferred reconstruction: MultiView
Preferred source views: separated FRONT + SIDE + BACK
contact-sheet orientation: front_direction=+z
approved Minecraft reference remains visual authority
```

SingleView and earlier board-crop attempts are no longer the canonical current path.

The user reports the approved experiment result was already moved out of `.cache`. Preserve that approved result if present; do not regenerate it merely for cleanup.

Target a simple current structure such as:

```text
Experimental/
└─ route1-hunyuan/
   ├─ README.md
   ├─ scripts/
   │  ├─ generate_multiview.py
   │  └─ render_contact_sheet.py
   ├─ reference/
   │  └─ approved/
   │     ├─ front.png
   │     ├─ side.png
   │     └─ back.png
   ├─ results/
   │  └─ approved/
   │     ├─ *-APPROVED.glb
   │     └─ *-APPROVED.png
   └─ .cache/
      └─ transient runs only
```

Use the actual current filenames; do not invent duplicate approved assets.

The current README must become one current truth:

```text
Gate 1 already passed
MultiView is preferred
GLB is temporary 3D evidence, not final Minecraft geometry
approved Minecraft reference remains style/visual authority
production MCP unchanged by the experiment itself
next step is blocked until MCP live Geometry proof passes
```

Do not create archive/rejected/history folders just to retain old attempts; Git history already owns history.

---

# P6 — Local Runtime Gate

This is the first step that genuinely requires the Local PC / Blockbench / Codex runtime.

Do not perform it until P0–P5 repository work is complete where applicable.

Required procedure:

```text
1. Sync/pull current `Local`.
2. Build the final MCP bundle.
3. Close Codex completely.
4. Close Blockbench completely.
5. Ensure no old BlockIT/MCP instance still owns the configured loopback port.
6. Remove/disable old duplicate MCP/plugin entries.
7. Install/load only the current BlockIT plugin with install ID `blockit_mcp`.
8. Set active authoring phase = Geometry.
9. Start Blockbench and confirm `/health` identifies the expected current build/instance.
10. Create a fresh Codex MCP connection.
11. Read the live `tools/list` / actual exposed Geometry tool surface.
```

Required live Geometry capability includes at minimum:

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

Also prove the live schemas do **not** require `plan_id` for:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

If these do not match current source, **STOP**. Do not patch Route 1 or the model to compensate for a stale MCP connection.

---

# P7 — Route 1 Blockbench Test

Only after the live MCP gate passes:

```text
actual approved Minecraft reference
+ approved MultiView GLB/contact-sheet evidence
+ approved dimensions/constraints
→ existing Geometry MCP
→ primary Groups/Cubes only
→ one capture_model_views
→ compare actual approved reference + fresh model views together
→ one causal local correction OR one primary rebuild
→ verify
```

Authority order when evidence conflicts:

```text
1. explicit user requirement
2. actual approved Minecraft reference
3. approved MultiView GLB/contact-sheet for depth/volume/hidden-side evidence
4. simplest Minecraft-buildable interpretation
```

Do not voxelize the GLB, import it as final geometry, or follow its smooth curvature with many tiny Cubes.

---

# Route 1 Deferred Until Matching Evidence

Do not implement automatically:

```text
mesh voxelization
mesh-to-Cube compiler
semantic mesh segmentation
IoU/silhouette scoring gate
coordinate solver
autonomous correction loop
Hunyuan Fast/Turbo tuning
higher octree tuning
multiple-seed framework
provider routing
new Route 1 MCP tools
Hunyuan texture/Paint/Delight pipeline
```

A new layer requires a demonstrated failure that identifies that layer as the first wrong owner.

---

# Separate / Not Part of This Repair

The Texture Atlas public-contract candidate remains a separate task. Do not mix it into MCP stability or Route 1 cleanup unless it directly blocks the required Geometry gate.

---

# Final STOP / Handoff State

Codex should continue from **P0**.

The next meaningful checkpoint is:

```text
DIRECT GEOMETRY REPAIRED
+ MCP STATIC VERIFY GREEN
+ VERSION POLICY STABLE AT 0.1.0
+ MINIMAL FRESHNESS IDENTITY READY
+ EXPERIMENTAL ROUTE1 CURRENT TREE CLEAN
```

Then stop repository development and request/perform the **Local Runtime Gate**.

The approved Route 1 GLB must not be authored through MCP before that live gate passes.
