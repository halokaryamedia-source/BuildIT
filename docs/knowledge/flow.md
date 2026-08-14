# BlockIT Flow

Updated: 2026-08-14

This is the **single detailed current flow**. Root `AGENTS.md` owns task routing.

## 1. Route

```text
REFERENCE PREPARATION → blockbench-reference-generator
ASSET AUTHORING       → named workspace package when persistent → blockit-bedrock-entity-mcp → active specialist only
REPOSITORY WORK       → next-action.md → affected owner → development-brief
LOCAL ACCEPTANCE      → inactive unless next-action.md explicitly reactivates it
```

Hardening never silently continues into image generation. After hardening/verification, **STOP AND REPORT**; generation requires a fresh explicit user instruction.

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
→ VISUAL TARGET + HANDOFF CONSTRAINTS
→ INTERNAL GENERATION BRIEF
→ MINECRAFT-FIRST GEOMETRY + TEXTURE TARGET
→ SOURCE-NEAREST ORTHOGRAPHIC ANCHOR
→ stable/readable POSE + ARTICULATED-FEATURE INTENT
→ FIVE-PREVIEW COVERAGE BOARD
   UPPER: SIDE | FRONT | BACK
   LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
→ PRE-GENERATION READINESS
→ EXECUTION CONSENT GATE
   ├─ no fresh instruction → STOP; WAIT FOR USER
   └─ fresh instruction → ONE CLEAN FIVE-PREVIEW DRAFT
        → labels only by default
        → gate: recognizability
                geometry buildability
                texture usability
                no material contradiction
                readability
        ├─ PASS or minor preview drift → USER APPROVAL
        └─ MATERIAL DEFECT → one board-level correction → still material? NEEDS REVIEW
→ ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
```

Five previews are broad Minecraft modelling evidence, **not five engineering drawings**. Minor curl/angle/contour/overlap/shade/marking drift is acceptable when identity, primary geometry, topology/attachment, buildability, and identity-critical texture information remain clear.

Geometry prioritizes recognizable Blockbench-buildable major form. Texture prioritizes Minecraft-readable palette, material regions, part separation, and identity-critical markings rather than photoreal micro-detail.

Generation budget is per **unchanged Internal Generation Brief / review cycle**: one Draft, at most one targeted correction, zero automatic variants. A materially changed user-approved source/pose/target/requirement starts a new cycle; never start one automatically just to retry.

The Reference Generator still returns **one image only**. Saving an approved reference under a project `workspace/active/<project>/references/` directory is a downstream/local persistence action, not generator output.

## 3. Bedrock Authoring

For persistent work, establish asset continuity without a broad repository scan:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only required reference/assets
→ actual approved reference visible when visual judgement is needed
```

If no persistent package exists and the user wants the work retained, create one compact project package. Do not create manifest JSON, per-Cube plans, checkpoint logs, or duplicate model-version files merely to support continuity.

Then author:

```text
ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
→ VIEW PAIR MAP
→ REFERENCE EVIDENCE MAP
→ DISCREPANCY TRIAGE
   ├─ MINOR → ONE CANONICAL MINECRAFT INTERPRETATION → continue
   └─ MATERIAL → CONFLICTING / BLOCKED
→ SEMANTIC FORM
→ CONSTRUCTION + TRANSFORM OWNERSHIP
→ CONTACT / ATTACHMENT INVARIANTS
→ PRIMARY FORM HYPOTHESIS
→ PRIMARY BLOCKOUT: COARSE CUBES + REQUIRED PRIMARY GROUPS/PIVOTS
→ CANONICAL MODEL VIEWS
→ DIFFERENCE-FIRST REFERENCE ↔ MODEL COMPARISON
→ FAIL | UNVERIFIED | PASS
```

For a minor discrepancy choose consistently: **explicit user requirement → original Source evidence → best-supported approved reference view(s) → simplest recognizable Blockbench-buildable interpretation**. Minor means it does not change identity, primary mass/required count, topology/attachment, important negative space, buildability, or identity-critical texture/material information. Do not average drift.

Use the simplest construction that preserves visible requirements; examples are not presets. **Form/contact/articulation-defining hierarchy may belong in the primary blockout; neutral organization stays downstream.** Professional samples remain learning evidence only.

For local correction:

```text
exact target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

After primary form passes: identity-weighted detail → texture/PBR if required → animation if required → final validation/export. Texture applies the same rule: minor surface drift becomes one Minecraft-readable canonical surface; material texture conflict is not silently averaged.

For a persistent project, persist the current `.bbmodel` and deliberate deliverables at a **meaningful handoff, resume-state change, park, or completion boundary**, not after every mutation/capture. Keep its README limited to one current next step plus real blockers; mutation count alone is not a checkpoint trigger. Git history owns previous revisions. When work is completed or intentionally parked, move the package to `workspace/saved/`.

## 4. Repository Work

```text
AGENTS.md → next-action.md when continuing → affected owner + nearest AGENTS.md
→ development-brief → regression preflight → one smallest coherent patch → minimum useful proof → STOP AND REPORT
```

Repository proof never becomes permission for image generation or local Blockbench execution.

## 5. Evidence / Continuity

```text
ChatGPT → GitHub          = source/docs/static/CI evidence
image-capable preparation = generated-reference visual evidence
Codex local / Blockbench  = installed-client/runtime/model-facing evidence

repository continuation    → next-action.md
active asset continuity    → workspace/active/<project>/README.md
saved asset package        → workspace/saved/<project>/
asset workspace rules      → workspace/README.md
stable facts               → CONTEXT.md
current proof state        → foundation/validation-report.md
current source ownership   → implementation-map.md
local acceptance procedure → operations/local-acceptance-runbook.md only when reactivated
historical rationale       → Git history / GitHub issues and PRs
```

Do not create duplicate roadmap, review index, decision log, flow owner, manifest layer, or parallel workspace-state system.
