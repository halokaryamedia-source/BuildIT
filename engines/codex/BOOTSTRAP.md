# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved reference package requires using the fewest safe reads, exposed tools, calls, screenshots, and interruptions.

## One-Time Local Package Build

Run from the repository root:

```powershell
cd mcp-blockbench
bun install
bun run typecheck
bun test
bun run dev
cd ..
```

Load or reload exactly:

```text
mcp-blockbench/dist/mcp.js
```

Do not search for another plugin output.

## Asset Startup

1. Read `engines/shared/workflow/GOVERNANCE.md` and the active OpenSpec summary.
2. Create local `workspace/active-session.json` from `workspace/active-session.example.json` when needed.
3. Read the selected session `state.json`.
4. Open one Blockbench window and the intended project.
5. Run:

```powershell
powershell -ExecutionPolicy Bypass -File engines/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

First-time Codex configuration adds `-InstallCodexConfig`, followed by one Codex restart.

Continue only when `workspace/sessions/<asset>/reports/connection.json` reports `PASS` and confirms `mcp-blockbench/dist/mcp.js` exists.

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

Do not scan ports, load legacy workflow documents, add optional features, create another MCP package root, or create versioned duplicate files.
