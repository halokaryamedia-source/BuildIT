# Local End-to-End Dry Run

Run this only after the workflow contracts and required MCP tools are available locally.

CI is intentionally out of scope for this dry run.

## Goal

Verify that one approved reference package can move through Geometry, Texture, optional Animation, and Final Validation with:

- no legacy numbered-sheet dependency;
- one runtime authority;
- one preflight;
- minimal document reads;
- bounded MCP batches;
- stable preview evidence;
- correct review/revision transitions;
- persistent recovery checkpoints;
- no unnecessary approvals;
- no overdevelopment.

## Test Asset

Use one new or disposable asset with the current reference package:

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

Do not use the legacy kangaroo session as the first proof run unless it has been migrated explicitly.

## Run Sequence

### 1. Intake

- create the asset session folder;
- copy the approved package;
- create `state.json` from the template;
- validate package and authority order;
- record Animation required/skipped logic;
- result: `REFERENCE_READY` or explicit blocker.

### 2. One-Time Preflight

- verify endpoint and required active-stage tools;
- verify one session owner;
- verify project UUID, format, UV mode, texture dimensions;
- record manual edits;
- create `00_session_start.bbmodel`;
- update state;
- do not repeat unchanged checks.

### 3. Geometry

- run Primary Form and Structural Detail as internal passes;
- use bounded multi-part batches where safe;
- save Geometry review checkpoint;
- capture five standard views;
- create Geometry report;
- stop at `GEOMETRY_REVIEW`.

Test both:

- one approval path;
- one named local revision path that preserves unrelated areas.

### 4. Texture

- run UV, Base Texture, and Detail Texture internally;
- save Texture review checkpoint;
- capture atlas and four model views;
- create Texture report;
- stop at `TEXTURE_REVIEW`.

Test one local texture revision without reopening Geometry.

### 5. Animation

Run one of these branches:

- `ANIMATION_SKIPPED` when not required;
- Animation work and review when required.

If used, verify hierarchy, pivots, neutral recovery, clipping, and ground contact.

### 6. Final Validation

- execute `VALIDATION.md`;
- query Blockbench validator;
- capture final five views and atlas;
- allow at most two local automatic fixes;
- route broad failures back to the correct stage;
- save final candidate and validation-pass checkpoints;
- stop at `FINAL_REVIEW`.

### 7. Final User Decision

- approve → `DONE`;
- revision → map to the correct stage;
- do not merge Rework into V1 as part of this test.

## Measurement Log

Record only actionable workflow waste:

```text
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

A new tool is justified only when the dry run proves at least one:

- the same safe operation needs multiple repeated MCP calls;
- manual orchestration creates frequent errors;
- token cost is materially reduced;
- state/evidence consistency cannot be maintained reliably;
- recovery is unsafe without atomic automation.

Otherwise record:

```text
DEFERRED_NOT_REQUIRED
Reason:
Revisit condition:
```

## Pass Criteria

- reference intake reads the new package directly;
- no full preflight is repeated unnecessarily;
- each stage has exactly one user review gate;
- Animation skips cleanly when not required;
- local revisions preserve accepted areas;
- standard evidence names are used;
- every stage has a persistent recovery point;
- Final Validation cannot add features or broad polish;
- the final package contains `.bbmodel`, textures, completed validation, evidence, and revision summary;
- all identified waste has a concrete fix or is explicitly not worth automating.
