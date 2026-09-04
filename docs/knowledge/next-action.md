# Next Action

Updated: 2026-09-04 — Gateway stability gate

Working branch: **`Local` only**. Continuation only; stable facts → `CONTEXT.md`, proof → `current-validation.md`, ownership → `implementation-map.md`.

## Current Status

```text
BLOCKIT GATEWAY: SOURCE_READY
LIVE GATEWAY PROOF: PENDING — requires local Codex + Blockbench
IMAGE REFERENCE ROUTE: PAUSED UNTIL CONNECTION GATE PASSES
3D-ASSISTED ROUTE: PARKED
EXTENDED PROFILE PROOF: PARKED — same-phase Standard ↔ Extended
```

The Gateway is the candidate stable client boundary:

```text
Codex → stdio Gateway → loopback BlockIT Runtime → Blockbench
```

Gateway startup must not depend on Blockbench. Runtime reload/profile/phase changes must refresh only the Gateway backend catalog, never require a new Codex chat.

## Next Live Gate

```text
1. git switch Local && git pull --ff-only
2. Configure Codex MCP `blockit` to run `mcp/gateway/index.ts` via Bun stdio; disable the old direct Blockbench MCP entry.
3. With Blockbench closed: Gateway tools remain callable; status reports runtime offline.
4. Open Blockbench: same Codex task reports runtime online and can search/describe current capabilities.
5. In the same Codex task, repeat plugin reload and Blockbench close/open cycles. No Codex restart, new chat, or manual MCP reconnect is allowed.
6. Change/rebuild one backend tool surface, reload BlockIT, and verify the same Gateway task reads the refreshed capability catalog.
```

PASS only when the Codex-facing Gateway stays available through those cycles and interrupted mutations are never blindly retried.

After PASS, resume `elevator_image_reference_6x5x5` from its preserved project state and continue Geometry → Texture → optional Animation → validated `.bbmodel`.

## Locked Boundaries

```text
Blockbench owns model/project/Undo state; Gateway owns routing/recovery only.
Native Runtime MCP remains available for Inspector/conformance/debugging.
No production domain façade expansion before the connection gate passes.
No new chat/restart recommendation as normal BlockIT recovery.
```
