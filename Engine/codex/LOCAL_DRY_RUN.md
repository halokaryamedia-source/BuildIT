# Local End-to-End Dry Run

Run only after the Rework plugin is built/reloaded locally. CI remains out of scope.

## Goal

Prove one approved reference package can move through deterministic connection, exact tool exposure, intake, Geometry, Texture, optional Animation, and Final Validation with:

- no connection searching;
- no legacy numbered-sheet dependency;
- one runtime authority;
- one connection readiness report;
- exact stage/repair tool profiles;
- one asset preflight;
- minimal document reads;
- bounded MCP batches;
- stable evidence;
- correct review/revision transitions;
- persistent checkpoints;
- no unnecessary approvals or overdevelopment.

## Test Asset

Use one new/disposable asset with:

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

Do not use the legacy kangaroo session first unless it has been migrated.

## Run Sequence

### 1. Workspace and Intake

- create `SavedData/sessions/<asset>/` from the folder convention;
- copy the approved package;
- create `state.json` from schema 2.1;
- validate package and authority order;
- record Animation required/skipped logic;
- result: `REFERENCE_READY` or explicit blocker.

### 2. Deterministic Connection

- open exactly one Blockbench window;
- load the rebuilt Rework MCP plugin;
- open/create the intended project;
- first time only, run:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

- restart Codex once if required;
- run:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Verify:

- `reports/connection.json` is `PASS`;
- server key is `blockbench`;
- URL is `http://localhost:3000/bb-mcp`;
- readiness session is closed;
- required common tools exist;
- expected profile is aligned before Codex connects;
- active project UUID/format/UV mode/texture size are recorded;
- Codex creates no alternate key, port, or session.

After Codex connects, call `get_runtime_status` once. Do not repeat discovery if it passes.

### 3. Tool Profile Baseline

Call:

```text
get_tool_profile(include_tools=true)
```

For `BEDROCK_CUBOID_GEOMETRY`, verify:

- profile status is `PASS`;
- exposed count is `17`;
- profile hash is present;
- total library count is greater than exposed count;
- PBR, Hytale, mesh UV, armature, UI automation, and eval tools are absent;
- state profile ID/hash/count match runtime.

Verify one cross-stage argument is rejected without changing the project:

```text
place_cube with explicit texture or custom face UV
→ TOOL_PROFILE_ARGUMENT_BLOCKED
```

Do not intentionally execute a destructive forbidden tool merely to prove absence.

### 4. One-Time Asset Preflight

- verify one Codex write-session owner;
- verify the exact Geometry profile;
- record manual edits;
- create `00_session_start.bbmodel`;
- update state;
- do not repeat unchanged checks.

### 5. Geometry

- run Primary Form + Structural Detail internally;
- use bounded multi-part batches where safe;
- save Geometry review checkpoint;
- capture five standard views;
- create Geometry report;
- stop at `GEOMETRY_REVIEW`.

Test one approval path and one local revision path that preserves unrelated areas.

For revision:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/set-tool-profile.ps1 -Asset <asset> -Profile GEOMETRY_LOCAL_REPAIR
```

Verify:

- one reconnect refreshes `tools/list`;
- repair profile count is `15`;
- a stale non-repair call returns `TOOL_PROFILE_BLOCKED`;
- accepted areas remain unchanged.

Return to `BEDROCK_CUBOID_GEOMETRY` only if more Geometry-stage work is genuinely required.

### 6. Texture Profile Transition and Stage

After Geometry approval:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/set-tool-profile.ps1 -Asset <asset> -Profile BEDROCK_CUBOID_TEXTURE
```

Reconnect the existing `blockbench` entry once.

Verify:

- exposed count is `24`;
- `set_cube_face_uv` and `get_uv_layout` are present;
- mesh UV, gradients, and PBR tools are absent;
- stale Geometry calls are blocked;
- profile hash/count are stable after reconnect.

Then:

- run UV + Base Texture + Detail Texture internally;
- save Texture review checkpoint;
- capture atlas and required model views;
- create Texture report;
- stop at `TEXTURE_REVIEW`.

Test one local Texture revision without reopening Geometry using `TEXTURE_LOCAL_REPAIR` and verify count `19`.

### 7. Animation Profile or Skip

Use one branch:

- `ANIMATION_SKIPPED` when not required; or
- approved Animation work and review.

When skipped:

- activate `FINAL_VALIDATION_READONLY`;
- reconnect once;
- do not expose Animation tools.

When required:

- activate `BEDROCK_CUBOID_ANIMATION`;
- reconnect once;
- verify exposed count `16`;
- verify group/bone animation tools present;
- verify armature and vertex-weight tools absent;
- verify hierarchy, pivots, neutral recovery, clipping, and ground contact;
- test `ANIMATION_LOCAL_REPAIR` count `13` only if a real local revision exists.

### 8. Final Validation Profile and Stage

Activate `FINAL_VALIDATION_READONLY`, reconnect once, and verify:

- exposed count is `13`;
- final inspection/evidence/export tools are present;
- ordinary Geometry, Texture, and Animation write tools are absent.

Then:

- execute `VALIDATION.md`;
- query Blockbench validator resources;
- capture final five views and atlas;
- route any local failure to the matching repair profile;
- allow at most two local automatic fixes;
- route broad failures to the correct approved stage;
- save final candidate and validation-pass checkpoints;
- stop at `FINAL_REVIEW`.

### 9. Diagnostic Escalation Negative Test

Do not activate `DIAGNOSTIC_ESCALATION` during the successful path.

Record it as unused unless a real blocker proves normal and repair profiles insufficient.

If genuinely required, record blocker, high-risk tool, rollback checkpoint, verification, and stop condition before activation, then return immediately to the correct normal/repair profile.

### 10. Final User Decision

- approved → `DONE`;
- revision → map to the correct stage/profile;
- do not merge `Rework` into `V1`.

## Measurement Log

Record only actionable waste:

```text
Connection search/retry:
Alternate port/key created:
Full library tool count:
Geometry exposed count:
Texture exposed count:
Animation exposed count:
Final exposed count:
Profile transition reconnect count:
Repeated tools/list call:
Out-of-profile selection attempt:
TOOL_PROFILE_BLOCKED occurrence:
TOOL_PROFILE_ARGUMENT_BLOCKED occurrence:
Repeated document read:
Repeated preflight check:
Unnecessary MCP call:
Unnecessary screenshot:
Unnecessary approval:
Ambiguous state transition:
Unclear output filename:
Session ownership issue:
Checkpoint/recovery issue:
Context loss:
Manual step repeated enough to justify automation:
```

## Ponytail Decision for New Automation

A new tool is justified only when dry-run evidence proves repeated calls, frequent orchestration error, material token savings, state/evidence risk, or unsafe recovery.

Otherwise:

```text
DEFERRED_NOT_REQUIRED
Reason:
Revisit condition:
```

## Pass Criteria

- canonical connection succeeds with one command/report;
- no port scan or alternate Codex entry occurs;
- the readiness session is closed and one Codex write session remains;
- reference intake reads the new package directly;
- normal profiles expose exact compact counts: Geometry 17, Texture 24, Animation 16, Final 13;
- forbidden high-risk/format-specific tools are absent from normal profiles;
- stale calls are blocked after profile transition;
- cross-stage arguments are blocked;
- each real profile transition needs at most one reconnect;
- profile ID/hash/count stay synchronized with state;
- full preflight is not repeated;
- each user-visible stage has exactly one review gate;
- Animation skips cleanly when not required;
- local revisions preserve accepted areas;
- standard evidence names are used;
- every stage has a persistent recovery point;
- Final Validation adds no features/broad polish;
- final output contains `.bbmodel`, textures, completed validation, evidence, and revision summary;
- identified waste has a concrete fix or is explicitly not worth automating.
