# Next Action

Updated: 2026-09-04 — Gateway + authoring taxonomy gate

Working branch: **`Local` only**. Continuation only; stable facts → `CONTEXT.md`, proof → `current-validation.md`, ownership → `implementation-map.md`.

## Current Status

```text
BLOCKIT GATEWAY: SOURCE_READY
AUTHORING TAXONOMY: SOURCE_READY — one Reference-Grounded flow
LIVE GATEWAY PROOF: PENDING — requires local Codex + Blockbench
OPTIONAL 3D EVIDENCE: AVAILABLE / EXPERIMENTAL / GEOMETRY-ONLY
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

Canonical client/authoring path:

```text
Codex → stdio Gateway → loopback BlockIT Runtime → Blockbench
Approved image + optional 3D Evidence → Geometry → Texturing → Animation when required
```

There is no normal Image-vs-3D route choice and no Standard-vs-Extended authoring profile choice. Runtime phase handoff must refresh only the Gateway backend catalog and keep the same client task alive.

## Next Live Gate

```text
1. git switch Local && git pull --ff-only
2. Configure Codex MCP `blockit` to run `mcp/gateway/index.ts` via Bun stdio; disable the old direct Blockbench MCP entry.
3. With Blockbench closed: Gateway tools remain callable; status reports Runtime offline.
4. Open Blockbench: same Codex task reports Runtime online and can search/describe current capabilities.
5. In the same Codex task, switch Geometry → Texturing → Geometry and verify no client reconnect/new chat is required.
6. Repeat plugin reload and Blockbench close/open cycles.
7. Change/rebuild one backend tool surface, reload BlockIT, and verify the same Gateway task reads the refreshed catalog.
```

PASS only when the Codex-facing Gateway survives those cycles, phase handoff continues the same task, and interrupted mutations are never blindly retried.

After PASS, resume `elevator_image_reference_6x5x5` from preserved project state and continue Geometry → Texturing → optional Animation → validated `.bbmodel`.

## Locked Boundaries

```text
Blockbench owns model/project/Undo state; Gateway owns routing/recovery only.
Native Runtime MCP remains available for Inspector/conformance/debugging.
Optional 3D Evidence never becomes production geometry.
Legacy UI Fallbacks never become a normal authoring profile.
No new chat/restart recommendation as normal BlockIT recovery.
```
