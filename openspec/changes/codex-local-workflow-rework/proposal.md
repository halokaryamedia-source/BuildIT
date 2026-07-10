# Proposal: Codex Local Workflow Rework

## Why

The current local workflow is safe but fragmented across legacy eight-sheet reference requirements, eight production phases, repeated preflight reads, multiple Markdown state files, and approval after every internal phase. This creates avoidable token use, MCP calls, context drift, and user interruptions.

The approved ChatGPT reference package now provides one visual authority plus explicit Geometry, Texturing, Animation, and Validation documents. Local Codex should consume that package directly and focus on producing the correct Blockbench result.

## Goals

- Make local Codex work direct, precise, and reference-driven.
- Reduce routine user approvals to one review after each user-visible stage.
- Keep internal technical passes without interrupting the user.
- Use one machine-readable runtime state.
- Reuse one MCP session and persistent checkpoints.
- Restrict tool/document loading to the active stage.
- Apply the one-issue rule only to revision cycles, not initial construction.
- Preserve strict validation and rollback behavior.

## New User-Visible Stages

1. Geometry
2. Texture
3. Animation, only when required
4. Final Validation

Each completed stage produces previews and waits for user approval or targeted revision instructions.

## Scope

### Included

- Replace legacy eight-sheet intake requirements with the approved reference package format.
- Add a single Codex bootstrap entry point.
- Add a machine-readable session state template.
- Consolidate old eight-phase production into four user-visible stages.
- Keep Main Geometry/Geometry Detailing, UV/Base/Detail Texture, and other technical steps as internal passes.
- Update gates, checklists, handoff rules, and active-project guidance.
- Add safe source-level efficiency improvements where low-risk.

### Not Included in the First Pass

- Replacing the MCP server architecture.
- Adding another MCP endpoint.
- Introducing external agent frameworks.
- Rewriting all existing tools.
- Automatically judging visual similarity with an external vision service.

## Risks

- Existing sessions may still use legacy sheet references and must be migrated explicitly.
- Runtime state and Markdown summaries can drift unless generated from one authority.
- Tool-profile filtering may require later MCP protocol changes.
- Persistent project snapshots may require Blockbench filesystem permission.

## Success Criteria

- A new reference ZIP can start local work without searching for legacy sheets.
- Normal startup reads are limited to bootstrap, state, manifest, Production Context, Reference Visual, and the active-stage document.
- Geometry, Texture, optional Animation, and Final Validation each have one review gate.
- No approval is requested between internal passes.
- Initial builds support bounded batches; revisions remain local.
- Stage output always contains the required preview evidence.
- Final validation returns PASS, REVISION_REQUIRED, or BLOCKER with evidence.
