# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

Choose the smallest route before loading context.

### Reference Preparation

Use when the user wants to create/revise the **reference image itself** before Blockbench modelling.

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ assisted intake + internal brief
→ pre-generation readiness
   ├─ READY → generate Draft → visual gate → user approval
   └─ NOT READY → bounded clarification → still material? NEEDS REVIEW
```

Run only on an image-capable surface. **Generation is output, not discovery:** do not generate a speculative Draft before material identity/form/buildability are understood. Do not load the MCP authoring orchestrator or call BlockIT MCP just to prepare the reference. After approval, hand the actual image to modelling.

Detailed current sequence: `docs/knowledge/flow.md`. Durable reference policy: `docs/foundation/04-reference-guide.md`.

### Asset Authoring

Use for Minecraft Bedrock Entity create/revise/inspect/texture/animate/validate/export work that does not change repository/plugin source.

```text
current request / actual approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, engineering history, activation matrices, or all foundation docs. Load another owner only when the current decision depends on it.

Normal asset tool selection must **not search repository files/source/docs first**. Route from intent + known state, then call a loaded tool or one precise native `tool_search`. Repository/code search is for source/plugin work or reproduced defects.

Asset authoring is not software **Developing** merely because it changes a model. Reference generation is also not repository development. Do not route it through `development-brief` unless repository/plugin behavior changes.

### Repository / Plugin Work

Use for source/docs/tests/CI/MCP/plugin/architecture/maintenance.

```text
this file
→ docs/knowledge/next-action.md when continuing active work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

Named MCP-tool defect: use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before code search; otherwise avoid broad scans.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. decision/review history for rationale.

Resolve material conflicts explicitly.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures/named assets are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim proof that was not obtained.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only. Do not invent Blockbench runtime proof.

**Codex local:** use shell/MCP/Blockbench only when the claim requires it; do not run broad checks by ritual.

Use the cheapest evidence that can falsify the claim. Source/CI proof never upgrades a live image/Blockbench visual claim. Do not create tests, screenshots, reports, or builds merely to look rigorous.

Evidence labels when useful:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) is the retained default. Reference generation creates the visual brief; it does not author geometry. Tool success is execution evidence, not visual fidelity. Reference-driven judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation requires guessing.

Reference image generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`. Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format.

For `mcp/**`, `mcp/AGENTS.md` owns strict TypeScript/Zod/runtime/registration/result/generated-doc/containment rules.

## Canonical Owners

- task/product flow → `docs/knowledge/flow.md`
- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- product/reference/modelling policy → `docs/foundation/`
- reference image generation → `.agents/skills/blockbench-reference-generator/`
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`
- plugin/runtime → `mcp/` source + proof
- repository change contract → `.agents/skills/development-brief/`

Do not recreate retired generic skills or parallel planning/state systems.

## Communication

Keep progress compact: decisions, proof, blockers, one next step.
