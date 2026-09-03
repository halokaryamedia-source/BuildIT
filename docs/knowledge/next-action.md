# Next Action

Updated: 2026-09-03 — Image Reference Route is the active priority

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; proof →
`docs/knowledge/current-validation.md`; source ownership →
`docs/knowledge/implementation-map.md`; detailed procedures stay with their
canonical owner.

## Current Status

```text
IMAGE REFERENCE ROUTE: SELECTED → GENERIC_REFERENCE_READY → SOURCE_READY
3D-ASSISTED ROUTE: PARKED — do not reactivate during Image Reference Route implementation
EXTENDED PROFILE PROOF: PARKED — do not reactivate during Image Reference Route implementation
```

The Image Reference Route is the default object-agnostic route. The 3D-Assisted
Route must never block it.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. tidy canonical flow, skills, prompts, and continuation
4. run the final verifier once after the rules are coherent
5. finish source/rule cleanup for Geometry → Texture → optional Animation in the Image Reference Route
6. run the final verifier once after all source/rule cleanup is complete
7. deploy/reconnect only when live Blockbench proof is explicitly reactivated
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
