# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

Choose the smallest route before loading context.

### Reference Preparation

Use when the user wants to create or revise the **reference image itself** before Blockbench modelling.

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ one approved visual Modelling Brief image
```

Run this route only on an image-capable surface. Do **not** load the MCP authoring orchestrator or call BlockIT MCP merely to prepare the reference. After approval, hand the actual image to the modelling route.

### Asset Authoring

Use when the user wants to create, revise, texture, animate, inspect, validate, or export a Minecraft Bedrock Entity asset without changing plugin/repository source.

```text
current request / approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, engineering history, activation matrices, or all foundation docs. Load another owner only when the current decision depends on it.

Normal asset tool selection must **not search repository files/source/docs first**. The BlockIT orchestrator decides from intent + known state, then calls a loaded tool or one precise native `tool_search`. Repository/code search is for actual source/plugin work or reproduced defects.

Asset/reference authoring is not software **Developing** merely because it changes a model/image. Do not route it through `development-brief` unless repository/plugin behavior is being changed.

### Repository / Plugin Work

Use for source/docs/tests/CI/MCP/plugin/architecture/maintenance.

```text
this file
→ docs/knowledge/next-action.md when continuing active work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md for create/change work
→ at most one relevant engineering specialist
```

Named MCP-tool defect: use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before code search; otherwise avoid broad scans.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. `docs/foundation/` policy;
5. `docs/knowledge/next-action.md` active continuation;
6. `CONTEXT.md` stable facts;
7. decision/review history for rationale.

Resolve material conflicts explicitly; never choose a convenient source silently.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before creating another layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures and named assets are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim a check, runtime result, or visual approval that was not obtained.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only. Do not invent Blockbench runtime proof.

**Codex local:** use shell/MCP/Blockbench only when the current claim requires it; do not run broad checks by ritual.

Use the cheapest evidence that can falsify the claim:

- docs/routing → changed owner + relevant diff;
- bounded source → affected contract/caller + targeted gate;
- destructive/public contract → stronger regression proof;
- image/Blockbench/UI/visual claim → direct visual/live evidence;
- local correction → affected state/view only unless it exposes a global issue.

Do not create tests, screenshots, reports, or builds merely to look rigorous. Source/CI proof never upgrades a live visual claim.

Evidence labels, only when materially useful:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) is the retained default. Reference generation creates the approved visual brief; it does not author geometry. Tool success is execution evidence, not visual fidelity. Reference-driven visual judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation requires guessing or repeated failed work.

Reference-image generation belongs to `blockbench-reference-generator`; modelling judgement to `blockbench-bedrock-modelling`; texture/PBR to `blockit-bedrock-texturing`; animation to `blockit-bedrock-animation`. Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format.

For `mcp/**`, `mcp/AGENTS.md` owns the engineering contract: strict TypeScript, Zod boundary validation, runtime-global separation, registration/result rules, generated docs, loopback containment, and dangerous-default quarantine.

## Canonical Owners

- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- product/reference/modelling policy → `docs/foundation/`
- durable rationale → `docs/knowledge/decision-log.md`
- reference image generation → `.agents/skills/blockbench-reference-generator/`
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`
- plugin/runtime → `mcp/` source + proof
- repository change contract → `.agents/skills/development-brief/`

Do not recreate retired generic skills or parallel planning/state systems.

## Communication

Keep progress compact. Report decisions, proof, blockers, and one next step; do not narrate every call.
