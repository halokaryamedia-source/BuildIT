# Next Action

Updated: 2026-09-04 — Image Reference Route paused on Codex MCP registry refresh

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; proof →
`docs/knowledge/current-validation.md`; source ownership →
`docs/knowledge/implementation-map.md`; detailed procedures stay with their
canonical owner.

## Current Status

```text
IMAGE REFERENCE ROUTE: SELECTED → GENERIC_REFERENCE_READY → SOURCE_READY → LOCAL_VERIFIED
3D-ASSISTED ROUTE: PARKED — do not reactivate during Image Reference Route implementation
EXTENDED PROFILE PROOF: PARKED — do not reactivate during Image Reference Route implementation
LIVE BLOCKBENCH AUTHORING: BLOCKED — BlockIT server healthy, current Codex task MCP registry unavailable
```

## Resume BlockIT Elevator Authoring

Current live evidence: BlockIT reports product `blockit-bedrock-entity-mcp`, version
`0.1.0`, profile `bedrock_entity`, phase `geometry`, and 25 exposed tools; the
current Codex task does not receive that tool registry after full app exit/reopen.
Do not author through a partial or absent MCP surface and do not emulate missing
tools through raw HTTP.

```text
1. Reconnect/refresh the MCP registry for this existing task when Codex exposes that capability.
2. Verify add_group, manage_cubes, inspect_elements, capture_model_views, and validator are callable.
3. Recheck project elevator_image_reference_6x5x5; preserve it and do not discard other projects.
4. Build coherent primary Geometry for 6×5×5 blocks (96×80×80 units), including the left transparent glass panel.
5. Capture model views and compare against the attached reference before claiming visual PASS.
6. Continue Texture, optional Animation, validation, and export of the final `.bbmodel`.
```

The Image Reference Route is the default object-agnostic route. The 3D-Assisted
Route must never block it.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. deploy/reconnect only when live Blockbench proof is explicitly reactivated
```

## Parked Work

The following work is intentionally deferred while the Image Reference Route is active:

```text
Experimental/primitiveanything-poc/README.md
```

```text
3D-Assisted Evidence proof (GLB + Primitive Decomposition)
Standard ↔ Extended same-phase proof
```

Their detailed procedures remain in the existing owner documents. Do not
restart them or add production integration until the Image Reference Route reaches a
stable `.bbmodel` result.

## Locked Boundaries

```text
main authoring order = Geometry → Texture → optional Animation
final output boundary = validated `.bbmodel`
In-Game Preview is outside the main flow
Standard / Extended are the MCP Profile names
same-phase Standard ↔ Extended must not require reload/reconnect/reset
foreign phase uses HANDOFF_REQUIRED
registration is idempotent by family; Extended adds only retained fallback families
no production mesh→Cube conversion before the optional POC proves its bridge
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.
