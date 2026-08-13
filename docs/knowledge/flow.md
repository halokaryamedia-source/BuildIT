# BlockIT Flow

Updated: 2026-08-13

This is the **single detailed current flow** for BlockIT. Root `AGENTS.md` owns task routing; this file owns the readable sequence.

## 1. Choose The Route

```text
USER REQUEST
│
├─ REFERENCE PREPARATION
│  → blockbench-reference-generator
│
├─ ASSET AUTHORING
│  → blockit-bedrock-entity-mcp
│  → only the active domain specialist
│
├─ REPOSITORY / PLUGIN WORK
│  → next-action.md when continuing current work
│  → affected owner
│  → development-brief
│  → at most one useful engineering specialist
│
└─ LOCAL ACCEPTANCE
   inactive unless next-action.md explicitly reactivates it
   → operations/local-acceptance-runbook.md
```

Reference preparation is not MCP authoring. Asset authoring is not repository development merely because a `.bbmodel` changes.

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
↓
ASSISTED INTAKE
- explicit user fact → preserve
- clear visible fact → resolve from image
- optional unknown → leave unset
- material ambiguity → one compact clarification round
↓
INTERNAL GENERATION BRIEF
↓
PRE-GENERATION READINESS
├─ NOT READY → clarification → still material? NEEDS REVIEW
└─ READY → GENERATE ONE DRAFT → VISUAL GATE → USER APPROVAL
↓
ACTUAL APPROVED REFERENCE IMAGE
```

Generation is output, not discovery. Detailed generation behavior lives in `.agents/skills/blockbench-reference-generator/SKILL.md`; durable policy lives in `docs/foundation/04-reference-guide.md`.

## 3. Post-Approval Bedrock Authoring

```text
ACTUAL APPROVED REFERENCE IMAGE
↓
VIEW PAIR MAP + REFERENCE EVIDENCE MAP
↓
SEMANTIC FORM
↓
CONSTRUCTION + TRANSFORM OWNERSHIP
↓
CROSS-VIEW CONSISTENCY
↓
PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY CUBES + REQUIRED PRIMARY GROUPS/PIVOTS
↓
STRUCTURAL OBSERVATION + CANONICAL MODEL VIEWS
↓
CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
↓
FAIL | UNVERIFIED | PASS
```

Use the simplest construction that preserves the visible requirement. Solid, sheet-like, layered, segmented, and texture-only are reasoning patterns, not presets/classes. Shared semantic orientation/attachment/articulation belongs to Group/Bone ownership when appropriate.

If failure is global, revise Semantic Form / Primary Form Hypothesis. If failure is local:

```text
reuse / inspect exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected paired evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

`UNCHANGED`/`REGRESSED` is not progress.

Only after primary form passes:

```text
identity-weighted secondary geometry / neutral organization
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

Professional samples are **learning evidence only**. Their anatomy, counts, naming, rotations, UV coordinates, hierarchy depth, or complexity never become runtime presets or generic modelling laws.

## 4. Repository / Plugin Work

```text
AGENTS.md
→ next-action.md when continuing current work
→ CONTEXT.md only if stable facts matter
→ named MCP-tool defect? implementation-map Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one useful engineering specialist
→ smallest complete change
→ minimum useful proof
```

Owner selection:

- MCP public/input/result/registration/transport → `mcp-server-development`
- Blockbench runtime/API/UI/Undo → `blockbench-runtime-development`
- Bedrock modelling/reference judgement → `blockbench-bedrock-modelling`
- TypeScript → `typescript-type-safety`
- Bun build/package/tooling → `bun-tooling`

## 5. Evidence Boundary

```text
ChatGPT → GitHub              = source/docs/static/CI evidence
image-capable preparation     = generated-reference visual evidence
Codex local / Blockbench      = installed-client/runtime/model-facing evidence
```

Source/CI proof never becomes live Blockbench or visual proof.

## 6. Continuity Owners

```text
current continuation        → next-action.md
stable facts                → CONTEXT.md
current proof state         → foundation/validation-report.md
current source ownership    → implementation-map.md
local acceptance procedure  → operations/local-acceptance-runbook.md only when reactivated
historical rationale        → Git history / GitHub issues and PRs
```

Files retained under `knowledge/reviews/`, `knowledge/decisions/`, or `knowledge/skills/` solely for regression compatibility are **test-support only**, not current product/navigation owners.

Do not create another roadmap, review index, decision log, duplicate flow owner, or parallel planning state.

## Related

- [Next Action](next-action.md)
- [Implementation Map](implementation-map.md)
- [Reference Guide](../foundation/04-reference-guide.md)
- [Geometry Standard](../foundation/05-geometry-standard.md)
- [Validation Report](../foundation/validation-report.md)
