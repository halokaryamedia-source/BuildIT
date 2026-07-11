# MCP Blockbench Workflow Hub

Local Codex starts from:

```text
Engine/codex/BOOTSTRAP.md
```

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

Do not reconstruct state from several Markdown files.

## Canonical Connection

```text
Codex key: blockbench
URL: http://localhost:3000/bb-mcp
```

Use `sync-local-stack.ps1`; do not scan ports or create project-specific MCP keys.

## Approved Package

```text
references/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Legacy numbered sheets are not required.

## User-Visible Stages

```text
1. GEOMETRY
2. TEXTURE
3. ANIMATION — optional
4. FINAL_VALIDATION
```

Each stage ends with one preview/review gate. Internal passes do not create extra approvals.

## Exact Profiles

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

```text
Geometry revision  → GEOMETRY_LOCAL_REPAIR
Texture revision   → TEXTURE_LOCAL_REPAIR
Animation revision → ANIMATION_LOCAL_REPAIR
```

Normal profiles hide PBR, Hytale, mesh UV, armature/weights, UI automation, eval, and cross-stage tools.

## Compact Operations

### Preflight and Review Validation

```text
validate_reference_contract
```

Use one call for package, project, format, dimensions, UV/atlas, no-PBR, required groups/animations, evidence, and Blockbench validator summary. Do not repeat these checks manually.

### Texture Atlas Evidence

```text
save_texture_evidence
```

Writes PNG + compact metadata directly inside the session root. Do not return a full atlas as base64 merely to save it.

### Approved Stage Transition

```text
complete_stage
```

After explicit user approval, one call verifies evidence/report `PASS`, saves the approved checkpoint, protects accepted areas, updates state, activates the next profile, and returns one reconnect instruction when required.

## Stage Outputs

### Geometry

```text
10_geometry_review.bbmodel
five standard views
geometry_report.json with result
```

Approval uses `complete_stage` → `20_geometry_approved.bbmodel` → Texture.

### Texture

```text
30_texture_review.bbmodel
texture_atlas.png
four standard views
texture_report.json with result
```

Approval uses `complete_stage` → `40_texture_approved.bbmodel` → Animation or skip.

### Animation

Only when required:

```text
50_animation_review.bbmodel
hierarchy/pivots
required clips/samples
animation_report.json with result
```

Approval uses `complete_stage` → Final Validation.

### Final Validation

```text
final/<asset>.bbmodel
final/textures/
final five views
final_texture_atlas.png
validation_report.json with result: PASS
completed_VALIDATION.md
```

Final approval uses `complete_stage` → `80_validation_pass.bbmodel` → `DONE`.

## Minimum Read Set

1. `BOOTSTRAP.md`;
2. connection report;
3. `state.json`;
4. manifest;
5. Production Context;
6. Reference Visual;
7. active-stage document only.

Open detailed contracts/failure playbooks only after a trigger.

## Session Rules

- one asset = one write session;
- one key = `blockbench`;
- one preflight;
- one profile reconnect only at real stage transition;
- bounded batches for initial work;
- one issue per revision cycle;
- approved/manual areas remain protected;
- stage reports require explicit `result`;
- CI and merge remain deferred.

## Stop Conditions

Stop for:

- `REFERENCE_CONFLICT`;
- connection/profile mismatch;
- wrong project UUID or stale state revision;
- missing capability/evidence/checkpoint;
- report not `PASS`;
- same blocker twice;
- required earlier-stage reopen.
