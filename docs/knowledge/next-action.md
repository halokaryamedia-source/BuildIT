# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation before normal feature hardening resumes.

P0.1 local network containment and P0.2 dangerous default capability containment are now implemented in source. Runtime/network/tool-list proof remains local. The next source boundary is P0.3 real MCP schema enforcement + annotations.

## Current Status

`MCP_P0_DANGEROUS_DEFAULTS_SOURCE_COMPLETE_SCHEMA_ENFORCEMENT_NEXT`

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

# Latest Completed Slice — P0.2 Dangerous Default Capability Containment

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

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  ← ACTIVE NEXT SLICE
P0.4  typecheck/tests/root CI
P0.5  generated-doc freshness

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P0.3 Only

Make the **existing MCP tool factory** the real public-contract owner.

Primary source owner:

```text
mcp/lib/factories.ts
```

Primary specialist:

```text
mcp-server-development
```

Before editing, inspect the installed current SDK types/runtime registration path and the existing Zod schema handling. Stay on the current SDK line; do not migrate protocol/SDK in this slice.

## Required behavior

1. preserve each tool's original complete Zod schema for execution;
2. validate callback args through that complete schema before tool logic runs so top-level `.refine()` / `.superRefine()` rules cannot disappear;
3. continue supplying the installed v1 SDK-compatible `inputSchema` representation required for registration;
4. pass supported tool annotations through both initial registration and reconstructed session registration;
5. include `idempotentHint` in local annotation typing only if the installed SDK supports it;
6. keep initial and reconstructed registration behavior contract-equivalent;
7. do not duplicate validation inside individual tools to compensate for the factory;
8. keep schema construction free of Blockbench globals;
9. do not change tool behavior outside what is required by real schema/annotation enforcement;
10. do not add tests/CI framework early — P0.4 owns the engineering gate;
11. inspect the exact source diff immediately after implementation;
12. advance to exactly P0.4 only after P0.3 is recorded.

## Error policy

Input-contract failure must become a real failed tool call / SDK validation error, not an ordinary successful text result.

Tool implementations may continue returning targeted application-level errors for validly-shaped inputs when useful.

## Static acceptance

Must prove from source/diff:

```text
complete Zod schema is retained for runtime validation
initial tool execution validates args through the complete schema
reconstructed-session execution validates args through the same complete schema
supported annotations are passed to both registration paths
no per-tool validation workaround was introduced
no SDK/protocol migration or unrelated feature-family change was introduced
```

## Runtime / later regression proof required

Local MCP/Blockbench or the P0.4 targeted contract-test gate must confirm:

```text
a top-level .refine() invalid input is rejected before tool logic
a .superRefine() invalid input is rejected before tool logic
tool annotations are visible through tools/list / MCP Inspector
reconstructed session registration exposes the same schema/annotation behavior
normal valid tool execution still works
```

## Proof Boundary

ChatGPT → GitHub may prove source/API/control-flow and exact diff only.

Actual network bind behavior, MCP tool-list visibility, SDK runtime rejection behavior, Blockbench runtime behavior, Undo/Redo, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
