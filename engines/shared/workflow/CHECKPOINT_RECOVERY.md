# Checkpoint and Recovery Contract

Canonical checkpoints:

```text
00_session_start.bbmodel
10_geometry_review.bbmodel
20_geometry_approved.bbmodel
30_texture_review.bbmodel
40_texture_approved.bbmodel
50_animation_review.bbmodel
60_animation_approved.bbmodel
60_animation_skipped.bbmodel
70_final_candidate.bbmodel
80_validation_pass.bbmodel
```

Each checkpoint has adjacent JSON metadata with project UUID, stage, state revision, counts, accepted areas, open issues, and approval reference.

Recovery uses the latest valid checkpoint for the affected stage. Do not rely only on Undo history. Do not overwrite an approved checkpoint with a working revision.
