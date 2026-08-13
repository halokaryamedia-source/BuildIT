# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

Choose the smallest route before loading context.

### Reference Preparation

For creating/revising the **reference image itself** before Blockbench modelling.

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ assisted intake + internal brief
→ pre-generation readiness
   ├─ READY → generate Draft → visual gate → user approval
   └─ NOT READY → bounded clarification → still material? NEEDS REVIEW
```

Image-capable surface only. **Generation is output, not discovery.** Do not call BlockIT MCP for reference preparation. Detailed sequence: `docs/knowledge/flow.md`; durable policy: `docs/foundation/04-reference-guide.md`.

### Asset Authoring

For Bedrock Entity create/revise/inspect/texture/animate/validate/export work that does not change repository/plugin source.

```text
current request / actual approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, engineering history, activation matrices, or all foundation docs. Tool selection starts from intent + known state, not repository/code search.

Asset authoring is not software **Developing** merely because it changes a model. Reference generation is not repository development. **Do not route it through `development-brief`** unless repository/plugin behavior changes.

### Repository / Plugin Work

For source/docs/tests/CI/MCP/plugin/architecture/maintenance.

```text
this file
→ docs/knowledge/next-action.md when continuing active work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

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

**ChatGPT → GitHub:** repository/source/docs/CI evidence only; never invent Blockbench runtime proof.

**Codex local:** shell/MCP/Blockbench only when the claim requires it; no broad checks by ritual.

Use the cheapest falsifiable evidence. Source/CI proof never upgrades a live visual claim.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`. Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format.

For `mcp/**`, `mcp/AGENTS.md` owns TypeScript/Zod/runtime/registration/result/generated-doc/containment rules.

## Canonical Owners

- task/product flow → `docs/knowledge/flow.md`
- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- product/reference/modelling policy → `docs/foundation/`
- reference image generation → `.agents/skills/blockbench-reference-generator/`
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`
- plugin/runtime → `mcp/`
- repository change contract → `.agents/skills/development-brief/`

Do not recreate retired generic skills or parallel planning/state systems.

## Communication

Keep progress compact: decisions, proof, blockers, one next step.
