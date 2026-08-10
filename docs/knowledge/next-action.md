# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation before normal feature hardening resumes.

P0.1 local network containment is now implemented in source. Runtime/network proof remains local. The next source boundary is P0.2 dangerous default capability containment.

## Current Status

`MCP_P0_NETWORK_CONTAINMENT_SOURCE_COMPLETE_DANGEROUS_DEFAULTS_NEXT`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench/network testing remains required for runtime proof.

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

# Latest Completed Slice — P0.1 Local Transport Containment

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

GitHub has no registered CI/status checks for the source commit.

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

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   ← ACTIVE NEXT SLICE
P0.3  full-schema validation + real annotations
P0.4  typecheck/tests/root CI
P0.5  generated-doc freshness

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P0.2 Only

Contain **only the two highest-risk generic default capabilities**:

```text
risky_eval
from_geo_json
```

Primary source owners:

```text
mcp/server/tools/ui.ts
mcp/server/tools/import.ts
```

Inspect `mcp/lib/factories.ts` only to confirm the existing enabled/disabled registration semantics; do not redesign the factory in this slice.

Primary specialist:

```text
mcp-server-development
```

## Grounded existing mechanism

`createTool()` already accepts an `enabled` boolean. Disabled tools remain represented in local metadata but are not registered on the current server, and `registerToolsOnServer()` filters session reconstruction through enabled tool definitions.

Use that existing mechanism instead of building the P1 capability-profile system early.

## Required behavior

1. `risky_eval` must no longer be registered in the default MCP tool surface;
2. `from_geo_json` must no longer be registered in the default MCP tool surface;
3. reclassify `risky_eval` away from Stable/default semantics;
4. preserve source temporarily so removal/review remains explicit and reversible;
5. do not build a sandbox around `eval`;
6. do not create a replacement generic import/execution framework;
7. do not gate all UI/import families yet — P1 owns broader family profiles;
8. do not modify factories, transport, sessions, Animation, Geometry, Texture, Paint, Mesh, Armature, export, or generated docs unless direct source proof makes a minimal related change unavoidable;
9. inspect the exact source diff immediately;
10. advance to exactly P0.3 after this slice is recorded.

## Static acceptance

Must prove from source/diff:

```text
risky_eval enabled=false (or equivalent existing registration disable path)
from_geo_json enabled=false (or equivalent existing registration disable path)
risky_eval is no longer Stable/default metadata
other UI tools remain unchanged
no full capability-profile framework introduced
```

## Local proof required

Later local MCP inspection must confirm:

```text
tools/list omits risky_eval
tools/list omits from_geo_json
remaining intended default tools still register
no server initialization regression
```

## Proof Boundary

ChatGPT → GitHub may prove source/API/control-flow and exact diff only.

Actual network bind behavior, MCP tool-list visibility, Blockbench runtime behavior, Undo/Redo, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
