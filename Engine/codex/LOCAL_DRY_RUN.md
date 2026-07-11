# Local End-to-End Dry Run

Run only after the Rework plugin is built and reloaded locally. CI remains out of scope.

## Goal

Prove one approved package can complete deterministic connection, Geometry, Texture, optional Animation, and Final Validation with minimal reads, exposed tools, payload, calls, reconnects, and approvals.

Do not use the legacy kangaroo session first unless it has been migrated.

## Required Test Package

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

## 1. Intake and Connection

1. Create `SavedData/sessions/<asset>/` and `state.json` from schema 2.1.
2. Copy the approved package.
3. Build/reload `dist/mcp.js` in exactly one Blockbench window.
4. Run first-time Codex sync only when needed:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

5. Run normal readiness:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

6. Continue only when `reports/connection.json` is `PASS`.
7. Call `get_runtime_status` once.

Verify no alternate key, port, or session was created.

## 2. One-Time Asset Preflight

Under `BEDROCK_CUBOID_GEOMETRY`:

1. call `validate_reference_contract` with `require_evidence=false`;
2. verify project UUID, format, UV mode, texture dimensions, and package;
3. record manual edits;
4. save `00_session_start.bbmodel`;
5. update state;
6. do not repeat unchanged checks.

## 3. Geometry

- run Primary Form and Structural Detail internally;
- use bounded multi-part batches;
- save `10_geometry_review.bbmodel`;
- capture five standard views;
- create `geometry_report.json`;
- call `validate_reference_contract` for `GEOMETRY`;
- stop at `GEOMETRY_REVIEW`.

Test one local revision with `GEOMETRY_LOCAL_REPAIR`.

After explicit approval, call `complete_stage` once. Verify:

```text
20_geometry_approved.bbmodel
state revision +1
accepted Geometry areas protected
next profile = BEDROCK_CUBOID_TEXTURE
one reconnect only
```

## 4. Texture

- run UV, Base Texture, and Detail Texture internally;
- call `save_texture_evidence` for `texture_atlas.png`;
- save `30_texture_review.bbmodel`;
- capture required standard views;
- create `texture_report.json`;
- stop at `TEXTURE_REVIEW`.

Verify no full atlas base64 round-trip is needed merely to persist evidence.

Test one local revision with `TEXTURE_LOCAL_REPAIR`.

After explicit approval, call `complete_stage` once. Verify either:

```text
BEDROCK_CUBOID_ANIMATION
```

or, when Animation is not required:

```text
ANIMATION_SKIPPED
FINAL_VALIDATION_READONLY
```

## 5. Animation

When required:

- create only approved hierarchy, pivots, and clips;
- save review checkpoint/evidence;
- stop at `ANIMATION_REVIEW`;
- test one named repair when useful;
- after explicit approval, call `complete_stage` once.

When not required, create no fake clips or evidence.

## 6. Final Validation

Under `FINAL_VALIDATION_READONLY`:

1. export final candidate;
2. call `save_texture_evidence` for `final_texture_atlas.png`;
3. capture final five views;
4. complete `VALIDATION.md` and reports;
5. call `validate_reference_contract` for `FINAL_VALIDATION`;
6. route local failures to the smallest repair profile;
7. allow at most two local automatic fixes;
8. stop at `FINAL_REVIEW`.

After explicit final approval, call `complete_stage` once and verify `DONE` plus `80_validation_pass.bbmodel`.

## Runtime Profile Proof

For every normal profile verify:

- `tools/list` matches the exact count in `TOOL_PROFILE_AUDIT.md`;
- hash is stable after reconnect;
- forbidden tools are absent;
- stale calls return `TOOL_PROFILE_BLOCKED`;
- cross-stage arguments return `TOOL_PROFILE_ARGUMENT_BLOCKED`;
- one profile change needs at most one reconnect.

## Compact Tool Proof

Verify:

- `validate_reference_contract` returns one deterministic structured issue list;
- `save_texture_evidence` writes PNG + metadata inside the session root;
- outside-root writes fail;
- missing evidence blocks `complete_stage`;
- stale state revision blocks `complete_stage`;
- checkpoint, state, accepted areas, and profile remain consistent;
- `get_project_info` and `get_uv_layout` return structured content.

## Measurement Log

Record only actionable waste:

```text
Repeated document read:
Repeated preflight/validation call:
Unnecessary MCP call:
Large avoidable payload:
Unnecessary screenshot:
Unnecessary approval:
Profile reconnect beyond stage transition:
Tool-selection error:
State/checkpoint mismatch:
Manual step repeated enough to justify automation:
```

## Pass Criteria

- one connection command/report;
- one asset preflight;
- exact stage profiles;
- no connection search;
- no base64 evidence round-trip;
- one compact validation result per required gate;
- one `complete_stage` call per approved stage;
- each user-visible stage has one review gate;
- persistent recovery exists at every stage;
- Final Validation adds no features;
- no CI and no merge to `V1` during this proof.

A new automation is justified only by measured repeated work or meaningful token/error reduction. Otherwise record `DEFERRED_NOT_REQUIRED`.
