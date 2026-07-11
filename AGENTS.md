# BuildIT Agent Rules

## Start Here

For source/workflow development:

```text
openspec/config.yaml
active OpenSpec change
```

For local model production:

```text
Engine/codex/BOOTSTRAP.md
SavedData/sessions/<asset>/state.json
```

```text
OpenSpec = durable goal, scope, decisions, non-goals, and acceptance criteria
Ponytail = smallest safe action required now
state.json = runtime authority
```

Do not repeat full analysis before every edit.

## Non-Negotiable Runtime Rules

- Branch remains `Rework`; do not merge into `V1` without explicit final approval.
- CI, preview deployment, release work, and review PR remain deferred.
- Only MCP key: `blockbench`.
- Only URL: `http://localhost:3000/bb-mcp`.
- Never scan ports, use fallback ports, or create `blockbench_*` project keys.
- Run `Engine/codex/scripts/sync-local-stack.ps1`; continue only when the connection report is `PASS`.
- One visible Blockbench window and one Codex write session per asset.
- Call `get_runtime_status` once after connection; repeat only when stale/failed.
- Use exact stage/repair profiles from `Engine/codex/tool-profiles.json`.
- Reconnect the existing MCP entry once only on a real profile transition.
- Never bypass `TOOL_PROFILE_BLOCKED` or `TOOL_PROFILE_ARGUMENT_BLOCKED` with eval, UI automation, PBR, Hytale, mesh UV, or armature tools.

## Production Flow

```text
GEOMETRY → review → approval/revision
TEXTURE → review → approval/revision
ANIMATION → review when required, otherwise skip
FINAL_VALIDATION → review → approval/revision
```

Internal passes do not create extra approvals.

- Initial work may use bounded batches.
- One-issue-per-cycle applies only to revisions.
- Preserve manual and approved areas unless explicitly reopened.
- Use Per-face UV for Bedrock Entity/Block unless the approved package states otherwise.
- New sessions use Production Context + one Reference Visual + Geometry/Texturing/Animation/Validation docs + manifest + handoff; no legacy numbered sheets.

## Token-Saving Operations

Prefer:

```text
validate_reference_contract
save_texture_evidence
complete_stage
```

- `validate_reference_contract`: one package/project/format/dimension/UV/evidence/validator result instead of repeated inspection calls.
- `save_texture_evidence`: writes PNG directly; do not round-trip atlas base64 through Codex.
- `complete_stage`: after explicit approval, verifies PASS evidence, saves the approved checkpoint, protects accepted areas, updates state, and activates the next profile.

Do not manually repeat work already proved by these tools.

## Repository Map

- `Engine/codex/`: compact workflow, connection, state, profile, evidence, and checkpoint contracts.
- `SavedData/sessions/<asset>/`: references, state, checkpoints, evidence, reports, final artifacts.
- `src/server/`: MCP server, tools, resources, prompts.
- `src/lib/`: factories, guards, shared utilities.
- `src/ui/`: Blockbench UI/settings.
- `build/`: build/docs scripts.
- `tests/`: focused tests.

Do not move `.agents/`, `.codex/`, `openspec/`, `src/`, `build/`, `prompts/`, `dist/`, package files, lockfiles, or repository metadata.

## Development Commands

```text
bun install
bun run typecheck
bun test
bun run dev
bun run build
bun run docs:build
```

During active Rework, run only focused checks that prove the current batch. Full verification and CI happen last.

## Tool Development Gate

Before adding a tool, confirm:

```text
Current repeated need/blocker:
Why existing tool/orchestration is insufficient:
Expected call/token/error reduction:
Smallest interface:
Rollback/verification:
Maintenance cost:
```

Do not add speculative tools.

Accepted tool requirements:

1. schemas/docs exported at module level without Blockbench globals;
2. runtime globals used only inside `execute()`;
3. register through `createTool()` and `src/server/tools.ts`;
4. add to `build/docs-manifest.ts`;
5. expose only in exact profiles that require it;
6. prefer explicit project/element/texture IDs;
7. return concise text plus `structuredContent`;
8. filesystem writes stay inside approved roots and use atomic replacement when workflow-critical.

## Code and Test Style

- TypeScript strict, ESNext modules, CJS plugin output.
- `@/*` imports, two-space indentation, narrow types.
- Keep UI and tool text concise.
- Use focused Bun tests and actual Blockbench runtime verification.
- Verify profile count/hash, blocked calls, reconnect count, checkpoint/evidence integrity, and state consistency.

## Security and Stop Conditions

- No secrets or user-specific Codex config in Git.
- Network/filesystem access requires explicit tools and permission.
- Validate external inputs with Zod.
- `DIAGNOSTIC_ESCALATION` requires a recorded blocker, allowed tool, rollback checkpoint, verification, and stop condition.
- Stop for reference conflict, wrong project UUID, stale state revision, missing evidence/checkpoint, repeated blocker, or required earlier-stage reopen.
