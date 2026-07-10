# MCP Blockbench Workflow Hub

Local Codex starts from:

```text
Engine/codex/BOOTSTRAP.md
```

Runtime state:

```text
SavedData/sessions/<asset>/state.json
```

Do not reconstruct state from several Markdown files when `state.json` exists.

## 1. Canonical Connection

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
```

```text
Codex key: blockbench
URL: http://localhost:3000/bb-mcp
```

Do not scan ports or create project-specific MCP keys.

## 2. Approved Reference Package

```text
SavedData/sessions/<asset>/references/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Legacy numbered reference sheets are not required for new sessions.

## 3. User-Visible Stages

```text
1. GEOMETRY
2. TEXTURE
3. ANIMATION — optional
4. FINAL_VALIDATION
```

Each completed stage produces preview evidence and waits for user approval or targeted revision instructions.

Internal passes do not create extra routine approval gates.

### Geometry

Internal:

- Primary Form
- Structural Detail

Review:

- Front
- Left Side
- Back
- Top / Footprint
- Front-left 3/4

### Texture

Internal:

- UV
- Base Texture
- Detail Texture

Review:

- texture atlas
- UV summary
- Front
- Left Side
- Back
- Front-left 3/4

### Animation

Run only when required by the approved package.

Review:

- hierarchy/pivots
- required clips or sampled poses
- neutral pose recovery
- clipping and ground contact

### Final Validation

Run `VALIDATION.md`, collect final evidence, route failures to the correct repair profile, and wait for final user approval or corrections.

## 4. Exact MCP Tool Profiles

Authority:

```text
Engine/codex/tool-profiles.json
Engine/codex/TOOL_PROFILE_CONTRACT.md
```

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

Revisions use:

```text
GEOMETRY_LOCAL_REPAIR
TEXTURE_LOCAL_REPAIR
ANIMATION_LOCAL_REPAIR
```

Profile transition:

```text
activate_tool_profile
→ reconnect existing canonical blockbench entry once
→ get_runtime_status
→ continue only when profile ID/hash/count match state
```

Normal profiles hide and block:

- PBR/Vibrant Visuals tools;
- Hytale tools;
- mesh UV tools;
- armature and vertex-weight tools;
- UI automation and `risky_eval`;
- tools outside the active stage.

The full capability library remains available only through recorded `DIAGNOSTIC_ESCALATION`.

## 5. Minimum Normal Read Set

1. `Engine/codex/BOOTSTRAP.md`
2. `SavedData/sessions/<asset>/state.json`
3. `references/reference_manifest.json`
4. `references/PRODUCTION_CONTEXT.md`
5. `references/<asset>_reference_visual.png`
6. active-stage document only

Open detailed contracts or failure playbooks only after a relevant trigger.

## 6. Session Rules

- One asset = one active write session.
- One canonical MCP key = `blockbench`.
- One canonical URL = `http://localhost:3000/bb-mcp`.
- Run full connection sync and asset preflight once.
- Re-run only stale or failed checks.
- Save persistent stage checkpoints.
- Preserve user manual edits and approved areas.
- Initial construction may use bounded multi-part batches.
- One-issue-per-cycle applies to revision work.
- Reconnect only on a real tool-profile transition.

## 7. Stage Transition Rule

A stage may advance only when:

- required evidence exists;
- stage result is `PASS`;
- no unresolved blocker exists;
- user explicitly approves the stage preview;
- next exact tool profile is activated and verified.

User revision feedback must name the stage, part, issue, expected result, and anything that must not change.

## 8. Stop Conditions

Stop only for:

- `REFERENCE_CONFLICT`;
- connection result not `PASS`;
- invalid tool profile configuration;
- missing required capability in the correct profile;
- `TOOL_PROFILE_BLOCKED` after a reconnect attempt;
- ambiguous project/session ownership;
- same blocker repeated twice;
- change that reopens an approved earlier stage.

## 9. Repository Responsibilities

- `Engine/codex/`: compact execution, connection, profile, state, evidence, and checkpoint control.
- `SavedData/sessions/<asset>/`: runtime state, references, checkpoints, evidence, reports, and final output.
- `SourceDocument/modeling/`: human-facing detailed guidance and failure playbooks.
- `src/`: MCP plugin implementation.
- `openspec/changes/codex-local-workflow-rework/`: durable current agreement.
