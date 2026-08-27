# Next Action

Updated: 2026-08-27 — Codex cleanup and MCP stability handoff

Working branch: **`Local` only**.

The current branch contains the MCP connection-stability source repair from:

```text
0db4fed5ece8cd6cc69e9dd2ba7a2d9a67f8d404
fix(mcp): make plugin connection state fail closed
```

Documentation-only commits may appear after that source commit. Do not mistake those documentation commits for additional MCP source repairs.

Current source + relevant proof remain authority. Do not infer completion from stale status text elsewhere.

---

# MASTER CLEANUP CHECKLIST FOR CODEX

Work in this order. Do not test the approved Route 1 GLB until the MCP gates below pass.

## A. Repository housekeeping — small and safe

```text
    [x] Delete the accidental temporary remote branch `__noop__`.
    Expected command: git push origin --delete __noop__
    Do not force-push or rewrite `Local` history.

[ ] Ignore unreferenced candidate Git blobs created during the earlier ChatGPT audit.
    They are not on `Local` and require no manual cleanup.

    [x] Audit `mcp/package.json` contributor metadata added with commit 0db4fed.
    `contributors: ["Jason J. Gardner"]` is unrelated to the MCP stability fix.
    Preserve only if intentionally correct; otherwise remove it as unrelated metadata noise.
```

## B. MCP Direct Geometry repair — highest priority

```text
    [x] Remove mandatory `plan_id` from normal Direct Geometry tools.
    [x] Remove retired Geometry Plan bindings from Cube/Group authoring.
    [x] Remove normal production registration of legacy plan/compiler tools.
    [x] Delete retired `geometryPlan.ts` / `geometryCompiler.ts` when no legitimate caller remains.
[ ] Preserve useful current tools and behavior: modify_group, reparent_element, batching, UV behavior, Undo, validation.
    [x] Fix remaining TypeScript errors only after the first wrong owner is removed.
```

## C. Preserve the connection-stability repair

```text
[ ] Keep Blockbench plugin install ID stable as `blockit_mcp`.
[ ] Keep fail-closed TCP bind/startup behavior.
[ ] Keep one immutable MCP tool surface per connection.
[ ] Keep phase handoff = set phase → reload BlockIT → reconnect MCP client.
[ ] Keep `bone_rigging` owned by Geometry.
[ ] Do NOT restore in-process dynamic phase-surface switching.
```

The plugin ID `blockit_mcp` is intended to become stable. Do not keep renaming it to invalidate caches.

## D. Static MCP verification

```text
[x] bun install --frozen-lockfile
[x] bun run typecheck
[ ] bun run test — 20 baseline failures remain; do not claim full gate green.
[x] bun run measure:surface
[x] bun run build
[x] bun run docs:check
[x] If generated docs are stale: bun run docs:build, then docs:check again.
```

Do not hand-edit generated MCP API docs.

## E. Version policy cleanup

Only after Direct Geometry source is green:

```text
[x] Reset development plugin version to `0.1.0`.
[x] Regenerate version-dependent artifacts through repository-owned generators/build.
[x] Remove any logic/process that treats version bumping as cache invalidation.
[x] Normal rebuild/reconnect must leave version at `0.1.0`.
[ ] Future version bumps happen only for deliberate release/milestone changes.
```

Do not use `0.1`, `1.6.4`, or another arbitrary cache-buster. Canonical development baseline is `0.1.0`.

## F. Runtime freshness diagnostics — minimal only

```text
[x] Audit existing `/health` response.
[x] Ensure a stale running MCP instance can be distinguished from the current build.
[x] Prefer the minimum needed identity: product, version, active phase, build/instance identity, startup identity/time, surface/tool count.
[x] If existing health data already proves freshness, add nothing.
```

Do not build telemetry, session logging, daemon monitoring, or an automatic reconnect framework.

## G. Temporary MCP maintenance cleanup

After the MCP gate is green:

```text
[x] Audit `.github/workflows/mcp-verify.yml`.
[x] Remove the temporary `Upload MCP cleanup snapshot` step if no active recovery need remains.
[ ] Do not replace it with another archive/snapshot framework.

[x] Retire `rebuild-mcp.ps1`; use the repository-owned `mcp` build scripts directly.
    Do not add a replacement rebuild wrapper or use version bumps to solve stale connections.
```

## H. Route 1 Experimental cleanup

Current accepted research decision:

```text
Route 1 Gate 1 = PASS
Preferred reconstruction = Hunyuan MultiView
Preferred source evidence = separated FRONT + SIDE + BACK
contact-sheet orientation = front_direction=+z
approved Minecraft reference = visual/style authority
approved MultiView GLB = depth/volume/hidden-side evidence only
```

Cleanup requirements:

```text
[ ] Preserve the user's existing `APPROVED` result; do not regenerate it just for cleanup.
[ ] Make MultiView the one documented current path.
[ ] Remove stale README wording that still says Gate 1/local Hunyuan proof is pending.
[ ] Remove stale wording that says MultiView is disabled.
[ ] Separate approved reference assets from approved result assets.
[ ] Keep transient attempts only in `.cache/` where appropriate.
[ ] Remove duplicated/current-tree experiment inputs that no longer serve the canonical path.
[ ] Do not create archive/rejected/history folders; Git history already owns history.
[ ] Rename/restructure the experiment folder only when it materially improves navigation; avoid cosmetic churn.
[ ] Keep actual existing script filenames unless a rename is genuinely needed for clarity.
```

Preferred simple structure, adapted to the actual existing files:

```text
Experimental/
└─ route1-hunyuan/
   ├─ README.md
   ├─ scripts/
   │  └─ current Hunyuan/contact-sheet scripts
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

Use actual current filenames. Do not invent duplicate approved assets.

## I. Documentation reconciliation after implementation

When the source work is actually complete:

```text
[ ] Update this `next-action.md` to the new verified state.
[ ] Reconcile stale version/tool-count/status references only in canonical owners that are now materially wrong.
[ ] Do not sweep every README/document merely for wording consistency.
[ ] `CONTEXT.md` should change only if a stable project fact changed.
[ ] `docs/foundation/validation-report.md` changes only when its proof state actually changes.
```

## J. Local Runtime Gate — first step that requires the Local PC

Do this only after repository/static cleanup above is complete.

```text
[ ] Sync/pull current `Local`.
[ ] Build final MCP bundle.
[ ] Close Codex completely.
[ ] Close Blockbench completely.
[ ] Ensure no old BlockIT/MCP instance owns the configured loopback port.
[ ] Remove/disable duplicate old MCP/plugin entries.
[ ] Load only plugin ID `blockit_mcp`.
[ ] Set active phase = Geometry.
[ ] Confirm `/health` identifies the expected current build/instance.
[ ] Create a fresh Codex MCP connection.
[ ] Verify live `tools/list` / exposed Geometry surface.
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

Live schemas must NOT require `plan_id` for:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

If source/build is correct but live Codex differs, STOP and diagnose install/connection freshness. Do not patch Route 1 or the model to compensate.

## K. Route 1 Blockbench test — only after J passes

```text
actual approved Minecraft reference
+ approved MultiView GLB/contact-sheet evidence
+ approved dimensions/constraints
→ existing Geometry MCP
→ primary Groups/Cubes only
→ one capture_model_views
→ compare approved reference + fresh model views together
→ one causal local correction OR one primary rebuild
→ verify
```

Authority order:

```text
1. explicit user requirement
2. actual approved Minecraft reference
3. approved MultiView GLB/contact sheet for depth/volume/hidden-side evidence
4. simplest Minecraft-buildable interpretation
```

Do not voxelize the GLB, import it as final Blockbench geometry, or chase smooth mesh curvature with many small Cubes.

---

# CURRENT STATE

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
MCP_VERIFY_STATIC_PARTIAL: TYPECHECK_SURFACE_BUILD_DOCS_PASS; FULL_TEST_BASELINE_FAILURES_OPEN
MCP_VERSION_POLICY_STABLE_AT_0_1_0
MCP_HEALTH_FRESHNESS_IDENTITY_READY
ROUTE1_HUNYUAN_GATE1_PASS
ROUTE1_HUNYUAN_MULTIVIEW_PREFERRED
ROUTE1_APPROVED_RESULT_PRESERVED_BY_USER
ROUTE1_BLOCKBENCH_TEST_BLOCKED_BY_MCP
EXPERIMENTAL_FOLDER_CLEANUP_COMPLETE
TEMPORARY_REPO_HOUSEKEEPING_COMPLETE
TEXTURE_ATLAS_CANDIDATE_SEPARATE_AND_DEFERRED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
```

---

# OPEN ISSUES / NEXT DIAGNOSTIC ACTIONS

## P0 — Live MCP Geometry surface is still incomplete

Observed after plugin reinstall/reload and MCP reconnect:

```text
LIVE CONNECTION: responds successfully
LIVE PROJECT READ: succeeds
LIVE ACTIVE PHASE: Geometry
MISSING FROM CODEX TOOL REGISTRY:
- add_group
- place_cube
- modify_cube
- modify_cubes_batch
```

Current evidence:

```text
source registration: present
generated bundle: present
source-owned tools/list measurement: passes
live Codex tool registry: still partial
```

Classification: `ENVIRONMENT / INSTALL` or `MCP_PUBLIC_CONTRACT` pending direct live `tools/list` capture.

Required next action:

```text
close Codex completely
close Blockbench completely
load only mcp/dist/blockit_mcp.js
open Codex again
create a fresh MCP connection/task
capture live /health and tools/list
compare exact live names with getMcpSurfaceToolNames("bedrock_entity", "geometry")
```

Do not modify Route 1, model logic, or Geometry schemas until this comparison identifies the first wrong owner.

## P1 — Rebuild helper retired

`rebuild-mcp.ps1` was intentionally removed. Use only the repository-owned commands from `mcp/package.json`:

```text
bun run build
bun run measure:surface
bun run typecheck
```

Do not recreate a wrapper, add cache-buster version changes, or rebuild repeatedly without new evidence.

## P1 — One stale static test remains

`tests/default-registration-import-safe.test.ts` still expects the old unspecialized 64-tool surface while the active Geometry surface is intentionally 27 tools. Reconcile this test against the current phase-owned contract before claiming the full static test gate green.

## CLOSED / DO NOT REPEAT

```text
plugin filename mismatch: fixed; bundle is blockit_mcp.js
legacy mcp.js generated artifact: build removes it
plugin ID blockit_mcp: stable and preserved
Direct Geometry plan/compiler coupling: removed
source-owned tools/list Geometry surface: passes
```

---

# WHAT IS ALREADY APPLIED ON `Local`

Preserve the source behavior introduced by `0db4fed5ece8cd6cc69e9dd2ba7a2d9a67f8d404`:

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

---

# CONFIRMED INCIDENT / FIRST WRONG OWNER

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

Two independent problems were identified:

1. **connection/plugin freshness** — an older MCP instance can remain attached while source/plugin changes;
2. **Direct Geometry regression** — current source binds normal Geometry tools to the retired Geometry Plan/Compiler path.

The current `MCP Verify` failure is **not caused by commit `0db4fed`**. The preceding `Local` state already failed typecheck with the same source errors.

The Geometry Plan/Compiler regression entered in:

```text
27870dac67c88be5b6a826cd7c18bd7845755715
chore(sync): synchronize local workspace with Local
```

Useful historical references:

```text
226d9a638bb0d8cc50963411005a2fbb7ae00d96
- pre-regression source point for affected Direct Geometry owners

fc11428839ee21c1fe34251f6dafa2d1d7336877
- known full-MCP-verify-green reference
- direct Geometry schemas did not require `plan_id`
```

Use history only to recover intended semantics. Do not wholesale rollback unrelated current improvements.

---

# P0 — DIRECT GEOMETRY REPAIR DETAILS

## `mcp/server/tools/cubes.ts`

Remove retired Geometry Plan dependency from normal Direct Geometry authoring:

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

Preserve:

```text
coherent place_cube batching
finite geometry validation
rotated-Cube origin requirement
current correction/no-op validation
current Box UV handling/auto-pack behavior
structured mutation results
Undo behavior
```

## `mcp/server/tools/element.ts`

Remove mandatory `plan_id` and Geometry Plan bindings from current Geometry tools, including where present:

```text
add_group
duplicate_element
modify_group
reparent_element
```

Preserve:

```text
add_group batching
modify_group
reparent_element
duplicate_element
explicit hierarchy validation
self/circular-parent rejection
UUID/exact-name targeting
Undo behavior
```

Do not regress `modify_group` or `reparent_element` merely because they were introduced near the bad plan coupling.

## `mcp/server/tools/project.ts`

Retire old production registrations:

```text
prepare_geometry_plan
compile_geometry_spec
correct_geometry_from_report
```

Preserve:

```text
create_project
get_project_info
inspect_model_bounds
```

`create_project` must no longer clear/initialize a retired Geometry Plan.

## Retired implementation

Delete when no remaining legitimate caller exists:

```text
mcp/lib/geometryPlan.ts
mcp/lib/geometryCompiler.ts
```

Do not keep them through a compatibility/fallback layer without a current production requirement.

## `mcp/lib/factories.ts`

Fix the existing TypeScript error minimally. Do not roll back current request-owned runtime cache invalidation or result compaction.

Re-run typecheck after removing the plan coupling before patching secondary implicit-any/schema errors; some are downstream symptoms of the wrong schemas.

---

# CODEX EXECUTION CONTRACT

## Goal

Restore a stable Direct Geometry MCP and make repository/static verification fully green before the approved Route 1 MultiView GLB is tested in Blockbench.

## Success Metric

```text
Direct Geometry source consistent
+ full MCP static verification green
+ plugin ID stable as blockit_mcp
+ development version baseline 0.1.0
+ minimal stale-instance identity available
+ temporary maintenance noise removed where no longer needed
+ Route 1 current experiment tree/documentation clean
+ fresh local Blockbench/Codex connection proves expected Geometry tools
```

## Forbidden Proxy / Non-Goal

The following do not prove success by themselves:

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

## STOP Condition

If static MCP verification is not green, do not test Route 1.

If fresh live Geometry surface is missing required tools or still exposes stale schemas, STOP and classify install/connection freshness before authoring any model.

---

# ROUTE 1 — DEFERRED UNTIL MATCHING EVIDENCE

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

# SEPARATE / NOT PART OF THIS REPAIR

The Texture Atlas public-contract candidate remains a separate task. Do not mix it into MCP stability or Route 1 cleanup unless it directly blocks the Geometry gate.

---

# FINAL HANDOFF

Codex should start at **A**, then complete **B–I** without requiring Blockbench where possible.

The repository-only checkpoint is:

```text
REPOSITORY HOUSEKEEPING CLEAN
+ DIRECT GEOMETRY REPAIRED
+ MCP STATIC VERIFY GREEN
+ VERSION POLICY STABLE AT 0.1.0
+ MINIMAL FRESHNESS IDENTITY READY
+ TEMPORARY MCP MAINTENANCE NOISE CLEAN
+ ROUTE1 CURRENT EXPERIMENT TREE/DOCS CLEAN
```

Then stop repository development and perform/request **J — Local Runtime Gate**.

Only after J passes may **K — Route 1 Blockbench Test** begin.
