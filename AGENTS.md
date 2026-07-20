# Repository Agent Rules

## Start by context

1. Read `CONTEXT-MAP.md` and the glossary for the bounded context being changed.
2. Read `docs/architecture/SYSTEM_FOUNDATION.md` for system modules, seams, and invariants.
3. Read the active bounded OpenSpec change for required outcomes.
4. For new foundation work, use `openspec/changes/buildit-system-foundation/`.
5. Treat `openspec/changes/codex-local-workflow-rework/` as implementation history and current production-flow compatibility authority; do not add unrelated foundation scope to it.
6. For local asset production, start at `engines/codex/BOOTSTRAP.md`.
7. For repository development, start at `engines/codex/DEVELOPMENT_BOOTSTRAP.md`.

## Domain ownership

BuildIT has no single linear authority hierarchy.

| Question | Owner |
| --- | --- |
| What outcome is required? | explicit user instruction and active OpenSpec |
| What is the smallest sufficient slice now? | Ponytail |
| How should repository work be designed and proved? | Engineering Discipline |
| Which source and dependents are relevant? | Code Review Graph, confirmed by current source |
| Which capabilities and models are eligible? | Agent Orchestration Capability Gate and Model Selector |
| What is the active production state? | `workspace/active/<asset>/mcp/state.json` |
| Did the implementation work? | current source, tests, typecheck, build, runtime, and evidence |

No owner may silently take another owner's decision. A scope optimization cannot waive required evidence. A graph result cannot override source. A model selector cannot grant permission.

## Production contracts

- `workspace/workspace.json` selects an Asset; it is not Runtime State.
- `workspace/active/<asset>/mcp/state.json` owns active Runtime State.
- `workspace/active/<asset>/mcp/project.json` owns project identity and canonical paths.
- `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` own stage/tool execution policy.
- `engines/shared/skills/skill-profiles.json` owns skill loading policy.
- `engines/shared/workspace/WORKSPACE_CONTRACT.md` owns workspace lifecycle.
- The approved Reference Package owns asset intent and visual/technical constraints.

## Project config preflight

At the beginning of production, inspect whether optional roles are available. Missing roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED` and use the documented current-session fallback. They do not require a restart during active production.

- The parent performs routine read-only work when a smaller optional route is unavailable.
- The selected Terra route remains the sole writer when `mcp_builder` is unavailable.
- The parent performs bounded visual comparison when `visual_director` is unavailable.
- Critical escalation may stop only when a genuinely critical unresolved decision requires the missing capability.

## Model execution

Follow `engines/codex/MODEL_ROUTING.md`.

```text
Task
→ deterministic Capability Gate
→ Candidate Pool
→ Model Selector
→ fixed permissions and writer identity
→ execution
→ deterministic evidence
```

- The current deterministic selector is the runtime baseline.
- RouteLLM is evaluation-only until ADR 0002 acceptance requirements are met.
- A model selector never grants Blockbench mutation, writer ownership, stage access, or critical eligibility.
- Exactly one active writer exists.
- Keep `agents.max_threads = 2` and `agents.max_depth = 1` until a measured change justifies revision.
- Deterministic validation replaces model judgment whenever it can answer the question.

## Repository development

Use only when changing BuildIT source, tests, documentation, workflow, architecture, or infrastructure.

- Load `engineering-discipline` for engineering method.
- Load `code-review-graph` only as optional context intelligence.
- Classify the Task Kind before selecting the primary domain.
- Use domain modeling when terminology or ownership is unclear.
- For a major interface, design at least two materially different options and compare depth, locality, seam placement, error modes, and testability.
- Prefer the highest stable public seam for tests.
- Source-marker tests do not prove runtime behavior except for generated identity, explicit compatibility markers, or static declarations.
- Keep Standards and Spec review findings separate.
- Repository development may use MCP key `code-review-graph`; normal Blockbench asset production must not use it.
- Repository development loads at most `engineering-discipline` plus `code-review-graph`; production skills remain forbidden.

## Legacy context rejection

- Current bounded contracts override copied chat context, old prompt packs, downloaded project-context ZIPs, and stale skill snapshots.
- Reject workflows requiring four technical sheets, three routine upstream approvals, or numbered `01_*` through `04_*` reference images.
- The approved package uses one Reference Visual plus concise Markdown and executable JSON contracts.
- Stop conflicts with `LEGACY_SKILL_CONFLICT` and identify the stale source.

## One-session production contract

- Geometry → Texture → optional Animation → Final Validation stays in the same MCP and Codex session.
- The next mutating call automatically prepares current-stage ownership; manual lease and identity operations are diagnostic-only.
- `reconnect_required`, `profile_reconnect_required`, and `user_restart_required` remain false during normal stage work.
- Plugin reload is allowed only after installing a newly built binary, not during review, revision, approval, or transition.

## Asset production guardrails

- User-visible Stages are Geometry, Texture, optional Animation, and Final Validation.
- Internal passes and revision scopes are not user gates.
- Stop at each Review Gate for the user's visible decision.
- Geometry uses `BEDROCK_CUBOID_GEOMETRY` for normal work and revisions.
- Geometry decisions require actual image inspection, fixed-scale analysis, and current contract validation.
- Corrections use ranked views, regions, parts, direction, and magnitude; unrelated trial-and-error is forbidden.
- Use `rotate_cube_about_attachment` when the manifest contract accurately describes the attachment.
- Use `apply_cube_transforms` for explicit reference-driven transforms, a missing/ambiguous contract, or one bounded related-part batch.
- Rendered `matrixWorld` geometry is the runtime transform authority when available.
- The canonical session root is `workspace/active/<asset>/mcp`.
- Canonical project creation derives the path, persists the model, synchronizes identity, activates the recorded profile, and prepares current-session ownership.
- Correctly annotated read-only inspection never requires a write lease.
- `rebind_active_project_identity` and `manage_project_write_lease` are diagnostic recovery tools only.
- Current evidence is bound to the active identity, state revision, reference hash, and transformed world-space signature.
- Submission tools own fresh validation, checkpointing, state transition, and lease release.
- Normal production uses MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Never bypass a lease owned by another session.
- Production loads `blockbench-production` plus exactly one active-stage skill; maximum two.
- Keep user assets under `workspace/*/<asset>/blockbench/` and MCP internals under the sibling `mcp/` directory.
- Completed Baselines remain immutable during reopened revisions.

## Acceptance boundaries

### Internal source readiness

Before reporting source readiness, CI-equivalent verification must cover skill synchronization, typecheck, all tests, build, bundle, session continuity, automatic identity/ownership, profile transitions, rendered transforms, and workspace initialization.

### First workstation alpha acceptance

```text
tracked Black Rhinoceros Reference Package
→ fresh workspace with no copied model, checkpoint, evidence, or prior state
→ create through MCP without manual path/identity/profile/lease work
→ build Geometry from zero
→ correct a visible angled part
→ save, close, reopen, and continue
→ submit Geometry review
```

This proves the first local alpha seam only. It does not prove general visual quality or repeatable production readiness.

### Repeatable production readiness

Requires a multi-archetype corpus, full stage/finalization runs, Windows filesystem fault tests, and measured success/correction/cost data as defined in `docs/architecture/FOUNDATION_AUDIT.md` and the foundation tasks.

Do not ask the user to test internal components. Do not claim general readiness from a single Rhino or giraffe flow.

## Root boundaries

- `mcp-blockbench/`: MCP package source, scripts, tests, prompts, and generated output.
- `engines/`: context-specific and shared orchestration.
- `workspace/active/`: current editable Assets.
- `workspace/completed/`: approved Completed Baselines.
- `docs/`: architecture, ADRs, authored guidance, and generated API output.
- `openspec/`: bounded change contracts and decision maps.
- `.agents/`, `.codex/`, `.github/`, `.vscode/`: host adapters and discovery.

Run Bun package commands from `mcp-blockbench/`.

Do not recreate deprecated production skills `blockbench-use`, `blockbench-modeling`, or `blockbench-texturing`. Do not create duplicate source roots, versioned authorities, `new`, `latest`, or `backup` variants. Git history and approved checkpoints store revisions.
