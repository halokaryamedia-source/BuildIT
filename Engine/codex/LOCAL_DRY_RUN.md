# Local End-to-End Dry Run

Run only after the Rework plugin is built/reloaded locally. CI remains out of scope.

## Goal

Prove one approved reference package can move through deterministic connection, intake, Geometry, Texture, optional Animation, and Final Validation with:

- no connection searching;
- no legacy numbered-sheet dependency;
- one runtime authority;
- one connection readiness report;
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
- smoke session is closed;
- required common tools exist;
- active project UUID/format/UV mode/texture size are recorded;
- Codex creates no alternate key, port, or session.

After Codex connects, call `get_runtime_status` once. Do not repeat discovery if it passes.

### 3. One-Time Asset Preflight

- verify active-stage tools only;
- verify one Codex write-session owner;
- record manual edits;
- create `00_session_start.bbmodel`;
- update state;
- do not repeat unchanged checks.

### 4. Geometry

- run Primary Form + Structural Detail internally;
- use bounded multi-part batches where safe;
- save Geometry review checkpoint;
- capture five standard views;
- create Geometry report;
- stop at `GEOMETRY_REVIEW`.

Test one approval path and one local revision path that preserves unrelated areas.

### 5. Texture

- run UV + Base Texture + Detail Texture internally;
- save Texture review checkpoint;
- capture atlas and required model views;
- create Texture report;
- stop at `TEXTURE_REVIEW`.

Test one local Texture revision without reopening Geometry.

### 6. Animation

Use one branch:

- `ANIMATION_SKIPPED` when not required; or
- approved Animation work and review.

When used, verify hierarchy, pivots, neutral recovery, clipping, and ground contact.

### 7. Final Validation

- execute `VALIDATION.md`;
- query Blockbench validator;
- capture final five views and atlas;
- allow at most two local automatic fixes;
- route broad failures to the correct stage;
- save final candidate and validation-pass checkpoints;
- stop at `FINAL_REVIEW`.

### 8. Final User Decision

- approved → `DONE`;
- revision → map to the correct stage;
- do not merge `Rework` into `V1`.

## Measurement Log

Record only actionable waste:

```text
Connection search/retry:
Alternate port/key created:
Repeated document read:
Repeated preflight check:
Unnecessary MCP call:
Unnecessary screenshot:
Unnecessary approval:
Ambiguous state transition:
Unclear output filename:
Tool selection error:
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
- the smoke session is closed and one Codex write session remains;
- reference intake reads the new package directly;
- full preflight is not repeated;
- each user-visible stage has exactly one review gate;
- Animation skips cleanly when not required;
- local revisions preserve accepted areas;
- standard evidence names are used;
- every stage has a persistent recovery point;
- Final Validation adds no features/broad polish;
- final output contains `.bbmodel`, textures, completed validation, evidence, and revision summary;
- identified waste has a concrete fix or is explicitly not worth automating.
