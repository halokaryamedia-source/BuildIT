# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation before normal feature hardening resumes.

P0.1 local network containment, P0.2 dangerous default capability containment, and P0.3 real MCP schema enforcement + annotations are implemented in source. P0.4 engineering-gate infrastructure is now implemented and executable, but P0.4 is **not complete** because the first full-package `tsc --noEmit` gate exposed broad existing TypeScript/Blockbench typing debt. Do not advance to P0.5 until that blocker is resolved or the governing work order is deliberately revised.

## Current Status

`MCP_P0_ENGINEERING_GATE_IMPLEMENTED_FULL_TYPECHECK_BLOCKED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench/MCP testing remains required for runtime-only proof.

## Governing Evidence

Audit:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

Plan:

```text
docs/knowledge/operations/mcp-reduction-stabilization-plan.md
```

The plan is the ordered P0→P2 work order. Do not skip ahead unless new evidence invalidates its dependency order.

## Product Boundary

Default BlockIT MCP remains:

```text
Minecraft Bedrock Entity
Geometry: Cube/Cuboid only
Rig: Group hierarchy / Cuboid children
Animation: Group/BoneAnimator
Texture: minimum proven Bedrock Entity outcomes
Execution: local desktop Blockbench service
```

Non-core generic capabilities are to become gated, quarantined, or removed rather than hardened by default.

## Protocol / SDK Decision For Current Stabilization

Do **not** migrate SDK/protocol during P0.

Current primary-source review confirms that Streamable HTTP security requires Origin validation and recommends loopback binding for local servers. The 2026-07-28 protocol changes transport/session semantics materially, so migration remains a separate later decision rather than part of P0 containment.

Therefore:

- secure the current v1 transport first;
- do not add more custom session/keepalive features;
- do not add OAuth/token infrastructure to the local-only P0 path;
- reconsider transport/session architecture later at P1.4 using then-current stable primary evidence and actual supported clients.

## Frozen Strong Work

Preserve:

- explicit deterministic `place_cube` geometry/pivot/targeting;
- bounded `modify_cubes_batch` preflight + Undo;
- focused `inspect_element` authored-state readback;
- `inspect_model_bounds`;
- deterministic `capture_model_views`;
- recent Bedrock `create_animation` / `inspect_animation` codec, identity, rollback, transform, and particle work;
- source/static proof must never be promoted to live Blockbench proof.

Do not reopen Mesh geometry for the Bedrock Entity default path.

## Feature Work Freeze

Until P0/P1 core stabilization is complete:

- no new MCP feature families;
- no Mesh/Armature/Bedrock-Block expansion for the Entity workflow;
- no broad Paint completeness work;
- no additional Animation micro-hardening by default;
- no generic output/resolver rewrite across gated legacy families;
- no protocol migration bundled into modelling work.

The known `animation_timeline.select_range` selection-lifecycle defect remains valid but parked.

# Completed Slice — P0.1 Local Transport Containment

Primary owners:

```text
mcp/server/net.ts
mcp/index.ts
```

Source commit:

```text
49c7440ed0dbb5f58c879db14543817791044e80
fix: contain MCP server to local origins
```

## Implemented source contract

Default plugin startup now passes:

```text
host: 127.0.0.1
```

`createNetServer()` also defaults its existing `host` option to `127.0.0.1`, and that host is now passed to:

```text
httpServer.listen(port, host, ...)
```

rather than calling `listen(port)` while merely logging `localhost`.

A present HTTP `Origin` is validated before the request is converted and dispatched to the MCP transport. Accepted local hostnames are intentionally narrow:

```text
localhost
127.0.0.1
::1 / [::1]
```

with `http:` or `https:` origin schemes. A malformed, opaque, or non-local present Origin returns:

```text
HTTP 403 Forbidden
```

with a JSON-RPC-shaped error body. Requests that omit `Origin` preserve the previous local non-browser client path.

## P0.1 intentionally unchanged

- no OAuth/token/auth system;
- no session lifecycle changes;
- no keepalive changes;
- no SDK version change;
- no tool/schema/registration changes;
- no Animation, Geometry, Texture, Mesh, Paint, or export changes.

## P0.1 proof boundary

Static source/diff proves:

```text
explicit loopback host reaches listen()
Origin validation runs before MCP transport dispatch
invalid present Origin has a deterministic HTTP 403 branch
requests without Origin are not rejected by the new guard
```

Still `LOCAL PROOF REQUIRED`:

```text
actual OS listener address
MCP Inspector/intended local client connection
actual runtime 403 response
browser/proxy compatibility
normal tool call after initialization
```

# Completed Slice — P0.2 Dangerous Default Capability Containment

Primary owners:

```text
mcp/server/tools/ui.ts
mcp/server/tools/import.ts
```

Existing registration semantics confirmed in:

```text
mcp/lib/factories.ts
```

Source commit:

```text
33bd7ab2a9cec674fb2183cb178fa24e1727b4e9
fix: disable dangerous default MCP tools
```

## Implemented source contract

The existing fourth `createTool()` argument is now used to disable only:

```text
risky_eval      enabled=false
from_geo_json   enabled=false
```

`createTool()` therefore preserves both tool definitions in local metadata/source while omitting their initial MCP registration. Existing `getEnabledToolDefinitions()` / `registerToolsOnServer()` behavior also excludes them from reconstructed session servers.

`risky_eval` metadata is reclassified:

```text
Stable → Experimental
```

No sandbox or replacement generic execution/import mechanism was introduced.

## P0.2 intentionally unchanged

- no `mcp/lib/factories.ts` redesign;
- no capability-profile framework;
- no broader UI/import family gating;
- no transport/session changes;
- no SDK/protocol changes;
- no Animation, Geometry, Texture, Paint, Mesh, Armature, export, or generated-doc changes.

## P0.2 proof boundary

Exact source diff proves:

```text
risky_eval uses enabled=false
from_geo_json uses enabled=false
risky_eval is no longer Stable metadata
other UI tools are unchanged
no full capability-profile framework was introduced
```

Still `LOCAL PROOF REQUIRED`:

```text
tools/list omits risky_eval
tools/list omits from_geo_json
remaining intended default tools still register
no server initialization regression
```

# Completed Slice — P0.3 Real MCP Schema Enforcement + Annotations

Primary owner:

```text
mcp/lib/factories.ts
```

Source commit:

```text
2fec534b0204a33c9b20c536724159018a4b5c38
fix: enforce MCP tool schemas and annotations
```

## Grounded installed SDK contract

The committed lockfile resolves:

```text
@modelcontextprotocol/sdk 1.25.3
```

The exact v1.25.3 SDK registration contract accepts raw Zod shapes or schemas and supports `ToolAnnotations`. The same SDK exposes annotations in `tools/list`, and its `ToolAnnotations` contract includes `idempotentHint`.

For BlockIT's current v1 registration path, the existing extracted object shape remains the MCP registration/listing representation. The original complete tool Zod schema is retained separately as the execution contract so top-level `ZodEffects` refinements are not discarded by the local factory.

## Implemented source contract

`ToolDefinition` retains both:

```text
inputSchema      → SDK-compatible extracted object shape
parameterSchema  → original complete Zod schema
```

Before tool logic runs, both registration paths execute:

```text
complete parameter schema parseAsync(args)
```

This applies to:

```text
initial singleton server registration
reconstructed per-session server registration
```

A complete-schema parse failure throws before tool logic and therefore reaches the SDK tool-error path rather than becoming an ordinary successful tool response from the implementation.

Tool annotations are passed in both registration definitions rather than remaining source-only metadata. Local annotation typing uses the installed SDK's `ToolAnnotations`, including supported `idempotentHint` metadata.

## P0.3 intentionally unchanged

- no individual tool received a validation workaround;
- no tool implementation behavior was otherwise changed;
- no SDK/protocol version change;
- no transport/session architecture change;
- no tests/CI framework was added early;
- no Animation, Geometry, Texture, Paint, Mesh, Armature, import/export, capability-profile, or generated-doc work was bundled into this slice.

## P0.3 proof boundary

Exact source/SDK control-flow inspection proves:

```text
complete Zod schema is retained for runtime validation
initial tool callback parses through the complete schema before execute()
reconstructed-session callback parses through the same complete schema before execute()
raw object shape remains the v1 registration/listing schema representation
supported annotations are passed to both registration paths
idempotentHint is supported by the installed SDK annotation type
no per-tool validation workaround or SDK migration was introduced
```

P0.4 isolated contract tests now additionally prove the `.refine()` and `.superRefine()` callbacks reject invalid input before tool logic in the test fixture and preserve annotations in both registration paths. Real Blockbench/MCP Inspector behavior remains local proof where applicable.

# Active Slice — P0.4 Engineering Gate

Primary package/repository owners:

```text
mcp/package.json
mcp/tsconfig.json
mcp/build/check-docs-freshness.ts
mcp/tests/p0-contracts.test.ts
.github/workflows/mcp-verify.yml
```

Implementation commits on `Local`:

```text
e1552da49b96a085ad0e08a45b89adc439ae34c1
test: add MCP engineering verification gate

e63e26457fcee8dac610762359981924d8c9e3fd
test: complete MCP engineering verification gate

4ca90aac0fbccc2a7d462a2b39fef285943cb02e
ci: report all MCP verification gates
```

## Implemented gate

The package now exposes:

```text
typecheck   → tsc --noEmit
test        → bun test
build       → existing production build
docs:check  → regenerate + compare checked-in generated docs
```

A repository-root workflow now installs from the committed Bun lockfile and runs all four gates. Individual verification steps are allowed to finish so one run reports the whole state, then a final aggregator fails closed if any gate failed.

The focused contract suite covers:

```text
top-level .refine() validation before initial tool execution
top-level .superRefine() validation before reconstructed-session execution
annotation preservation on both registration paths
disabled risky_eval / from_geo_json registration behavior
Origin rejection ordering before MCP transport dispatch
```

The generated-doc freshness checker is non-destructive: it snapshots the checked-in generated files, regenerates, ignores only the nondeterministic generation timestamp when comparing, reports stale substantive output, then restores the originals.

## Executable proof — GitHub Actions

Latest complete verification run for the gate implementation established:

```text
frozen-lockfile dependency install   PASS
focused Bun contract tests           PASS — 4 tests, 0 failures
production MCP build                 PASS
generated docs freshness             FAIL — api.json and index.html are stale
full package tsc --noEmit             FAIL
final workflow result                 FAIL-CLOSED
```

The stale generated docs are the already-known P0.5 problem. P0.4 correctly detects them; do not regenerate or hand-edit them inside P0.4 merely to make the check green.

## P0.4 blocker — full-package typecheck debt

The first real full-package `tsc --noEmit` gate exposed broad existing compile-time debt rather than one isolated P0.4 regression. Errors span, among others:

```text
mcp/lib/factories.ts
mcp/lib/hytale.ts
mcp/lib/util.ts
mcp/server/tools/animation*.ts
mcp/server/tools/armature.ts
mcp/server/tools/camera.ts
mcp/server/tools/cubes.ts
mcp/server/tools/element.ts
mcp/server/tools/hytale.ts
mcp/server/tools/mesh.ts
mcp/server/tools/paint.ts
mcp/server/tools/texture.ts
mcp/server/tools/ui.ts
mcp/server/tools/uv.ts
mcp/ui/*.ts
```

The errors include both actual local type-contract issues and apparent mismatches between current source/runtime APIs and `blockbench-types`. Resolving that entire list would materially broaden the current slice across Animation, Paint, Mesh, Hytale, Texture, UV, UI, and other families.

That broad remediation conflicts with the current feature-work freeze unless it is explicitly accepted as required engineering-debt work for P0.4. Do not hide the blocker by:

```text
weakening strict TypeScript
excluding failing source families from the package typecheck
adding broad ts-ignore / any / cast suppression
creating an unreviewed compatibility framework
```

A few `mcp/lib/factories.ts` prompt typing errors are directly local/shared-owner issues, but fixing only those cannot make the required full-package typecheck pass.

## Decision required before further P0.4 edits

The repository now has enough evidence to expose a real scope decision:

```text
Option A — authorize full-package type-safety remediation as part of P0.4,
           while preserving runtime behavior and fixing shared typing owners first.

Option B — do not widen P0.4; revise the governing stabilization order/acceptance
           explicitly before proceeding, because the currently required full
           package typecheck cannot pass without broader remediation.
```

Do not choose between these silently.

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  typecheck/tests/root CI                     ACTIVE / GATE IMPLEMENTED / BLOCKED BY FULL TYPECHECK
P0.5  generated-doc freshness                    WAITING — DO NOT START YET

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — Resolve P0.4 Typecheck Scope Only

Do not start P0.5 or P1 work.

Resolve whether the broad existing full-package TypeScript/Blockbench typing debt is authorized to be remediated inside P0.4, or whether the governing plan must be revised first. Until that decision is explicit, keep the fail-closed engineering gate and existing source behavior unchanged.

## Proof Boundary

GitHub Actions/package tests now prove the focused MCP contract fixtures and production build independently from the failing full-package typecheck and stale generated documentation.

Actual OS listener state, real MCP Inspector behavior where not covered by an isolated server fixture, Blockbench runtime behavior, Undo/Redo, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
