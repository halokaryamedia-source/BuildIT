# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation before normal feature hardening resumes.

P0.1 local network containment, P0.2 dangerous default capability containment, and P0.3 real MCP schema enforcement + annotations are now implemented in source. Runtime/network/tool-list/schema behavior proof remains local or belongs to the upcoming regression gate. The next source boundary is P0.4 typecheck/tests/root CI.

## Current Status

`MCP_P0_SCHEMA_ENFORCEMENT_SOURCE_COMPLETE_ENGINEERING_GATE_NEXT`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench/MCP testing remains required for runtime proof.

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

GitHub has no registered CI/status checks for the source commit.

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

# Latest Completed Slice — P0.3 Real MCP Schema Enforcement + Annotations

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

For BlockIT's current v1 registration path, the existing extracted object shape remains the MCP registration/listing representation. The original complete tool Zod schema is now retained separately as the execution contract so top-level `ZodEffects` refinements are not discarded by the local factory.

## Implemented source contract

`ToolDefinition` now retains both:

```text
inputSchema      → SDK-compatible extracted object shape
parameterSchema  → original complete Zod schema
```

Before tool logic runs, both registration paths now execute:

```text
complete parameter schema parseAsync(args)
```

This applies to:

```text
initial singleton server registration
reconstructed per-session server registration
```

A complete-schema parse failure throws before tool logic and therefore reaches the SDK tool-error path rather than becoming an ordinary successful tool response from the implementation.

Tool annotations are now passed in both registration definitions rather than remaining source-only metadata. Local annotation typing now uses the installed SDK's `ToolAnnotations`, including supported `idempotentHint` metadata.

## P0.3 intentionally unchanged

- no individual tool received a validation workaround;
- no tool implementation behavior was otherwise changed;
- no SDK/protocol version change;
- no transport/session architecture change;
- no tests/CI framework was added early;
- no Animation, Geometry, Texture, Paint, Mesh, Armature, import/export, capability-profile, or generated-doc work was bundled into this slice.

GitHub has no registered CI/status checks for the source commit.

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

Still `LOCAL PROOF REQUIRED` or targeted P0.4 regression proof:

```text
a top-level .refine() invalid input is rejected before tool logic
a .superRefine() invalid input is rejected before tool logic
tool annotations are visible through tools/list / MCP Inspector
reconstructed session registration exposes the same schema/annotation behavior
normal valid tool execution still works
```

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / RUNTIME REGRESSION PROOF PENDING
P0.4  typecheck/tests/root CI                     ← ACTIVE NEXT SLICE
P0.5  generated-doc freshness

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P0.4 Only

Create the repository's **real MCP engineering gate**. Do not move into generated-doc freshness or P1 capability reduction yet.

Primary package/repository owners:

```text
mcp/package.json
mcp/tsconfig.json
repository-root .github/workflows/
focused MCP contract tests
```

Primary specialist:

```text
mcp-server-development
```

Before editing, inspect the current package scripts, compiler configuration, existing nested workflow, build entrypoints, and the smallest seams required to test the already identified P0 contracts. Do not create broad low-value coverage.

## Required behavior

1. add a real package `typecheck` command using `tsc --noEmit`;
2. replace the placeholder test command with real Bun contract tests;
3. retain the current production build as a separate gate;
4. establish a repository-root GitHub Actions workflow that runs against the `mcp/` package;
5. install dependencies from the committed lockfile;
6. gate full package typecheck;
7. gate focused contract tests;
8. gate the production build;
9. include generated-document freshness assertion only to the extent required by the approved P0 gate, without hand-editing generated docs or starting P0.5 source/docs cleanup early;
10. target the high-risk contracts already identified by the audit rather than creating broad coverage;
11. inspect the exact source/workflow diff immediately after implementation;
12. advance to exactly P0.5 only after this slice is recorded.

## Initial targeted regression scope

The engineering gate must cover the smallest useful seams for:

```text
full-schema refinement preservation
annotation registration
Origin validation helper/path
disabled/quarantined tool exposure
generated-doc freshness
```

Do not convert live Blockbench behavior into fake unit proof. Tests should cover contracts that can actually be exercised outside Blockbench; runtime-only behavior remains explicitly local proof.

## Static / executable acceptance

Must establish executable repository evidence for:

```text
bun lockfile install path
full TypeScript typecheck
focused Bun contract tests
production MCP build
repository-root MCP verification workflow
clear separation between static/automated proof and local Blockbench proof
```

Do not claim P0.4 complete while `tsc --noEmit` still fails.

## Proof Boundary

GitHub Actions/package tests may prove compile/build and isolated MCP contract behavior that does not require Blockbench globals.

Actual OS listener state, real MCP Inspector behavior where not covered by an isolated server fixture, Blockbench runtime behavior, Undo/Redo, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
