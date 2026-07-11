# MCP Tool Profile and Compact Workflow Contract

## Goal

Keep the complete MCP capability library in the plugin while exposing and using only the smallest exact set required by the active stage.

Machine authority:

```text
Engine/codex/tool-profiles.json
```

Runtime:

```text
src/lib/toolProfiles.ts
src/server/tools/runtime.ts
src/server/tools/workflow.ts
```

## Core Model

```text
full capability library
→ exact stage profile
→ reduced tools/list after one reconnect
→ call-time profile and argument guards
→ compact workflow operations
```

Tools are hidden, not deleted.

## Always-Exposed Core

```text
get_runtime_status
get_project_info
get_tool_profile
activate_tool_profile
```

## Stage Profiles

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

`DIAGNOSTIC_ESCALATION` is forbidden during normal work.

## Profile Transition

```text
activate_tool_profile
→ update state profile fields
→ reconnect existing `blockbench` entry once
→ get_runtime_status once
→ continue only when ID/hash/count match
```

Do not create another key, scan another port, restart Blockbench, or reconnect after normal edits.

A stale disallowed call returns:

```text
TOOL_PROFILE_BLOCKED
```

A cross-stage argument returns:

```text
TOOL_PROFILE_ARGUMENT_BLOCKED
```

## Compact Operations

### `validate_reference_contract`

Use one call instead of separate calls for:

- package-file presence;
- project UUID and Bedrock format;
- Per-face UV and atlas size;
- model dimensions from manifest;
- required hierarchy/animations;
- Classic Bedrock/no-PBR checks;
- required evidence;
- Blockbench validator counts.

It returns `PASS`, `REVISION_REQUIRED`, or `BLOCKER` with the smallest recommended repair profile.

It does not replace visual user review.

### `save_texture_evidence`

Use instead of returning a full atlas as base64 and writing it separately.

It requires an explicit texture, writes PNG and metadata atomically inside the session root, and returns compact path/dimension/byte/alpha metadata.

### `complete_stage`

Use only after explicit user approval.

It performs in one operation:

```text
verify review state and evidence
→ save approved checkpoint
→ write approval/accepted areas
→ update state atomically
→ activate next profile
→ return one reconnect instruction when needed
```

Repair profiles do not expose this tool.

## Normal Exclusions

Normal Bedrock cuboid profiles do not expose:

- PBR or texture-set tools;
- Hytale tools;
- mesh UV;
- armatures or vertex weights;
- UI clicking/dialog automation;
- `risky_eval`;
- broad cross-stage writes.

Texture uses `set_cube_face_uv` and `get_uv_layout`; the UV write requires an explicit cube ID.

Animation uses group/bone animation, not mesh deformation.

Final Validation is read-mostly. A failed validation routes to the matching repair profile.

## State Synchronization

`state.json` records:

```text
active_tool_profile
tool_profile_revision
tool_profile_hash
exposed_tool_count
total_library_tool_count
profile_reconnect_required
```

Live `get_runtime_status` is authoritative when state metadata is stale.

## Diagnostic Escalation

Activate full-library access only when all are recorded:

```text
Blocker:
Why normal tools cannot solve it:
Allowed high-risk tool:
Rollback checkpoint:
Verification:
Stop condition:
```

Return immediately to the correct normal/repair profile afterward.

## Acceptance Criteria

- normal sessions expose only exact allowlists;
- out-of-profile and cross-stage calls are rejected;
- profile transition needs at most one reconnect;
- compact validation replaces repeated inspection;
- PNG evidence avoids base64 round-trips;
- stage approval uses one checkpoint/state/profile operation;
- runtime reports profile ID, count, and hash;
- the full library remains available only through recorded escalation.
