# BlockIT Flow

Updated: 2026-08-13

Root `AGENTS.md` is the canonical routing owner. This note is the compact current flow for humans/agents; it does not create another planning layer.

## 1. Classify The Task First

```text
USER REQUEST
│
├─ REFERENCE PREPARATION
│  source image / user intent
│  → blockbench-reference-generator
│  → one buildable multi-view Modelling Brief image
│  → maximum one targeted correction
│  → user approval
│
├─ ASSET AUTHORING
│  current request + actual approved reference image
│  → blockit-bedrock-entity-mcp
│  → only active modelling/texturing/animation specialist
│  → minimum useful MCP evidence
│
├─ REPOSITORY / PLUGIN CHANGE
│  AGENTS.md
│  → next-action.md when continuing current work
│  → CONTEXT.md only when stable facts matter
│  → affected owner
│  → development-brief
│  → at most one useful engineering specialist
│  → smallest complete change
│  → minimum useful proof
│
└─ LOCAL ACCEPTANCE
   inactive by default
   → only when next-action.md explicitly reactivates it
   → operations/local-acceptance-runbook.md
```

Reference preparation is not MCP authoring. Asset authoring is not repository development merely because a `.bbmodel` changes.

## 2. Canonical Product Flow

```text
SOURCE IMAGE / USER INTENT
→ REFERENCE GENERATOR
→ MODELLING BRIEF DRAFT
→ USER APPROVAL
→ ACTUAL APPROVED REFERENCE IMAGE
→ VIEW PAIR MAP
→ REFERENCE EVIDENCE MAP
→ SEMANTIC FORM
→ CROSS-VIEW CONSISTENCY
→ COORDINATE FRAME + TARGET ENVELOPE when supplied
→ PRIMARY FORM HYPOTHESIS
→ COARSE PRIMARY CUBES/GROUPS
→ STRUCTURAL OBSERVATION when relevant
→ CANONICAL MODEL VIEWS
→ CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
→ FAIL | UNVERIFIED | PASS

IF GLOBAL FAILURE
→ revise Semantic Form / Primary Form Hypothesis

IF LOCAL FAILURE
→ reuse/inspect exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected paired evidence
→ IMPROVED | UNCHANGED | REGRESSED

only after primary form passes
→ secondary geometry / hierarchy / pivots
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

`UNCHANGED`/`REGRESSED` is not modelling progress. Do not stack compensating patches. Tool success is execution evidence, not visual approval.

## 3. Repository-development Owner Selection

- MCP public/input/result/registration/transport contract → `mcp-server-development`
- Blockbench runtime/API/UI/Undo/Canvas mechanics → `blockbench-runtime-development`
- Bedrock model/reference judgement policy → `blockbench-bedrock-modelling`
- TypeScript type-system issue → `typescript-type-safety`
- Bun build/tooling/dependency issue → `bun-tooling`

Do not stack specialists because one file contains multiple technologies.

## 4. Evidence Boundary

```text
ChatGPT → GitHub
= source/docs/static/CI evidence

image-capable reference preparation
= generated reference visual evidence

Codex local / Blockbench
= installed-client/runtime/model-facing evidence
```

Source/CI proof never becomes live Blockbench or visual proof.

Evidence labels when material:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## 5. Continuity Owners

Update only the owner whose state changed:

```text
current continuation       → next-action.md
stable facts               → CONTEXT.md
current proof state        → foundation/validation-report.md
current source ownership   → implementation-map.md
future/non-active work     → operations/task-board.md
durable reason             → decision-log / decision note
historical evidence meaning→ reviews/review-graph.md
```

Chat history and old plans are not task trackers.

## Related

- [Knowledge Dashboard](index.md)
- [Next Action](next-action.md)
- [Minimal Navigation](minimal-nav.md)
- [Skill Activation Matrix](skills/activation-matrix.md)
- [Validation Report](../foundation/validation-report.md)
