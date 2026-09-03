# Next Action

Updated: 2026-09-03 — main image-reference path is the active priority

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; proof →
`docs/knowledge/current-validation.md`; source ownership →
`docs/knowledge/implementation-map.md`; detailed procedures stay with their
canonical owner.

## Current Status

```text
MAIN: IMAGE_REFERENCE_SELECTED → GENERIC_REFERENCE_READY → LOCAL_IMPLEMENTATION_REQUIRED
OPTIONAL ROUTE 1: PARKED — do not reactivate during Main Path implementation
EXTENDED PROFILE PROOF: PARKED — do not reactivate during Main Path implementation
```

The Main Image-Reference Path is the default object-agnostic route and the
optional Route 1 POC must never block it.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. tidy canonical flow, skills, prompts, and continuation
4. run the final verifier once after the rules are coherent
5. consolidate Core/project lifecycle
6. implement Geometry → Texture → optional Animation main path
7. regenerate derived prompts/docs and verify final surfaces
8. deploy/reconnect only when live Blockbench proof is explicitly reactivated
```

## Parked Work

The following work is intentionally deferred while the Main Path is active:

```text
Experimental/primitiveanything-poc/README.md
```

```text
GLB / PrimitiveAnything proof
BASE ↔ EXTENDED same-phase proof
```

Their detailed procedures remain in the existing owner documents. Do not
restart them or add production integration until the Main Path reaches a
stable `.bbmodel` result.

## Locked Boundaries

```text
main authoring order = Geometry → Texture → optional Animation
final output boundary = validated `.bbmodel`
In-Game Preview is outside the main flow
BASE / EXTENDED are the only capability-category names
same-phase BASE ↔ EXTENDED must not require reload/reconnect/reset
foreign phase uses HANDOFF_REQUIRED
registration is idempotent by family; EXTENDED adds only retained fallback families
no production mesh→Cube conversion before the optional POC proves its bridge
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.
