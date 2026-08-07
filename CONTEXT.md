# MCP-Blockbench Workspace Context

This is the stable context for the BlockIT/MCP-Blockbench workspace. Read this
before opening detailed project notes. Keep this file factual and under roughly
1,500 words.

Last verified: 2026-08-08
Stability: stable
Owner: workspace agent

## Purpose

This workspace develops a Blockbench MCP plugin and the supporting workflow for
AI-assisted Minecraft Bedrock modelling and MCP engineering.

The primary product goal is to produce a Blockbench Model that follows the
Model Reference with the shortest evidence-backed workflow. The product is
object-agnostic: test fixtures and samples may validate the workflow but must
never become object-specific runtime rules.

Efficiency means one useful primary geometry pass, one structural check, and a
bounded visual review; it never means accepting guessed geometry, tool success,
or a valid file as proof of resemblance.

## Development Model

BlockIT is developed through two complementary execution channels:

- **ChatGPT → GitHub:** design, repository inspection, documentation/source
  changes, and preparation for local proof.
- **Codex local from repository root `BuildIT`:** final targeted shell/build/MCP/
  Blockbench proof when the claim requires the local environment.

The task goal, scope, Build POV, Acceptance POV, and acceptance criteria remain
the same across both channels. Only the available proof changes.

The repository—not chat history—is the project memory. New sessions resume from
`AGENTS.md`, this file, and `docs/knowledge/next-action.md`.

## Language

**Requested Dimensions**:
Approximate size supplied by the user before the Model Reference is created.
_Avoid_: final dimensions, geometry units

**Source Image**:
The original image supplied by the user.
_Avoid_: reference, Model Reference

**Model Reference Draft**:
The single generated five-view image before user approval.
_Avoid_: provisional reference, canonical reference

**Model Reference**:
The user-approved five-view image that is the authority for visible shape and
proportion.
_Avoid_: Source Image, blueprint

**Cube Draft**:
The first editable cube geometry created by MCP from a Ready Reference Package.
_Avoid_: final geometry, automatic approval, cuboid candidate

**Blockbench Model**:
The `.bbmodel` project created and reviewed in Blockbench.
_Avoid_: Cube Draft

**Reference Package**:
The folder containing the Model Reference, metadata, and Source Image.
_Avoid_: model version, reference variant

**Reference Generator**:
The stage that starts with the Source Image and ends with one Ready Reference
Package. It owns five-view generation, Model Reference handoff, and package
validation.
_Avoid_: cube authoring, Blockbench modelling

**MCP Modelling**:
The stage that starts from one Ready Reference Package, creates and corrects
the Cube Draft in Blockbench, and produces the reviewed Blockbench Model.
_Avoid_: Source Image processing

**Draft**:
The user-facing status before approval. Internally this is `NEEDS_REVIEW`.
_Avoid_: provisional, almost ready

**Final Geometry Dimensions**:
The height, width, and length supplied as the target for Blockbench geometry.
_Avoid_: requested dimensions, texture size

## Stable Structure

- `.agents/skills/`: repository-wide skills available from root `BuildIT`.
  `development-brief` is canonical here.
- `mcp/`: active Blockbench MCP plugin source, build, UI, server, tools,
  resources, prompts, and generated API documentation.
- `mcp/.agents/skills/`: current MCP/module specialist skill copies pending the
  one-by-one naming, overlap, and location audit. They are not yet the canonical
  project-wide skill location.
- The old `mcp/workflow/skills/` path is not current structure and must not be
  recreated merely to satisfy stale documentation.
- The Reference Generator policy exists in `docs/foundation/`; its canonical
  Local implementation/skill copy is still being recovered from trusted source
  and repository history.
- `workspace/`: active and saved Blockbench project packages.
- `docs/foundation/`: product rules, modelling standards, source selection, and
  validation policy.
- `docs/knowledge/`: project continuity, working decisions, maps, reviews,
  operations, and navigation.

## Sources Of Truth

- Current task intent: current user instruction.
- Product and modelling policy: `docs/foundation/README.md` and the relevant
  foundation note.
- Agent behavior and routing: root `AGENTS.md` and the nearest nested
  `AGENTS.md`.
- MCP implementation behavior: `mcp/AGENTS.md`, `mcp/README.md`, and the
  relevant source/module code and build/docs manifest.
- Active task/continuation state: `docs/knowledge/next-action.md` only.
- Durable working decisions/reasons: `docs/knowledge/decision-log.md` and the
  relevant decision owner.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
- Repository-wide skill guidance: `.agents/skills/`.
- MCP specialist skill copies pending audit: `mcp/.agents/skills/`.

When sources disagree, do not guess. Identify the conflict and mark it
`Needs Validation`.

## MCP Architecture

The plugin entrypoint wires the MCP server, UI, settings, and lifecycle. The
server exposes tools, resources, and prompts. Tool implementations live under
`mcp/server/tools/`; shared factories, schemas, runtime state, and transport
helpers live under `mcp/lib/` and `mcp/server/`. Tool schemas and documentation
are aggregated through the build docs manifest and generated outside
Blockbench, so schema construction must not depend on Blockbench runtime
globals. Runtime-only validation belongs inside tool execution.

## Engineering Invariants

- Inspect existing callers, helpers, types, patterns, and relevant tests before
  editing shared behavior.
- Keep the smallest correct diff; avoid speculative abstractions/dependencies.
- Use Zod at input boundaries and never trust external JSON or MCP input.
- Keep Blockbench globals out of build-time schema modules.
- Keep generated output secondary to source and regenerate only through the
  documented build flow.
- Use the minimum useful proof for the risk and execution channel; never claim
  a check was run when it was not.
- If a required fact, caller, contract, or proof path is unknown, use `Needs
  Validation` rather than inventing behavior.
- Distinguish symptom, cause, requirement, incorrect data, and platform
  limitation before changing behavior.
- Do not patch without an observable cause and a proof path.

## Routing Boundary

This file contains stable facts only. Agent behavior belongs in `AGENTS.md`;
skill triggers and mode routing belong in
`docs/knowledge/skills/activation-matrix.md`.

## Navigation

- Current task: `docs/knowledge/next-action.md`.
- Workspace map: `docs/knowledge/workspace-map.md`.
- MCP map: `mcp/README.md`.
- Foundation entrypoint: `docs/foundation/README.md`.
- Knowledge dashboard: `docs/knowledge/index.md`.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
