# Next Action

Updated: 2026-09-03 — efficient object-agnostic image-reference path defined

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; proof →
`docs/knowledge/current-validation.md`; source ownership →
`docs/knowledge/implementation-map.md`; detailed procedures stay with their
canonical owner.

## Current Status

```text
MAIN: IMAGE_REFERENCE_SELECTED → GENERIC_REFERENCE_READY → LOCAL_IMPLEMENTATION_REQUIRED
OPTIONAL ROUTE 1: IMAGE_GLB_SELECTED → GLB_REFERENCE_LOADED → PRIMITIVEANYTHING_POC_PREPARED → LOCAL_POC_REQUIRED
MCP: BASE_EXTENDED_DESIGN_LOCKED → LOCAL_IMPLEMENTATION_REQUIRED
```

The Main Image-Reference Path is the default object-agnostic route and the
optional Route 1 POC must never block it.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. tidy canonical flow, skills, prompts, and continuation
4. run the final verifier once after the rules are coherent
5. resolve the legacy registration-profile collision with capability EXTENDED
6. prove how same-phase EXTENDED definitions are reachable with the current client/transport
7. consolidate Core/project lifecycle
8. implement Geometry → Texture → optional Animation main path
9. regenerate derived prompts/docs and verify final surfaces
10. deploy/reconnect only when live Blockbench proof is explicitly reactivated
```

## Optional Route 1

PrimitiveAnything remains a local-proof experiment. Its exact setup and gates
are owned by:

```text
Experimental/primitiveanything-poc/README.md
```

Run it only for an approved clean single-object GLB. Fragmented or multiview
GLB returns to the Main Image-Reference Path. No production integration before
local visual gates pass.

## Locked Boundaries

```text
main authoring order = Geometry → Texture → optional Animation
final output boundary = validated `.bbmodel`
In-Game Preview is outside the main flow
BASE / EXTENDED are the only capability-category names
same-phase BASE ↔ EXTENDED must not require reload/reconnect/reset
foreign phase uses HANDOFF_REQUIRED
no production mesh→Cube conversion before the optional POC proves its bridge
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.
