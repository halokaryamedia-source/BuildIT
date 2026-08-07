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

- `mcp/`: active Blockbench MCP plugin source, build, UI, server, tools,
  resources, prompts, and generated API documentation.
- `mcp/.agents/skills/`: workspace skill files actually checked into the
  current `Local` branch.
- The long-term canonical home for recovered workspace skills is `Needs
  Validation`; do not create `mcp/workflow/skills/` merely because older docs
  referenced it.
- The Reference Generator policy exists in `docs/foundation/`; its canonical
  Local implementation/skill copy is still being recovered from trusted source
  and repository history.
- `workspace/`: active and saved Blockbench project packages.
- `docs/foundation/`: verified product rules, modelling standards, source
  selection, and validation policy.
- `docs/knowledge/`: working context, decisions, module ownership, reviews,
  operations, and the Obsidian vault.

## Sources Of Truth

- Product and modelling policy: `docs/foundation/README.md` and the relevant
  foundation note.
- Agent behavior and routing: root `AGENTS.md` and the nearest nested
  `AGENTS.md`.
- MCP implementation behavior: `mcp/AGENTS.md`, `mcp/README-INDEX.md`, and
  the relevant source/module code and build/docs manifest.
- Working decisions: `docs/knowledge/decisions/` and the relevant knowledge
  note; current task state: `docs/knowledge/next-action.md` only.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
- Current checked-in workspace skill guidance: `mcp/.agents/skills/`.

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

- Inspect existing callers, helpers, types, patterns, and tests before editing;
  source: `AGENTS.md`, `mcp/AGENTS.md`.
- Keep the smallest correct diff; avoid speculative abstractions and
  dependencies; source: `AGENTS.md`.
- Use Zod at input boundaries and never trust external JSON or MCP input;
  source: `mcp/AGENTS.md`, `mcp/.agents/skills/zod/`.
- Keep Blockbench globals out of build-time schema modules; source:
  `mcp/AGENTS.md`.
- Keep generated output secondary to its source and regenerate it only through
  the documented build flow; source: `mcp/AGENTS.md`.
- Validate changes according to risk and never claim a check was run when it
  was not; source: `AGENTS.md`, `mcp/AGENTS.md`.
- If a required fact, caller, contract, or validation path is unknown, stop and
  mark it `Needs Validation` rather than inventing behavior.
- Distinguish symptoms, causes, new requirements, incorrect data, and platform
  limitations before changing behavior; source: `docs/foundation/00-agent-policy.md`.
- Do not patch without a reproducible or observable cause and a proof path;
  source: `AGENTS.md`, `docs/foundation/00-agent-policy.md`.

## Routing Boundary

This file contains stable facts only. Agent behavior belongs in `AGENTS.md`;
skill triggers and mode routing belong in
`docs/knowledge/skills/activation-matrix.md`.

## Navigation

- Current task: `docs/knowledge/next-action.md`.
- Workspace map: `docs/knowledge/workspace-map.md`.
- MCP map: `mcp/README-INDEX.md`.
- Foundation entrypoint: `docs/foundation/README.md`.
- Obsidian dashboard: `docs/knowledge/index.md`.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
