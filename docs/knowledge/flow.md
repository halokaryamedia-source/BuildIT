# BlockIT Flow

Updated: 2026-08-14

This is the **single detailed current flow**. Root `AGENTS.md` owns task routing.

## 1. Route

```text
REFERENCE PREPARATION → blockbench-reference-generator
ASSET AUTHORING       → blockit-bedrock-entity-mcp → active specialist only
REPOSITORY WORK       → next-action.md → affected owner → development-brief
LOCAL ACCEPTANCE      → inactive unless next-action.md explicitly reactivates it
```

A route change matters. Repository/policy hardening never silently continues into image generation. After hardening/verification, **STOP AND REPORT**; reference execution requires a fresh explicit user instruction.

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
→ VISUAL TARGET + NONVISUAL HANDOFF CONSTRAINTS
→ INTERNAL GENERATION BRIEF
→ SOURCE-NEAREST ANCHOR ORIENTATION
→ stable/readable POSE + ARTICULATED-FEATURE STATE when applicable
→ SMALLEST ORTHOGRAPHIC CORE
   → only views needed to constrain missing axes / key structure
   → omit a view if it requires contradictory invention
   → 3/4 is not default initial-core content
→ PRE-GENERATION READINESS
   ├─ NOT READY → clarify once → still material? NEEDS REVIEW; DO NOT GENERATE
   └─ READY → EXECUTION CONSENT GATE
              ├─ no fresh explicit generation instruction → STOP; WAIT FOR USER
              └─ fresh explicit instruction → GENERATE ONE CLEAN CORE DRAFT
                   → panel/view labels only; no title/header/note by default
                   → VISUAL GATE:
                        anchor fidelity
                        orthographic coherence
                        articulation lock
                        support/naturalness
                        construction/readability
                   ├─ PASS → USER APPROVAL
                   └─ MATERIAL DEFECT
                        → one BOARD-LEVEL TARGETED CORRECTION
                        → fresh execution consent again
                        → Source + locked Brief remain authority
                        → regenerate whole shown core; never patch one panel
                        → remove unnecessary conflicting view rather than invent structure
                        → still material? NEEDS REVIEW; STOP
→ ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
```

Grounded load-bearing subjects normally use a stable natural neutral stance without forced bilateral alignment. Identity-critical articulated features keep one visible root/direction-or-bend/terminal state across shown views.

Reference preparation no longer assumes a fixed five-view board. Use the **smallest orthographic core that materially constrains the model**. TOP/BACK are conditional. 3/4 is diagnostic and only added after orthographic coherence or by explicit user request.

Nonvisual scale/height/use facts stay outside image pixels. Durable policy: `docs/foundation/04-reference-guide.md`.

## 3. Bedrock Authoring

```text
ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
→ VIEW PAIR MAP for views actually present
→ REFERENCE EVIDENCE MAP
→ SEMANTIC FORM
→ CONSTRUCTION + TRANSFORM OWNERSHIP
→ CONTACT / ATTACHMENT INVARIANTS
→ PRIMARY FORM HYPOTHESIS
→ PRIMARY BLOCKOUT: COARSE CUBES + REQUIRED PRIMARY GROUPS/PIVOTS
→ CANONICAL MODEL VIEWS
→ CLAIM-LOCKED REFERENCE ↔ MODEL COMPARISON
→ FAIL | UNVERIFIED | PASS
```

Use the simplest construction that preserves visible requirements; examples are not presets. **Form-defining hierarchy may belong in the primary blockout; neutral hierarchy/organization stays downstream.** Professional samples remain learning evidence only.

For local correction:

```text
exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

Only after primary form passes: identity-weighted detail → texture/PBR if required → animation if required → final validation/export.

## 4. Repository Work

```text
AGENTS.md
→ next-action.md when continuing
→ affected owner + nearest AGENTS.md
→ development-brief
→ smallest complete change
→ minimum useful proof
→ STOP AND REPORT
```

Repository proof never becomes permission for image generation or local Blockbench execution.

## 5. Evidence / Continuity

```text
ChatGPT → GitHub          = source/docs/static/CI evidence
image-capable preparation = generated-reference visual evidence
Codex local / Blockbench  = installed-client/runtime/model-facing evidence

current continuation       → next-action.md
stable facts               → CONTEXT.md
current proof state        → foundation/validation-report.md
current source ownership   → implementation-map.md
local acceptance procedure → operations/local-acceptance-runbook.md when reactivated
historical rationale       → Git history / GitHub issues and PRs
```

Do not create duplicate roadmap, review index, decision log, flow owner, or parallel planning state.
