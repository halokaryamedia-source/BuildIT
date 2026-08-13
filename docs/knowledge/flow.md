# BlockIT Flow

Updated: 2026-08-13

This is the **single detailed current flow**. Root `AGENTS.md` owns task routing.

## 1. Choose The Route

```text
REFERENCE PREPARATION → blockbench-reference-generator
ASSET AUTHORING       → blockit-bedrock-entity-mcp → active specialist only
REPOSITORY WORK       → next-action.md → affected owner → development-brief
LOCAL ACCEPTANCE      → inactive unless next-action.md explicitly reactivates it
```

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
→ split VISUAL TARGET from NONVISUAL HANDOFF CONSTRAINTS
→ ASSISTED INTAKE
→ INTERNAL GENERATION BRIEF
→ POSE / ARTICULATION LOCK when applicable
→ PRE-GENERATION READINESS
   ├─ NOT READY → clarification → still material? NEEDS REVIEW; DO NOT GENERATE
   └─ READY → GENERATE ONE CLEAN DRAFT
              → view labels only by default
              → VISUAL GATE
              → USER APPROVAL
→ ACTUAL APPROVED REFERENCE IMAGE + relevant HANDOFF CONSTRAINTS
```

For articulated subjects, default to a stable natural neutral stance unless the user explicitly requests another pose. Required limb/appendage count, attachment, support/ground relation, negative spaces, and pose/limb phase must stay consistent across all panels. A dynamic source pose does not automatically become the modelling pose.

Nonvisual facts such as target scale/height stay outside the image by default and are passed in active modelling task context. They are not assumed to persist automatically through image metadata or conversation memory.

Generation is output, not discovery. Durable policy: `docs/foundation/04-reference-guide.md`.

## 3. Bedrock Authoring

```text
ACTUAL APPROVED REFERENCE IMAGE + MATERIAL HANDOFF CONSTRAINTS
→ VIEW PAIR MAP + REFERENCE EVIDENCE MAP
→ SEMANTIC FORM
→ CONSTRUCTION + TRANSFORM OWNERSHIP
→ CONTACT / ATTACHMENT INVARIANTS
→ CROSS-VIEW CONSISTENCY
→ PRIMARY FORM HYPOTHESIS
→ PRIMARY BLOCKOUT: COARSE CUBES + REQUIRED PRIMARY GROUPS/PIVOTS
→ STRUCTURAL OBSERVATION + CANONICAL MODEL VIEWS
→ CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
→ FAIL | UNVERIFIED | PASS
```

Use the simplest construction that preserves the visible requirement. Solid, sheet-like, layered, segmented, and texture-only are reasoning patterns, **not presets**. Shared orientation/contact/attachment/articulation may be Group/Bone transform ownership. Form-defining hierarchy may belong in the primary blockout; neutral organization waits downstream.

For local failure:

```text
exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

Only after primary form passes: **identity-weighted** secondary geometry → texture/PBR if required → animation if required → final validation/export.

Professional samples are learning evidence only; never generic presets or count targets.

## 4. Repository Work

```text
AGENTS.md
→ next-action.md when continuing
→ CONTEXT.md only if stable facts matter
→ implementation-map Hot-Path Defect Index for named MCP defects
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one engineering specialist
→ smallest complete change
→ minimum useful proof
```

## 5. Evidence Boundary

```text
ChatGPT → GitHub          = source/docs/static/CI evidence
image-capable preparation = generated-reference visual evidence
Codex local / Blockbench  = installed-client/runtime/model-facing evidence
```

Source/CI proof never becomes live visual/runtime proof.

## 6. Continuity Owners

```text
current continuation        → next-action.md
stable facts                → CONTEXT.md
current proof state         → foundation/validation-report.md
current source ownership    → implementation-map.md
local acceptance procedure  → operations/local-acceptance-runbook.md only when reactivated
historical rationale        → Git history / GitHub issues and PRs
```

The tiny files that remain under `knowledge/reviews/` and `knowledge/decisions/` are compatibility/regression support only; they are not current product or navigation owners.

Do not create another roadmap, review index, decision log, duplicate flow owner, or parallel planning state.
