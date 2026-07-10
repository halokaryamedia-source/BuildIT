# Model Session Summary Template

This file is optional human-readable context.

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

Do not duplicate every reference or workflow rule here. Generate or update this summary from `state.json` when a human-readable handoff is useful.

Recommended location:

```text
SavedData/sessions/<asset>/session.md
```

## 1. Identity

```text
Asset ID:
Display Name:
Target:
Reference folder:
Reference status:
Active stage:
Stage status:
Animation required: Yes / No
```

## 2. Approved Authority

```text
Decision authority: references/PRODUCTION_CONTEXT.md
Visual authority: references/<asset>_reference_visual.png
Active stage document:
Manifest: references/reference_manifest.json
Validation contract: references/VALIDATION.md
OpenSpec change:
```

Do not copy the full contents of these files into this summary.

## 3. Runtime

```text
State file:
MCP endpoint:
MCP session ID:
Lock owner:
Write lease status:
Project name:
Project UUID:
Project format:
UV mode:
Texture size:
Last verified:
```

## 4. Preservation

```text
Manual edits present: Yes / No
Must preserve:
- ...
Accepted stage checkpoints:
- Geometry:
- Texture:
- Animation:
- Validation:
```

## 5. Active Stage Scope

```text
Stage:
Approved goal:
Internal passes:
Required output:
Forbidden work:
Current blockers:
```

## 6. Ponytail Batch Gate

```text
Required now: Yes / No
Smallest complete batch:
Reuse available:
Affected parts:
Do not change:
Required tool profile:
Verification:
Stop condition:
Estimated MCP/evidence cost: Low / Medium / High
```

If `Required now` is `No`, do not execute the action.

## 7. Preflight Status

```text
Reference package: PASS / BLOCKER / REFERENCE_CONFLICT
OpenSpec read: Yes / No
Governance read: Yes / No
Endpoint: PASS / BLOCKER
Required tools: PASS / BLOCKER
Project/UUID: PASS / BLOCKER
Session ownership: PASS / BLOCKER
Manual edits recorded: Yes / No
Persistent checkpoint ready: Yes / No
Preflight result: PASS / BLOCKER
```

The full preflight runs once before the first write. Re-run only stale or failed checks.

## 8. Review Evidence

### Geometry

```text
Front:
Left Side:
Back:
Top / Footprint:
Front-left 3/4:
Scale/hierarchy/cube report:
Checkpoint:
```

### Texture

```text
Atlas:
UV summary:
Front:
Left Side:
Back:
Front-left 3/4:
Checkpoint:
```

### Animation — when required

```text
Hierarchy/pivots:
Clips or sampled poses:
Neutral pose:
Ground contact:
Clipping/deformation:
Checkpoint:
```

### Final Validation

```text
Final candidate:
Textures:
Completed validation:
Five standard views:
Animation evidence:
Revision summary:
```

Only the active/current review section needs to be filled.

## 9. Stage Result

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Evidence:
Issues:
User decision: PENDING / APPROVED / REVISION_REQUESTED
Next action:
```

## 10. Revision Mapping

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Reference:
Verification:
```

One issue or tightly related pair per revision cycle. Do not rebuild accepted areas.

## Recovery Read Order

A new Codex chat or computer reads:

1. `Engine/codex/GOVERNANCE.md`
2. `Engine/codex/BOOTSTRAP.md`
3. active OpenSpec summary
4. `state.json`
5. reference core
6. active-stage document
7. this summary only when useful

## Acceptance Criteria

- `state.json` remains the only runtime authority.
- The summary is compact and does not duplicate long documents.
- Active stage, preservation rules, blockers, evidence, and next action are clear.
- No approval is requested between internal passes.
