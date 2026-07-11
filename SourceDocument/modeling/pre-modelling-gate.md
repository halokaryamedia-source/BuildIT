# Pre-Modelling Gate

Run once after canonical connection readiness and before the first Geometry write.

## Order

```text
sync-local-stack.ps1
→ reports/connection.json = PASS
→ validate_reference_contract(require_evidence=false)
→ record manual edits
→ save 00_session_start.bbmodel
→ GEOMETRY_IN_PROGRESS
```

Do not repeat connection discovery or manually reproduce checks already returned by `validate_reference_contract`.

## Required Package

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

Legacy numbered sheets are not required.

## Compact Validation Input

```text
session_root: absolute SavedData/sessions/<asset>
expected_project_uuid: active project UUID
stage: GEOMETRY
require_evidence: false
```

The one call validates package files, project identity, Bedrock format, Per-face UV, atlas size, manifest dimensions, hierarchy requirements, animation requirements, no-PBR rules, and Blockbench validator status where applicable.

## Results

### PASS

1. Record manual edits and protected areas.
2. Call `save_project_checkpoint` for `checkpoints/00_session_start.bbmodel`.
3. Update state only after checkpoint success.
4. Enter `GEOMETRY_IN_PROGRESS` using `BEDROCK_CUBOID_GEOMETRY`.

### REVISION_REQUIRED

Use the recommended smallest repair/setup action. Re-run only the failed check; do not repeat the entire connection process.

### BLOCKER

```text
BLOCKER: pre-modelling gate failed
Code:
Safe next action:
```

### REFERENCE_CONFLICT

Stop without editing Blockbench when approved reference authorities conflict materially.

## No-Search Rule

Do not:

- scan another port;
- create another MCP key;
- initialize several diagnostic sessions;
- open all tool definitions;
- read every workflow document;
- reconstruct the same checks manually.

The next user-visible approval remains `GEOMETRY_REVIEW`; the gate itself does not require approval.
