# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires using the fewest safe reads, skills, tools, calls, images, and repair cycles while preserving visual accuracy.

## Authority lock

Use only the current repository and selected asset session. Do not load downloaded project-context ZIPs, copied chat context, or stale prompt packs as workflow authority.

Stop with `LEGACY_SKILL_CONFLICT` if another instruction requires four technical sheets, three approval moments, or numbered `01_*` through `04_*` reference images.

## One-time local build

Run from repository root:

```powershell
cd mcp-blockbench
bun install --frozen-lockfile
bun run skills:check
bun run typecheck
bun test
bun run build
cd ..
```

Load or reload exactly:

```text
mcp-blockbench/dist/mcp.js
```

Do not search for another plugin output.

## Workspace selection

```text
workspace/active/<asset>/
├─ blockbench/   # user-facing model, textures, references, previews
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

Activate one project from `mcp-blockbench/`:

```powershell
bun run workspace -- activate <asset_id>
```

`workspace/workspace.json` is only an index. Runtime authority remains `workspace/active/<asset>/mcp/state.json`.

## Asset startup

1. Read `AGENTS.md`, governance, and active OpenSpec summary.
2. Resolve the selected asset from `workspace/workspace.json`.
3. Read exact model/session paths from `mcp/project.json` and stage state from `mcp/state.json`.
4. Load `blockbench-production` plus exactly one active-stage skill.
5. Open one Blockbench window and the exact canonical model.
6. Run `engines/codex/scripts/sync-local-stack.ps1` using the selected workspace.
7. Continue only when connection report is `PASS` and `dist/mcp.js` exists.
8. Call `get_stage_context` before long contract reads.
9. Verify the exact tool profile.
10. Acquire the write lease using asset ID, absolute session root, project UUID, state revision, and active stage.
11. Begin mutations only after lease acquisition passes.

## Geometry startup

Geometry must use:

```text
get_stage_context
inspect_reference_visual
capture_visual_feedback
analyze_geometry_views
place_cubes_safe / modify_cubes
rotate_cube_about_attachment
record_geometry_visual_result
validate_geometry_contract
verify_geometry_review_ready
```

Do not use `compare_reference_views` as the normal Geometry analyzer. Do not use generic non-zero cube rotations. Do not enter detail while runtime phase is `PRIMARY_FORM`.

Codex must inspect image payloads, then use `analyze_geometry_views` to receive exact failing views, semantic regions, affected parts, direction, magnitude, and recommended repair profile. Change only those parts or stop.

## Exact stage orchestration

| Stage | MCP tool profile | Loaded skills |
| --- | --- | --- |
| Geometry | `BEDROCK_CUBOID_GEOMETRY` | production + Geometry |
| Texture | `BEDROCK_CUBOID_TEXTURE` | production + Texture |
| Animation | `BEDROCK_CUBOID_ANIMATION` | production + Animation |
| Final Validation | `FINAL_VALIDATION_READONLY` | production + Validation |

Maximum loaded production skills: `2`. Do not load Animation when skipped.

A successful stage/profile transition releases the previous lease. Reconnect the existing `blockbench` entry once, call `get_runtime_status`, then reacquire the lease from the new state.

## Completion and reopen

After final approval:

```powershell
cd mcp-blockbench
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
```

To revise later:

```powershell
bun run workspace -- reopen <asset_id> --stage <STAGE> --reason "<reason>"
```

The completed baseline remains immutable while revision is active.

## Stop conditions

Stop on legacy context, reference conflict, missing visual profile, failed fixed-scale diagnosis, unsafe contract rotation, stale evidence, convergence failure, lease/state/profile mismatch, or user review gate. Do not scan ports, create alternate MCP keys, mix workspace areas, load deprecated skills, create duplicate roots, or create versioned outputs.
