# BlockIT Flow

Updated: 2026-08-13

This is the **single detailed current flow** for BlockIT. Root `AGENTS.md` owns task routing; this file owns the readable sequence. Other entrypoints should link here instead of repeating the whole flow.

## 1. Choose The Route

```text
USER REQUEST
│
├─ REFERENCE PREPARATION
│  create/revise the visual target before modelling
│  → blockbench-reference-generator
│
├─ ASSET AUTHORING
│  create/revise/inspect/texture/animate/export a Bedrock Entity
│  → blockit-bedrock-entity-mcp
│  → only the active domain specialist
│
├─ REPOSITORY / PLUGIN WORK
│  source/docs/tests/CI/MCP/plugin maintenance
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

The reference path must finish understanding **before** image generation.

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
material identity + visible form + required views + buildable interpretation understood?
├─ NOT READY
│  → use remaining clarification allowance
│  → still material? NEEDS REVIEW
│  → DO NOT GENERATE
│
└─ READY
   ↓
   GENERATE ONE MODELLING BRIEF DRAFT
   ↓
   VISUAL GATE
   ├─ concrete visual defect → maximum one targeted correction
   └─ no material defect → continue
   ↓
   USER APPROVAL
   ↓
   ACTUAL APPROVED REFERENCE IMAGE
```

Rules that keep this path simple:

- **generation is output, not discovery**;
- zero clarification is preferred;
- do not force optional values to exist;
- do not invent numeric scale, hidden features, unseen asymmetry, or unseen attachments;
- do not use the correction pass to fix missing pre-generation understanding;
- after one bounded clarification round, unresolved material ambiguity becomes `NEEDS REVIEW`.

Detailed generation behavior lives only in `.agents/skills/blockbench-reference-generator/SKILL.md`; durable policy lives in `docs/foundation/04-reference-guide.md`.

## 3. Post-Approval Bedrock Authoring

Only an **actual approved reference image** enters reference-driven modelling.

```text
ACTUAL APPROVED REFERENCE IMAGE
↓
VIEW PAIR MAP + REFERENCE EVIDENCE MAP
↓
SEMANTIC FORM
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE when supplied
↓
PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY CUBES / GROUPS
↓
STRUCTURAL OBSERVATION + CANONICAL MODEL VIEWS
↓
CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
↓
FAIL | UNVERIFIED | PASS
```

If the failure is **global**, revise Semantic Form / Primary Form Hypothesis instead of preserving a bad scaffold.

If the failure is **local**:

```text
reuse / inspect exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected paired evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

`UNCHANGED`/`REGRESSED` is not progress. Do not stack compensating patches.

Only after primary form passes:

```text
secondary geometry / hierarchy / pivots
→ texture/PBR when required
→ animation when required
→ final validation
→ .bbmodel / Bedrock geometry export
```

Tool success is execution evidence, not visual approval.

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
- Blockbench runtime/API/UI/Undo/Canvas → `blockbench-runtime-development`
- Bedrock modelling/reference judgement policy → `blockbench-bedrock-modelling`
- TypeScript type system → `typescript-type-safety`
- Bun build/package/tooling → `bun-tooling`

## 5. Evidence Boundary

```text
ChatGPT → GitHub
= source/docs/static/CI evidence

image-capable reference preparation
= generated-reference visual evidence

Codex local / Blockbench
= installed-client/runtime/model-facing evidence
```

Source/CI proof never becomes live Blockbench or visual proof.

## 6. Continuity Owners

```text
current continuation        → next-action.md
stable facts                → CONTEXT.md
current proof state         → foundation/validation-report.md
current source ownership    → implementation-map.md
future/non-active work      → operations/task-board.md
durable reason              → decision-log / decision note
historical evidence meaning → reviews/review-graph.md
```

Do not create another roadmap or duplicate flow owner.

## Related

- [Next Action](next-action.md)
- [Minimal Navigation](minimal-nav.md)
- [Skill Activation Matrix](skills/activation-matrix.md)
- [Reference Guide](../foundation/04-reference-guide.md)
- [Validation Report](../foundation/validation-report.md)
