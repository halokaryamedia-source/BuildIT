# Next Action

Updated: 2026-09-01 — Route 1 selected; BASE / EXTENDED design locked; local implementation/proof remains

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; complete capability contracts → `docs/knowledge/mcp-capability-backlog.md`; proof → `docs/knowledge/current-validation.md`; source ownership → `docs/knowledge/implementation-map.md`; local procedure → `docs/knowledge/operations/local-acceptance-runbook.md`.

## Current Status

```text
ROUTE 1: IMAGE_GLB_SELECTED → LOCAL_TEST_REQUIRED
MCP: BASE_EXTENDED_DESIGN_LOCKED → LOCAL_IMPLEMENTATION_REQUIRED
```

Do not reopen Route 1 image-only vs image+GLB selection. Do not restart broad feature research.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. establish a clean verifier baseline
4. resolve the legacy registration-profile name collision with capability EXTENDED
5. prove how same-phase EXTENDED definitions are made reachable with the current client/transport before broad routing implementation
   → do not combine this with an SDK/transport migration unless current mechanics cannot satisfy the contract
6. Core/project lifecycle consolidation
7. Geometry consolidation + selected Route 1 image+GLB live test
8. Texturing consolidation
9. Animation consolidation
10. implement final BASE / EXTENDED exposure/reuse from the consolidated owners
11. regenerate prompts/docs, run `bun run verify:mcp`, measure final surfaces
12. deploy/reconnect and run representative BASE, EXTENDED, reuse, and cross-phase handoff fixtures
```

Route 1 exact alignment/test flow lives in `Experimental/route1-hunyuan-poc/README.md` and the local runbook. Alignment math is already prepared in `mcp/lib/route1ReferenceAlignment.ts` with `mcp/tests/route1-reference-alignment.test.ts`.

## Locked Boundaries

```text
BASE / EXTENDED are the only capability-category names.
Same-phase BASE ↔ EXTENDED must not require reload/reconnect/reset.
Foreign phase still uses HANDOFF_REQUIRED.
Do not add packs, a second router, mesh→Cube conversion, extra Route 1 formats, non-uniform GLB scaling, or a new alignment tool without reproduced need.
Public ToolSpec/schema/runtime-prompt changes require LOCAL_CODE + Bun generators.
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.
