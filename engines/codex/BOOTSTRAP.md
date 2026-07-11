# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved reference package requires using the fewest safe reads, loaded skills, exposed tools, calls, screenshots, and interruptions.

## One-Time Local Package Build

Run from the repository root:

```powershell
cd mcp-blockbench
bun install
bun run skills:check
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

## Workspace Selection

Projects are stored under:

```text
workspace/active/<asset>/
├─ blockbench/   # user-facing model, textures, references, previews
└─ mcp/          # state, technical contracts, checkpoints, evidence, reports
```

Select one active project from `mcp-blockbench/`:

```powershell
bun run workspace -- activate <asset_id>
```

`workspace/workspace.json` is only the selected-project index. Runtime authority remains:

```text
workspace/active/<asset>/mcp/state.json
```

## Asset Startup

1. Read `engines/shared/workflow/GOVERNANCE.md` and the active OpenSpec summary.
2. Read `workspace/workspace.json` and the selected project metadata.
3. Read the selected project's `mcp/state.json`.
4. Load `blockbench-production`.
5. Resolve the exact stage skill from `engines/shared/skills/skill-profiles.json`.
6. Open one Blockbench window and the exact model at `workspace/active/<asset>/blockbench/<asset>.bbmodel` when it exists.
7. Run:

```powershell
powershell -ExecutionPolicy Bypass -File engines/codex/scripts/sync-local-stack.ps1
```

The script reads the selected asset automatically. `-Asset <asset>` remains available only as an explicit override.

8. Continue only when `workspace/active/<asset>/mcp/reports/connection.json` reports `PASS` and confirms `mcp-blockbench/dist/mcp.js` exists.
9. Acquire the write lease once with `manage_project_write_lease` using the exact asset ID, absolute `workspace/active/<asset>/mcp` root, project UUID, current `state_revision`, and current `workflow.active_stage`.
10. Begin stage mutations only after lease acquisition returns `PASS`.

First-time Codex configuration adds `-InstallCodexConfig`, followed by one Codex restart.

## Minimum Read Set

1. `workspace/workspace.json`;
2. `mcp/project.json`;
3. connection report;
4. `mcp/state.json`;
5. `reference_manifest.json`;
6. `PRODUCTION_CONTEXT.md`;
7. Reference Visual;
8. active-stage document only.

Do not read the whole `blockbench/` or `mcp/` tree when the exact paths are already recorded in `project.json`.

## Exact Stage Orchestration

| Stage | MCP tool profile | Loaded production skills |
| --- | --- | --- |
| Geometry | `BEDROCK_CUBOID_GEOMETRY` | `blockbench-production` + `blockbench-geometry` |
| Texture | `BEDROCK_CUBOID_TEXTURE` | `blockbench-production` + `blockbench-texture` |
| Animation | `BEDROCK_CUBOID_ANIMATION` | `blockbench-production` + `blockbench-animation` |
| Final Validation | `FINAL_VALIDATION_READONLY` | `blockbench-production` + `blockbench-validation` |

Maximum loaded production skills: `2`.

Do not load Animation skill when Animation is skipped. Use the same stage skill with the matching local-repair tool profile for targeted revisions.

A successful stage/profile transition releases the previous write lease. Reconnect the existing `blockbench` entry once, call `get_runtime_status` once, then reacquire the lease from the new state before the next mutation. Skill changes do not require MCP reconnects.

## Completion and Reopen

After final user approval:

```powershell
cd mcp-blockbench
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
```

This promotes validated model files into `blockbench/`, freezes MCP metadata, and moves the project to `workspace/completed/`.

To revise later:

```powershell
bun run workspace -- reopen <asset_id> --stage TEXTURE --reason "<reason>"
```

The approved completed baseline remains unchanged until the reopened revision is approved again.

## Stage Flow

```text
Geometry review
→ Texture review
→ Animation review or skip
→ Final review
```

At each review: checkpoint, stable evidence, compact validation, concise report, then wait for `APPROVED` or `REVISION: ...`.

Do not scan ports, bypass the write lease, mix Blockbench user files with MCP internals, load legacy production skills, load all Blockbench skills together, add optional features, create another MCP package root, or create versioned duplicate files.
