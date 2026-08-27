# Validation Report

Updated: 2026-08-27 — static safety hardening verified; local runtime proof deferred

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 64 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (27 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + FULL MCP STATIC PROOF
CODEX FIRST-CALL LEGIBILITY:              SOURCE + FULL MCP STATIC PROOF
BUILD BUNDLE IDENTITY:                    SOURCE + FULL MCP STATIC PROOF
LATEST FULL MCP VERIFY:                   GREEN @ f2db288764382d4e4a2c6daca80e65359ad670a4
LAST OBSERVED FULL CANONICAL GREEN:       f2db288764382d4e4a2c6daca80e65359ad670a4
REPOSITORY CONTRACT BASELINE:             GREEN @ 471799dd12dcc84928f612b66b17b1319f966fc8
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
CURRENT HARDENING LIVE RETEST:            DEFERRED BY USER; LOCAL PROOF REQUIRED
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Current static proof must not be confused with live Blockbench behavior. Source/typecheck/tests/build/docs checks can prove phase ownership, prompt filtering, handoff semantics, schemas, buildability, generated-doc freshness, source-owned phase surface, and bundle-fingerprint generation; they cannot prove visual fidelity, installed-plugin freshness, live Codex tool exposure, playback, future Codex call efficiency, or Authoring Efficiency.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Runtime initialize instructions name `ACTIVE PHASE`, carry the Bedrock coordinate invariant (`16 Blockbench units = 1 Minecraft block`, `x=width`, `y=height`, `z=length`, `+Y=up`), explain that foreign-phase tools are intentionally unavailable, and require `HANDOFF_REQUIRED` rather than foreign-tool search. Runtime workflow generation remains phase-filtered: shared minimum-evidence guidance + only the current phase workflow + compact readiness/handoff state.

The current full MCP gate passed at `f2db288764382d4e4a2c6daca80e65359ad670a4`:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

The current full test suite has no failing contract tests. Surface measurement remains within the existing ceilings and preserves the 64-tool retained catalog.

Current regression coverage additionally proves:

- missing phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only (27 tools);
- retained callable tools have one ownership category;
- Direct Geometry remains free of the retired plan/compiler requirement;
- initialize instructions name phase, Bedrock units/axes, foreign-tool absence, readiness, handoff, and STOP;
- active Geometry routing distinguishes `add_group` from rig-specific `bone_rigging` and dedicated structural delete/rename routes;
- first-call conditional invariants remain explicit for rotated Cubes, `add_group`, `modify_cube`, Locator, and Null Object mutation;
- Geometry/Texturing/Animation runtime prompt bodies exclude foreign-phase authoring routes;
- specialists do not direct-call foreign-phase mutation;
- intentionally disabled generic helpers are not treated as expected discovery targets;
- routed exact-name discovery has full recall at the inspected default limit 8;
- loopback/stateless transport, Origin/Host guards, request limits, and active socket cleanup retain regression coverage;
- plugin startup does not enter ready UI before TCP bind and fails closed on bind error;
- bind-failure verification checks structural cleanup/reset/return ordering rather than a mutable log sentence;
- build output receives a deterministic SHA-256 bundle identity without changing release version;
- `/health.build_identity` is distinct from `product.version`, `instance_id`, and `startup_time`;
- unbundled source health fails closed to the explicit `source` build identity rather than pretending to be a packaged bundle.

## Bundle Freshness Identity

The build owner computes SHA-256 over the emitted MCP bundle content before adding the diagnostic banner, then injects:

```text
globalThis.__BLOCKIT_BUILD_ID__ = "sha256:<64 lowercase hex>"
```

The production build fails if the expected bundle is absent or the identity banner is not written. The build log prints the resulting fingerprint so a future local `/health` response can be compared against the exact locally built artifact.

Identity responsibilities remain separate:

```text
product.version    = release/development version; currently 0.1.0
build_identity     = exact built-bundle SHA-256 identity
instance_id        = running server-process identity
startup_time       = running server-process start time
```

The fingerprint is diagnosis only. It is not a cache-buster, release version, session key, UI state, telemetry stream, or reconnect mechanism. The Blockbench panel intentionally remains free of build-fingerprint state.

## Discovery / Static Footprint Proof

Current routed exact-name discovery remains:

```text
raw semantic stress:
top_1_accuracy  0.5385
top_3_recall    0.7788
top_8_recall    0.8846
MRR             0.6790

routed exact-name loading:
top_1_accuracy  0.8173
top_3_recall    0.9327
top_8_recall    1.0000
MRR             0.8844
top_8_misses    0
```

Raw semantic search remains a stress metric. The normal path is active-phase routing first, then exact routed spec loading when needed. Top-1/top-3/MRR are diagnostics, not standalone product-success claims.

## Current Static / Source State

Current retained source includes:

- 64-tool normal Bedrock callable catalog across phases;
- default client exposure narrowed to MCP Core + Geometry (27 tools);
- phase-specific runtime workflow and active-specialist-only routing;
- deterministic `HANDOFF_REQUIRED` with readiness + compact resume state;
- Bedrock unit/axis contract in MCP initialize;
- coherent Cube and Group batching;
- deterministic non-overlapping Box-UV packing and returned `box_uv_region`;
- logical UV resolution 128 default / 256 opt-in;
- Texture Atlas/Painter/PBR/material-instance authoring;
- Bedrock animation, effects, controller mutation/inspection;
- Locator/Null Object lifecycle;
- Undo/history, `.bbmodel`, and Bedrock geometry export;
- loopback-only request-owned/stateless transport;
- fail-closed TCP-bind lifecycle;
- SHA-256 packaged-bundle freshness identity in `/health`;
- `risky_eval` and `from_geo_json` disabled.

The safety hardening did not add a router, registration profile, reconnect daemon, telemetry layer, alternate transport, compatibility framework, Geometry compiler, or Route 1 model workaround.

## Box-UV / Phase Boundary

Geometry owns UV Layout mutation. After Geometry `PASS`, final Box-UV state is locked with `autouv=0` where applicable, then `list_textures` performs the global UV audit. Texturing may read/audit UV state but must return required UV/geometry correction to Geometry via `HANDOFF_REQUIRED`.

```text
Geometry PASS
→ UV Layout finalization
→ final Box-UV lock
→ list_textures audit
→ UV Layout PASS
→ HANDOFF_REQUIRED(texturing)
```

## Surface Guard

```text
retained Bedrock callable catalog  64 tools
default Geometry exposure           27 tools
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,000 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
canonical workflow source           < 9,000 characters
```

These are **Static Footprint** regression ceilings. Character counts are regression ceilings, not client token measurements and not Authoring Efficiency proof. `bun run measure:surface` passed on the current MCP-green commit above.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

Static CI cannot prove visual fidelity. Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and scalar similarity cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

Useful runtime observations include discovery calls, redundant readbacks, tool-search misses, placement batching, capture calls, correction outcomes, recovery, and same-cause retries. Unknown token/latency remains `UNVERIFIED` rather than estimated.

## Canonical Static Proof History

Commit `f2db288764382d4e4a2c6daca80e65359ad670a4` is the current observed **full canonical MCP green** after bundle-fingerprint and verifier hardening. Earlier green commits remain historical evidence only; current proof supersedes them for the static MCP boundary.

`REPOSITORY CONTRACT BASELINE` above records the last proof-doc/repository baseline before this reconciliation. This reconciliation itself must pass current Repository Verify before being treated as delivered.

## Local Runtime History

### ACCEPTED LIVE BASELINE — 2026-08-12

Historical live coverage included loopback/stateless transport, then-current tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, persistence, and export.

Historical live runs do not automatically prove the exact-current installed BlockIT/Codex surface.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

The exact-current source has full static MCP verification and stronger packaged-bundle freshness diagnostics. The local installed-runtime retest is **DEFERRED BY USER** and remains `LOCAL PROOF REQUIRED`; no live Geometry-surface PASS is claimed.

Do not continue static development without a new concrete failing invariant. When the user later reactivates local verification, compare the locally printed bundle SHA-256 identity with `/health.build_identity`, then inspect the fresh live Geometry `tools/list` before Route 1 authoring.
