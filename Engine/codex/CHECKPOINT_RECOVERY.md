# Persistent Checkpoint and Recovery Contract

Undo history is useful for local edits but is not a durable recovery system.

Every meaningful stage boundary must have a persistent `.bbmodel` checkpoint.

## 1. Checkpoint Paths

```text
SavedData/sessions/<asset>/checkpoints/
├─ 00_session_start.bbmodel
├─ 10_geometry_review.bbmodel
├─ 20_geometry_approved.bbmodel
├─ 30_texture_review.bbmodel
├─ 40_texture_approved.bbmodel
├─ 50_animation_review.bbmodel
├─ 60_animation_approved.bbmodel
├─ 60_animation_skipped.bbmodel
├─ 70_final_candidate.bbmodel
└─ 80_validation_pass.bbmodel
```

Create only checkpoints relevant to the active asset.

When Animation is not required, create `60_animation_skipped.bbmodel` as a copy/export of the approved Texture state or record the Texture-approved checkpoint as the recovery source. Do not create fake animation data.

## 2. Checkpoint Metadata

Each checkpoint has adjacent metadata:

```text
<checkpoint>.json
```

Required fields:

```json
{
  "schema_version": "1.0",
  "asset_id": "<asset>",
  "checkpoint_name": "20_geometry_approved",
  "stage": "GEOMETRY",
  "state": "GEOMETRY_APPROVED",
  "project_uuid": "<uuid>",
  "project_name": "<name>",
  "bbmodel_path": "SavedData/sessions/<asset>/checkpoints/20_geometry_approved.bbmodel",
  "created_at": "<iso-8601>",
  "created_by": "codex",
  "approved": true,
  "approval_ref": "<user approval reference>",
  "source_state_revision": 0,
  "counts": {
    "cubes": 0,
    "meshes": 0,
    "groups": 0,
    "textures": 0,
    "animations": 0
  },
  "dimensions": {
    "height_units": null,
    "width_units": null,
    "depth_units": null
  },
  "accepted_areas": [],
  "open_issues": [],
  "sha256": "<hash when available>"
}
```

## 3. Save Rules

Save a persistent checkpoint:

- after one-time preflight and before the first meaningful write;
- before presenting each stage review;
- immediately after a stage is approved;
- before a broad but explicitly approved stage reopen;
- before Final Validation;
- after Final Validation passes.

Do not save a persistent checkpoint after every micro-edit.

## 4. Atomicity

A checkpoint is valid only when:

1. the project compiles to `.bbmodel` successfully;
2. the file is written completely;
3. metadata is written after the model file;
4. state is updated only after both files succeed;
5. the saved project UUID matches active state;
6. the checkpoint path is inside the active asset session unless the user explicitly approves another path.

Use a temporary file and rename when the runtime supports it.

## 5. Recovery Rules

### Local revision failure

Restore the latest checkpoint inside the same stage.

### Texture reveals a local geometry issue

If the issue is truly local and does not change accepted silhouette or scale:

- record a Geometry reopen request;
- restore `20_geometry_approved.bbmodel` only if the current model cannot be patched safely;
- otherwise checkpoint the current state and perform the approved local Geometry correction;
- repeat Geometry review evidence for affected views;
- revalidate Texture impact before resuming.

### Animation hierarchy blocker

Return to the latest approved Texture checkpoint when the hierarchy cannot be repaired without changing accepted geometry.

### Final Validation failure

- local Geometry failure → reopen Geometry revision;
- local Texture failure → reopen Texture revision;
- local Animation failure → reopen Animation revision;
- broad or unclear failure → `BLOCKED` or `REFERENCE_CONFLICT`.

### Session or Blockbench crash

1. read `state.json`;
2. verify the latest checkpoint metadata;
3. open the checkpoint matching `last_safe_checkpoint`;
4. verify project UUID or record the new UUID after reopen;
5. verify required evidence/state consistency;
6. continue only from the recorded safe action.

## 6. Rollback Selection

Choose the closest valid checkpoint that predates the failed action.

Never roll back farther than necessary.

Priority:

```text
same-stage working/review checkpoint
→ same-stage approved checkpoint
→ previous-stage approved checkpoint
→ session start
```

## 7. Checkpoint Retention

Keep:

- session start;
- every approved stage;
- current review candidate;
- validation pass;
- any checkpoint explicitly requested by the user.

Delete or archive redundant failed-attempt checkpoints after the issue is resolved.

## 8. Blockers

Checkpoint creation returns `BLOCKER` when:

- no project is open;
- project codec cannot compile `.bbmodel`;
- filesystem permission is denied;
- output path is outside the allowed session without approval;
- project UUID does not match expected state;
- write or metadata creation fails.
