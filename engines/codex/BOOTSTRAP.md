# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved reference package requires using the fewest safe reads, exposed tools, calls, screenshots, and interruptions.

## Startup

1. Read `engines/shared/workflow/GOVERNANCE.md` and the active OpenSpec summary.
2. Read `workspace/active-session.json`.
3. Open one Blockbench window and the intended project.
4. Run:

```powershell
powershell -ExecutionPolicy Bypass -File engines/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

First-time Codex configuration adds `-InstallCodexConfig`, followed by one Codex restart.

Continue only when `workspace/sessions/<asset>/reports/connection.json` reports `PASS`.

## Minimum Read Set

1. connection report;
2. session `state.json`;
3. `reference_manifest.json`;
4. `PRODUCTION_CONTEXT.md`;
5. Reference Visual;
6. active-stage document only.

## Stage Profiles

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

Use repair profiles only for targeted revisions. On a real transition, activate the next profile, reconnect the existing `blockbench` entry once, then call `get_runtime_status` once.

## Stage Flow

```text
Geometry review
→ Texture review
→ Animation review or skip
→ Final review
```

At each review: checkpoint, stable evidence, compact validation, concise report, then wait for `APPROVED` or `REVISION: ...`.

Do not scan ports, load legacy workflow documents, add optional features, or create versioned duplicate files.
