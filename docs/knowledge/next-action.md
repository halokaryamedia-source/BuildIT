# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation before normal feature hardening resumes.

The governing audit and ordered implementation plan now exist. Source implementation has **not** started yet.

## Current Status

`MCP_REDUCTION_PLAN_RECORDED_P0_NETWORK_CONTAINMENT_NEXT`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench/network testing remains required for runtime proof after the source slice.

## Governing Evidence

Audit:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

Audit commit:

```text
ed62775c16fc544f99a00384f45cae28d37b8a75
docs: record MCP development quality audit
```

## Governing Plan

```text
docs/knowledge/operations/mcp-reduction-stabilization-plan.md
```

Plan commit:

```text
9d80760bb910aba9793cbaa0f003de6107d77603
docs: add MCP reduction stabilization plan
```

The plan is the P0→P2 work order. Do not skip ahead unless new evidence invalidates its dependency order.

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

Non-core generic capabilities are planned to become gated/quarantined/removed rather than hardened by default.

## Protocol / SDK Decision For Current Stabilization

Do **not** migrate SDK/protocol during P0.

Current primary-source review shows:

- stable Streamable HTTP security guidance already requires Origin validation and recommends loopback binding for local servers;
- the 2026-07-28 protocol changes session/HTTP semantics materially;
- the TypeScript SDK v2 / 2026 revision migration remains a separate pre-release/RC-era decision boundary at the time this plan was recorded.

Therefore:

- secure the current v1 transport first;
- do not add more custom session/keepalive features;
- reconsider transport/session architecture later at P1.4 using then-current stable primary evidence and actual supported clients.

## Frozen Strong Work

Preserve the recent stronger patterns while stabilizing:

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

The known `animation_timeline.select_range` lifecycle defect remains valid but parked.

## Current Work Order

```text
P0.1  loopback + Origin containment              ← ACTIVE NEXT SLICE
P0.2  dangerous default capability containment
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

## Next Step — P0.1 Only

Audit and correct **only local transport containment** in:

```text
mcp/server/net.ts
mcp/index.ts
```

Primary specialist:

```text
mcp-server-development
```

Before editing, re-check the current stable official MCP Streamable HTTP security requirements and inspect the installed SDK/runtime call path.

### Required behavior

1. explicitly bind the default MCP server to loopback rather than relying on the `localhost` log string;
2. use/complete the existing `host` option instead of creating another network configuration layer;
3. validate a present HTTP `Origin` before MCP transport handling;
4. reject an invalid present Origin with HTTP `403 Forbidden`;
5. preserve intended local non-browser clients that omit Origin;
6. keep non-loopback/remote serving unsupported in the default product;
7. do **not** add OAuth/token/auth infrastructure in this slice;
8. do not change tool behavior, MCP schemas, Animation, Geometry, Texture, session architecture, keepalive architecture, or SDK version;
9. inspect the exact source diff immediately after implementation;
10. advance to exactly one next P0 boundary only after this slice is recorded.

### Static acceptance

Must prove from source/diff:

```text
explicit loopback host reaches listen()
Origin validation runs before MCP transport dispatch
invalid present Origin has deterministic HTTP 403 path
no unrelated source family changed
```

### Local proof required

Static GitHub work cannot prove:

```text
actual OS listener address
successful intended MCP client connection
actual 403 response over the runtime server
absence of compatibility regressions
```

Later local proof must check at least:

```text
listener is loopback-only
MCP Inspector/intended local client still connects
external/non-local Origin is rejected
normal local tool call still works
```

## Proof Boundary

ChatGPT → GitHub may prove source/API/control-flow and exact diff only.

Actual network bind behavior, MCP request handling, Blockbench runtime behavior, tool list visibility, Undo/Redo, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
