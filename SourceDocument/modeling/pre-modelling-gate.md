# Pre-Modelling Gate

Run this once after reference intake and before the first Geometry-stage MCP write.

## Required Reference Package

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

Legacy numbered reference sheets are not required for new sessions.

## Required Runtime Inputs

- active `state.json` using schema 2.0;
- active OpenSpec change;
- one active MCP write session;
- verified endpoint and active-stage tool list;
- active Blockbench project and UUID;
- expected format;
- UV mode and texture size;
- manual/accepted areas to preserve;
- writable checkpoint directory;
- `save_project_checkpoint` capability;
- `capture_standard_views` capability for stage evidence.

## Gate Checks

| Check | Status |
| --- | --- |
| Reference package files present | PASS / BLOCKER |
| Manifest valid | PASS / BLOCKER |
| Production Context has no unresolved high-impact blocker | PASS / BLOCKER |
| Reference Visual matches asset identity | PASS / BLOCKER |
| Scale and front direction locked | PASS / BLOCKER |
| Geometry parts/build order/hierarchy clear | PASS / BLOCKER |
| Geometry-vs-texture split clear | PASS / BLOCKER |
| Texture atlas/style/material rules clear | PASS / BLOCKER |
| Animation requirement clear | PASS / BLOCKER |
| Validation contract present | PASS / BLOCKER |
| MCP endpoint and Geometry tools available | PASS / BLOCKER |
| `save_project_checkpoint` available | PASS / BLOCKER |
| `capture_standard_views` available | PASS / BLOCKER |
| One write session confirmed | PASS / BLOCKER |
| Project UUID/format/UV mode verified | PASS / BLOCKER |
| Manual and accepted areas recorded | PASS / BLOCKER |
| Checkpoint output path writable | PASS / BLOCKER |

## Start Rule

Geometry may start only when every gate check is `PASS`.

If a reference conflict affects identity, scale, silhouette, hierarchy, material behavior, or required motion, report:

```text
REFERENCE_CONFLICT
```

If a runtime requirement is missing, report:

```text
BLOCKER: pre-modelling gate failed
Missing:
- ...
Safe next action:
- ...
```

## Codex First Action After PASS

1. Call `save_project_checkpoint` for `checkpoints/00_session_start.bbmodel`.
2. Update `state.json` only after checkpoint success:
   - `workflow.state: GEOMETRY_IN_PROGRESS`;
   - `workflow.active_stage: GEOMETRY`;
   - `workflow.status: IN_PROGRESS`;
   - `workflow.last_safe_checkpoint: checkpoints/00_session_start.bbmodel`;
   - `workflow.stage_records.GEOMETRY.status: IN_PROGRESS`.
3. Load only the Geometry profile.
4. Execute Primary Form, then Structural Detail.
5. Capture stage evidence with `capture_standard_views` and stop at Geometry Review.

Do not request a separate approval for the gate. The next user-visible approval is Geometry Review.
