# Pre-Modelling Gate

Run this once after canonical connection readiness and reference intake, before the first Geometry-stage MCP write.

## Gate Order

```text
sync-local-stack.ps1
→ reports/connection.json = PASS
→ exact BEDROCK_CUBOID_GEOMETRY profile verified
→ reference/package/project gate
→ 00_session_start.bbmodel
→ Geometry
```

Do not repeat connection discovery inside this gate.

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

- active `state.json` using schema 2.1;
- `reports/connection.json` with `result: PASS`;
- live `get_runtime_status` result without blocker;
- runtime profile `BEDROCK_CUBOID_GEOMETRY`;
- profile ID, revision, hash, and exposed count synchronized to `state.json`;
- active OpenSpec change;
- one active Codex MCP write session;
- active Blockbench project and UUID;
- expected format, UV mode, and texture size;
- manual/accepted areas to preserve;
- writable checkpoint directory;
- `save_project_checkpoint` capability;
- `capture_standard_views` capability.

## Gate Checks

| Check | Status |
| --- | --- |
| Canonical connection report PASS | PASS / BLOCKER |
| Live runtime status matches canonical URL/project | PASS / BLOCKER |
| Active profile is `BEDROCK_CUBOID_GEOMETRY` | PASS / BLOCKER |
| Runtime profile hash/count match state | PASS / BLOCKER |
| Profile validation errors empty | PASS / BLOCKER |
| PBR/Hytale/mesh UV/armature/UI/eval absent from exposed tools | PASS / BLOCKER |
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
| Geometry tools available | PASS / BLOCKER |
| `save_project_checkpoint` available | PASS / BLOCKER |
| `capture_standard_views` available | PASS / BLOCKER |
| One Codex write session confirmed | PASS / BLOCKER |
| Project UUID/format/UV mode verified | PASS / BLOCKER |
| Manual and accepted areas recorded | PASS / BLOCKER |
| Checkpoint output path writable | PASS / BLOCKER |

## Start Rule

Geometry may start only when every check is `PASS`.

Reference authority conflict:

```text
REFERENCE_CONFLICT
```

Runtime or connection failure:

```text
BLOCKER: pre-modelling gate failed
Missing:
- ...
Safe next action:
- ...
```

Profile mismatch:

```text
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/set-tool-profile.ps1 -Asset <asset>
```

Then reconnect the existing canonical `blockbench` MCP entry once only when the script reports a real profile change.

Do not scan another port, create another MCP key, activate diagnostic escalation, or open another session as a fallback.

## Codex First Action After PASS

1. Call `save_project_checkpoint` for `checkpoints/00_session_start.bbmodel`.
2. Update `state.json` only after checkpoint success:
   - `workflow.state: GEOMETRY_IN_PROGRESS`;
   - `workflow.active_stage: GEOMETRY`;
   - `workflow.status: IN_PROGRESS`;
   - `workflow.last_safe_checkpoint: checkpoints/00_session_start.bbmodel`;
   - `workflow.stage_records.GEOMETRY.status: IN_PROGRESS`;
   - preserve verified profile ID/hash/count.
3. Execute Primary Form, then Structural Detail using only the active exact profile.
4. Capture stage evidence with `capture_standard_views` and stop at Geometry Review.

Do not request a separate approval for connection readiness or the gate. The next user-visible approval is Geometry Review.
