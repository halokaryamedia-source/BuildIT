# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires with the fewest safe reads, image payloads, model calls, and correction cycles while preserving visual accuracy.

## Authority

Use the current repository and selected asset session. Reject downloaded context ZIPs, stale prompt packs, four-sheet workflows, three approval moments, and numbered `01_*`–`04_*` reference images with `LEGACY_SKILL_CONFLICT`.

Read `engines/codex/MODEL_ROUTING.md` before delegation.

## One-time routing preflight

At the start of a new local BuildIT project session, confirm that Codex exposes:

```text
routine_auditor
mcp_builder
visual_director
critical_reviewer
```

If any are missing, stop with:

```text
CODEX_PROJECT_CONFIG_NOT_LOADED
```

Ask the user to trust the current project once. Project-local `.codex/` configuration is not active until trust is granted. Do not invent fallback role definitions.

## Model routing

```text
normal implementation      → Terra Medium parent directly
large read-only audit      → routine_auditor / 5.4 Mini Low
fallback isolated writer   → mcp_builder / Terra Medium
visual judgment            → visual_director / Sol Medium
critical decision          → critical_reviewer / Sol High once
```

- High is the maximum and remains rare.
- Never use Extra High, Max, Ultra, Fast, recursion, or parallel writers.
- Keep at most two open agent threads and depth one.
- Do not spawn a child for micro work.
- Exactly one active writer exists: Terra parent or `mcp_builder`, never both.
- Parent Full access may broaden child sandbox permissions; active-asset safety relies on agent MCP allowlists plus the Blockbench write lease.
- Deterministic gates replace Sol whenever they can answer the question.

## One-time plugin build

After repository source changes:

```powershell
cd mcp-blockbench
bun install --frozen-lockfile
bun run skills:check
bun run typecheck
bun test
bun run build
cd ..
```

Load only `mcp-blockbench/dist/mcp.js`. Reload is required only after the binary changes or the canonical endpoint is genuinely unavailable.

## Workspace

```text
workspace/active/<asset>/
├─ blockbench/   # canonical user-facing files
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

`workspace/workspace.json` is an index. Runtime authority is `workspace/active/<asset>/mcp/state.json`.

## Asset startup

1. Resolve the selected asset, canonical model, and session root.
2. Load `blockbench-production` plus exactly one active-stage skill.
3. Open the canonical model in one Blockbench window.
4. Use MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
5. Call `get_runtime_status`, then `get_stage_context`.
6. Follow `next_safe_operation`.
7. Select one writer before any persistent tool call.
8. Do not ask the user to edit JSON, choose checkpoints, select repair profiles, or select worker models.

## Geometry flow

All Geometry work uses `BEDROCK_CUBOID_GEOMETRY`:

```text
get_stage_context
→ rebind_active_project_identity when required
→ selected writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded Geometry correction
→ final five-view capture/analyze
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ user review
```

`analyze_geometry_views` persists canonical metrics/diff and therefore requires the current Geometry write lease. `capture_visual_feedback` may be used ephemerally without `output_dir` by `visual_director`; persistent captures remain writer operations.

Use `visual_director` once per unchanged Reference Visual hash, only for ambiguous corrections, and once for final visual acceptance. Repairs with concrete part/direction/magnitude stay with Terra.

Geometry evidence is bound to:

- project UUID;
- compatibility Geometry fingerprint;
- transformed world-space signature including group transforms;
- Reference Visual SHA-256;
- current five-view metrics and visual decision.

Hierarchy/group-transform changes require a new capture/analyze pass.

`submit_geometry_for_review` revalidates, creates the next unused non-approved checkpoint, advances state/lease revision, and enters `GEOMETRY_REVIEW` without reconnecting.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles. `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers.

## Stage routing

| Stage | MCP profile | Skills | Writer |
| --- | --- | --- | --- |
| Geometry | `BEDROCK_CUBOID_GEOMETRY` | production + Geometry | selected Terra writer |
| Texture | `BEDROCK_CUBOID_TEXTURE` | production + Texture | selected Terra writer |
| Animation | `BEDROCK_CUBOID_ANIMATION` | production + Animation | selected Terra writer |
| Final Validation | `FINAL_VALIDATION_READONLY` | production + Validation | selected Terra writer for required writes |

Do not load Animation when skipped. Profile changes occur only between user-visible stages.

## Missing-role fallback

- Mini missing: Terra parent performs the audit.
- `mcp_builder` missing: Terra parent may write; non-Terra parent stops before mutation unless an approved Terra writer exists.
- Sol Medium missing: continue deterministic work, then stop with `MODEL_ROUTE_UNAVAILABLE` only when visual judgment is mandatory.
- Sol High missing: return the critical blocker.

## Completion and stop conditions

After final approval, promote the validated workspace through the workspace command. Completed baselines remain immutable while revisions are active.

Stop only for a real authority conflict, unavailable mandatory runtime/capability, unsafe mutation, stale evidence that cannot be regenerated, failed review gate, lease conflict, or required user approval.

Do not scan ports, create alternate MCP keys, mix workspace areas, load deprecated skills, create duplicate/versioned outputs, or ask the user to optimize model selection manually.
